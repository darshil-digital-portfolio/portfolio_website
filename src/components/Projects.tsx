import { getAllProjectCards } from "@/data/projectCards";
import ProjectsGrid from "./ProjectsGrid";

export default async function Projects() {
  const projects = await getAllProjectCards();

  return (
    <section id="projects" className="py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-12">
          Projects
        </h2>
        {projects.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No projects yet.</p>
        ) : (
          <ProjectsGrid projects={projects} />
        )}
      </div>
    </section>
  );
}
