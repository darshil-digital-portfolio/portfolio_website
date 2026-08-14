"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  firstExpandableCategoryLabel,
  firstExpandableName,
  isExpandable,
  skillCategories,
} from "@/data/skills";

const HINT_OPEN_DELAY = 750;
const HINT_CLOSE_DELAY = 3000;

export default function About() {
  const [expanded, setExpanded] = useState<string | null>(null);
  // The very first gold chip — observed so we can demo that it opens.
  const firstGoldRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = firstGoldRef.current;
    if (!el || !firstExpandableName) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let open: ReturnType<typeof setTimeout>;
    let close: ReturnType<typeof setTimeout>;

    // Observe the chip itself, not the skills container — a container that
    // tall can never reach a 0.6 threshold on a normal viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        open = setTimeout(() => setExpanded(firstExpandableName), HINT_OPEN_DELAY);
        close = setTimeout(() => setExpanded(null), HINT_CLOSE_DELAY);
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(open);
      clearTimeout(close);
    };
  }, []);

  const toggle = (name: string) => setExpanded((prev) => (prev === name ? null : name));

  return (
    <section className="section veil" id="about">
      <div className="wrap">
        <div className="sec-head reveal-up">
          <div className="sec-label">01 — About</div>
          <h2 className="sec-title">A full-stack AI engineer, data to deployment.</h2>
        </div>

        <div className="grid-2">
          <p className="about-bio reveal-up">
            My work spans the full stack of applied AI — classical <em>ML</em> and{" "}
            <em>deep learning</em>, <em>computer vision</em> and <em>OCR</em>, <em>NLP</em>, and{" "}
            <em>Generative AI</em> with RAG and <em>AI agents</em>. I&apos;ve taken these to
            production for global enterprises — PepsiCo, Bacardi, Dow Chemicals, JSW, the FAA,
            NedBank, and Iffco-Tokio — owning the lifecycle end to end: data pipelines, training and
            fine-tuning, <em>MLOps</em>, <em>AI evaluations</em>, and <em>responsible-AI</em>{" "}
            guardrails, deployed on AWS and Azure.
          </p>

          <div className="reveal-up" id="skills">
            {skillCategories.map((cat) => {
              const expandableInCat = cat.skills.filter(isExpandable);
              const isFirstExpandableCat = cat.label === firstExpandableCategoryLabel;

              return (
                <div className="skill-cat" key={cat.label}>
                  <div className="skill-cat-head">{cat.label}</div>

                  <div className="chips">
                    {cat.skills.map((skill) => {
                      if (!isExpandable(skill)) {
                        return (
                          <span className="chip" key={skill}>
                            {skill}
                          </span>
                        );
                      }
                      const isFirstGold =
                        isFirstExpandableCat && skill.name === firstExpandableName;
                      return (
                        <button
                          type="button"
                          key={skill.name}
                          ref={isFirstGold ? firstGoldRef : undefined}
                          className="chip expandable gold"
                          aria-expanded={expanded === skill.name}
                          aria-controls={`skill-${slug(skill.name)}`}
                          onClick={() => toggle(skill.name)}
                        >
                          {skill.name}
                          <span className="plus" aria-hidden="true">
                            +
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Always rendered so the accordion can animate closed. */}
                  {expandableInCat.map((skill) => (
                    <div
                      key={skill.name}
                      id={`skill-${slug(skill.name)}`}
                      className={`skill-detail${expanded === skill.name ? " open" : ""}`}
                    >
                      <div>
                        <div className="panel">
                          <p>{skill.description}</p>
                          {skill.subSkillGroups ? (
                            skill.subSkillGroups.map((group) => (
                              // Siblings, not wrapped — `.sub-label:first-of-type`
                              // needs them to share a parent.
                              <Fragment key={group.label}>
                                <div className="sub-label">{group.label}</div>
                                <div className="sub-grid">
                                  {group.items.map((s) => (
                                    <span key={s}>{s}</span>
                                  ))}
                                </div>
                              </Fragment>
                            ))
                          ) : (
                            <div className="sub-grid">
                              {skill.subSkills?.map((s) => (
                                <span key={s}>{s}</span>
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
      </div>
    </section>
  );
}

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
