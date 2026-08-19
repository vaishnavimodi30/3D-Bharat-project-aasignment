"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useDeals } from "@/hooks/useDeals";
import { useInvestors } from "@/hooks/useInvestors";
import { getAllIndustries } from "@/services/dealService";
import { DealFilters } from "@/components/deals/DealFilters";
import { DealCard } from "@/components/deals/DealCard";
import { InvestorPersonaSelect } from "@/components/deals/InvestorPersonaSelect";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusState";
import { rankDealsForInvestor } from "@/utils/scoring";

const industries = getAllIndustries();

export default function DealExplorerPage() {
  const { filters, updateFilter, resetFilters, deals, total, page, pageSize, status, error, retry } =
    useDeals();
  const { investors } = useInvestors();
  const activeInvestorId = useSelector((s) => s.interests.activeInvestorId);

  const activeInvestor = useMemo(
    () => investors.find((i) => i.id === activeInvestorId) || null,
    [investors, activeInvestorId]
  );

  const rankedDeals = useMemo(
    () => rankDealsForInvestor(deals, activeInvestor),
    [deals, activeInvestor]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Deal explorer</h1>
          <p className="text-sm text-text-muted mt-1">
            Browse, filter, and sort every active deal. Pick an investor persona to see match scores.
          </p>
        </div>
        <div className="w-full sm:w-80">
          <InvestorPersonaSelect />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <DealFilters
            filters={filters}
            industries={industries}
            onChange={updateFilter}
            onReset={resetFilters}
            resultCount={total}
          />
        </aside>

        <div>
          {status === "loading" && <LoadingState label="Fetching matching deals…" />}
          {status === "failed" && <ErrorState message={error} onRetry={retry} />}
          {status === "succeeded" && rankedDeals.length === 0 && (
            <EmptyState
              title="No deals match those filters"
              message="Try widening your ROI range or clearing an industry filter."
              action={
                <button onClick={resetFilters} className="text-sm font-medium text-accent hover:underline">
                  Reset filters
                </button>
              }
            />
          )}
          {status === "succeeded" && rankedDeals.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {rankedDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
              <div className="mt-6">
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={(p) => updateFilter({ page: p })}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
