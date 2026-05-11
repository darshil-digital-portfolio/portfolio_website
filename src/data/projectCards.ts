import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { ProjectCard } from "@/types/project";

const PROJECT_SLUGS: string[] = ["icc-rankings"];

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME ?? "project-cards-for-portfolio";

async function fetchCard(slug: string): Promise<ProjectCard | null> {
  try {
    const cmd = new GetObjectCommand({
      Bucket: BUCKET,
      Key: `projects/${slug}/project_card.json`,
    });
    const res = await s3.send(cmd);
    const body = await res.Body?.transformToString();
    if (!body) throw new Error(`Empty body for ${slug}`);
    return JSON.parse(body) as ProjectCard;
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
