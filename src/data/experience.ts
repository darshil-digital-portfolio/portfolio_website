export interface TimelineItem {
  org: string;
  role: string;
  period: string;
  type: "work" | "education";
  bullets?: string[];
  /** Rendered as dashed pills under the bullets. */
  clients?: string[];
}

export const timeline: TimelineItem[] = [
  {
    org: "IBM India",
    role: "Data Scientist / AI Engineer",
    period: "Aug 2016 – Present",
    type: "work",
    // The client names moved out of this bullet into `clients` below, so they
    // are not printed twice.
    clients: ["PepsiCo", "Bacardi", "Dow Chemicals", "JSW", "FAA", "NedBank", "Iffco-Tokio"],
    bullets: [
      "Built end-to-end computer vision, NLP, and agentic AI solutions for global enterprise clients.",
      "Fine-tuned large language models using PEFT techniques (LoRA, QLoRA) and aligned models with RLHF; deployed RAG and GraphRAG pipelines in production.",
      "Designed and deployed ML systems on AWS and Azure with Docker, Kubernetes, and full MLOps practices.",
    ],
  },
  {
    org: "IIT Kharagpur",
    role: "M.Tech — Telecommunication Systems Engineering",
    period: "2014 – 2016",
    type: "education",
  },
  {
    org: "Dharmsinh Desai University (DDIT)",
    role: "B.Tech — Electronics & Communication Engineering",
    period: "2009 – 2013",
    type: "education",
  },
];
