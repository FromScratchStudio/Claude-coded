import type { Phase } from "../types";

export const PHASES: Phase[] = [
  {
    id: 1,
    label: "P1",
    name: "Foundation",
    months: "Months 1–6",
    color: "#f59e0b",
    accent: "#f59e0b",
    startDate: "2025-01-01",
    estimatedEndDate: "2025-06-30",
    tasks: [
      { id: "p1-1", text: "Define vision and strategy", done: false },
      { id: "p1-2", text: "Set up core processes", done: false },
      { id: "p1-3", text: "Identify key stakeholders", done: false },
      { id: "p1-4", text: "Establish KPI baselines", done: false },
    ],
  },
  {
    id: 2,
    label: "P2",
    name: "Build",
    months: "Months 7–18",
    color: "#10b981",
    accent: "#10b981",
    startDate: "2025-07-01",
    estimatedEndDate: "2026-06-30",
    tasks: [
      { id: "p2-1", text: "Execute core projects", done: false },
      { id: "p2-2", text: "Build audience / user base", done: false },
      { id: "p2-3", text: "Iterate based on feedback", done: false },
    ],
  },
  {
    id: 3,
    label: "P3",
    name: "Scale",
    months: "Months 19–30",
    color: "#8b5cf6",
    accent: "#8b5cf6",
    startDate: "2026-07-01",
    estimatedEndDate: "2027-06-30",
    tasks: [
      { id: "p3-1", text: "Systematize and document", done: false },
      { id: "p3-2", text: "Delegate and automate", done: false },
      { id: "p3-3", text: "Expand reach and impact", done: false },
    ],
  },
  {
    id: 4,
    label: "P4",
    name: "Sustain",
    months: "Months 31–36",
    color: "#06b6d4",
    accent: "#06b6d4",
    startDate: "2027-07-01",
    estimatedEndDate: "2027-12-31",
    tasks: [
      { id: "p4-1", text: "Consolidate gains", done: false },
      { id: "p4-2", text: "Long-term sustainability review", done: false },
    ],
  },
];
