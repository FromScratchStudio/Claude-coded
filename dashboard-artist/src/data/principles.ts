import type { DegradedMode, Principle, Trap, CollabCheck, BuildBudget } from "../types";

export const DEGRADED_MODES: DegradedMode[] = [
  {
    id: "crunch",
    label: "Crunch professionnel",
    color: "#EF4444",
    trigger: "Le travail salarié mange le temps du soir et la disponibilité cognitive",
    rules: [
      "Suspendre les UT du soir (zéro production en semaine)",
      "Maintenir uniquement la collecte d'idées (post-it, pas de tri)",
      "Week-end sanctuarisé : repos d'abord, UT minimale si l'énergie revient",
      "La banque d'avance absorbe la publication",
    ],
    exit: "Dès la première semaine normale, retour au rythme standard. Pas de compensation.",
  },
  {
    id: "conges",
    label: "Congés",
    color: "#F59E0B",
    trigger: "Période de congé professionnel — repos ou créneau privilégié",
    rules: [
      "Si repos : arrêt complet (créatif inclus)",
      "Si créneau privilégié : un seul chantier majeur maximum",
      "Pas de tentative de rattrapage post-congé",
    ],
    exit: "Reprise tranquille — ne pas exiger plus de soi-même la première semaine.",
  },
  {
    id: "maladie",
    label: "Maladie / épuisement",
    color: "#8B5CF6",
    trigger: "Maladie, épuisement physique ou mental",
    rules: [
      "Arrêt total créatif et publication",
      "La banque d'avance absorbe jusqu'à 4 semaines",
      "Au-delà : pause publique annoncée honnêtement",
      "Ne pas négocier avec soi-même, ne pas culpabiliser",
    ],
    exit: "Reprise sur signal médical clair. Énergie subjective ≥ 6/10 sur 7 jours consécutifs.",
  },
  {
    id: "vie",
    label: "Événement de vie",
    color: "#06B6D4",
    trigger: "Deuil, naissance, déménagement, crise familiale, etc.",
    rules: [
      "Suspension sans culpabilité, durée non chiffrée",
      "Communication honnête si la pause est visible publiquement",
      "Aucune décision stratégique pendant la suspension",
    ],
    exit: "Reprise quand la situation est stabilisée — pas avant.",
  },
];

export const PRINCIPLES: Principle[] = [
  { n: "I", text: "Un projet avance par chapitres finis, pas par motivation." },
  {
    n: "II",
    text: "L'actif central est la liste email propriétaire.",
    note: "Deux listes à gérer : Kefta Matesha et Altazar, rigoureusement séparées.",
  },
  { n: "III", text: "Mastery avant ambition." },
  {
    n: "IV",
    text: "La collaboration sert l'univers, sinon c'est de la prestation.",
    note: "La posse n'est pas une collaboration — c'est un dispositif d'auteur·e.",
  },
  { n: "V", text: "Le temps de création propre est non-négociable." },
  {
    n: "VI",
    text: "La durabilité prime sur la cadence.",
    quote: "Tu n'optimises pas ton talent. Tu optimises ta capacité à continuer.",
  },
  { n: "VII", text: "Le salaire est un scaffolding, pas une prison." },
  { n: "VIII", text: "L'ingénieur·e accélère, jamais ne cannibalise l'artiste." },
  {
    n: "IX",
    text: "La BD est le tronc, tout le reste sont des branches.",
    note: "Kefta Matesha est l'écosystème. Altazar porte les grandes branches latérales.",
  },
  { n: "X", text: "Le transmédia dérive du chapitre, jamais l'inverse." },
  {
    n: "XI",
    text: "Séparation rigoureuse des régimes de signature.",
    note: "Chaque œuvre se rattache à un seul régime. Aucun glissement sans décision documentée.",
  },
];

export const TRAPS: Trap[] = [
  { label: "Éparpillement par multi-capacité", desc: "Tu peux tout faire. Cela ne signifie pas que tu dois." },
  { label: "Apprentissage comme évitement", desc: "Apprendre est plus confortable que publier imparfait." },
  { label: "Sur-collaboration généreuse", desc: "Dire non est plus difficile qu'accepter, mais protège." },
  { label: "Équipement comme identité", desc: "Devenir « la personne qui a le matériel » est un piège." },
  { label: "Prestation B2B qui mange tout", desc: "Un contrat de 3 000 € peut sembler prioritaire — c'est faux." },
  { label: "Épuisement silencieux", desc: "Deux pratiques intenses sans conscience mène au burnout." },
  { label: "Pensée binaire transition pro", desc: "Le salaire protège ta liberté, il ne la compromet pas." },
  { label: "Ingénieur·e qui cannibalise l'artiste", desc: "Toute construction technique : besoin documenté, bornée." },
  { label: "Infrastructure perfectionniste", desc: "Ton piège le plus probable. Publier > infrastructure parfaite." },
  { label: "Glissement de projet en projet", desc: "Un projet fini vaut dix projets en cours." },
];

export const COLLAB_CHECKLIST: CollabCheck[] = [
  { q: "Univers", text: "Ce projet prolonge-t-il quelque chose de mon univers, ou est-ce 100% celui de l'autre ?" },
  { q: "Rôle", text: "Co-réalisation / co-production / DP avec crédit fort — ou simple exécution technique ?" },
  { q: "Durée", text: "Engagement < 10 jours de travail cumulés sur 3 mois ?" },
  { q: "Contrepartie", text: "Visibilité, crédits, accès audience, droits d'usage — au moins deux ?" },
  { q: "Matériel", text: "Liste explicite de ce qui est prêté, avec durée, caution, assurance ?" },
  { q: "Sortie", text: "L'œuvre finale sera-t-elle partageable sur mes canaux ?" },
  { q: "Réciprocité", text: "Cette personne peut-elle m'apporter quelque chose dans les 12 mois ?" },
  { q: "Filtre ultime", text: "Si je disais non, le regretterais-je dans un an ?" },
];

export const BUILD_BUDGETS: BuildBudget[] = [
  { phase: "Phase 0-1", months: "Mois 1-12", maxHours: 60, color: "#9CA3AF" },
  { phase: "Phase 2", months: "Mois 13-24", maxHours: 100, color: "#10B981" },
  { phase: "Phase 3", months: "Mois 25-36", maxHours: 200, color: "#8B5CF6" },
];
