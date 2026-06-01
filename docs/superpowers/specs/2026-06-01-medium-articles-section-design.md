# Articles Section — Medium RSS Integration

**Date:** 2026-06-01
**Status:** Approved for planning

## Goal

Add an `Articles` section to the portfolio homepage that automatically lists the user's Medium posts. New posts must appear on the site without manual code changes or deploys.

## Scope

- Show the user's latest Medium posts (up to 10, the RSS feed limit) on the homepage, below `Projects`.
- Each post is a card with cover image, date, read-time estimate, title, snippet, and tags.
- Card grid uses the same horizontal-scroll UX as `Projects` (arrows on desktop, dot pagination + scroll-hint nudge on mobile).
- Add an `Articles` link to the navbar between `Projects` and `Experience`.

## Out of scope

- Popularity-based ordering (claps / reads). Medium's RSS does not expose these; the unofficial GraphQL is unreliable. Order by `pubDate` descending.
- Persisting posts past the RSS feed's 10-item cap. Revisit when the user crosses 10 posts.
- Featured / pinned posts. Add later only if needed.
- A dedicated `/articles/[slug]` route. Cards link out to Medium in a new tab.
- Mirroring article content into the portfolio (the post body lives on Medium).

## Data source

- Feed URL: `https://medium.com/feed/@kapadiadarshil25`
- Fetched server-side in a React Server Component.
- Cache via Next's `fetch(url, { next: { revalidate: 3600 } })` — at most one Medium request per hour, per Vercel deployment region.
- Failure mode: any fetch / parse error → log to server console and render nothing. The page must not break.

## Data shape

```ts
// src/types/article.ts
export interface Article {
  id: string;          // Medium guid (stable across rebuilds)
  title: string;
  link: string;        // canonical Medium URL (strip `?source=…` query)
  isoDate: string;     // pubDate as ISO 8601
  snippet: string;     // ~160 char plain-text extract from content:encoded
  coverImage?: string; // first <img src> from content:encoded, if present
  tags: string[];      // from <category> elements; lowercase, deduped
  readMinutes: number; // estimated from word count of content:encoded at 220 wpm, min 1
}
```

## Architecture

```
page.tsx
  └── <Articles />                 (RSC; calls fetchArticles)
        └── <ArticlesScroller>     ("use client"; reuses Projects scroll UX)
              └── <ArticleCard />  (one per Article)
```

### Files added

| File | Purpose |
|---|---|
| `src/types/article.ts` | `Article` interface |
| `src/lib/medium.ts` | `fetchArticles(): Promise<Article[]>` — fetches RSS, parses with `fast-xml-parser`, returns normalized articles |
| `src/components/Articles.tsx` | async RSC. Calls `fetchArticles()`. Renders `<section id="articles">` with header + scroller. On empty array or thrown error, returns `null` |
| `src/components/ArticlesScroller.tsx` | client component. Mirrors `ProjectsGrid`'s scroll/arrows/dots logic, minus the filter chips. Takes `articles: Article[]` |
| `src/components/ArticleCard.tsx` | card visual. Cover image at 16:9 (gradient fallback if missing), date, read time, title, snippet, up to 3 tag chips |

### Files modified

| File | Change |
|---|---|
| `src/app/page.tsx` | Mount `<Articles />` after `<Projects />`, wrapped in `<Suspense>` with a skeleton fallback |
| `src/components/Navbar.tsx` | Add `{ href: "#articles", label: "Articles" }` between Projects and Experience |
| `next.config.ts` | Add `cdn-images-1.medium.com` and `miro.medium.com` to `images.remotePatterns` |
| `package.json` | Add dependency: `fast-xml-parser` |

### RSS parsing details (`src/lib/medium.ts`)

- Use `fast-xml-parser` (small, zero runtime deps, handles CDATA).
- For each `<item>`:
  - `title`, `link`, `guid` → straightforward.
  - `pubDate` → `new Date(pubDate).toISOString()` for `isoDate`.
  - `categories[]` → `tags` (lowercase, dedupe, drop empties).
  - `content:encoded` →
    - Extract cover image: first `<img src="…">` match via regex.
    - Strip HTML tags for snippet generation; collapse whitespace; trim to 160 chars on a word boundary; append `…`.
    - Count words for `readMinutes = max(1, round(words / 220))`.
- Clean `link` by removing the `?source=rss-…` query parameter so URLs look canonical.
- If RSS returns 0 items or fetch fails, the function returns `[]` (Articles section then renders nothing).

### Card layout

- Same width as project cards: `w-[80vw] sm:w-[340px] lg:w-[380px] shrink-0 snap-start`.
- Vertical structure:
  1. Cover image — `next/image`, `aspect-[16/9]`, rounded top. If no cover image, render a subtle gradient placeholder so cards stay visually aligned.
  2. Meta row — `pubDate (Mon DD, YYYY) · N min read`, small muted text.
  3. Title — 2-line clamp, larger weight.
  4. Snippet — 2-line clamp, muted.
  5. Tag row — up to 3 tag pills.
- Whole card is a `<Link>` with `target="_blank" rel="noopener noreferrer"` pointing to the Medium URL.

### Scroller (`ArticlesScroller`)

Copy the scroll mechanics from `ProjectsGrid` (lines 111–193, 247–322):
- `scrollerRef`, `edgeState`, `activeIndex`, `updateScrollState`.
- Desktop arrow buttons with edge-aware opacity.
- Mobile scroll-hint nudge (IntersectionObserver, `prefers-reduced-motion` aware, `min-width: 768px` opts out).
- Mobile dot pagination row.
- Edge mask gradient.

Don't try to share a component with `ProjectsGrid` — it has filter-state and tag-group logic that's specific to projects. Duplication of the ~50 lines of scroll logic is cheaper than the abstraction it would take to share. Leave `ProjectsGrid` untouched.

## Performance

- Images: lazy-loaded by default via `next/image`. Articles is below the fold (after Projects), so on first paint no article images load.
- Image format: `next/image` auto-serves AVIF/WebP at ~380px width → ~20–40 KB per cover.
- Network: one RSS request per region per hour. Article HTML lives in the server render, so no client-side fetch.

## Failure handling

| Scenario | Behavior |
|---|---|
| Medium RSS unreachable | `fetchArticles` returns `[]`; section renders nothing |
| RSS parse failure | Same as above; error logged server-side |
| Item missing cover image | Card renders with gradient placeholder |
| Item with empty categories | Tag row omitted |
| Pre-deploy: zero posts in feed | Section absent (no empty state shown) |

## Testing / verification

- `npx tsc --noEmit` — clean
- `npm run lint` — clean
- `npm run build` — Articles section appears in build output; check console for unexpected fetch errors
- Local dev (`npm run dev`):
  - Section renders with current 3 posts.
  - Cover images load via Medium CDN.
  - Horizontal scroll, arrows, dots, scroll-hint behave like Projects.
  - Cards open Medium in a new tab.
  - Navbar `Articles` link scrolls to the section.
  - Dark / light mode parity.
- Mobile viewport check (Chrome devtools, 375px): dot pagination + scroll-hint nudge fire.

## Future migration path (out of scope today)

When the user crosses ~10 posts:
- Replace `src/lib/medium.ts` internals with an S3 read (or a small JSON file in the repo), keeping the `fetchArticles()` signature and `Article` shape unchanged.
- Add a scheduled Lambda or GitHub Action that fetches the Medium feed, merges with previously-seen posts, and writes to S3.
- No changes to `Articles.tsx`, `ArticlesScroller.tsx`, or `ArticleCard.tsx` required.

The `fetchArticles()` boundary exists to make this swap trivial.
