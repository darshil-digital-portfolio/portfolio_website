"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import type { ProjectCard } from "@/types/project";
import { parseTag } from "@/types/project";
import ProjectCardView from "./ProjectCard";

const STATUS_FILTER_OPTIONS: Array<{ value: ProjectCard["status"] | "offline"; label: string }> = [
  { value: "online", label: "Live" },
  { value: "showcase", label: "Showcase" },
  { value: "prototype", label: "Prototype" },
  { value: "offline", label: "Offline" },
  { value: "confidential", label: "Confidential" },
];

const TAG_GROUP_PREFIXES: Record<string, string[]> = {
  RAG: ["rag"],
  "Fine-tuned": ["finetune"],
  MLOps: ["tracking", "serving", "observe"],
  "AI / LLM": ["llm", "embed"],
};

function normalizeStatus(s: ProjectCard["status"]): string {
  if (s === "completed" || s === "deprecated" || s === "sunset" || s === "archived")
    return "offline";
  if (s === "in-progress") return "offline";
  return s;
}

interface Props {
  projects: ProjectCard[];
}

export default function ProjectsGrid({ projects }: Props) {
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
  const [activeTagGroup, setActiveTagGroup] = useState<string | null>(null);

  const industries = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.industry) set.add(p.industry);
    });
    return [...set].sort();
  }, [projects]);

  const presentStatuses = useMemo(() => {
    return STATUS_FILTER_OPTIONS.filter((opt) =>
      projects.some((p) => {
        if (opt.value === "offline") {
          return [
            "offline",
            "completed",
            "in-progress",
            "deprecated",
            "sunset",
            "archived",
          ].includes(p.status);
        }
        return p.status === opt.value;
      })
    );
  }, [projects]);

  const presentTagGroups = useMemo(() => {
    const groups: string[] = [];
    for (const [group, prefixes] of Object.entries(TAG_GROUP_PREFIXES)) {
      if (
        projects.some((p) =>
          p.tags.some((t) => {
            const { prefix } = parseTag(t);
            return prefix && prefixes.includes(prefix);
          })
        )
      ) {
        groups.push(group);
      }
    }
    if (projects.some((p) => p.part_of)) groups.push("Multi-repo");
    return groups;
  }, [projects]);

  const hasFilterUI =
    presentStatuses.length > 1 || industries.length >= 2 || presentTagGroups.length > 0;

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (activeStatus) {
        const norm = normalizeStatus(p.status);
        if (norm !== activeStatus && p.status !== activeStatus) return false;
      }
      if (activeIndustry && p.industry !== activeIndustry) return false;
      if (activeTagGroup) {
        if (activeTagGroup === "Multi-repo") {
          if (!p.part_of) return false;
        } else {
          const prefixes = TAG_GROUP_PREFIXES[activeTagGroup] ?? [];
          const has = p.tags.some((t) => {
            const { prefix } = parseTag(t);
            return prefix && prefixes.includes(prefix);
          });
          if (!has) return false;
        }
      }
      return true;
    });
  }, [projects, activeStatus, activeIndustry, activeTagGroup]);

  const anyActive = activeStatus || activeIndustry || activeTagGroup;

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
    setActiveIndex(Math.min(filtered.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  }, [filtered.length]);

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
  }, [updateScrollState, filtered.length]);

  const hintedRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = scrollerRef.current;
    if (!el || filtered.length < 2) return;

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
  }, [filtered.length]);

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
    <>
      {hasFilterUI && (
        <div className="flex flex-wrap gap-2 mb-8">
          {presentStatuses.length > 1 &&
            presentStatuses.map(({ value, label }) => (
              <FilterChip
                key={value}
                label={label}
                active={activeStatus === value}
                color="blue"
                onClick={() => setActiveStatus(activeStatus === value ? null : value)}
              />
            ))}
          {industries.length >= 2 &&
            industries.map((ind) => (
              <FilterChip
                key={ind}
                label={ind}
                active={activeIndustry === ind}
                color="violet"
                onClick={() => setActiveIndustry(activeIndustry === ind ? null : ind)}
              />
            ))}
          {presentTagGroups.map((g) => (
            <FilterChip
              key={g}
              label={g}
              active={activeTagGroup === g}
              color="emerald"
              onClick={() => setActiveTagGroup(activeTagGroup === g ? null : g)}
            />
          ))}
          {anyActive && (
            <button
              onClick={() => {
                setActiveStatus(null);
                setActiveIndustry(null);
                setActiveTagGroup(null);
              }}
              className="px-3 py-1 text-xs rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">
          No projects match the selected filters.
        </p>
      ) : (
        <div className="relative group/scroller">
          <button
            type="button"
            aria-label="Scroll projects left"
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
            {filtered.map((project) => (
              <div
                key={project.id}
                className="w-[80vw] sm:w-[340px] lg:w-[380px] shrink-0 snap-start"
              >
                <ProjectCardView project={project} />
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll projects right"
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
          {filtered.length > 1 && (
            <div className="md:hidden flex justify-center items-center gap-1.5 mt-5">
              {filtered.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Go to project ${i + 1} of ${filtered.length}`}
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
      )}
    </>
  );
}

const COLOR_MAP = {
  blue: {
    active: "bg-blue-600 border-blue-600 text-white",
    idle: "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-600",
  },
  violet: {
    active: "bg-violet-600 border-violet-600 text-white",
    idle: "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-400 dark:hover:border-violet-600",
  },
  emerald: {
    active: "bg-emerald-600 border-emerald-600 text-white",
    idle: "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-400 dark:hover:border-emerald-600",
  },
};

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: keyof typeof COLOR_MAP;
  onClick: () => void;
}) {
  const { active: activeClass, idle } = COLOR_MAP[color];
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors ${active ? activeClass : idle}`}
    >
      {label}
    </button>
  );
}
