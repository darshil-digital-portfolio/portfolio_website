import Image from "next/image";
import {
  getFeaturedCertifications,
  CREDLY_PROFILE_URL,
  CREDLY_TOTAL_COUNT,
} from "@/data/certifications";

function formatDate(yyyyMm: string): string {
  const [year, month] = yyyyMm.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function Certifications() {
  const certs = getFeaturedCertifications();

  return (
    <section className="section veil" id="certifications">
      <div className="wrap">
        <div className="sec-head reveal-up">
          <div className="sec-label">04 — Certifications</div>
          <div className="cert-head">
            <h2 className="sec-title">Credentials.</h2>
            <a
              className="credly"
              href={CREDLY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View all {CREDLY_TOTAL_COUNT} on Credly ↗
            </a>
          </div>
        </div>

        <div className="cert-grid reveal-up">
          {certs.map((cert) => (
            <a
              key={cert.id}
              className="cert-card"
              href={cert.url ?? CREDLY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="cert-badge">
                <Image src={cert.imageUrl} alt="" fill sizes="60px" unoptimized />
              </span>
              <span className="cert-info">
                <span className="cn">{cert.name}</span>
                <span className="iss">{cert.issuer}</span>
                <span className="dt">{formatDate(cert.issuedDate)}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
