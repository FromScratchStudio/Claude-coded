# ADR-002 — Modèle de données

**Date :** 2026-04-25  
**Statut :** Accepté

---

## Contexte

L'application gère deux domaines distincts mais liés :

1. **Projets créatifs** — unités de travail concrètes (album, expo, vidéo…)
2. **Stratex (Strategic Execution)** — objectifs à long terme décomposés en initiatives

La relation entre les deux est optionnelle : une initiative peut référencer un ou plusieurs projets, mais un projet peut exister de façon autonome.

---

## Structure des données

### Project

```ts
{
  id:          string          // crypto.randomUUID()
  title:       string
  description: string
  status:      'idea' | 'planning' | 'in-progress' | 'review' | 'completed' | 'archived'
  category:    'music' | 'visual' | 'writing' | 'video' | 'performance' | 'other'
  priority:    'low' | 'medium' | 'high'
  progress:    number          // 0–100, utilisé si tasks est vide
  dueDate:     string | null   // ISO 8601
  tags:        string[]
  notes:       string
  tasks:       Task[]
  createdAt:   string          // ISO 8601
  updatedAt:   string          // ISO 8601
}
```

### Task

```ts
{
  id:        string
  title:     string
  completed: boolean
  createdAt: string
}
```

### StratexObjective

```ts
{
  id:          string
  title:       string
  description: string
  timeframe:   'Q1' | 'Q2' | 'Q3' | 'Q4' | 'annual'
  year:        number
  status:      'active' | 'paused' | 'completed'
  initiatives: Initiative[]
  createdAt:   string
}
```

### Initiative

```ts
{
  id:          string
  title:       string
  description: string
  status:      'todo' | 'in-progress' | 'done'
  progress:    number     // 0–100, mis à jour manuellement
  projectIds:  string[]   // références optionnelles vers des projets
  createdAt:   string
}
```

---

## Calcul de la progression

- **Project progress** : si `tasks.length > 0`, calculé depuis les tâches cochées. Sinon, utilise le champ `progress` (libre).
- **Objective progress** : moyenne arithmétique du `progress` de toutes ses initiatives.

Ce double mode (tâches vs. progression manuelle) permet d'utiliser l'outil pour des projets très structurés comme pour des idées en cours de maturation.

---

## Format d'export

```json
{
  "version": 1,
  "exportedAt": "2026-04-25T12:00:00.000Z",
  "projects": [...],
  "objectives": [...]
}
```

Le champ `version` permettra des migrations futures sans casser les imports existants.

---

## Conséquences

✅ Schéma plat et sérialisable — compatible JSON/localStorage sans transformation  
✅ Les deux stores sont indépendants — migrations et mises à jour sans couplage  
⚠️ La relation `projectIds` dans Initiative est une référence faible (pas de foreign key) — une suppression de projet n'est pas propagée automatiquement dans les initiatives
