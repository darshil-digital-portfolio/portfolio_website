"use client";

import type { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";
import Scroller from "./Scroller";

interface Props {
  articles: Article[];
}

export default function ArticlesScroller({ articles }: Props) {
  return (
    <Scroller items={articles} itemKey={(a) => a.id} noun="post">
      {(article) => <ArticleCard article={article} />}
    </Scroller>
  );
}
