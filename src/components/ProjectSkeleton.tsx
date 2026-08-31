// Loading states for the Suspense-streamed sections. These mirror the real
// section shells so the page does not reflow when the content lands.

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-bg-3 rounded ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-line/60 to-transparent" />
    </div>
  );
}

function SectionHeadSkeleton() {
  return (
    <div className="sec-head">
      <Shimmer className="h-3 w-32 mb-5" />
      <Shimmer className="h-11 w-2/3 max-w-md mb-4" />
      <Shimmer className="h-4 w-1/2 max-w-sm" />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="proj-card">
      <Shimmer className="aspect-[16/10] w-full rounded-none" />
      <div className="proj-body">
        <Shimmer className="h-3 w-14" />
        <Shimmer className="h-6 w-2/3" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-5/6" />
        <div className="flex gap-1.5 mt-auto">
          <Shimmer className="h-6 w-14 rounded-[7px]" />
          <Shimmer className="h-6 w-16 rounded-[7px]" />
          <Shimmer className="h-6 w-12 rounded-[7px]" />
        </div>
        <div className="flex gap-4 mt-1">
          <Shimmer className="h-4 w-16" />
          <Shimmer className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function ProjectsGridSkeleton() {
  return (
    <section className="section veil" id="projects">
      <div className="wrap">
        <SectionHeadSkeleton />
        <div className="scroller">
          <div className="track">
            {[0, 1, 2].map((i) => (
              <div className="scroll-card" key={i}>
                <ProjectCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="blog-card">
      <Shimmer className="aspect-[16/9] w-full rounded-none" />
      <div className="blog-body">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-5 w-11/12" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-4/5" />
        <div className="flex gap-1.5">
          <Shimmer className="h-6 w-12 rounded-[7px]" />
          <Shimmer className="h-6 w-16 rounded-[7px]" />
        </div>
        <Shimmer className="h-3 w-32 mt-auto" />
      </div>
    </div>
  );
}

export function ArticlesScrollerSkeleton() {
  return (
    <section className="section veil" id="articles">
      <div className="wrap">
        <SectionHeadSkeleton />
        <div className="scroller">
          <div className="track">
            {[0, 1, 2].map((i) => (
              <div className="scroll-card" key={i}>
                <ArticleCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
