import type { Project } from "@/types/project";

/**
 * Master list of portfolio projects.
 *
 * To add a new project, append an entry here (or run /add-project in Claude Code).
 * Fields marked optional can be omitted if not yet available.
 *
 * Ordering: featured projects first, then chronological descending.
 */
export const projects: Project[] = [
  // ── Add projects below ──────────────────────────────────────────────────
  // Example (remove before publishing):
  // {
  //   id: "example-rag-pipeline",
  //   title: "RAG Pipeline",
  //   description: "Production-grade retrieval-augmented generation system built on LangChain and Pinecone.",
  //   tags: ["LLM", "RAG", "Python", "LangChain", "Pinecone"],
  //   githubUrl: "https://github.com/darshil-digital-portfolio/rag-pipeline",
  //   featured: true,
  //   status: "completed",
  //   date: "2025-03",
  //   highlights: [
  //     "Handles 10k+ documents with sub-200ms retrieval latency",
  //     "Modular chunking strategy tunable per document type",
  //   ],
  // },
];

/** Returns only featured projects, sorted by date descending */
export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Returns all projects sorted by date descending */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.date.localeCompare(a.date));
}
