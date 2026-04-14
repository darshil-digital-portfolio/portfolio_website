export type ProjectStatus = "completed" | "in-progress" | "archived" | "online";

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
