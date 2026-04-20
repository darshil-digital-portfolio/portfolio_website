"use client";

export function PrintButton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => window.print()}
        className="px-6 py-2.5 bg-stone-900 text-white text-xs tracking-[0.2em] uppercase hover:bg-orange-700 transition-colors duration-200"
        style={{ fontFamily: "monospace" }}
      >
        Print / Save as PDF
      </button>
      <p style={{ fontFamily: "monospace" }} className="text-[10px] text-stone-400">
        In the print dialog → uncheck <strong>Headers and footers</strong> to hide the URL
      </p>
    </div>
  );
}
