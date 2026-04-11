# Add a New Project Entry

You are helping add a new project to the portfolio's data file at `src/data/projects.ts`.

## Steps

1. **Gather information** — Ask the user for (or use arguments provided in $ARGUMENTS):
   - Project `id` (slug, lowercase-hyphenated, matches the GitHub repo name in the org)
   - `title` (human-readable)
   - `description` (one sentence, max 120 chars)
   - `tags` (tech stack + domain tags, e.g. `["LLM", "Python", "FastAPI"]`)
   - `githubUrl` (pattern: `https://github.com/darshil-digital-portfolio/<repo>`)
   - `liveUrl` (if deployed, else omit)
   - `featured` (boolean — only mark featured for top 3–5 best projects)
   - `status` (`"completed"` | `"in-progress"` | `"archived"`)
   - `date` (YYYY-MM of completion or last active month)
   - `highlights` (2–4 bullet points of key achievements — be specific, include metrics if any)
   - `imageUrl` (optional — path under `/public/projects/<id>.png` or URL)

2. **Validate** — Ensure `id` is unique in the current `projects` array. Warn if a duplicate is found.

3. **Append the entry** — Add the new `Project` object to the `projects` array in `src/data/projects.ts`, maintaining the order: featured first, then chronological descending.

4. **Confirm** — Show the user the final entry and confirm it was written.

## Style rules for descriptions and highlights
- Description: present tense, no "I" — e.g. "Retrieval-augmented generation pipeline built on LangChain."
- Highlights: past tense, action-first — e.g. "Reduced latency by 40% via async batching."
- Tags: capitalize properly — "Python", "LLM", "Next.js", "FastAPI", "PyTorch", etc.
