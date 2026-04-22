"use client";

import { useEffect, useRef } from "react";

interface MermaidDiagramProps {
  content: string;
  title: string;
}

export default function MermaidDiagram({ content, title }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });

      if (!ref.current || cancelled) return;
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      try {
        const { svg } = await mermaid.render(id, content);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<pre class="text-xs text-slate-500 whitespace-pre-wrap">${content}</pre>`;
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [content]);

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">
        {title}
      </p>
      <div ref={ref} className="overflow-x-auto flex justify-center" />
    </div>
  );
}
