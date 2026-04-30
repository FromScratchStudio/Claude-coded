import type { WorkflowStage, PipelineItem, WorkMode } from "../types";

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 1,
    label: "Backlog",
    fullName: "Backlog / Idea",
    when: "When the idea is captured and needs definition",
    gates: ["Problem is clearly stated", "Value hypothesis written"],
    rule: "Nothing enters without a written hypothesis",
  },
  {
    id: 2,
    label: "Scoping",
    fullName: "Scoping & Design",
    when: "When the idea is validated and needs a plan",
    gates: ["Scope documented", "Effort estimated", "Dependencies mapped"],
    rule: "No work starts without a defined scope",
  },
  {
    id: 3,
    label: "In Progress",
    fullName: "In Progress",
    when: "Active execution phase",
    gates: ["Progress visible", "Blockers tracked"],
    rule: "Limit WIP — max 3 items at this stage",
  },
  {
    id: 4,
    label: "Review",
    fullName: "Review & Testing",
    when: "Work complete, needs validation",
    gates: ["Tested", "Feedback collected", "Revisions complete"],
    rule: "External eyes required before shipping",
  },
  {
    id: 5,
    label: "Ready",
    fullName: "Ready to Ship",
    when: "Validated and cleared for release",
    gates: ["All review gates passed", "Release notes written"],
    rule: "Only ship on scheduled release windows",
  },
  {
    id: 6,
    label: "Done",
    fullName: "Done / Published",
    when: "Released and live",
    gates: ["Metrics baseline captured", "Retrospective scheduled"],
    rule: "Measure impact after every release",
  },
];

export const PIPELINE_ITEMS_INIT: PipelineItem[] = [
  {
    id: "item-1",
    title: "Landing Page Redesign",
    stage: 3,
    gates: [false, true, false],
    lastUpdate: "Today",
    hook: "A fresh visual identity for the homepage",
    tags: ["design", "web"],
    startDate: "2025-04-01",
    estimatedEndDate: "2025-05-15",
  },
  {
    id: "item-2",
    title: "Onboarding Flow v2",
    stage: 2,
    gates: [true, false, false],
    lastUpdate: "Yesterday",
    hook: "Reduce drop-off in the first 5 minutes",
    tags: ["product", "ux"],
  },
  {
    id: "item-3",
    title: "API Documentation",
    stage: 4,
    gates: [true, true, false],
    lastUpdate: "This week",
    hook: "Complete developer reference docs",
    tags: ["docs"],
  },
];

export const WORK_MODES: WorkMode[] = [
  {
    id: "deep",
    name: "Deep Work",
    energy: 5,
    color: "#4c7fc9",
    desc: "Focused creation — complex problems, writing, building",
  },
  {
    id: "admin",
    name: "Admin",
    energy: 2,
    color: "#8a8fa8",
    desc: "Email, planning, reviews, coordination",
  },
  {
    id: "creative",
    name: "Creative",
    energy: 4,
    color: "#ec4899",
    desc: "Brainstorming, ideation, exploration",
  },
  {
    id: "collab",
    name: "Collaboration",
    energy: 3,
    color: "#10b981",
    desc: "Meetings, interviews, co-creation",
  },
  {
    id: "learning",
    name: "Learning",
    energy: 3,
    color: "#8b5cf6",
    desc: "Research, reading, courses",
  },
  {
    id: "rest",
    name: "Rest / Recovery",
    energy: 1,
    color: "#f59e0b",
    desc: "Low-intensity breaks and recovery time",
  },
];
