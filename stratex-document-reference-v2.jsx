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

// ============================================================================
// DONNÉES
// ============================================================================

const regimes = [
  {
    code: "A",
    name: "FromScratch",
    label: "Identité publique réelle",
    color: C.blue,
    public: "Public (existant)",
    role: "Communication professionnelle hors Kefta Matesha",
    detail: "Pseudonyme public existant, ancré hors Kefta Matesha. Signe la vie professionnelle publique, les contenus méthodologiques, les tribunes extérieures, les making-of techniques, la présence publique d'auteur·e-ingénieur·e. Ne signe jamais dans Kefta Matesha. Peut apparaître occasionnellement comme auteur·e invité·e dans un numéro — ce qui crée un effet de réel élégant.",
  },
  {
    code: "B",
    name: "Noname",
    label: "Directeur·rice de rédaction Kefta Matesha",
    color: C.gold,
    public: "Fiction interne Kefta Matesha",
    role: "Édito-direction de la revue",
    detail: "Hétéronyme fictionnel interne au magazine. Nom qui déclare ne pas en être un — un paradoxe performatif d'une noblesse littéraire rare. Résonance Pessoa / Kafka / Musil et rappeuse Noname de Chicago. Fait écho à GhostWriter : les deux jouent avec l'absence et la signature refusée. Coordonne la posse fictive, incarne la persona de l'architecte invisible. Inspirations : Kanye West, Rick Rubin, Virgil Abloh, Hideo Kojima, Moebius.",
  },
  {
    code: "C",
    name: "La Posse",
    label: "Moxo · Imran · Notche · GhostWriter · Blaise",
    color: C.gold,
    public: "Fiction interne Kefta Matesha",
    role: "Contributions aux numéros. Moxo seul signe *Pimpologist* et *Darkovsky*.",
    detail: "Hétéronymes fictionnels internes au magazine, avec personas développées. Moxo est le seul hétéronyme du régime C qui signe des œuvres hors magazine, dans la limite stricte de l'univers Las Casas.",
    members: [
      { name: "Moxo", role: "Illustrateur principal", voice: "T'as besoin d'un truc pour demain ? C'est fait.", refs: "Toriyama · Moebius · Matsumoto · Steadman · Otomo" },
      { name: "Imran", role: "Poète & DA", voice: "Je dessine pas des formes. Je dessine des silences.", refs: "Kendrick Lamar · Basquiat · Saul Williams · Chris Ware · Sonia Sanchez" },
      { name: "Notche", role: "Scénariste & beatmaker", voice: "Une histoire sans rythme, c'est juste des mots.", refs: "RZA · J Dilla · Frank Miller · Iñárritu · Tezuka" },
      { name: "GhostWriter", role: "Parolier & graffeur", voice: "Mon nom est partout. Personne sait que c'est moi.", refs: "Banksy · Rimbaud · Ghostface Killah · Basquiat · Shepard Fairey" },
      { name: "Blaise", role: "Présence indéfinie", voice: "Je fais rien. Mais sans moi, rien se fait.", refs: "Warhol · Brian Eno · Duchamp · Flavor Flav · Leos Carax" },
    ],
  },
  {
    code: "D",
    name: "Altazar",
    label: "Auteur·e solo stable",
    color: C.meta,
    public: "Public littéraire séparé",
    role: "Œuvres solo (LVDMM · WIGF · Barzaq · tardives)",
    detail: "Pseudonyme stable pour l'œuvre d'auteur·e solo. Totalement séparé des régimes A, B, C. Convoque plusieurs résonances nobles : Altazor de Vicente Huidobro (chute cosmique, méditation sur la mort et la langue, 1931), al-Hazar (la chance, le destin en arabe classique), Alcázar (forteresse, palais en arabe-andalou). Méditerranéen-hybride sans enfermer la signature dans une seule grille culturelle. Typographiquement stable, phonétiquement clair. Séparation rigoureuse : comptes sociaux distincts, adresses email distinctes, domaine distinct (altazar.com), newsletters séparées, aucun cross-link public.",
  },
  {
    code: "E",
    name: "Morad",
    label: "Signature interne de documents",
    color: C.textMuted,
    public: "Interne / barrière de contamination",
    role: "Bibles · scripts · documents de travail",
    detail: "Pseudonyme opérationnel interne pour les documents non destinés à publication publique directe. Barrière de contamination entre vie expressive et autres activités professionnelles. Morad seul — sans nom de famille — rompt les chaînes de recherche automatiques (Google, LinkedIn, réseaux sociaux). Reste phonétiquement cohérent avec l'identité civile réelle. Traverse les registres des neuf projets sans dissonance tonale. La signature Morad Noname précédemment utilisée sur la couverture du tome 1 de Pimpologist et le scénario pilote est abandonnée au profit de Moxo pour toute publication publique.",
  },
];

const principes = [
  { n: "I", text: "Un projet avance par chapitres finis, pas par motivation." },
  { n: "II", text: "L'actif central est la liste email propriétaire.", note: "Deux listes à gérer : Kefta Matesha et Altazar, rigoureusement séparées." },
  { n: "III", text: "Mastery avant ambition." },
  { n: "IV", text: "La collaboration sert l'univers, sinon c'est de la prestation.", note: "La posse n'est pas une collaboration — c'est un dispositif d'auteur·e." },
  { n: "V", text: "Le temps de création propre est non-négociable." },
  { n: "VI", text: "La durabilité prime sur la cadence.", quote: "Tu n'optimises pas ton talent. Tu optimises ta capacité à continuer." },
  { n: "VII", text: "Le salaire est un scaffolding, pas une prison." },
  { n: "VIII", text: "L'ingénieur·e accélère, jamais ne cannibalise l'artiste." },
  { n: "IX", text: "La BD est le tronc, tout le reste sont des branches.", note: "Kefta Matesha est l'écosystème. Altazar porte les grandes branches latérales." },
  { n: "X", text: "Le transmédia dérive du chapitre, jamais l'inverse." },
  { n: "XI", text: "Séparation rigoureuse des régimes de signature.", note: "NOUVEAU v2. Chaque œuvre se rattache à un seul régime. Aucun glissement sans décision documentée." },
];

const projects = [
  { n: "01", title: "The Pimpologist", veine: "social", sig: "Moxo", nature: "Conte urbain fantastique", position: "Feuilleton Kefta Matesha", horizon: "An 1–5", status: "endogene" },
  { n: "02", title: "La vie de ma mère", veine: "social", sig: "Altazar", nature: "Court métrage dramatique", position: "Signature courte solo", horizon: "An 2–4", status: "solo" },
  { n: "03", title: "When I Get Free", veine: "social", sig: "Altazar", nature: "Tragédie sociale longue", position: "Œuvre majeure primaire solo", horizon: "An 3–6", status: "solo" },
  { n: "04", title: "Barzaq", veine: "meta", sig: "Altazar", nature: "SF métaphysique spirituelle", position: "Œuvre majeure secondaire solo", horizon: "An 5–8", status: "solo" },
  { n: "05", title: "Darkovsky", veine: "social", sig: "Moxo", nature: "Conte fantastique sériel", position: "Rubrique récurrente Kefta Matesha", horizon: "An 2–4", status: "endogene" },
  { n: "06", title: "Endormis", veine: "meta", sig: "Altazar?", nature: "Fable dialectique IA", position: "Œuvre tardive candidate", horizon: "An 6–9", status: "late" },
  { n: "07", title: "COCORICO", veine: "respiration", sig: "À définir", nature: "Conte animalier familial", position: "Projet flottant", horizon: "Flottant", status: "float" },
  { n: "08", title: "FOLIE NATURELLE", veine: "meta", sig: "Altazar?", nature: "Comédie dystopique IA", position: "Œuvre tardive candidate", horizon: "An 7–10", status: "late" },
  { n: "09", title: "Simply 21", veine: "meta", sig: "Altazar?", nature: "Fable post-apocalyptique IA", position: "Œuvre tardive candidate", horizon: "An 8–12", status: "late" },
];

const rubriques = [
  { n: "01", name: "L'Ouverture", format: "Image pleine page + titre", words: "~50", lead: "Moxo / Imran" },
  { n: "02", name: "Le Dossier", format: "3 à 5 modules", words: "~2000", lead: "Notche + posse" },
  { n: "03", name: "La Planche", format: "Portrait artiste, 5–10 planches commentées", words: "~800", lead: "Imran / Moxo" },
  { n: "04", name: "Le Terrain", format: "Reportage immersif", words: "~1200", lead: "GhostWriter / Notche" },
  { n: "05", name: "Le Labo", format: "Making-of, process, technique", words: "~600", lead: "Noname" },
  { n: "06", name: "L'Archive", format: "Référence historique contextualisée", words: "~800", lead: "Rotation" },
  { n: "07", name: "La Sortie", format: "Recommandations curées", words: "~200", lead: "Blaise + tous" },
];

const phases = [
  {
    label: "Phase 0",
    range: "M 1–4",
    title: "Fondations",
    color: C.gold,
    items: [
      "Bible Pimpologist (Moxo publi. / Morad interne)",
      "MAJ couv + script pilote (Morad Noname → Moxo)",
      "3 premiers chapitres en banque",
      "Réservation altazar.com + keftamatesha.com",
      "Substack double (Kefta Matesha + Altazar)",
      "9 carnets projet + 6 carnets persona",
    ],
  },
  {
    label: "Phase 1",
    range: "M 5–18",
    title: "Lancement Kefta Matesha",
    color: C.gold,
    items: [
      "Cadence bi-mensuelle → mensuelle",
      "MVP 3 rubriques / 3 voix (Noname + Moxo + Notche)",
      "Pimpologist feuilleton (Moxo)",
      "Paliers payants M9-10, crowdfunding M12-14",
      "Intro Imran (N°3), GhostWriter (N°5), Blaise (N°6)",
      "Dormance active carnets Altazar",
    ],
  },
  {
    label: "Phase 2",
    range: "M 19–30",
    title: "Animatique LVDMM (Altazar)",
    color: C.blue,
    items: [
      "Revue mensuelle · 7 rubriques actives",
      "Animatique La vie de ma mère (Altazar)",
      "Dossiers CNC / DRAC / région (Altazar)",
      "Kefta Matesha interviewe Altazar (N° spécial)",
      "Pimpologist 2e arc (Moxo)",
      "When I Get Free en préparation (Altazar)",
    ],
  },
  {
    label: "Phase 3",
    range: "M 31–48",
    title: "Bascule vers WIGF",
    color: C.meta,
    items: [
      "Décision Pimpologist vs When I Get Free en centre",
      "Production LVDMM si financée (Altazar)",
      "Kefta Matesha cultive terrain WIGF",
      "Dossier Tupac · Planche Heat · Terrain marchés",
      "Barzaq en carnet avancé (Altazar)",
    ],
  },
  {
    label: "Phase 4",
    range: "M 49–72",
    title: "Consolidation auteur·e",
    color: C.meta,
    items: [
      "Finalisation When I Get Free (Altazar)",
      "LVDMM soumis festivals (Altazar)",
      "Kefta Matesha plateforme mature",
      "Barzaq en préparation active (Altazar)",
      "Publication WIGF année 5-6",
    ],
  },
  {
    label: "Phase 5",
    range: "M 73–96",
    title: "Barzaq en écriture",
    color: C.respiration,
    items: [
      "Barzaq écriture active (Altazar)",
      "Pimpologist vers conclusion (Moxo)",
      "Endormis / Folie Naturelle en prép",
      "COCORICO possible en parallèle",
    ],
  },
  {
    label: "Phase 6",
    range: "M 97–120",
    title: "Maturité · rupture · révélation ?",
    color: C.red,
    items: [
      "Une œuvre tardive (Altazar)",
      "Consultations éthiques si Simply 21",
      "Décision d'optionalité pro",
      "Révélation contrôlée du dispositif (optionnelle)",
    ],
  },
];

const sevenDays = [
  { n: "01", text: "Réserver immédiatement altazar.com, handles @altazar, keftamatesha.com + handles associés." },
  { n: "02", text: "Bloquer le créneau sacré de création du week-end (4–6h inamovibles)." },
  { n: "03", text: "Mettre à jour couverture Tome 1 + scénario pilote Pimpologist (Morad Noname → Moxo pour publi, Morad pour interne)." },
  { n: "04", text: "Réécrire la bible Pimpologist en 3–4h sous signature Moxo (publi) et Morad (interne)." },
  { n: "05", text: "Ouvrir 9 carnets projet + 6 carnets persona (Noname, Moxo, Imran, Notche, GhostWriter, Blaise) + 1 carnet Altazar." },
  { n: "06", text: "Décider d'un Q1 de non-productivité apparente consacré aux fondations." },
];

const pieges = [
  { n: "11", title: "Contamination des régimes", text: "Chaque texte passe par un seul régime. Noter les tentations plutôt que céder." },
  { n: "12", title: "Épuisement par voix", text: "Si épuisement, réduire le nombre de voix actives d'un numéro plutôt que diluer la qualité." },
  { n: "13", title: "Perte de cohérence de la posse", text: "Si deux voix se ressemblent, revenir aux carnets de personas avant d'écrire." },
  { n: "14", title: "Dévoilement accidentel", text: "Relire tout contenu FromScratch avec l'œil d'un·e lecteur·rice qui cherche à déduire." },
  { n: "15", title: "Dérive opportuniste", text: "Chaque voix dit quelque chose que tu penses réellement, sous un angle que tu ne peux pas tenir seul·e." },
  { n: "16", title: "Contamination par Morad", text: "Vérifier avant tout partage externe que la signature visible correspond au régime approprié." },
];

const sections = [
  { id: "hero", label: "Préambule" },
  { id: "regimes", label: "Les 5 régimes" },
  { id: "principes", label: "Principes" },
  { id: "kefta", label: "Kefta Matesha" },
  { id: "projets", label: "Cartographie" },
  { id: "sequence", label: "Déploiement" },
  { id: "gardes", label: "Garde-fous" },
  { id: "jours", label: "7 jours" },
  { id: "synthese", label: "Synthèse" },
];

// ============================================================================
// COMPOSANTS
// ============================================================================

function VeineDot({ veine }) {
  const color = veine === "social" ? C.gold : veine === "meta" ? C.meta : C.respiration;
  return <div className="w-2 h-2 rounded-full" style={{ background: color }} />;
}

function Section({ id, eyebrow, title, children, isIntro }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`${isIntro ? "pt-20 md:pt-28" : "pt-20 md:pt-28"} pb-8`}
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

function RegimeCard({ regime, expanded, onToggle }) {
  return (
    <motion.div
      layout
      className="cursor-pointer"
      style={{
        background: C.surface,
        border: `1px solid ${expanded ? regime.color : C.border}`,
        borderLeft: `3px solid ${regime.color}`,
      }}
      onClick={onToggle}
      whileHover={{ borderColor: expanded ? regime.color : C.borderLight }}
    >
      <div className="p-5 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 mb-2">
              <span
                className="font-serif font-light flex-shrink-0"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2rem",
                  color: regime.color,
                  lineHeight: 0.9,
                }}
              >
                {regime.code}
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  className="font-serif font-light leading-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    color: C.ivory,
                  }}
                >
                  {regime.name}
                </h3>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: regime.color }}>
                  {regime.label}
                </div>
              </div>
            </div>
            {!expanded && (
              <p
                className="text-sm italic mt-3 max-w-2xl"
                style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}
              >
                {regime.role}
              </p>
            )}
          </div>
          <motion.div animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 mt-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke={regime.color} strokeWidth="1" />
            </svg>
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-5 mt-5 border-t" style={{ borderColor: C.border }}>
                <div className="grid md:grid-cols-3 gap-5 mb-5">
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: C.textDim }}>
                      Public
                    </div>
                    <p className="text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                      {regime.public}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: C.textDim }}>
                      Signe
                    </div>
                    <p className="text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                      {regime.role}
                    </p>
                  </div>
                </div>

                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}
                >
                  {regime.detail}
                </p>

                {regime.members && (
                  <div className="space-y-3 mt-6">
                    <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: regime.color }}>
                      Personas de la posse
                    </div>
                    {regime.members.map((m, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-12 gap-3 py-3"
                        style={{ borderTop: `1px solid ${C.border}` }}
                      >
                        <div className="col-span-12 md:col-span-3">
                          <div className="font-serif text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                            {m.name}
                          </div>
                          <div className="font-mono text-[10px] tracking-wider uppercase" style={{ color: regime.color }}>
                            {m.role}
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-5">
                          <div className="text-sm italic" style={{ color: C.textSoft, fontFamily: "'Cormorant Garamond', serif" }}>
                            « {m.voice} »
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-4">
                          <div className="text-xs" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                            {m.refs}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ProjectRow({ p }) {
  const color = p.veine === "social" ? C.gold : p.veine === "meta" ? C.meta : C.respiration;
  const statusLabel = {
    endogene: "Endogène · Kefta Matesha",
    solo: "Solo · Altazar",
    late: "Tardive · candidate",
    float: "Flottante",
  }[p.status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="grid grid-cols-12 gap-3 md:gap-4 py-4 items-start"
      style={{ borderBottom: `1px solid ${C.border}` }}
    >
      <div className="col-span-1 font-mono text-xs" style={{ color: C.textDim }}>
        {p.n}
      </div>
      <div className="col-span-11 md:col-span-4">
        <div className="flex items-center gap-2 mb-1">
          <VeineDot veine={p.veine} />
          <div
            className="font-serif text-lg leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}
          >
            {p.title}
          </div>
        </div>
        <div className="text-xs italic" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
          {p.nature}
        </div>
      </div>
      <div className="col-span-6 md:col-span-2">
        <div
          className="font-mono text-[10px] tracking-wider uppercase px-2 py-1 inline-block"
          style={{
            color: p.sig === "Moxo" ? C.gold : p.sig === "Altazar" ? C.meta : C.textMuted,
            border: `1px solid ${p.sig === "Moxo" ? C.gold : p.sig === "Altazar" ? C.meta : C.borderLight}`,
          }}
        >
          {p.sig}
        </div>
      </div>
      <div className="col-span-6 md:col-span-3">
        <div className="text-xs" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
          {statusLabel}
        </div>
        <div className="text-xs italic mt-0.5" style={{ color: C.textDim, fontFamily: "Georgia, serif" }}>
          {p.position}
        </div>
      </div>
      <div className="col-span-12 md:col-span-2">
        <div className="font-mono text-[10px] tracking-wider uppercase" style={{ color: color }}>
          {p.horizon}
        </div>
      </div>
    </motion.div>
  );
}

function PhaseCard({ phase, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="p-5 md:p-7 relative"
      style={{ background: C.surface, borderLeft: `2px solid ${phase.color}` }}
    >
      <div className="grid md:grid-cols-[200px_1fr] gap-5 md:gap-8">
        <div>
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: phase.color }}>
            {phase.label}
          </div>
          <div className="font-mono text-xs mb-3" style={{ color: C.textDim }}>
            {phase.range}
          </div>
          <h4
            className="font-serif font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: C.ivory, lineHeight: 1.1 }}
          >
            {phase.title}
          </h4>
        </div>
        <ul className="space-y-2">
          {phase.items.map((item, j) => (
            <li key={j} className="flex gap-3 items-start text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
              <span style={{ color: phase.color }}>·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ============================================================================
// COMPONENT PRINCIPAL
// ============================================================================

export default function StratexV2() {
  const [expandedRegime, setExpandedRegime] = useState("A");
  const [activeSection, setActiveSection] = useState("hero");
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

      {/* DESKTOP NAV */}
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
          v2.0 · Kefta Matesha
        </div>
        <ul className="space-y-3">
          {sections.map((s, i) => {
            const active = activeSection === s.id;
            return (
              <li key={s.id}>
                <button
                  onClick={() => scrollTo(s.id)}
                  className="group flex items-center gap-3 text-left w-full"
                >
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: active ? C.gold : C.textDim, transition: "color 0.2s" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{ color: active ? C.ivory : C.textMuted, transition: "color 0.2s" }}
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
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase ml-2" style={{ color: C.textDim }}>v2.0</span>
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

      <main className="lg:ml-[220px] lg:pr-6">
        {/* HERO */}
        <header
          id="hero"
          className="relative min-h-screen flex flex-col justify-between px-6 md:px-16 pt-24 md:pt-20 pb-16 overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${C.bgDeep} 0%, ${C.bg} 100%)` }}
        >
          <div className="noise absolute inset-0 opacity-[0.03] pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="h-px w-12" style={{ background: C.gold }} />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: C.gold }}>
              Document de référence · v2.0 · Canonique
            </span>
          </div>

          <div className="relative z-10 max-w-5xl">
            <h1
              className="font-serif font-light leading-[0.95] mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(3.5rem, 11vw, 9rem)",
                letterSpacing: "-0.02em",
                color: C.ivory,
              }}
            >
              STRAT<span style={{ color: C.gold }}>EX</span>
            </h1>
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-mono text-sm tracking-[0.2em]" style={{ color: C.goldDim }}>
                v2.0
              </span>
              <span className="font-mono text-xs tracking-[0.15em] uppercase" style={{ color: C.textMuted }}>
                Kefta Matesha · Cinq régimes de signature
              </span>
            </div>
            <p
              className="font-serif italic mb-4 max-w-3xl leading-snug"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
                fontWeight: 300,
                color: C.textSoft,
              }}
            >
              Un·e auteur·e opérant sous pluralité de régimes de signature — architecte d'une revue
              culturelle et auteur·e solo d'œuvres majeures séparées.
            </p>
            <p className="max-w-2xl text-sm leading-relaxed" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Remplace la v1.0 comme document canonique. Intègre Kefta Matesha comme hub éditorial
              central, le dispositif hétéronymique (Noname + posse), et la séparation rigoureuse
              Altazar / Kefta Matesha.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 max-w-4xl pt-12" style={{ borderTop: `1px solid ${C.border}` }}>
            {regimes.map((r) => (
              <div key={r.code}>
                <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: C.textDim }}>
                  Régime {r.code}
                </div>
                <div
                  className="font-serif text-lg"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: r.color }}
                >
                  {r.name}
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="px-6 md:px-16 max-w-5xl">
          {/* RÉGIMES */}
          <Section id="regimes" eyebrow="§ 01" title="Les cinq régimes de signature">
            <p className="text-lg leading-relaxed mb-4 max-w-3xl" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
              Tu n'es pas un·e auteur·e solo au sens classique. Tu opères sous une pluralité de régimes
              de signature, chacun couvrant un territoire distinct de ta production.
            </p>
            <p className="text-base italic mb-10 max-w-3xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Règle cardinale : chaque publication passe par un seul régime, choisi consciemment et à
              l'avance. Aucun glissement sans décision documentée.
            </p>

            <div className="space-y-3">
              {regimes.map((r) => (
                <RegimeCard
                  key={r.code}
                  regime={r}
                  expanded={expandedRegime === r.code}
                  onToggle={() => setExpandedRegime(expandedRegime === r.code ? null : r.code)}
                />
              ))}
            </div>
          </Section>

          {/* PRINCIPES */}
          <Section id="principes" eyebrow="§ 02" title="Onze principes fondateurs">
            <p className="text-base mb-10 max-w-2xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Dix principes de la v1.0 inchangés, plus un nouveau : la séparation rigoureuse des régimes
              de signature, condition de tenue du dispositif sur dix ans.
            </p>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              {principes.map((p) => (
                <div key={p.n} className="flex gap-5 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <div
                    className="font-serif font-light flex-shrink-0"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.8rem",
                      color: p.n === "XI" ? C.meta : C.gold,
                      lineHeight: 1,
                      minWidth: "2.5rem",
                    }}
                  >
                    {p.n}
                  </div>
                  <div>
                    <p
                      className="leading-snug mb-1"
                      style={{ color: C.text, fontFamily: "Georgia, serif", fontSize: "1rem" }}
                    >
                      {p.text}
                    </p>
                    {p.quote && (
                      <p
                        className="text-sm italic mt-2"
                        style={{ color: C.textMuted, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
                      >
                        « {p.quote} »
                      </p>
                    )}
                    {p.note && (
                      <p
                        className="text-xs italic mt-2"
                        style={{ color: p.n === "XI" ? C.meta : C.textDim, fontFamily: "Georgia, serif" }}
                      >
                        {p.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* KEFTA MATESHA */}
          <Section id="kefta" eyebrow="§ 03" title="Kefta Matesha — hub éditorial">
            <p className="text-lg leading-relaxed mb-4 max-w-3xl" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
              La revue n'est pas un canal de promotion de tes œuvres. Elle est l'écosystème culturel dans
              lequel tes œuvres sont nées, et qu'elles nourrissent en retour.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-12 mt-10">
              {[
                { label: "Fonction 1", title: "Véhicule", desc: "Porte Pimpologist et Darkovsky comme feuilleton et rubrique récurrente.", color: C.gold },
                { label: "Fonction 2", title: "Audience multi-entrées", desc: "Chaque hétéronyme attire un lectorat différent. Ensemble, un lectorat composite.", color: C.blue },
                { label: "Fonction 3", title: "Préparation terrain", desc: "Cultive l'écosystème culturel des œuvres Altazar avant leur sortie.", color: C.meta },
              ].map((f, i) => (
                <div key={i} className="p-6" style={{ background: C.surface, borderTop: `2px solid ${f.color}` }}>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: f.color }}>
                    {f.label}
                  </div>
                  <h4
                    className="font-serif text-xl mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}
                  >
                    {f.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-10">
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-5" style={{ color: C.gold }}>
                Sept rubriques structurelles · ~5 650 mots par numéro
              </div>
              <div>
                {rubriques.map((r) => (
                  <div
                    key={r.n}
                    className="grid grid-cols-12 gap-3 py-3 items-baseline"
                    style={{ borderBottom: `1px solid ${C.border}` }}
                  >
                    <div className="col-span-1 font-mono text-xs" style={{ color: C.textDim }}>{r.n}</div>
                    <div className="col-span-11 md:col-span-3">
                      <div className="font-serif text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                        {r.name}
                      </div>
                    </div>
                    <div className="col-span-8 md:col-span-4 text-sm italic" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                      {r.format}
                    </div>
                    <div className="col-span-4 md:col-span-2 font-mono text-xs" style={{ color: C.gold }}>
                      {r.words} mots
                    </div>
                    <div className="col-span-12 md:col-span-2 font-mono text-[10px] tracking-wider uppercase" style={{ color: C.textMuted }}>
                      {r.lead}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8" style={{ background: C.surfaceAlt, borderLeft: `2px solid ${C.red}` }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.red }}>
                MVP prudent — attention au monstre de production
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                Cadence mensuelle + 7 rubriques + 6 voix = monstre de production irréaliste au démarrage.
                Lancement en trois phases progressives.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: C.gold }}>
                    Phase 1 · M0-12
                  </div>
                  <p>Bi-mensuel / trimestriel · 3 rubriques · 3 voix (Noname + Moxo + Notche)</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: C.gold }}>
                    Phase 2 · M13-24
                  </div>
                  <p>Mensuel · rubriques et voix ajoutées progressivement</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: C.gold }}>
                    Phase 3 · M25+
                  </div>
                  <p>Régime nominal · 7 rubriques · 6 voix actives</p>
                </div>
              </div>
            </div>
          </Section>

          {/* PROJETS */}
          <Section id="projets" eyebrow="§ 04" title="Cartographie des neuf projets">
            <p className="text-base mb-8 max-w-3xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Chaque projet attribué à un régime de signature précis. Les projets endogènes (Moxo) vivent
              dans Kefta Matesha. Les projets solo (Altazar) sont portés séparément.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8 text-xs">
              <div className="flex items-center gap-2">
                <VeineDot veine="social" />
                <span style={{ color: C.textMuted }}>Morale sociale</span>
              </div>
              <div className="flex items-center gap-2">
                <VeineDot veine="meta" />
                <span style={{ color: C.textMuted }}>Métaphysique</span>
              </div>
              <div className="flex items-center gap-2">
                <VeineDot veine="respiration" />
                <span style={{ color: C.textMuted }}>Respiration</span>
              </div>
            </div>

            <div className="hidden md:grid grid-cols-12 gap-4 pb-2 mb-2" style={{ borderBottom: `1px solid ${C.borderLight}` }}>
              <div className="col-span-1 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>#</div>
              <div className="col-span-4 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>Projet</div>
              <div className="col-span-2 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>Signature</div>
              <div className="col-span-3 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>Position</div>
              <div className="col-span-2 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>Horizon</div>
            </div>

            <div>
              {projects.map((p) => (
                <ProjectRow key={p.n} p={p} />
              ))}
            </div>
          </Section>

          {/* SÉQUENCE */}
          <Section id="sequence" eyebrow="§ 05" title="Séquence 0–120 mois">
            <p className="text-base mb-10 max-w-3xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Sept phases. Kefta Matesha construit l'audience qui permettra aux œuvres Altazar d'émerger.
              Les œuvres Altazar construisent la stature qui renforce la revue. Cercle vertueux.
            </p>

            <div className="space-y-3">
              {phases.map((p, i) => (
                <PhaseCard key={i} phase={p} i={i} />
              ))}
            </div>
          </Section>

          {/* GARDE-FOUS */}
          <Section id="gardes" eyebrow="§ 06" title="Garde-fous du dispositif multi-régimes">
            <p className="text-base mb-8 max-w-3xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Six pièges spécifiques à l'architecture multi-régimes s'ajoutent aux dix pièges de la v1.0.
              Chacun est une alerte à surveiller pour préserver l'intégrité du dispositif.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {pieges.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="p-5"
                  style={{ background: C.surface, borderLeft: `2px solid ${C.red}` }}
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span
                      className="font-serif font-light"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: C.red, lineHeight: 1 }}
                    >
                      {p.n}
                    </span>
                    <h4 className="font-serif text-base" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                    {p.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* 7 JOURS */}
          <Section id="jours" eyebrow="§ 07" title="Sept jours — actions concrètes">
            <p className="text-base mb-10 max-w-2xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Pour ne pas laisser ce document rester théorique. Aucune de ces actions ne prend plus de 90
              minutes cumulées — à l'exception de la réécriture de la bible (3-4h).
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
                    {a.n}
                  </div>
                  <p
                    className="text-base leading-relaxed pt-2"
                    style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}
                  >
                    {a.text}
                  </p>
                </motion.li>
              ))}
            </ol>
          </Section>

          {/* SYNTHÈSE */}
          <Section id="synthese" eyebrow="§ 08" title="Synthèse finale">
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
                  fontSize: "clamp(1.05rem, 2vw, 1.4rem)",
                  color: C.ivory,
                  fontWeight: 300,
                }}
              >
                Un·e auteur·e-ingénieur·e à temps partiel créatif tient une pratique hybride sur dix ans en
                opérant sous cinq régimes de signature rigoureusement séparés — une identité publique
                existante (FromScratch), un dispositif hétéronymique fictionnel collectif animant une revue
                culturelle indépendante (Kefta Matesha, dirigée par Noname, animée par la posse Moxo / Imran
                / Notche / GhostWriter / Blaise), un pseudonyme stable d'auteur·e solo (Altazar) portant les
                œuvres majeures signées en propre, et un pseudonyme interne de barrière (Morad) pour les
                documents de travail. La revue est le hub éditorial central — elle porte les œuvres
                endogènes (Pimpologist, Darkovsky) comme feuilleton, prépare le terrain des œuvres solo
                Altazar (La vie de ma mère, When I Get Free, Barzaq, tardives) comme écosystème culturel, et
                construit une audience propriétaire multi-entrées par la diversité de ses voix. La cohérence
                de l'ensemble ne se voit pas — elle est l'architecture invisible d'une œuvre qui assume
                d'être portée par plusieurs voix parce qu'une seule voix ne suffirait pas à dire ce que
                cette œuvre a à dire.
              </p>
            </motion.blockquote>
          </Section>

          <footer
            className="mt-20 md:mt-28 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <div>
              <div className="font-serif text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                STRAT<span style={{ color: C.gold }}>EX</span>
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>
                v2.0 · Kefta Matesha · Cinq régimes de signature
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: C.textDim }}>
                Prochaine révision
              </div>
              <div className="font-serif text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textMuted }}>
                à 12 mois — v3.0
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
