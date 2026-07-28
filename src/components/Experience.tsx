import { timeline } from "@/data/experience";

export default function Experience() {
  return (
    <section id="experience" className="py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-12">
          Experience
        </h2>
        <div className="relative">
          <div className="absolute left-1.5 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-10">
            {timeline.map((item) => (
              <div key={`${item.org}-${item.period}`} className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-blue-500 bg-white dark:bg-slate-950" />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {item.org}
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{item.role}</span>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500 sm:ml-auto">
                    {item.period}
                  </span>
                </div>
                {item.bullets && (
                  <ul className="space-y-1.5">
                    {item.bullets.map((b) => (
                      <li key={b} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                        <span className="text-blue-500 mt-0.5 shrink-0">›</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
