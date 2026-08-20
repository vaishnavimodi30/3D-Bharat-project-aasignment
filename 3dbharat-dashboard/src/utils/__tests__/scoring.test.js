import { scoreDeal, rankDealsForInvestor } from "../scoring";

describe("scoreDeal", () => {
  const mockInvestor = {
    preferredRisk: "Medium",
    preferredIndustries: ["Technology", "FinTech"],
    budgetMin: 50000,
    budgetMax: 500000,
  };

  test("returns null when investor is not provided", () => {
    const deal = {
      risk: "Low",
      industry: "Technology",
      minTicket: 100000,
      roi: 20,
    };
    expect(scoreDeal(deal, null)).toBeNull();
  });

  test("returns 100 for a perfect match", () => {
    const deal = {
      risk: "Medium",
      industry: "Technology",
      minTicket: 250000, // midpoint of budget range
      roi: 45, // highest realistic ROI
    };
    const score = scoreDeal(deal, mockInvestor);
    expect(score).toBe(100);
  });

  test("scores a deal with matching risk, industry, and budget", () => {
    const deal = {
      risk: "Medium",
      industry: "Technology",
      minTicket: 150000,
      roi: 25,
    };
    const score = scoreDeal(deal, mockInvestor);
    expect(score).toBeGreaterThan(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  test("scores lower for non-matching industry", () => {
    const deal = {
      risk: "Medium",
      industry: "RealEstate",
      minTicket: 250000,
      roi: 25,
    };
    const score = scoreDeal(deal, mockInvestor);
    expect(score).toBeLessThan(70);
  });

  test("scores lower for mismatched risk (Low when Medium preferred)", () => {
    const deal = {
      risk: "Low",
      industry: "Technology",
      minTicket: 250000,
      roi: 25,
    };
    const score = scoreDeal(deal, mockInvestor);
    // Risk diff is 1 (Medium=2, Low=1), so riskScore = 1 - 1/2 = 0.5
    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThan(90);
  });

  test("scores lower for deal outside budget range", () => {
    const deal = {
      risk: "Medium",
      industry: "Technology",
      minTicket: 1000000, // way above budget
      roi: 25,
    };
    const score = scoreDeal(deal, mockInvestor);
    expect(score).toBeLessThan(70);
  });

  test("scores deal with high ROI higher than low ROI (all else equal)", () => {
    const lowRoiDeal = {
      risk: "Medium",
      industry: "Technology",
      minTicket: 250000,
      roi: 10,
    };
    const highRoiDeal = {
      risk: "Medium",
      industry: "Technology",
      minTicket: 250000,
      roi: 40,
    };
    const lowScore = scoreDeal(lowRoiDeal, mockInvestor);
    const highScore = scoreDeal(highRoiDeal, mockInvestor);
    expect(highScore).toBeGreaterThan(lowScore);
  });

  test("returns a score between 0 and 100", () => {
    const deals = [
      {
        risk: "Low",
        industry: "Healthcare",
        minTicket: 1000,
        roi: 5,
      },
      {
        risk: "High",
        industry: "Technology",
        minTicket: 50000,
        roi: 50,
      },
      {
        risk: "Medium",
        industry: "FinTech",
        minTicket: 250000,
        roi: 25,
      },
    ];

    deals.forEach((deal) => {
      const score = scoreDeal(deal, mockInvestor);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});

describe("rankDealsForInvestor", () => {
  const mockInvestor = {
    preferredRisk: "Medium",
    preferredIndustries: ["Technology", "FinTech"],
    budgetMin: 50000,
    budgetMax: 500000,
  };

  const mockDeals = [
    {
      id: 1,
      risk: "Low",
      industry: "Healthcare",
      minTicket: 100000,
      roi: 15,
    },
    {
      id: 2,
      risk: "Medium",
      industry: "Technology",
      minTicket: 250000,
      roi: 25,
    },
    {
      id: 3,
      risk: "High",
      industry: "FinTech",
      minTicket: 200000,
      roi: 35,
    },
  ];

  test("ranks deals by matchScore in descending order", () => {
    const ranked = rankDealsForInvestor(mockDeals, mockInvestor);
    expect(ranked[0].matchScore).toBeGreaterThanOrEqual(
      ranked[1].matchScore
    );
    expect(ranked[1].matchScore).toBeGreaterThanOrEqual(
      ranked[2].matchScore
    );
  });

  test("adds matchScore property to each deal", () => {
    const ranked = rankDealsForInvestor(mockDeals, mockInvestor);
    ranked.forEach((deal) => {
      expect(deal).toHaveProperty("matchScore");
      expect(typeof deal.matchScore).toBe("number");
    });
  });

  test("returns deals with null matchScore when investor is null", () => {
    const ranked = rankDealsForInvestor(mockDeals, null);
    ranked.forEach((deal) => {
      expect(deal.matchScore).toBeNull();
    });
  });

  test("preserves original deal properties while adding matchScore", () => {
    const ranked = rankDealsForInvestor(mockDeals, mockInvestor);
    const rankedIds = ranked.map((d) => d.id).sort();
    const originalIds = mockDeals.map((d) => d.id).sort();
    expect(rankedIds).toEqual(originalIds);
    ranked.forEach((deal) => {
      const original = mockDeals.find((d) => d.id === deal.id);
      expect(deal.risk).toBe(original.risk);
      expect(deal.industry).toBe(original.industry);
      expect(deal.minTicket).toBe(original.minTicket);
    });
  });

  test("handles empty deal array", () => {
    const ranked = rankDealsForInvestor([], mockInvestor);
    expect(ranked).toEqual([]);
  });
});
