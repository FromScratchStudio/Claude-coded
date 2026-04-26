import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ViewId,
  AppSettings,
  Category,
  Phase,
  PhaseTask,
  PipelineStage,
  PipelineItem,
  Project,
  KpiDef,
  Idea,
  IdeaStage,
  Planning,
  Principle,
  Entity,
} from "../types";
import {
  SEED_SETTINGS,
  SEED_CATEGORIES,
  SEED_PHASES,
  SEED_PIPELINE_STAGES,
  SEED_PIPELINE_ITEMS,
  SEED_PROJECTS,
  SEED_KPI_DEFS,
  SEED_KPI_VALUES,
  SEED_IDEAS,
  SEED_PLANNING,
  SEED_PRINCIPLES,
  SEED_ENTITIES,
} from "../data/seed";

// ─── State shape ──────────────────────────────────────────────────────────────

interface StoreState {
  activeView: ViewId;
  settings: AppSettings;
  categories: Category[];
  phases: Phase[];
  pipelineStages: PipelineStage[];
  pipelineItems: PipelineItem[];
  projects: Project[];
  kpiDefs: KpiDef[];
  kpiValues: Record<string, number>;
  ideas: Idea[];
  planning: Planning;
  principles: Principle[];
  entities: Entity[];
  energy: number;
  focus: number;
  momentum: number;
}

// ─── Actions shape ────────────────────────────────────────────────────────────

interface StoreActions {
  setActiveView: (v: ViewId) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;

  addCategory: (c: Category) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, "id">>) => void;
  removeCategory: (id: string) => void;

  addPhase: (p: Phase) => void;
  updatePhase: (id: string, updates: Partial<Omit<Phase, "id" | "tasks">>) => void;
  removePhase: (id: string) => void;
  addPhaseTask: (phaseId: string, task: PhaseTask) => void;
  updatePhaseTask: (phaseId: string, taskId: string, updates: Partial<Omit<PhaseTask, "id">>) => void;
  removePhaseTask: (phaseId: string, taskId: string) => void;
  togglePhaseTask: (phaseId: string, taskId: string) => void;

  addPipelineStage: (s: PipelineStage) => void;
  updatePipelineStage: (id: string, updates: Partial<Omit<PipelineStage, "id">>) => void;
  removePipelineStage: (id: string) => void;
  addPipelineItem: (item: PipelineItem) => void;
  updatePipelineItem: (id: string, updates: Partial<Omit<PipelineItem, "id">>) => void;
  removePipelineItem: (id: string) => void;
  movePipelineItem: (id: string, stageId: string) => void;

  addProject: (p: Project) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, "id">>) => void;
  removeProject: (id: string) => void;

  addKpiDef: (def: KpiDef) => void;
  updateKpiDef: (key: string, updates: Partial<Omit<KpiDef, "key">>) => void;
  removeKpiDef: (key: string) => void;
  setKpiValue: (key: string, value: number) => void;

  addIdea: (idea: Idea) => void;
  updateIdea: (id: string, updates: Partial<Omit<Idea, "id">>) => void;
  removeIdea: (id: string) => void;
  advanceIdea: (id: string) => void;

  updatePlanning: (updates: Partial<Planning>) => void;

  addPrinciple: (p: Principle) => void;
  updatePrinciple: (id: string, updates: Partial<Omit<Principle, "id" | "rules">>) => void;
  removePrinciple: (id: string) => void;
  addPrincipleRule: (id: string, rule: string) => void;
  updatePrincipleRule: (id: string, index: number, rule: string) => void;
  removePrincipleRule: (id: string, index: number) => void;

  addEntity: (e: Entity) => void;
  updateEntity: (id: string, updates: Partial<Omit<Entity, "id">>) => void;
  removeEntity: (id: string) => void;

  setEnergy: (v: number) => void;
  setFocus: (v: number) => void;
  setMomentum: (v: number) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const initialState: StoreState = {
  activeView: "dashboard",
  settings: SEED_SETTINGS,
  categories: SEED_CATEGORIES,
  phases: SEED_PHASES,
  pipelineStages: SEED_PIPELINE_STAGES,
  pipelineItems: SEED_PIPELINE_ITEMS,
  projects: SEED_PROJECTS,
  kpiDefs: SEED_KPI_DEFS,
  kpiValues: SEED_KPI_VALUES,
  ideas: SEED_IDEAS,
  planning: SEED_PLANNING,
  principles: SEED_PRINCIPLES,
  entities: SEED_ENTITIES,
  energy: 7,
  focus: 6,
  momentum: 5,
};

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
      ...initialState,

      setActiveView: (v) => set({ activeView: v }),
      updateSettings: (updates) => set((s) => ({ settings: { ...s.settings, ...updates } })),

      // Categories
      addCategory: (c) => set((s) => ({ categories: [...s.categories, c] })),
      updateCategory: (id, updates) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
      removeCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      // Phases
      addPhase: (p) => set((s) => ({ phases: [...s.phases, p] })),
      updatePhase: (id, updates) =>
        set((s) => ({ phases: s.phases.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      removePhase: (id) => set((s) => ({ phases: s.phases.filter((p) => p.id !== id) })),
      addPhaseTask: (phaseId, task) =>
        set((s) => ({
          phases: s.phases.map((p) => (p.id === phaseId ? { ...p, tasks: [...p.tasks, task] } : p)),
        })),
      updatePhaseTask: (phaseId, taskId, updates) =>
        set((s) => ({
          phases: s.phases.map((p) =>
            p.id === phaseId
              ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)) }
              : p
          ),
        })),
      removePhaseTask: (phaseId, taskId) =>
        set((s) => ({
          phases: s.phases.map((p) =>
            p.id === phaseId ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) } : p
          ),
        })),
      togglePhaseTask: (phaseId, taskId) =>
        set((s) => ({
          phases: s.phases.map((p) =>
            p.id === phaseId
              ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
              : p
          ),
        })),

      // Pipeline stages
      addPipelineStage: (stage) => set((s) => ({ pipelineStages: [...s.pipelineStages, stage] })),
      updatePipelineStage: (id, updates) =>
        set((s) => ({ pipelineStages: s.pipelineStages.map((st) => (st.id === id ? { ...st, ...updates } : st)) })),
      removePipelineStage: (id) =>
        set((s) => ({ pipelineStages: s.pipelineStages.filter((st) => st.id !== id) })),

      // Pipeline items
      addPipelineItem: (item) => set((s) => ({ pipelineItems: [...s.pipelineItems, item] })),
      updatePipelineItem: (id, updates) =>
        set((s) => ({ pipelineItems: s.pipelineItems.map((it) => (it.id === id ? { ...it, ...updates } : it)) })),
      removePipelineItem: (id) =>
        set((s) => ({ pipelineItems: s.pipelineItems.filter((it) => it.id !== id) })),
      movePipelineItem: (id, stageId) =>
        set((s) => ({ pipelineItems: s.pipelineItems.map((it) => (it.id === id ? { ...it, stageId } : it)) })),

      // Projects
      addProject: (p) => set((s) => ({ projects: [...s.projects, p] })),
      updateProject: (id, updates) =>
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      removeProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      // KPIs
      addKpiDef: (def) => set((s) => ({ kpiDefs: [...s.kpiDefs, def] })),
      updateKpiDef: (key, updates) =>
        set((s) => ({ kpiDefs: s.kpiDefs.map((d) => (d.key === key ? { ...d, ...updates } : d)) })),
      removeKpiDef: (key) => set((s) => ({ kpiDefs: s.kpiDefs.filter((d) => d.key !== key) })),
      setKpiValue: (key, value) => set((s) => ({ kpiValues: { ...s.kpiValues, [key]: value } })),

      // Ideas
      addIdea: (idea) => set((s) => ({ ideas: [...s.ideas, idea] })),
      updateIdea: (id, updates) =>
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...updates } : i)) })),
      removeIdea: (id) => set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),
      advanceIdea: (id) =>
        set((s) => ({
          ideas: s.ideas.map((i) => {
            if (i.id !== id) return i;
            const map: Record<IdeaStage, IdeaStage> = { raw: "sorted", sorted: "selected", selected: "selected" };
            return { ...i, stage: map[i.stage] };
          }),
        })),

      // Planning
      updatePlanning: (updates) => set((s) => ({ planning: { ...s.planning, ...updates } })),

      // Principles
      addPrinciple: (p) => set((s) => ({ principles: [...s.principles, p] })),
      updatePrinciple: (id, updates) =>
        set((s) => ({ principles: s.principles.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      removePrinciple: (id) => set((s) => ({ principles: s.principles.filter((p) => p.id !== id) })),
      addPrincipleRule: (id, rule) =>
        set((s) => ({
          principles: s.principles.map((p) => (p.id === id ? { ...p, rules: [...p.rules, rule] } : p)),
        })),
      updatePrincipleRule: (id, index, rule) =>
        set((s) => ({
          principles: s.principles.map((p) =>
            p.id === id ? { ...p, rules: p.rules.map((r, i) => (i === index ? rule : r)) } : p
          ),
        })),
      removePrincipleRule: (id, index) =>
        set((s) => ({
          principles: s.principles.map((p) =>
            p.id === id ? { ...p, rules: p.rules.filter((_, i) => i !== index) } : p
          ),
        })),

      // Entities
      addEntity: (e) => set((s) => ({ entities: [...s.entities, e] })),
      updateEntity: (id, updates) =>
        set((s) => ({ entities: s.entities.map((e) => (e.id === id ? { ...e, ...updates } : e)) })),
      removeEntity: (id) => set((s) => ({ entities: s.entities.filter((e) => e.id !== id) })),

      // Health
      setEnergy: (v) => set({ energy: v }),
      setFocus: (v) => set({ focus: v }),
      setMomentum: (v) => set({ momentum: v }),
    }),
    {
      name: "stratex-whitelabel-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        settings: s.settings,
        categories: s.categories,
        phases: s.phases,
        pipelineStages: s.pipelineStages,
        pipelineItems: s.pipelineItems,
        projects: s.projects,
        kpiDefs: s.kpiDefs,
        kpiValues: s.kpiValues,
        ideas: s.ideas,
        planning: s.planning,
        principles: s.principles,
        entities: s.entities,
        energy: s.energy,
        focus: s.focus,
        momentum: s.momentum,
      }),
    }
  )
);
