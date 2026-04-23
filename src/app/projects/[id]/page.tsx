import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllProjectCards } from "@/data/projectCards";
import type { ProjectCard, MetricIcon, TimelineEntry } from "@/types/project";
import { parseTag, TAG_PREFIX_TO_GROUP } from "@/types/project";
import DiagramTabs from "@/components/DiagramTabs";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const cards = await getAllProjectCards();
  return cards.map((c) => ({ id: c.id }));
}

const STATUS_CONFIG: Record<
  ProjectCard["status"],
  { label: string; className: string; pulse?: boolean }
> = {
  online: {
    label: "Live",
    className: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
    pulse: true,
  },
  offline: {
    label: "Offline",
    className: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
  },
  showcase: {
    label: "Showcase",
    className: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
  },
  prototype: {
    label: "Prototype",
    className: "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400",
  },
  deprecated: {
    label: "Deprecated",
    className: "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500",
  },
  sunset: {
    label: "Sunset",
    className: "bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
  },
  confidential: {
    label: "Confidential",
    className: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400",
  },
  archived: {
    label: "Archived",
    className: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
  },
  error: {
    label: "Error",
    className: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
  },
};

function StatusBadge({ status }: { status: ProjectCard["status"] }) {
  const { label, className, pulse } = STATUS_CONFIG[status] ?? STATUS_CONFIG.offline;
  return (
    <span
      className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium ${className}`}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
      {label}
    </span>
  );
}

function formatMonth(iso: string): string {
  const [year, month] = iso.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(timeline: TimelineEntry): string {
  const start = formatMonth(timeline.started);
  if (!timeline.completed) return `${start} – Present`;
  const end = formatMonth(timeline.completed);
  const [sy, sm] = timeline.started.split("-").map(Number);
  const [ey, em] = timeline.completed.split("-").map(Number);
  const months = (ey - sy) * 12 + (em - sm);
  const duration =
    months < 12
      ? `${months} month${months !== 1 ? "s" : ""}`
      : months % 12 === 0
        ? `${months / 12} yr${months / 12 !== 1 ? "s" : ""}`
        : `${(months / 12).toFixed(1)} yrs`;
  return `${start} – ${end} · ${duration}`;
}

function ProjectTimeline({ timeline }: { timeline: TimelineEntry }) {
  type TimelinePoint = { date: string | null; label: string; isAnchor: boolean };
  const points: TimelinePoint[] = [
    { date: timeline.started, label: "Started", isAnchor: true },
    ...(timeline.milestones ?? []).map((m) => ({ date: m.date, label: m.label, isAnchor: false })),
    timeline.completed
      ? { date: timeline.completed, label: "Completed", isAnchor: true }
      : { date: null, label: "Present", isAnchor: true },
  ];

  return (
    <div className="relative pl-8">
      {points.map((point, i) => (
        <div key={i} className="relative mb-5 last:mb-0">
          {i < points.length - 1 && (
            <div className="absolute left-[-22px] top-5 w-px bg-slate-200 dark:bg-slate-700 bottom-[-20px]" />
          )}
          <div
            className={`absolute left-[-27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
              point.isAnchor
                ? "bg-blue-500 border-blue-500"
                : "bg-white dark:bg-slate-950 border-slate-400 dark:border-slate-600"
            }`}
          />
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-slate-400 dark:text-slate-500 w-24 shrink-0">
              {point.date ? formatMonth(point.date) : "Present"}
            </span>
            <span
              className={`text-sm ${
                point.isAnchor
                  ? "font-medium text-slate-700 dark:text-slate-300"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {point.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricIconSvg({ icon }: { icon: MetricIcon }) {
  switch (icon) {
    case "database":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case "speed":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case "layers":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "cpu":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      );
    case "chart":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      );
    case "code":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}

type TagGroupEntry = { group: string; tags: string[] };

function groupTags(tags: string[]): TagGroupEntry[] {
  const groups: Record<string, string[]> = {};
  const ungrouped: string[] = [];

  for (const tag of tags) {
    const { prefix, value } = parseTag(tag);
    if (prefix) {
      const group = TAG_PREFIX_TO_GROUP[prefix] ?? "Other";
      (groups[group] ??= []).push(value);
    } else {
      ungrouped.push(value);
    }
  }

  const result: TagGroupEntry[] = Object.entries(groups).map(([group, t]) => ({ group, tags: t }));
  if (ungrouped.length > 0) result.push({ group: "Tech Stack", tags: ungrouped });
  return result;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const cards = await getAllProjectCards();
  const project = cards.find((c) => c.id === id);
  if (!project) notFound();

  const isShowcase = project.status === "showcase";
  const tagGroups = groupTags(project.tags);
  const dateDisplay = project.timeline?.started
    ? formatDateRange(project.timeline)
    : project.date;

  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <Link
        href="/#projects"
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-8 inline-block"
      >
        ← Back to Projects
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {project.title}
        </h1>
        <StatusBadge status={project.status} />
      </div>
      <div className="flex items-center gap-3 mb-6">
        <p className="text-sm text-slate-400 dark:text-slate-500">{dateDisplay}</p>
        {project.industry && (
          <span className="px-2.5 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
            {project.industry}
          </span>
        )}
      </div>

      {/* Thumbnail */}
      {project.thumbnail && (
        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8 border border-slate-200 dark:border-slate-700">
          <Image
            src={project.thumbnail}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover object-top"
            sizes="768px"
            unoptimized
          />
        </div>
      )}

      {/* Description */}
      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
        {project.long_description ?? project.description}
      </p>

      {/* Architecture notes */}
      {project.architecture_notes && (
        <div className="mb-8 pl-4 border-l-4 border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30 rounded-r-lg py-4 pr-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 dark:text-blue-400 mb-2">
            Design Decisions
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {project.architecture_notes}
          </p>
        </div>
      )}

      {/* Highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-3">
            Highlights
          </h2>
          <ul className="space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-blue-500 mt-0.5 shrink-0">›</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline */}
      {project.timeline && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-4">
            Timeline
          </h2>
          <ProjectTimeline timeline={project.timeline} />
        </div>
      )}

      {/* Tags grouped */}
      {tagGroups.length > 0 && (
        <div className="mb-8 space-y-4">
          {tagGroups.map(({ group, tags }) => (
            <div key={group}>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">
                {group}
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-3">
            Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3"
              >
                <span className="text-blue-500 dark:text-blue-400 shrink-0">
                  <MetricIconSvg icon={m.icon} />
                </span>
                <div>
                  {m.value && (
                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {m.value}
                    </p>
                  )}
                  <p className="text-sm text-slate-600 dark:text-slate-400">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagrams */}
      {project.diagrams && project.diagrams.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-4">
            Architecture
          </h2>
          <DiagramTabs
            diagrams={project.diagrams}
            featuredDiagram={project.featured_diagram}
          />
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-wrap gap-4">
        {isShowcase && project.links.demo_video && (
          <a
            href={project.links.demo_video}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Demo
          </a>
        )}
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors"
          >
            View on GitHub ↗
          </a>
        )}
        {project.links.live && !isShowcase && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Live Demo ↗
          </a>
        )}
        {project.links.demo_video && !isShowcase && (
          <a
            href={project.links.demo_video}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Demo
          </a>
        )}
      </div>
    </main>
  );
}
