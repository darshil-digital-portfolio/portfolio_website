"use client";

import { useEffect } from "react";

/**
 * Reveals every `.reveal-up` on the page as it scrolls into view.
 *
 * Mounted once, rather than per-element, so server components can opt in with
 * a class name alone.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = new Set<HTMLElement>();

    if (reduced) {
      // Suspense streams sections in after mount, so watch for late arrivals.
      const reveal = () =>
        document.querySelectorAll<HTMLElement>(".reveal-up").forEach((el) => el.classList.add("in"));
      reveal();
      const mo = new MutationObserver(reveal);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    function collect() {
      for (const el of document.querySelectorAll<HTMLElement>(".reveal-up")) {
        if (targets.has(el)) continue;
        targets.add(el);
        observer.observe(el);
      }
    }
    collect();

    // Suspense streams sections in after mount, so watch for late arrivals.
    // The extra sweep covers one already on screen, which would otherwise sit
    // hidden until the next scroll if its observer entry were missed.
    const mutations = new MutationObserver(() => {
      collect();
      requestAnimationFrame(revealVisible);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    /**
     * Safety net: a silent observer must never leave content invisible.
     *
     * The handoff force-reveals *everything* after 1.6s, which would also
     * pre-reveal the whole page below the fold and kill the effect. This
     * reveals only what should already be on screen, so anything further down
     * still animates on scroll.
     */
    function revealVisible() {
      for (const el of targets) {
        if (el.classList.contains("in")) continue;
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("in");
          observer.unobserve(el);
        }
      }
    }

    const failsafe = setTimeout(revealVisible, 1600);
    window.addEventListener("scroll", revealVisible, { passive: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      clearTimeout(failsafe);
      window.removeEventListener("scroll", revealVisible);
    };
  }, []);

  return null;
}
