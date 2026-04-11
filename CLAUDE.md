@AGENTS.md

# Portfolio Website — Claude Code Instructions

## Project overview
Main portfolio website for an AI engineer. Lists and showcases projects housed in separate repos under the `darshil-digital-portfolio` GitHub organisation. Deployed to Vercel; auto-deploys on push to `main`.

## Tech stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Runtime | React 19 |
| Deploy | Vercel (auto CI/CD on push to `main`) |
| Formatter | Prettier |
| Linter | ESLint (eslint-config-next) |

## Dev commands
```bash
npm run dev       # local dev server → http://localhost:3000
npm run build     # production build (runs lint first via hook)
npm run lint      # ESLint check
npx tsc --noEmit  # type-check only
```

Run `/check-build` in this session before pushing to catch all issues at once.

## Project structure
```
src/
  app/             # Next.js App Router pages & layouts
  components/      # Reusable React components
  data/
    projects.ts    # Master list of portfolio projects ← edit this to add/update projects
  types/
    project.ts     # Project interface & types
public/
  projects/        # Project screenshots (name: <project-id>.png)
.claude/
  agents/          # Sub-agents (ui-engineer, content-writer)
  commands/        # Custom slash commands (/add-project, /check-build)
  settings.json    # Hooks: auto-prettier on save, lint guard before build
```

## How projects are managed
Projects are **manually maintained** in `src/data/projects.ts`. Each entry follows the `Project` interface in `src/types/project.ts`. Use the `/add-project` command to add a new entry interactively.

GitHub org pattern: `https://github.com/darshil-digital-portfolio/<project-repo>`

## Hooks (automatic)
- **PostToolUse (Write|Edit)** → Prettier auto-formats `.ts`, `.tsx`, `.css`, `.json`, `.md` files on every save.
- **PreToolUse (Bash)** → Lint check runs before any `npm run build` / `next build` command.

## Custom slash commands
| Command | Purpose |
|---------|---------|
| `/add-project` | Add a new project entry to `src/data/projects.ts` |
| `/check-build` | Full quality gate: type-check → lint → format → build |

## Sub-agents
| Agent | When to use |
|-------|-------------|
| `portfolio-strategist` | Deciding what sections to include, content planning, what to ask the user — run this first before building anything new |
| `ui-engineer` | Building/modifying components, layouts, pages, Tailwind styles |
| `content-writer` | Writing project descriptions, bio text, section copy, highlights |

Invoke with: `use the portfolio-strategist agent to plan the About section`

## Tailwind v4 important note
Tailwind v4 is CSS-config based. **Do not create `tailwind.config.js`**. Configure theme tokens via `@theme` in `src/app/globals.css`.

## Coding conventions
- RSC by default; add `"use client"` only for interactive components.
- No `any` types. Explicit prop interfaces on all components.
- `next/image` for images, `next/link` for internal links.
- Component files: `PascalCase.tsx`. Data/type files: `camelCase.ts`.
