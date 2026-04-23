function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-slate-100/60 dark:via-slate-700/60 to-transparent" />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <Shimmer className="h-44 w-full rounded-none" />
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <Shimmer className="h-5 w-2/3" />
          <Shimmer className="h-5 w-16 rounded-full" />
        </div>
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-5/6" />
        <Shimmer className="h-4 w-4/5" />
        <div className="flex gap-2 mt-1">
          <Shimmer className="h-5 w-14 rounded-full" />
          <Shimmer className="h-5 w-16 rounded-full" />
          <Shimmer className="h-5 w-12 rounded-full" />
        </div>
        <div className="flex gap-3 mt-2">
          <Shimmer className="h-4 w-16" />
          <Shimmer className="h-4 w-4 rounded" />
          <Shimmer className="h-4 w-4 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProjectsGridSkeleton() {
  return (
    <section id="projects" className="py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <Shimmer className="h-9 w-32 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
