import type { Ring, Project } from "../types";

export const RINGS: Ring[] = [
  { id: "centre", label: "Centre", name: "BD Flagship", pct: 70, color: "#E8C547" },
  { id: "anneau1", label: "Anneau 1", name: "Amplifications solo", pct: 15, color: "#F97316" },
  { id: "anneau2", label: "Anneau 2", name: "Collaborations choisies", pct: 10, color: "#06B6D4" },
  { id: "anneau3", label: "Anneau 3", name: "Optionalité", pct: 5, color: "#A78BFA" },
];

export const RING_MAP: Record<string, Ring> = Object.fromEntries(
  RINGS.map((r) => [r.id, r])
);

export const PROJECTS_INIT: Project[] = [
  {
    id: "feuilleton",
    name: "Feuilleton BD principal",
    ring: "centre",
    phase: 0,
    status: "active",
    progress: 15,
    note: "Bible en cours — 2 épisodes écrits",
    priority: "high",
    startDate: "2025-01-01",
    estimatedEndDate: "2027-12-31",
  },
  {
    id: "substack",
    name: "Publication Substack",
    ring: "centre",
    phase: 0,
    status: "active",
    progress: 40,
    note: "Page À propos publiée, identité en cours",
    priority: "high",
    startDate: "2025-01-01",
    estimatedEndDate: "2025-04-30",
  },
  {
    id: "pipeline",
    name: "Pipeline technique",
    ring: "centre",
    phase: 0,
    status: "active",
    progress: 20,
    note: "Automation cross-plateforme à installer",
    priority: "medium",
    startDate: "2025-01-15",
    estimatedEndDate: "2025-03-31",
  },
  {
    id: "trailer",
    name: "Trailer animé crowdfunding",
    ring: "anneau1",
    phase: 1,
    status: "backlog",
    progress: 0,
    note: "À produire sur congé mois 10-11",
    priority: "medium",
    startDate: "2025-10-01",
    estimatedEndDate: "2025-11-30",
  },
  {
    id: "collab1",
    name: "Collaboration structurée #1",
    ring: "anneau2",
    phase: 2,
    status: "backlog",
    progress: 0,
    note: "Pas avant mois 12 — identifier 1 personne",
    priority: "low",
    startDate: "2026-01-01",
    estimatedEndDate: "2026-08-31",
  },
  {
    id: "crowdfunding1",
    name: "Premier crowdfunding",
    ring: "anneau1",
    phase: 2,
    status: "backlog",
    progress: 0,
    note: "Mois 14-16 — trailer comme asset central",
    priority: "low",
    startDate: "2026-02-01",
    estimatedEndDate: "2026-04-30",
  },
  {
    id: "location",
    name: "Location passive matériel",
    ring: "anneau3",
    phase: 0,
    status: "pending",
    progress: 10,
    note: "Fiche technique + tarifs à structurer",
    priority: "low",
  },
];

export const STATUS_META = {
  active: { label: "En cours", color: "#10B981", bg: "#064E3B" },
  pending: { label: "À démarrer", color: "#F59E0B", bg: "#451A03" },
  backlog: { label: "Backlog", color: "#6B7280", bg: "#1F2937" },
} as const;

export const PRIORITY_META = {
  high: { label: "Haute", dot: "#EF4444" },
  medium: { label: "Moyenne", dot: "#F59E0B" },
  low: { label: "Basse", dot: "#6B7280" },
} as const;
