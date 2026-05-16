"use client";

interface DrawioDiagramProps {
  title: string;
  url: string;
}

/**
 * Renders a draw.io diagram using viewer.diagrams.net as an iframe embed.
 * Accepts relative /api/s3/... proxy URLs — resolves to absolute via window.location.origin
 * so viewer.diagrams.net can fetch the file from the portfolio server.
 */
export default function DrawioDiagram({ title, url }: DrawioDiagramProps) {
  const absoluteUrl =
    typeof window !== "undefined" && url.startsWith("/")
      ? `${window.location.origin}${url}`
      : url;
  const viewerUrl = `https://viewer.diagrams.net/?url=${encodeURIComponent(absoluteUrl)}&toolbar=false&nav=false&fit=1`;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      <iframe
        src={viewerUrl}
        title={title}
        width="100%"
        height="520"
        style={{ border: "none", display: "block" }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
