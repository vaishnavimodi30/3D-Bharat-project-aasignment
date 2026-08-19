"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Heart, MapPin } from "lucide-react";
import { toggleInterest } from "@/store/interestsSlice";
import { formatINR, formatPercent } from "@/utils/format";
import { MatchRing } from "./MatchRing";

const RISK_STYLES = {
  Low: "bg-accent-soft text-accent",
  Medium: "bg-warn/10 text-warn",
  High: "bg-danger/10 text-danger",
};

export function DealCard({ deal }) {
  const dispatch = useDispatch();
  const interested = useSelector((s) => s.interests.dealIds.includes(deal.id));
  const progress = Math.min(100, Math.round((deal.raisedSoFar / deal.investmentAsk) * 100));

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4 card-hover animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/deals/${deal.id}`} className="font-display font-semibold text-sm hover:text-accent transition-colors">
            {deal.name}
          </Link>
          <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
            <MapPin size={11} /> {deal.city} · {deal.stage}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {deal.matchScore != null && <MatchRing score={deal.matchScore} />}
          <button
            onClick={() => dispatch(toggleInterest(deal.id))}
            aria-label={interested ? "Remove from interests" : "Add to interests"}
            className={`w-8 h-8 rounded-lg grid place-items-center border transition-all duration-200 ${
              interested
                ? "border-accent bg-accent-soft text-accent scale-110"
                : "border-border text-text-muted hover:text-text hover:scale-110"
            }`}
          >
            <Heart size={14} fill={interested ? "currentColor" : "none"} className="transition-transform duration-200" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded-full text-xs bg-surface-raised border border-border text-text-muted">
          {deal.industry}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${RISK_STYLES[deal.risk]}`}>
          {deal.risk} risk
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-text-muted">Projected ROI</p>
          <p className="font-display font-semibold tabular">{formatPercent(deal.roi)}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Investment ask</p>
          <p className="font-display font-semibold tabular">{formatINR(deal.investmentAsk)}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
          <span>Raised {formatINR(deal.raisedSoFar)}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-raised overflow-hidden">
          <div
            className="h-full rounded-full bg-accent animate-progress"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Link
        href={`/deals/${deal.id}`}
        className="text-center text-sm font-medium py-2 rounded-lg border border-border hover:border-accent hover:text-accent hover:bg-accent-soft transition-all duration-200"
      >
        View details
      </Link>
    </div>
  );
}
