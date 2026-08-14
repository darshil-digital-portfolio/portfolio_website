"use client";

import { useEffect, useState } from "react";

const START_DELAY = 520;
const CHAR_DELAY = 58;
const CHAR_JITTER = 46;

interface TypewriterProps {
  /** Typed once, character by character. Never deleted, never cycled. */
  text: string;
  className?: string;
}

export default function Typewriter({ text, className }: TypewriterProps) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }

    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    function step() {
      i++;
      setShown(text.slice(0, i));
      if (i < text.length) {
        timer = setTimeout(step, CHAR_DELAY + Math.random() * CHAR_JITTER);
      }
    }

    timer = setTimeout(step, START_DELAY);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <span className="typed-line">
      <span className={className}>{shown}</span>
      <span className="caret" aria-hidden="true" />
    </span>
  );
}
