// ─── Navigation ───────────────────────────────────────────────────────────────

export type ViewId =
  | "dashboard"
  | "pipeline"
  | "projects"
  | "kpis"
  | "trimestre"
  | "phases"
  | "garde-fous"
  | "referentiel"
  | "ideas"
  | "kefta-matesha"
  | "weekly-calendar"
  | "retrospective"
  | "settings"
  | "user-guide";

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  text: string;
  done: boolean;
}

export interface Phase {
  id: number;
  label: string;
  name: string;
  months: string;
  color: string;
  accent: string;
  tasks: Task[];
  startDate?: string;       // ISO date string, e.g. "2025-01-01"
  estimatedEndDate?: string; // ISO date string
}

// ─── Allocation rings ─────────────────────────────────────────────────────────

export type RingId = "centre" | "anneau1" | "anneau2" | "anneau3";

export interface Ring {
  id: RingId;
  label: string;
  name: string;
  pct: number;
  color: string;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export type ProjectStatus = "active" | "pending" | "backlog";
export type ProjectPriority = "high" | "medium" | "low";

export interface Project {
  id: string;
  name: string;
  ring: RingId;
  phase: number;
  status: ProjectStatus;
  progress: number; // 0–100
  note: string;
  priority: ProjectPriority;
  startDate?: string;       // ISO date string
  estimatedEndDate?: string; // ISO date string
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

// ─── Workflow / pipeline ──────────────────────────────────────────────────────

export interface WorkflowStage {
  id: number;
  label: string;
  fullName: string;
  when: string;
  gates: string[];
  rule: string;
}

export interface Chapter {
  id: string;
  title: string;
  stage: number; // 1–6 (maps to WorkflowStage id)
  gates: boolean[];
  lastUpdate: string;
  hook: string;
  startDate?: string;       // ISO date string
  estimatedEndDate?: string; // ISO date string (target publication)
}

export interface WorkMode {
  id: string;
  name: string;
  energy: number; // 1–5
  color: string;
  desc: string;
}

// ─── Quarter ──────────────────────────────────────────────────────────────────

export interface QuarterAllocation {
  centre: number;
  ampli: number;
  collab: number;
  opt: number;
}

export interface Quarter {
  q: string;
  plp: string;
  arc: string;
  arcEnd: string;
  allocation: QuarterAllocation;
  amplification: string;
  outilFocal: string;
  zonesRouges: string;
  regleUnique: string;
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

// ─── Safeguards / principles ──────────────────────────────────────────────────

export interface DegradedMode {
  id: string;
  label: string;
  color: string;
  trigger: string;
  rules: string[];
  exit: string;
  /** Durée d'un créneau (UT) dans ce régime, en minutes. Undefined = utiliser defaultSlotDurationMin. */
  slotDurationMin?: number;
}

export interface Principle {
  n: string;
  text: string;
  note?: string;
  quote?: string;
}

export interface Trap {
  id: string;
  label: string;
  desc: string;
}

export interface CollabCheck {
  id: string;
  q: string;
  text: string;
}

export interface BuildBudget {
  phase: string;
  months: string;
  maxHours: number;
  color: string;
}

// ─── Identity / heteronyms ────────────────────────────────────────────────────

export interface HeteronymMember {
  name: string;
  role: string;
  voice: string;
  refs: string;
}

export interface Inspiration {
  nom: string;
  oeuvre: string;
  apport: string;
}

export interface Heteronym {
  id: string;
  code: string;
  name: string;
  label: string;
  color: string;
  public: string;
  role: string;
  detail: string;
  members?: HeteronymMember[];
  inspirations?: Inspiration[];
  lexique?: string;
  playlist?: string[];
  persona?: string;
  ton?: string;
}

// ─── Kefta Matesha ────────────────────────────────────────────────────────────

export type KMIssueStatus =
  | "idee"
  | "preparation"
  | "production"
  | "finition"
  | "publie"
  | "archive";

export type KMArticleStatus =
  | "idee"
  | "brief"
  | "redaction"
  | "relecture"
  | "valide"
  | "publie";

export interface KMArticle {
  id: string;
  rubricId: string;
  title: string;
  author: string;
  status: KMArticleStatus;
  wordTarget: number;
  note: string;
}

export interface KMIssue {
  id: string;
  num: number;
  theme: string;
  targetDate: string;
  publishedDate: string;
  status: KMIssueStatus;
  articles: KMArticle[];
  note: string;
}

// ─── Weekly retrospective ────────────────────────────────────────────────────

export interface WeeklyRetro {
  id: string;
  weekKey: string;          // "2026-W18"
  energyScore: number;      // 1–10
  pleasureScore: number;    // 1–10
  accomplished: string;
  blockers: string;
  learnings: string;
  nextWeekIntent: string;
  completionPct: number;    // 0–100, créneaux réalisés vs planifiés
  createdAt: string;
  updatedAt: string;
}

// ─── Weekly calendar / schedule ───────────────────────────────────────────────

/** 0 = Monday … 6 = Sunday */
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ScheduleSlot {
  id: string;
  weekKey: string;        // ISO week key e.g. "2026-W18"
  day: DayIndex;          // 0 = Monday … 6 = Sunday
  hour: number;           // start hour (integer, e.g. 10 = 10:00)
  durationMin: number;    // actual duration in minutes (= utCount * UT at creation)
  utCount: number;        // number of UTs booked
  workModeId: string | null;  // links to WorkMode.id
  projectId: string | null;   // links to Project.id
  note: string;
}
