// ─── Navigation ───────────────────────────────────────────────────────────────

export type ViewId =
  | "dashboard"
  | "pipeline"
  | "projects"
  | "kpis"
  | "roadmap"
  | "ideas"
  | "planning"
  | "principles"
  | "referentiel"
  | "settings";

// ─── App settings ─────────────────────────────────────────────────────────────

export interface AppSettings {
  name: string;
  tagline: string;
  accentColor: string;
}

// ─── Categories (project buckets) ─────────────────────────────────────────────

export interface Category {
  id: string;
  label: string;
  name: string;
  color: string;
  pct: number;
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export interface PhaseTask {
  id: string;
  text: string;
  done: boolean;
}

export interface Phase {
  id: string;
  label: string;
  name: string;
  duration: string;
  accent: string;
  tasks: PhaseTask[];
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────

export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  color: string;
  order: number;
}

export interface PipelineItem {
  id: string;
  title: string;
  stageId: string;
  categoryId: string;
  note: string;
  dueDate: string;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export type ProjectStatus = "active" | "pending" | "backlog" | "done";
export type ProjectPriority = "high" | "medium" | "low";

export interface Project {
  id: string;
  name: string;
  categoryId: string;
  phaseId: string;
  status: ProjectStatus;
  progress: number;
  note: string;
  priority: ProjectPriority;
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export interface KpiDef {
  key: string;
  label: string;
  target3m: number;
  target12m: number;
  target36m: number;
  unit: string;
  icon: string;
}

// ─── Ideas ────────────────────────────────────────────────────────────────────

export type IdeaStage = "raw" | "sorted" | "selected";

export interface Idea {
  id: string;
  text: string;
  source: string;
  stage: IdeaStage;
  project?: string;
  createdAt: string;
}

// ─── Planning ─────────────────────────────────────────────────────────────────

export interface Planning {
  period: string;
  objective: string;
  arc: string;
  arcEnd: string;
  focalTool: string;
  redZones: string;
  singleRule: string;
}

// ─── Principles / safeguards ──────────────────────────────────────────────────

export interface Principle {
  id: string;
  name: string;
  color: string;
  trigger: string;
  rules: string[];
  exit: string;
}

// ─── Referential entities ─────────────────────────────────────────────────────

export interface Entity {
  id: string;
  name: string;
  role: string;
  color: string;
  description: string;
  contact: string;
  tags: string[];
  notes: string;
}
