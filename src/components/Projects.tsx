import { getAllProjectCards } from "@/data/projectCards";
import ProjectsGrid from "./ProjectsGrid";

export default async function Projects() {
  const projects = await getAllProjectCards();

  return (
    <section className="section veil" id="projects">
      <div className="wrap">
        <div className="sec-head reveal-up">
          <div className="sec-label">02 — Selected work</div>
          <h2 className="sec-title">Things I&apos;ve built.</h2>
          <p className="sec-lead">
            Enterprise work at IBM is under NDA — these are the pieces I can show in the open.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-ink-soft">No projects yet.</p>
        ) : (
          <>
            <div className="note-line reveal-up">
              <span className="blip" />
              {projects.length} project{projects.length === 1 ? "" : "s"} · served from S3, fetched
              server-side · swipe / drag to browse
            </div>

            <div className="reveal-up">
              <ProjectsGrid projects={projects} />
            </div>

            <div className="more-work reveal-up">
              More on GitHub
              <span className="ln" />
              <a href="https://github.com/k-darshil" target="_blank" rel="noopener noreferrer">
                github.com/k-darshil ↗
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
