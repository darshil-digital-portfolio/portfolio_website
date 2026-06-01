# Medium Articles Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Articles" section on the homepage that auto-lists the user's latest 10 Medium posts via RSS, in a horizontal-scroll carousel mirroring the Projects section.

**Architecture:** Server-side fetch of `https://medium.com/feed/@kapadiadarshil25` in an async React Server Component, cached with Next's `revalidate: 3600`. RSS parsed via `fast-xml-parser` into a typed `Article[]` shape. A client `ArticlesScroller` reuses the scroll/arrows/dots UX from `ProjectsGrid` (duplicated, not abstracted — see spec). Cards link out to Medium.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript strict, Tailwind v4, `fast-xml-parser`, `next/image`.

**Spec:** `docs/superpowers/specs/2026-06-01-medium-articles-section-design.md`

**Testing convention:** This project has no unit-test framework. Verification = `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual browser check at `http://localhost:3000`. Each task commits independently so failures are easy to bisect.

---

## File map

| Path | Action | Responsibility |
|---|---|---|
| `package.json` | modify | add `fast-xml-parser` dependency |
| `next.config.ts` | modify | allow Medium CDN hostnames in `images.remotePatterns` |
| `src/types/article.ts` | create | `Article` interface |
| `src/lib/medium.ts` | create | `fetchArticles()`: fetch + parse RSS → `Article[]` |
| `src/components/ArticleCard.tsx` | create | single-card visual (image, meta, title, snippet, tags) |
| `src/components/ArticlesScroller.tsx` | create | client component: horizontal scroll, arrows, dot pagination |
| `src/components/Articles.tsx` | create | async RSC: section wrapper, calls `fetchArticles()`, renders scroller |
| `src/components/ProjectSkeleton.tsx` | modify | export an `ArticlesScrollerSkeleton` for `<Suspense>` fallback |
| `src/app/page.tsx` | modify | mount `<Articles />` inside `<Suspense>` after `<Projects />` |
| `src/components/Navbar.tsx` | modify | add `Articles` nav link between Projects and Experience |

---

## Task 1: Add `fast-xml-parser` dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

Run:
```bash
npm install fast-xml-parser
```

Expected: `package.json` gains `"fast-xml-parser": "^4.x.x"` (or current 5.x — either works) under `dependencies`. `package-lock.json` updates.

- [ ] **Step 2: Verify install**

Run:
```bash
node -e "console.log(require('fast-xml-parser').XMLParser.name)"
```
Expected output: `XMLParser`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add fast-xml-parser for Medium RSS"
```

---

## Task 2: Allow Medium CDN images

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add Medium hostnames to `remotePatterns`**

Replace the `images` block in `next.config.ts` so it reads:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.credly.com" },
    { protocol: "https", hostname: "cdn-images-1.medium.com" },
    { protocol: "https", hostname: "miro.medium.com" },
  ],
},
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore: allow Medium CDN hostnames for next/image"
```

---

## Task 3: Define the `Article` type

**Files:**
- Create: `src/types/article.ts`

- [ ] **Step 1: Write the type**

```ts
export interface Article {
  id: string;
  title: string;
  link: string;
  isoDate: string;
  snippet: string;
  coverImage?: string;
  tags: string[];
  readMinutes: number;
}
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/article.ts
git commit -m "feat: add Article type for Medium posts"
```

---

## Task 4: Build the Medium RSS parser

**Files:**
- Create: `src/lib/medium.ts`

- [ ] **Step 1: Write the fetcher + parser**

Create `src/lib/medium.ts` with this exact content:

```ts
import { XMLParser } from "fast-xml-parser";
import type { Article } from "@/types/article";

const FEED_URL = "https://medium.com/feed/@kapadiadarshil25";
const WORDS_PER_MINUTE = 220;
const SNIPPET_MAX_CHARS = 160;

interface RssItem {
  title?: string;
  link?: string;
  guid?: string | { "#text"?: string };
  pubDate?: string;
  category?: string | string[];
  "content:encoded"?: string;
}

interface RssFeed {
  rss?: { channel?: { item?: RssItem | RssItem[] } };
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "portfolio-website (+https://github.com/darshil-digital-portfolio)" },
    });
    if (!res.ok) {
      console.error(`Medium RSS fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const xml = await res.text();
    return parseFeed(xml);
  } catch (err) {
    console.error("Medium RSS fetch threw:", err);
    return [];
  }
}

function parseFeed(xml: string): Article[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    cdataPropName: "#cdata",
    textNodeName: "#text",
    parseTagValue: false,
    trimValues: true,
  });
  const parsed = parser.parse(xml) as RssFeed;
  const itemNode = parsed.rss?.channel?.item;
  if (!itemNode) return [];
  const items = Array.isArray(itemNode) ? itemNode : [itemNode];
  return items.map(toArticle).filter((a): a is Article => a !== null);
}

function toArticle(item: RssItem): Article | null {
  const title = readCdata(item.title);
  const rawLink = readCdata(item.link);
  if (!title || !rawLink) return null;

  const guidRaw = typeof item.guid === "string" ? item.guid : readCdata(item.guid);
  const id = guidRaw || rawLink;

  const link = cleanLink(rawLink);
  const isoDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
  const contentHtml = readCdata(item["content:encoded"]) ?? "";
  const coverImage = extractFirstImage(contentHtml);
  const plain = stripHtml(contentHtml);
  const snippet = buildSnippet(plain);
  const readMinutes = estimateReadMinutes(plain);
  const tags = normalizeTags(item.category);

  return { id, title, link, isoDate, snippet, coverImage, tags, readMinutes };
}

function readCdata(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object" && "#cdata" in value) {
    const inner = (value as { "#cdata"?: unknown })["#cdata"];
    if (typeof inner === "string") return inner.trim();
    if (Array.isArray(inner)) return inner.filter((s) => typeof s === "string").join("").trim();
  }
  if (typeof value === "object" && "#text" in value) {
    const t = (value as { "#text"?: unknown })["#text"];
    if (typeof t === "string") return t.trim();
  }
  return "";
}

function cleanLink(link: string): string {
  try {
    const url = new URL(link);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return link;
  }
}

function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : undefined;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<figure[\s\S]*?<\/figure>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSnippet(plain: string): string {
  if (plain.length <= SNIPPET_MAX_CHARS) return plain;
  const slice = plain.slice(0, SNIPPET_MAX_CHARS);
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = lastSpace > 80 ? slice.slice(0, lastSpace) : slice;
  return `${trimmed.replace(/[,.;:!?-]+$/, "")}…`;
}

function estimateReadMinutes(plain: string): number {
  const words = plain ? plain.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function normalizeTags(category: RssItem["category"]): string[] {
  if (!category) return [];
  const list = Array.isArray(category) ? category : [category];
  const cleaned = list
    .map((c) => readCdata(c))
    .filter((c) => c.length > 0)
    .map((c) => c.toLowerCase());
  return Array.from(new Set(cleaned));
}
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Smoke-test against the live feed**

Run this one-liner (uses Node's built-in `tsx` via npx) to confirm the parser produces sensible output:

```bash
npx --yes tsx -e "import('./src/lib/medium.ts').then(async m => { const a = await m.fetchArticles(); console.log(JSON.stringify(a.map(x => ({ title: x.title, tags: x.tags, readMinutes: x.readMinutes, snippetLen: x.snippet.length, hasCover: !!x.coverImage, link: x.link })), null, 2)); })"
```

Expected: an array of 3+ entries. Each has a non-empty `title`, lower-cased `tags` array, `readMinutes >= 1`, `snippetLen <= 161`, `hasCover: true` for most posts, and a `link` with no `?source=` query string.

If the smoke test fails, debug `src/lib/medium.ts` before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/lib/medium.ts
git commit -m "feat: Medium RSS fetcher and parser"
```

---

## Task 5: Build `ArticleCard`

**Files:**
- Create: `src/components/ArticleCard.tsx`

- [ ] **Step 1: Write the component**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/article";

interface Props {
  article: Article;
}

const DATE_FMT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

export default function ArticleCard({ article }: Props) {
  const date = new Date(article.isoDate).toLocaleDateString("en-US", DATE_FMT);
  const visibleTags = article.tags.slice(0, 3);

  return (
    <Link
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 340px, 80vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-emerald-500/10"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {date} · {article.readMinutes} min read
        </div>

        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
          {article.title}
        </h3>

        {article.snippet && (
          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {article.snippet}
          </p>
        )}

        {visibleTags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Type-check + lint**

Run:
```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ArticleCard.tsx
git commit -m "feat: ArticleCard component"
```

---

## Task 6: Build `ArticlesScroller`

**Files:**
- Create: `src/components/ArticlesScroller.tsx`

This is the horizontal-scroll container. It mirrors the scroll mechanics from `src/components/ProjectsGrid.tsx` (arrows, edge-mask, dot pagination, mobile scroll-hint nudge), but without filter chips.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";

interface Props {
  articles: Article[];
}

export default function ArticlesScroller({ articles }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edgeState, setEdgeState] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdgeState({
      left: el.scrollLeft > 4,
      right: max > 4 && el.scrollLeft < max - 4,
    });
    const first = el.firstElementChild as HTMLElement | null;
    const step = (first?.clientWidth ?? 1) + 24;
    setActiveIndex(Math.min(articles.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  }, [articles.length]);

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, articles.length]);

  const hintedRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = scrollerRef.current;
    if (!el || articles.length < 2) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !hintedRef.current && el.scrollLeft < 4) {
            hintedRef.current = true;
            window.setTimeout(() => {
              el.scrollBy({ left: 56, behavior: "smooth" });
              window.setTimeout(() => el.scrollBy({ left: -56, behavior: "smooth" }), 480);
            }, 450);
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [articles.length]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = (first?.clientWidth ?? 360) + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = (first?.clientWidth ?? 1) + 24;
    el.scrollTo({ left: i * step, behavior: "smooth" });
  };

  const maskImage =
    edgeState.left && edgeState.right
      ? "linear-gradient(to right, transparent, black 2.5rem, black calc(100% - 2.5rem), transparent)"
      : edgeState.left
        ? "linear-gradient(to right, transparent, black 2.5rem, black)"
        : edgeState.right
          ? "linear-gradient(to right, black, black calc(100% - 2.5rem), transparent)"
          : undefined;

  return (
    <div className="relative group/scroller">
      <button
        type="button"
        aria-label="Scroll articles left"
        onClick={() => scrollByCard(-1)}
        className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-lg hover:bg-white dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition duration-200 ${edgeState.left ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div
        ref={scrollerRef}
        style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
        className="flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article) => (
          <div
            key={article.id}
            className="w-[80vw] sm:w-[340px] lg:w-[380px] shrink-0 snap-start"
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll articles right"
        onClick={() => scrollByCard(1)}
        className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-lg hover:bg-white dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition duration-200 ${edgeState.right ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {articles.length > 1 && (
        <div className="md:hidden flex justify-center items-center gap-1.5 mt-5">
          {articles.map((a, i) => (
            <button
              key={a.id}
              type="button"
              aria-label={`Go to article ${i + 1} of ${articles.length}`}
              aria-current={activeIndex === i ? "true" : undefined}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "w-6 bg-blue-500 dark:bg-blue-400"
                  : "w-1.5 bg-slate-300 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check + lint**

Run:
```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ArticlesScroller.tsx
git commit -m "feat: ArticlesScroller (horizontal scroll matching ProjectsGrid)"
```

---

## Task 7: Add skeleton fallback for `<Suspense>`

**Files:**
- Modify: `src/components/ProjectSkeleton.tsx`

- [ ] **Step 1: Read the existing file**

Run:
```bash
cat src/components/ProjectSkeleton.tsx
```

You will see an existing `ProjectsGridSkeleton` export. We're adding a parallel `ArticlesScrollerSkeleton` so the Articles section has a reasonable placeholder while data fetches.

- [ ] **Step 2: Append the new export**

Add the following at the end of `src/components/ProjectSkeleton.tsx`:

```tsx
export function ArticlesScrollerSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden py-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-[80vw] sm:w-[340px] lg:w-[380px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="aspect-[16/9] w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-2/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Type-check + lint**

Run:
```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectSkeleton.tsx
git commit -m "feat: ArticlesScrollerSkeleton for Suspense fallback"
```

---

## Task 8: Build the `Articles` server component

**Files:**
- Create: `src/components/Articles.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { fetchArticles } from "@/lib/medium";
import ArticlesScroller from "./ArticlesScroller";

export default async function Articles() {
  const articles = await fetchArticles();
  if (articles.length === 0) return null;

  return (
    <section id="articles" className="py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Articles
          </h2>
          <a
            href="https://medium.com/@kapadiadarshil25"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            See all on Medium →
          </a>
        </div>
        <ArticlesScroller articles={articles} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + lint**

Run:
```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Articles.tsx
git commit -m "feat: Articles section RSC"
```

---

## Task 9: Mount Articles in the homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update imports and JSX**

Replace the full contents of `src/app/page.tsx` with:

```tsx
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Articles from "@/components/Articles";
import {
  ProjectsGridSkeleton,
  ArticlesScrollerSkeleton,
} from "@/components/ProjectSkeleton";
import Experience from "@/components/Experience";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Suspense fallback={<ProjectsGridSkeleton />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<ArticlesScrollerSkeleton />}>
          <Articles />
        </Suspense>
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-400 dark:text-slate-600">
        © 2026 Darshil Kapadia
      </footer>
    </>
  );
}
```

> **Note:** The `<Suspense fallback={<ArticlesScrollerSkeleton />}>` only renders the bare scroller skeleton, not a section header. That is intentional — if the fetch fails, `Articles` returns `null` and the section is silently absent rather than showing a header with no content. The skeleton flashes briefly during the actual fetch.

- [ ] **Step 2: Type-check + lint**

Run:
```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: mount Articles section on homepage"
```

---

## Task 10: Add Articles to the navbar

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Insert nav link**

Locate the `NAV_LINKS` constant in `src/components/Navbar.tsx`:

```ts
const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];
```

Replace with:

```ts
const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#articles", label: "Articles" },
  { href: "#experience", label: "Experience" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];
```

- [ ] **Step 2: Type-check + lint**

Run:
```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add Articles link to navbar"
```

---

## Task 11: Full verification

**Files:** (none modified)

- [ ] **Step 1: Run the full quality gate**

Run:
```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all three pass. The build output should include `/` as a statically-rendered route (or ISR — either is fine).

- [ ] **Step 2: Start the dev server**

Run:
```bash
npm run dev
```

Then open `http://localhost:3000` in a browser.

- [ ] **Step 3: Manual smoke checks**

Verify each:

- [ ] Articles section appears below Projects, with the heading "Articles" and the "See all on Medium →" link in the top-right.
- [ ] All 3 existing Medium posts render as cards.
- [ ] Each card shows: cover image, "Mon DD, YYYY · N min read", title (2-line max), snippet (2-line max), up to 3 tag chips.
- [ ] Clicking a card opens the Medium post in a **new tab**.
- [ ] Desktop (≥768px): hover the scroller, left/right arrow buttons appear. Clicking them scrolls one card-width.
- [ ] Mobile viewport (resize to ~375px in devtools): dot pagination appears below the scroller; the scroll-hint nudge fires once when the section first becomes visible.
- [ ] Navbar shows "Articles" between "Projects" and "Experience"; clicking it scrolls to the section.
- [ ] Toggle dark mode — the section renders correctly in both themes.

- [ ] **Step 4: Confirm revalidation is wired**

In the dev server output, the first request to `/` should print a fetch of the Medium URL. Subsequent requests within an hour should not refetch.

- [ ] **Step 5: Final commit (if any tweaks were needed)**

If steps 1-4 surfaced any fixes, commit them:

```bash
git add -A
git commit -m "fix: address verification feedback for Articles section"
```

If everything passed clean, no commit needed.

---

## Done criteria

- All 11 tasks committed.
- `npx tsc --noEmit && npm run lint && npm run build` exits 0.
- Visiting `http://localhost:3000` shows the Articles section populated from the live Medium feed.
- New Medium posts will appear on Vercel within an hour of publishing, without code changes.
