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
    <section id="certifications" className="py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Certifications
          </h2>
          <a
            href={CREDLY_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            View all {CREDLY_TOTAL_COUNT} on Credly →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert) => (
            <a
              key={cert.id}
              href={cert.url ?? CREDLY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
            >
              <div className="shrink-0 w-14 h-14 relative">
                <Image
                  src={cert.imageUrl}
                  alt={cert.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cert.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cert.issuer}</p>
                <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                  {formatDate(cert.issuedDate)}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
