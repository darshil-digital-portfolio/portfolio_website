import { XMLParser } from "fast-xml-parser";
import type { Article } from "@/types/article";

const FEED_URL = "https://medium.com/feed/@kapadiadarshil25";
const WORDS_PER_MINUTE = 220;
const SNIPPET_MAX_CHARS = 160;

interface RssItem {
  title?: string;
  link?: string;
  guid?: string | { "#text"?: string };
  pubDate?: string;
  category?: string | string[];
  "content:encoded"?: string;
}

interface RssFeed {
  rss?: { channel?: { item?: RssItem | RssItem[] } };
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "portfolio-website (+https://github.com/darshil-digital-portfolio)",
      },
    });
    if (!res.ok) {
      console.error(`Medium RSS fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const xml = await res.text();
    return parseFeed(xml);
  } catch (err) {
    console.error("Medium RSS fetch threw:", err);
    return [];
  }
}

function parseFeed(xml: string): Article[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    cdataPropName: "#cdata",
    textNodeName: "#text",
    parseTagValue: false,
    trimValues: true,
  });
  const parsed = parser.parse(xml) as RssFeed;
  const itemNode = parsed.rss?.channel?.item;
  if (!itemNode) return [];
  const items = Array.isArray(itemNode) ? itemNode : [itemNode];
  return items.map(toArticle).filter((a): a is Article => a !== null);
}

function toArticle(item: RssItem): Article | null {
  const title = readCdata(item.title);
  const rawLink = readCdata(item.link);
  if (!title || !rawLink) return null;

  const guidRaw = typeof item.guid === "string" ? item.guid : readCdata(item.guid);
  const id = guidRaw || rawLink;

  const link = cleanLink(rawLink);
  const isoDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
  const contentHtml = readCdata(item["content:encoded"]) ?? "";
  const coverImage = extractFirstImage(contentHtml);
  const plain = stripHtml(contentHtml);
  const snippet = buildSnippet(plain);
  const readMinutes = estimateReadMinutes(plain);
  const tags = normalizeTags(item.category);

  return { id, title, link, isoDate, snippet, coverImage, tags, readMinutes };
}

function readCdata(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object" && "#cdata" in value) {
    const inner = (value as { "#cdata"?: unknown })["#cdata"];
    if (typeof inner === "string") return inner.trim();
    if (Array.isArray(inner)) return inner.filter((s) => typeof s === "string").join("").trim();
  }
  if (typeof value === "object" && "#text" in value) {
    const t = (value as { "#text"?: unknown })["#text"];
    if (typeof t === "string") return t.trim();
  }
  return "";
}

function cleanLink(link: string): string {
  try {
    const url = new URL(link);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return link;
  }
}

function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : undefined;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<figure[\s\S]*?<\/figure>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSnippet(plain: string): string {
  if (plain.length <= SNIPPET_MAX_CHARS) return plain;
  const slice = plain.slice(0, SNIPPET_MAX_CHARS);
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = lastSpace > 80 ? slice.slice(0, lastSpace) : slice;
  return `${trimmed.replace(/[,.;:!?-]+$/, "")}…`;
}

function estimateReadMinutes(plain: string): number {
  const words = plain ? plain.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function normalizeTags(category: RssItem["category"]): string[] {
  if (!category) return [];
  const list = Array.isArray(category) ? category : [category];
  const cleaned = list
    .map((c) => readCdata(c))
    .filter((c) => c.length > 0)
    .map((c) => c.toLowerCase());
  return Array.from(new Set(cleaned));
}
