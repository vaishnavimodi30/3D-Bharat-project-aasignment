"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { ArrowLeft, Heart, MapPin, Calendar } from "lucide-react";
import { loadDealById, clearCurrentDeal } from "@/store/dealsSlice";
import { toggleInterest } from "@/store/interestsSlice";
import { LoadingState, ErrorState } from "@/components/ui/StatusState";
import { Tabs } from "@/components/ui/Tabs";
import { Accordion } from "@/components/ui/Accordion";
import { formatINR, formatPercent } from "@/utils/format";

const RoiProjectionChart = dynamic(
  () => import("@/components/dashboard/Charts").then((m) => ({ default: m.RoiProjectionChart })),
  { ssr: false, loading: () => <div className="h-[240px] rounded-2xl bg-surface-raised animate-pulse" /> }
);
const InvestmentGrowthChart = dynamic(
  () => import("@/components/dashboard/Charts").then((m) => ({ default: m.InvestmentGrowthChart })),
  { ssr: false, loading: () => <div className="h-[280px] rounded-2xl bg-surface-raised animate-pulse" /> }
);

const RISK_STYLES = {
  Low: "bg-accent-soft text-accent",
  Medium: "bg-warn/10 text-warn",
  High: "bg-danger/10 text-danger",
};

export default function DealDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const deals = useSelector((s) => s.deals);
  const interested = useSelector((s) => s.interests.dealIds.includes(id));

  // Try to find deal in already-loaded list first (instant display)
  const dealFromList = deals.list.items.find((d) => d.id === id);
  
  // Use cached deal if available, otherwise use the one from detailed fetch
  const deal = dealFromList || deals.current;
  const currentStatus = dealFromList ? "succeeded" : deals.currentStatus;

  useEffect(() => {
    // Only fetch if not already in the list (instant fallback for direct URL access)
    if (!dealFromList) {
      dispatch(loadDealById(id));
    }
    return () => dispatch(clearCurrentDeal());
  }, [dispatch, id, dealFromList]);

  if (currentStatus === "loading" || currentStatus === "idle") {
    return <LoadingState label="Loading deal details…" />;
  }
  if (currentStatus === "failed") {
    return <ErrorState message={deals.currentError} onRetry={() => dispatch(loadDealById(id))} />;
  }
  if (!deal) return null;

  const progress = Math.min(100, Math.round((deal.raisedSoFar / deal.investmentAsk) * 100));

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => router.push("/deals")}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text w-fit"
      >
        <ArrowLeft size={14} /> Back to explorer
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="px-2 py-0.5 rounded-full text-xs bg-surface-raised border border-border text-text-muted">
              {deal.industry}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${RISK_STYLES[deal.risk]}`}>
              {deal.risk} risk
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-surface-raised border border-border text-text-muted">
              {deal.stage}
            </span>
          </div>
          <h1 className="font-display text-2xl font-semibold">{deal.name}</h1>
          <p className="text-sm text-text-muted mt-1">{deal.tagline}</p>
          <div className="flex items-center gap-4 text-xs text-text-muted mt-2">
            <span className="flex items-center gap-1"><MapPin size={12} /> {deal.city}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> Founded {deal.foundedYear}</span>
          </div>
        </div>

        <button
          onClick={() => dispatch(toggleInterest(deal.id))}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-colors shrink-0 ${
            interested
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-text-muted hover:text-text"
          }`}
        >
          <Heart size={15} fill={interested ? "currentColor" : "none"} />
          {interested ? "In your interests" : "Add to interests"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Projected ROI" value={formatPercent(deal.roi)} />
        <Stat label="Investment ask" value={formatINR(deal.investmentAsk)} />
        <Stat label="Min. ticket size" value={formatINR(deal.minTicket)} />
        <Stat label="Investors so far" value={deal.investorsCount} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-text-muted">Raised {formatINR(deal.raisedSoFar)} of {formatINR(deal.investmentAsk)}</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface-raised overflow-hidden">
          <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Tabs
        tabs={[
          {
            id: "overview",
            label: "Company info",
            content: (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-text-muted leading-relaxed">{deal.description}</p>
                <div className="flex flex-wrap gap-2">
                  {deal.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-accent-2-soft text-accent-2">
                      {tag}
                    </span>
                  ))}
                </div>
                <InvestmentGrowthChart data={deal.monthlyGrowth} />
              </div>
            ),
          },
          {
            id: "financials",
            label: "Financials",
            content: (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Stat label="Revenue" value={formatINR(deal.financials.revenue)} />
                <Stat label="Expenses" value={formatINR(deal.financials.expenses)} />
                <Stat label="Valuation" value={formatINR(deal.financials.valuation)} />
                <Stat label="Monthly burn" value={formatINR(deal.financials.burnRateMonthly)} />
              </div>
            ),
          },
          {
            id: "roi",
            label: "ROI projections",
            content: <RoiProjectionChart data={deal.roiProjection} />,
          },
          {
            id: "risk",
            label: "Risk analysis",
            content: (
              <Accordion
                items={deal.riskFactors.map((factor) => ({
                  title: factor,
                  content:
                    "This is a simulated risk note for the demo dataset — in a real deployment this would surface underwriting commentary specific to the deal.",
                }))}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="font-display font-semibold tabular mt-1">{value}</p>
    </div>
  );
}
