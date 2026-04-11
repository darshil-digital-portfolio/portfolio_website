export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <p className="text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-4">
          AI Engineer
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
          Darshil Kapadia
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-10">
          10 years at IBM India delivering computer vision, NLP, and agentic AI for global
          enterprises. I design, train, and ship end-to-end AI systems — from custom model
          fine-tuning to cloud-scale production deployment.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            View Projects
          </a>
          <a
            href="/resume.pdf"
            download
            className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}
