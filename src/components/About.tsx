"use client";

import { useEffect, useRef, useState } from "react";

type SubSkillGroup = { label: string; items: string[] };

type ExpandableSkill = {
  name: string;
  description: string;
  subSkills?: string[];
  subSkillGroups?: SubSkillGroup[];
};

type SkillItem = string | ExpandableSkill;

const isExpandable = (s: SkillItem): s is ExpandableSkill => typeof s === "object";

const skillCategories: { label: string; skills: SkillItem[] }[] = [
  {
    label: "Generative AI",
    skills: [
      {
        name: "Autoregressive Models",
        description:
          "Decoder-only transformers trained on next-token prediction. State of the art for open-ended generation, reasoning, and instruction following.",
        subSkills: ["OpenAI Models", "Claude", "LLaMA 3.3", "LLaMA 3.1"],
      },
      {
        name: "Encoder-only Models",
        description:
          "Bidirectional transformers that produce rich contextual embeddings. Best suited for classification, NER, and semantic similarity.",
        subSkills: ["BERT", "RoBERTa", "DistilBERT"],
      },
      {
        name: "Encoder-Decoder Models",
        description:
          "Seq2seq architecture mapping input sequences to output sequences. Used for summarisation, translation, and question answering.",
        subSkills: ["T5", "BART", "mT5"],
      },
      {
        name: "Diffusion Models",
        description:
          "Generative models that learn to reverse a noise process. State of the art for high-fidelity image and media synthesis.",
        subSkills: ["Stable Diffusion", "DALL-E", "Imagen"],
      },
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
      {
        name: "Object Detection",
        description:
          "Region-based and anchor-free detectors for localising and classifying objects in images. Applied in insurance claim assessment and industrial inspection.",
        subSkills: ["YOLO", "R-CNN", "Faster R-CNN", "Mask R-CNN"],
      },
      {
        name: "Convolutional Models",
        description:
          "Hierarchical spatial feature extractors. Backbone of most computer vision pipelines for classification and representation learning.",
        subSkills: ["CNN", "ResNet", "VGG", "EfficientNet"],
      },
      {
        name: "Sequential Models",
        description:
          "Recurrent architectures that model temporal and sequential dependencies. Applied in OCR, time-series analysis, and sequence labelling.",
        subSkills: ["RNN", "LSTM", "CRNN", "GRU"],
      },
      {
        name: "Transformer Architecture",
        description:
          "Attention-based architecture that unified NLP and vision. Trained via self-supervised objectives before task-specific fine-tuning.",
        subSkills: ["Self-Supervised Learning", "Masked LM", "Contrastive Learning", "Multi-Head Attention", "ViT", "CLIP"],
      },
      {
        name: "Generative Adversarial Networks",
        description:
          "Adversarial generator–discriminator framework for producing realistic synthetic data and high-quality image generation.",
        subSkills: ["GAN", "DCGAN", "StyleGAN", "CycleGAN"],
      },
      {
        name: "Graph Neural Networks",
        description:
          "Message-passing networks that learn on graph-structured data — knowledge graphs, recommendation systems, and molecular modelling.",
        subSkills: ["GCN", "GraphSAGE", "GAT", "Graph Transformer"],
      },
      {
        name: "Reinforcement Learning",
        description:
          "Policy optimisation through environment interaction. Underpins LLM alignment (RLHF) and sequential decision-making agents.",
        subSkills: ["PPO", "DQN", "A3C"],
      },
      {
        name: "Model Distillation",
        description:
          "Compressing large teacher models into faster, smaller student models while preserving accuracy — critical for production deployment.",
        subSkills: ["Knowledge Distillation", "DistilBERT", "TinyBERT", "Quantisation"],
      },
      {
        name: "Traditional ML",
        description:
          "Classical algorithms for structured and tabular data. Fast to train, interpretable, and often the right tool before reaching for deep learning.",
        subSkillGroups: [
          {
            label: "Supervised",
            items: ["XGBoost", "LightGBM", "Random Forest", "AdaBoost", "SVM", "Decision Trees", "k-NN", "Logistic Regression"],
          },
          {
            label: "Unsupervised",
            items: ["PCA", "K-Means", "DBSCAN", "t-SNE", "UMAP", "Isolation Forest"],
          },
        ],
      },
      "TensorFlow",
      "PyTorch",
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
    skills: ["FastAPI", "Pandas", "scikit-learn", "OpenCV", "NetworkX", "Bokeh"],
  },
  {
    label: "Cloud & Infrastructure",
    skills: [
      {
        name: "AWS",
        description:
          "Hands-on experience with core AWS services for data engineering, ML workloads, and application infrastructure.",
        subSkills: [
          "EC2", "S3", "RDS", "VPC", "DynamoDB",
          "SageMaker", "Bedrock", "Lambda", "EKS", "Fargate", "IAM",
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

// First expandable skill across all categories — used for the auto-hint animation
const firstExpandableCategory = skillCategories.find((c) => c.skills.some(isExpandable));
const firstExpandableName = firstExpandableCategory?.skills.find(isExpandable)?.name ?? null;

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
            const isFirstExpandableCat = cat.label === firstExpandableCategory?.label;

            return (
              <div
                key={cat.label}
                ref={isFirstExpandableCat ? firstExpandableRef : undefined}
              >
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
