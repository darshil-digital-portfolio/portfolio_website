import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Articles from "@/components/Articles";
import {
  ProjectsGridSkeleton,
  ArticlesScrollerSkeleton,
} from "@/components/ProjectSkeleton";
import Experience from "@/components/Experience";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Suspense fallback={<ProjectsGridSkeleton />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<ArticlesScrollerSkeleton />}>
          <Articles />
        </Suspense>
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-400 dark:text-slate-600">
        © 2026 Darshil Kapadia
      </footer>
    </>
  );
}
