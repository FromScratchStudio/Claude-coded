import type { KpiDef, Quarter } from "../types";

export const KPI_DEFS: KpiDef[] = [
  {
    key: "revenue",
    label: "Revenue",
    target3m: 5000,
    target12m: 30000,
    target36m: 120000,
    unit: "€",
    icon: "💰",
    category: "Financial",
  },
  {
    key: "users",
    label: "Active Users",
    target3m: 100,
    target12m: 1000,
    target36m: 10000,
    unit: "",
    icon: "👥",
    category: "Growth",
  },
  {
    key: "nps",
    label: "NPS Score",
    target3m: 30,
    target12m: 50,
    target36m: 70,
    unit: "",
    icon: "⭐",
    category: "Quality",
  },
  {
    key: "content",
    label: "Content Published",
    target3m: 12,
    target12m: 52,
    target36m: 156,
    unit: "pieces",
    icon: "📄",
    category: "Output",
  },
  {
    key: "partnerships",
    label: "Partnerships",
    target3m: 2,
    target12m: 10,
    target36m: 30,
    unit: "",
    icon: "🤝",
    category: "Growth",
  },
];

export const KPI_DEFAULTS: Record<string, number> = {
  revenue: 0,
  users: 0,
  nps: 0,
  content: 0,
  partnerships: 0,
};

export const QUARTER_DEFAULT: Quarter = {
  q: "Q2 2025",
  goal: "Launch MVP and acquire first 100 users",
  theme: "Validation & Momentum",
  themeEnd: "June 30, 2025",
  allocation: {
    focus: 50,
    growth: 25,
    maintenance: 15,
    exploration: 10,
  },
  amplification: "LinkedIn + email newsletter",
  focalTool: "Notion + Linear",
  redZones: "Avoid scope creep on core product",
  singleRule: "Ship before perfecting",
};
