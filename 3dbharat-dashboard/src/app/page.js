"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { Wallet, Layers, TrendingUp, ShieldAlert } from "lucide-react";
import { loadDealSummary } from "@/store/dealsSlice";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { LoadingState, ErrorState } from "@/components/ui/StatusState";
import { formatINR, formatPercent } from "@/utils/format";

const InvestmentGrowthChart = dynamic(
  () => import("@/components/dashboard/Charts").then((m) => ({ default: m.InvestmentGrowthChart })),
  { ssr: false, loading: () => <div className="h-[280px] rounded-2xl bg-surface-raised animate-pulse" /> }
);
const IndustryDistributionChart = dynamic(
  () => import("@/components/dashboard/Charts").then((m) => ({ default: m.IndustryDistributionChart })),
  { ssr: false, loading: () => <div className="h-[280px] rounded-2xl bg-surface-raised animate-pulse" /> }
);
const RiskVsRoiChart = dynamic(
  () => import("@/components/dashboard/Charts").then((m) => ({ default: m.RiskVsRoiChart })),
  { ssr: false, loading: () => <div className="h-[300px] rounded-2xl bg-surface-raised animate-pulse" /> }
);

export default function OverviewPage() {
  const dispatch = useDispatch();
  const { summary, summaryStatus, summaryError } = useSelector((s) => s.deals);

  useEffect(() => {
    dispatch(loadDealSummary());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-up">
        <h1 className="font-display text-2xl font-semibold">Investor overview</h1>
        <p className="text-sm text-text-muted mt-1">
          A live snapshot of every active deal on the platform, simulated from mock data.
        </p>
      </div>

      {summaryStatus === "loading" && <LoadingState label="Crunching portfolio numbers…" />}
      {summaryStatus === "failed" && (
        <ErrorState message={summaryError} onRetry={() => dispatch(loadDealSummary())} />
      )}

      {summaryStatus === "succeeded" && summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard index={0} label="Total investments" value={formatINR(summary.totalInvestments)} sublabel="Raised across all deals" icon={Wallet} tone="accent" />
            <SummaryCard index={1} label="Active deals" value={summary.activeDeals} sublabel="Currently open for investment" icon={Layers} tone="accent2" />
            <SummaryCard index={2} label="Avg. projected ROI" value={formatPercent(summary.avgRoi)} sublabel="Across the full deal pipeline" icon={TrendingUp} tone="accent" />
            <SummaryCard index={3} label="High risk deals" value={summary.riskDistribution.find((r) => r.risk === "High")?.count ?? 0} sublabel="Flagged for elevated risk" icon={ShieldAlert} tone="warn" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up delay-300">
            <InvestmentGrowthChart data={summary.investmentGrowth} />
            <IndustryDistributionChart data={summary.industryDistribution} />
          </div>

          <div className="animate-fade-up delay-300">
            <RiskVsRoiChart data={summary.riskVsRoi} />
          </div>
        </>
      )}
    </div>
  );
}
