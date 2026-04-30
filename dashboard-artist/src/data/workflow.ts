import type { WorkflowStage, Chapter, WorkMode } from "../types";

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 1,
    label: "Noyau",
    fullName: "Noyau narratif",
    when: "Soir, 30-45 min",
    gates: [
      "Thème énonçable en une phrase",
      "Tension centrale identifiée",
      "Promesse lecteur·trice formulée",
      "Transformation définie (« à la fin, X a changé »)",
    ],
    rule: "Si tu ne sais pas ce qui change à la fin, tu ne continues pas.",
  },
  {
    id: 2,
    label: "Prototype",
    fullName: "Prototype (sas de survie)",
    when: "Soir, 1-3 sessions × 45 min",
    gates: [
      "Rythme validé (lecture à voix haute)",
      "Émotion passe sans dessin propre",
      "Fin / cliff / respiration testée",
      "Aucune ambiguïté page à page",
    ],
    rule: "Si le prototype ne passe pas, le chapitre est jeté ou réécrit. Pas amélioré.",
  },
  {
    id: 3,
    label: "Verrou",
    fullName: "Mise en scène unifiée",
    when: "Soir, 1-2 sessions",
    gates: [
      "Storyboard définitif (pas en cours)",
      "Format maître choisi (print ou web)",
      "Palette de chapitre identifiée",
      "Aucune case encore à penser",
    ],
    rule: "Après cette étape, le chapitre est décidé. Le week-end ne sert plus à réfléchir.",
  },
  {
    id: 4,
    label: "Rough++",
    fullName: "Rough++ décisionnel",
    when: "Week-end, bloc 2-3h",
    gates: [
      "Fluidité visuelle confirmée (lecture à blanc)",
      "Narration claire même sans bulles",
      "Aucune case laisse un doute",
    ],
    rule: "Si la simulation de lecture échoue : retour correction. Pas de clean.",
  },
  {
    id: 5,
    label: "Clean",
    fullName: "Clean + couleur ciblée",
    when: "Week-end, 1-2 blocs",
    gates: [
      "Clean uniquement sur cases nécessaires",
      "Palette restreinte respectée",
      "Export multi-format fait",
      "Fichiers sources sauvegardés",
    ],
    rule: "Ici, tu es artisan. L'auteur·e a décidé aux étapes 1-3.",
  },
  {
    id: 6,
    label: "Publi",
    fullName: "Publication + trace",
    when: "Fin de week-end",
    gates: [
      "Publication effective sur Substack",
      "Déclinaisons multi-plateformes automatisées",
      "Trace publiée (croquis, note, extrait)",
      "Métriques notées + debrief à J+7/10",
    ],
    rule: "Boucle post-publi J+7/10 : ce chapitre enseigne quoi au suivant ?",
  },
];

export const CHAPTERS_INIT: Chapter[] = [
  {
    id: "ch1",
    title: "Pilote",
    stage: 6,
    gates: [true, true, true, true],
    lastUpdate: "il y a 2 sem.",
    hook: "Scène d'ouverture supporte un trailer atmosphérique",
    startDate: "2025-01-01",
    estimatedEndDate: "2025-01-28",
  },
  {
    id: "ch2",
    title: "Rencontre",
    stage: 5,
    gates: [true, true, false, false],
    lastUpdate: "il y a 3 jours",
    hook: "Séquence centrale → motion comic autonome possible",
    startDate: "2025-02-01",
    estimatedEndDate: "2025-02-25",
  },
  {
    id: "ch3",
    title: "Révélation",
    stage: 4,
    gates: [true, false, false],
    lastUpdate: "hier",
    hook: "",
  },
  {
    id: "ch4",
    title: "Rupture",
    stage: 3,
    gates: [true, true, false, false],
    lastUpdate: "il y a 5 jours",
    hook: "Fin du chapitre = teaser saisissant",
  },
  {
    id: "ch5",
    title: "Fuite",
    stage: 2,
    gates: [false, false, false, false],
    lastUpdate: "il y a 1 sem.",
    hook: "",
  },
  {
    id: "ch6",
    title: "Confrontation",
    stage: 1,
    gates: [true, false, false, false],
    lastUpdate: "il y a 2 sem.",
    hook: "Climax visuel — court-métrage potentiel",
  },
];

export const WORK_MODES: WorkMode[] = [
  { id: "MT-C", name: "Création brute", energy: 5, color: "#E8C547", desc: "Écriture, roughs, idéation" },
  { id: "MT-P", name: "Production", energy: 3, color: "#F97316", desc: "Clean, couleur, mise en page" },
  { id: "MT-O", name: "Optimisation", energy: 2, color: "#10B981", desc: "Retouches, polish, relecture" },
  { id: "MT-D", name: "Diffusion", energy: 2, color: "#06B6D4", desc: "Publication, cross-post, newsletter" },
  { id: "MT-R", name: "Recherche/Veille", energy: 1, color: "#A78BFA", desc: "Lectures, tutos, références" },
  { id: "MT-H", name: "Humanisation IA", energy: 2, color: "#EC4899", desc: "Passage humain sur matière IA" },
];

/** Gates count for each workflow stage (from WORKFLOW_STAGES). */
export function gatesCountForStage(stageId: number): number {
  return WORKFLOW_STAGES.find((s) => s.id === stageId)?.gates.length ?? 0;
}

/** Derive banque d'avance: chapters at stage 4 or 5 (ready but not yet published). */
export function computeBank(chapters: Chapter[]): number {
  return chapters.filter((c) => c.stage >= 4 && c.stage < 6).length;
}

/** Count chapters with a transmedia hook. */
export function countHooks(chapters: Chapter[]): number {
  return chapters.filter((c) => c.hook.trim().length > 0).length;
}
