"use client";

import { useEffect, useRef, useState } from "react";

type ExpandableSkill = {
  name: string;
  description: string;
  subSkills: string[];
};

type SkillItem = string | ExpandableSkill;

const isExpandable = (s: SkillItem): s is ExpandableSkill => typeof s === "object";

const skillCategories: { label: string; skills: SkillItem[] }[] = [
  {
    label: "Generative AI",
    skills: [
      "GPT-4o",
      "LLaMA 3.1/3.3",
      "BERT",
      "T5",
      "LangGraph",
      "LangChain",
      "RAG",
      "GraphRAG",
      "RLHF",
      "PEFT / LoRA / QLoRA",
      "Fine-tuning",
      "Multi-Agent Systems",
      "Prompt Engineering",
      "DSPy",
      "Vector DB",
      "Automated Prompt Generation",
    ],
  },
  {
    label: "ML & Deep Learning",
    skills: [
      "TensorFlow",
      "PyTorch",
      "CNN",
      "RNN",
      "CRNN",
      "LSTM",
      "YOLO",
      "ResNet",
      "R-CNN",
      "Mask R-CNN",
      "Transfer Learning",
      "Computer Vision",
      "MLflow",
    ],
  },
  {
    label: "NLP",
    skills: [
      "Hugging Face",
      "Text Classification",
      "NER",
      "StarCoder",
      "CodeLLaMA",
      "Watson Speech-to-Text",
      "Watson Visual Recognition",
    ],
  },
  {
    label: "Languages",
    skills: ["Python", "C++", "SQL", "Gremlin", "Cypher"],
  },
  {
    label: "Python Ecosystem",
    skills: ["FastAPI", "Pandas", "OpenCV", "NetworkX", "Bokeh"],
  },
  {
    label: "Cloud & Infrastructure",
    skills: [
      {
        name: "AWS",
        description:
          "Hands-on experience with core AWS services for data engineering, ML workloads, and application infrastructure.",
        subSkills: [
          "EC2",
          "S3",
          "RDS",
          "VPC",
          "DynamoDB",
          "SageMaker",
          "Bedrock",
          "Lambda",
          "EKS",
          "Fargate",
          "IAM",
        ],
      },
      {
        name: "Azure",
        description:
          "Deep production experience across the Azure ecosystem — from ML pipelines and vector search to DevOps and real-time compute.",
        subSkills: [
          "Azure ML",
          "Azure Databricks",
          "Azure AI Studio",
          "Azure AI Search",
          "CosmosDB",
          "Azure Functions",
          "Azure Form Recognizer",
          "AKS",
          "Azure DevOps",
        ],
      },
      "Docker",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "OpenTelemetry",
      "WebSockets",
    ],
  },
  {
    label: "Databases",
    skills: ["PostgreSQL", "MongoDB", "CosmosDB", "Neo4j", "Redis", "MySQL", "SQLite"],
  },
];

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
  const awsRowRef = useRef<HTMLDivElement>(null);

  // Auto-play hint when section scrolls into view
  useEffect(() => {
    const el = awsRowRef.current;
    if (!el) return;

    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          t1 = setTimeout(() => setExpanded("AWS"), 600);
          t2 = setTimeout(() => setExpanded(null), 2800);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const toggle = (name: string) =>
    setExpanded((prev) => (prev === name ? null : name));

  return (
    <section ref={sectionRef} id="about" className="py-24 border-t border-slate-200 dark:border-slate-800">
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

            return (
              <div key={cat.label} ref={cat.label === "Cloud & Infrastructure" ? awsRowRef : undefined}>
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
                      expanded === skill.name ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-3">
                      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 max-w-xs">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                          {skill.description}
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {skill.subSkills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-1 text-xs rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-center"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
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
