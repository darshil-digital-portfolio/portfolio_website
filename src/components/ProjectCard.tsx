import Link from "next/link";
import Image from "next/image";
import type { ProjectCard } from "@/types/project";

interface ProjectCardProps {
  project: ProjectCard;
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

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 transition-colors overflow-hidden">
      {project.thumbnail && (
        <div className="relative w-full h-44 shrink-0">
          <Image
            src={project.thumbnail}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover object-top"
            sizes="(min-width: 768px) 50vw, 100vw"
            unoptimized
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-6">
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
        <div className="mt-auto flex items-center gap-3 text-sm">
          <Link
            href={`/projects/${project.id}`}
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Details →
          </Link>
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live demo"
              className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
