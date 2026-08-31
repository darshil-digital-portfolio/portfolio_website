"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

/** Must match the `gap` on `.track` in globals.css. */
const TRACK_GAP = 20;

interface ScrollerProps<T> {
  items: T[];
  /** Stable key per item. */
  itemKey: (item: T) => string;
  children: (item: T) => ReactNode;
  /** Used for the arrow and dot labels, e.g. "project" → "Previous project". */
  noun: string;
}

/**
 * Horizontal snap scroller with glass arrows and dot pagination.
 *
 * Shared by Selected work and Writing so both stay in step.
 */
export default function Scroller<T>({ items, itemKey, children, noun }: ScrollerProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ left: false, right: false });
  const [activeIndex, setActiveIndex] = useState(0);

  const step = useCallback(() => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    return (first?.clientWidth ?? 360) + TRACK_GAP;
  }, []);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({ left: el.scrollLeft > 4, right: max > 4 && el.scrollLeft < max - 4 });
    setActiveIndex(Math.min(items.length - 1, Math.max(0, Math.round(el.scrollLeft / step()))));
  }, [items.length, step]);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  // One-time nudge on touch, so it reads as swipeable.
  const hinted = useRef(false);
  useEffect(() => {
    if (window.matchMedia("(min-width: 861px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = trackRef.current;
    if (!el || items.length < 2) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || hinted.current || el.scrollLeft > 4) continue;
          hinted.current = true;
          io.disconnect();
          setTimeout(() => {
            el.scrollBy({ left: 56, behavior: "smooth" });
            setTimeout(() => el.scrollBy({ left: -56, behavior: "smooth" }), 480);
          }, 450);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [items.length]);

  return (
    <div className="scroller">
      <button
        type="button"
        className="scroll-arrow left"
        aria-label={`Previous ${noun}`}
        disabled={!edge.left}
        onClick={() => trackRef.current?.scrollBy({ left: -step(), behavior: "smooth" })}
      >
        <ChevronLeftIcon />
      </button>

      <div ref={trackRef} className="track">
        {items.map((item) => (
          <article className="scroll-card" key={itemKey(item)}>
            {children(item)}
          </article>
        ))}
      </div>

      <button
        type="button"
        className="scroll-arrow right"
        aria-label={`Next ${noun}`}
        disabled={!edge.right}
        onClick={() => trackRef.current?.scrollBy({ left: step(), behavior: "smooth" })}
      >
        <ChevronRightIcon />
      </button>

      {items.length > 1 && (
        <div className="scroll-dots">
          {items.map((item, i) => (
            <button
              key={itemKey(item)}
              type="button"
              aria-label={`Go to ${noun} ${i + 1} of ${items.length}`}
              aria-current={activeIndex === i ? "true" : undefined}
              className={activeIndex === i ? "active" : undefined}
              onClick={() => trackRef.current?.scrollTo({ left: i * step(), behavior: "smooth" })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
