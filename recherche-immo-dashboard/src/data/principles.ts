import type { OperationalMode, Principle, RiskPattern, CollabCheck, PhaseBudget } from "../types";

export const OPERATIONAL_MODES: OperationalMode[] = [
  {
    id: "normal",
    label: "Normal",
    color: "#10b981",
    trigger: "Default operating state",
    rules: [
      "Full scope available",
      "Regular cadence maintained",
      "All projects active",
    ],
    exit: "Always in normal unless triggered",
    slotDurationMin: 90,
  },
  {
    id: "reduced",
    label: "Reduced Capacity",
    color: "#f59e0b",
    trigger: "Travel, illness, high cognitive load, or external pressure",
    rules: [
      "Core Focus projects only",
      "Admin batched to one session/day",
      "No new commitments",
    ],
    exit: "When capacity is restored and backlog is cleared",
    slotDurationMin: 45,
  },
  {
    id: "minimal",
    label: "Minimal Mode",
    color: "#ef4444",
    trigger: "Crisis, burnout signal, or major life event",
    rules: [
      "Single priority item only",
      "Skip non-essential communications",
      "No new work accepted",
    ],
    exit: "Requires deliberate decision to exit after 2-day minimum",
    slotDurationMin: 25,
  },
];

export const PRINCIPLES: Principle[] = [
  {
    n: "1",
    text: "Clarity before action — define before executing",
    note: "Write the problem before solving it",
    quote: "A problem well-stated is half-solved.",
  },
  {
    n: "2",
    text: "Depth over breadth — fewer things, done completely",
    note: "Limit WIP ruthlessly",
  },
  {
    n: "3",
    text: "Ship to learn — release early, improve continuously",
    note: "Perfect is the enemy of shipped",
  },
  {
    n: "4",
    text: "Protect recovery time — rest is part of the system",
    note: "Schedule rest like work",
  },
  {
    n: "5",
    text: "Measure what matters — KPIs drive decisions",
    note: "If it's not measured, it's not managed",
  },
];

export const RISK_PATTERNS: RiskPattern[] = [
  {
    id: "r1",
    label: "Scope Creep",
    desc: "Adding features/tasks without removing others. Kill with written scope documents.",
  },
  {
    id: "r2",
    label: "Context Switching",
    desc: "Jumping between unrelated work. Protect focus blocks ruthlessly.",
  },
  {
    id: "r3",
    label: "Perfectionism Spiral",
    desc: "Polishing indefinitely instead of shipping. Set a done definition before starting.",
  },
  {
    id: "r4",
    label: "Invisible Work",
    desc: "Time spent on tasks not tracked. Log everything for one week to reveal true costs.",
  },
];

export const COLLAB_CHECKLIST: CollabCheck[] = [
  { id: "cc1", q: "1", text: "Scope and deliverables are written and agreed upon" },
  { id: "cc2", q: "2", text: "Timeline and milestones are explicit" },
  { id: "cc3", q: "3", text: "Communication channel and cadence defined" },
  { id: "cc4", q: "4", text: "Payment / compensation terms documented" },
  { id: "cc5", q: "5", text: "Ownership and rights are clear" },
  { id: "cc6", q: "6", text: "Exit / cancellation clause exists" },
];

export const PHASE_BUDGETS: PhaseBudget[] = [
  { phase: "P1 — Foundation", months: "1–6", maxHours: 480, color: "#f59e0b" },
  { phase: "P2 — Build", months: "7–18", maxHours: 960, color: "#10b981" },
  { phase: "P3 — Scale", months: "19–30", maxHours: 1200, color: "#8b5cf6" },
  { phase: "P4 — Sustain", months: "31–36", maxHours: 600, color: "#06b6d4" },
];
