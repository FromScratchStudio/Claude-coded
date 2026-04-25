# Dashboard Artist

Application de centralisation stratégique et de suivi des projets créatifs. Conçue pour les artistes et créateurs qui souhaitent aligner leur pratique quotidienne avec leurs grandes orientations stratégiques.

## Fonctionnalités

### Dashboard
- Vue d'ensemble avec 4 métriques clés (projets, terminés, progression moyenne, objectifs actifs)
- Liste des projets récemment modifiés avec progression
- Résumé des objectifs stratégiques actifs
- Graphique de répartition des projets par statut

### Projets créatifs
- CRUD complet sur les projets
- Catégories : Musique, Arts visuels, Écriture, Vidéo, Performance, Autre
- Statuts : Idée → Planification → En cours → Révision → Terminé → Archivé
- Gestion des tâches avec cochage interactif
- Filtres par statut, catégorie, et tri multi-critères
- Détection des projets en retard (date d'échéance dépassée)

### Stratex (Strategic Execution)
- Objectifs stratégiques avec horizon temporel (trimestriel ou annuel)
- Initiatives liées à chaque objectif
- Progression par initiative, ajustable par paliers de 10 %
- Cycle de statut rapide sur chaque initiative (clic sur le badge)
- Progression globale de l'objectif calculée automatiquement

### Persistance et données
- Toutes les données stockées dans le `localStorage` du navigateur
- Export JSON horodaté (projets + objectifs)
- Import JSON pour restaurer ou migrer les données
- Données de démonstration pour découvrir l'application

## Stack technique

| Couche          | Technologie              |
|-----------------|--------------------------|
| UI              | React 18 + Vite          |
| État            | Zustand + persist        |
| Persistance     | localStorage             |
| Styles          | Tailwind CSS 3           |
| Graphiques      | Recharts                 |
| Navigation      | React Router v6          |
| Icônes          | Lucide React             |
| Dates           | date-fns 3 (locale `fr`) |

→ Voir [`docs/ADR-001-stack-technique.md`](docs/ADR-001-stack-technique.md) pour les décisions architecturales détaillées.

## Installation

```bash
cd dashboard-artist
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## Structure du projet

```
dashboard-artist/
├── docs/
│   ├── ADR-001-stack-technique.md
│   └── ADR-002-modele-donnees.md
├── src/
│   ├── components/
│   │   ├── dashboard/      # MetricCard, RecentProjects, StratexSummary, ProjectStatusChart
│   │   ├── layout/         # Layout, Sidebar, Header
│   │   ├── projects/       # ProjectCard, ProjectForm, ProjectFilters, TaskList
│   │   ├── stratex/        # ObjectiveCard, InitiativeItem, ObjectiveForm
│   │   └── ui/             # Button, Card, Badge, Modal, Input, Select, ProgressBar, EmptyState
│   ├── pages/              # Dashboard, Projects, ProjectDetail, Stratex, Settings
│   ├── store/              # useProjectStore, useStratexStore (Zustand)
│   └── utils/              # date.js, metrics.js, id.js
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Modèle de données

→ Voir [`docs/ADR-002-modele-donnees.md`](docs/ADR-002-modele-donnees.md) pour le schéma complet.

## Export / Import

Dans **Réglages**, vous pouvez :
- Exporter toutes vos données en JSON (sauvegarde ou migration)
- Importer un fichier JSON exporté précédemment
- Charger des données de démonstration
- Effacer toutes les données locales

Format d'export :
```json
{
  "version": 1,
  "exportedAt": "2026-04-25T12:00:00.000Z",
  "projects": [...],
  "objectives": [...]
}
```

## Développement

```bash
npm run dev      # serveur de développement
npm run build    # build de production
npm run preview  # prévisualisation du build
```

Le build produit un dossier `dist/` déployable sur n'importe quel hébergement statique (GitHub Pages, Netlify, Vercel, serveur HTTP simple).
