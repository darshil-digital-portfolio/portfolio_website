import { Suspense } from "react";
import NeuralBackground from "@/components/NeuralBackground";
import ScrollReveal from "@/components/ScrollReveal";
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
      <NeuralBackground />
      <ScrollReveal />
      <div className="page">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Suspense fallback={<ProjectsGridSkeleton />}>
            <Projects />
          </Suspense>
          <Experience />
          <Certifications />
          {/* Writing sits at 05, between Certs and Contact, per the design's
              section numbering. The component itself is untouched. */}
          <Suspense fallback={<ArticlesScrollerSkeleton />}>
            <Articles />
          </Suspense>
          <Contact />
        </main>
        <footer className="foot">
          <div className="wrap">
            <span>© 2026 Darshil Kapadia</span>
            <span>Built in India</span>
          </div>
        </footer>
      </div>
    </>
  );
}
