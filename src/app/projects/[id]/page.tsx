import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProjectCards } from "@/data/projectCards";
import type { ProjectCard } from "@/types/project";

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
  const { label, className, pulse } = STATUS_CONFIG[status];
  return (
    <span
      className={`shrink-0 flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full font-medium ${className}`}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
      {label}
    </span>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const cards = await getAllProjectCards();
  const project = cards.find((c) => c.id === id);
  if (!project) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <Link
        href="/#projects"
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-8 inline-block"
      >
        ← Back to Projects
      </Link>
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {project.title}
        </h1>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">{project.date}</p>
      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
        {project.long_description ?? project.description}
      </p>
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
      <div className="mb-8">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-3">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
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
        {project.links.live && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Live Demo ↗
          </a>
        )}
      </div>
    </main>
  );
}
