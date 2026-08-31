import Image from "next/image";
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
    <a href={article.link} target="_blank" rel="noopener noreferrer" className="blog-card">
      <div className="blog-shot">
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(min-width: 861px) 360px, 86vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="blog-body">
        <span className="wtag">Post · Medium</span>
        <h3 className="clamp-2">{article.title}</h3>
        {article.snippet && <p className="clamp-2">{article.snippet}</p>}

        {visibleTags.length > 0 && (
          <div className="blog-tags">
            {visibleTags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}

        <span className="meta">
          {date} · {article.readMinutes} min read
        </span>
      </div>
    </a>
  );
}
