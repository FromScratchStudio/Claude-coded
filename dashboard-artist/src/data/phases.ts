import type { Phase } from "../types";

export const PHASES: Phase[] = [
  {
    id: 0,
    label: "Phase 0",
    name: "Fondations",
    months: "Mois 1–4",
    color: "#6B7280",
    accent: "#9CA3AF",
    startDate: "2025-01-01",
    estimatedEndDate: "2025-04-30",
    tasks: [
      { id: "p0-1", text: "Ouvrir le Substack (identité + À propos + manifeste)", done: true },
      { id: "p0-2", text: "Bible d'univers du feuilleton (personnages, cosmogonie, arc macro)", done: true },
      { id: "p0-3", text: "Script des 8-10 premiers épisodes", done: false },
      { id: "p0-4", text: "Publication du premier épisode (sem. 12-14 max)", done: false },
      { id: "p0-5", text: "Pipeline technique (automation cross-plateforme, dashboards)", done: false },
      { id: "p0-6", text: "Identifier 3-5 créateur·trices de l'écosystème", done: false },
    ],
  },
  {
    id: 1,
    label: "Phase 1",
    name: "Installation du rythme",
    months: "Mois 5–12",
    color: "#B45309",
    accent: "#F59E0B",
    startDate: "2025-05-01",
    estimatedEndDate: "2025-12-31",
    tasks: [
      { id: "p1-1", text: "Publication bi-mensuelle stricte — aucune exception", done: false },
      { id: "p1-2", text: "Mini-contenus hebdomadaires (croquis, notes, making-of)", done: false },
      { id: "p1-3", text: "Ouverture paliers payants (mois 8)", done: false },
      { id: "p1-4", text: "Trailer animé produit sur un congé (mois 10-11)", done: false },
      { id: "p1-5", text: "Outil focal : un par trimestre sur projet réel", done: false },
      { id: "p1-6", text: "Aucune collaboration avant le mois 12", done: false },
    ],
  },
  {
    id: 2,
    label: "Phase 2",
    name: "Première matérialisation",
    months: "Mois 13–24",
    color: "#065F46",
    accent: "#10B981",
    startDate: "2026-01-01",
    estimatedEndDate: "2026-12-31",
    tasks: [
      { id: "p2-1", text: "Premier crowdfunding (mois 14-16) — objectif 8-15 k€", done: false },
      { id: "p2-2", text: "Première collaboration structurée (mois 18-20)", done: false },
      { id: "p2-3", text: "Approfondissement Harmony/Moho — motion comic", done: false },
      { id: "p2-4", text: "Bilan honnête mois 22 — système, KPIs, énergie", done: false },
    ],
  },
  {
    id: 3,
    label: "Phase 3",
    name: "Consolidation & décision",
    months: "Mois 25–36",
    color: "#4C1D95",
    accent: "#8B5CF6",
    startDate: "2027-01-01",
    estimatedEndDate: "2027-12-31",
    tasks: [
      { id: "p3-1", text: "Banque d'avance 4-6 épisodes confortable", done: false },
      { id: "p3-2", text: "Deuxième crowdfunding (mois 28-30)", done: false },
      { id: "p3-3", text: "Choix et lancement du projet-signature long (mois 26)", done: false },
      { id: "p3-4", text: "2 collaborations cadrées dans l'année", done: false },
      { id: "p3-5", text: "Question d'optionalité posée (mois 33-36)", done: false },
    ],
  },
];

/** Returns the currently active phase (first phase with incomplete tasks). */
export function currentPhaseIndex(): number {
  for (const phase of PHASES) {
    const hasIncomplete = phase.tasks.some((t) => !t.done);
    if (hasIncomplete) return phase.id;
  }
  return PHASES.length - 1;
}
