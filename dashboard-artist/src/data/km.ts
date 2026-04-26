import type { KMIssue } from "../types";

export interface KMRubric {
  id: string;
  num: string;
  label: string;
}

export const KM_RUBRICS: KMRubric[] = [
  { id: "edito", num: "01", label: "L'Édito" },
  { id: "dossier", num: "02", label: "Le Dossier" },
  { id: "planche", num: "03", label: "La Planche" },
  { id: "terrain", num: "04", label: "Le Terrain" },
  { id: "analyse", num: "05", label: "L'Analyse" },
  { id: "archive", num: "06", label: "L'Archive" },
  { id: "sortie", num: "07", label: "La Sortie" },
  { id: "libre", num: "—", label: "Hors-rubrique" },
];

export const KM_ISSUE_STATUS_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  idee: { label: "Idée", color: "#5C5040", bg: "#1c1610" },
  preparation: { label: "Préparation", color: "#A8821F", bg: "#2a1f08" },
  production: { label: "Production", color: "#BF3209", bg: "#2a0e05" },
  finition: { label: "Finition", color: "#c9a84c", bg: "#2a220a" },
  publie: { label: "Publié", color: "#10b981", bg: "#064e3b" },
  archive: { label: "Archivé", color: "#5C5040", bg: "#141008" },
};

export const KM_ARTICLE_STATUS_META: Record<
  string,
  { label: string; color: string }
> = {
  idee: { label: "Idée", color: "#5C5040" },
  brief: { label: "Brief", color: "#A8821F" },
  redaction: { label: "Rédaction", color: "#BF3209" },
  relecture: { label: "Relecture", color: "#c9a84c" },
  valide: { label: "Validé", color: "#10b981" },
  publie: { label: "Publié", color: "#22c55e" },
};

export const KM_ARTICLE_STATUS_ORDER: string[] = [
  "idee",
  "brief",
  "redaction",
  "relecture",
  "valide",
  "publie",
];

export const KM_ISSUE_STATUS_ORDER: string[] = [
  "idee",
  "preparation",
  "production",
  "finition",
  "publie",
  "archive",
];

// Seed data — N°001
export const KM_ISSUES_SEED: KMIssue[] = [
  {
    id: "km-001",
    num: 1,
    theme: "L'Œil augmenté de la rue",
    targetDate: "2026-06-01",
    publishedDate: "",
    status: "production",
    note: "Premier numéro — Studio FromScratch & HINOIA · Digital + collector print · 8 semaines de production",
    articles: [
      {
        id: "a-001-1",
        rubricId: "edito",
        title: "Manifeste — Pourquoi Kefta Matesha",
        author: "FromScratch",
        status: "relecture",
        wordTarget: 400,
        note: "",
      },
      {
        id: "a-001-2",
        rubricId: "dossier",
        title: "L'Œil augmenté de la rue",
        author: "GhostWriter & Notche",
        status: "redaction",
        wordTarget: 2800,
        note: "Dossier central · Inclure entretien photographe",
      },
      {
        id: "a-001-3",
        rubricId: "planche",
        title: "Couverture N°001",
        author: "Moxo",
        status: "valide",
        wordTarget: 0,
        note: "Format 210×297 · Impression Risographie",
      },
      {
        id: "a-001-4",
        rubricId: "terrain",
        title: "Studios underground — Paris",
        author: "GhostWriter",
        status: "brief",
        wordTarget: 1200,
        note: "",
      },
      {
        id: "a-001-5",
        rubricId: "archive",
        title: "Affiches blaxploitation 1971–1979",
        author: "Blaise",
        status: "valide",
        wordTarget: 800,
        note: "6 affiches analysées — sources confirmées",
      },
      {
        id: "a-001-6",
        rubricId: "sortie",
        title: "5 albums · 3 livres · 2 expos",
        author: "La posse",
        status: "relecture",
        wordTarget: 0,
        note: "Sélection collective · Couverture été 2026",
      },
    ],
  },
];
