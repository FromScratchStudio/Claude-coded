import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ViewId, Project, Chapter, Quarter, Idea, KMIssue, KMArticle, KpiDef, Heteronym,
  Phase, WorkflowStage, DegradedMode, Principle, Trap, CollabCheck, BuildBudget,
} from "../types";
import { PROJECTS_INIT } from "../data/projects";
import { CHAPTERS_INIT, WORKFLOW_STAGES } from "../data/workflow";
import { QUARTER_DEFAULT, KPI_DEFAULTS, KPI_DEFS } from "../data/kpis";
import { PHASES } from "../data/phases";
import { KM_ISSUES_SEED } from "../data/km";
import { HETERONYMS } from "../data/heteronyms";
import { DEGRADED_MODES, PRINCIPLES, TRAPS, COLLAB_CHECKLIST, BUILD_BUDGETS } from "../data/principles";

// ─── State shape ──────────────────────────────────────────────────────────────

interface StoreState {
  // Navigation
  activeView: ViewId;

  // Durability metrics
  energy: number;
  plaisir: number;
  joursEpuises: number;

  // UL weekly tracker
  ulWeek: [number, number, number, number];

  // Degraded mode key
  degradedMode: string | null;

  // Phases — full source of truth (metadata + tasks with done state)
  phases: Phase[];

  // Projects
  projects: Project[];

  // KPI current values
  kpiValues: Record<string, number>;

  // Chapter pipeline
  chapters: Chapter[];

  // Workflow stages
  workflowStages: WorkflowStage[];

  // Quarterly planning
  quarter: Quarter;

  // Idea pipeline
  ideas: Idea[];

  // Kefta Matesha issues
  kmIssues: KMIssue[];

  // KPI definitions
  kpiDefs: KpiDef[];

  // Referentiel heteronyms
  heteronymData: Heteronym[];

  // Garde-fous data (all editable)
  degradedModes: DegradedMode[];
  principles: Principle[];
  traps: Trap[];
  collabChecklist: CollabCheck[];
  buildBudgets: BuildBudget[];
}

// ─── Actions shape ────────────────────────────────────────────────────────────

interface StoreActions {
  setActiveView: (view: ViewId) => void;

  setEnergy: (v: number) => void;
  setPlaisir: (v: number) => void;
  setJoursEpuises: (v: number) => void;

  setUlWeek: (fn: (prev: [number, number, number, number]) => [number, number, number, number]) => void;
  advanceWeek: () => void;

  setDegradedMode: (mode: string | null) => void;

  // Phase task actions (operate on phases[].tasks)
  toggleTask: (taskId: string) => void;
  setTaskLabel: (taskId: string, text: string) => void;
  addCustomTask: (phaseId: number, text: string) => void;
  removeTask: (taskId: string) => void;
  // aliases kept for backward compat
  removeCustomTask: (id: string) => void;
  hideTask: (id: string) => void;

  // Phase CRUD
  addPhase: (phase: Omit<Phase, "id">) => void;
  updatePhase: (id: number, updates: Partial<Omit<Phase, "id" | "tasks">>) => void;
  removePhase: (id: number) => void;

  // Workflow stage CRUD
  addWorkflowStage: (stage: Omit<WorkflowStage, "id">) => void;
  updateWorkflowStage: (id: number, updates: Partial<Omit<WorkflowStage, "id">>) => void;
  removeWorkflowStage: (id: number) => void;

  updateProject: (id: string, updates: Partial<Omit<Project, "id">>) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;

  setKpiValue: (key: string, value: number) => void;

  updateChapter: (id: string, updates: Partial<Omit<Chapter, "id">>) => void;
  addChapter: (chapter: Chapter) => void;
  removeChapter: (id: string) => void;
  toggleChapterGate: (chapterId: string, gateIndex: number) => void;

  updateQuarter: (updates: Partial<Quarter>) => void;
  updateAllocation: (key: keyof Quarter["allocation"], value: number) => void;

  addIdea: (idea: Idea) => void;
  updateIdea: (id: string, updates: Partial<Omit<Idea, "id">>) => void;
  removeIdea: (id: string) => void;
  advanceIdea: (id: string) => void;

  // Kefta Matesha
  addKMIssue: (issue: KMIssue) => void;
  updateKMIssue: (id: string, updates: Partial<Omit<KMIssue, "id" | "articles">>) => void;
  removeKMIssue: (id: string) => void;
  addKMArticle: (issueId: string, article: KMArticle) => void;
  updateKMArticle: (issueId: string, articleId: string, updates: Partial<Omit<KMArticle, "id">>) => void;
  removeKMArticle: (issueId: string, articleId: string) => void;

  // KPI definitions
  addKpiDef: (def: KpiDef) => void;
  updateKpiDef: (key: string, updates: Partial<Omit<KpiDef, "key">>) => void;
  removeKpiDef: (key: string) => void;

  // Referentiel
  updateHeteronym: (id: string, updates: Partial<Heteronym>) => void;

  // Garde-fous CRUD
  addDegradedMode: (mode: DegradedMode) => void;
  updateDegradedMode: (id: string, updates: Partial<Omit<DegradedMode, "id">>) => void;
  removeDegradedMode: (id: string) => void;

  addPrinciple: (principle: Principle) => void;
  updatePrinciple: (n: string, updates: Partial<Omit<Principle, "n">>) => void;
  removePrinciple: (n: string) => void;

  addTrap: (trap: Trap) => void;
  updateTrap: (id: string, updates: Partial<Omit<Trap, "id">>) => void;
  removeTrap: (id: string) => void;

  addCollabCheck: (check: CollabCheck) => void;
  updateCollabCheck: (id: string, updates: Partial<Omit<CollabCheck, "id">>) => void;
  removeCollabCheck: (id: string) => void;

  addBuildBudget: (budget: BuildBudget) => void;
  updateBuildBudget: (idx: number, updates: Partial<BuildBudget>) => void;
  removeBuildBudget: (idx: number) => void;

  // Settings
  importState: (data: Partial<StoreState>) => void;
}

// ─── Initial state ────────────────────────────────────────────────────────────

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const initialState: StoreState = {
  activeView: "dashboard",
  energy: 7,
  plaisir: 7,
  joursEpuises: 0,
  ulWeek: [3, 4, 3, 0],
  degradedMode: null,
  phases: PHASES,
  projects: PROJECTS_INIT,
  kpiValues: KPI_DEFAULTS,
  chapters: CHAPTERS_INIT,
  workflowStages: WORKFLOW_STAGES,
  quarter: QUARTER_DEFAULT,
  ideas: [],
  kmIssues: KM_ISSUES_SEED,
  kpiDefs: KPI_DEFS,
  heteronymData: HETERONYMS,
  degradedModes: DEGRADED_MODES,
  principles: PRINCIPLES,
  traps: TRAPS,
  collabChecklist: COLLAB_CHECKLIST,
  buildBudgets: BUILD_BUDGETS,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
      ...initialState,

      setActiveView: (view) => set({ activeView: view }),

      setEnergy: (v) => set({ energy: v }),
      setPlaisir: (v) => set({ plaisir: v }),
      setJoursEpuises: (v) => set({ joursEpuises: v }),

      setUlWeek: (fn) => set((s) => ({ ulWeek: fn(s.ulWeek) })),
      advanceWeek: () =>
        set((s) => ({ ulWeek: [s.ulWeek[1], s.ulWeek[2], s.ulWeek[3], 0] })),

      setDegradedMode: (mode) => set({ degradedMode: mode }),

      // ── Phase task actions (operate on phases[].tasks) ────────────────────
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

      removeCustomTask: (id) =>
        set((s) => ({
          phases: s.phases.map((p) => ({
            ...p,
            tasks: p.tasks.filter((t) => t.id !== id),
          })),
        })),

      hideTask: (id) =>
        set((s) => ({
          phases: s.phases.map((p) => ({
            ...p,
            tasks: p.tasks.filter((t) => t.id !== id),
          })),
        })),

      // ── Phase CRUD ────────────────────────────────────────────────────────
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
          const phaseToRemove = s.phases.find((p) => p.id === id);
          if (!phaseToRemove) return s;
          const remainingPhases = s.phases.filter((p) => p.id !== id);
          if (remainingPhases.length === 0) return s;
          const fallbackPhaseId = remainingPhases.reduce((closest, phase) => {
            if (closest === null) return phase.id;
            return Math.abs(phase.id - id) < Math.abs(closest - id) ? phase.id : closest;
          }, null as number | null);
          return {
            phases: remainingPhases,
            projects: s.projects.map((project) =>
              project.phase === id && fallbackPhaseId !== null
                ? { ...project, phase: fallbackPhaseId }
                : project
            ),
          };
        }),

      // ── Workflow stage CRUD ───────────────────────────────────────────────
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
          const hasAssignedChapters = s.chapters.some((chapter) => chapter.stage === id);
          if (hasAssignedChapters) return s;
          return { workflowStages: s.workflowStages.filter((ws) => ws.id !== id) };
        }),

      updateProject: (id, updates) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      addProject: (project) =>
        set((s) => ({ projects: [...s.projects, project] })),
      removeProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      setKpiValue: (key, value) =>
        set((s) => ({ kpiValues: { ...s.kpiValues, [key]: value } })),

      updateChapter: (id, updates) =>
        set((s) => ({
          chapters: s.chapters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      addChapter: (chapter) =>
        set((s) => ({ chapters: [...s.chapters, chapter] })),
      removeChapter: (id) =>
        set((s) => ({ chapters: s.chapters.filter((c) => c.id !== id) })),
      toggleChapterGate: (chapterId, gateIndex) =>
        set((s) => ({
          chapters: s.chapters.map((c) => {
            if (c.id !== chapterId) return c;
            const gates = [...c.gates];
            gates[gateIndex] = !gates[gateIndex];
            return { ...c, gates, lastUpdate: "à l'instant" };
          }),
        })),

      updateQuarter: (updates) =>
        set((s) => ({ quarter: { ...s.quarter, ...updates } })),
      updateAllocation: (key, value) =>
        set((s) => ({
          quarter: {
            ...s.quarter,
            allocation: { ...s.quarter.allocation, [key]: value },
          },
        })),

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

      addKMIssue: (issue) =>
        set((s) => ({ kmIssues: [...s.kmIssues, issue] })),
      updateKMIssue: (id, updates) =>
        set((s) => ({
          kmIssues: s.kmIssues.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      removeKMIssue: (id) =>
        set((s) => ({ kmIssues: s.kmIssues.filter((i) => i.id !== id) })),
      addKMArticle: (issueId, article) =>
        set((s) => ({
          kmIssues: s.kmIssues.map((i) =>
            i.id === issueId ? { ...i, articles: [...i.articles, article] } : i
          ),
        })),
      updateKMArticle: (issueId, articleId, updates) =>
        set((s) => ({
          kmIssues: s.kmIssues.map((i) =>
            i.id !== issueId
              ? i
              : {
                  ...i,
                  articles: i.articles.map((a) =>
                    a.id === articleId ? { ...a, ...updates } : a
                  ),
                }
          ),
        })),
      removeKMArticle: (issueId, articleId) =>
        set((s) => ({
          kmIssues: s.kmIssues.map((i) =>
            i.id !== issueId
              ? i
              : { ...i, articles: i.articles.filter((a) => a.id !== articleId) }
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
          const { [key]: _removed, ...remainingKpiValues } = s.kpiValues;
          return {
            kpiDefs: s.kpiDefs.filter((d) => d.key !== key),
            kpiValues: remainingKpiValues,
          };
        }),

      // ── Referentiel ──────────────────────────────────────────────────────────
      updateHeteronym: (id, updates) =>
        set((s) => ({
          heteronymData: s.heteronymData.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        })),

      // ── Garde-fous CRUD ──────────────────────────────────────────────────────
      addDegradedMode: (mode) =>
        set((s) => ({ degradedModes: [...s.degradedModes, mode] })),
      updateDegradedMode: (id, updates) =>
        set((s) => ({
          degradedModes: s.degradedModes.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      removeDegradedMode: (id) =>
        set((s) => ({ degradedModes: s.degradedModes.filter((m) => m.id !== id) })),

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

      addTrap: (trap) =>
        set((s) => ({ traps: [...s.traps, trap] })),
      updateTrap: (id, updates) =>
        set((s) => ({
          traps: s.traps.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      removeTrap: (id) =>
        set((s) => ({ traps: s.traps.filter((t) => t.id !== id) })),

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

      addBuildBudget: (budget) =>
        set((s) => ({ buildBudgets: [...s.buildBudgets, budget] })),
      updateBuildBudget: (idx, updates) =>
        set((s) => ({
          buildBudgets: s.buildBudgets.map((b, i) =>
            i === idx ? { ...b, ...updates } : b
          ),
        })),
      removeBuildBudget: (idx) =>
        set((s) => ({ buildBudgets: s.buildBudgets.filter((_, i) => i !== idx) })),

      // ── Settings ──────────────────────────────────────────────────────────────
      importState: (data) =>
        set((s) => {
          const ALLOWED_KEYS: (keyof StoreState)[] = [
            "activeView", "energy", "plaisir", "joursEpuises", "ulWeek",
            "degradedMode", "phases", "projects", "kpiValues", "chapters",
            "workflowStages", "quarter", "ideas", "kmIssues", "kpiDefs",
            "heteronymData", "degradedModes", "principles", "traps",
            "collabChecklist", "buildBudgets",
          ];
          const VALID_VIEW_IDS: ViewId[] = [
            "dashboard", "pipeline", "projects", "kpis", "trimestre", "phases",
            "garde-fous", "referentiel", "ideas", "kefta-matesha", "settings", "user-guide",
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
                (safe as Record<string, unknown>)[key] = (data as Record<string, unknown>)[key];
              }
            }
          }
          return { ...s, ...safe };
        }),
    }),
    {
      name: "stratex-dashboard-v2",
      version: 2,
      storage: createJSONStorage(() => ({
        getItem: (name: string) =>
          localStorage.getItem(name) ?? localStorage.getItem("stratex-dashboard-v1"),
        setItem: (name: string, value: string) => localStorage.setItem(name, value),
        removeItem: (name: string) => localStorage.removeItem(name),
      })),
      migrate: (persistedState) => persistedState as StoreState,
      partialize: (state) => ({
        activeView: state.activeView,
        energy: state.energy,
        plaisir: state.plaisir,
        joursEpuises: state.joursEpuises,
        ulWeek: state.ulWeek,
        degradedMode: state.degradedMode,
        phases: state.phases,
        projects: state.projects,
        kpiValues: state.kpiValues,
        chapters: state.chapters,
        workflowStages: state.workflowStages,
        quarter: state.quarter,
        ideas: state.ideas,
        kmIssues: state.kmIssues,
        kpiDefs: state.kpiDefs,
        heteronymData: state.heteronymData,
        degradedModes: state.degradedModes,
        principles: state.principles,
        traps: state.traps,
        collabChecklist: state.collabChecklist,
        buildBudgets: state.buildBudgets,
      }),
    }
  )
);
