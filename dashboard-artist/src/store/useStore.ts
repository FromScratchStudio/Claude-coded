import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ViewId, Project, Chapter, Quarter, Idea, KMIssue, KMArticle, KpiDef, Heteronym } from "../types";
import { PROJECTS_INIT } from "../data/projects";
import { CHAPTERS_INIT } from "../data/workflow";
import { QUARTER_DEFAULT, KPI_DEFAULTS, KPI_DEFS } from "../data/kpis";
import { PHASES } from "../data/phases";
import { KM_ISSUES_SEED } from "../data/km";
import { HETERONYMS } from "../data/heteronyms";

// ─── State shape ──────────────────────────────────────────────────────────────

interface StoreState {
  // Navigation
  activeView: ViewId;

  // Durability metrics (Dashboard)
  energy: number; // 1–10
  plaisir: number; // 1–10
  joursEpuises: number; // 0–7

  // UL weekly tracker (4 rolling weeks, index 3 = current week)
  ulWeek: [number, number, number, number];

  // Degraded mode
  degradedMode: string | null;

  // Phase task overrides (taskId → done)
  tasks: Record<string, boolean>;

  // Projects (user-editable)
  projects: Project[];

  // KPI current values (key → value)
  kpiValues: Record<string, number>;

  // Chapter pipeline
  chapters: Chapter[];

  // Quarterly planning
  quarter: Quarter;

  // Idea pipeline
  ideas: Idea[];

  // Kefta Matesha issues
  kmIssues: KMIssue[];

  // KPI definitions (editable)
  kpiDefs: KpiDef[];

  // Phase task customisation
  taskLabels: Record<string, string>;           // text overrides for static task IDs
  customTasks: { phaseId: number; id: string; text: string }[]; // user-added tasks
  hiddenTasks: string[];                         // static task IDs soft-deleted by user

  // Referentiel heteronyms (editable)
  heteronymData: Heteronym[];
}

// ─── Actions shape ────────────────────────────────────────────────────────────

interface StoreActions {
  setActiveView: (view: ViewId) => void;

  setEnergy: (v: number) => void;
  setPlaisir: (v: number) => void;
  setJoursEpuises: (v: number) => void;

  setUlWeek: (fn: (prev: [number, number, number, number]) => [number, number, number, number]) => void;
  advanceWeek: () => void; // shifts UL history forward by one week

  setDegradedMode: (mode: string | null) => void;

  toggleTask: (taskId: string) => void;

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
  advanceIdea: (id: string) => void; // raw → sorted → selected

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

  // Phase tasks
  setTaskLabel: (id: string, text: string) => void;
  addCustomTask: (phaseId: number, text: string) => void;
  removeCustomTask: (id: string) => void;
  hideTask: (id: string) => void;

  // Referentiel
  updateHeteronym: (id: string, updates: Partial<Heteronym>) => void;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialTasksState: Record<string, boolean> = Object.fromEntries(
  PHASES.flatMap((p) => p.tasks.map((t) => [t.id, t.done]))
);

const initialState: StoreState = {
  activeView: "dashboard",
  energy: 7,
  plaisir: 7,
  joursEpuises: 0,
  ulWeek: [3, 4, 3, 0],
  degradedMode: null,
  tasks: initialTasksState,
  projects: PROJECTS_INIT,
  kpiValues: KPI_DEFAULTS,
  chapters: CHAPTERS_INIT,
  quarter: QUARTER_DEFAULT,
  ideas: [],
  kmIssues: KM_ISSUES_SEED,
  kpiDefs: KPI_DEFS,
  taskLabels: {},
  customTasks: [],
  hiddenTasks: [],
  heteronymData: HETERONYMS,
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

      toggleTask: (taskId) =>
        set((s) => ({
          tasks: { ...s.tasks, [taskId]: !s.tasks[taskId] },
        })),

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
          if (s.kpiDefs.some((d) => d.key === def.key)) {
            return s;
          }

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

      // ── Phase tasks ──────────────────────────────────────────────────────────
      setTaskLabel: (id, text) =>
        set((s) => ({ taskLabels: { ...s.taskLabels, [id]: text } })),
      addCustomTask: (phaseId, text) => {
        const id = `ct-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((s) => ({
          customTasks: [...s.customTasks, { phaseId, id, text }],
          tasks: { ...s.tasks, [id]: false },
        }));
      },
      removeCustomTask: (id) =>
        set((s) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _removed, ...remainingTasks } = s.tasks;
          return {
            customTasks: s.customTasks.filter((t) => t.id !== id),
            tasks: remainingTasks,
          };
        }),
      hideTask: (id) =>
        set((s) => ({
          hiddenTasks: s.hiddenTasks.includes(id) ? s.hiddenTasks : [...s.hiddenTasks, id],
        })),

      // ── Referentiel ──────────────────────────────────────────────────────────
      updateHeteronym: (id, updates) =>
        set((s) => ({
          heteronymData: s.heteronymData.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        })),
    }),
    {
      name: "stratex-dashboard-v1",
      storage: createJSONStorage(() => localStorage),
      // Persist all user-modifiable data, including active view for session continuity
      partialize: (state) => ({
        activeView: state.activeView,
        energy: state.energy,
        plaisir: state.plaisir,
        joursEpuises: state.joursEpuises,
        ulWeek: state.ulWeek,
        degradedMode: state.degradedMode,
        tasks: state.tasks,
        projects: state.projects,
        kpiValues: state.kpiValues,
        chapters: state.chapters,
        quarter: state.quarter,
        ideas: state.ideas,
        kmIssues: state.kmIssues,
        kpiDefs: state.kpiDefs,
        taskLabels: state.taskLabels,
        customTasks: state.customTasks,
        hiddenTasks: state.hiddenTasks,
        heteronymData: state.heteronymData,
      }),
    }
  )
);
