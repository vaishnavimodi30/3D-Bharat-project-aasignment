"use client";

import { useState, useCallback, useMemo } from "react";
import { X, GitCompare, TrendingUp, ShieldAlert, Wallet } from "lucide-react";
import { formatINR, formatPercent } from "@/utils/format";

// Simple context-free store using module-level state + custom event
// so CompareDrawer and DealCard can communicate without prop drilling.
let _compareIds = [];
const _listeners = new Set();

export function getCompareIds() { return _compareIds; }
export function toggleCompare(id) {
  if (_compareIds.includes(id)) {
    _compareIds = _compareIds.filter((x) => x !== id);
  } else if (_compareIds.length < 2) {
    _compareIds = [..._compareIds, id];
  }
  _listeners.forEach((fn) => fn([..._compareIds]));
}
export function useCompareIds() {
  const [ids, setIds] = useState([..._compareIds]);
  useState(() => {
    _listeners.add(setIds);
    return () => _listeners.delete(setIds);
  });
  // Re-subscribe on mount
  if (!_listeners.has(setIds)) _listeners.add(setIds);
  return ids;
}

const RISK_COLOR = { Low: "text-accent", Medium: "text-warn", High: "text-danger" };

function Row({ label, a, b, highlight }) {
  return (
    <div className={`grid grid-cols-[1fr_auto_1fr] gap-2 py-2.5 border-b border-border text-sm ${highlight ? "bg-accent-soft/30 -mx-4 px-4 rounded" : ""}`}>
      <span className="font-medium tabular text-right">{a}</span>
      <span className="text-xs text-text-muted text-center self-center w-28 shrink-0">{label}</span>
      <span className="font-medium tabular">{b}</span>
    </div>
  );
}

export function CompareDrawer({ deals }) {
  const ids = useCompareIds();
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => ids.map((id) => deals?.find((d) => d.id === id)).filter(Boolean),
    [ids, deals]
  );

  if (ids.length === 0) return null;

  return (
    <>
      {/* Floating trigger bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-up">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent text-white font-medium text-sm shadow-lg hover:bg-accent/90 transition-all hover:scale-105"
        >
          <GitCompare size={16} />
          {ids.length === 1 ? "Select 1 more to compare" : "Compare 2 deals"}
          <span className="w-5 h-5 rounded-full bg-white/20 grid place-items-center text-xs font-bold">
            {ids.length}
          </span>
        </button>
      </div>

      {/* Drawer */}
      {open && selected.length === 2 && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-2xl bg-surface rounded-2xl border border-border shadow-2xl animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display font-semibold">Deal comparison</h2>
              <button onClick={() => setOpen(false)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-raised transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[70vh]">
              {/* Headers */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-4">
                <div className="text-right">
                  <p className="font-display font-semibold text-sm">{selected[0].name}</p>
                  <p className="text-xs text-text-muted">{selected[0].industry} · {selected[0].stage}</p>
                </div>
                <div className="w-28 text-center text-xs text-text-muted self-center">vs</div>
                <div>
                  <p className="font-display font-semibold text-sm">{selected[1].name}</p>
                  <p className="text-xs text-text-muted">{selected[1].industry} · {selected[1].stage}</p>
                </div>
              </div>

              <Row label="Projected ROI" a={formatPercent(selected[0].roi)} b={formatPercent(selected[1].roi)} highlight={selected[0].roi !== selected[1].roi} />
              <Row label="Investment ask" a={formatINR(selected[0].investmentAsk)} b={formatINR(selected[1].investmentAsk)} />
              <Row label="Raised so far" a={formatINR(selected[0].raisedSoFar)} b={formatINR(selected[1].raisedSoFar)} />
              <Row label="Min. ticket" a={formatINR(selected[0].minTicket)} b={formatINR(selected[1].minTicket)} />
              <Row label="Risk" a={<span className={RISK_COLOR[selected[0].risk]}>{selected[0].risk}</span>} b={<span className={RISK_COLOR[selected[1].risk]}>{selected[1].risk}</span>} />
              <Row label="Investors" a={selected[0].investorsCount} b={selected[1].investorsCount} />
              <Row label="Founded" a={selected[0].foundedYear} b={selected[1].foundedYear} />
              <Row label="City" a={selected[0].city} b={selected[1].city} />
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-2">
              <button
                onClick={() => { _compareIds = []; _listeners.forEach(fn => fn([])); setOpen(false); }}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-surface-raised transition-colors"
              >
                Clear comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
