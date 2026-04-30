import type { AppConfig } from "../types";

export const DEFAULT_CONFIG: AppConfig = {
  appName: "My Dashboard",
  appTagline: "Strategy · Projects · Execution",
  accentColor: "#4c7fc9",

  onboardingComplete: false,

  timeUnitLabel: "UT",
  timeUnitPluralLabel: "UTs",
  timeUnitMinutes: 90,
  weeklyTimeUnitTarget: 12,

  energyLabel: "Energy",
  satisfactionLabel: "Satisfaction",
  capacityLabel: "Days Out",

  rings: [
    {
      id: "core",
      label: "Core",
      description: "Primary strategic focus",
      color: "#4c7fc9",
      defaultPct: 40,
    },
    {
      id: "secondary",
      label: "Secondary",
      description: "Important but not primary",
      color: "#10b981",
      defaultPct: 30,
    },
    {
      id: "support",
      label: "Support",
      description: "Enabling work",
      color: "#f59e0b",
      defaultPct: 20,
    },
    {
      id: "exploration",
      label: "Exploration",
      description: "Experimental and R&D",
      color: "#8b5cf6",
      defaultPct: 10,
    },
  ],

  allocationCategories: [
    { id: "focus", label: "Core Focus", color: "#4c7fc9" },
    { id: "growth", label: "Growth", color: "#10b981" },
    { id: "maintenance", label: "Maintenance", color: "#f59e0b" },
    { id: "exploration", label: "Exploration", color: "#8b5cf6" },
  ],

  contentHubLabel: "Content Hub",
  contentSeriesLabel: "Series",
  contentSeriesPluralLabel: "Series",
  contentItemLabel: "Entry",
  contentItemPluralLabel: "Entries",

  personasLabel: "Personas",
  personaSingularLabel: "Persona",

  pipelineItemLabel: "Item",
  pipelineItemPluralLabel: "Items",

  quarterGoalLabel: "Quarter Goal",
  quarterThemeLabel: "Narrative Theme",

  modules: {
    pipeline: true,
    projects: true,
    kpis: true,
    quarter: true,
    phases: true,
    guardrails: true,
    personas: true,
    ideas: true,
    contentHub: true,
    weeklyCalendar: true,
    retrospective: true,
  },
};
