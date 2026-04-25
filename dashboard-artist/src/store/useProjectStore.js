import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '../utils/id'

const now = () => new Date().toISOString()

const useProjectStore = create(
  persist(
    (set) => ({
      projects: [],

      addProject: (data) =>
        set((s) => ({
          projects: [
            ...s.projects,
            { ...data, id: generateId(), tasks: [], createdAt: now(), updatedAt: now() },
          ],
        })),

      updateProject: (id, data) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: now() } : p
          ),
        })),

      deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      addTask: (projectId, title) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: [
                    ...p.tasks,
                    { id: generateId(), title, completed: false, createdAt: now() },
                  ],
                  updatedAt: now(),
                }
              : p
          ),
        })),

      toggleTask: (projectId, taskId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.map((t) =>
                    t.id === taskId ? { ...t, completed: !t.completed } : t
                  ),
                  updatedAt: now(),
                }
              : p
          ),
        })),

      deleteTask: (projectId, taskId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId), updatedAt: now() }
              : p
          ),
        })),

      loadDemoData: () => set({ projects: DEMO_PROJECTS }),
    }),
    { name: 'da-projects' }
  )
)

const DEMO_PROJECTS = [
  {
    id: 'p1',
    title: 'Album Printemps 2025',
    description: 'Enregistrement et mixage de 10 titres pour la sortie de printemps.',
    status: 'in-progress',
    category: 'music',
    priority: 'high',
    progress: 60,
    dueDate: '2025-06-30T00:00:00.000Z',
    tags: ['album', 'studio', 'mixage'],
    notes: 'Session avec le mixeur prévue semaine 22.',
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2025-04-01T14:00:00.000Z',
    tasks: [
      { id: 't1', title: 'Enregistrer les voix', completed: true, createdAt: '2025-01-10T09:00:00.000Z' },
      { id: 't2', title: 'Mixage pistes 1–5', completed: true, createdAt: '2025-01-10T09:00:00.000Z' },
      { id: 't3', title: 'Mixage pistes 6–10', completed: false, createdAt: '2025-01-10T09:00:00.000Z' },
      { id: 't4', title: 'Mastering', completed: false, createdAt: '2025-01-10T09:00:00.000Z' },
      { id: 't5', title: 'Distribution numérique', completed: false, createdAt: '2025-01-10T09:00:00.000Z' },
    ],
  },
  {
    id: 'p2',
    title: 'Exposition Galerie Nova',
    description: 'Série de 15 œuvres pour une exposition individuelle en juin.',
    status: 'planning',
    category: 'visual',
    priority: 'high',
    progress: 20,
    dueDate: '2025-06-15T00:00:00.000Z',
    tags: ['exposition', 'galerie', 'peinture'],
    notes: '',
    createdAt: '2025-02-01T10:00:00.000Z',
    updatedAt: '2025-03-01T10:00:00.000Z',
    tasks: [
      { id: 't6', title: 'Sélection des œuvres', completed: true, createdAt: '2025-02-01T10:00:00.000Z' },
      { id: 't7', title: 'Encadrement', completed: false, createdAt: '2025-02-01T10:00:00.000Z' },
      { id: 't8', title: 'Transport et accrochage', completed: false, createdAt: '2025-02-01T10:00:00.000Z' },
      { id: 't9', title: 'Vernissage', completed: false, createdAt: '2025-02-01T10:00:00.000Z' },
    ],
  },
  {
    id: 'p3',
    title: 'Court-métrage Nuit Blanche',
    description: 'Réalisation d\'un court-métrage expérimental de 12 minutes.',
    status: 'idea',
    category: 'video',
    priority: 'medium',
    progress: 5,
    dueDate: null,
    tags: ['cinéma', 'expérimental'],
    notes: 'Concept à développer.',
    createdAt: '2025-03-05T08:00:00.000Z',
    updatedAt: '2025-03-05T08:00:00.000Z',
    tasks: [],
  },
  {
    id: 'p4',
    title: 'Podcast Créatif Saison 2',
    description: 'Production de 8 épisodes sur la créativité et l\'art contemporain.',
    status: 'completed',
    category: 'other',
    priority: 'medium',
    progress: 100,
    dueDate: '2025-02-28T00:00:00.000Z',
    tags: ['podcast', 'audio', 'média'],
    notes: 'Disponible sur Spotify et Apple Podcasts.',
    createdAt: '2024-11-01T09:00:00.000Z',
    updatedAt: '2025-02-28T18:00:00.000Z',
    tasks: [
      { id: 't10', title: 'Enregistrement épisodes 1–4', completed: true, createdAt: '2024-11-01T09:00:00.000Z' },
      { id: 't11', title: 'Enregistrement épisodes 5–8', completed: true, createdAt: '2024-11-01T09:00:00.000Z' },
      { id: 't12', title: 'Montage et publication', completed: true, createdAt: '2024-11-01T09:00:00.000Z' },
    ],
  },
  {
    id: 'p5',
    title: 'Collaboration Marque Mode',
    description: 'Création visuelle pour une campagne de mode capsule.',
    status: 'review',
    category: 'visual',
    priority: 'low',
    progress: 80,
    dueDate: '2025-05-10T00:00:00.000Z',
    tags: ['collaboration', 'mode', 'branding'],
    notes: 'En attente de validation client.',
    createdAt: '2025-02-15T11:00:00.000Z',
    updatedAt: '2025-03-20T16:00:00.000Z',
    tasks: [
      { id: 't13', title: 'Brief créatif', completed: true, createdAt: '2025-02-15T11:00:00.000Z' },
      { id: 't14', title: 'Moodboard', completed: true, createdAt: '2025-02-15T11:00:00.000Z' },
      { id: 't15', title: 'Livrables finaux', completed: true, createdAt: '2025-02-15T11:00:00.000Z' },
      { id: 't16', title: 'Révisions client', completed: false, createdAt: '2025-02-15T11:00:00.000Z' },
    ],
  },
]

export default useProjectStore
