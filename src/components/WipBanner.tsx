"use client";

import { useState } from "react";

export default function WipBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-50 bg-amber-950/90 backdrop-blur-sm border-b border-amber-800/60 text-amber-200 px-4 py-2">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="text-base leading-none">🚧</span>
          <span className="font-mono font-medium tracking-wide">
            work in progress
          </span>
          <span className="hidden sm:inline text-amber-400/60">·</span>
          <span className="hidden sm:inline text-amber-300/70 text-xs">
            some sections are still being built
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 text-amber-400/60 hover:text-amber-200 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
