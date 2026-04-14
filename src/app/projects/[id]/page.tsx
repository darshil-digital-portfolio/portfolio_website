import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProjects } from "@/data/projects";
import type { Project } from "@/types/project";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ id: p.id }));
}

function StatusBadge({ status }: { status: Project["status"] }) {
  if (status === "online") {
    return (
      <span className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Online
      </span>
    );
  }
  const map: Record<Exclude<Project["status"], "online">, string> = {
    completed: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
    "in-progress": "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400",
    archived: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  };
  const label: Record<Exclude<Project["status"], "online">, string> = {
    completed: "Completed",
    "in-progress": "In Progress",
    archived: "Archived",
  };
  return (
    <span className={`shrink-0 px-2 py-0.5 text-xs rounded-full font-medium ${map[status]}`}>
      {label[status]}
    </span>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = getAllProjects().find((p) => p.id === id);
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
        {project.longDescription ?? project.description}
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
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors"
          >
            View on GitHub ↗
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
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
