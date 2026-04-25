import { useState, useEffect } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────
const PHASES = [
  { id: 0, label: "Phase 0", name: "Fondations", months: "Mois 1–4", color: "#6B7280", accent: "#9CA3AF",
    tasks: [
      { id: "p0-1", text: "Ouvrir le Substack (identité + À propos + manifeste)", done: true },
      { id: "p0-2", text: "Bible d'univers du feuilleton (personnages, cosmogonie, arc macro)", done: true },
      { id: "p0-3", text: "Script des 8-10 premiers épisodes", done: false },
      { id: "p0-4", text: "Publication du premier épisode (sem. 12-14 max)", done: false },
      { id: "p0-5", text: "Pipeline technique (automation cross-plateforme, dashboards)", done: false },
      { id: "p0-6", text: "Identifier 3-5 créateur·trices de l'écosystème", done: false },
    ]},
  { id: 1, label: "Phase 1", name: "Installation du rythme", months: "Mois 5–12", color: "#B45309", accent: "#F59E0B",
    tasks: [
      { id: "p1-1", text: "Publication bi-mensuelle stricte — aucune exception", done: false },
      { id: "p1-2", text: "Mini-contenus hebdomadaires (croquis, notes, making-of)", done: false },
      { id: "p1-3", text: "Ouverture paliers payants (mois 8)", done: false },
      { id: "p1-4", text: "Trailer animé produit sur un congé (mois 10-11)", done: false },
      { id: "p1-5", text: "Outil focal : un par trimestre sur projet réel", done: false },
      { id: "p1-6", text: "Aucune collaboration avant le mois 12", done: false },
    ]},
  { id: 2, label: "Phase 2", name: "Première matérialisation", months: "Mois 13–24", color: "#065F46", accent: "#10B981",
    tasks: [
      { id: "p2-1", text: "Premier crowdfunding (mois 14-16) — objectif 8-15 k€", done: false },
      { id: "p2-2", text: "Première collaboration structurée (mois 18-20)", done: false },
      { id: "p2-3", text: "Approfondissement Harmony/Moho — motion comic", done: false },
      { id: "p2-4", text: "Bilan honnête mois 22 — système, KPIs, énergie", done: false },
    ]},
  { id: 3, label: "Phase 3", name: "Consolidation & décision", months: "Mois 25–36", color: "#4C1D95", accent: "#8B5CF6",
    tasks: [
      { id: "p3-1", text: "Banque d'avance 4-6 épisodes confortable", done: false },
      { id: "p3-2", text: "Deuxième crowdfunding (mois 28-30)", done: false },
      { id: "p3-3", text: "Choix et lancement du projet-signature long (mois 26)", done: false },
      { id: "p3-4", text: "2 collaborations cadrées dans l'année", done: false },
      { id: "p3-5", text: "Question d'optionalité posée (mois 33-36)", done: false },
    ]},
];

const RINGS = [
  { id: "centre", label: "Centre", name: "BD Flagship", pct: 70, color: "#E8C547" },
  { id: "anneau1", label: "Anneau 1", name: "Amplifications solo", pct: 15, color: "#F97316" },
  { id: "anneau2", label: "Anneau 2", name: "Collaborations choisies", pct: 10, color: "#06B6D4" },
  { id: "anneau3", label: "Anneau 3", name: "Optionalité", pct: 5, color: "#A78BFA" },
];

const PROJECTS_INIT = [
  { id: "feuilleton", name: "Feuilleton BD principal", ring: "centre", phase: 0, status: "active", progress: 15, note: "Bible en cours — 2 épisodes écrits", priority: "high" },
  { id: "substack", name: "Publication Substack", ring: "centre", phase: 0, status: "active", progress: 40, note: "Page À propos publiée, identité en cours", priority: "high" },
  { id: "pipeline", name: "Pipeline technique", ring: "centre", phase: 0, status: "active", progress: 20, note: "Automation cross-plateforme à installer", priority: "medium" },
  { id: "trailer", name: "Trailer animé crowdfunding", ring: "anneau1", phase: 1, status: "backlog", progress: 0, note: "À produire sur congé mois 10-11", priority: "medium" },
  { id: "collab1", name: "Collaboration structurée #1", ring: "anneau2", phase: 2, status: "backlog", progress: 0, note: "Pas avant mois 12 — identifier 1 personne", priority: "low" },
  { id: "crowdfunding1", name: "Premier crowdfunding", ring: "anneau1", phase: 2, status: "backlog", progress: 0, note: "Mois 14-16 — trailer comme asset central", priority: "low" },
  { id: "location", name: "Location passive matériel", ring: "anneau3", phase: 0, status: "pending", progress: 10, note: "Fiche technique + tarifs à structurer", priority: "low" },
];

const KPIS = [
  { label: "Abonnés email", current: 0, target3m: 200, target12m: 800, target36m: 4500, unit: "", icon: "✉" },
  { label: "Taux ouverture", current: 0, target3m: 50, target12m: 45, target36m: 42, unit: "%", icon: "📬" },
  { label: "% payants", current: 0, target3m: 2, target12m: 5, target36m: 6, unit: "%", icon: "💳" },
  { label: "Revenu mensuel", current: 0, target3m: 0, target12m: 800, target36m: 3000, unit: "€", icon: "📈" },
  { label: "Banque d'avance", current: 0, target3m: 3, target12m: 4, target36m: 6, unit: " éps.", icon: "📚" },
];

const STATUS_MAP = {
  active: { label: "En cours", color: "#10B981", bg: "#064E3B" },
  pending: { label: "À démarrer", color: "#F59E0B", bg: "#451A03" },
  backlog: { label: "Backlog", color: "#6B7280", bg: "#1F2937" },
};

const PRIORITY_MAP = {
  high: { label: "Priorité haute", dot: "#EF4444" },
  medium: { label: "Priorité moyenne", dot: "#F59E0B" },
  low: { label: "Priorité basse", dot: "#6B7280" },
};

const WORKFLOW_STAGES = [
  { id: 1, label: "Noyau", fullName: "Noyau narratif", when: "Soir, 30-45 min",
    gates: ["Thème énonçable en une phrase", "Tension centrale identifiée", "Promesse lecteur·trice formulée", "Transformation définie (« à la fin, X a changé »)"],
    rule: "Si tu ne sais pas ce qui change à la fin, tu ne continues pas." },
  { id: 2, label: "Prototype", fullName: "Prototype (sas de survie)", when: "Soir, 1-3 sessions × 45 min",
    gates: ["Rythme validé (lecture à voix haute)", "Émotion passe sans dessin propre", "Fin / cliff / respiration testée", "Aucune ambiguïté page à page"],
    rule: "Si le prototype ne passe pas, le chapitre est jeté ou réécrit. Pas amélioré." },
  { id: 3, label: "Verrou", fullName: "Mise en scène unifiée", when: "Soir, 1-2 sessions",
    gates: ["Storyboard définitif (pas en cours)", "Format maître choisi (print ou web)", "Palette de chapitre identifiée", "Aucune case encore à penser"],
    rule: "Après cette étape, le chapitre est décidé. Le week-end ne sert plus à réfléchir." },
  { id: 4, label: "Rough++", fullName: "Rough++ décisionnel", when: "Week-end, bloc 2-3h",
    gates: ["Fluidité visuelle confirmée (lecture à blanc)", "Narration claire même sans bulles", "Aucune case laisse un doute"],
    rule: "Si la simulation de lecture échoue : retour correction. Pas de clean." },
  { id: 5, label: "Clean", fullName: "Clean + couleur ciblée", when: "Week-end, 1-2 blocs",
    gates: ["Clean uniquement sur cases nécessaires", "Palette restreinte respectée", "Export multi-format fait", "Fichiers sources sauvegardés"],
    rule: "Ici, tu es artisan. L'auteur·e a décidé aux étapes 1-3." },
  { id: 6, label: "Publi", fullName: "Publication + trace", when: "Fin de week-end",
    gates: ["Publication effective sur Substack", "Déclinaisons multi-plateformes automatisées", "Trace publiée (croquis, note, extrait)", "Métriques notées + debrief à J+7/10"],
    rule: "Boucle post-publi J+7/10 : ce chapitre enseigne quoi au suivant ?" },
];

const CHAPTERS_INIT = [
  { id: "ch1", title: "Pilote", stage: 6, gates: [true, true, true, true], lastUpdate: "il y a 2 sem.", hook: "Scène d'ouverture supporte un trailer atmosphérique" },
  { id: "ch2", title: "Rencontre", stage: 5, gates: [true, true, false, false], lastUpdate: "il y a 3 jours", hook: "Séquence centrale → motion comic autonome possible" },
  { id: "ch3", title: "Révélation", stage: 4, gates: [true, false, false], lastUpdate: "hier", hook: "Rien ici — chapitre de transition, ne pas amplifier" },
  { id: "ch4", title: "Rupture", stage: 3, gates: [true, true, false, false], lastUpdate: "il y a 5 jours", hook: "Fin du chapitre = teaser saisissant" },
  { id: "ch5", title: "Fuite", stage: 2, gates: [false, false, false, false], lastUpdate: "il y a 1 sem.", hook: "" },
  { id: "ch6", title: "Confrontation", stage: 1, gates: [true, false, false, false], lastUpdate: "il y a 2 sem.", hook: "Climax visuel — court-métrage potentiel" },
];

const MODES_TRAVAIL = [
  { id: "MT-C", name: "Création brute", energy: 5, color: "#E8C547", desc: "Écriture, roughs, ideation" },
  { id: "MT-P", name: "Production", energy: 3, color: "#F97316", desc: "Clean, couleur, mise en page" },
  { id: "MT-O", name: "Optimisation", energy: 2, color: "#10B981", desc: "Retouches, polish, relecture" },
  { id: "MT-D", name: "Diffusion", energy: 2, color: "#06B6D4", desc: "Publication, cross-post, newsletter" },
  { id: "MT-R", name: "Recherche/Veille", energy: 1, color: "#A78BFA", desc: "Lectures, tutos, références" },
  { id: "MT-H", name: "Humanisation IA", energy: 2, color: "#EC4899", desc: "Passage humain sur matière IA" },
];

const QUARTER_DEFAULT = {
  q: "Q1 2026",
  plp: "Installer le feuilleton et publier les 4 premiers épisodes",
  arc: "Arc 1 — Pilote → Confrontation (ch. 1 à 6)",
  arcEnd: "À la fin de l'arc : le personnage principal a franchi le seuil",
  allocation: { centre: 75, ampli: 10, collab: 0, opt: 15 },
  amplification: "Aucune — phase de fondation",
  outilFocal: "Toon Boom Harmony — sur une séquence de 3 sec du trailer",
  zonesRouges: "Semaine 8 : sprint produit au travail. Semaine 11 : code freeze.",
  regleUnique: "Publier imparfait plutôt que parfait différé.",
};

const DEGRADED_MODES = [
  { id: "crunch", label: "Crunch professionnel", color: "#EF4444",
    trigger: "Le travail salarié mange le temps du soir et la disponibilité cognitive",
    rules: [
      "Suspendre les UT du soir (zéro production en semaine)",
      "Maintenir uniquement la collecte d'idées (post-it, pas de tri)",
      "Week-end sanctuarisé : repos d'abord, UT minimale si l'énergie revient",
      "La banque d'avance absorbe la publication",
    ],
    exit: "Dès la première semaine normale, retour au rythme standard. Pas de compensation." },
  { id: "conges", label: "Congés", color: "#F59E0B",
    trigger: "Période de congé professionnel — repos ou créneau privilégié",
    rules: [
      "Si repos : arrêt complet (créatif inclus)",
      "Si créneau privilégié : un seul chantier majeur maximum",
      "Pas de tentative de rattrapage post-congé",
    ],
    exit: "Reprise tranquille — ne pas exiger plus de soi-même la première semaine." },
  { id: "maladie", label: "Maladie / épuisement", color: "#8B5CF6",
    trigger: "Maladie, épuisement physique ou mental",
    rules: [
      "Arrêt total créatif et publication",
      "La banque d'avance absorbe jusqu'à 4 semaines",
      "Au-delà : pause publique annoncée honnêtement",
      "Ne pas négocier avec soi-même, ne pas culpabiliser",
    ],
    exit: "Reprise sur signal médical clair. Énergie subjective ≥ 6/10 sur 7 jours consécutifs." },
  { id: "vie", label: "Événement de vie", color: "#06B6D4",
    trigger: "Deuil, naissance, déménagement, crise familiale, etc.",
    rules: [
      "Suspension sans culpabilité, durée non chiffrée",
      "Communication honnête si la pause est visible publiquement",
      "Aucune décision stratégique pendant la suspension",
    ],
    exit: "Reprise quand la situation est stabilisée — pas avant." },
];

const TEN_PRINCIPLES = [
  "Un projet avance par chapitres finis, pas par motivation.",
  "Chaîne fermée, étapes non-chevauchantes — non démarrée, en cours, ou close.",
  "Le prototype est un sas de survie, pas une répétition.",
  "Le soir est pour décider, le week-end est pour exécuter.",
  "Si ce n'est pas montrable, ce n'est pas un livrable.",
  "Une œuvre se ferme. Une pratique s'entretient.",
  "L'IA est seconde tête, jamais seconde main.",
  "L'amplification audiovisuelle sort du chapitre, jamais l'inverse.",
  "La banque d'avance est l'antidote à la culpabilité.",
  "Tu n'optimises pas ton talent. Tu optimises ta capacité à continuer.",
];

const TEN_TRAPS = [
  { label: "Éparpillement par multi-capacité", desc: "Tu peux tout faire. Cela ne signifie pas que tu dois." },
  { label: "Apprentissage comme évitement", desc: "Apprendre est plus confortable que publier imparfait." },
  { label: "Sur-collaboration généreuse", desc: "Dire non est plus difficile qu'accepter, mais protège." },
  { label: "Équipement comme identité", desc: "Devenir « la personne qui a le matériel » est un piège." },
  { label: "Prestation B2B qui mange tout", desc: "Un contrat de 3 000 € peut sembler prioritaire — c'est faux." },
  { label: "Épuisement silencieux", desc: "Deux pratiques intenses sans conscience mène au burnout." },
  { label: "Pensée binaire transition pro", desc: "Le salaire protège ta liberté, il ne la compromet pas." },
  { label: "Ingénieur·e qui cannibalise l'artiste", desc: "Toute construction technique : besoin documenté, bornée." },
  { label: "Infrastructure perfectionniste", desc: "Ton piège le plus probable. Publier > infrastructure parfaite." },
  { label: "Glissement de projet en projet", desc: "Un projet fini vaut dix projets en cours." },
];

const COLLAB_CHECKLIST = [
  { q: "Univers", text: "Ce projet prolonge-t-il quelque chose de mon univers, ou est-ce 100% celui de l'autre ?" },
  { q: "Rôle", text: "Co-réalisation / co-production / DP avec crédit fort — ou simple exécution technique ?" },
  { q: "Durée", text: "Engagement < 10 jours de travail cumulés sur 3 mois ?" },
  { q: "Contrepartie", text: "Visibilité, crédits, accès audience, droits d'usage — au moins deux ?" },
  { q: "Matériel", text: "Liste explicite de ce qui est prêté, avec durée, caution, assurance ?" },
  { q: "Sortie", text: "L'œuvre finale sera-t-elle partageable sur mes canaux ?" },
  { q: "Réciprocité", text: "Cette personne peut-elle m'apporter quelque chose dans les 12 mois ?" },
  { q: "Filtre ultime", text: "Si je disais non, le regretterais-je dans un an ?" },
];

const BUILD_BUDGETS = [
  { phase: "Phase 0-1", months: "Mois 1-12", maxHours: 60, color: "#9CA3AF" },
  { phase: "Phase 2", months: "Mois 13-24", maxHours: 100, color: "#10B981" },
  { phase: "Phase 3", months: "Mois 25-36", maxHours: 200, color: "#8B5CF6" },
];

// ─── PERSISTANCE ───────────────────────────────────────────────────────────
function usePersistedState(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get(key); if (r?.value) setValue(JSON.parse(r.value)); }
      catch (e) {}
      setLoaded(true);
    })();
  }, [key]);
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await window.storage.set(key, JSON.stringify(value)); } catch (e) { console.error(e); }
    })();
  }, [key, value, loaded]);
  return [value, setValue];
}

// ─── HELPERS ───────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return <div style={{ background: "#0D1420", border: "1px solid #1F2937", borderRadius: 10, padding: "1.25rem", ...style }}>{children}</div>;
}

function SectionTitle({ children, accent }) {
  return <div style={{ fontFamily: "monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: accent || "#4B5563", textTransform: "uppercase", marginBottom: "1rem", borderLeft: `2px solid ${accent || "#374151"}`, paddingLeft: "0.5rem" }}>{children}</div>;
}

function ProgressBar({ value, max = 100, color = "#E8C547", height = 4 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ background: "#1F2937", borderRadius: 999, overflow: "hidden", height }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: color, transition: "width 0.4s ease", boxShadow: `0 0 6px ${color}66` }} />
    </div>
  );
}

function RingDonut({ rings, allocation }) {
  const size = 150, cx = size / 2, cy = size / 2, r = 55, stroke = 13;
  const display = allocation
    ? rings.map(rg => ({ ...rg, pct: allocation[rg.id === "centre" ? "centre" : rg.id === "anneau1" ? "ampli" : rg.id === "anneau2" ? "collab" : "opt"] || 0 }))
    : rings;
  const total = display.reduce((s, rg) => s + rg.pct, 0) || 1;
  let angle = -90;
  const arcs = display.filter(rg => rg.pct > 0).map(ring => {
    const sweep = (ring.pct / total) * 360;
    const start = angle, end = angle + sweep - 2;
    angle += sweep;
    const tr = d => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(tr(start)), y1 = cy + r * Math.sin(tr(start));
    const x2 = cx + r * Math.cos(tr(end)), y2 = cy + r * Math.sin(tr(end));
    const lg = sweep > 180 ? 1 : 0;
    return { ...ring, d: `M ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2}` };
  });
  const main = display[0]?.pct || 0;
  return (
    <svg width={size} height={size}>
      {arcs.map(arc => <path key={arc.id} d={arc.d} fill="none" stroke={arc.color} strokeWidth={stroke} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${arc.color}55)` }} />)}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#E8C547" style={{ fontSize: 22, fontFamily: "Georgia, serif", fontWeight: "bold" }}>{main}%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#6B7280" style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: 1 }}>CENTRE</text>
    </svg>
  );
}

// ─── TOP BAR ──────────────────────────────────────────────────────────────
function TopBar({ activeView, setActiveView, degradedMode }) {
  const tabs = [
    { id: "dashboard", label: "Vue d'ensemble" },
    { id: "trimestre", label: "Trimestre" },
    { id: "pipeline", label: "Pipeline" },
    { id: "ideas", label: "Idées" },
    { id: "transmedia", label: "Transmédia" },
    { id: "phases", label: "Phases" },
    { id: "projects", label: "Projets" },
    { id: "kpis", label: "KPIs" },
    { id: "garde-fous", label: "Garde-fous" },
  ];
  const activeMode = DEGRADED_MODES.find(m => m.id === degradedMode);
  return (
    <div style={{ padding: "0 2rem", borderBottom: "1px solid #1F2937", background: "#0A0F1A", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #E8C547, #F97316)", borderRadius: 6 }} />
          <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.15rem", color: "#E8C547", letterSpacing: "0.02em" }}>STRATEX</span>
          <span style={{ color: "#374151" }}>|</span>
          <span style={{ color: "#6B7280", fontSize: "0.7rem", fontFamily: "monospace", letterSpacing: "0.1em" }}>MÉTHODE UNIFIÉE — 3 COUCHES</span>
        </div>
        {activeMode && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.25rem 0.6rem", borderRadius: 4, background: "#450A0A", border: `1px solid ${activeMode.color}` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: activeMode.color, boxShadow: `0 0 6px ${activeMode.color}`, animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: activeMode.color, letterSpacing: "0.05em" }}>MODE {activeMode.label.toUpperCase()}</span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: "0.25rem", paddingBottom: "0.6rem", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveView(t.id)} style={{
            background: activeView === t.id ? "#111827" : "transparent",
            border: activeView === t.id ? "1px solid #374151" : "1px solid transparent",
            color: activeView === t.id ? "#E8C547" : "#6B7280",
            padding: "0.4rem 0.9rem", borderRadius: 6, fontSize: "0.72rem",
            cursor: "pointer", fontFamily: "monospace", letterSpacing: "0.05em", whiteSpace: "nowrap",
          }}>{t.label}</button>
        ))}
      </div>
    </div>
  );
}

function PhaseBar() {
  const cur = 0;
  return (
    <div style={{ display: "flex", gap: "0.5rem", padding: "0.9rem 2rem", background: "#070C16", borderBottom: "1px solid #1F2937" }}>
      {PHASES.map((p, i) => (
        <div key={p.id} style={{ flex: 1 }}>
          <div style={{ height: 3, background: i <= cur ? p.accent : "#1F2937", borderRadius: 2, marginBottom: "0.4rem", boxShadow: i === cur ? `0 0 8px ${p.accent}66` : "none" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.65rem", fontFamily: "monospace", letterSpacing: "0.1em", color: i === cur ? p.accent : "#4B5563" }}>{p.label}</span>
            <span style={{ fontSize: "0.6rem", color: "#374151" }}>{p.months}</span>
          </div>
          <div style={{ fontSize: "0.68rem", color: i <= cur ? "#9CA3AF" : "#374151", marginTop: "0.1rem" }}>{p.name}</div>
        </div>
      ))}
    </div>
  );
}

// ─── DASHBOARD VIEW ─────────────────────────────────────────────────────────
function DashboardView(props) {
  const { energy, setEnergy, plaisir, setPlaisir, joursEpuises, setJoursEpuises, ulWeek, setUlWeek,
          derivedBank, tasks, quarter, degradedMode, setDegradedMode, ideasCount, hooksCount, setActiveView } = props;
  const allTasks = PHASES.flatMap(p => p.tasks);
  const doneTasks = allTasks.filter(t => t.done || tasks[t.id]).length;
  const ulAvg = ulWeek.reduce((s, n) => s + n, 0) / 4;

  return (
    <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "1fr 1fr 1fr" }}>
      <Card>
        <SectionTitle accent="#E8C547">Allocation du trimestre</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <RingDonut rings={RINGS} allocation={quarter.allocation} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {RINGS.map(ring => {
              const k = ring.id === "centre" ? "centre" : ring.id === "anneau1" ? "ampli" : ring.id === "anneau2" ? "collab" : "opt";
              const v = quarter.allocation[k] || 0;
              return (
                <div key={ring.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: "0.68rem", color: ring.color, fontFamily: "monospace" }}>{ring.label}</span>
                    <span style={{ fontSize: "0.68rem", color: ring.color, fontFamily: "monospace" }}>{v}%</span>
                  </div>
                  <ProgressBar value={v} color={ring.color} height={3} />
                </div>
              );
            })}
          </div>
        </div>
        <div onClick={() => setActiveView("trimestre")} style={{ marginTop: "0.75rem", fontSize: "0.65rem", color: "#6B7280", cursor: "pointer", fontStyle: "italic", borderTop: "1px solid #1F2937", paddingTop: "0.6rem" }}>
          → Onglet <span style={{ color: "#E8C547" }}>Trimestre</span> pour ajuster
        </div>
      </Card>

      <Card>
        <SectionTitle accent="#06B6D4">Couche 3 — UT/UL hebdomadaire</SectionTitle>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.4rem", height: 80, marginBottom: "0.75rem" }}>
          {ulWeek.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
              <div style={{ fontSize: "0.65rem", color: "#06B6D4", fontFamily: "monospace" }}>{v}</div>
              <div style={{ width: "100%", height: `${Math.max((v / 10) * 60, 2)}px`, background: i === 3 ? "#06B6D4" : "#0891B2", borderRadius: "2px 2px 0 0", boxShadow: i === 3 ? "0 0 8px #06B6D466" : "none" }} />
              <div style={{ fontSize: "0.55rem", color: "#4B5563", fontFamily: "monospace" }}>S-{3-i}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>UL cette semaine</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <button onClick={() => setUlWeek(p => [...p.slice(0, 3), Math.max(0, p[3] - 1)])} style={{ background: "#1F2937", border: "none", color: "#E5E7EB", width: 22, height: 22, borderRadius: 4, cursor: "pointer" }}>−</button>
            <span style={{ fontSize: "0.85rem", color: "#06B6D4", fontFamily: "monospace", minWidth: 20, textAlign: "center" }}>{ulWeek[3]}</span>
            <button onClick={() => setUlWeek(p => [...p.slice(0, 3), p[3] + 1])} style={{ background: "#06B6D4", border: "none", color: "#000", width: 22, height: 22, borderRadius: 4, cursor: "pointer", fontWeight: "bold" }}>+</button>
          </div>
        </div>
        <div style={{ fontSize: "0.65rem", color: "#4B5563", borderTop: "1px solid #1F2937", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between" }}>
          <span>Moyenne roulante 4 sem.</span>
          <span style={{ color: "#06B6D4", fontFamily: "monospace" }}>{ulAvg.toFixed(1)} UL/sem</span>
        </div>
      </Card>

      <Card>
        <SectionTitle accent="#EF4444">Durabilité — ce mois</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {[
            { label: "Énergie créative", val: energy, set: setEnergy, max: 10, color: "#10B981" },
            { label: "Plaisir créatif", val: plaisir, set: setPlaisir, max: 10, color: "#F59E0B" },
            { label: "Jours épuisés / sem.", val: joursEpuises, set: setJoursEpuises, max: 7, color: joursEpuises >= 1 ? "#EF4444" : "#10B981", suffix: " < 1 obj." },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{s.label}</span>
                <span style={{ fontSize: "0.7rem", color: s.color, fontFamily: "monospace" }}>{s.val}/{s.max}{s.suffix && <span style={{ color: "#4B5563" }}> {s.suffix}</span>}</span>
              </div>
              <input type="range" min={s.label.includes("épuisés") ? 0 : 1} max={s.max} value={s.val} onChange={e => s.set(Number(e.target.value))} style={{ width: "100%", accentColor: s.color }} />
            </div>
          ))}
          <div style={{
            padding: "0.55rem 0.7rem", borderRadius: 6,
            background: energy >= 7 && plaisir >= 7 && joursEpuises < 1 ? "#064E3B" : energy <= 3 || plaisir <= 3 || joursEpuises >= 3 ? "#450A0A" : "#1C1917",
            border: `1px solid ${energy >= 7 && plaisir >= 7 ? "#10B981" : energy <= 3 ? "#EF4444" : "#374151"}`,
          }}>
            <div style={{ fontSize: "0.68rem", fontFamily: "monospace" }}>
              {energy >= 7 && plaisir >= 7 && joursEpuises < 1 ? <span style={{ color: "#10B981" }}>✓ Régime sain — continuer</span>
                : energy <= 4 || plaisir <= 4 ? <span style={{ color: "#EF4444" }}>⚠ Signal d'alerte — recalibrer</span>
                : <span style={{ color: "#F59E0B" }}>~ Surveiller</span>}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle accent="#8B5CF6">Banque d'avance</SectionTitle>
        <div style={{ fontSize: "0.65rem", color: "#6B7280", marginBottom: "0.75rem" }}>Cible : 3-4 chapitres au stade 4-5 non publiés</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "2rem", fontFamily: "Georgia, serif", color: derivedBank >= 3 ? "#10B981" : derivedBank >= 2 ? "#F59E0B" : "#EF4444", fontWeight: "bold" }}>{derivedBank}</div>
          <div style={{ fontSize: "0.7rem", color: "#6B7280" }}>chapitres prêts</div>
        </div>
        <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.75rem" }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} style={{ flex: 1, height: 8, borderRadius: 2, background: n <= derivedBank ? n <= 2 ? "#EF4444" : n <= 4 ? "#10B981" : "#F59E0B" : "#1F2937" }} />
          ))}
        </div>
        <div style={{ fontSize: "0.62rem", color: "#4B5563", lineHeight: 1.5 }}>
          <div>0-1 : zéro buffer, fragile</div>
          <div>2 : risque de mode panique</div>
          <div style={{ color: "#10B981" }}>3-4 : sain — un mois de respiration</div>
          <div>5+ : sur-production, publier</div>
        </div>
      </Card>

      <Card>
        <SectionTitle accent="#F97316">Vue synthétique</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          {[
            { label: "Tâches", value: `${doneTasks}/${allTasks.length}`, sub: "toutes phases", color: "#10B981" },
            { label: "Projets actifs", value: PROJECTS_INIT.filter(p => p.status === "active").length, sub: `sur ${PROJECTS_INIT.length} total`, color: "#E8C547" },
            { label: "Idées en pipeline", value: ideasCount, sub: "à trier", color: "#06B6D4" },
            { label: "Hooks transmédia", value: hooksCount, sub: "amplifiables", color: "#F97316" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#070C16", borderRadius: 8, padding: "0.7rem", border: `1px solid ${s.color}22` }}>
              <div style={{ fontSize: "1.4rem", fontFamily: "Georgia, serif", color: s.color, fontWeight: "bold" }}>{s.value}</div>
              <div style={{ fontSize: "0.7rem", color: "#D1D5DB", marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: "0.6rem", color: "#4B5563" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle accent="#EC4899">Mode dégradé</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div onClick={() => setDegradedMode(null)} style={{ padding: "0.5rem 0.65rem", borderRadius: 6, cursor: "pointer", background: !degradedMode ? "#064E3B" : "#070C16", border: `1px solid ${!degradedMode ? "#10B981" : "#1F2937"}` }}>
            <div style={{ fontSize: "0.72rem", color: !degradedMode ? "#10B981" : "#9CA3AF" }}>✓ Régime normal</div>
          </div>
          {DEGRADED_MODES.map(m => (
            <div key={m.id} onClick={() => setDegradedMode(m.id)} style={{ padding: "0.5rem 0.65rem", borderRadius: 6, cursor: "pointer", background: degradedMode === m.id ? m.color + "22" : "#070C16", border: `1px solid ${degradedMode === m.id ? m.color : "#1F2937"}` }}>
              <div style={{ fontSize: "0.72rem", color: degradedMode === m.id ? m.color : "#9CA3AF" }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div onClick={() => setActiveView("garde-fous")} style={{ marginTop: "0.6rem", fontSize: "0.62rem", color: "#6B7280", cursor: "pointer", fontStyle: "italic", borderTop: "1px solid #1F2937", paddingTop: "0.5rem" }}>
          → Détails dans <span style={{ color: "#EC4899" }}>Garde-fous</span>
        </div>
      </Card>

      <Card style={{ gridColumn: "1 / 4", background: "linear-gradient(135deg, #0D1420, #1A0F2E)", border: "1px solid #374151" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: "2.5rem", fontFamily: "'DM Serif Display', Georgia, serif", color: "#E8C547" }}>"</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.95rem", fontFamily: "'DM Serif Display', Georgia, serif", color: "#E5E7EB", lineHeight: 1.4 }}>
              Tu n'optimises pas ton talent. Tu optimises ta capacité à continuer.
            </div>
            <div style={{ fontSize: "0.62rem", color: "#6B7280", marginTop: "0.35rem", fontFamily: "monospace", letterSpacing: "0.1em" }}>
              — PRINCIPE DIRECTEUR UNIQUE · MÉTHODE UNIFIÉE
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── TRIMESTRE VIEW (Couche 1) ──────────────────────────────────────────────
function TrimestreView({ quarter, setQuarter }) {
  const update = (k, v) => setQuarter(prev => ({ ...prev, [k]: v }));
  const updateAlloc = (k, v) => setQuarter(prev => ({ ...prev, allocation: { ...prev.allocation, [k]: v } }));
  const totalAlloc = Object.values(quarter.allocation).reduce((s, v) => s + v, 0);
  const inputStyle = { width: "100%", background: "#070C16", border: "1px solid #1F2937", borderRadius: 6, color: "#E5E7EB", padding: "0.6rem 0.75rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", outline: "none" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Card style={{ background: "linear-gradient(135deg, #0D1420, #1A0F2E)", border: "1px solid #374151" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#6B7280", letterSpacing: "0.2em", marginBottom: "0.25rem" }}>COUCHE 1 · STRATÉGIQUE · 90 MIN · UNE PAGE</div>
            <input value={quarter.q} onChange={e => update("q", e.target.value)} style={{ background: "transparent", border: "none", fontSize: "1.6rem", fontFamily: "'DM Serif Display', Georgia, serif", color: "#E8C547", outline: "none", width: 160 }} />
          </div>
          <div style={{ fontSize: "0.65rem", color: "#6B7280", fontFamily: "monospace" }}>Plan trimestriel d'une page</div>
        </div>
      </Card>

      <Card>
        <SectionTitle accent="#E8C547">PLP — Produit Livrable Primaire (1 phrase)</SectionTitle>
        <textarea value={quarter.plp} onChange={e => update("plp", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Card>
          <SectionTitle accent="#06B6D4">Arc narratif en cours</SectionTitle>
          <input value={quarter.arc} onChange={e => update("arc", e.target.value)} style={{ ...inputStyle, fontSize: "0.8rem", marginBottom: "0.5rem" }} />
          <div style={{ fontSize: "0.62rem", color: "#4B5563", marginBottom: "0.3rem", fontFamily: "monospace" }}>fin de l'arc :</div>
          <input value={quarter.arcEnd} onChange={e => update("arcEnd", e.target.value)} style={{ ...inputStyle, color: "#9CA3AF", fontSize: "0.75rem", fontStyle: "italic" }} />
        </Card>
        <Card>
          <SectionTitle accent="#F97316">Amplification de saison (0 ou 1)</SectionTitle>
          <textarea value={quarter.amplification} onChange={e => update("amplification", e.target.value)} rows={3} style={{ ...inputStyle, fontSize: "0.8rem", resize: "vertical" }} />
        </Card>
      </div>

      <Card>
        <SectionTitle accent="#E8C547">Allocation des anneaux (somme : {totalAlloc}%)</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.75rem" }}>
          {[
            { key: "centre", label: "Centre", color: "#E8C547" },
            { key: "ampli", label: "Amplifications", color: "#F97316" },
            { key: "collab", label: "Collaborations", color: "#06B6D4" },
            { key: "opt", label: "Optionalité", color: "#A78BFA" },
          ].map(r => (
            <div key={r.key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "0.7rem", color: r.color }}>{r.label}</span>
                <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: r.color }}>{quarter.allocation[r.key]}%</span>
              </div>
              <input type="range" min="0" max="100" value={quarter.allocation[r.key]} onChange={e => updateAlloc(r.key, Number(e.target.value))} style={{ width: "100%", accentColor: r.color }} />
            </div>
          ))}
        </div>
        {totalAlloc !== 100 && <div style={{ marginTop: "0.6rem", fontSize: "0.65rem", color: "#F59E0B", fontFamily: "monospace" }}>⚠ Ajuster — total doit faire 100% (actuellement {totalAlloc}%)</div>}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Card>
          <SectionTitle accent="#10B981">Outil focal du trimestre (1 seul)</SectionTitle>
          <textarea value={quarter.outilFocal} onChange={e => update("outilFocal", e.target.value)} rows={3} style={{ ...inputStyle, fontSize: "0.8rem", resize: "vertical" }} />
        </Card>
        <Card>
          <SectionTitle accent="#EF4444">Zones rouges anticipées</SectionTitle>
          <textarea value={quarter.zonesRouges} onChange={e => update("zonesRouges", e.target.value)} rows={3} style={{ ...inputStyle, fontSize: "0.8rem", resize: "vertical" }} />
        </Card>
      </div>

      <Card style={{ borderTop: "2px solid #E8C547" }}>
        <SectionTitle accent="#E8C547">Règle unique du trimestre</SectionTitle>
        <input value={quarter.regleUnique} onChange={e => update("regleUnique", e.target.value)} style={{ ...inputStyle, color: "#E8C547", fontSize: "1rem", fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic" }} />
        <div style={{ marginTop: "0.5rem", fontSize: "0.62rem", color: "#4B5563" }}>Une phrase qui protège. À afficher près de la station de travail.</div>
      </Card>
    </div>
  );
}

// ─── PIPELINE VIEW (Couche 2 + 3) ──────────────────────────────────────────
function PipelineView({ chapters, setChapters, selectedMT, setSelectedMT, currentEnergy, setCurrentEnergy }) {
  const [selectedCh, setSelectedCh] = useState(chapters[0]?.id);
  const chaptersInBank = chapters.filter(c => c.stage >= 4 && c.stage <= 5).length;
  const selected = chapters.find(c => c.id === selectedCh) || chapters[0];
  const currentStage = WORKFLOW_STAGES[selected.stage - 1];
  const advanceStage = chId => setChapters(prev => prev.map(c => c.id === chId ? { ...c, stage: Math.min(6, c.stage + 1), gates: new Array(WORKFLOW_STAGES[Math.min(5, c.stage)].gates.length).fill(false), lastUpdate: "à l'instant" } : c));
  const toggleGate = (chId, i) => setChapters(prev => prev.map(c => c.id === chId ? { ...c, gates: c.gates.map((g, j) => j === i ? !g : g) } : c));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card>
        <SectionTitle accent="#06B6D4">Couche 2 — Pipeline chapitres (6 étapes)</SectionTitle>
        <div style={{ display: "flex", gap: "0.35rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {WORKFLOW_STAGES.map(stage => {
            const here = chapters.filter(c => c.stage === stage.id);
            return (
              <div key={stage.id} style={{ minWidth: 130, flex: 1, background: "#070C16", borderRadius: 8, border: "1px solid #1F2937", padding: "0.6rem 0.55rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: "#1F2937", color: "#E8C547", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontFamily: "monospace", fontWeight: "bold" }}>{stage.id}</div>
                  <div style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{stage.label}</div>
                </div>
                <div style={{ fontSize: "0.58rem", color: "#4B5563", marginBottom: "0.5rem", fontFamily: "monospace" }}>{stage.when}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {here.map(ch => (
                    <div key={ch.id} onClick={() => setSelectedCh(ch.id)} style={{
                      padding: "0.35rem 0.45rem",
                      background: selectedCh === ch.id ? "#E8C54722" : "#0D1420",
                      border: `1px solid ${selectedCh === ch.id ? "#E8C547" : "#1F2937"}`,
                      borderRadius: 4, cursor: "pointer", fontSize: "0.68rem",
                      color: selectedCh === ch.id ? "#E8C547" : "#D1D5DB",
                    }}>{ch.title}</div>
                  ))}
                  {here.length === 0 && <div style={{ padding: "0.35rem", fontSize: "0.6rem", color: "#374151", fontStyle: "italic", textAlign: "center" }}>(vide)</div>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem", padding: "0.5rem 0.75rem", background: "#070C16", borderRadius: 6 }}>
          <div style={{ fontSize: "0.7rem", color: "#6B7280" }}>
            Banque d'avance : <span style={{ color: chaptersInBank >= 3 ? "#10B981" : "#F59E0B", fontFamily: "monospace" }}>{chaptersInBank} chapitres</span> au stade 4-5
          </div>
          <div style={{ fontSize: "0.65rem", color: "#4B5563", fontFamily: "monospace" }}>
            {chaptersInBank >= 3 ? "✓ SAIN" : chaptersInBank >= 2 ? "~ FRAGILE" : "⚠ CRITIQUE"}
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
        <Card>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.65rem", color: "#4B5563", fontFamily: "monospace", letterSpacing: "0.1em" }}>CHAPITRE · étape {selected.stage}/6 · {selected.lastUpdate}</div>
            <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.4rem", color: "#E8C547" }}>{selected.title}</div>
            <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.2rem" }}>{currentStage.fullName}</div>
          </div>

          {selected.hook && (
            <div style={{ marginBottom: "1rem", padding: "0.5rem 0.75rem", background: "#1A0F2E", borderLeft: "2px solid #F97316", borderRadius: "0 6px 6px 0" }}>
              <div style={{ fontSize: "0.6rem", color: "#F97316", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "0.15rem" }}>HOOK TRANSMÉDIA</div>
              <div style={{ fontSize: "0.72rem", color: "#D1D5DB", fontStyle: "italic" }}>{selected.hook}</div>
            </div>
          )}

          <div style={{ marginBottom: "1rem", padding: "0.5rem 0.75rem", background: "#1C1917", borderLeft: "2px solid #EF4444", borderRadius: "0 6px 6px 0" }}>
            <div style={{ fontSize: "0.6rem", color: "#EF4444", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "0.15rem" }}>RÈGLE DURE</div>
            <div style={{ fontSize: "0.75rem", color: "#D1D5DB", fontStyle: "italic" }}>{currentStage.rule}</div>
          </div>

          <div style={{ fontSize: "0.65rem", color: "#4B5563", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>QUALITY GATES — étape {selected.stage}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {currentStage.gates.map((gate, i) => (
              <div key={i} onClick={() => toggleGate(selected.id, i)} style={{
                display: "flex", alignItems: "flex-start", gap: "0.6rem",
                padding: "0.55rem 0.7rem", borderRadius: 6, cursor: "pointer",
                background: selected.gates[i] ? "#06B6D411" : "#070C16",
                border: `1px solid ${selected.gates[i] ? "#06B6D444" : "#1F2937"}`,
              }}>
                <div style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0, marginTop: 1, background: selected.gates[i] ? "#06B6D4" : "transparent", border: `1.5px solid ${selected.gates[i] ? "#06B6D4" : "#374151"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selected.gates[i] && <span style={{ color: "#000", fontSize: "0.55rem", fontWeight: "bold" }}>✓</span>}
                </div>
                <span style={{ fontSize: "0.75rem", color: selected.gates[i] ? "#6B7280" : "#D1D5DB", textDecoration: selected.gates[i] ? "line-through" : "none" }}>{gate}</span>
              </div>
            ))}
          </div>

          {selected.stage < 6 && (
            <button onClick={() => advanceStage(selected.id)} disabled={!selected.gates.every(g => g)} style={{
              marginTop: "1rem", width: "100%",
              background: selected.gates.every(g => g) ? "#E8C547" : "#1F2937",
              border: "none", color: selected.gates.every(g => g) ? "#000" : "#4B5563",
              padding: "0.7rem", borderRadius: 6, fontSize: "0.75rem",
              fontFamily: "monospace", letterSpacing: "0.1em",
              cursor: selected.gates.every(g => g) ? "pointer" : "not-allowed",
            }}>
              {selected.gates.every(g => g) ? `→ PASSER À L'ÉTAPE ${selected.stage + 1}` : `⌧ Cocher toutes les gates pour avancer`}
            </button>
          )}
        </Card>

        <Card>
          <SectionTitle accent="#EC4899">Couche 3 — Mode de travail</SectionTitle>
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <span style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>Énergie réelle maintenant</span>
              <span style={{ fontSize: "0.7rem", color: "#EC4899", fontFamily: "monospace" }}>{currentEnergy}/5</span>
            </div>
            <input type="range" min="1" max="5" value={currentEnergy} onChange={e => setCurrentEnergy(Number(e.target.value))} style={{ width: "100%", accentColor: "#EC4899" }} />
          </div>
          <div style={{ fontSize: "0.6rem", color: "#4B5563", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>MT COMPATIBLES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {MODES_TRAVAIL.map(mt => {
              const ok = mt.energy <= currentEnergy;
              return (
                <div key={mt.id} onClick={() => ok && setSelectedMT(mt.id)} style={{
                  padding: "0.5rem 0.6rem", borderRadius: 6,
                  background: selectedMT === mt.id ? mt.color + "22" : ok ? "#070C16" : "#070C1655",
                  border: `1px solid ${selectedMT === mt.id ? mt.color : ok ? "#1F2937" : "#111827"}`,
                  cursor: ok ? "pointer" : "not-allowed", opacity: ok ? 1 : 0.4,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ fontSize: "0.6rem", fontFamily: "monospace", color: mt.color, padding: "1px 4px", background: mt.color + "22", borderRadius: 3 }}>{mt.id}</span>
                      <span style={{ fontSize: "0.72rem", color: "#E5E7EB" }}>{mt.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: "1px" }}>
                      {[1, 2, 3, 4, 5].map(n => <div key={n} style={{ width: 3, height: 8, background: n <= mt.energy ? mt.color : "#1F2937", borderRadius: 1 }} />)}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.6rem", color: "#4B5563", marginTop: "0.2rem" }}>{mt.desc}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── IDÉES VIEW ────────────────────────────────────────────────────────────
function IdeasView({ ideas, setIdeas }) {
  const [newIdea, setNewIdea] = useState("");
  const [filter, setFilter] = useState("all");
  const STATUS_IDEA = {
    collected: { label: "Collectée", color: "#06B6D4", desc: "à trier dimanche" },
    active: { label: "Projet actif", color: "#10B981", desc: "ajoutée au backlog" },
    germ: { label: "Germe de projet", color: "#F59E0B", desc: "futur projet potentiel" },
    archived: { label: "Dort", color: "#6B7280", desc: "archivée sans tristesse" },
  };
  const addIdea = () => {
    if (!newIdea.trim()) return;
    setIdeas(prev => [{ id: `i${Date.now()}`, text: newIdea.trim(), status: "collected", date: new Date().toISOString().slice(0, 10), repetitions: 1 }, ...prev]);
    setNewIdea("");
  };
  const updateStatus = (id, status) => setIdeas(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  const removeIdea = id => setIdeas(prev => prev.filter(i => i.id !== id));
  const incRep = id => setIdeas(prev => prev.map(i => i.id === id ? { ...i, repetitions: (i.repetitions || 1) + 1 } : i));
  const filtered = filter === "all" ? ideas : ideas.filter(i => i.status === filter);
  const byStatus = Object.fromEntries(Object.keys(STATUS_IDEA).map(k => [k, ideas.filter(i => i.status === k).length]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card>
        <SectionTitle accent="#06B6D4">Pipeline d'idéation — collecte → tri → sélection</SectionTitle>
        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginBottom: "0.75rem", lineHeight: 1.5 }}>
          Capture libre, sans filtre. Tri hebdomadaire (15 min, dimanche). Sélection trimestrielle au démarrage d'un arc.
          <br />
          <span style={{ fontStyle: "italic", color: "#4B5563" }}>« Une idée non sélectionnée n'est pas perdue. Elle dort. La répétition spontanée signale sa force, pas son ancienneté. »</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input value={newIdea} onChange={e => setNewIdea(e.target.value)} onKeyDown={e => e.key === "Enter" && addIdea()} placeholder="Capture rapide d'une idée..."
            style={{ flex: 1, background: "#070C16", border: "1px solid #1F2937", borderRadius: 6, color: "#E5E7EB", padding: "0.6rem 0.75rem", fontSize: "0.85rem", outline: "none" }} />
          <button onClick={addIdea} style={{ background: "#06B6D4", border: "none", color: "#000", padding: "0 1rem", borderRadius: 6, fontSize: "0.75rem", fontFamily: "monospace", letterSpacing: "0.1em", cursor: "pointer" }}>+ AJOUTER</button>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
        {Object.entries(STATUS_IDEA).map(([key, v]) => (
          <div key={key} onClick={() => setFilter(filter === key ? "all" : key)} style={{
            cursor: "pointer", padding: "0.85rem 1rem",
            background: filter === key ? v.color + "22" : "#0D1420",
            border: `1px solid ${filter === key ? v.color : "#1F2937"}`, borderRadius: 8,
          }}>
            <div style={{ fontSize: "1.5rem", fontFamily: "Georgia, serif", color: v.color, fontWeight: "bold" }}>{byStatus[key]}</div>
            <div style={{ fontSize: "0.72rem", color: "#D1D5DB", marginTop: 2 }}>{v.label}</div>
            <div style={{ fontSize: "0.6rem", color: "#4B5563" }}>{v.desc}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "#4B5563", fontSize: "0.8rem", fontStyle: "italic" }}>
              {filter === "all" ? "Aucune idée capturée. Ajoute-en une au-dessus." : "Aucune idée dans cet état."}
            </div>
          )}
          {filtered.map(idea => {
            const st = STATUS_IDEA[idea.status];
            return (
              <div key={idea.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.85rem", background: "#070C16", borderRadius: 6, border: "1px solid #1F2937", borderLeft: `3px solid ${st.color}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.78rem", color: "#E5E7EB" }}>{idea.text}</div>
                  <div style={{ fontSize: "0.6rem", color: "#4B5563", marginTop: "0.15rem", display: "flex", gap: "0.6rem" }}>
                    <span>{idea.date}</span>
                    {idea.repetitions > 1 && <span style={{ color: "#F59E0B" }}>× {idea.repetitions} répétitions</span>}
                  </div>
                </div>
                <button onClick={() => incRep(idea.id)} title="Cette idée est revenue" style={{ background: "#1F2937", border: "none", color: "#F59E0B", padding: "0.25rem 0.5rem", borderRadius: 4, fontSize: "0.65rem", cursor: "pointer", fontFamily: "monospace" }}>↻</button>
                <select value={idea.status} onChange={e => updateStatus(idea.id, e.target.value)} style={{ background: "#070C16", border: `1px solid ${st.color}44`, color: st.color, fontSize: "0.65rem", padding: "0.3rem 0.4rem", borderRadius: 4, fontFamily: "monospace", cursor: "pointer", outline: "none" }}>
                  {Object.entries(STATUS_IDEA).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <button onClick={() => removeIdea(idea.id)} style={{ background: "transparent", border: "none", color: "#4B5563", cursor: "pointer", fontSize: "0.85rem" }}>×</button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── TRANSMÉDIA VIEW ───────────────────────────────────────────────────────
function TransmediaView({ chapters }) {
  const isAmpl = h => h && h.trim() && !h.toLowerCase().includes("rien ici") && !h.toLowerCase().includes("ne pas amplifier");
  const hooks = chapters.filter(c => isAmpl(c.hook));
  const noAmp = chapters.filter(c => c.hook && !isAmpl(c.hook));
  const noHook = chapters.filter(c => !c.hook || !c.hook.trim());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card>
        <SectionTitle accent="#F97316">Pipeline transmédia — chapitre → amplification</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "0.5rem" }}>
          {[
            { label: "Hook consigné", desc: "À l'étape 1 du chapitre — une ligne dans le noyau narratif", n: 1, color: "#06B6D4" },
            { label: "Recensement trimestriel", desc: "Liste des hooks relue en couche 1 — quel hook est porteur ?", n: 2, color: "#10B981" },
            { label: "Décision : 0 ou 1", desc: "Une seule amplification par trimestre, jamais plus", n: 3, color: "#F59E0B" },
            { label: "Exécution dans Anneau 1", desc: "Consomme le temps de l'anneau 1 (jamais le centre)", n: 4, color: "#F97316" },
          ].map(s => (
            <div key={s.n} style={{ padding: "0.85rem", background: "#070C16", borderRadius: 8, border: `1px solid ${s.color}22` }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: s.color + "22", color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "0.65rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{s.n}</div>
              <div style={{ fontSize: "0.75rem", color: s.color, marginBottom: "0.25rem" }}>{s.label}</div>
              <div style={{ fontSize: "0.62rem", color: "#6B7280", lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: "0.65rem", color: "#4B5563", fontStyle: "italic", padding: "0.5rem 0.75rem", background: "#1A0F2E", borderRadius: 6, borderLeft: "2px solid #F97316" }}>
          Règle X — l'amplification audiovisuelle <strong style={{ color: "#F97316" }}>sort</strong> du chapitre, jamais l'inverse. La décision se prend en couche 1 (trimestrielle), pas dans l'enthousiasme du chapitre.
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Card>
          <SectionTitle accent="#10B981">Hooks amplifiables</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {hooks.length === 0 && <div style={{ padding: "1rem", textAlign: "center", color: "#4B5563", fontSize: "0.75rem", fontStyle: "italic" }}>Aucun hook consigné.</div>}
            {hooks.map(ch => (
              <div key={ch.id} style={{ padding: "0.65rem 0.85rem", background: "#070C16", borderRadius: 6, border: "1px solid #1F2937", borderLeft: "3px solid #10B981" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#E8C547", fontFamily: "'DM Serif Display', Georgia, serif" }}>{ch.title}</span>
                  <span style={{ fontSize: "0.6rem", color: "#4B5563", fontFamily: "monospace" }}>étape {ch.stage}/6</span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "#9CA3AF", fontStyle: "italic", lineHeight: 1.5 }}>{ch.hook}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle accent="#6B7280">Sans amplification</SectionTitle>
          <div style={{ fontSize: "0.65rem", color: "#4B5563", marginBottom: "0.65rem", lineHeight: 1.5 }}>Aucune frustration. Le chapitre reste capital pour lui-même.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {noAmp.map(ch => (
              <div key={ch.id} style={{ padding: "0.6rem 0.85rem", background: "#070C16", borderRadius: 6, border: "1px solid #1F2937", borderLeft: "3px solid #6B7280", opacity: 0.7 }}>
                <div style={{ fontSize: "0.72rem", color: "#9CA3AF", fontFamily: "'DM Serif Display', Georgia, serif" }}>{ch.title}</div>
                <div style={{ fontSize: "0.65rem", color: "#4B5563", fontStyle: "italic" }}>{ch.hook}</div>
              </div>
            ))}
            {noHook.map(ch => (
              <div key={ch.id} style={{ padding: "0.6rem 0.85rem", background: "#070C16", borderRadius: 6, border: "1px dashed #1F2937", opacity: 0.5 }}>
                <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>{ch.title}</div>
                <div style={{ fontSize: "0.6rem", color: "#374151", fontStyle: "italic" }}>Hook non consigné</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── PHASES VIEW ────────────────────────────────────────────────────────────
function PhasesView({ tasks, setTasks }) {
  const [openPhase, setOpenPhase] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {PHASES.map(phase => {
        const phaseTasks = phase.tasks.map(t => ({ ...t, done: tasks[t.id] ?? t.done }));
        const done = phaseTasks.filter(t => t.done).length;
        const pct = Math.round((done / phaseTasks.length) * 100);
        const isOpen = openPhase === phase.id;
        return (
          <div key={phase.id} style={{ background: "#0D1420", border: `1px solid ${isOpen ? phase.accent + "44" : "#1F2937"}`, borderRadius: 10, overflow: "hidden" }}>
            <div onClick={() => setOpenPhase(isOpen ? -1 : phase.id)} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", cursor: "pointer" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: phase.accent + "22", border: `1px solid ${phase.accent}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: phase.accent }}>{phase.id}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                  <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1rem", color: phase.accent }}>{phase.name}</span>
                  <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#4B5563" }}>{phase.months}</span>
                </div>
                <div style={{ marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}><ProgressBar value={pct} color={phase.accent} height={3} /></div>
                  <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: phase.accent }}>{done}/{phaseTasks.length}</span>
                </div>
              </div>
              <span style={{ color: "#374151", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</span>
            </div>
            {isOpen && (
              <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ height: 1, background: "#1F2937", marginBottom: "0.5rem" }} />
                {phaseTasks.map(task => (
                  <div key={task.id} onClick={() => setTasks(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
                    style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.6rem 0.75rem", borderRadius: 7, cursor: "pointer", background: task.done ? phase.accent + "11" : "#070C16", border: `1px solid ${task.done ? phase.accent + "33" : "#1F2937"}` }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1, background: task.done ? phase.accent : "transparent", border: `1.5px solid ${task.done ? phase.accent : "#374151"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {task.done && <span style={{ color: "#000", fontSize: "0.6rem", fontWeight: "bold" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "0.78rem", color: task.done ? "#6B7280" : "#D1D5DB", textDecoration: task.done ? "line-through" : "none" }}>{task.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PROJECTS VIEW ──────────────────────────────────────────────────────────
function ProjectsView() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? PROJECTS_INIT : PROJECTS_INIT.filter(p => p.ring === filter || p.status === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {[{ id: "all", label: "Tous" }, ...RINGS.map(r => ({ id: r.id, label: r.label })), { id: "active", label: "En cours" }, { id: "backlog", label: "Backlog" }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ background: filter === f.id ? "#1F2937" : "transparent", border: `1px solid ${filter === f.id ? "#374151" : "#1F2937"}`, color: filter === f.id ? "#E5E7EB" : "#6B7280", padding: "0.3rem 0.7rem", borderRadius: 6, fontSize: "0.72rem", cursor: "pointer", fontFamily: "monospace" }}>{f.label}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
        {filtered.map(proj => {
          const ring = RINGS.find(r => r.id === proj.ring);
          const phase = PHASES.find(p => p.id === proj.phase);
          const st = STATUS_MAP[proj.status];
          const pr = PRIORITY_MAP[proj.priority];
          return (
            <div key={proj.id} style={{ background: "#0D1420", border: "1px solid #1F2937", borderRadius: 10, padding: "1.1rem", borderTop: `2px solid ${ring?.color || "#374151"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ fontSize: "0.88rem", color: "#E5E7EB", marginBottom: "0.25rem" }}>{proj.name}</div>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.6rem", fontFamily: "monospace", background: ring?.color + "22", color: ring?.color, padding: "1px 5px", borderRadius: 3 }}>{ring?.label}</span>
                    <span style={{ fontSize: "0.6rem", fontFamily: "monospace", background: phase?.accent + "22", color: phase?.accent, padding: "1px 5px", borderRadius: 3 }}>{phase?.label}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.62rem", fontFamily: "monospace", background: st.bg, color: st.color, padding: "2px 6px", borderRadius: 4 }}>{st.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: pr.dot }} />
                    <span style={{ fontSize: "0.58rem", color: "#4B5563" }}>{pr.label}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.65rem", color: "#4B5563", fontFamily: "monospace" }}>progression</span>
                  <span style={{ fontSize: "0.65rem", color: ring?.color, fontFamily: "monospace" }}>{proj.progress}%</span>
                </div>
                <ProgressBar value={proj.progress} color={ring?.color || "#E8C547"} height={4} />
              </div>
              <div style={{ fontSize: "0.68rem", color: "#6B7280", borderTop: "1px solid #1F2937", paddingTop: "0.6rem", lineHeight: 1.5 }}>{proj.note}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── KPIs VIEW ──────────────────────────────────────────────────────────────
function KPIsView({ kpiValues, setKpiValues, buildHoursUsed, setBuildHoursUsed }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Card>
        <SectionTitle accent="#E8C547">KPIs de croissance — cibles vs actuel</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Indicateur", "Actuel", "3 mois", "12 mois", "36 mois"].map((h, i) => (
                  <th key={i} style={{ padding: "0.5rem 0.75rem", textAlign: i === 0 ? "left" : "center", fontSize: "0.65rem", fontFamily: "monospace", letterSpacing: "0.1em", color: "#4B5563", borderBottom: "1px solid #1F2937" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KPIS.map((kpi, i) => {
                const val = kpiValues[kpi.label] ?? kpi.current;
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #111827" }}>
                    <td style={{ padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.9rem" }}>{kpi.icon}</span>
                      <span style={{ fontSize: "0.75rem", color: "#D1D5DB" }}>{kpi.label}</span>
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>
                      <input type="number" value={val} onChange={e => setKpiValues(prev => ({ ...prev, [kpi.label]: Number(e.target.value) }))} style={{ background: "#070C16", border: "1px solid #374151", color: "#E8C547", fontFamily: "monospace", fontSize: "0.8rem", padding: "0.2rem 0.4rem", borderRadius: 4, width: 70, textAlign: "center" }} />
                      <span style={{ fontSize: "0.65rem", color: "#4B5563", marginLeft: "0.2rem" }}>{kpi.unit}</span>
                    </td>
                    {[kpi.target3m, kpi.target12m, kpi.target36m].map((t, j) => (
                      <td key={j} style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontFamily: "monospace", color: "#6B7280" }}>{t}{kpi.unit}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle accent="#10B981">Build budget — heures dev/an (anti-cannibalisation)</SectionTitle>
        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginBottom: "1rem", lineHeight: 1.5 }}>
          Tu construis des outils <strong style={{ color: "#E5E7EB" }}>parce que</strong> tu publies, pas <strong style={{ color: "#E5E7EB" }}>avant de</strong> publier. Chaque construction = un besoin concret documenté + un bornage en heures.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
          {BUILD_BUDGETS.map((b, i) => {
            const used = buildHoursUsed[b.phase] || 0;
            const pct = (used / b.maxHours) * 100;
            const overrun = used > b.maxHours;
            return (
              <div key={i} style={{ padding: "1rem", background: "#070C16", borderRadius: 8, border: `1px solid ${overrun ? "#EF4444" : b.color + "33"}` }}>
                <div style={{ fontSize: "0.7rem", color: b.color, fontFamily: "monospace", marginBottom: "0.25rem" }}>{b.phase}</div>
                <div style={{ fontSize: "0.6rem", color: "#4B5563", marginBottom: "0.65rem" }}>{b.months}</div>
                <div style={{ fontSize: "1.5rem", fontFamily: "Georgia, serif", color: overrun ? "#EF4444" : b.color, fontWeight: "bold" }}>
                  {used}<span style={{ fontSize: "0.85rem", color: "#4B5563" }}>/{b.maxHours}h</span>
                </div>
                <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                  <ProgressBar value={Math.min(pct, 100)} color={overrun ? "#EF4444" : b.color} height={3} />
                </div>
                <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                  <input type="number" value={used} onChange={e => setBuildHoursUsed(prev => ({ ...prev, [b.phase]: Number(e.target.value) }))} style={{ flex: 1, background: "#0D1420", border: "1px solid #1F2937", color: b.color, fontFamily: "monospace", fontSize: "0.75rem", padding: "0.25rem 0.4rem", borderRadius: 4, outline: "none" }} />
                  <span style={{ fontSize: "0.6rem", color: "#4B5563" }}>h utilisées</span>
                </div>
                {overrun && <div style={{ marginTop: "0.5rem", fontSize: "0.6rem", color: "#EF4444", fontFamily: "monospace" }}>⚠ Budget dépassé — STOP</div>}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <SectionTitle accent="#EF4444">Points de non-retour</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
          {[
            { label: "Premier crowdfunding", color: "#F59E0B", conditions: ["500+ abonnés", "5%+ payants", "Cadence prouvée 8 mois"] },
            { label: "Projet-signature long", color: "#06B6D4", conditions: ["Univers établi publiquement", "Communauté engagée", "Aucune fatigue cumulée"] },
            { label: "Recomposition pro", color: "#8B5CF6", conditions: ["Tous indicateurs au vert", "12 mois consécutifs", "Scénario d'optionalité choisi"] },
          ].map((gate, i) => (
            <div key={i} style={{ padding: "1rem", background: "#070C16", borderRadius: 8, border: `1px solid ${gate.color}33` }}>
              <div style={{ fontSize: "0.75rem", color: gate.color, marginBottom: "0.75rem", fontFamily: "'DM Serif Display', Georgia, serif" }}>{gate.label}</div>
              {gate.conditions.map((c, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", fontSize: "0.68rem", color: "#6B7280", marginBottom: "0.35rem" }}>
                  <span style={{ color: gate.color, flexShrink: 0, marginTop: 1 }}>○</span>{c}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle accent="#A78BFA">Scénarios d'optionalité — horizon 36-60 mois</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {[
            { label: "A — Hybride permanent", desc: "Ingénieur·e + auteur·e, sans urgence. Le plus fréquent chez les auteur·es durables.", color: "#6B7280" },
            { label: "B — Recomposition partielle", desc: "Passe à 4j/semaine. Une journée créative gagnée sans quitter le salariat.", color: "#06B6D4" },
            { label: "C — Indépendance hybride", desc: "Consulting tech à tarif élevé (150-200h/an) + création principale.", color: "#F59E0B" },
            { label: "D — Bascule intégrale", desc: "Seuil requis : 6 000 €+/mois stables, ou avance éditeur, ou audience massive.", color: "#A78BFA" },
          ].map((sc, i) => (
            <div key={i} style={{ padding: "0.85rem 1rem", background: "#070C16", borderRadius: 8, borderLeft: `2px solid ${sc.color}` }}>
              <div style={{ fontSize: "0.75rem", color: sc.color, marginBottom: "0.4rem", fontFamily: "monospace" }}>{sc.label}</div>
              <div style={{ fontSize: "0.7rem", color: "#6B7280", lineHeight: 1.5 }}>{sc.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#070C16", borderRadius: 8, border: "1px solid #374151", fontSize: "0.72rem", color: "#6B7280", lineHeight: 1.6 }}>
          <span style={{ color: "#A78BFA", fontFamily: "monospace" }}>→ Règle :</span> Garder les quatre scénarios ouverts. Prendre la décision seulement quand les signaux sont clairs — pas par anticipation. Le travail des 36 mois est de <span style={{ color: "#E5E7EB" }}>construire l'optionalité</span>, pas de choisir prématurément.
        </div>
      </Card>
    </div>
  );
}

// ─── GARDE-FOUS VIEW ───────────────────────────────────────────────────────
function GardeFousView({ degradedMode, setDegradedMode, collabAnswers, setCollabAnswers }) {
  const negativeOrFlou = Object.values(collabAnswers).filter(v => v === "no" || v === "flou").length;
  const verdict = negativeOrFlou >= 3 ? "REFUSER" : negativeOrFlou >= 1 ? "VIGILANCE" : "OK";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Card>
        <SectionTitle accent="#EC4899">Modes dégradés — à activer sans culpabilité</SectionTitle>
        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginBottom: "1rem", lineHeight: 1.5 }}>
          La banque d'avance et la non-compensation sont les deux outils qui te permettent d'absorber sans casser le système.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {DEGRADED_MODES.map(m => (
            <div key={m.id} onClick={() => setDegradedMode(degradedMode === m.id ? null : m.id)} style={{
              padding: "1rem", background: "#070C16", borderRadius: 8, cursor: "pointer",
              border: `1px solid ${degradedMode === m.id ? m.color : "#1F2937"}`,
              boxShadow: degradedMode === m.id ? `0 0 14px ${m.color}33` : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.85rem", color: m.color, fontFamily: "'DM Serif Display', Georgia, serif" }}>{m.label}</div>
                {degradedMode === m.id && <span style={{ fontSize: "0.55rem", fontFamily: "monospace", background: m.color, color: "#000", padding: "1px 6px", borderRadius: 3, letterSpacing: "0.05em" }}>ACTIF</span>}
              </div>
              <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginBottom: "0.6rem", fontStyle: "italic" }}>
                <strong style={{ color: "#6B7280", fontStyle: "normal" }}>Déclencheur :</strong> {m.trigger}
              </div>
              <div style={{ fontSize: "0.62rem", color: "#4B5563", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>RÈGLES</div>
              {m.rules.map((r, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", fontSize: "0.68rem", color: "#9CA3AF", marginBottom: "0.25rem", lineHeight: 1.5 }}>
                  <span style={{ color: m.color, flexShrink: 0, marginTop: 1 }}>•</span>{r}
                </div>
              ))}
              <div style={{ marginTop: "0.6rem", padding: "0.4rem 0.6rem", background: "#1C1917", borderRadius: 4, fontSize: "0.6rem", color: "#6B7280", fontStyle: "italic", lineHeight: 1.5 }}>
                <strong style={{ color: "#9CA3AF", fontStyle: "normal" }}>Sortie :</strong> {m.exit}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle accent="#06B6D4">Checklist collaboration — avant tout engagement</SectionTitle>
        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginBottom: "1rem", lineHeight: 1.5 }}>
          Cinq minutes honnêtes. Si <strong style={{ color: "#EF4444" }}>3 ou plus</strong> sont négatifs ou flous : refuser ou convertir en B2B facturé.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {COLLAB_CHECKLIST.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.85rem", background: "#070C16", borderRadius: 6, border: "1px solid #1F2937" }}>
              <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#06B6D4", minWidth: 80 }}>{item.q}</span>
              <span style={{ fontSize: "0.7rem", color: "#9CA3AF", flex: 1 }}>{item.text}</span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {[
                  { v: "yes", label: "Oui", color: "#10B981" },
                  { v: "flou", label: "Flou", color: "#F59E0B" },
                  { v: "no", label: "Non", color: "#EF4444" },
                ].map(opt => (
                  <button key={opt.v} onClick={() => setCollabAnswers(prev => ({ ...prev, [item.q]: prev[item.q] === opt.v ? null : opt.v }))} style={{
                    background: collabAnswers[item.q] === opt.v ? opt.color : "#1F2937",
                    color: collabAnswers[item.q] === opt.v ? "#000" : opt.color,
                    border: "none", padding: "0.25rem 0.55rem", borderRadius: 4, fontSize: "0.6rem", fontFamily: "monospace", cursor: "pointer", letterSpacing: "0.05em",
                  }}>{opt.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: 8,
          background: verdict === "REFUSER" ? "#450A0A" : verdict === "VIGILANCE" ? "#451A03" : "#064E3B",
          border: `1px solid ${verdict === "REFUSER" ? "#EF4444" : verdict === "VIGILANCE" ? "#F59E0B" : "#10B981"}`,
          textAlign: "center",
        }}>
          <div style={{ fontSize: "0.7rem", fontFamily: "monospace", letterSpacing: "0.1em",
            color: verdict === "REFUSER" ? "#EF4444" : verdict === "VIGILANCE" ? "#F59E0B" : "#10B981" }}>
            {negativeOrFlou} négatifs/flous · {verdict === "REFUSER" ? "REFUSER OU FACTURER B2B" : verdict === "VIGILANCE" ? "VIGILANCE — SE POSER" : "✓ FEU VERT"}
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Card>
          <SectionTitle accent="#E8C547">Les 10 principes fondateurs</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {TEN_PRINCIPLES.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: "0.65rem", padding: "0.5rem 0.65rem", background: "#070C16", borderRadius: 5, border: "1px solid #1F2937" }}>
                <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#E8C547", minWidth: 18, textAlign: "right" }}>{["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][i]}</span>
                <span style={{ fontSize: "0.7rem", color: "#D1D5DB", lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle accent="#EF4444">Les 10 pièges à surveiller</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {TEN_TRAPS.map((t, i) => (
              <div key={i} style={{ padding: "0.5rem 0.65rem", background: "#070C16", borderRadius: 5, border: "1px solid #1F2937", borderLeft: "2px solid #EF4444" }}>
                <div style={{ fontSize: "0.7rem", color: "#EF4444", marginBottom: "0.15rem" }}>
                  <span style={{ fontFamily: "monospace", marginRight: "0.4rem", color: "#7F1D1D" }}>{i + 1}.</span>{t.label}
                </div>
                <div style={{ fontSize: "0.62rem", color: "#6B7280", paddingLeft: "1.4rem", fontStyle: "italic", lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ background: "linear-gradient(135deg, #0D1420, #1A0F2E)", border: "1px solid #374151" }}>
        <SectionTitle accent="#EC4899">Règles IA — seconde tête, jamais seconde main</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#10B981", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>✓ AUTORISÉ</div>
            {["Drafts d'emails opérationnels", "Synthèses longs documents", "Veille subventions", "Analyses comparatives", "Modélisations économiques", "Préparation pitchs", "Reformulations multi-plateformes"].map(t => (
              <div key={t} style={{ fontSize: "0.68rem", color: "#9CA3AF", marginBottom: "0.25rem", display: "flex", gap: "0.4rem" }}>
                <span style={{ color: "#10B981" }}>·</span>{t}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#EF4444", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>✗ JAMAIS</div>
            {["Le dessin (planches, illustrations)", "La narration (arcs, dialogues publiables)", "La voix publique (manifestes, newsletters d'auteur·e)", "Les décisions stratégiques de fond"].map(t => (
              <div key={t} style={{ fontSize: "0.68rem", color: "#9CA3AF", marginBottom: "0.25rem", display: "flex", gap: "0.4rem" }}>
                <span style={{ color: "#EF4444" }}>·</span>{t}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [tasks, setTasks] = usePersistedState("stratex:tasks", {});
  const [energy, setEnergy] = usePersistedState("stratex:energy", 7);
  const [plaisir, setPlaisir] = usePersistedState("stratex:plaisir", 7);
  const [joursEpuises, setJoursEpuises] = usePersistedState("stratex:joursEpuises", 0);
  const [kpiValues, setKpiValues] = usePersistedState("stratex:kpiValues", {});
  const [chapters, setChapters] = usePersistedState("stratex:chapters", CHAPTERS_INIT);
  const [quarter, setQuarter] = usePersistedState("stratex:quarter", QUARTER_DEFAULT);
  const [ulWeek, setUlWeek] = usePersistedState("stratex:ulWeek", [3, 4, 2, 3]);
  const [selectedMT, setSelectedMT] = usePersistedState("stratex:selectedMT", null);
  const [currentEnergy, setCurrentEnergy] = usePersistedState("stratex:currentEnergy", 3);
  const [degradedMode, setDegradedMode] = usePersistedState("stratex:degradedMode", null);
  const [ideas, setIdeas] = usePersistedState("stratex:ideas", []);
  const [collabAnswers, setCollabAnswers] = usePersistedState("stratex:collabAnswers", {});
  const [buildHoursUsed, setBuildHoursUsed] = usePersistedState("stratex:buildHoursUsed", { "Phase 0-1": 0, "Phase 2": 0, "Phase 3": 0 });

  const derivedBank = chapters.filter(c => c.stage >= 4 && c.stage <= 5).length;
  const hooksCount = chapters.filter(c => c.hook && c.hook.trim() && !c.hook.toLowerCase().includes("rien ici") && !c.hook.toLowerCase().includes("ne pas amplifier")).length;
  const ideasCount = ideas.filter(i => i.status === "collected").length;

  return (
    <div style={{ minHeight: "100vh", background: "#070C16", color: "#E5E7EB", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #070C16; }
        ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 3px; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: #1F2937; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: currentColor; cursor: pointer; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        textarea, input { font-family: inherit; }
      `}</style>

      <TopBar activeView={activeView} setActiveView={setActiveView} degradedMode={degradedMode} />
      <PhaseBar />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 2rem" }}>
        {activeView === "dashboard" && (
          <DashboardView
            tasks={tasks}
            energy={energy} setEnergy={setEnergy}
            plaisir={plaisir} setPlaisir={setPlaisir}
            joursEpuises={joursEpuises} setJoursEpuises={setJoursEpuises}
            ulWeek={ulWeek} setUlWeek={setUlWeek}
            derivedBank={derivedBank}
            quarter={quarter}
            degradedMode={degradedMode} setDegradedMode={setDegradedMode}
            ideasCount={ideasCount} hooksCount={hooksCount}
            setActiveView={setActiveView}
          />
        )}
        {activeView === "trimestre" && <TrimestreView quarter={quarter} setQuarter={setQuarter} />}
        {activeView === "pipeline" && (
          <PipelineView
            chapters={chapters} setChapters={setChapters}
            selectedMT={selectedMT} setSelectedMT={setSelectedMT}
            currentEnergy={currentEnergy} setCurrentEnergy={setCurrentEnergy}
          />
        )}
        {activeView === "ideas" && <IdeasView ideas={ideas} setIdeas={setIdeas} />}
        {activeView === "transmedia" && <TransmediaView chapters={chapters} />}
        {activeView === "phases" && <PhasesView tasks={tasks} setTasks={setTasks} />}
        {activeView === "projects" && <ProjectsView />}
        {activeView === "kpis" && <KPIsView kpiValues={kpiValues} setKpiValues={setKpiValues} buildHoursUsed={buildHoursUsed} setBuildHoursUsed={setBuildHoursUsed} />}
        {activeView === "garde-fous" && <GardeFousView degradedMode={degradedMode} setDegradedMode={setDegradedMode} collabAnswers={collabAnswers} setCollabAnswers={setCollabAnswers} />}
      </main>
    </div>
  );
}
