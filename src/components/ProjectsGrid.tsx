"use client";

import { useState, useMemo } from "react";
import type { ProjectCard } from "@/types/project";
import { parseTag } from "@/types/project";
import ProjectCardView from "./ProjectCard";
import Scroller from "./Scroller";

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
        // Remounted per filter combination so the track starts at the left
        // edge rather than mid-scroll on a now-shorter list.
        <Scroller
          key={`${activeStatus}-${activeIndustry}-${activeTagGroup}`}
          items={filtered}
          itemKey={(p) => p.id}
          noun="project"
        >
          {(project) => <ProjectCardView project={project} />}
        </Scroller>
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
