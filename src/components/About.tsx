"use client";

import { useEffect, useRef, useState } from "react";
import {
  firstExpandableCategoryLabel,
  firstExpandableName,
  isExpandable,
  skillCategories,
} from "@/data/skills";

function ExpandIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`text-base font-light leading-none transition-transform duration-500 inline-block ${open ? "rotate-45" : ""}`}
    >
      +
    </span>
  );
}

export default function About() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const firstExpandableRef = useRef<HTMLDivElement>(null);

  // Auto-play hint on the very first expandable skill when it scrolls into view
  useEffect(() => {
    const el = firstExpandableRef.current;
    if (!el || !firstExpandableName) return;

    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          t1 = setTimeout(() => setExpanded(firstExpandableName), 600);
          t2 = setTimeout(() => setExpanded(null), 2800);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const toggle = (name: string) => setExpanded((prev) => (prev === name ? null : name));

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-8">
          About
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed mb-16">
          I&apos;m an AI Engineer based in India with a decade of experience at IBM, building
          production AI systems for global enterprise clients — PepsiCo, Bacardi, Dow Chemicals,
          JSW, FAA, NedBank, Iffco-Tokio, and more. My work covers the full stack: data pipelines,
          model training and fine-tuning, agentic system design, and cloud deployment on AWS and
          Azure. I hold an M.Tech from IIT Kharagpur and a B.Tech in Electronics &amp; Communication
          Engineering.
        </p>

        <div className="space-y-8">
          {skillCategories.map((cat) => {
            const expandableInCat = cat.skills.filter(isExpandable);
            const isFirstExpandableCat = cat.label === firstExpandableCategoryLabel;

            return (
              <div key={cat.label} ref={isFirstExpandableCat ? firstExpandableRef : undefined}>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-3">
                  {cat.label}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => {
                    if (isExpandable(skill)) {
                      const isOpen = expanded === skill.name;
                      return (
                        <button
                          key={skill.name}
                          onClick={() => toggle(skill.name)}
                          className={`px-3 py-1 text-sm rounded-full flex items-center gap-1.5 transition-all duration-300 cursor-pointer font-medium ${
                            isOpen
                              ? "bg-amber-500 text-white ring-1 ring-amber-400"
                              : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                          }`}
                        >
                          {skill.name}
                          <ExpandIcon open={isOpen} />
                        </button>
                      );
                    }
                    return (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>

                {/* Always rendered so exit animation plays */}
                {expandableInCat.map((skill) => (
                  <div
                    key={skill.name}
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expanded === skill.name ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-3">
                      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 max-w-xs">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                          {skill.description}
                        </p>
                        {skill.subSkillGroups ? (
                          <div className="space-y-2.5">
                            {skill.subSkillGroups.map((group) => (
                              <div key={group.label}>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-1.5">
                                  {group.label}
                                </p>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {group.items.map((s) => (
                                    <span
                                      key={s}
                                      className="px-2 py-1 text-xs rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-center"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-1.5">
                            {skill.subSkills?.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-1 text-xs rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-center"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
