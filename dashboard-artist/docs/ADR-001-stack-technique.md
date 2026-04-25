# ADR-001 — Stack technique

**Date :** 2026-04-25  
**Statut :** Accepté

---

## Contexte

L'application est un dashboard créatif mono-utilisateur, exécuté entièrement côté client, sans backend. Elle doit :

- offrir une UX rapide et fluide sur desktop
- gérer la persistance sans infrastructure serveur
- rester maintenable par un développeur seul

## Décisions et justifications

### Framework UI — React 18 + Vite

**Pourquoi React :** écosystème riche, composants réutilisables, hooks natifs suffisants pour ce périmètre. Pas de SSR nécessaire pour un outil desktop local.  
**Pourquoi Vite :** HMR instantané, configuration minimale, ESM natif. CRA est déprécié ; Next.js serait surdimensionné sans backend.

**Alternatives rejetées :**
- Vue 3 : viable mais React mieux maîtrisé dans l'équipe
- SvelteKit : excellent mais moins mature côté écosystème de composants

---

### Gestion d'état — Zustand

**Pourquoi Zustand :** store léger (~1 kB), API hooks sans boilerplate, middleware `persist` natif pour localStorage. Parfait pour un état applicatif de taille modérée.

**Alternatives rejetées :**
- Redux Toolkit : surdimensionné, boilerplate excessif pour ce volume de données
- React Context + useReducer : difficile à composer, pas de persistance intégrée
- Jotai / Recoil : bons mais moins de documentation sur le middleware persist

---

### Persistance locale — Zustand `persist` middleware → localStorage

**Pourquoi localStorage :** zéro dépendance, synchrone, idéal pour des données JSON < 5 Mo. Le middleware Zustand `persist` sérialise/désérialise automatiquement à chaque mutation.

**Alternatives rejetées :**
- IndexedDB : puissance non nécessaire pour ce volume ; API asynchrone plus complexe
- SessionStorage : données perdues à la fermeture de l'onglet
- Fichier JSON local (Electron) : ajouterait une dépendance native

**Stratégie de migration :** la clé de stockage inclut le nom du store (`da-projects`, `da-stratex`). Si le schéma évolue, un champ `version` dans l'export JSON permet une migration manuelle ou automatisée.

---

### Styles — Tailwind CSS 3

**Pourquoi Tailwind :** utilities-first, aucun CSS global à maintenir, tree-shaking automatique, dark theme sans configuration complexe.

**Alternatives rejetées :**
- CSS Modules : verbeux pour un thème global cohérent
- styled-components / Emotion : runtime CSS-in-JS, bundle plus lourd, pas adapté à Tailwind
- shadcn/ui : pertinent mais ajoute une couche d'abstraction non nécessaire à ce stade

---

### Visualisation — Recharts

**Pourquoi Recharts :** composants React natifs, responsive, customisable, pas de dépendance D3 directe.

**Alternatives rejetées :**
- Chart.js : API impérative, bridging manuel avec React
- Victory : similaire à Recharts mais bundle plus lourd
- Nivo : très complet mais surqualifié pour 1–2 graphiques

---

### Icônes — Lucide React

**Pourquoi Lucide :** fork maintenu de Feather Icons, tree-shakeable, design cohérent avec le style épuré de l'application.

---

### Dates — date-fns 3

**Pourquoi date-fns :** tree-shakeable, immutable, support i18n (locale `fr`), API fonctionnelle prévisible.

**Alternatives rejetées :**
- Day.js : similaire mais moins tree-shakeable
- Luxon : puissant mais API plus lourde pour des besoins simples

---

## Conséquences

✅ Zéro backend, déploiement statique possible (GitHub Pages, Vercel, Netlify)  
✅ Bundle final estimé < 400 kB gzippé  
✅ Données privées, jamais transmises hors du navigateur  
⚠️ localStorage limité à ~5 Mo (suffisant pour des centaines de projets)  
⚠️ Pas de synchronisation multi-appareils (à adresser en ADR-002 si besoin)
