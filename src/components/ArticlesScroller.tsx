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
