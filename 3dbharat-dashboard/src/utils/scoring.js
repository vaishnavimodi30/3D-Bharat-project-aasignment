// Frontend-only "recommendation engine". No backend, no ML model — just a
// transparent weighted score so it's easy to explain in the README/demo.

const RISK_ORDER = { Low: 1, Medium: 2, High: 3 };

const WEIGHTS = {
  risk: 0.3,
  industry: 0.25,
  budget: 0.25,
  roi: 0.2,
};

/**
 * Scores a single deal against an investor profile. Returns 0-100.
 */
export function scoreDeal(deal, investor) {
  if (!investor) return null;

  // Risk match: closer preferred-risk to deal-risk => higher score.
  const riskDiff = Math.abs(RISK_ORDER[deal.risk] - RISK_ORDER[investor.preferredRisk]);
  const riskScore = Math.max(0, 1 - riskDiff / 2); // 0, 0.5, or 1

  // Industry match: binary, but partial credit if investor has multiple prefs.
  const industryScore = investor.preferredIndustries.includes(deal.industry) ? 1 : 0;

  // Budget compatibility: does the deal's min ticket fall inside the
  // investor's stated budget band?
  const inBudget =
    deal.minTicket >= investor.budgetMin && deal.minTicket <= investor.budgetMax;
  const budgetMidpoint = (investor.budgetMin + investor.budgetMax) / 2;
  const budgetDistance = Math.abs(deal.minTicket - budgetMidpoint) / (budgetMidpoint || 1);
  const budgetScore = inBudget ? 1 : Math.max(0, 1 - budgetDistance);

  // ROI attractiveness: normalize against a realistic 8-45% range from the
  // mock data generator.
  const roiScore = Math.min(1, Math.max(0, (deal.roi - 8) / (45 - 8)));

  const total =
    riskScore * WEIGHTS.risk +
    industryScore * WEIGHTS.industry +
    budgetScore * WEIGHTS.budget +
    roiScore * WEIGHTS.roi;

  return Math.round(total * 100);
}

/**
 * Scores and sorts a list of deals for a given investor, descending by
 * match score. Pure function — safe to wrap in useMemo.
 */
export function rankDealsForInvestor(deals, investor) {
  if (!investor) return deals.map((d) => ({ ...d, matchScore: null }));
  return deals
    .map((d) => ({ ...d, matchScore: scoreDeal(d, investor) }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
