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
