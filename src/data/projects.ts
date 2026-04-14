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
  {
    id: "icc-rankings",
    title: "ICC Rankings Dashboard",
    description:
      "Interactive dashboard tracking team performance across ICC cricket tournaments, with a LangGraph-powered AI agent for natural language querying.",
    longDescription:
      'A full-stack analytics dashboard that stores and visualises team performance data across ICC cricket tournaments using PostgreSQL. A LangGraph-based conversational AI agent sits on top of the data layer, enabling users to ask natural language questions — such as "Who has the best win rate in T20 World Cups?" — and receive structured, data-grounded answers. The agent translates questions into SQL queries, executes them against live data, and formats results into readable responses.',
    tags: ["LangGraph", "LangChain", "Python", "PostgreSQL", "AI Agent", "NLP", "SQL", "Dashboard"],
    githubUrl: "https://github.com/k-darshil/icc-rankings",
    liveUrl: "https://icc-rankings.darshil-ai.com",
    featured: true,
    status: "online",
    date: "2025-01",
    highlights: [
      "LangGraph agent translates natural language questions into SQL queries over live PostgreSQL data",
      "Tracks team rankings, head-to-head records, and tournament statistics across ICC formats (ODI, T20, Test)",
      "Modular agent architecture allows easy extension to new tournament types or additional data sources",
    ],
  },
];

/** Returns only featured projects, sorted by date descending */
export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured).sort((a, b) => b.date.localeCompare(a.date));
}

/** Returns all projects sorted by date descending */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.date.localeCompare(a.date));
}
