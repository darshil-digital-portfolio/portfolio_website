import Typewriter from "./Typewriter";

const TYPED_LINE = "from data to deployment.";

const PROOF = [
  { value: "10", unit: " yrs", label: "At IBM India" },
  { value: "M.Tech", unit: null, label: "IIT Kharagpur" },
  { value: "7", unit: "+", label: "Enterprise clients" },
  { value: "CV · NLP · Agents", unit: null, label: "Full AI stack" },
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <p className="hero-eyebrow">
          <span>
            <span className="who">Darshil Kapadia</span> <span className="sep">/</span>{" "}
            <span className="role">AI Engineer</span>
          </span>
          <span className="live">
            <span className="pulse-dot" />
            Open to conversations
          </span>
        </p>

        {/* The typed half only exists after hydration, so the heading carries
            its full text as an accessible name. */}
        <h1 aria-label={`Production AI, ${TYPED_LINE}`}>
          <span aria-hidden="true">
            Production AI,
            <br />
            <Typewriter text={TYPED_LINE} className="typed grad" />
          </span>
        </h1>

        <p className="hero-sub">
          <span className="hl">10+ years</span> at <span className="hl">IBM India</span>, M.Tech from{" "}
          <span className="hl">IIT Kharagpur</span>. I architect end-to-end AI solutions for global
          enterprises — MLOps, model train &amp; fine-tune, and orchestrating{" "}
          <span className="hl-a">AI agents</span> at enterprise scale, secured under a{" "}
          <span className="hl-a">responsible-AI</span> framework, on <span className="hl-a">AWS</span>{" "}
          and <span className="hl-a">Azure</span>.
        </p>

        <div className="cta-row">
          <a href="#projects" className="btn btn-primary">
            View selected work <span className="arrow">↗</span>
          </a>
          <a href="/resume.pdf" download className="btn btn-ghost">
            Download résumé <span className="arrow">↓</span>
          </a>
        </div>

        <div className="proof">
          {PROOF.map(({ value, unit, label }) => (
            <div className="cell" key={label}>
              <div className="num">
                {value}
                {unit && <span className="unit">{unit}</span>}
              </div>
              <div className="lbl">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
