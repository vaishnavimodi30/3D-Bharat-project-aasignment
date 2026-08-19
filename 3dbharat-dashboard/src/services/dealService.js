import dealsData from "@/data/deals.json";
import { simulateRequest } from "./apiClient";

/**
 * fetchDeals(params)
 * params: { search, industries[], riskLevels[], minRoi, maxRoi, minInvestment,
 *           maxInvestment, sortBy, sortDir, page, pageSize }
 * Returns { items, total, page, pageSize }
 */
export function fetchDeals(params = {}) {
  return simulateRequest(() => {
    const {
      search = "",
      industries = [],
      riskLevels = [],
      minRoi,
      maxRoi,
      minInvestment,
      maxInvestment,
      sortBy = "roi",
      sortDir = "desc",
      page = 1,
      pageSize = 12,
    } = params;

    let result = [...dealsData];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.industry.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q)
      );
    }

    if (industries.length) {
      result = result.filter((d) => industries.includes(d.industry));
    }

    if (riskLevels.length) {
      result = result.filter((d) => riskLevels.includes(d.risk));
    }

    if (typeof minRoi === "number") result = result.filter((d) => d.roi >= minRoi);
    if (typeof maxRoi === "number") result = result.filter((d) => d.roi <= maxRoi);
    if (typeof minInvestment === "number")
      result = result.filter((d) => d.investmentAsk >= minInvestment);
    if (typeof maxInvestment === "number")
      result = result.filter((d) => d.investmentAsk <= maxInvestment);

    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (typeof a[sortBy] === "string") return a[sortBy].localeCompare(b[sortBy]) * dir;
      return (a[sortBy] - b[sortBy]) * dir;
    });

    const total = result.length;
    const start = (page - 1) * pageSize;
    const items = result.slice(start, start + pageSize);

    return { items, total, page, pageSize };
  });
}

export function fetchDealById(id) {
  return simulateRequest(() => {
    const deal = dealsData.find((d) => d.id === id);
    if (!deal) throw new Error(`Deal ${id} not found`);
    return deal;
  });
}

export function fetchDealSummary() {
  return simulateRequest(() => {
    const totalInvestments = dealsData.reduce((s, d) => s + d.raisedSoFar, 0);
    const activeDeals = dealsData.length;
    const avgRoi =
      dealsData.reduce((s, d) => s + d.roi, 0) / (dealsData.length || 1);

    const riskDistribution = ["Low", "Medium", "High"].map((risk) => ({
      risk,
      count: dealsData.filter((d) => d.risk === risk).length,
    }));

    const industryDistribution = Object.entries(
      dealsData.reduce((acc, d) => {
        acc[d.industry] = (acc[d.industry] || 0) + 1;
        return acc;
      }, {})
    ).map(([industry, count]) => ({ industry, count }));

    // Aggregate monthly growth across all deals for the trend chart.
    const growthByMonth = {};
    dealsData.forEach((d) => {
      d.monthlyGrowth.forEach(({ month, value }) => {
        growthByMonth[month] = (growthByMonth[month] || 0) + value;
      });
    });
    const investmentGrowth = Object.entries(growthByMonth).map(([month, value]) => ({
      month,
      value,
    }));

    const riskVsRoi = dealsData.map((d) => ({
      name: d.name,
      risk: d.risk,
      roi: d.roi,
      investmentAsk: d.investmentAsk,
    }));

    return {
      totalInvestments,
      activeDeals,
      avgRoi: Math.round(avgRoi * 10) / 10,
      riskDistribution,
      industryDistribution,
      investmentGrowth,
      riskVsRoi,
    };
  });
}

export function getAllIndustries() {
  return [...new Set(dealsData.map((d) => d.industry))].sort();
}
