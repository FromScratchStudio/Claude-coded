import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '../utils/id'

const now = () => new Date().toISOString()

const useStratexStore = create(
  persist(
    (set) => ({
      objectives: [],

      addObjective: (data) =>
        set((s) => ({
          objectives: [
            ...s.objectives,
            { ...data, id: generateId(), initiatives: [], createdAt: now() },
          ],
        })),

      updateObjective: (id, data) =>
        set((s) => ({
          objectives: s.objectives.map((o) => (o.id === id ? { ...o, ...data } : o)),
        })),

      deleteObjective: (id) =>
        set((s) => ({ objectives: s.objectives.filter((o) => o.id !== id) })),

      addInitiative: (objectiveId, data) =>
        set((s) => ({
          objectives: s.objectives.map((o) =>
            o.id === objectiveId
              ? {
                  ...o,
                  initiatives: [
                    ...o.initiatives,
                    { ...data, id: generateId(), progress: 0, projectIds: [], createdAt: now() },
                  ],
                }
              : o
          ),
        })),

      updateInitiative: (objectiveId, initiativeId, data) =>
        set((s) => ({
          objectives: s.objectives.map((o) =>
            o.id === objectiveId
              ? {
                  ...o,
                  initiatives: o.initiatives.map((i) =>
                    i.id === initiativeId ? { ...i, ...data } : i
                  ),
                }
              : o
          ),
        })),

      deleteInitiative: (objectiveId, initiativeId) =>
        set((s) => ({
          objectives: s.objectives.map((o) =>
            o.id === objectiveId
              ? { ...o, initiatives: o.initiatives.filter((i) => i.id !== initiativeId) }
              : o
          ),
        })),

      loadDemoData: () => set({ objectives: DEMO_OBJECTIVES }),
    }),
    { name: 'da-stratex' }
  )
)

const DEMO_OBJECTIVES = [
  {
    id: 'o1',
    title: 'Établir une présence internationale',
    description: 'Expositions et collaborations dans au moins 3 pays européens.',
    timeframe: 'annual',
    year: 2025,
    status: 'active',
    createdAt: '2025-01-01T00:00:00.000Z',
    initiatives: [
      {
        id: 'i1',
        title: 'Programme de résidences artistiques',
        description: 'Candidater à 5 résidences en Europe.',
        status: 'in-progress',
        progress: 40,
        projectIds: [],
        createdAt: '2025-01-05T00:00:00.000Z',
      },
      {
        id: 'i2',
        title: 'Réseau galeries internationales',
        description: 'Contacter 10 galeries hors de France.',
        status: 'todo',
        progress: 0,
        projectIds: ['p2'],
        createdAt: '2025-01-05T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'o2',
    title: 'Diversifier les sources de revenus',
    description: 'Atteindre 40 % de revenus issus de licences et collaborations.',
    timeframe: 'annual',
    year: 2025,
    status: 'active',
    createdAt: '2025-01-01T00:00:00.000Z',
    initiatives: [
      {
        id: 'i3',
        title: 'Programme de licences musicales',
        description: 'Placer 3 titres en synchronisation (film / pub).',
        status: 'in-progress',
        progress: 33,
        projectIds: ['p1'],
        createdAt: '2025-01-10T00:00:00.000Z',
      },
      {
        id: 'i4',
        title: 'Collaborations marques',
        description: 'Signer 2 contrats avec des marques lifestyle.',
        status: 'in-progress',
        progress: 50,
        projectIds: ['p5'],
        createdAt: '2025-01-10T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'o3',
    title: 'Renforcer la communauté en ligne',
    description: 'Doubler l\'audience numérique et l\'engagement sur toutes les plateformes.',
    timeframe: 'Q2',
    year: 2025,
    status: 'active',
    createdAt: '2025-01-01T00:00:00.000Z',
    initiatives: [
      {
        id: 'i5',
        title: 'Contenu éducatif régulier',
        description: 'Publier 2 contenus éducatifs par semaine.',
        status: 'in-progress',
        progress: 60,
        projectIds: ['p4'],
        createdAt: '2025-01-15T00:00:00.000Z',
      },
    ],
  },
]

export default useStratexStore
