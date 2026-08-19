"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { fetchDeals } from "@/services/dealService";
import { DealCard } from "@/components/deals/DealCard";
import { LoadingState, EmptyState } from "@/components/ui/StatusState";
import { formatINR } from "@/utils/format";

export default function MyInvestmentsPage() {
  const interestIds = useSelector((s) => s.interests.dealIds);
  const [allDeals, setAllDeals] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    fetchDeals({ page: 1, pageSize: 999 })
      .then((res) => !cancelled && setAllDeals(res.items))
      .finally(() => !cancelled && setStatus("succeeded"));
    return () => {
      cancelled = true;
    };
  }, []);

  const interestedDeals = useMemo(
    () => allDeals.filter((d) => interestIds.includes(d.id)),
    [allDeals, interestIds]
  );

  const totalAsk = interestedDeals.reduce((s, d) => s + d.investmentAsk, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">My interests</h1>
        <p className="text-sm text-text-muted mt-1">
          Deals you&apos;ve saved, kept locally in your browser.
        </p>
      </div>

      {status === "loading" && <LoadingState label="Loading your saved deals…" />}

      {status === "succeeded" && interestedDeals.length === 0 && (
        <EmptyState
          title="No saved deals yet"
          message="Tap the heart icon on any deal in the explorer to save it here."
        />
      )}

      {status === "succeeded" && interestedDeals.length > 0 && (
        <>
          <div className="rounded-2xl border border-border bg-surface p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted">Saved deals</p>
              <p className="font-display font-semibold text-lg">{interestedDeals.length}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Combined investment ask</p>
              <p className="font-display font-semibold text-lg tabular">{formatINR(totalAsk)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {interestedDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
