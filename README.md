A fully frontend, no-backend investor/corporate dashboard built for the Full Stack Developer (3D Bharat) take-home assignment. Every "API call" is simulated on the client — there is no server, database, or network request anywhere in this app.

**Live demo:** [https://3d-bharat-project-aasignment.vercel.app](https://3d-bharat-project-aasignment.vercel.app)

Tech stack
Next.js 16 (App Router)
React 19
Redux Toolkit for state management
Recharts for data visualization
Tailwind CSS v4 for styling
lucide-react for icons
Getting started
npm install
npm run dev
Visit http://localhost:3000.

npm run build && npm run start   # production build
Architecture
src/
├── data/            Mock JSON — 80 deals, 16 investors (scripts/gen-data.js generates this)
├── services/         Simulated backend — the ONLY place that reads data/*.json
│   ├── apiClient.js       shared Promise + delay + random-failure wrapper
│   ├── dealService.js     fetchDeals, fetchDealById, fetchDealSummary, getAllIndustries
│   └── investorService.js fetchInvestors, fetchInvestorById, fetchCorporateAnalytics
├── store/            Redux Toolkit slices (all async logic lives in thunks, not components)
│   ├── dealsSlice.js       deal list / detail / summary — loading/error/cache state
│   ├── corporateSlice.js   corporate analytics — loading/error state
│   ├── interestsSlice.js   saved deals + active investor persona (localStorage-backed)
│   └── uiSlice.js          dark mode toggle (localStorage-backed)
├── hooks/            Reusable logic: useDebounce, useDeals (filter/sort/paginate), useInvestors
├── utils/            Pure functions: scoring.js (recommendation engine), format.js (currency/percent)
├── components/
│   ├── layout/         Navbar, ThemeSync
│   ├── dashboard/       SummaryCard, Charts.jsx (all Recharts wrappers)
│   ├── deals/           DealCard, DealFilters, MatchRing, InvestorPersonaSelect
│   └── ui/              Tabs, Accordion, Pagination, StatusState (Loading/Error/Empty)
└── app/               Routes — Overview (/), Deal Explorer (/deals), Deal Details
                        (/deals/[id]), My Interests (/my-investments), Corporate (/corporate)
Rule followed throughout: UI components never touch data/*.json or do filtering/sorting math themselves — they call a service (via a Redux thunk or a hook) and render what comes back. Business logic lives in services/ and utils/, not in components/.

Data flow
src/data/*.json — static mock data, checked into the repo (regenerate any time with node scripts/gen-data.js).
services/*.js — the simulated backend. Every exported function returns a Promise, resolved through simulateRequest() in apiClient.js, which adds a random 300–800ms delay and randomly rejects ~4% of calls to simulate network failures. Filtering, sorting, and pagination all happen inside these functions — never in a component.
Redux thunks (dealsSlice, corporateSlice) call the services and track status: 'idle' | 'loading' | 'succeeded' | 'failed' plus an error message, so every screen can render a loading, error, or empty state correctly.
Components read from useSelector / custom hooks and render. interestsSlice and uiSlice also mirror their state into localStorage on every change, so saved deals, the active investor persona, and dark-mode preference all survive a page reload.
Recommendation engine (utils/scoring.js)
Pure, framework-agnostic scoring function — no ML, fully explainable:

score = 0.30 x riskMatch + 0.25 x industryMatch + 0.25 x budgetFit + 0.20 x roiAttractiveness
Risk match — how close the deal's risk tier is to the investor's preferred tier (Low/Medium/High).
Industry match — binary: is the deal's industry in the investor's preferred list.
Budget fit — how close the deal's minimum ticket size is to the investor's stated budget band.
ROI attractiveness — the deal's ROI normalized against the dataset's 8-45% range.
rankDealsForInvestor() scores and sorts a deal list for a chosen investor persona (picked from the dropdown in the Deal Explorer) and is wrapped in useMemo in DealExplorerPage so it only recomputes when the deal list or selected investor actually changes.

Optimization strategies
Debounced search (useDebounce, 350ms) — the Deal Explorer's search box doesn't hit the simulated API on every keystroke.
Memoized scoring — rankDealsForInvestor runs inside useMemo, keyed on the deal list + investor, not on every render.
useCallback on filter handlers — updateFilter and resetFilters in useDeals are wrapped in useCallback so child components that receive them as props (e.g. DealFilters) don't re-render unnecessarily.
Lazy-loaded charts — all Recharts components are loaded via next/dynamic with ssr: false, so the heavy Recharts bundle is only fetched when the page that needs it is first visited. Each lazy import shows a skeleton placeholder while loading.
Simple response cache — dealsSlice caches list responses keyed by their filter/sort/page params, so returning to a previously-seen filter combination is available without waiting on a fresh simulated round trip.
Pagination over infinite scroll — 12 deals per page, keeps DOM size and re-render cost bounded even though the dataset is small here; the service layer supports arbitrary pageSize so this scales to a much larger mock dataset without a component rewrite.
Feature-based folder structure — services/, store/, hooks/, utils/, components/ are all organized by responsibility, not by route, so logic is reusable across pages (e.g. DealCard and the scoring util are shared between the Explorer and My Interests pages).
UI/UX
Custom design system (mint-green / indigo accent palette) defined as CSS variables in globals.css, with a full dark-mode variant. Toggle it from the navbar; it persists across reloads.
Loading, error, and empty states are handled everywhere data is fetched (components/ui/StatusState.jsx), including a retry button on errors — useful given the simulated ~4% random failure rate.
Signature element: the match ring — a small radial progress gauge on each deal card showing that deal's recommendation score once an investor persona is selected.
What's simulated vs. real
Real	Simulated
All UI/UX, state management, routing	Backend / database
Filtering, sorting, pagination logic	Network latency (300-800ms)
Recommendation scoring	Occasional request failures (~4%)
localStorage persistence	Authentication
Known limitations / next steps
Mock data regenerates deterministically per npm install only if you re-run node scripts/gen-data.js; the committed src/data/*.json is the version currently shown in the app.
No test suite included — given the time box, effort went into architecture and UI polish instead.
react-window virtualization was not needed at this dataset size (80 deals) but the Deal Explorer's pagination-based design means it would drop in cleanly if the dataset grew.
