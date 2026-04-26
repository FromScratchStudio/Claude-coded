import type {
  AppSettings,
  Category,
  Phase,
  PipelineStage,
  PipelineItem,
  Project,
  KpiDef,
  Idea,
  Planning,
  Principle,
  Entity,
} from "../types";

// ─── App ──────────────────────────────────────────────────────────────────────

export const SEED_SETTINGS: AppSettings = {
  name: "STRATEX",
  tagline: "Strategic Execution Framework",
  accentColor: "#c9a84c",
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const SEED_CATEGORIES: Category[] = [
  { id: "cat-core", label: "Core", name: "Core Product", color: "#c9a84c", pct: 70 },
  { id: "cat-growth", label: "Growth", name: "Growth & Marketing", color: "#06b6d4", pct: 15 },
  { id: "cat-ops", label: "Ops", name: "Operations & Infra", color: "#8b5cf6", pct: 10 },
  { id: "cat-rd", label: "R&D", name: "Research & Experiments", color: "#ec4899", pct: 5 },
];

// ─── Phases / Roadmap ─────────────────────────────────────────────────────────

export const SEED_PHASES: Phase[] = [
  {
    id: "ph-discovery",
    label: "Phase 1",
    name: "Discovery",
    duration: "Months 1–3",
    accent: "#9ca3af",
    tasks: [
      { id: "t-d1", text: "Define target customer profile", done: true },
      { id: "t-d2", text: "Conduct 20 user interviews", done: true },
      { id: "t-d3", text: "Map competitive landscape", done: false },
      { id: "t-d4", text: "Validate core problem statement", done: false },
    ],
  },
  {
    id: "ph-build",
    label: "Phase 2",
    name: "MVP Build",
    duration: "Months 4–9",
    accent: "#f59e0b",
    tasks: [
      { id: "t-b1", text: "Ship core feature set (auth, dashboard, billing)", done: false },
      { id: "t-b2", text: "Alpha testing with 10 internal users", done: false },
      { id: "t-b3", text: "Feedback loop — weekly retros", done: false },
      { id: "t-b4", text: "Performance baseline established", done: false },
    ],
  },
  {
    id: "ph-launch",
    label: "Phase 3",
    name: "Launch",
    duration: "Months 10–15",
    accent: "#10b981",
    tasks: [
      { id: "t-l1", text: "Beta launch to 100 early adopters", done: false },
      { id: "t-l2", text: "Pricing strategy finalised", done: false },
      { id: "t-l3", text: "First paid marketing campaign", done: false },
      { id: "t-l4", text: "Reach 50 paying customers", done: false },
    ],
  },
  {
    id: "ph-scale",
    label: "Phase 4",
    name: "Scale",
    duration: "Months 16–24",
    accent: "#8b5cf6",
    tasks: [
      { id: "t-s1", text: "Growth loops automated", done: false },
      { id: "t-s2", text: "Team expansion to 5 people", done: false },
      { id: "t-s3", text: "Series A preparation package", done: false },
    ],
  },
];

// ─── Pipeline stages ──────────────────────────────────────────────────────────

export const SEED_PIPELINE_STAGES: PipelineStage[] = [
  { id: "st-backlog", label: "Backlog", description: "Not yet started", color: "#6b7280", order: 0 },
  { id: "st-spec", label: "Spec", description: "Requirements being written", color: "#f59e0b", order: 1 },
  { id: "st-inprog", label: "In Progress", description: "Actively being built", color: "#4c7fc9", order: 2 },
  { id: "st-review", label: "Review", description: "In QA or peer review", color: "#8b5cf6", order: 3 },
  { id: "st-done", label: "Done", description: "Shipped to production", color: "#10b981", order: 4 },
];

// ─── Pipeline items ───────────────────────────────────────────────────────────

export const SEED_PIPELINE_ITEMS: PipelineItem[] = [
  { id: "pi-1", title: "User onboarding flow", stageId: "st-inprog", categoryId: "cat-core", note: "Reduce time-to-value to <3 min", dueDate: "2026-05-15" },
  { id: "pi-2", title: "Billing integration (Stripe)", stageId: "st-spec", categoryId: "cat-core", note: "Support annual and monthly plans", dueDate: "2026-06-01" },
  { id: "pi-3", title: "Mobile app (iOS)", stageId: "st-backlog", categoryId: "cat-core", note: "Phase 3 priority — defer until launch", dueDate: "" },
  { id: "pi-4", title: "Analytics dashboard v2", stageId: "st-review", categoryId: "cat-core", note: "Cohort analysis + funnel view", dueDate: "2026-04-30" },
  { id: "pi-5", title: "SEO blog setup", stageId: "st-inprog", categoryId: "cat-growth", note: "10 articles planned for Q2", dueDate: "2026-05-30" },
  { id: "pi-6", title: "Partner API", stageId: "st-backlog", categoryId: "cat-ops", note: "Required for integrations program", dueDate: "" },
  { id: "pi-7", title: "AI tagging experiment", stageId: "st-spec", categoryId: "cat-rd", note: "LLM-assisted content categorisation", dueDate: "2026-06-15" },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const SEED_PROJECTS: Project[] = [
  { id: "pr-1", name: "Core SaaS Platform", categoryId: "cat-core", phaseId: "ph-build", status: "active", progress: 35, note: "Auth + dashboard + billing in progress", priority: "high" },
  { id: "pr-2", name: "Growth Blog", categoryId: "cat-growth", phaseId: "ph-launch", status: "active", progress: 60, note: "Publishing 2× per week consistently", priority: "high" },
  { id: "pr-3", name: "Internal Tooling", categoryId: "cat-ops", phaseId: "ph-discovery", status: "pending", progress: 10, note: "Automate deployment pipeline", priority: "medium" },
  { id: "pr-4", name: "AI Feature Experiments", categoryId: "cat-rd", phaseId: "ph-discovery", status: "backlog", progress: 5, note: "Exploring LLM-assisted workflows", priority: "low" },
  { id: "pr-5", name: "Affiliate Program", categoryId: "cat-growth", phaseId: "ph-launch", status: "backlog", progress: 0, note: "Start after first 50 paying customers", priority: "low" },
];

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export const SEED_KPI_DEFS: KpiDef[] = [
  { key: "mrr", label: "MRR", target3m: 2000, target12m: 25000, target36m: 150000, unit: "€", icon: "📈" },
  { key: "dau", label: "Daily Active Users", target3m: 200, target12m: 5000, target36m: 50000, unit: "", icon: "👥" },
  { key: "nps", label: "NPS Score", target3m: 30, target12m: 50, target36m: 65, unit: "", icon: "⭐" },
  { key: "churn", label: "Monthly Churn", target3m: 8, target12m: 4, target36m: 2, unit: "%", icon: "🔄" },
  { key: "paying", label: "Paying Customers", target3m: 10, target12m: 200, target36m: 2000, unit: "", icon: "💳" },
];

export const SEED_KPI_VALUES: Record<string, number> = {
  mrr: 0, dau: 0, nps: 0, churn: 0, paying: 0,
};

// ─── Ideas ────────────────────────────────────────────────────────────────────

export const SEED_IDEAS: Idea[] = [
  { id: "id-1", text: "AI-powered onboarding wizard that adapts to user type", source: "User feedback", stage: "raw", createdAt: "2026-04-01" },
  { id: "id-2", text: "Partnership with industry newsletter (20k subscribers)", source: "Team brainstorm", stage: "sorted", createdAt: "2026-03-15" },
  { id: "id-3", text: "White-label offering for agencies", source: "Sales call", stage: "selected", project: "Core SaaS Platform", createdAt: "2026-03-01" },
  { id: "id-4", text: "Gamification layer for power users (streaks, badges)", source: "Competitor analysis", stage: "raw", createdAt: "2026-04-10" },
  { id: "id-5", text: "Bulk import via CSV for enterprise onboarding", source: "Support ticket", stage: "sorted", createdAt: "2026-04-05" },
];

// ─── Planning ─────────────────────────────────────────────────────────────────

export const SEED_PLANNING: Planning = {
  period: "Q2 2026",
  objective: "Launch MVP and reach 50 paying customers",
  arc: "Phase 2 → Phase 3 transition — from build to launch",
  arcEnd: "By end of Q2: billing live, onboarding <3 min, first 10 paid users",
  focalTool: "Stripe — complete payment flow end-to-end this quarter",
  redZones: "Week of May 20: all-hands offsite. June 28: fiscal year-end.",
  singleRule: "Ship weekly. No feature without a linked user story.",
};

// ─── Principles ───────────────────────────────────────────────────────────────

export const SEED_PRINCIPLES: Principle[] = [
  {
    id: "pn-focus",
    name: "Focus Mode",
    color: "#f59e0b",
    trigger: "Two consecutive days with fewer than 6 hours of productive work",
    rules: [
      "Limit external meetings to max 2 per day",
      "No new commitments this week",
      "Daily 90-minute single-task sprint block",
    ],
    exit: "Three productive days in a row (>6 h focused work each)",
  },
  {
    id: "pn-crunch",
    name: "Crunch Guard",
    color: "#ef4444",
    trigger: "Hard deadline within 72 h with more than 40% scope remaining",
    rules: [
      "Cut all non-critical features from scope",
      "Daily 15-minute standup — no exceptions",
      "One person owns the release end-to-end",
    ],
    exit: "Release shipped and post-mortem completed",
  },
  {
    id: "pn-slow",
    name: "Slow Mode",
    color: "#8b5cf6",
    trigger: "Team energy collectively below 6/10 for one full week",
    rules: [
      "Cut output targets in half this week",
      "Weekly 1:1 for every team member",
      "No new hires, partnerships, or expansion discussions",
    ],
    exit: "Two consecutive healthy weeks (energy 8+ consistently)",
  },
];

// ─── Referential entities ─────────────────────────────────────────────────────

export const SEED_ENTITIES: Entity[] = [
  {
    id: "en-team",
    name: "Core Team",
    role: "Internal",
    color: "#10b981",
    description: "The founding team responsible for product, growth, and operations.",
    contact: "team@company.com",
    tags: ["internal", "decision-makers"],
    notes: "Weekly sync every Monday 10 AM. Default to async for everything else.",
  },
  {
    id: "en-investors",
    name: "Seed Investors",
    role: "Financial",
    color: "#c9a84c",
    description: "Angel investors from the seed round. Board observers with monthly updates.",
    contact: "investors@company.com",
    tags: ["financial", "board", "advisors"],
    notes: "Monthly update email. Quarterly call. No surprises — flag risks early.",
  },
  {
    id: "en-customers",
    name: "Key Accounts",
    role: "Customers",
    color: "#06b6d4",
    description: "Top 5 paying customers who co-shape the roadmap through regular feedback.",
    contact: "enterprise@company.com",
    tags: ["revenue", "feedback", "enterprise"],
    notes: "Bi-weekly check-in call. Early access to beta features.",
  },
  {
    id: "en-advisors",
    name: "Advisory Board",
    role: "Strategic",
    color: "#8b5cf6",
    description: "Domain experts providing strategic guidance on product and go-to-market.",
    contact: "advisors@company.com",
    tags: ["advisors", "network", "strategic"],
    notes: "Monthly async update. Ad-hoc calls as needed. Introductions expected quarterly.",
  },
];
