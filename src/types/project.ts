export type ProjectStatus =
  | "online" // deployed and live — visitor can interact right now
  | "offline" // exists but server stopped (e.g. cost saving); code is public
  | "in-progress" // actively being built
  | "completed" // built and done; no live deployment
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
  | "deployment";

export type MetricIcon = "database" | "speed" | "layers" | "cpu" | "chart" | "code";

export interface ProjectMetric {
  label: string;
  icon: MetricIcon;
}

export interface ProjectDiagram {
  type: DiagramType;
  title: string;
  format: "mermaid" | "image";
  /** Mermaid source when format === "mermaid" */
  content?: string;
  /** Relative path or URL when format === "image" */
  url?: string;
}

/** Schema written by the /make-project-card skill and fetched from GitHub raw at build time */
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
}

/** Legacy interface — kept for fallback entries in src/data/projects.ts */
export interface Project {
  /** Unique slug used in URLs, e.g. "rag-pipeline" */
  id: string;
  title: string;
  /** One-line teaser shown on the card */
  description: string;
  /** Full markdown-friendly description shown on detail view */
  longDescription?: string;
  /** Tech/domain tags, e.g. ["LLM", "RAG", "Python"] */
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  /** Path under /public or an absolute URL */
  imageUrl?: string;
  featured: boolean;
  status: ProjectStatus;
  /** Month of completion/start — ISO format YYYY-MM */
  date: string;
  /** 2-4 bullet points of key achievements */
  highlights?: string[];
}
