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
