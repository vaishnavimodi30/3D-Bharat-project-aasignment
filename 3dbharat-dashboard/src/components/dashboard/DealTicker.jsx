"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Flame } from "lucide-react";
import { fetchDeals } from "@/services/dealService";
import { formatINR, formatPercent } from "@/utils/format";

export function DealTicker() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetchDeals({ sortBy: "raisedSoFar", sortDir: "desc", page: 1, pageSize: 15 })
      .then((res) => setDeals(res.items))
      .catch(() => {});
  }, []);

  if (!deals.length) return null;

  // Duplicate for seamless loop
  const items = [...deals, ...deals];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-surface py-2 relative">
      {/* fade edges */}
      <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

      <div className="flex gap-8 ticker-scroll">
        {items.map((deal, i) => {
          const progress = Math.round((deal.raisedSoFar / deal.investmentAsk) * 100);
          const isHot = progress >= 80;
          return (
            <Link
              key={`${deal.id}-${i}`}
              href={`/deals/${deal.id}`}
              className="flex items-center gap-2 whitespace-nowrap text-xs shrink-0 hover:text-accent transition-colors group"
            >
              {isHot && <Flame size={11} className="text-accent-2 shrink-0" />}
              <span className="font-medium">{deal.name}</span>
              <span className="text-text-muted">{deal.industry}</span>
              <span className="flex items-center gap-0.5 text-accent font-semibold">
                <TrendingUp size={10} />
                {formatPercent(deal.roi)}
              </span>
              <span className="text-text-muted">{formatINR(deal.raisedSoFar)} raised</span>
              <span className="w-px h-3 bg-border mx-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
