import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ViewId, AppConfig, Project, PipelineItem, Quarter, Idea,
  ContentSeries, ContentEntry, KpiDef, Persona,
  Phase, WorkflowStage, OperationalMode, Principle, RiskPattern,
  CollabCheck, PhaseBudget, ScheduleSlot, WeeklyRetro,
} from "../types";
import { DEFAULT_CONFIG } from "../config/defaults";
import { PROJECTS_INIT } from "../data/projects";
import { PIPELINE_ITEMS_INIT, WORKFLOW_STAGES, WORK_MODES } from "../data/workflow";
import { QUARTER_DEFAULT, KPI_DEFAULTS, KPI_DEFS } from "../data/kpis";
import { PHASES } from "../data/phases";
import { CONTENT_SERIES_SEED } from "../data/content";
import { PERSONAS } from "../data/personas";
import { OPERATIONAL_MODES, PRINCIPLES, RISK_PATTERNS, COLLAB_CHECKLIST, PHASE_BUDGETS } from "../data/principles";
import type { WorkMode } from "../types";

// ─── State shape ──────────────────────────────────────────────────────────────

interface StoreState {
  // App configuration
  appConfig: AppConfig;

  // Navigation
  activeView: ViewId;

  // Wellness metrics
  energy: number;
  satisfaction: number;
  daysOut: number;

  // Time unit weekly tracker [w1, w2, w3, w4]
  utWeek: [number, number, number, number];

  // Active operational mode
  operationalMode: string | null;

  // Phases
  phases: Phase[];

  // Projects
  projects: Project[];

  // KPI current values
  kpiValues: Record<string, number>;

  // Pipeline
  pipelineItems: PipelineItem[];
  workflowStages: WorkflowStage[];
  workModes: WorkMode[];

  // Quarterly planning
  quarter: Quarter;

  // Idea pipeline
  ideas: Idea[];

  // Content Hub
  contentSeries: ContentSeries[];

  // KPI definitions
  kpiDefs: KpiDef[];

  // Personas
  personas: Persona[];

  // Guardrails data
  operationalModes: OperationalMode[];
  principles: Principle[];
  riskPatterns: RiskPattern[];
  collabChecklist: CollabCheck[];
  phaseBudgets: PhaseBudget[];

  // Strategy dates
  strategyStartDate: string;
  strategyEstimatedEndDate: string;

  // Weekly calendar
  scheduleSlots: ScheduleSlot[];
  defaultSlotDurationMin: number;

  // Weekly retrospectives
  weeklyRetros: WeeklyRetro[];
  retroWeekOffset: number;
}

// ─── Actions shape ────────────────────────────────────────────────────────────

interface StoreActions {
  // Config
  updateAppConfig: (updates: Partial<AppConfig>) => void;

  // Navigation
  setActiveView: (view: ViewId) => void;
  setRetroWeekOffset: (offset: number) => void;

  // Metrics
  setEnergy: (v: number) => void;
  setSatisfaction: (v: number) => void;
  setDaysOut: (v: number) => void;

  // Time unit tracker
  setUtWeek: (fn: (prev: [number, number, number, number]) => [number, number, number, number]) => void;
  advanceWeek: () => void;

  // Operational mode
  setOperationalMode: (mode: string | null) => void;

  // Phase task actions
  toggleTask: (taskId: string) => void;
  setTaskLabel: (taskId: string, text: string) => void;
  addCustomTask: (phaseId: number, text: string) => void;
  removeTask: (taskId: string) => void;

  // Phase CRUD
  addPhase: (phase: Omit<Phase, "id">) => void;
  updatePhase: (id: number, updates: Partial<Omit<Phase, "id" | "tasks">>) => void;
  removePhase: (id: number) => void;

  // Workflow stage CRUD
  addWorkflowStage: (stage: Omit<WorkflowStage, "id">) => void;
  updateWorkflowStage: (id: number, updates: Partial<Omit<WorkflowStage, "id">>) => void;
  removeWorkflowStage: (id: number) => void;

  // Work modes CRUD
  addWorkMode: (mode: WorkMode) => void;
  updateWorkMode: (id: string, updates: Partial<Omit<WorkMode, "id">>) => void;
  removeWorkMode: (id: string) => void;

  // Projects CRUD
  updateProject: (id: string, updates: Partial<Omit<Project, "id">>) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;

  // KPI values
  setKpiValue: (key: string, value: number) => void;

  // Pipeline items CRUD
  updatePipelineItem: (id: string, updates: Partial<Omit<PipelineItem, "id">>) => void;
  addPipelineItem: (item: PipelineItem) => void;
  removePipelineItem: (id: string) => void;
  togglePipelineGate: (itemId: string, gateIndex: number) => void;

  // Quarter
  updateQuarter: (updates: Partial<Quarter>) => void;
  updateAllocation: (key: string, value: number) => void;

  // Ideas
  addIdea: (idea: Idea) => void;
  updateIdea: (id: string, updates: Partial<Omit<Idea, "id">>) => void;
  removeIdea: (id: string) => void;
  advanceIdea: (id: string) => void;

  // Content Hub
  addContentSeries: (series: ContentSeries) => void;
  updateContentSeries: (id: string, updates: Partial<Omit<ContentSeries, "id" | "entries">>) => void;
  removeContentSeries: (id: string) => void;
  addContentEntry: (seriesId: string, entry: ContentEntry) => void;
  updateContentEntry: (seriesId: string, entryId: string, updates: Partial<Omit<ContentEntry, "id">>) => void;
  removeContentEntry: (seriesId: string, entryId: string) => void;

  // KPI definitions
  addKpiDef: (def: KpiDef) => void;
  updateKpiDef: (key: string, updates: Partial<Omit<KpiDef, "key">>) => void;
  removeKpiDef: (key: string) => void;

  // Personas
  updatePersona: (id: string, updates: Partial<Persona>) => void;
  addPersona: (persona: Persona) => void;
  removePersona: (id: string) => void;

  // Guardrails CRUD
  addOperationalMode: (mode: OperationalMode) => void;
  updateOperationalMode: (id: string, updates: Partial<Omit<OperationalMode, "id">>) => void;
  removeOperationalMode: (id: string) => void;

  addPrinciple: (principle: Principle) => void;
  updatePrinciple: (n: string, updates: Partial<Omit<Principle, "n">>) => void;
  removePrinciple: (n: string) => void;

  addRiskPattern: (pattern: RiskPattern) => void;
  updateRiskPattern: (id: string, updates: Partial<Omit<RiskPattern, "id">>) => void;
  removeRiskPattern: (id: string) => void;

  addCollabCheck: (check: CollabCheck) => void;
  updateCollabCheck: (id: string, updates: Partial<Omit<CollabCheck, "id">>) => void;
  removeCollabCheck: (id: string) => void;

  addPhaseBudget: (budget: PhaseBudget) => void;
  updatePhaseBudget: (idx: number, updates: Partial<PhaseBudget>) => void;
  removePhaseBudget: (idx: number) => void;

  // Strategy dates
  setStrategyStartDate: (date: string) => void;
  setStrategyEstimatedEndDate: (date: string) => void;

  // Schedule slots
  addScheduleSlot: (slot: Omit<ScheduleSlot, "id">) => void;
  updateScheduleSlot: (id: string, updates: Partial<Omit<ScheduleSlot, "id">>) => void;
  removeScheduleSlot: (id: string) => void;
  clearWeekSlots: (weekKey: string) => void;
  setDefaultSlotDurationMin: (min: number) => void;

  // Weekly retrospectives
  upsertWeeklyRetro: (retro: Omit<WeeklyRetro, "id" | "createdAt" | "updatedAt">) => void;
  removeWeeklyRetro: (weekKey: string) => void;

  // Settings
  importState: (data: Partial<StoreState>) => void;
  resetToDefaults: () => void;
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: StoreState = {
  appConfig: DEFAULT_CONFIG,
  activeView: "dashboard",
  energy: 7,
  satisfaction: 7,
  daysOut: 0,
  utWeek: [3, 4, 3, 0],
  operationalMode: null,
  phases: PHASES,
  projects: PROJECTS_INIT,
  kpiValues: KPI_DEFAULTS,
  pipelineItems: PIPELINE_ITEMS_INIT,
  workflowStages: WORKFLOW_STAGES,
  workModes: WORK_MODES,
  quarter: QUARTER_DEFAULT,
  ideas: [],
  contentSeries: CONTENT_SERIES_SEED,
  kpiDefs: KPI_DEFS,
  personas: PERSONAS,
  operationalModes: OPERATIONAL_MODES,
  principles: PRINCIPLES,
  riskPatterns: RISK_PATTERNS,
  collabChecklist: COLLAB_CHECKLIST,
  phaseBudgets: PHASE_BUDGETS,
  strategyStartDate: "2025-01-01",
  strategyEstimatedEndDate: "2027-12-31",
  scheduleSlots: [],
  defaultSlotDurationMin: 90,
  weeklyRetros: [],
  retroWeekOffset: -1,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
      ...initialState,

      // ── Config ──────────────────────────────────────────────────────────────
      updateAppConfig: (updates) =>
        set((s) => ({ appConfig: { ...s.appConfig, ...updates } })),

      // ── Navigation ──────────────────────────────────────────────────────────
      setActiveView: (view) => set({ activeView: view }),
      setRetroWeekOffset: (offset) => set({ retroWeekOffset: offset }),

      // ── Metrics ─────────────────────────────────────────────────────────────
      setEnergy: (v) => set({ energy: v }),
      setSatisfaction: (v) => set({ satisfaction: v }),
      setDaysOut: (v) => set({ daysOut: v }),

      // ── Time unit tracker ────────────────────────────────────────────────────
      setUtWeek: (fn) => set((s) => ({ utWeek: fn(s.utWeek) })),
      advanceWeek: () =>
        set((s) => ({ utWeek: [s.utWeek[1], s.utWeek[2], s.utWeek[3], 0] })),

      // ── Operational mode ─────────────────────────────────────────────────────
      setOperationalMode: (mode) => set({ operationalMode: mode }),

      // ── Phase task actions ───────────────────────────────────────────────────
      toggleTask: (taskId) =>
        set((s) => ({
          phases: s.phases.map((p) => ({
            ...p,
            tasks: p.tasks.map((t) =>
              t.id === taskId ? { ...t, done: !t.done } : t
            ),
          })),
        })),

      setTaskLabel: (taskId, text) =>
        set((s) => ({
          phases: s.phases.map((p) => ({
            ...p,
            tasks: p.tasks.map((t) =>
              t.id === taskId ? { ...t, text } : t
            ),
          })),
        })),

      addCustomTask: (phaseId, text) => {
        const id = `ct-${genId()}`;
        set((s) => ({
          phases: s.phases.map((p) =>
            p.id === phaseId
              ? { ...p, tasks: [...p.tasks, { id, text, done: false }] }
              : p
          ),
        }));
      },

      removeTask: (taskId) =>
        set((s) => ({
          phases: s.phases.map((p) => ({
            ...p,
            tasks: p.tasks.filter((t) => t.id !== taskId),
          })),
        })),

      // ── Phase CRUD ───────────────────────────────────────────────────────────
      addPhase: (phase) =>
        set((s) => {
          const newId = Math.max(0, ...s.phases.map((p) => p.id)) + 1;
          return { phases: [...s.phases, { ...phase, id: newId }] };
        }),
      updatePhase: (id, updates) =>
        set((s) => ({
          phases: s.phases.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      removePhase: (id) =>
        set((s) => {
          const remaining = s.phases.filter((p) => p.id !== id);
          if (remaining.length === 0) return s;
          const fallback = remaining.reduce((closest, p) =>
            Math.abs(p.id - id) < Math.abs(closest - id) ? p.id : closest,
            remaining[0].id
          );
          return {
            phases: remaining,
            projects: s.projects.map((pr) =>
              pr.phase === id ? { ...pr, phase: fallback } : pr
            ),
          };
        }),

      // ── Workflow stage CRUD ──────────────────────────────────────────────────
      addWorkflowStage: (stage) =>
        set((s) => {
          const newId = Math.max(0, ...s.workflowStages.map((ws) => ws.id)) + 1;
          return { workflowStages: [...s.workflowStages, { ...stage, id: newId }] };
        }),
      updateWorkflowStage: (id, updates) =>
        set((s) => ({
          workflowStages: s.workflowStages.map((ws) =>
            ws.id === id ? { ...ws, ...updates } : ws
          ),
        })),
      removeWorkflowStage: (id) =>
        set((s) => {
          if (s.pipelineItems.some((item) => item.stage === id)) return s;
          return { workflowStages: s.workflowStages.filter((ws) => ws.id !== id) };
        }),

      // ── Work modes CRUD ──────────────────────────────────────────────────────
      addWorkMode: (mode) => set((s) => ({ workModes: [...s.workModes, mode] })),
      updateWorkMode: (id, updates) =>
        set((s) => ({
          workModes: s.workModes.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      removeWorkMode: (id) =>
        set((s) => ({ workModes: s.workModes.filter((m) => m.id !== id) })),

      // ── Projects CRUD ────────────────────────────────────────────────────────
      updateProject: (id, updates) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      addProject: (project) =>
        set((s) => ({ projects: [...s.projects, project] })),
      removeProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      // ── KPI values ───────────────────────────────────────────────────────────
      setKpiValue: (key, value) =>
        set((s) => ({ kpiValues: { ...s.kpiValues, [key]: value } })),

      // ── Pipeline items CRUD ──────────────────────────────────────────────────
      updatePipelineItem: (id, updates) =>
        set((s) => ({
          pipelineItems: s.pipelineItems.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      addPipelineItem: (item) =>
        set((s) => ({ pipelineItems: [...s.pipelineItems, item] })),
      removePipelineItem: (id) =>
        set((s) => ({ pipelineItems: s.pipelineItems.filter((c) => c.id !== id) })),
      togglePipelineGate: (itemId, gateIndex) =>
        set((s) => ({
          pipelineItems: s.pipelineItems.map((c) => {
            if (c.id !== itemId) return c;
            const gates = [...c.gates];
            gates[gateIndex] = !gates[gateIndex];
            return { ...c, gates, lastUpdate: "just now" };
          }),
        })),

      // ── Quarter ──────────────────────────────────────────────────────────────
      updateQuarter: (updates) =>
        set((s) => ({ quarter: { ...s.quarter, ...updates } })),
      updateAllocation: (key, value) =>
        set((s) => ({
          quarter: {
            ...s.quarter,
            allocation: { ...s.quarter.allocation, [key]: value },
          },
        })),

      // ── Ideas ────────────────────────────────────────────────────────────────
      addIdea: (idea) => set((s) => ({ ideas: [idea, ...s.ideas] })),
      updateIdea: (id, updates) =>
        set((s) => ({
          ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      removeIdea: (id) =>
        set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),
      advanceIdea: (id) =>
        set((s) => ({
          ideas: s.ideas.map((i) => {
            if (i.id !== id) return i;
            const next: Record<string, "raw" | "sorted" | "selected"> = {
              raw: "sorted",
              sorted: "selected",
              selected: "selected",
            };
            return { ...i, stage: next[i.stage] };
          }),
        })),

      // ── Content Hub ──────────────────────────────────────────────────────────
      addContentSeries: (series) =>
        set((s) => ({ contentSeries: [...s.contentSeries, series] })),
      updateContentSeries: (id, updates) =>
        set((s) => ({
          contentSeries: s.contentSeries.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        })),
      removeContentSeries: (id) =>
        set((s) => ({ contentSeries: s.contentSeries.filter((i) => i.id !== id) })),
      addContentEntry: (seriesId, entry) =>
        set((s) => ({
          contentSeries: s.contentSeries.map((i) =>
            i.id === seriesId ? { ...i, entries: [...i.entries, entry] } : i
          ),
        })),
      updateContentEntry: (seriesId, entryId, updates) =>
        set((s) => ({
          contentSeries: s.contentSeries.map((i) =>
            i.id !== seriesId
              ? i
              : {
                  ...i,
                  entries: i.entries.map((e) =>
                    e.id === entryId ? { ...e, ...updates } : e
                  ),
                }
          ),
        })),
      removeContentEntry: (seriesId, entryId) =>
        set((s) => ({
          contentSeries: s.contentSeries.map((i) =>
            i.id !== seriesId
              ? i
              : { ...i, entries: i.entries.filter((e) => e.id !== entryId) }
          ),
        })),

      // ── KPI definitions ──────────────────────────────────────────────────────
      addKpiDef: (def) =>
        set((s) => {
          if (s.kpiDefs.some((d) => d.key === def.key)) return s;
          return {
            kpiDefs: [...s.kpiDefs, def],
            kpiValues: { ...s.kpiValues, [def.key]: 0 },
          };
        }),
      updateKpiDef: (key, updates) =>
        set((s) => ({
          kpiDefs: s.kpiDefs.map((d) => (d.key === key ? { ...d, ...updates } : d)),
        })),
      removeKpiDef: (key) =>
        set((s) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _removed, ...remainingValues } = s.kpiValues;
          return {
            kpiDefs: s.kpiDefs.filter((d) => d.key !== key),
            kpiValues: remainingValues,
          };
        }),

      // ── Personas ─────────────────────────────────────────────────────────────
      updatePersona: (id, updates) =>
        set((s) => ({
          personas: s.personas.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      addPersona: (persona) =>
        set((s) => ({ personas: [...s.personas, persona] })),
      removePersona: (id) =>
        set((s) => ({ personas: s.personas.filter((p) => p.id !== id) })),

      // ── Guardrails CRUD ──────────────────────────────────────────────────────
      addOperationalMode: (mode) =>
        set((s) => ({ operationalModes: [...s.operationalModes, mode] })),
      updateOperationalMode: (id, updates) =>
        set((s) => ({
          operationalModes: s.operationalModes.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      removeOperationalMode: (id) =>
        set((s) => ({ operationalModes: s.operationalModes.filter((m) => m.id !== id) })),

      addPrinciple: (principle) =>
        set((s) => ({ principles: [...s.principles, principle] })),
      updatePrinciple: (n, updates) =>
        set((s) => ({
          principles: s.principles.map((p) =>
            p.n === n ? { ...p, ...updates } : p
          ),
        })),
      removePrinciple: (n) =>
        set((s) => ({ principles: s.principles.filter((p) => p.n !== n) })),

      addRiskPattern: (pattern) =>
        set((s) => ({ riskPatterns: [...s.riskPatterns, pattern] })),
      updateRiskPattern: (id, updates) =>
        set((s) => ({
          riskPatterns: s.riskPatterns.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
      removeRiskPattern: (id) =>
        set((s) => ({ riskPatterns: s.riskPatterns.filter((r) => r.id !== id) })),

      addCollabCheck: (check) =>
        set((s) => ({ collabChecklist: [...s.collabChecklist, check] })),
      updateCollabCheck: (id, updates) =>
        set((s) => ({
          collabChecklist: s.collabChecklist.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      removeCollabCheck: (id) =>
        set((s) => ({ collabChecklist: s.collabChecklist.filter((c) => c.id !== id) })),

      addPhaseBudget: (budget) =>
        set((s) => ({ phaseBudgets: [...s.phaseBudgets, budget] })),
      updatePhaseBudget: (idx, updates) =>
        set((s) => ({
          phaseBudgets: s.phaseBudgets.map((b, i) =>
            i === idx ? { ...b, ...updates } : b
          ),
        })),
      removePhaseBudget: (idx) =>
        set((s) => ({ phaseBudgets: s.phaseBudgets.filter((_, i) => i !== idx) })),

      // ── Strategy dates ────────────────────────────────────────────────────────
      setStrategyStartDate: (date) => set({ strategyStartDate: date }),
      setStrategyEstimatedEndDate: (date) => set({ strategyEstimatedEndDate: date }),

      // ── Schedule slots ────────────────────────────────────────────────────────
      addScheduleSlot: (slot) =>
        set((s) => ({
          scheduleSlots: [...s.scheduleSlots, { ...slot, id: genId() }],
        })),
      updateScheduleSlot: (id, updates) =>
        set((s) => ({
          scheduleSlots: s.scheduleSlots.map((sl) =>
            sl.id === id ? { ...sl, ...updates } : sl
          ),
        })),
      removeScheduleSlot: (id) =>
        set((s) => ({
          scheduleSlots: s.scheduleSlots.filter((sl) => sl.id !== id),
        })),
      clearWeekSlots: (weekKey) =>
        set((s) => ({
          scheduleSlots: s.scheduleSlots.filter((sl) => sl.weekKey !== weekKey),
        })),
      setDefaultSlotDurationMin: (min) => set({ defaultSlotDurationMin: min }),

      // ── Weekly retrospectives ─────────────────────────────────────────────────
      upsertWeeklyRetro: (retro) =>
        set((s) => {
          const now = new Date().toISOString();
          const existing = s.weeklyRetros.find((r) => r.weekKey === retro.weekKey);
          if (existing) {
            return {
              weeklyRetros: s.weeklyRetros.map((r) =>
                r.weekKey === retro.weekKey
                  ? { ...r, ...retro, updatedAt: now }
                  : r
              ),
            };
          }
          return {
            weeklyRetros: [
              ...s.weeklyRetros,
              { ...retro, id: genId(), createdAt: now, updatedAt: now },
            ],
          };
        }),
      removeWeeklyRetro: (weekKey) =>
        set((s) => ({
          weeklyRetros: s.weeklyRetros.filter((r) => r.weekKey !== weekKey),
        })),

      // ── Settings ──────────────────────────────────────────────────────────────
      importState: (data) =>
        set((s) => {
          const ALLOWED_KEYS: (keyof StoreState)[] = [
            "appConfig", "activeView", "energy", "satisfaction", "daysOut",
            "utWeek", "operationalMode", "phases", "projects", "kpiValues",
            "pipelineItems", "workflowStages", "workModes", "quarter", "ideas",
            "contentSeries", "kpiDefs", "personas", "operationalModes",
            "principles", "riskPatterns", "collabChecklist", "phaseBudgets",
            "strategyStartDate", "strategyEstimatedEndDate",
            "scheduleSlots", "defaultSlotDurationMin", "weeklyRetros",
          ];
          const VALID_VIEW_IDS: ViewId[] = [
            "dashboard", "pipeline", "projects", "kpis", "quarter", "phases",
            "guardrails", "personas", "ideas", "content-hub",
            "weekly-calendar", "retrospective", "settings", "user-guide",
          ];
          const safe: Partial<StoreState> = {};
          for (const key of ALLOWED_KEYS) {
            if (key in data) {
              if (key === "activeView") {
                const v = (data as Record<string, unknown>)[key];
                if (typeof v === "string" && VALID_VIEW_IDS.includes(v as ViewId)) {
                  safe.activeView = v as ViewId;
                }
              } else {
                (safe as Record<string, unknown>)[key] =
                  (data as Record<string, unknown>)[key];
              }
            }
          }
          return { ...s, ...safe };
        }),

      resetToDefaults: () => set({ ...initialState }),
    }),
    {
      name: "generic-dashboard-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
