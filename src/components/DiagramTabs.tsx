"use client";

import { useState } from "react";
import type { ProjectDiagram } from "@/types/project";
import MermaidDiagram from "./MermaidDiagram";

interface DiagramTabsProps {
  diagrams: ProjectDiagram[];
  featuredDiagram?: string | null;
}

export default function DiagramTabs({ diagrams, featuredDiagram }: DiagramTabsProps) {
  const defaultIdx = featuredDiagram
    ? Math.max(
        0,
        diagrams.findIndex((d) => d.title === featuredDiagram || d.type === featuredDiagram)
      )
    : 0;
  const [activeIdx, setActiveIdx] = useState(defaultIdx);

  const active = diagrams[activeIdx];
  if (!active) return null;

  return (
    <div>
      {diagrams.length > 1 && (
        <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 mb-4 gap-0">
          {diagrams.map((d, i) => (
            <button
              key={d.title}
              onClick={() => setActiveIdx(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                activeIdx === i
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {d.title}
            </button>
          ))}
        </div>
      )}
      {active.format === "mermaid" && active.content ? (
        <MermaidDiagram title={diagrams.length === 1 ? active.title : ""} content={active.content} />
      ) : active.format === "image" && active.url ? (
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.url} alt={active.title} className="w-full" />
        </div>
      ) : null}
    </div>
  );
}
