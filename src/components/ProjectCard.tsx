import Link from "next/link";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const map: Record<Project["status"], string> = {
    completed: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
    "in-progress": "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400",
    archived: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  };
  const label: Record<Project["status"], string> = {
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

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {project.title}
        </h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
        {project.description}
      </p>
      {project.highlights && project.highlights.length > 0 && (
        <ul className="mb-4 space-y-1">
          {project.highlights.slice(0, 2).map((h) => (
            <li key={h} className="text-xs text-slate-500 dark:text-slate-400 flex gap-2">
              <span className="text-blue-500 mt-0.5 shrink-0">›</span>
              {h}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-4 text-sm">
        <Link
          href={`/projects/${project.id}`}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Details →
        </Link>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            GitHub ↗
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Live ↗
          </a>
        )}
      </div>
    </div>
  );
}
