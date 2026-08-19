"use client";

import { Loader2, AlertTriangle, Inbox } from "lucide-react";

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-muted">
      <Loader2 className="animate-spin" size={22} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="w-10 h-10 rounded-full bg-danger/10 grid place-items-center text-danger">
        <AlertTriangle size={18} />
      </span>
      <p className="text-sm text-text max-w-sm">
        {message || "Something went wrong while loading this data."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-accent hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="w-10 h-10 rounded-full bg-surface-raised border border-border grid place-items-center text-text-muted">
        <Inbox size={18} />
      </span>
      <p className="text-sm font-medium text-text">{title}</p>
      {message && <p className="text-sm text-text-muted max-w-sm">{message}</p>}
      {action}
    </div>
  );
}
