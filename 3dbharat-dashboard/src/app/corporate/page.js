"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Landmark, Users, Percent } from "lucide-react";
import { loadCorporateAnalytics } from "@/store/corporateSlice";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { LoadingState, ErrorState } from "@/components/ui/StatusState";
import { formatINR, formatPercent } from "@/utils/format";

const InvestmentGrowthChart = dynamic(
  () => import("@/components/dashboard/Charts").then((m) => ({ default: m.InvestmentGrowthChart })),
  { ssr: false, loading: () => <div className="h-[280px] rounded-2xl bg-surface-raised animate-pulse" /> }
);
const FundingBarChart = dynamic(
  () => import("@/components/dashboard/Charts").then((m) => ({ default: m.FundingBarChart })),
  { ssr: false, loading: () => <div className="h-[280px] rounded-2xl bg-surface-raised animate-pulse" /> }
);

export default function CorporatePage() {
  const dispatch = useDispatch();
  const { analytics, status, error } = useSelector((s) => s.corporate);

  useEffect(() => {
    dispatch(loadCorporateAnalytics());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Corporate dashboard</h1>
        <p className="text-sm text-text-muted mt-1">
          Platform-wide fundraising performance across every listed company.
        </p>
      </div>

      {status === "loading" && <LoadingState label="Aggregating fundraising data…" />}
      {status === "failed" && (
        <ErrorState message={error} onRetry={() => dispatch(loadCorporateAnalytics())} />
      )}

      {status === "succeeded" && analytics && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard
              label="Total funding raised"
              value={formatINR(analytics.totalFundingRaised)}
              sublabel="Across all listed deals"
              icon={Landmark}
              tone="accent"
            />
            <SummaryCard
              label="Investor count"
              value={analytics.investorCount}
              sublabel="Unique investors on platform"
              icon={Users}
              tone="accent2"
            />
            <SummaryCard
              label="Conversion rate"
              value={formatPercent(analytics.conversionRate)}
              sublabel="Deal views that led to a commitment"
              icon={Percent}
              tone="warn"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InvestmentGrowthChart data={analytics.fundingTrend} />
            <FundingBarChart
              data={analytics.fundingByIndustry}
              dataKey="total"
              nameKey="industry"
              title="Funding by industry"
              subtitle="Total raised, grouped by sector"
            />
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="font-display font-semibold text-sm mb-4">Top funded deals</h3>
            <div className="flex flex-col divide-y divide-border">
              {analytics.topDeals.map((deal, i) => (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="flex items-center justify-between py-3 text-sm hover:text-accent transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-surface-raised grid place-items-center text-xs text-text-muted">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-medium">{deal.name}</span>
                      <span className="text-text-muted"> · {deal.industry}</span>
                    </span>
                  </span>
                  <span className="font-medium tabular">{formatINR(deal.raisedSoFar)}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
