import investorsData from "@/data/investors.json";
import dealsData from "@/data/deals.json";
import { simulateRequest } from "./apiClient";

export function fetchInvestors(params = {}) {
  return simulateRequest(() => {
    const { page = 1, pageSize = 10 } = params;
    const total = investorsData.length;
    const start = (page - 1) * pageSize;
    const items = investorsData.slice(start, start + pageSize);
    return { items, total, page, pageSize };
  });
}

export function fetchInvestorById(id) {
  return simulateRequest(() => {
    const investor = investorsData.find((i) => i.id === id);
    if (!investor) throw new Error(`Investor ${id} not found`);
    return investor;
  });
}

/**
 * Corporate-facing analytics: total funding raised across the platform,
 * number of unique investors, and a simulated conversion rate + trend.
 */
export function fetchCorporateAnalytics() {
  return simulateRequest(() => {
    const totalFundingRaised = dealsData.reduce((s, d) => s + d.raisedSoFar, 0);
    const investorCount = investorsData.length;
    const totalViews = dealsData.reduce((s, d) => s + d.investorsCount * 4, 0);
    const totalCommits = dealsData.reduce((s, d) => s + d.investorsCount, 0);
    const conversionRate = Math.round((totalCommits / totalViews) * 1000) / 10;

    const fundingByIndustry = Object.entries(
      dealsData.reduce((acc, d) => {
        acc[d.industry] = (acc[d.industry] || 0) + d.raisedSoFar;
        return acc;
      }, {})
    ).map(([industry, total]) => ({ industry, total }));

    const monthlyFunding = {};
    dealsData.forEach((d) => {
      d.monthlyGrowth.forEach(({ month, value }) => {
        monthlyFunding[month] = (monthlyFunding[month] || 0) + value;
      });
    });
    const fundingTrend = Object.entries(monthlyFunding).map(([month, value]) => ({
      month,
      value,
    }));

    const topDeals = [...dealsData]
      .sort((a, b) => b.raisedSoFar - a.raisedSoFar)
      .slice(0, 5)
      .map((d) => ({ id: d.id, name: d.name, raisedSoFar: d.raisedSoFar, industry: d.industry }));

    return {
      totalFundingRaised,
      investorCount,
      conversionRate,
      fundingByIndustry,
      fundingTrend,
      topDeals,
    };
  });
}
