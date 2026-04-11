import { getAllProjects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const projects = getAllProjects();

  return (
    <section id="projects" className="py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-12">
          Projects
        </h2>
        {projects.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
