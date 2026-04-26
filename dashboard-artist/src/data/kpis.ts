import type { KpiDef, Quarter } from "../types";

export const KPI_DEFS: KpiDef[] = [
  {
    key: "subscribers",
    label: "Abonnés email",
    target3m: 200,
    target12m: 800,
    target36m: 4500,
    unit: "",
    icon: "✉",
  },
  {
    key: "openRate",
    label: "Taux ouverture",
    target3m: 50,
    target12m: 45,
    target36m: 42,
    unit: "%",
    icon: "📬",
  },
  {
    key: "paidPct",
    label: "% payants",
    target3m: 2,
    target12m: 5,
    target36m: 6,
    unit: "%",
    icon: "💳",
  },
  {
    key: "revenue",
    label: "Revenu mensuel",
    target3m: 0,
    target12m: 800,
    target36m: 3000,
    unit: "€",
    icon: "📈",
  },
  {
    key: "bank",
    label: "Banque d'avance",
    target3m: 3,
    target12m: 4,
    target36m: 6,
    unit: " éps.",
    icon: "📚",
  },
];

export const KPI_DEFAULTS: Record<string, number> = Object.fromEntries(
  KPI_DEFS.map((k) => [k.key, 0])
);

export const QUARTER_DEFAULT: Quarter = {
  q: "Q2 2026",
  plp: "Installer le feuilleton et publier les 4 premiers épisodes",
  arc: "Arc 1 — Pilote → Confrontation (ch. 1 à 6)",
  arcEnd: "À la fin de l'arc : le personnage principal a franchi le seuil",
  allocation: { centre: 75, ampli: 10, collab: 0, opt: 15 },
  amplification: "Aucune — phase de fondation",
  outilFocal: "Toon Boom Harmony — sur une séquence de 3 sec du trailer",
  zonesRouges: "Semaine 8 : sprint produit au travail. Semaine 11 : code freeze.",
  regleUnique: "Publier imparfait plutôt que parfait différé.",
};
