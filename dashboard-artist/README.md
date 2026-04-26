# STRATEX Dashboard — Artiste

Application de centralisation et de suivi de la stratégie créative sur 36 mois. Basée sur la **Méthode Unifiée 3 couches** et le système STRATEX.

---

## Prérequis

- **Node.js 18+** (LTS recommandé)
- npm 9+

## Installation

```bash
cd dashboard-artist
npm install
```

## Développement

```bash
npm run dev
```

Ouvre l'application sur [http://localhost:5173](http://localhost:5173).

## Production

```bash
npm run build     # compile TypeScript + bundle Vite → dist/
npm run preview   # prévisualiser le build de production localement
```

---

## Architecture

```
dashboard-artist/
├── src/
│   ├── types/index.ts        Interfaces TypeScript (source de vérité)
│   ├── theme.ts              Couleurs (C), polices (FONT), styles partagés
│   ├── data/                 Données statiques (seed, immuables)
│   │   ├── phases.ts         4 phases roadmap 36 mois
│   │   ├── projects.ts       4 anneaux STRATEX + 7 projets initiaux
│   │   ├── kpis.ts           5 KPIs + valeurs par défaut
│   │   ├── workflow.ts       6 étapes pipeline + chapitres + modes de travail
│   │   ├── principles.ts     Modes dégradés, 11 principes, 10 pièges, checklists
│   │   └── heteronyms.ts     5 régimes de signature (identités créatives)
│   ├── store/useStore.ts     État global Zustand + persistence localStorage
│   ├── components/
│   │   ├── ui/               Card, ProgressBar, SectionTitle, Badge, RingDonut
│   │   ├── layout/           TopBar, PhaseTimeline
│   │   └── views/            9 vues (une par onglet de navigation)
│   ├── App.tsx               Shell principal avec AnimatePresence
│   ├── main.tsx              Point d'entrée React
│   └── index.css             Reset CSS, scrollbar, animations
├── index.html                Template HTML (Google Fonts, #root)
├── vite.config.ts            Configuration Vite
├── tsconfig.json             Configuration TypeScript
├── ADR.md                    Architecture Decision Record
└── package.json
```

**Stack** : Vite 5 · React 18 · TypeScript 5 · Zustand 5 · Framer Motion 11

---

## Vues

| Vue | Onglet | Description |
|---|---|---|
| **Dashboard** | Tableau de bord | Vue synthétique : allocation anneaux, UL hebdo, durabilité, banque d'avance |
| **Pipeline** | Pipeline | Workflow 6 étapes des chapitres, gates de validation, avancement |
| **Projets** | Projets | Gestion des projets par anneau, statut, priorité, progression |
| **KPIs** | KPIs | Suivi des indicateurs clés vers objectifs 3m / 12m / 36m |
| **Trimestre** | Trimestre | Planification trimestrielle : PLP, arc narratif, allocation, règle unique |
| **Phases** | Phases | Checklist des tâches par phase sur 36 mois |
| **Garde-fous** | Garde-fous | Modes dégradés, principes, pièges, checklist collab, budgets construction |
| **Référentiel** | Référentiel | 5 régimes de signature avec inspirations, lexique, playlist |
| **Idées** | Idées | Kanban 3 colonnes (Brut → Trié → Retenu) |

---

## Persistence locale

Toutes les données utilisateur sont automatiquement sauvegardées dans le `localStorage` du navigateur :

- **Clé** : `stratex-dashboard-v1`
- **Contenu** : tâches, projets, chapitres, valeurs KPI, trimestre, idées, métriques de durabilité
- **Format** : JSON sérialisé via Zustand `persist` middleware

> Les données statiques (définitions des phases, KPIs, workflow, hétéronymes) restent dans le code source et ne sont pas persistées — elles constituent la structure immuable du système STRATEX.

### Réinitialisation

Pour effacer toutes les données et repartir de zéro :

```javascript
// Dans la console du navigateur (F12)
localStorage.removeItem('stratex-dashboard-v1');
location.reload();
```

### Migration de schema

En cas de breaking change dans les types, changer la clé dans `src/store/useStore.ts` :

```typescript
// Remplacer "stratex-dashboard-v1" par "stratex-dashboard-v2"
name: "stratex-dashboard-v2",
```

---

## Développement

### Ajouter une vue

1. Créer `src/components/views/MaVue.tsx`
2. Ajouter `"ma-vue"` à `ViewId` dans `src/types/index.ts`
3. Importer et ajouter dans `VIEWS` dans `src/App.tsx`
4. Ajouter un onglet dans `src/components/layout/TopBar.tsx`

### Modifier le thème

Toutes les couleurs et polices sont dans `src/theme.ts` (exports `C` et `FONT`). Modifier ces valeurs met à jour l'ensemble de l'application.

### Ajouter un KPI

1. Ajouter la définition dans `KPI_DEFS` (`src/data/kpis.ts`)
2. Ajouter la valeur par défaut dans `KPI_DEFAULTS`
3. Le composant `KPIsView` rend automatiquement tous les KPIs définis

---

## Licence

Usage personnel — système STRATEX propriétaire.
