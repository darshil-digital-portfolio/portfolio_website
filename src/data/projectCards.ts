import { readFileSync } from "fs";
import { join } from "path";
import type { ProjectCard } from "@/types/project";

const GITHUB_ORG = "darshil-digital-portfolio";
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com";

/**
 * Repos in the GitHub org that have a project_card.json.
 * Add a repo slug here to include it in the portfolio.
 * Ordering determines display order (featured cards sorted first automatically).
 */
const PROJECT_REPOS: string[] = ["icc-rankings"];

function rawUrl(repo: string): string {
  return `${GITHUB_RAW_BASE}/${GITHUB_ORG}/${repo}/HEAD/project_card.json`;
}

function readCachedCard(repo: string): ProjectCard | null {
  try {
    const file = readFileSync(join(process.cwd(), `src/data/cache/${repo}.json`), "utf-8");
    return JSON.parse(file) as ProjectCard;
  } catch {
    return null;
  }
}

function resolveCard(card: ProjectCard, repo: string): ProjectCard {
  if (card.thumbnail && !card.thumbnail.startsWith("http")) {
    return {
      ...card,
      thumbnail: `${GITHUB_RAW_BASE}/${GITHUB_ORG}/${repo}/HEAD/${card.thumbnail}`,
    };
  }
  return card;
}

async function fetchCard(repo: string): Promise<ProjectCard | null> {
  try {
    const res = await fetch(rawUrl(repo), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return resolveCard((await res.json()) as ProjectCard, repo);
  } catch {
    // Fall back to last committed cache so a GitHub outage or missing file
    // never wipes a project off the portfolio on a fresh build.
    const cached = readCachedCard(repo);
    return cached ? resolveCard(cached, repo) : null;
  }
}

/** Fetches all project cards from GitHub at build time, with local cache fallback. */
export async function getAllProjectCards(): Promise<ProjectCard[]> {
  const results = await Promise.all(PROJECT_REPOS.map(fetchCard));
  const cards = results.filter((c): c is ProjectCard => c !== null);
  return cards.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

export { PROJECT_REPOS, rawUrl };
