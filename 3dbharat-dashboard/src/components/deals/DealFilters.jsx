"use client";

import { Search, X, ArrowUpDown } from "lucide-react";

const RISK_LEVELS = ["Low", "Medium", "High"];
const SORT_OPTIONS = [
  { value: "roi", label: "ROI" },
  { value: "investmentAsk", label: "Investment size" },
  { value: "raisedSoFar", label: "Raised so far" },
  { value: "name", label: "Name" },
];

export function DealFilters({ filters, industries, onChange, onReset, resultCount }) {
  function toggleIndustry(ind) {
    const next = filters.industries.includes(ind)
      ? filters.industries.filter((i) => i !== ind)
      : [...filters.industries, ind];
    onChange({ industries: next });
  }

  function toggleRisk(risk) {
    const next = filters.riskLevels.includes(risk)
      ? filters.riskLevels.filter((r) => r !== risk)
      : [...filters.riskLevels, risk];
    onChange({ riskLevels: next });
  }

  const hasActiveFilters =
    filters.search ||
    filters.industries.length ||
    filters.riskLevels.length ||
    filters.minRoi !== undefined ||
    filters.maxRoi !== undefined ||
    filters.minInvestment !== undefined ||
    filters.maxInvestment !== undefined;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-5">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search company, industry, city…"
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-bg border border-border text-sm outline-none focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
          Industry
        </p>
        <div className="flex flex-wrap gap-1.5">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => toggleIndustry(ind)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                filters.industries.includes(ind)
                  ? "bg-accent-soft border-accent text-accent font-medium"
                  : "border-border text-text-muted hover:text-text"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Risk</p>
        <div className="flex gap-1.5">
          {RISK_LEVELS.map((risk) => (
            <button
              key={risk}
              onClick={() => toggleRisk(risk)}
              className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                filters.riskLevels.includes(risk)
                  ? "bg-accent-soft border-accent text-accent font-medium"
                  : "border-border text-text-muted hover:text-text"
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
          ROI range (%)
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minRoi ?? ""}
            onChange={(e) =>
              onChange({ minRoi: e.target.value === "" ? undefined : Number(e.target.value) })
            }
            className="w-full px-2.5 py-2 rounded-lg bg-bg border border-border text-sm outline-none focus-visible:outline-2 focus-visible:outline-accent"
          />
          <span className="text-text-muted text-xs">to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxRoi ?? ""}
            onChange={(e) =>
              onChange({ maxRoi: e.target.value === "" ? undefined : Number(e.target.value) })
            }
            className="w-full px-2.5 py-2 rounded-lg bg-bg border border-border text-sm outline-none focus-visible:outline-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
          Investment ask (₹ Cr)
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minInvestment != null ? filters.minInvestment / 10000000 : ""}
            onChange={(e) =>
              onChange({
                minInvestment: e.target.value === "" ? undefined : Number(e.target.value) * 10000000,
              })
            }
            className="w-full px-2.5 py-2 rounded-lg bg-bg border border-border text-sm outline-none focus-visible:outline-2 focus-visible:outline-accent"
          />
          <span className="text-text-muted text-xs">to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxInvestment != null ? filters.maxInvestment / 10000000 : ""}
            onChange={(e) =>
              onChange({
                maxInvestment: e.target.value === "" ? undefined : Number(e.target.value) * 10000000,
              })
            }
            className="w-full px-2.5 py-2 rounded-lg bg-bg border border-border text-sm outline-none focus-visible:outline-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide flex items-center gap-1">
          <ArrowUpDown size={12} /> Sort by
        </p>
        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value })}
            className="flex-1 px-2.5 py-2 rounded-lg bg-bg border border-border text-sm outline-none focus-visible:outline-2 focus-visible:outline-accent"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={filters.sortDir}
            onChange={(e) => onChange({ sortDir: e.target.value })}
            className="px-2.5 py-2 rounded-lg bg-bg border border-border text-sm outline-none focus-visible:outline-2 focus-visible:outline-accent"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border">
        <span className="text-xs text-text-muted">{resultCount} results</span>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text"
          >
            <X size={12} /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
