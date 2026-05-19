// ─── App Configuration ────────────────────────────────────────────────────────

export interface RingConfig {
  id: string;
  label: string;
  description: string;
  color: string;
  defaultPct: number;
}

export interface AllocationCategory {
  id: string;
  label: string;
  color: string;
}

export interface ModuleFlags {
  pipeline: boolean;
  projects: boolean;
  kpis: boolean;
  quarter: boolean;
  phases: boolean;
  guardrails: boolean;
  personas: boolean;
  ideas: boolean;
  contentHub: boolean;
  weeklyCalendar: boolean;
  retrospective: boolean;
  aiAdvisor: boolean;
}

export interface AppConfig {
  // Branding
  appName: string;
  appTagline: string;
  accentColor: string;

  // Onboarding
  onboardingComplete: boolean;

  // Time unit system
  timeUnitLabel: string;
  timeUnitPluralLabel: string;
  timeUnitMinutes: number;
  weeklyTimeUnitTarget: number;

  // Wellness / metrics labels (configurable names)
  energyLabel: string;
  satisfactionLabel: string;
  capacityLabel: string;

  // Allocation rings (project portfolio categories)
  rings: RingConfig[];

  // Quarter allocation categories
  allocationCategories: AllocationCategory[];

  // Content hub labels
  contentHubLabel: string;
  contentSeriesLabel: string;
  contentSeriesPluralLabel: string;
  contentItemLabel: string;
  contentItemPluralLabel: string;

  // Personas labels
  personasLabel: string;
  personaSingularLabel: string;

  // Pipeline item labels
  pipelineItemLabel: string;
  pipelineItemPluralLabel: string;

  // Quarter labels
  quarterGoalLabel: string;
  quarterThemeLabel: string;

  // AI Advisor
  aiProvider: AiProviderId;
  aiProviders: Partial<Record<AiProviderId, AiProviderConfig>>;
  aiSystemPrompt: string;

  // Module flags
  modules: ModuleFlags;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type ViewId =
  | "dashboard"
  | "pipeline"
  | "projects"
  | "kpis"
  | "quarter"
  | "phases"
  | "guardrails"
  | "personas"
  | "ideas"
  | "content-hub"
  | "weekly-calendar"
  | "retrospective"
  | "settings"
  | "user-guide"
  | "ai-advisor";

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
  startDate?: string;
  estimatedEndDate?: string;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export type ProjectStatus = "active" | "pending" | "backlog";
export type ProjectPriority = "high" | "medium" | "low";

export interface Project {
  id: string;
  name: string;
  ringId: string;
  phase: number;
  status: ProjectStatus;
  progress: number; // 0–100
  note: string;
  priority: ProjectPriority;
  tags: string[];
  startDate?: string;
  estimatedEndDate?: string;
  driveDocRefs?: DriveDocRef[];
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
  category: string;
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

export interface PipelineItem {
  id: string;
  title: string;
  stage: number;
  gates: boolean[];
  lastUpdate: string;
  hook: string;
  tags: string[];
  startDate?: string;
  estimatedEndDate?: string;
}

export interface WorkMode {
  id: string;
  name: string;
  energy: number; // 1–5
  color: string;
  desc: string;
}

// ─── Quarter ──────────────────────────────────────────────────────────────────

export type QuarterAllocation = Record<string, number>;

export interface Quarter {
  q: string;
  goal: string;
  theme: string;
  themeEnd: string;
  allocation: QuarterAllocation;
  amplification: string;
  focalTool: string;
  redZones: string;
  singleRule: string;
}

// ─── Ideas ────────────────────────────────────────────────────────────────────

export type IdeaStage = "raw" | "sorted" | "selected";

export interface Idea {
  id: string;
  text: string;
  source: string;
  stage: IdeaStage;
  project?: string;
  tags: string[];
  createdAt: string;
}

// ─── Guardrails / principles ──────────────────────────────────────────────────

export interface OperationalMode {
  id: string;
  label: string;
  color: string;
  trigger: string;
  rules: string[];
  exit: string;
  slotDurationMin?: number;
}

export interface Principle {
  n: string;
  text: string;
  note?: string;
  quote?: string;
}

export interface RiskPattern {
  id: string;
  label: string;
  desc: string;
}

export interface CollabCheck {
  id: string;
  q: string;
  text: string;
}

export interface PhaseBudget {
  phase: string;
  months: string;
  maxHours: number;
  color: string;
}

// ─── Personas ─────────────────────────────────────────────────────────────────

export interface PersonaMember {
  name: string;
  role: string;
  voice: string;
  refs: string;
}

export interface Inspiration {
  name: string;
  work: string;
  contribution: string;
}

export interface Persona {
  id: string;
  code: string;
  name: string;
  label: string;
  color: string;
  audience: string;
  role: string;
  detail: string;
  members?: PersonaMember[];
  inspirations?: Inspiration[];
  lexicon?: string;
  playlist?: string[];
  persona?: string;
  tone?: string;
}

// ─── Content Hub ──────────────────────────────────────────────────────────────

export type ContentSeriesStatus =
  | "idea"
  | "preparation"
  | "production"
  | "finishing"
  | "published"
  | "archived";

export type ContentItemStatus =
  | "idea"
  | "brief"
  | "draft"
  | "review"
  | "approved"
  | "published";

export interface ContentEntry {
  id: string;
  categoryId: string;
  title: string;
  author: string;
  status: ContentItemStatus;
  wordTarget: number;
  note: string;
}

export interface ContentSeries {
  id: string;
  num: number;
  theme: string;
  targetDate: string;
  publishedDate: string;
  status: ContentSeriesStatus;
  entries: ContentEntry[];
  note: string;
}

// ─── Weekly retrospective ─────────────────────────────────────────────────────

export interface WeeklyRetro {
  id: string;
  weekKey: string;
  energyScore: number;
  satisfactionScore: number;
  accomplished: string;
  blockers: string;
  learnings: string;
  nextWeekIntent: string;
  completionPct: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Weekly calendar ──────────────────────────────────────────────────────────

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ScheduleSlotType = "planned" | "unplanned";

export interface ScheduleSlot {
  id: string;
  weekKey: string;
  day: DayIndex;
  hour: number;
  durationMin: number;
  utCount: number;
  workModeId: string | null;
  projectId: string | null;
  note: string;
  slotType?: ScheduleSlotType;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
}

// ─── Google Drive ─────────────────────────────────────────────────────────────

export type DriveDocType = "doc" | "sheet" | "slides" | "form" | "folder" | "other";

export interface DriveDocRef {
  id: string;
  name: string;
  url: string;
  type: DriveDocType;
  note: string;
  addedAt: string;
}

export interface GoogleDriveConfig {
  folderUrl: string;
  folderName: string;
}

// ─── AI Advisor ───────────────────────────────────────────────────────────────

export type AiProviderId = "openai" | "anthropic" | "gemini" | "ollama" | "custom";

export interface AiProviderConfig {
  apiKey: string;
  model: string;
  /** Custom base URL override (used for "custom" and "ollama" providers). */
  baseUrl?: string;
}

export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
}

export interface AiConversation {
  id: string;
  title: string;
  messages: AiMessage[];
  createdAt: string;
}
