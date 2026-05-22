import type { AppConfig } from "../types";

export const DEFAULT_CONFIG: AppConfig = {
  appName: "Recherche Immo Dashboard",
  appTagline: "Recherche · Suivi projets · Visites",
  accentColor: "#4c7fc9",

  onboardingComplete: true,

  timeUnitLabel: "Unité",
  timeUnitPluralLabel: "Unités",
  timeUnitMinutes: 90,
  weeklyTimeUnitTarget: 12,

  energyLabel: "Énergie",
  satisfactionLabel: "Satisfaction",
  capacityLabel: "Jours off",

  rings: [
    {
      id: "core",
      label: "Prioritaire",
      description: "Biens les plus pertinents",
      color: "#4c7fc9",
      defaultPct: 40,
    },
    {
      id: "secondary",
      label: "Secondaire",
      description: "Biens intéressants à suivre",
      color: "#10b981",
      defaultPct: 30,
    },
    {
      id: "support",
      label: "Support",
      description: "Actions de support",
      color: "#f59e0b",
      defaultPct: 20,
    },
    {
      id: "exploration",
      label: "Exploration",
      description: "Pistes à explorer",
      color: "#8b5cf6",
      defaultPct: 10,
    },
  ],

  allocationCategories: [
    { id: "focus", label: "Focus", color: "#4c7fc9" },
    { id: "growth", label: "Croissance", color: "#10b981" },
    { id: "maintenance", label: "Maintenance", color: "#f59e0b" },
    { id: "exploration", label: "Exploration", color: "#8b5cf6" },
  ],

  contentHubLabel: "Contenu",
  contentSeriesLabel: "Série",
  contentSeriesPluralLabel: "Séries",
  contentItemLabel: "Élément",
  contentItemPluralLabel: "Éléments",

  personasLabel: "Personas",
  personaSingularLabel: "Persona",

  pipelineItemLabel: "Dossier",
  pipelineItemPluralLabel: "Dossiers",

  quarterGoalLabel: "Objectif trimestriel",
  quarterThemeLabel: "Thème",

  aiProvider: "openai",
  aiProviders: {
    openai: { apiKey: "", model: "gpt-4o-mini" },
  },
  aiSystemPrompt: "Tu es un assistant de suivi pour la recherche immobilière. Analyse les données projets, pipeline et calendrier et propose des actions concrètes.",

  modules: {
    pipeline: true,
    projects: true,
    kpis: false,
    quarter: false,
    phases: false,
    guardrails: false,
    personas: false,
    ideas: false,
    contentHub: false,
    weeklyCalendar: true,
    retrospective: false,
    aiAdvisor: false,
  },
};
