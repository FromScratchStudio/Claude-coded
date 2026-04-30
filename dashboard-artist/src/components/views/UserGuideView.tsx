import { useState } from "react";
import type { ViewId } from "../../types";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";

interface Section {
  id: Exclude<ViewId, "user-guide">;
  label: string;
  icon: string;
  color: string;
  summary: string;
  what: string[];
  how: string[];
  tips: string[];
}

const SECTIONS: Section[] = [
  {
    id: "dashboard",
    label: "Vue d'ensemble",
    icon: "◎",
    color: "#E8C547",
    summary: "Tableau de bord central — snapshot instantané de l'état de santé du système créatif.",
    what: [
      "Indicateurs d'énergie, de plaisir et de jours épuisés (auto-évaluation hebdomadaire)",
      "Compteur de banque d'avance (chapitres en stock)",
      "Score de durabilité calculé automatiquement",
      "Sélecteur de mode dégradé actif",
      "Résumé des projets actifs, chapitres en cours et idées brutes",
      "Suivi du niveau d'ultra-légèreté hebdomadaire (4 dernières semaines)",
    ],
    how: [
      "Ajuste les curseurs Énergie et Plaisir chaque soir ou début de session",
      "Incrémente Jours épuisés quand une journée « hors protocole » se produit",
      "Active un mode dégradé si ton contexte de vie change (voyage, surcharge…)",
      "Le badge de durabilité change de couleur automatiquement selon tes seuils",
    ],
    tips: [
      "Si le badge est rouge 3 jours d'affilée → ouvre Garde-fous et active le bon mode dégradé",
      "La banque d'avance idéale est ≥ 3 chapitres pour absorber les aléas",
    ],
  },
  {
    id: "trimestre",
    label: "Trimestre",
    icon: "◈",
    color: "#34D399",
    summary: "Planification trimestrielle — objectifs, sprints hebdomadaires et rétrospective.",
    what: [
      "Définition des objectifs du trimestre en cours",
      "Planning des semaines (sprints de 7 jours)",
      "Suivi des livrables et jalons clés",
      "Espace de rétrospective en fin de cycle",
    ],
    how: [
      "En début de trimestre, renseigne 2 à 4 objectifs mesurables",
      "Chaque dimanche soir, planifie la semaine suivante en 15 min",
      "En fin de trimestre, complète la rétro avant de démarrer le suivant",
    ],
    tips: [
      "Limite-toi à 3 objectifs max par trimestre pour rester réaliste",
      "Un objectif bien formulé est mesurable : « publier 4 chapitres » plutôt que « avancer sur le roman »",
    ],
  },
  {
    id: "pipeline",
    label: "Pipeline",
    icon: "⇒",
    color: "#60A5FA",
    summary: "Chaîne de production fermée — chaque chapitre progresse d'étape en étape via des portes de qualité.",
    what: [
      "Liste des chapitres en cours de production, classés par étape",
      "Étapes du workflow personnalisables (créer, modifier, supprimer)",
      "Portes de qualité par étape : cases à cocher avant de pouvoir avancer",
      "Hook transmédia optionnel par chapitre",
      "Section « Publiés » pour les chapitres finalisés",
    ],
    how: [
      "Clique « + Ajouter » pour créer un nouveau chapitre (il entre en étape 1 automatiquement)",
      "Coche toutes les portes de qualité de l'étape en cours, puis clique « Avancer »",
      "Utilise « ⚙ Étapes » pour gérer le workflow : ajouter des étapes, modifier les portes, supprimer",
      "Clique sur le titre d'un chapitre pour le renommer",
    ],
    tips: [
      "Ne jamais avancer un chapitre si une porte est non cochée — c'est la règle fondamentale du pipeline",
      "Les portes de qualité sont éditables : adapte-les à ton genre et ton processus",
      "Un pipeline sain a 1–2 chapitres max par étape intermédiaire",
    ],
  },
  {
    id: "projects",
    label: "Projets",
    icon: "◉",
    color: "#A78BFA",
    summary: "Gestionnaire de projets — vision macro de tous les projets créatifs par anneau stratégique.",
    what: [
      "Projets organisés en 3 anneaux : Centre (cœur), Orbite (adjacent), Périphérie (expérimental)",
      "Statuts : Actif, En pause, Terminé, Abandonné",
      "Priorité (haute / moyenne / basse) et barre de progression",
      "Association à une phase de la feuille de route",
      "Filtres par statut et par anneau",
    ],
    how: [
      "Clique « + Nouveau projet » pour créer — renseigne le nom, l'anneau, la phase, la priorité",
      "Mets à jour la barre de progression régulièrement (glissière 0–100 %)",
      "Utilise les filtres en haut pour isoler les projets actifs ou ceux d'un anneau",
      "Clique ✎ pour éditer, × pour supprimer",
    ],
    tips: [
      "Le Centre ne devrait contenir qu'1 à 2 projets actifs pour rester focalisé",
      "Un projet en Périphérie depuis plus de 2 trimestres sans avancement → envisager abandon",
    ],
  },
  {
    id: "kpis",
    label: "KPIs",
    icon: "◆",
    color: "#F97316",
    summary: "Indicateurs de performance — mesure objective de la production et de la santé créative.",
    what: [
      "KPIs de production (chapitres publiés, mots écrits, blocs créatifs…)",
      "KPIs de santé (énergie moyenne, jours épuisés, banque d'avance)",
      "Visualisation par graphique anneau (RingDonut)",
      "Comparaison valeur actuelle vs objectif",
    ],
    how: [
      "Mets à jour les valeurs au moins une fois par semaine",
      "Les KPIs dont la valeur atteint l'objectif passent au vert automatiquement",
      "Utilise la vue Trimestre pour fixer les objectifs de période",
    ],
    tips: [
      "5 KPIs bien suivis valent mieux que 20 KPIs négligés",
      "Revois tes objectifs en début de chaque trimestre — pas en milieu de cycle",
    ],
  },
  {
    id: "phases",
    label: "Phases",
    icon: "▶",
    color: "#34D399",
    summary: "Feuille de route 36 mois — tâches stratégiques organisées par phase de développement.",
    what: [
      "Phases 0 à N représentant les grandes étapes du projet sur 36 mois",
      "Chaque phase contient une liste de tâches stratégiques",
      "Progression calculée automatiquement (% de tâches cochées)",
      "Phases et tâches entièrement éditables : créer, renommer, supprimer, recolorer",
      "Panneau d'avancement global en bas de page",
    ],
    how: [
      "Coche une tâche quand elle est réellement accomplie (pas « en cours »)",
      "Clique sur ✎ à côté d'une tâche pour la renommer, × pour la supprimer",
      "Clique « + Ajouter une tâche » en bas d'une phase pour ajouter une tâche personnalisée",
      "Clique ✎ sur l'en-tête de phase pour modifier nom, période et couleurs",
      "Clique « + Nouvelle phase » en haut pour créer une phase supplémentaire",
    ],
    tips: [
      "Une tâche = une action concrète terminée, pas un projet entier",
      "Les phases doivent rester stables — ne modifie pas les tâches en cours de phase sauf nécessité absolue",
    ],
  },
  {
    id: "ideas",
    label: "Idées",
    icon: "✦",
    color: "#EC4899",
    summary: "Capture et maturation des idées — du spark brut jusqu'à l'intégration dans le pipeline.",
    what: [
      "Capture rapide d'idées brutes sans friction",
      "Stades de maturation : Brute → Explorée → Validée → Intégrée → Archivée",
      "Tags et catégories pour organiser",
      "Note d'impact et d'effort estimés",
    ],
    how: [
      "Capture toute idée dès qu'elle surgit — sans filtrer ni évaluer",
      "Lors de la session hebdomadaire, fais avancer les idées brutes vers Explorée ou archive-les",
      "Une idée Validée peut être transformée en chapitre dans le Pipeline ou en projet",
    ],
    tips: [
      "Ne laisse pas plus de 10 idées en état Brute — la capture perd son sens si tout reste en vrac",
      "L'évaluation impact/effort se fait lors du triage hebdomadaire, jamais en capture",
    ],
  },
  {
    id: "garde-fous",
    label: "Garde-fous",
    icon: "⚑",
    color: "#EF4444",
    summary: "Protocoles de protection — modes dégradés, principes, pièges, checklist collab et budgets.",
    what: [
      "Modes dégradés : protocoles adaptés quand la vie perturbe le rythme normal",
      "11 Principes fondateurs de la méthode (éditables)",
      "10 Pièges classiques à éviter (éditables)",
      "Checklist de collaboration : 8 critères avant toute collaboration externe",
      "Budget construction : plafond d'heures par phase pour l'outillage",
    ],
    how: [
      "Active un mode dégradé depuis la Vue d'ensemble ou depuis cet onglet",
      "Utilise la Checklist collab AVANT d'accepter toute collaboration — si < 6 oui : décliner",
      "Lis les Pièges en début de chaque trimestre comme rappel préventif",
      "Tous les éléments sont éditables : adapte les textes à ta réalité",
    ],
    tips: [
      "Le mode dégradé n'est pas un échec — c'est un protocole de survie planifié",
      "La règle d'or du Budget construction : construire des outils POUR créer, jamais AU LIEU DE créer",
    ],
  },
  {
    id: "referentiel",
    label: "Référentiel",
    icon: "≡",
    color: "#64748B",
    summary: "Base de connaissances — références, influences et ressources de la méthode.",
    what: [
      "Références artistiques et influences organisées par catégorie",
      "Ressources méthodologiques et lectures clés",
      "Notes sur les modèles économiques et stratégiques étudiés",
    ],
    how: [
      "Consulte le référentiel pour alimenter ta réflexion stratégique",
      "Ajoute les références importantes au fil de tes découvertes",
    ],
    tips: [
      "Un référentiel vivant vaut mieux qu'une base figée : mets-le à jour régulièrement",
    ],
  },
  {
    id: "kefta-matesha",
    label: "Kefta Matesha",
    icon: "★",
    color: "#E8C547",
    summary: "Projet phare — suivi dédié au projet principal avec ses spécificités.",
    what: [
      "Suivi spécifique du projet Kefta Matesha",
      "Chapitres, arcs narratifs et structure",
      "Métriques de production dédiées",
    ],
    how: [
      "Mets à jour l'avancement des arcs au fil de la production",
      "Utilise cette vue pour le suivi détaillé, le Pipeline pour la production chapitre par chapitre",
    ],
    tips: [
      "Cette vue est complémentaire du Pipeline — elle donne la vision macro de l'œuvre",
    ],
  },
  {
    id: "weekly-calendar",
    label: "Agenda",
    icon: "▦",
    color: "#22D3EE",
    summary: "Planification hebdomadaire — organise et visualise tes créneaux de travail par jour, avec gestion des Unités de Temps (UT) et export PDF imprimable.",
    what: [
      "Grille 7 jours (Lun → Dim) avec créneaux positionnés de manière proportionnelle à leur durée réelle",
      "Unité de Temps (UT) : 1h30 en régime normal, 45min en mode dégradé actif",
      "Chaque créneau associe un mode de travail (couleur), un projet et une note libre",
      "Multi-UT par créneau : 1, 2, 3, 4 ou 6 UT par réservation",
      "Ligne « temps actuel » en cyan sur le jour courant",
      "Statistiques de la semaine : répartition par mode et charge par jour",
      "Export PDF : fiche imprimable A4 des priorités planifiées (Fiche PDF)",
      "Copie de semaine : duplique tous les créneaux vers une autre semaine",
    ],
    how: [
      "Clique n'importe où dans la colonne d'un jour pour créer un créneau à l'heure cliquée",
      "Dans l'éditeur, choisis le nombre d'UT (la durée et l'heure de fin se calculent automatiquement)",
      "Sélectionne un mode de travail (Deep Work, Admin, Créatif…) pour coloriser le créneau",
      "Associe un projet et ajoute une note pour identifier la priorité du créneau",
      "Clique sur un créneau existant pour le modifier ou l'effacer",
      "Navigue entre les semaines avec ‹ / › ; reviens à la semaine actuelle avec le bouton central",
      "Clique « 🖨 Fiche PDF » pour générer et imprimer/sauvegarder la fiche de la semaine en PDF",
      "Clique « Copier → » pour dupliquer tous les créneaux vers une autre semaine",
      "« Tout effacer » supprime tous les créneaux de la semaine affichée",
    ],
    tips: [
      "1 UT = le bloc de travail indivisible : ne planifie pas moins d'1 UT par créneau",
      "En mode dégradé actif (Garde-fous), la durée des UT passe automatiquement à 45min — les créneaux existants conservent leur durée d'origine",
      "La hauteur visuelle d'un créneau reflète sa durée réelle : 1 UT (1h30) = 84px, 3 UT = 252px",
      "Un créneau de 6 UT (9h en régime normal) est exceptionnel — préfère 2 créneaux distincts pour la lisibilité",
      "La Fiche PDF est optimisée pour l'impression A4 couleur et N&B — utilise « Enregistrer en PDF » dans la boîte de dialogue d'impression",
      "Planifie en début de semaine, ajuste en milieu — n'efface pas les créneaux passés, ils servent à la rétro",
    ],
  },
  {
    id: "retrospective",
    label: "Rétrospective",
    icon: "↩",
    color: "#A78BFA",
    summary: "Bilan hebdomadaire — énergie, plaisir, réalisations, blocages, apprentissages et intention pour la semaine suivante.",
    what: [
      "Score d'énergie (1–10) et score de plaisir / flow (1–10) pour la semaine",
      "Taux de complétion des créneaux planifiés (0–100%)",
      "Champs texte : réalisations, blocages, apprentissages, intention semaine prochaine",
      "Résumé de la semaine planifiée (créneaux Agenda, répartition par mode)",
      "Historique de toutes les rétros enregistrées, triées par date décroissante",
      "Navigation entre les semaines (par défaut : semaine précédente)",
    ],
    how: [
      "La vue s'ouvre sur la semaine passée — navigue avec ‹ / › pour choisir la semaine à évaluer",
      "Ajuste les sliders Énergie et Plaisir pour refléter ton ressenti de la semaine",
      "Estime le taux de complétion : % de créneaux planifiés effectivement réalisés",
      "Remplis les 4 champs texte librement — quelques lignes suffisent",
      "Clique « Enregistrer la rétro » pour sauvegarder",
      "Depuis l'Agenda, clique « ↩ Rétro » pour accéder directement à la rétrospective",
    ],
    tips: [
      "Fais ta rétro chaque lundi matin sur la semaine écoulée — 5 min suffisent",
      "L'intention semaine prochaine devient ton cap pour l'Agenda de la semaine",
      "Le panneau de droite affiche les créneaux planifiés pour la semaine sélectionnée — utile pour estimer le taux de complétion",
      "Une rétro enregistrée affiche « ✓ enregistrée » dans la barre de navigation",
      "Toutes les rétros sont persistées localement — exporte régulièrement via les Réglages",
    ],
  },
  {
    id: "settings",
    label: "Réglages",
    icon: "⚙",
    color: "#94A3B8",
    summary: "Paramètres et sauvegarde — export/import JSON et inventaire des données stockées.",
    what: [
      "Export : télécharge l'intégralité des données en fichier JSON horodaté",
      "Import : charge un fichier de sauvegarde et fusionne les données",
      "Indicateur de taille du stockage local",
      "Inventaire des données (nombre de phases, chapitres, projets…)",
    ],
    how: [
      "Exporte régulièrement (hebdomadaire recommandé) pour avoir une sauvegarde locale",
      "Pour restaurer : sélectionne un fichier JSON → prévisualise les clés → confirme l'import",
      "L'import est une fusion — les données existantes sont complétées, pas effacées",
    ],
    tips: [
      "Toutes les données sont 100% locales (localStorage) — aucune transmission réseau",
      "Nomme tes exports avec la date pour retrouver facilement la bonne version",
      "Avant toute modification structurelle importante, exporte d'abord",
    ],
  },
];

export default function UserGuideView() {
  const setActiveView = useStore((s) => s.setActiveView);
  const [active, setActive] = useState<Exclude<ViewId, "user-guide"> | null>(null);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Guide d'utilisation</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Documentation complète de chaque section — cliquez une page pour en savoir plus
        </p>
      </div>

      {/* Overview grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActive(isActive ? null : section.id)}
              style={{
                background: isActive ? `${section.color}18` : C.surface,
                borderTop: `1px solid ${isActive ? section.color : C.border}`,
                borderRight: `1px solid ${isActive ? section.color : C.border}`,
                borderBottom: `1px solid ${isActive ? section.color : C.border}`,
                borderLeft: `3px solid ${section.color}`,
                borderRadius: 8,
                padding: "0.85rem 1rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.15s, background 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <span style={{ color: section.color, fontSize: "1rem", lineHeight: 1 }}>{section.icon}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: "0.75rem", color: isActive ? section.color : C.text, fontWeight: "bold" }}>
                  {section.label}
                </span>
              </div>
              <p style={{ fontSize: "0.63rem", color: C.textDim, margin: 0, lineHeight: 1.5 }}>
                {section.summary.split("—")[0].trim()}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {active && (() => {
        const section = SECTIONS.find((s) => s.id === active)!;
        return (
          <Card style={{ borderLeft: `3px solid ${section.color}`, marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                  <span style={{ color: section.color, fontSize: "1.3rem", lineHeight: 1 }}>{section.icon}</span>
                  <h3 style={{ fontFamily: FONT.display, fontSize: "1.05rem", color: C.text, margin: 0 }}>{section.label}</h3>
                </div>
                <p style={{ fontSize: "0.75rem", color: C.textSoft, margin: 0, lineHeight: 1.6, maxWidth: 640 }}>
                  {section.summary}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button
                  onClick={() => setActiveView(section.id)}
                  style={{ background: section.color, border: "none", color: "#000", borderRadius: 6, padding: "0.35rem 0.85rem", fontSize: "0.68rem", fontFamily: FONT.mono, cursor: "pointer", fontWeight: "bold" }}
                >
                  → Ouvrir
                </button>
                <button
                  onClick={() => setActive(null)}
                  style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.35rem 0.6rem", fontSize: "0.68rem", fontFamily: FONT.mono, cursor: "pointer" }}
                >
                  ×
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
              {/* What */}
              <div>
                <SectionTitle accent={section.color}>Ce que contient cette page</SectionTitle>
                <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {section.what.map((item, i) => (
                    <li key={i} style={{ fontSize: "0.73rem", color: C.textSoft, lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* How */}
              <div>
                <SectionTitle accent={section.color}>Comment l'utiliser</SectionTitle>
                <ol style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {section.how.map((item, i) => (
                    <li key={i} style={{ fontSize: "0.73rem", color: C.textSoft, lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              <div>
                <SectionTitle accent={section.color}>Conseils & pièges</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {section.tips.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", padding: "0.4rem 0.5rem", background: `${section.color}0d`, borderRadius: 5, border: `1px solid ${section.color}22` }}>
                      <span style={{ color: section.color, flexShrink: 0, fontSize: "0.7rem", marginTop: 1 }}>→</span>
                      <span style={{ fontSize: "0.7rem", color: C.textSoft, lineHeight: 1.5 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        );
      })()}

      {/* Method summary */}
      <Card style={{ background: `linear-gradient(135deg, ${C.surface}, #1a0f2e)` }}>
        <SectionTitle accent={C.gold}>La Méthode Unifiée — 3 Couches</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem", marginTop: "0.75rem" }}>
          {[
            {
              layer: "Couche 1",
              name: "Production",
              color: C.green,
              desc: "Pipeline fermé + Phases + Projets. La machine de production quotidienne : chapitres avancent via les étapes, les projets progressent, la feuille de route se coche.",
            },
            {
              layer: "Couche 2",
              name: "Durabilité",
              color: C.amber,
              desc: "Dashboard + Trimestre + KPIs. Le monitoring de santé : énergie, plaisir, banque d'avance. Sans durabilité, la production s'effondre.",
            },
            {
              layer: "Couche 3",
              name: "Protection",
              color: C.red,
              desc: "Garde-fous + Modes dégradés + Checklist. Les filets de sécurité : protocoles pré-définis pour chaque aléa de la vie d'artiste indépendant.",
            },
          ].map((l) => (
            <div key={l.layer} style={{ padding: "0.75rem", background: C.bg, borderRadius: 6, borderLeft: `3px solid ${l.color}` }}>
              <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: l.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.2rem" }}>{l.layer}</div>
              <div style={{ fontFamily: FONT.display, fontSize: "0.95rem", color: C.text, marginBottom: "0.4rem" }}>{l.name}</div>
              <p style={{ fontSize: "0.68rem", color: C.textDim, margin: 0, lineHeight: 1.55 }}>{l.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.62rem", color: C.textVeryDim, margin: "1rem 0 0", fontFamily: FONT.mono, letterSpacing: "0.08em", textAlign: "center" }}>
          STRATEX · MÉTHODE UNIFIÉE · ARTISTE ISOLÉ · RYTHME SOIR / WEEK-END
        </p>
      </Card>
    </div>
  );
}
