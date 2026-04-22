# Plan: S3-backed Project Cards

**Goal:** Replace GitHub raw URL + local cache fallback with AWS S3 as the single source of truth
for `project_card.json` and thumbnail assets. Portfolio stores only a project slug; all metadata
and images come from S3.

**Why:** GitHub raw URLs break for private repos, are branch-coupled, and require a committed
cache fallback that bloats the portfolio repo over time.

---

## Architecture Decision Record

| Decision | Choice | Rationale |
|---|---|---|
| S3 vs CloudFront | S3 direct URLs (no CloudFront) | Portfolio has ≤20 projects; S3 latency (~50–150 ms) is acceptable. Add CloudFront later if needed |
| Public vs signed URLs | Public read bucket | Portfolio cards are public data; signing adds latency and complexity with no benefit |
| AWS SDK in Next.js | No SDK — plain `fetch()` | Public bucket needs no auth. No extra dependency |
| Thumbnail in JSON | Full S3 URL stored in `thumbnail` field | Skill sets absolute URL before upload; `resolveCard()` becomes a no-op |
| Cache fallback | Remove entirely | S3 has 99.99% availability; a cache that can silently serve stale data is worse than a visible outage |
| Vercel env vars | `NEXT_PUBLIC_S3_BASE_URL` | One env var for the base; changing bucket/region only needs an env update |

---

## S3 Structure

```
darshil-portfolio-cards/           ← bucket name (create in us-east-1 for lowest latency from Vercel)
  projects/
    icc-rankings/
      project_card.json
      thumbnail.png                ← whatever extension the screenshot is
    future-project/
      project_card.json
      thumbnail.png
```

**Bucket policy:** Public `s3:GetObject` on `projects/*`. No public list.

---

## Phase 1 — S3 Bucket Setup

**Do once, manually in AWS Console or CLI.**

### 1a. Create bucket

```bash
aws s3api create-bucket \
  --bucket darshil-portfolio-cards \
  --region us-east-1

# Disable "Block all public access" (needed for public read)
aws s3api put-public-access-block \
  --bucket darshil-portfolio-cards \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### 1b. Attach public read policy

```bash
aws s3api put-bucket-policy \
  --bucket darshil-portfolio-cards \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "PublicReadProjects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::darshil-portfolio-cards/projects/*"
    }]
  }'
```

### 1c. Create IAM user for uploads (skill + local CLI use)

In AWS Console: IAM → Users → Create user `portfolio-card-uploader`
- Attach inline policy: `s3:PutObject` on `arn:aws:s3:::darshil-portfolio-cards/projects/*`
- Generate access key → save to `~/.aws/credentials` as profile `portfolio-uploader`

### 1d. Verify

```bash
# Upload a test file
echo '{"test":1}' | aws s3 cp - s3://darshil-portfolio-cards/projects/test/test.json \
  --profile portfolio-uploader

# Fetch without credentials (must succeed = public)
curl -f https://darshil-portfolio-cards.s3.amazonaws.com/projects/test/test.json

# Cleanup
aws s3 rm s3://darshil-portfolio-cards/projects/test/test.json --profile portfolio-uploader
```

**Verification checklist:**
- [ ] `curl` returns JSON without auth
- [ ] `aws s3 ls s3://darshil-portfolio-cards/projects/` fails (no public list)
- [ ] IAM user cannot access other S3 buckets

---

## Phase 2 — Portfolio Website Code Changes

**Files to modify:**
- `src/data/projectCards.ts` (main logic change)
- `src/data/cache/icc-rankings.json` (delete)
- Add env var `NEXT_PUBLIC_S3_BASE_URL` in Vercel + `.env.local`

### 2a. New `projectCards.ts`

Replace entire file content:

```typescript
import type { ProjectCard } from "@/types/project";

/**
 * Slugs of projects stored in S3. Add a slug here to include in the portfolio.
 * Ordering determines display order (featured cards sorted first automatically).
 */
const PROJECT_SLUGS: string[] = ["icc-rankings"];

const S3_BASE =
  process.env.NEXT_PUBLIC_S3_BASE_URL ??
  "https://darshil-portfolio-cards.s3.amazonaws.com";

function cardUrl(slug: string): string {
  return `${S3_BASE}/projects/${slug}/project_card.json`;
}

async function fetchCard(slug: string): Promise<ProjectCard | null> {
  try {
    const res = await fetch(cardUrl(slug), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`S3 ${res.status} for ${slug}`);
    return (await res.json()) as ProjectCard;
  } catch (err) {
    console.error(`[projectCards] failed to fetch ${slug}:`, err);
    return null;
  }
}

/** Fetches all project cards from S3 at build time. */
export async function getAllProjectCards(): Promise<ProjectCard[]> {
  const results = await Promise.all(PROJECT_SLUGS.map(fetchCard));
  const cards = results.filter((c): c is ProjectCard => c !== null);
  return cards.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

export { PROJECT_SLUGS, cardUrl };
```

**Key changes vs current:**
- No `rawUrl()`, no `readCachedCard()`, no `resolveCard()` — thumbnail is now an absolute S3 URL
- No `fs`/`path` imports (no file system reads)
- `PROJECT_REPOS` → `PROJECT_SLUGS` (rename for clarity)
- Exports `cardUrl` instead of `rawUrl` (update any callers)

### 2b. Check for callers of `rawUrl` and `PROJECT_REPOS`

```bash
grep -r "rawUrl\|PROJECT_REPOS" apps/web/src/
```

Update any found references to use `cardUrl` / `PROJECT_SLUGS`.

### 2c. Remove cache directory

```bash
rm -rf src/data/cache/
```

Also remove any `.gitkeep` or similar if present.

### 2d. Add env var

**`.env.local`** (for local dev):
```
NEXT_PUBLIC_S3_BASE_URL=https://darshil-portfolio-cards.s3.amazonaws.com
```

**Vercel dashboard:** Settings → Environment Variables → add `NEXT_PUBLIC_S3_BASE_URL`
with value `https://darshil-portfolio-cards.s3.amazonaws.com` for Production + Preview.

### 2e. Verification checklist

```bash
# Type-check passes
npm run type-check   # inside apps/web/

# Lint passes
npm run lint:web

# No remaining references to old GitHub raw URL pattern
grep -r "raw.githubusercontent" apps/web/src/

# No remaining references to cache
grep -r "src/data/cache" apps/web/src/
```

---

## Phase 3 — Update `make-project-card` Skill

**File:** `~/.claude/skills/make-project-card.md`

Add a new final step to the skill after `project_card.json` is written:

### Step: Set thumbnail to absolute S3 URL

Before uploading, patch the `thumbnail` field in `project_card.json` to the full S3 URL:

```bash
# Determine thumbnail extension from the local file
THUMB_FILE=$(cat project_card.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('thumbnail',''))")
THUMB_EXT="${THUMB_FILE##*.}"
SLUG=$(cat project_card.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['id'])")
S3_THUMB_URL="https://darshil-portfolio-cards.s3.amazonaws.com/projects/${SLUG}/thumbnail.${THUMB_EXT}"

# Patch thumbnail field in-place
python3 -c "
import sys, json
with open('project_card.json') as f: d = json.load(f)
d['thumbnail'] = '${S3_THUMB_URL}'
with open('project_card.json', 'w') as f: json.dump(d, f, indent=2)
"
```

### Step: Upload to S3

```bash
# Upload thumbnail (source path comes from the original relative thumbnail field, before patching)
aws s3 cp "${THUMB_FILE}" "s3://darshil-portfolio-cards/projects/${SLUG}/thumbnail.${THUMB_EXT}" \
  --profile portfolio-uploader \
  --content-type "image/png"

# Upload project_card.json
aws s3 cp project_card.json "s3://darshil-portfolio-cards/projects/${SLUG}/project_card.json" \
  --profile portfolio-uploader \
  --content-type "application/json" \
  --cache-control "max-age=3600"
```

**Skill section to add:** After "Finalize JSON" step, add "Upload to S3" step. Keep the local
`project_card.json` file in the repo — it's still the source of truth for version control.
S3 is the serving layer, not a replacement for the file.

### Skill verification checklist:
- [ ] `thumbnail` field in `project_card.json` is a full HTTPS S3 URL after skill runs
- [ ] `curl -f {s3_thumbnail_url}` returns the image
- [ ] `curl -f {s3_card_url}` returns the JSON with correct `thumbnail` field

---

## Phase 4 — Migrate Existing Data

**One-time migration for icc-rankings.**

```bash
cd /path/to/icc-rankings

# The thumbnail is currently "docs/icc-rankings-homepage.png" (relative)
# Upload thumbnail first
aws s3 cp docs/icc-rankings-homepage.png \
  s3://darshil-portfolio-cards/projects/icc-rankings/thumbnail.png \
  --profile portfolio-uploader \
  --content-type "image/png"

# Patch thumbnail in project_card.json to absolute S3 URL
python3 -c "
import json
with open('project_card.json') as f: d = json.load(f)
d['thumbnail'] = 'https://darshil-portfolio-cards.s3.amazonaws.com/projects/icc-rankings/thumbnail.png'
with open('project_card.json', 'w') as f: json.dump(d, f, indent=2)
"

# Upload project_card.json
aws s3 cp project_card.json \
  s3://darshil-portfolio-cards/projects/icc-rankings/project_card.json \
  --profile portfolio-uploader \
  --content-type "application/json" \
  --cache-control "max-age=3600"

# Verify
curl -f https://darshil-portfolio-cards.s3.amazonaws.com/projects/icc-rankings/project_card.json | python3 -m json.tool
curl -sI https://darshil-portfolio-cards.s3.amazonaws.com/projects/icc-rankings/thumbnail.png | head -5

# Commit the updated project_card.json (thumbnail now has absolute S3 URL)
git add project_card.json && git commit -m "chore: update thumbnail to S3 URL"
git push
```

---

## Phase 5 — Deploy and Verify

1. Merge portfolio_website changes → triggers Vercel deploy
2. Visit live portfolio → confirm icc-rankings card renders with thumbnail
3. Check browser network tab: thumbnail src should be `*.s3.amazonaws.com/*`
4. Check Vercel build logs: no `[projectCards] failed to fetch` errors
5. Verify no GitHub raw URLs remain in network tab

**Rollback plan:** If S3 fetch fails, temporarily add the cache file back and revert
`projectCards.ts` to the old GitHub fetch logic. S3 issue should be diagnosable within minutes.

---

## Phase 6 — Cleanup

After confirming production is healthy:

```bash
# In portfolio_website repo
git rm -r src/data/cache/
git commit -m "chore: remove local project card cache (replaced by S3)"
git push
```

Also remove the export `rawUrl` from any places it was re-exported (grep for it first).

---

## Adding Future Projects (Post-Migration)

1. In the project's repo, run `/make-project-card` — it will write and upload to S3 automatically.
2. In `portfolio_website/src/data/projectCards.ts`, add the slug to `PROJECT_SLUGS`.
3. That's it. No cache file needed. No GitHub URL needed.

---

## Out of Scope (deliberate)

- **CloudFront CDN**: Not needed for ≤20 projects. Add if thumbnail load time is perceptible.
- **S3 versioning**: Nice-to-have but adds cost. Use git history on `project_card.json` instead.
- **Private projects**: If a project is confidential, set `status: "confidential"` in card and
  still serve from S3. The card metadata is public by design; sensitive repos stay private on GitHub.
