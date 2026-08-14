import { timeline } from "@/data/experience";

const current = timeline.find((item) => item.type === "work");

export default function Experience() {
  return (
    <section className="section veil" id="experience">
      <div className="wrap">
        <div className="sec-head reveal-up">
          <div className="sec-label">03 — Experience</div>
          <h2 className="sec-title">A decade in the field.</h2>
        </div>

        <div className="grid-2">
          {current && (
            <div className="tl-aside reveal-up">
              {current.period}
              <br />
              {current.role}
              <br />
              {current.org}
            </div>
          )}

          <div className="timeline reveal-up">
            {timeline.map((item) => (
              <div className="tl-item" key={`${item.org}-${item.period}`}>
                <div className={`tl-dot${item.type === "education" ? " edu" : ""}`} />

                <div className="tl-head">
                  <span className="tl-org">{item.org}</span>
                  <span className="tl-role">{item.role}</span>
                  <span className="tl-period">{item.period}</span>
                </div>

                {item.bullets && (
                  <ul className="tl-bullets">
                    {item.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}

                {item.clients && (
                  <div className="clients">
                    {item.clients.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
