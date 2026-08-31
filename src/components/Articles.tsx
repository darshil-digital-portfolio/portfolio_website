import { fetchArticles } from "@/lib/medium";
import ArticlesScroller from "./ArticlesScroller";

const MEDIUM_PROFILE = "https://medium.com/@kapadiadarshil25";

export default async function Articles() {
  const articles = await fetchArticles();
  if (articles.length === 0) return null;

  return (
    <section className="section veil" id="articles">
      <div className="wrap">
        <div className="sec-head reveal-up">
          <div className="sec-label">05 — Writing</div>
          <div className="head-row">
            <h2 className="sec-title">Thinking out loud.</h2>
            <a className="head-link" href={MEDIUM_PROFILE} target="_blank" rel="noopener noreferrer">
              See all on Medium ↗
            </a>
          </div>
          <p className="sec-lead">
            Notes on shipping AI to production — fine-tuning, agents, evals, and the unglamorous
            MLOps in between.
          </p>
        </div>

        <div className="note-line reveal-up">
          <span className="blip" />
          Posts fetched server-side from Medium · swipe / drag to browse
        </div>

        <div className="reveal-up">
          <ArticlesScroller articles={articles} />
        </div>
      </div>
    </section>
  );
}
