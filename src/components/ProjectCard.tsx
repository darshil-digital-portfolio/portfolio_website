import Link from "next/link";
import type { ProjectCard } from "@/types/project";
import ThumbnailImage from "./ThumbnailImage";

interface ProjectCardProps {
  project: ProjectCard;
}

/** Only "online" gets the live green treatment; everything else reads as quiet. */
const STATUS_LABEL: Record<ProjectCard["status"], string> = {
  online: "Live",
  offline: "Offline",
  showcase: "Showcase",
  prototype: "Prototype",
  deprecated: "Deprecated",
  sunset: "Sunset",
  "in-progress": "In progress",
  completed: "Completed",
  confidential: "Confidential",
  archived: "Archived",
  error: "Unavailable",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const isLive = project.status === "online";
  const label = STATUS_LABEL[project.status] ?? STATUS_LABEL.offline;

  return (
    <div className="proj-card">
      <div className={`proj-shot${project.thumbnail ? "" : " empty"}`}>
        {project.thumbnail ? (
          <ThumbnailImage
            src={project.thumbnail}
            alt={`${project.title} screenshot`}
            sizes="(min-width: 861px) 360px, 86vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="ph">
            <b>[ no screenshot ]</b>
            {project.id} · 16:10
          </div>
        )}
      </div>

      <div className="proj-body">
        <span className={`proj-status${isLive ? "" : " idle"}`}>
          <span className="pulse" />
          {label}
        </span>

        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="proj-tags">
          {project.tags.map((tag) => {
            const colonIdx = tag.indexOf(":");
            return <span key={tag}>{colonIdx !== -1 ? tag.slice(colonIdx + 1) : tag}</span>;
          })}
        </div>

        <div className="proj-links">
          <Link href={`/projects/${project.id}`}>Details ↗</Link>
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer">
              Live ↗
            </a>
          )}
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer">
              Source ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
