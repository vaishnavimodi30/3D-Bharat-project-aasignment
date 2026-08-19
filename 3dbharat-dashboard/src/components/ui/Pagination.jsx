"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const pages = [];
  const window = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - window && p <= page + window)) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-8 h-8 grid place-items-center rounded-lg border border-border text-text-muted disabled:opacity-40 hover:text-text hover:not-disabled:bg-surface-raised"
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 grid place-items-center text-text-muted text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm grid place-items-center transition-colors ${
              p === page
                ? "bg-accent text-white font-medium"
                : "border border-border text-text-muted hover:text-text hover:bg-surface-raised"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-8 h-8 grid place-items-center rounded-lg border border-border text-text-muted disabled:opacity-40 hover:text-text hover:not-disabled:bg-surface-raised"
        aria-label="Next page"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
