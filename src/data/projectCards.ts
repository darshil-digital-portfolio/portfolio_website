import type { ProjectCard } from "@/types/project";

const PROJECT_SLUGS: string[] = ["icc-rankings"];

const S3_BASE =
  "https://project-cards-for-portfolio.s3.ap-south-1.amazonaws.com";

async function fetchCard(slug: string): Promise<ProjectCard | null> {
  try {
    const res = await fetch(`${S3_BASE}/projects/${slug}/project_card.json`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`S3 ${res.status} for ${slug}`);
    return (await res.json()) as ProjectCard;
  } catch (err) {
    console.error(`[projectCards] failed to fetch ${slug}:`, err);
    return null;
  }
}

export async function getAllProjectCards(): Promise<ProjectCard[]> {
  const results = await Promise.all(PROJECT_SLUGS.map(fetchCard));
  const cards = results.filter((c): c is ProjectCard => c !== null);
  return cards.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

export { PROJECT_SLUGS };
