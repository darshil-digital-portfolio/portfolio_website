export type ProjectStatus =
  | "online" // deployed and live — visitor can interact right now
  | "offline" // exists but server stopped (e.g. cost saving); code is public
  | "showcase" // live demo / video exists; primary CTA is demo_video link
  | "prototype" // early proof-of-concept; rough edges expected
  | "deprecated" // superseded by a newer project
  | "sunset" // permanently shut down
  | "in-progress" // v1.0 compat — map same as offline with "In Progress" label
  | "completed" // v1.0 compat — map same as offline
  | "confidential" // company/NDA project; limited details shown
  | "archived" // no longer maintained
  | "error"; // deployment broken — honest signal

export type ProjectCategory =
  | "AI Agent"
  | "LLM App"
  | "Data Pipeline"
  | "ML Model"
  | "Analytics Dashboard"
  | "API Service"
  | "Full-Stack App"
  | "Dev Tool";

export type DiagramType =
  | "agent-workflow"
  | "data-flow"
  | "system-architecture"
  | "er-diagram"
  | "sequence"
  | "deployment"
  | "rag-pipeline"
  | "mlops-pipeline"
  | "state-machine";

export type MetricIcon = "database" | "speed" | "layers" | "cpu" | "chart" | "code";

export interface ProjectMetric {
  label: string;
  value?: string;
  icon: MetricIcon;
}

export interface ProjectDiagram {
  type: DiagramType;
  title: string;
  format?: "mermaid" | "svg" | "image";
  content?: string;
  url?: string;
}

export interface Milestone {
  date: string;
  label: string;
}

export interface TimelineEntry {
  started: string; // ISO YYYY-MM
  completed?: string | null; // null = "Present"
  milestones?: Milestone[];
}

/** Tag prefix → display group name */
export type TagGroup =
  | "AI / LLM"
  | "MLOps"
  | "Infrastructure"
  | "Auth"
  | "Compliance"
  | "Other";

/** Splits "rag:pgvector" → { prefix: "rag", value: "pgvector" }, "Python" → { prefix: null, value: "Python" } */
export function parseTag(tag: string): { prefix: string | null; value: string } {
  const idx = tag.indexOf(":");
  if (idx === -1) return { prefix: null, value: tag };
  return { prefix: tag.slice(0, idx), value: tag.slice(idx + 1) };
}

/** Maps tag prefix to its display group */
export const TAG_PREFIX_TO_GROUP: Record<string, TagGroup> = {
  llm: "AI / LLM",
  embed: "AI / LLM",
  finetune: "AI / LLM",
  rag: "AI / LLM",
  tracking: "MLOps",
  serving: "MLOps",
  observe: "MLOps",
  infra: "Infrastructure",
  auth: "Auth",
  compliance: "Compliance",
};

/** Schema written by the /make-project-card skill and fetched from S3 at build time */
export interface ProjectCard {
  schema_version: string;
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  long_description?: string;
  status: ProjectStatus;
  date: string;
  featured: boolean;
  tags: string[];
  highlights?: string[];
  metrics: ProjectMetric[];
  diagrams: ProjectDiagram[];
  links: {
    github?: string | null;
    live?: string | null;
    demo_video?: string | null;
  };
  thumbnail?: string | null;
  last_updated: string;
  // v2.0 fields
  industry?: string | null;
  timeline?: TimelineEntry | null;
  architecture_notes?: string | null;
  featured_diagram?: string | null;
  part_of?: string | null;
}

/** Legacy interface — kept for fallback entries in src/data/projects.ts */
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  status: ProjectStatus;
  date: string;
  highlights?: string[];
}
