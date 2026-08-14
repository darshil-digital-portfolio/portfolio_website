"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import type { ProjectCard } from "@/types/project";
import { parseTag } from "@/types/project";
import ProjectCardView from "./ProjectCard";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

/** Card width + `.track` gap — the distance one arrow press or dot travels. */
const TRACK_GAP = 20;

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
    const step = (first?.clientWidth ?? 1) + TRACK_GAP;
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
    const step = (first?.clientWidth ?? 360) + TRACK_GAP;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = (first?.clientWidth ?? 1) + TRACK_GAP;
    el.scrollTo({ left: i * step, behavior: "smooth" });
  };

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
                onClick={() => setActiveStatus(activeStatus === value ? null : value)}
              />
            ))}
          {industries.length >= 2 &&
            industries.map((ind) => (
              <FilterChip
                key={ind}
                label={ind}
                active={activeIndustry === ind}
                onClick={() => setActiveIndustry(activeIndustry === ind ? null : ind)}
              />
            ))}
          {presentTagGroups.map((g) => (
            <FilterChip
              key={g}
              label={g}
              active={activeTagGroup === g}
              onClick={() => setActiveTagGroup(activeTagGroup === g ? null : g)}
            />
          ))}
          {anyActive && (
            <button
              type="button"
              onClick={() => {
                setActiveStatus(null);
                setActiveIndustry(null);
                setActiveTagGroup(null);
              }}
              className="filter-chip border-transparent bg-transparent"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-ink-soft">No projects match the selected filters.</p>
      ) : (
        <div className="scroller">
          <button
            type="button"
            className="scroll-arrow left"
            aria-label="Previous project"
            disabled={!edgeState.left}
            onClick={() => scrollByCard(-1)}
          >
            <ChevronLeftIcon />
          </button>

          <div ref={scrollerRef} className="track">
            {filtered.map((project) => (
              <article key={project.id} className="scroll-card">
                <ProjectCardView project={project} />
              </article>
            ))}
          </div>

          <button
            type="button"
            className="scroll-arrow right"
            aria-label="Next project"
            disabled={!edgeState.right}
            onClick={() => scrollByCard(1)}
          >
            <ChevronRightIcon />
          </button>

          {filtered.length > 1 && (
            <div className="scroll-dots">
              {filtered.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Go to project ${i + 1} of ${filtered.length}`}
                  aria-current={activeIndex === i ? "true" : undefined}
                  onClick={() => scrollToIndex(i)}
                  className={activeIndex === i ? "active" : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="filter-chip">
      {label}
    </button>
  );
}
