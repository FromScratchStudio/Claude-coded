# ADR-001 — Architecture du Dashboard STRATEX

**Date** : 2025  
**Statut** : Accepté  
**Décideur** : Équipe projet

---

## Contexte

Le dépôt contenait plusieurs fichiers `.jsx` décrivant des composants de visualisation STRATEX (stratégie artistique sur 36 mois) et des documents `.md` détaillant la méthode. Ces artéfacts étaient des prototypes non-fonctionnels produits dans un environnement d'exécution limité (Claude Artifacts) :

- Pas de persistence d'état entre sessions
- Pas de gestion d'état structurée
- Pas de routage entre vues
- Absence de typage statique
- Styles en ligne sans organisation centralisée

L'objectif était de produire une **application SPA locale** fonctionnelle, maintenable, sans backend, permettant à un artiste-ingénieur de centraliser et suivre son plan stratégique.

---

## Décision

**Stack retenue : Vite 5 + React 18 + TypeScript 5 + Zustand 5 + Framer Motion 11**

### Vite (bundler)
- Démarrage instantané grâce à ESM natif
- HMR rapide pour le développement
- Build optimisé via Rollup
- Zéro configuration pour une SPA TypeScript + React
- **Rejeté** : Create React App (déprécié), Webpack (surcharge config)

### React 18
- Standard de l'industrie pour les UI composantisées
- Hooks natifs (`useState`, `useEffect`) suffisants pour ce projet
- Compatible avec Zustand et Framer Motion
- **Rejeté** : Vue 3, Svelte (faible valeur ajoutée ici, déjà investissement React dans les JSX existants)

### TypeScript 5 (strict mode)
- Typage statique de tous les types domaine (`ViewId`, `Phase`, `Project`, `Idea`, etc.)
- Détection des erreurs à la compilation plutôt qu'à l'exécution
- Refactoring sécurisé
- **Rejeté** : JavaScript pur (trop risqué pour une codebase évolutive)

### Zustand 5 avec middleware `persist`
- API minimaliste : `create()` + sélecteurs, pas de boilerplate
- Middleware `persist` → `localStorage` → persistence automatique, clé `stratex-dashboard-v1`
- `partialize` : seules les données utilisateur sont sérialisées (pas les actions)
- Hydratation transparente au rechargement
- **Rejeté** : Redux Toolkit (surcharge pour ce périmètre), Context API (re-renders globaux), React Query (orienté serveur)

### Framer Motion 11
- `AnimatePresence` + `motion.div` pour les transitions de vue fluides
- API déclarative cohérente avec les patterns React
- **Rejeté** : CSS transitions pures (insuffisant pour `AnimatePresence`), React Spring (API plus complexe)

### Pas de framework CSS
- Cohérence avec l'approche inline des JSX existants
- Constantes de thème centralisées dans `src/theme.ts` (`C`, `FONT`)
- Contrôle précis des styles sans spécificité CSS à gérer
- **Rejeté** : Tailwind (verbosité dans le JSX, config supplémentaire), styled-components (overhead runtime)

---

## Architecture des données

```
src/
├── types/index.ts          — Interfaces TypeScript (source de vérité des types)
├── theme.ts                — Couleurs (C), polices (FONT), styles partagés
├── data/                   — Données statiques (seed) en lecture seule
│   ├── phases.ts           — 4 phases roadmap 36 mois
│   ├── projects.ts         — Anneaux STRATEX + projets initiaux
│   ├── kpis.ts             — Définitions KPI + valeurs par défaut
│   ├── workflow.ts         — 6 étapes pipeline + chapitres initiaux
│   ├── principles.ts       — Modes dégradés, principes, pièges, budgets
│   └── heteronyms.ts       — 5 régimes de signature (identités créatives)
├── store/useStore.ts       — Zustand store unique avec persist middleware
└── components/
    ├── ui/                 — Primitives réutilisables (Card, Badge, ProgressBar…)
    ├── layout/             — TopBar, PhaseTimeline (structure de page)
    └── views/              — 9 vues métier (une par ViewId)
```

### Séparation données statiques / état utilisateur

Les données dans `src/data/` sont **immuables** (seed). L'état modifiable est entièrement géré par Zustand :

- **Données statiques** : définitions de phases, KPIs, workflow, hétéronymes
- **État utilisateur** : progression des tâches, valeurs KPI actuelles, projets, chapitres, trimestre, idées, métriques de durabilité

Cette séparation garantit que les mises à jour du code ne cassent pas les données persistées.

---

## Persistence

- **Clé localStorage** : `stratex-dashboard-v1`
- **Stratégie de versioning** : changer la clé lors de breaking changes de schema
- **Données persistées** : tout sauf les fonctions d'action (via `partialize`)
- **Pas de backend** : décision délibérée pour une application 100% locale, sans dépendance réseau

---

## Conséquences

**Positives**
- Développement rapide, rechargement à chaud
- Typage complet, erreurs détectées tôt
- Persistence transparente, aucune configuration serveur
- Code lisible, patterns standards React/Zustand
- Build statique déployable sur tout hébergeur (Vercel, Netlify, GitHub Pages)

**Négatives / points de vigilance**
- Données liées au navigateur : pas de synchronisation multi-appareils
- localStorage limité à ~5Mo (largement suffisant pour ce cas d'usage)
- Pas de migration automatique de schema si les types évoluent significativement

---

## Alternatives rejetées globalement

| Option | Raison du rejet |
|---|---|
| Next.js | Overhead SSR/routing inutile pour une SPA sans backend |
| Remix | Orienté fullstack, complexité non justifiée |
| Electron | Trop lourd pour ce niveau de besoins desktop |
| IndexedDB direct | API bas niveau, gestion manuelle de la serialisation |
| Firebase / Supabase | Dépendance réseau, authentification, coût |
