// One-off generator: produces src/data/deals.json and src/data/investors.json
const fs = require("fs");
const path = require("path");

const industries = [
  "Fintech", "Healthtech", "Edtech", "Agritech", "E-commerce",
  "Clean Energy", "SaaS", "Logistics", "Real Estate", "Manufacturing",
  "AI/ML", "Consumer Goods", "Media", "Biotech", "Mobility",
];

const stages = ["Seed", "Series A", "Series B", "Series C", "Growth"];
const riskLevels = ["Low", "Medium", "High"];
const cities = [
  "Mumbai", "Bengaluru", "Pune", "Delhi NCR", "Hyderabad",
  "Chennai", "Ahmedabad", "Jaipur", "Kolkata", "Kochi",
];

const companyPrefixes = [
  "Nova", "Vertex", "Bharat", "Kite", "Orbit", "Sundar", "Terra",
  "Astra", "Lumen", "Zephyr", "Prakash", "Ekam", "Ganga", "Meru",
  "Sahaj", "Trishul", "Vayu", "Indus", "Shakti", "Anant",
];
const companySuffixes = [
  "Labs", "Technologies", "Systems", "Works", "Innovations",
  "Solutions", "Networks", "Dynamics", "Ventures", "Industries",
];

function rand(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickMany(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function makeDeal(i) {
  const id = `deal-${i + 1}`;
  const name = `${pick(companyPrefixes)} ${pick(companySuffixes)}`;
  const industry = pick(industries);
  const risk = pick(riskLevels);
  const stage = pick(stages);
  const roi = rand(8, 45); // % projected ROI
  const investmentAsk = Math.round(rand(5, 500)) * 100000; // INR
  const raisedSoFar = Math.round(investmentAsk * rand(0.1, 0.95));
  const minTicket = Math.round(rand(1, 10)) * 10000;
  const investorsCount = Math.floor(rand(3, 120));
  const foundedYear = 2013 + Math.floor(Math.random() * 12);
  const city = pick(cities);

  const monthlyGrowth = Array.from({ length: 12 }, (_, m) => ({
    month: new Date(2025, m, 1).toLocaleString("en-US", { month: "short" }),
    value: Math.round(raisedSoFar * (0.3 + (m / 11) * 0.7 + rand(-0.03, 0.03))),
  }));

  return {
    id,
    name,
    tagline: `${industry} company building for ${city} and beyond`,
    industry,
    stage,
    risk,
    roi,
    investmentAsk,
    raisedSoFar,
    minTicket,
    investorsCount,
    foundedYear,
    city,
    description: `${name} is a ${stage.toLowerCase()}-stage ${industry.toLowerCase()} company headquartered in ${city}, focused on scalable, technology-first growth. Founded in ${foundedYear}, the team is raising this round to accelerate product and market expansion.`,
    financials: {
      revenue: Math.round(raisedSoFar * rand(0.4, 1.2)),
      expenses: Math.round(raisedSoFar * rand(0.2, 0.9)),
      valuation: Math.round(investmentAsk * rand(4, 12)),
      burnRateMonthly: Math.round(raisedSoFar * rand(0.02, 0.08)),
    },
    roiProjection: Array.from({ length: 5 }, (_, y) => ({
      year: `Y${y + 1}`,
      projected: Math.round(roi * (1 + y * 0.35) * 10) / 10,
    })),
    riskFactors: pickMany(
      [
        "Market competition", "Regulatory changes", "Execution risk",
        "Founder dependency", "Customer concentration", "Cash flow timing",
        "Technology obsolescence", "Supply chain dependency",
      ],
      3
    ),
    monthlyGrowth,
    tags: pickMany(["High growth", "Profitable", "Founder-led", "B2B", "B2C", "Recurring revenue"], 2),
  };
}

function makeInvestor(i) {
  const id = `investor-${i + 1}`;
  const names = [
    "Aarav Shah", "Priya Nair", "Rohan Mehta", "Ishita Verma", "Karan Kapoor",
    "Ananya Iyer", "Vivaan Joshi", "Diya Reddy", "Aditya Malhotra", "Sneha Rao",
    "Arjun Menon", "Kavya Pillai", "Yash Agarwal", "Meera Desai", "Siddharth Bhatt",
    "Neha Kulkarni", "Rahul Chawla", "Tanvi Saxena", "Dev Patel", "Riya Sharma",
  ];
  const preferredIndustries = pickMany(industries, Math.ceil(rand(1, 3)));
  const preferredRisk = pick(riskLevels);
  const budgetMin = Math.round(rand(1, 20)) * 100000;
  const budgetMax = budgetMin + Math.round(rand(10, 100)) * 100000;

  return {
    id,
    name: names[i % names.length],
    type: pick(["Angel Investor", "VC Firm", "Family Office", "HNI"]),
    preferredIndustries,
    preferredRisk,
    budgetMin,
    budgetMax,
    totalInvested: Math.round(rand(500000, 20000000)),
    activeDeals: Math.floor(rand(1, 15)),
    joinedYear: 2018 + Math.floor(Math.random() * 8),
  };
}

const deals = Array.from({ length: 80 }, (_, i) => makeDeal(i));
const investors = Array.from({ length: 16 }, (_, i) => makeInvestor(i));

const outDir = path.join(__dirname, "..", "src", "data");
fs.writeFileSync(path.join(outDir, "deals.json"), JSON.stringify(deals, null, 2));
fs.writeFileSync(path.join(outDir, "investors.json"), JSON.stringify(investors, null, 2));

console.log(`Generated ${deals.length} deals and ${investors.length} investors`);
