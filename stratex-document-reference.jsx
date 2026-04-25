import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  bg: "#0a0c10",
  bgDeep: "#06080c",
  surface: "#141720",
  surfaceAlt: "#1a1e2a",
  surfaceHover: "#202535",
  border: "#252a38",
  borderLight: "#323849",
  gold: "#c9a84c",
  goldLight: "#e0c070",
  goldDim: "#8a6e30",
  goldGlow: "#c9a84c22",
  text: "#e8e4dc",
  textSoft: "#c4c0b5",
  textMuted: "#8a8fa8",
  textDim: "#555b70",
  textVeryDim: "#3a3f52",
  ivory: "#f4efe3",
  social: "#c9a84c",
  meta: "#9b6ec9",
  respiration: "#4caa7f",
  red: "#c94c5a",
  blue: "#4c7fc9",
};

const principles = [
  { i: "I", text: "Un projet avance par chapitres finis, pas par motivation." },
  { i: "II", text: "L'actif central est la liste email propriétaire." },
  { i: "III", text: "Mastery avant ambition." },
  { i: "IV", text: "La collaboration sert l'univers, sinon c'est de la prestation." },
  { i: "V", text: "Le temps de création propre est non-négociable." },
  { i: "VI", text: "La durabilité prime sur la cadence.", note: "Tu n'optimises pas ton talent. Tu optimises ta capacité à continuer." },
  { i: "VII", text: "Le salaire est un scaffolding, pas une prison." },
  { i: "VIII", text: "Utilise ton cerveau d'ingénieur·e là où il accélère — mais jamais il ne cannibalise l'artiste." },
  { i: "IX", text: "La BD est le tronc, tout le reste sont des branches." },
  { i: "X", text: "Le transmédia dérive du chapitre, jamais l'inverse." },
];

const projects = [
  {
    n: "01",
    title: "The Pimpologist",
    subtitle: "Le réveil de Pimpman",
    nature: "Conte moral urbain fantastique",
    veine: "social",
    veineLabel: "Morale sociale urbaine",
    maturation: "Haute",
    maturationLevel: 3,
    position: "Pivot court terme",
    horizon: "An 1–5",
    prémisse: "LUIS, petit dealer raté, pactise involontairement avec Mr Moula et reçoit des pouvoirs qui ne s'activent qu'en intention mauvaise.",
    question: "Peut-on faire le bien avec de mauvaises intentions ?",
    avantage: "Trait singulier, prémisse tenue, univers transmédia planifié (BD, motion comic, amplifications).",
    chantiers: [
      "Réécrire la bible (3–4 h)",
      "Densifier le script pilote (−30 à −40% de dialogues)",
      "Découper le pilote en 3 chapitres de feuilleton",
      "Décider la cadence (6–10 planches, bi-mensuelle à mensuelle)",
    ],
  },
  {
    n: "02",
    title: "La vie de ma mère",
    subtitle: "Court métrage",
    nature: "Drame social",
    veine: "social",
    veineLabel: "Morale sociale urbaine",
    maturation: "Moyenne",
    maturationLevel: 2,
    position: "Signature courte",
    horizon: "An 2–4",
    prémisse: "Tony braque une bijouterie pour financer les soins de sa mère. Juxtaposition systématique entre discours politique télévisé et réalité concrète silencieuse.",
    question: "Que fait la société à ceux qu'elle prétend défendre ?",
    avantage: "Sujet fort, ton juste, format court compatible festival d'auteur.",
    chantiers: [
      "Passe de densification sensorielle",
      "Individualiser les personnages secondaires",
      "Calibrer la variété des registres télévisuels",
      "Produire un animatique 3–5 min comme MVP",
    ],
  },
  {
    n: "03",
    title: "When I Get Free",
    subtitle: "Tragédie sociale",
    nature: "Récit long, structure miroir",
    veine: "social",
    veineLabel: "Morale sociale urbaine",
    maturation: "Basse",
    maturationLevel: 1,
    structureHaute: true,
    position: "Œuvre majeure primaire",
    horizon: "An 3–6",
    prémisse: "Adam (cadre banque CAC40) retrouve Youssouf (ami d'enfance trafiquant endeuillé) pendant le Covid. Ils s'associent. Fin tragique : Youssouf se sacrifie, lègue à Adam les moyens de sortir honnêtement.",
    question: "La légalité est-elle supérieure à la moralité ?",
    avantage: "Prémisse singulière. Ton profil d'ingénieur·e + ancrage quartier = position d'écriture rare.",
    chantiers: [
      "Figer le synopsis long en document de travail",
      "Laisser mûrir en carnet 18–24 mois",
      "Décider le format (roman graphique long privilégié)",
      "Ne pas écrire avant stabilisation de Pimpologist",
    ],
  },
  {
    n: "04",
    title: "Barzaq",
    subtitle: "Life after earth",
    nature: "SF métaphysique spirituelle",
    veine: "meta",
    veineLabel: "Métaphysique et civilisation",
    maturation: "Basse",
    maturationLevel: 1,
    position: "Œuvre majeure secondaire",
    horizon: "An 5–8",
    prémisse: "Adam milliardaire suicidaire et Sofia SDF embarquent dans la mission Embassy. En route, une entité leur révèle un checkpoint métaphysique. Paradoxe central : pour survivre il faut accepter de mourir.",
    question: "Si la vie après la mort existe, a-t-elle une localisation physique dans notre univers ?",
    avantage: "Territoire inoccupé — dialogue frontal avec la tradition islamique du Barzakh en SF francophone.",
    chantiers: [
      "Ajouter un doute à la cosmologie",
      "Approfondir Robert (rédemption ouverte)",
      "Renommer l'un des deux Adam (conflit avec When I Get Free)",
      "Nourrir un carnet Barzaq pendant 3–4 ans",
    ],
  },
  {
    n: "05",
    title: "Darkovsky",
    subtitle: "L'Étrange histoire de…",
    nature: "Conte fantastique sériel",
    veine: "social",
    veineLabel: "Morale (extension Pimpologist)",
    maturation: "Basse",
    maturationLevel: 1,
    position: "Projet soupape",
    horizon: "An 2–4 (intermittent)",
    prémisse: "Darkovsky a pactisé avec le Diable pour une vie éternelle qui ne l'est pas vraiment. Chaque épisode : une rencontre avec une victime qui tente de négocier. Trame : ses cas de conscience.",
    question: "Peut-on se racheter d'un pacte qu'on a soi-même signé ?",
    avantage: "Format léger, structure épisodique, possibilité d'univers partagé avec Pimpologist.",
    chantiers: [
      "Clarifier relation avec Pimpologist (clin d'œil ou univers assumé)",
      "Écrire 3–5 épisodes pilotes",
      "Définir format (BD courte ou série animée)",
    ],
  },
  {
    n: "06",
    title: "Endormis",
    subtitle: "Fable dialectique",
    nature: "Parabole IA à twist",
    veine: "meta",
    veineLabel: "Métaphysique et civilisation",
    maturation: "Basse",
    maturationLevel: 1,
    position: "Œuvre tardive (candidat)",
    horizon: "An 6–9",
    prémisse: "Deux enfants se réveillent aux abords d'une ville inconnue. Habdi devient guide spirituel, Drazak entre dans le système pour le changer de l'intérieur. Twist : ce sont deux IA d'un chercheur cherchant une boussole pour l'humanité.",
    question: "Quelle voie de transformation pour un monde en effondrement ?",
    avantage: "Dispositif narratif rare (twist reconfigurant), dialogue IA + spirituel.",
    chantiers: [
      "Incarner les deux enfants avant qu'ils soient des thèses",
      "Travailler le twist pour qu'il éclaire sans démentir",
      "Format : roman graphique long ou roman pur",
    ],
  },
  {
    n: "07",
    title: "COCORICO",
    subtitle: "Conte animalier",
    nature: "Fable familiale",
    veine: "respiration",
    veineLabel: "Respiration tendre",
    maturation: "Basse",
    maturationLevel: 1,
    position: "Projet de respiration flottant",
    horizon: "Flottant",
    prémisse: "Une famille de poulets séparée lors d'une vente de marché tente de se retrouver. Le chant du coq à l'aube est leur moyen de communication.",
    question: "Qu'est-ce qu'une famille sépare-t-elle vraiment, et comment se retrouve-t-elle ?",
    avantage: "Seul projet tout public familial. Ton tendre absent des autres projets. Potentiel jeunesse.",
    chantiers: [
      "Construire l'univers sérieux de la société des poulets",
      "Éviter l'anecdote, prendre les personnages au sérieux",
      "Format : album BD 48–64 pages ou série animée courte",
    ],
  },
  {
    n: "08",
    title: "FOLIE NATURELLE",
    subtitle: "Natural Intelligence",
    nature: "Comédie dystopique IA",
    veine: "meta",
    veineLabel: "Métaphysique et civilisation",
    maturation: "Basse",
    maturationLevel: 1,
    position: "Œuvre tardive (candidat)",
    horizon: "An 7–10",
    prémisse: "Dans un monde dominé par l'IA, un groupe de résistants retrouve le pouvoir humain dans la folie naturelle — l'imprévisibilité comme avantage évolutif. Registre : comédie absurde + humour noir + spiritualité résistante.",
    question: "Qu'est-ce qui en l'humain résiste à la prévisibilité algorithmique ?",
    avantage: "Déplacement conceptuel nouveau. Croisement comédie-dystopie-spiritualité rare.",
    chantiers: [
      "Développer les personnages au-delà du concept",
      "Travailler le registre mixte sur formats courts d'abord",
      "Format : scénario série ou roman graphique long",
    ],
  },
  {
    n: "09",
    title: "Simply 21",
    subtitle: "Simplement 21 Century",
    nature: "Fable post-apocalyptique",
    veine: "meta",
    veineLabel: "Métaphysique et civilisation",
    maturation: "Basse",
    maturationLevel: 1,
    position: "Œuvre de rupture tardive",
    horizon: "An 8–12",
    prémisse: "Après l'effondrement causé par la course à l'IA, les seul·es survivant·es sont les personnes atteintes de trisomie 21, vivant en petites communautés dans les ruines. Naît Elon, enfant « normal » — qui va mal tourner.",
    question: "Qu'est-ce qu'une société devient quand l'intelligence maximale se révèle son poison ?",
    avantage: "Renversement cognitif majeur. Critique frontale du solutionnisme. Univers Casa Mecanica / Casaroja partagé.",
    chantiers: [
      "Consultations éthiques préalables indispensables",
      "Incarnation des personnages villageois",
      "Format : roman graphique long, trait cartoon déformé approprié",
    ],
  },
];

const timelinePhases = [
  {
    label: "Phase 0",
    months: "M1–4",
    title: "Fondations",
    color: C.gold,
    items: [
      "Bible Pimpologist actualisée",
      "3 premiers chapitres en banque",
      "Infrastructure Substack + pipeline",
      "Carnets des projets dormants",
    ],
  },
  {
    label: "Phase 1",
    months: "M5–18",
    title: "Traction Pimpologist",
    color: C.gold,
    items: [
      "Publication bi-mensuelle à mensuelle",
      "Paliers payants ouverts M9–10",
      "1er crowdfunding M12–14",
      "Darkovsky en intermittence",
    ],
  },
  {
    label: "Phase 2",
    months: "M19–30",
    title: "Légitimité festival",
    color: C.blue,
    items: [
      "Animatique La vie de ma mère",
      "Dossiers CNC / DRAC / région",
      "Pimpologist 2e arc",
      "When I Get Free en préparation",
    ],
  },
  {
    label: "Phase 3",
    months: "M31–48",
    title: "Bascule œuvre majeure",
    color: C.meta,
    items: [
      "Décision Pimpologist ou When I Get Free",
      "Production LVDMM si financée",
      "Barzaq en carnet avancé",
      "Contacts éditeur·trice possibles",
    ],
  },
  {
    label: "Phase 4",
    months: "M49–72",
    title: "Consolidation auteur·e",
    color: C.meta,
    items: [
      "Finalisation When I Get Free",
      "LVDMM soumis festivals",
      "Barzaq en préparation active",
      "Rayonnement au-delà de Substack",
    ],
  },
  {
    label: "Phase 5",
    months: "M73–96",
    title: "Œuvre majeure secondaire",
    color: C.respiration,
    items: [
      "Barzaq en écriture active",
      "Pimpologist vers conclusion",
      "Endormis / Folie Naturelle en prép",
      "COCORICO possible en parallèle",
    ],
  },
  {
    label: "Phase 6",
    months: "M97–120",
    title: "Maturité et rupture",
    color: C.red,
    items: [
      "Une œuvre tardive (Endormis, FN, ou S21)",
      "Consultations éthiques si S21",
      "Révision complète de la stratégie",
      "Décisions d'optionalité pro",
    ],
  },
];

const sevenDays = [
  "Bloquer dans le calendrier le créneau sacré de création du week-end (4–6 h inamovibles)",
  "Réécrire la bible de Pimpologist en 3–4 h (style, Casaroja, frère Malcolm, acronyme P-I-M-P)",
  "Ouvrir un carnet par projet — même vide au départ",
  "Identifier 3 à 5 créateur·trices de l'écosystème à recontacter sans agenda",
  "Décider d'un trimestre Q1 de non-productivité apparente consacré aux fondations",
];

const sections = [
  { id: "preambule", label: "Préambule" },
  { id: "identite", label: "Identité" },
  { id: "principes", label: "Principes" },
  { id: "horizon", label: "Horizon 10 ans" },
  { id: "moyens", label: "Moyens" },
  { id: "methode", label: "Méthode" },
  { id: "projets", label: "Cartographie" },
  { id: "sequence", label: "Déploiement" },
  { id: "gardes", label: "Garde-fous" },
  { id: "jours", label: "7 jours" },
  { id: "synthese", label: "Synthèse" },
];

function VeineBadge({ veine, label }) {
  const color = veine === "social" ? C.gold : veine === "meta" ? C.meta : C.respiration;
  return (
    <div className="inline-flex items-center gap-2" style={{ color }}>
      <div className="w-1 h-3" style={{ background: color }} />
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase">{label}</span>
    </div>
  );
}

function MaturationDots({ level }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: n <= level ? C.gold : C.textVeryDim }}
        />
      ))}
    </div>
  );
}

function ProjectCard({ p, expanded, onToggle }) {
  const color = p.veine === "social" ? C.gold : p.veine === "meta" ? C.meta : C.respiration;
  return (
    <motion.div
      layout
      className="cursor-pointer group"
      style={{
        background: C.surface,
        border: `1px solid ${expanded ? color : C.border}`,
        borderLeft: `2px solid ${color}`,
      }}
      onClick={onToggle}
      whileHover={{ borderColor: expanded ? color : C.borderLight }}
    >
      <div className="p-5 md:p-7">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-baseline gap-4 min-w-0">
            <span className="font-mono text-xs tracking-[0.2em]" style={{ color: C.textDim }}>
              {p.n}
            </span>
            <div className="min-w-0">
              <h3
                className="font-serif font-light leading-tight mb-1"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: C.ivory }}
              >
                {p.title}
              </h3>
              {p.subtitle && (
                <p className="italic text-sm" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                  {p.subtitle}
                </p>
              )}
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: 0.2 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke={color} strokeWidth="1" />
            </svg>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs" style={{ color: C.textMuted }}>
          <VeineBadge veine={p.veine} label={p.veineLabel} />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: C.textDim }}>
              Maturation
            </span>
            <MaturationDots level={p.maturationLevel} />
            {p.structureHaute && (
              <span className="font-mono text-[9px] tracking-wider italic" style={{ color: C.goldDim }}>
                (structure haute)
              </span>
            )}
          </div>
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase">
            <span style={{ color: C.textDim }}>Horizon · </span>
            <span style={{ color: C.textSoft }}>{p.horizon}</span>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t" style={{ borderColor: C.border }}>
                <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                  <div>
                    <div className="mb-5">
                      <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color }}>
                        Prémisse
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                        {p.prémisse}
                      </p>
                    </div>
                    <div className="mb-5">
                      <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color }}>
                        Question centrale
                      </div>
                      <p className="text-sm italic leading-relaxed" style={{ color: C.ivory, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
                        « {p.question} »
                      </p>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color }}>
                        Avantage concurrentiel
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                        {p.avantage}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-baseline justify-between">
                      <div className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color }}>
                        Position
                      </div>
                      <div className="font-mono text-[10px] italic" style={{ color: C.textDim }}>
                        strat.
                      </div>
                    </div>
                    <p className="font-serif text-lg mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                      {p.position}
                    </p>

                    <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color }}>
                      Chantiers
                    </div>
                    <ul className="space-y-2">
                      {p.chantiers.map((c, i) => (
                        <li key={i} className="flex gap-3 items-start text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                          <span className="font-mono text-xs mt-0.5" style={{ color }}>
                            ·
                          </span>
                          <span className="leading-relaxed">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Section({ id, eyebrow, title, children, isIntro }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`${isIntro ? "pt-20 md:pt-32" : "pt-20 md:pt-28"} pb-8 md:pb-12`}
    >
      <div className="mb-10 md:mb-14">
        {eyebrow && (
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: C.gold }} />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: C.gold }}>
              {eyebrow}
            </span>
          </div>
        )}
        <h2
          className="font-serif font-light leading-[1.05]"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            color: C.ivory,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}

export default function StratexDocument() {
  const [expandedProject, setExpandedProject] = useState(null);
  const [activeSection, setActiveSection] = useState("preambule");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setNavOpen(false);
    }
  };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Mono:ital,wght@0,300;0,400;0,500&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        ::selection { background: ${C.gold}; color: ${C.bg}; }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* FIXED NAV — desktop */}
      <nav
        className="hidden lg:block fixed left-0 top-0 h-screen py-16 px-8 z-40"
        style={{ width: "220px", borderRight: `1px solid ${C.border}`, background: `${C.bgDeep}cc`, backdropFilter: "blur(8px)" }}
      >
        <div
          className="font-serif text-2xl font-light mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}
        >
          STRAT<span style={{ color: C.gold }}>EX</span>
        </div>
        <div className="font-mono text-[9px] tracking-[0.2em] uppercase mb-12" style={{ color: C.textDim }}>
          v1.0 · Final
        </div>
        <ul className="space-y-3">
          {sections.map((s, i) => {
            const active = activeSection === s.id;
            return (
              <li key={s.id}>
                <button
                  onClick={() => scrollTo(s.id)}
                  className="group flex items-center gap-3 text-left w-full transition-colors"
                >
                  <span
                    className="font-mono text-[10px]"
                    style={{
                      color: active ? C.gold : C.textDim,
                      transition: "color 0.2s",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{
                      color: active ? C.ivory : C.textMuted,
                      transition: "color 0.2s",
                    }}
                  >
                    {s.label}
                  </span>
                  {active && <div className="w-4 h-px" style={{ background: C.gold }} />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* MOBILE NAV */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50" style={{ background: `${C.bgDeep}ee`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="font-serif text-lg font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            STRAT<span style={{ color: C.gold }}>EX</span>
          </div>
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: C.gold }}
          >
            {navOpen ? "Fermer" : "Sections"}
          </button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.ul
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden px-5 pb-4"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              {sections.map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollTo(s.id)}
                    className="block w-full text-left py-2 font-mono text-xs tracking-wider uppercase"
                    style={{ color: activeSection === s.id ? C.gold : C.textMuted }}
                  >
                    <span style={{ color: C.textDim }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="ml-4">{s.label}</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* MAIN */}
      <main className="lg:ml-[220px] lg:pr-6">
        {/* HERO */}
        <header
          className="relative min-h-screen flex flex-col justify-between px-6 md:px-16 pt-24 md:pt-20 pb-16 overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${C.bgDeep} 0%, ${C.bg} 100%)` }}
        >
          <div className="noise absolute inset-0 opacity-[0.03] pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="h-px w-12" style={{ background: C.gold }} />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: C.gold }}>
              Document de référence · Canonique
            </span>
          </div>

          <div className="relative z-10 max-w-5xl">
            <h1
              className="font-serif font-light leading-[0.95] mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(3.5rem, 11vw, 9rem)",
                letterSpacing: "-0.02em",
                color: C.ivory,
              }}
            >
              STRAT<span style={{ color: C.gold }}>EX</span>
            </h1>
            <p
              className="font-serif italic mb-4 max-w-3xl leading-snug"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
                fontWeight: 300,
                color: C.textSoft,
              }}
            >
              Feuille de route stratégique, méthodologique et créative pour un·e auteur·e-ingénieur·e sur dix ans.
            </p>
            <p className="max-w-2xl text-sm leading-relaxed" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Intègre l'analyse stratégique initiale, l'extension matériel, l'addendum IA & développement, la
              méthodologie unifiée à trois couches et la cartographie complète des neuf projets créatifs.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-6 md:gap-12 max-w-3xl pt-12" style={{ borderTop: `1px solid ${C.border}` }}>
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: C.textDim }}>
                Version
              </div>
              <div className="font-serif text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                1.0 finale
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: C.textDim }}>
                Projets
              </div>
              <div className="font-serif text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                09 cartographiés
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: C.textDim }}>
                Horizon
              </div>
              <div className="font-serif text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                10 ans
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="px-6 md:px-16 max-w-5xl">
          {/* PREAMBULE */}
          <Section id="preambule" eyebrow="§ 01" title="Préambule — ce que ce document est" isIntro>
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <div>
                <p
                  className="text-lg leading-relaxed mb-6"
                  style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}
                >
                  Ce document est la <em style={{ color: C.gold }}>carte générale</em> d'un travail créatif sur dix
                  ans. Il articule qui tu es, où tu vas, ce que tu as comme moyens, comment tu fais concrètement le
                  travail, quels projets tu mènes et dans quel ordre.
                </p>
                <p className="text-base leading-relaxed" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                  Il n'est pas un plan rigide. Une carte n'est pas la terre — elle est un outil pour s'orienter
                  quand le terrain change.
                </p>
              </div>
              <div
                className="p-6 md:p-8"
                style={{ background: C.surface, borderLeft: `2px solid ${C.gold}` }}
              >
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.gold }}>
                  Rituels de révision
                </div>
                <ul className="space-y-3 text-sm" style={{ fontFamily: "Georgia, serif", color: C.textSoft }}>
                  <li>
                    <span style={{ color: C.gold }}>·</span> Trimestrielle — 90 min, ajustements mineurs
                  </li>
                  <li>
                    <span style={{ color: C.gold }}>·</span> Semestrielle — demi-journée, posture large
                  </li>
                  <li>
                    <span style={{ color: C.gold }}>·</span> Annuelle — une journée, révision substantielle
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          {/* IDENTITE */}
          <Section id="identite" eyebrow="§ 02" title="Identité d'auteur·e">
            <p
              className="font-serif italic text-xl md:text-2xl leading-relaxed mb-10 max-w-3xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory, fontWeight: 300 }}
            >
              Auteur·e-ingénieur·e, conteur·euse visuel·le transmédia — la BD comme pivot narratif central,
              l'animation et le cinéma comme amplifications sélectives, la pensée-système comme structure
              invisible, la collaboration comme ouverture choisie.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { n: "38", l: "ans de dessin" },
                { n: "20", l: "ans d'ingénierie" },
                { n: "10", l: "ans d'audiovisuel" },
                { n: "23k€", l: "d'infrastructure" },
              ].map((s, i) => (
                <div key={i} className="p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div
                    className="font-serif font-light mb-1"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(2rem, 4vw, 2.5rem)",
                      color: C.gold,
                      lineHeight: 1,
                    }}
                  >
                    {s.n}
                  </div>
                  <div className="font-mono text-[10px] tracking-wider uppercase" style={{ color: C.textMuted }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* PRINCIPES */}
          <Section id="principes" eyebrow="§ 03" title="Dix principes fondateurs">
            <p className="text-base mb-10 max-w-2xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Les règles à relire quand une décision te coince. Elles ont préséance sur l'intuition du moment.
            </p>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
              {principles.map((p) => (
                <div key={p.i} className="flex gap-5 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <div
                    className="font-serif font-light flex-shrink-0"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.8rem",
                      color: C.gold,
                      lineHeight: 1,
                      minWidth: "2.5rem",
                    }}
                  >
                    {p.i}
                  </div>
                  <div>
                    <p
                      className="leading-snug mb-2"
                      style={{ color: C.text, fontFamily: "Georgia, serif", fontSize: "1rem" }}
                    >
                      {p.text}
                    </p>
                    {p.note && (
                      <p
                        className="text-sm italic"
                        style={{ color: C.textMuted, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
                      >
                        « {p.note} »
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* HORIZON */}
          <Section id="horizon" eyebrow="§ 04" title="Horizon 10 ans — la signature">
            <p
              className="text-lg leading-relaxed mb-10 max-w-3xl"
              style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}
            >
              Tu es potentiellement l'auteur·e français·e qui pense l'humain face à la technologie et au sacré
              depuis une position rare — celle où se croisent l'artisanat du dessin, l'expertise de l'ingénierie
              logicielle, la sensibilité spirituelle et politique, et l'ancrage socioculturel hybride.
            </p>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-10">
              {[
                {
                  label: "Veine 1",
                  name: "Morale sociale urbaine",
                  color: C.social,
                  desc: "Les ambiguïtés du bien et du mal dans les marges",
                },
                {
                  label: "Veine 2",
                  name: "Métaphysique & civilisation",
                  color: C.meta,
                  desc: "L'humain face au cosmos, au sacré, à l'IA",
                },
                {
                  label: "Veine ⊥",
                  name: "Respiration tendre",
                  color: C.respiration,
                  desc: "La vie prise au sérieux dans sa légèreté",
                },
              ].map((v, i) => (
                <div
                  key={i}
                  className="p-6"
                  style={{ background: C.surface, borderTop: `2px solid ${v.color}` }}
                >
                  <div
                    className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3"
                    style={{ color: v.color }}
                  >
                    {v.label}
                  </div>
                  <h4
                    className="font-serif text-xl mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}
                  >
                    {v.name}
                  </h4>
                  <p className="text-sm italic" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 md:p-8" style={{ background: C.surfaceAlt, borderLeft: `2px solid ${C.gold}` }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.gold }}>
                Trois reconnaissances à viser sur 10 ans
              </div>
              <ul className="space-y-4" style={{ fontFamily: "Georgia, serif" }}>
                <li className="flex gap-4">
                  <span className="font-mono text-xs mt-1" style={{ color: C.goldDim }}>01.</span>
                  <div>
                    <span style={{ color: C.ivory }}>Audience propriétaire</span>{" "}
                    <span style={{ color: C.textMuted }}>— 3 000 à 10 000 abonné·es engagé·es.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-xs mt-1" style={{ color: C.goldDim }}>02.</span>
                  <div>
                    <span style={{ color: C.ivory }}>Légitimité critique</span>{" "}
                    <span style={{ color: C.textMuted }}>— au moins une œuvre remarquée (Angoulême, Annecy, presse).</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-xs mt-1" style={{ color: C.goldDim }}>03.</span>
                  <div>
                    <span style={{ color: C.ivory }}>Territoire identifié</span>{" "}
                    <span style={{ color: C.textMuted }}>— l'auteur·e qui travaille le croisement technologie-sacré-quartier.</span>
                  </div>
                </li>
              </ul>
            </div>
          </Section>

          {/* MOYENS */}
          <Section id="moyens" eyebrow="§ 05" title="Moyens et contraintes">
            <div className="mb-12">
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.gold }}>
                Budget temps hybride
              </div>
              <p className="text-lg leading-relaxed max-w-2xl" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                Environ <span style={{ color: C.gold }}>15 à 25 heures par semaine</span> de temps créatif utile, soit{" "}
                <span style={{ color: C.gold }}>720 à 1 200 heures annuelles</span>. C'est trois fois moins qu'un·e
                auteur·e à plein temps. Toute la stratégie s'y adapte.
              </p>
            </div>

            <div className="mb-12">
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-6" style={{ color: C.gold }}>
                Ventilation des anneaux
              </div>
              <div className="space-y-3">
                {[
                  { n: "Centre — BD flagship", p: 70, c: C.gold },
                  { n: "Amplifications solo", p: 15, c: C.blue },
                  { n: "Collaborations choisies", p: 10, c: C.meta },
                  { n: "Optionalité / revenus annexes", p: 5, c: C.textDim },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-48 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                      {a.n}
                    </div>
                    <div className="flex-1 h-6 relative" style={{ background: C.surface }}>
                      <div
                        className="h-full"
                        style={{ width: `${a.p}%`, background: a.c, opacity: 0.8 }}
                      />
                    </div>
                    <div className="font-mono text-sm w-12 text-right" style={{ color: a.c }}>
                      {a.p}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: C.meta }}>
                  Levier IA
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                  <em>Seconde tête, jamais seconde main.</em> Elle accélère admin, recherche, communications
                  utilitaires. Elle ne touche jamais le dessin, la narration, la voix publique ni les décisions
                  artistiques de fond.
                </p>
              </div>
              <div className="p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: C.blue }}>
                  Levier développement
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                  Tu construis des outils <em>parce que</em> tu publies, pas <em>avant de</em> publier. Build
                  budget annuel borné — 40 à 200 h/an selon la phase. Chaque outil résout un problème vécu.
                </p>
              </div>
            </div>
          </Section>

          {/* METHODE */}
          <Section id="methode" eyebrow="§ 06" title="Méthodologie à trois couches">
            <p className="text-base mb-10 max-w-2xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Trois niveaux de zoom sur la même pratique — le trimestre, le chapitre, l'UT. Ils sont emboîtés.
              Quand les trois sont cohérents, l'UT du mardi soir sert le chapitre qui sert l'arc qui sert l'œuvre.
            </p>

            <div className="space-y-4">
              {[
                {
                  n: "01",
                  label: "Couche stratégique",
                  cadence: "Trimestrielle · 90 min",
                  question: "Quel est mon PLP trimestriel, et comment les trois prochains mois y mènent sans m'épuiser ?",
                  color: C.gold,
                  items: ["PLP trimestriel", "Arc narratif", "Allocation anneaux", "Amplification de saison", "Outil focal"],
                },
                {
                  n: "02",
                  label: "Couche opérationnelle",
                  cadence: "Par chapitre · 2–4 semaines",
                  question: "Ce chapitre est-il à son étape la plus avancée possible compte tenu de l'énergie dont je dispose ?",
                  color: C.blue,
                  items: ["Noyau narratif", "Prototype (sas de survie)", "Mise en scène unifiée", "Rough++", "Clean + couleur", "Publication + trace"],
                },
                {
                  n: "03",
                  label: "Couche exécution",
                  cadence: "Par UT · soir ou week-end",
                  question: "Cette UT va produire quelle UL concrète ?",
                  color: C.meta,
                  items: ["UT de 1h30–2h", "1 intention, 1 focus", "1 mode de travail", "UL montrable obligatoire"],
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="p-6 md:p-8"
                  style={{ background: C.surface, borderLeft: `2px solid ${c.color}` }}
                >
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-6 mb-4">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs" style={{ color: C.textDim }}>{c.n}</span>
                      <h3
                        className="font-serif font-light"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", color: C.ivory }}
                      >
                        {c.label}
                      </h3>
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: c.color }}>
                      {c.cadence}
                    </div>
                  </div>
                  <p
                    className="italic mb-5 max-w-2xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: C.textSoft }}
                  >
                    « {c.question} »
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.items.map((it, j) => (
                      <span
                        key={j}
                        className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1"
                        style={{ background: C.bgDeep, color: C.textMuted, border: `1px solid ${C.border}` }}
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* PROJETS */}
          <Section id="projets" eyebrow="§ 07" title="Cartographie — neuf projets">
            <p className="text-base mb-8 max-w-3xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Neuf projets en incubation. Dans les dix prochaines années, quatre à cinq seront probablement menés
              à terme. Les autres glissent, mûrissent, ou sont abandonnés. Clique sur chaque projet pour déployer
              ses détails.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ background: C.social }} />
                <span style={{ color: C.textMuted }}>Veine morale sociale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ background: C.meta }} />
                <span style={{ color: C.textMuted }}>Veine métaphysique</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ background: C.respiration }} />
                <span style={{ color: C.textMuted }}>Veine respiration</span>
              </div>
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <ProjectCard
                  key={p.n}
                  p={p}
                  expanded={expandedProject === p.n}
                  onToggle={() => setExpandedProject(expandedProject === p.n ? null : p.n)}
                />
              ))}
            </div>
          </Section>

          {/* SEQUENCE */}
          <Section id="sequence" eyebrow="§ 08" title="Séquence de déploiement 0–120 mois">
            <p className="text-base mb-10 max-w-3xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Sept phases, chacune avec son projet-centre et ses projets secondaires. Un seul projet majeur actif
              à la fois. Les projets en attente mûrissent par capillarité.
            </p>

            <div className="space-y-3">
              {timelinePhases.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="p-5 md:p-7 relative"
                  style={{ background: C.surface, borderLeft: `2px solid ${phase.color}` }}
                >
                  <div className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8">
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: phase.color }}>
                        {phase.label}
                      </div>
                      <div className="font-mono text-xs mb-3" style={{ color: C.textDim }}>
                        {phase.months}
                      </div>
                      <h4
                        className="font-serif font-light"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: C.ivory, lineHeight: 1.1 }}
                      >
                        {phase.title}
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {phase.items.map((item, j) => (
                        <li
                          key={j}
                          className="flex gap-3 items-start text-sm"
                          style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}
                        >
                          <span style={{ color: phase.color }}>·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* GARDES */}
          <Section id="gardes" eyebrow="§ 09" title="Garde-fous et points de vigilance">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-10">
              <div className="p-6" style={{ background: C.surface, borderTop: `2px solid ${C.red}` }}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.red }}>
                  Points de non-retour
                </div>
                <ul className="space-y-3 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                  {[
                    "Avant 1er crowdfunding : 500+ abonnés, cadence prouvée 8 mois",
                    "Avant When I Get Free : Pimpologist arc complet publié",
                    "Avant Barzaq : 1 œuvre majeure déjà publiée + carnet épais",
                    "Avant bascule pro : 12 mois d'indicateurs verts",
                  ].map((r, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: C.red }}>·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6" style={{ background: C.surface, borderTop: `2px solid ${C.gold}` }}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.gold }}>
                  Indicateur unique principal
                </div>
                <p
                  className="font-serif text-lg mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory, fontWeight: 300 }}
                >
                  Nombre d'UL montrables par semaine — moyenne roulante sur 4 semaines.
                </p>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3 pt-3" style={{ color: C.gold, borderTop: `1px solid ${C.border}` }}>
                  Indicateurs qualitatifs
                </div>
                <ul className="space-y-1.5 text-sm" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                  <li>Énergie de la semaine (1–5)</li>
                  <li>Plaisir créatif ressenti (1–5)</li>
                  <li>Jours d'épuisement (cible &lt;1/semaine)</li>
                </ul>
              </div>
            </div>

            <div className="p-6 md:p-8" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-5" style={{ color: C.textMuted }}>
                Dix pièges à surveiller
              </div>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                {[
                  "Éparpillement par multi-capacité",
                  "Apprentissage comme évitement",
                  "Sur-collaboration généreuse",
                  "Équipement comme identité",
                  "Prestation B2B qui mange tout",
                  "Épuisement silencieux",
                  "Pensée binaire sur la transition pro",
                  "L'ingénieur qui cannibalise l'artiste",
                  "Infrastructure perfectionniste",
                  "Glisser de projet en projet sans finir",
                ].map((p, i) => (
                  <div key={i} className="flex gap-3 py-1">
                    <span className="font-mono text-xs" style={{ color: C.textDim, minWidth: "1.5rem" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* 7 JOURS */}
          <Section id="jours" eyebrow="§ 10" title="Sept jours — actions concrètes">
            <p className="text-base mb-10 max-w-2xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Pour ne pas laisser ce document rester théorique. Aucune de ces actions ne prend plus de 90 minutes
              cumulées. Si l'installation prend plus, tu résistes à quelque chose qui mérite d'être nommé.
            </p>

            <ol className="space-y-4">
              {sevenDays.map((a, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="flex gap-5 md:gap-8 p-5 md:p-7"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}
                >
                  <div
                    className="font-serif font-light flex-shrink-0"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "3rem",
                      color: C.gold,
                      lineHeight: 0.8,
                      minWidth: "3rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p
                    className="text-base leading-relaxed pt-2"
                    style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}
                  >
                    {a}
                  </p>
                </motion.li>
              ))}
            </ol>
          </Section>

          {/* SYNTHESE */}
          <Section id="synthese" eyebrow="§ 11" title="Synthèse finale">
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative py-8 md:py-12 px-6 md:px-12"
              style={{ background: C.surfaceAlt, borderLeft: `3px solid ${C.gold}` }}
            >
              <div
                className="absolute top-2 left-4 font-serif"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "5rem", color: C.goldDim, lineHeight: 1 }}
              >
                &ldquo;
              </div>
              <p
                className="font-serif italic leading-relaxed relative z-10"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)",
                  color: C.ivory,
                  fontWeight: 300,
                }}
              >
                Un·e auteur·e-ingénieur·e à temps partiel créatif tient une pratique hybride sur dix ans en
                construisant un feuilleton BD flagship qui alimente une audience propriétaire, en déployant des
                œuvres majeures successives portées par ses deux obsessions — morale sociale et métaphysique-civilisation —,
                en s'amplifiant sélectivement par un court métrage d'auteur·e pour la légitimité festival, en
                respirant par un projet soupape sériel et un projet familial éventuel, en utilisant ses
                compétences d'ingénieur·e comme scaffolding invisible et l'IA comme accélérateur strictement
                non-créatif, en protégeant religieusement le temps de création propre et la santé comme
                conditions non-négociables de la continuité — avec pour horizon l'occupation d'un territoire
                singulier&nbsp;: celui de l'auteur·e français·e qui pense l'humain face à la technologie et au
                sacré depuis une position rare de croisement.
              </p>
            </motion.blockquote>
          </Section>

          {/* FOOTER */}
          <footer
            className="mt-20 md:mt-32 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <div>
              <div className="font-serif text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                STRAT<span style={{ color: C.gold }}>EX</span>
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>
                Document de référence canonique · v1.0 finale
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: C.textDim }}>
                Prochaine révision
              </div>
              <div className="font-serif text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textMuted }}>
                à 12 mois — version 2.0
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
