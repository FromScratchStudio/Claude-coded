import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ViewId, Project, Chapter, Quarter, Idea } from "../types";
import { PROJECTS_INIT } from "../data/projects";
import { CHAPTERS_INIT } from "../data/workflow";
import { QUARTER_DEFAULT, KPI_DEFAULTS } from "../data/kpis";
import { PHASES } from "../data/phases";

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
    }),
    {
      name: "stratex-dashboard-v1",
      storage: createJSONStorage(() => localStorage),
      // Only persist user-modifiable data, not transient UI state like activeView
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
      }),
    }
  )
);
