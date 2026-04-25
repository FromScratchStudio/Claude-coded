import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  bg: "#0a0c10",
  bgDeep: "#06080c",
  surface: "#141720",
  surfaceAlt: "#1a1e2a",
  border: "#252a38",
  borderLight: "#323849",
  gold: "#c9a84c",
  goldLight: "#e0c070",
  goldDim: "#8a6e30",
  text: "#e8e4dc",
  textSoft: "#c4c0b5",
  textMuted: "#8a8fa8",
  textDim: "#555b70",
  ivory: "#f4efe3",
  meta: "#9b6ec9",
  red: "#c94c5a",
  blue: "#4c7fc9",
  green: "#4caa7f",
  orange: "#d4834a",
  pink: "#c96e9b",
};

const heteronyms = [
  {
    id: "noname",
    letter: "B",
    name: "Noname",
    role: "Directeur·rice de rédaction Kefta Matesha",
    persona: "L'architecte invisible. Celui·celle qui laisse les autres être vus·es à sa place. Le paradoxe d'un nom qui déclare ne pas en être un.",
    ton: "On construit quelque chose qui dure. Mais ça reste sauvage.",
    color: C.gold,
    inspirations: [
      { nom: "Kanye West", œuvre: "My Beautiful Dark Twisted Fantasy, Yeezus", apport: "Architecture totale, coordination de multiples voix, vision maximaliste" },
      { nom: "Rick Rubin", œuvre: "Production Johnny Cash, Red Hot Chili Peppers, Kanye West, Jay-Z, Adele", apport: "Producteur·rice invisible qui révèle les autres plutôt que soi-même" },
      { nom: "Virgil Abloh", œuvre: "Off-White, Louis Vuitton, design, architecture, DJing", apport: "L'architecte qui construit des systèmes dans plusieurs domaines simultanément" },
      { nom: "Hideo Kojima", œuvre: "Metal Gear Solid, Death Stranding", apport: "Auteur·e qui impose sa vision malgré les contraintes, signatures cachées" },
      { nom: "Jean Giraud / Moebius", œuvre: "Blueberry, Arzach, L'Incal", apport: "Maîtrise graphique totale, basculement entre mondes" },
    ],
    lexique: "architecture · système · protocole · structure · cadre · pipeline · cohérence · vision · discipline · sauvage · construit · dure",
    playlist: [
      "The College Dropout → My Beautiful Dark Twisted Fantasy (arc Kanye)",
      "American Recordings de Johnny Cash (production Rick Rubin)",
      "Death Stranding (jeu vidéo Kojima)",
      "Arzach de Moebius",
      "Figures of Speech (catalogue Abloh, MCA Chicago)",
    ],
  },
  {
    id: "moxo",
    letter: "C",
    name: "Moxo",
    role: "Illustrateur principal — signe Pimpologist & Darkovsky",
    persona: "Le faiseur d'univers. Il travaille vite, instinctivement, avec une générosité folle. Seul hétéronyme du régime C qui signe des œuvres hors magazine.",
    ton: "T'as besoin d'un truc pour demain ? C'est fait.",
    color: C.gold,
    inspirations: [
      { nom: "Akira Toriyama", œuvre: "Dragon Ball, Dr. Slump", apport: "Trait cartoon énergique, sens du mouvement et de l'humour visuel" },
      { nom: "Moebius", œuvre: "Œuvre graphique complète", apport: "Maîtrise technique totale, entre figuration et abstraction" },
      { nom: "Taiyô Matsumoto", œuvre: "Tekkonkinkreet, Sunny, Ping Pong", apport: "Trait dysmorphique au service de la marge urbaine et psychologique" },
      { nom: "Ralph Steadman", œuvre: "Illustrations Hunter S. Thompson, Fear and Loathing", apport: "Déformation expressive, tache et énergie brute, satire visuelle" },
      { nom: "Katsuhiro Otomo", œuvre: "Akira, Domu", apport: "Densité urbaine, hyperréalisme au service du fantastique" },
    ],
    lexique: "trait · ligne · tache · mouvement · vitesse · planche · rough · clean · aplat · couleur · grain · matière",
    playlist: [
      "Tekkonkinkreet (manga + film animé Michael Arias)",
      "Dragon Ball premiers tomes",
      "Akira (film animé et manga)",
      "Illustrations Steadman pour Hunter S. Thompson",
      "Ping Pong (série animée 2014)",
    ],
  },
  {
    id: "imran",
    letter: "C",
    name: "Imran",
    role: "Poète et directeur artistique",
    persona: "Le veilleur. Ses mots arrivent comme des coups de poing en velours — précis, imagés, chargés.",
    ton: "Je dessine pas des formes. Je dessine des silences.",
    color: C.meta,
    inspirations: [
      { nom: "Kendrick Lamar", œuvre: "To Pimp a Butterfly, DAMN., Mr. Morale & The Big Steppers", apport: "Écriture dense, multiplication des voix intérieures, poésie hip-hop d'envergure" },
      { nom: "Jean-Michel Basquiat", œuvre: "Peinture, textes dans la peinture, figure Samo", apport: "Texte comme matière visuelle, poésie urbaine frontale" },
      { nom: "Saul Williams", œuvre: "The Dead Emcee Scrolls, Said the Shotgun to the Head", apport: "Poésie performée, lien entre oralité et écriture, politique incarnée" },
      { nom: "Chris Ware", œuvre: "Jimmy Corrigan, Building Stories, Rusty Brown", apport: "Maîtrise typographique, architecture de la page, silences et densité" },
      { nom: "Sonia Sanchez", œuvre: "Homegirls and Handgrenades, Shake Loose My Skin", apport: "Poésie noire, voix féminine forte, langue refaite" },
    ],
    lexique: "silence · image · matière · veille · veilleur · poésie · langue · souffle · vers · strophe · syntagme · interstice",
    playlist: [
      "To Pimp a Butterfly de Kendrick Lamar",
      "Catalogue rétrospective Basquiat",
      "The Dead Emcee Scrolls de Saul Williams",
      "Building Stories de Chris Ware",
      "Homegirls and Handgrenades de Sonia Sanchez",
    ],
  },
  {
    id: "notche",
    letter: "C",
    name: "Notche",
    role: "Scénariste et beatmaker",
    persona: "Le narrateur de la rue. Son écriture a un tempo. Il pense en séquences, en ambiances, en arcs.",
    ton: "Une histoire sans rythme, c'est juste des mots.",
    color: C.blue,
    inspirations: [
      { nom: "RZA", œuvre: "Wu-Tang Clan, Liquid Swords, bande-son Jim Jarmusch", apport: "Architecture narrative de beats, scénarisation musicale, sens cinématographique" },
      { nom: "J Dilla", œuvre: "Donuts, production Slum Village / Common / Erykah Badu / A Tribe Called Quest", apport: "Rythme comme narration pure, micro-timing, production émotionnelle" },
      { nom: "Frank Miller", œuvre: "The Dark Knight Returns, Sin City, 300, Ronin", apport: "Écriture BD noire, rythme séquentiel, ville-personnage" },
      { nom: "Alejandro González Iñárritu", œuvre: "Amores Perros, 21 Grams, Babel, Birdman", apport: "Structures narratives éclatées, arcs interconnectés, tragédie contemporaine" },
      { nom: "Osamu Tezuka", œuvre: "Astro Boy, Black Jack, Phoenix, Buddha", apport: "Maître du rythme narratif manga, séquences classiques, arc longue durée" },
    ],
    lexique: "tempo · rythme · séquence · arc · chapitre · beat · scène · temps · silence · pause · accélération · interlude",
    playlist: [
      "Liquid Swords de GZA (production RZA)",
      "Donuts de J Dilla",
      "The Dark Knight Returns de Frank Miller",
      "Amores Perros de Iñárritu",
      "Phoenix de Tezuka (3 premiers volumes)",
    ],
  },
  {
    id: "ghostwriter",
    letter: "C",
    name: "GhostWriter",
    role: "Parolier et graffeur",
    persona: "L'ombre qui parle fort. Double vie assumée — fantôme dans les coulisses, monument dans la rue.",
    ton: "Mon nom est partout. Personne sait que c'est moi.",
    color: C.red,
    inspirations: [
      { nom: "Banksy", œuvre: "Œuvre de rue, Dismaland, Exit Through the Gift Shop", apport: "Anonymat radical, œuvre qui parle pour l'absent, tension subversive" },
      { nom: "Arthur Rimbaud", œuvre: "Une saison en enfer, Illuminations, Lettres du voyant", apport: "Voix poétique jeune et frontale, renoncement comme geste final" },
      { nom: "Ghostface Killah", œuvre: "Wu-Tang Clan, Supreme Clientele, Fishscale", apport: "Écriture crue et poétique, nom qui contient déjà la persona" },
      { nom: "Jean-Michel Basquiat", œuvre: "(partagée avec Imran) — période Samo", apport: "Présence urbaine qui survit à l'absence de l'auteur, Samo comme figure ghost" },
      { nom: "Shepard Fairey", œuvre: "OBEY, Hope (Obama), œuvre de street art", apport: "Art de rue qui traverse underground et mainstream, signature qui devient symbole" },
    ],
    lexique: "ombre · mur · anonyme · tag · chronique · souterrain · voix-off · nuit · trace · signature · fantôme · écho",
    playlist: [
      "Illuminations de Rimbaud",
      "Exit Through the Gift Shop (film Banksy)",
      "Supreme Clientele de Ghostface Killah",
      "Photo-documentation Basquiat / Samo",
      "Catalogue OBEY Giant",
    ],
  },
  {
    id: "blaise",
    letter: "C",
    name: "Blaise",
    role: "Présence essentielle et indéfinie",
    persona: "Le mystère du groupe. On ne sait pas exactement ce qu'il fait, mais sa présence change quelque chose dans la pièce.",
    ton: "Je fais rien. Mais sans moi, rien se fait.",
    color: C.pink,
    inspirations: [
      { nom: "Andy Warhol", œuvre: "Factory, Interview magazine, œuvre totale", apport: "Présence qui transforme ce qu'elle approche, artiste comme catalyseur" },
      { nom: "Brian Eno", œuvre: "Music for Airports, production Talking Heads / U2, Oblique Strategies", apport: "Musicien qui n'est pas un musicien, génération de contraintes fructueuses" },
      { nom: "Marcel Duchamp", œuvre: "Ready-mades, Fontaine, Étant donnés, le jeu d'échecs", apport: "La pratique comme refus de la pratique, l'art comme présence" },
      { nom: "Flavor Flav", œuvre: "Public Enemy, l'hype man qui ne rappe pas", apport: "La fonction catalytique dans un collectif, présence joyeuse nécessaire" },
      { nom: "Leos Carax", œuvre: "Les Amants du Pont-Neuf, Holy Motors, Annette", apport: "Cinéaste rare, imprévisible, dont chaque film redéfinit le cadre" },
    ],
    lexique: "présence · passage · traversée · rien · presque · peut-être · déjà · encore · ailleurs · coïncidence · hasard · bizarre",
    playlist: [
      "Music for Airports de Brian Eno",
      "Oblique Strategies (cartes Eno / Peter Schmidt)",
      "Holy Motors de Leos Carax",
      "Biographie Factory (Warhol)",
      "Don't Believe the Hype de Public Enemy",
    ],
  },
];

const tensions = [
  {
    voix1: "Imran",
    voix2: "Notche",
    nature: "Image poétique vs rythme narratif",
    exemple: "Sur Pimpologist : Imran écrirait « Mr Moula est une tache rouge sur le visage de Casa Roja », Notche écrirait « Mr Moula entre en scène au moment où LUIS n'a plus de choix — c'est la règle du conte moral »",
  },
  {
    voix1: "Moxo",
    voix2: "GhostWriter",
    nature: "Signature assumée vs refus de la signature",
    exemple: "Débat possible dans un numéro sur « Signer ou pas : comment décider » où Moxo et GhostWriter prennent des positions opposées, modérés par Noname",
  },
  {
    voix1: "Noname",
    voix2: "Blaise",
    nature: "Architecture vs hasard",
    exemple: "Noname écrit un Labo très structuré, Blaise ajoute une note en marge : « hier j'ai mis les étapes dans le désordre. C'était mieux. »",
  },
  {
    voix1: "Imran",
    voix2: "GhostWriter",
    nature: "Poésie signée vs poésie anonyme",
    exemple: "Dialogue dans le numéro 5 (« Ceux qu'on ne voit pas ») sur ce que veut dire être un·e poète aujourd'hui",
  },
];

const transverses = [
  { ref: "Jean-Michel Basquiat", partage: ["Imran", "GhostWriter"] },
  { ref: "Moebius / Jean Giraud", partage: ["Noname", "Moxo"] },
  { ref: "Le Wu-Tang Clan", partage: ["Notche (RZA)", "GhostWriter (Ghostface Killah)"] },
  { ref: "Hip-hop comme culture", partage: ["Noname (Kanye)", "Imran (Kendrick)", "Notche (RZA / Dilla)", "GhostWriter (Ghostface)"] },
  { ref: "Art de rue", partage: ["GhostWriter (Banksy, Fairey)", "Imran (Basquiat / Samo)", "Blaise (l'inconnu qui passe)"] },
];

function Section({ id, eyebrow, title, subtitle, children, isIntro }) {
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
        {subtitle && (
          <p className="mt-4 text-base md:text-lg max-w-2xl" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </motion.section>
  );
}

function HeteronymCard({ h, expanded, onToggle }) {
  return (
    <motion.div
      layout
      className="cursor-pointer"
      style={{
        background: C.surface,
        border: `1px solid ${expanded ? h.color : C.border}`,
        borderLeft: `3px solid ${h.color}`,
      }}
      onClick={onToggle}
    >
      <div className="p-5 md:p-7">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-baseline gap-5 min-w-0 flex-1">
            <span
              className="font-serif font-light flex-shrink-0"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.2rem",
                color: h.color,
                lineHeight: 0.9,
              }}
            >
              {h.letter}
            </span>
            <div className="min-w-0 flex-1">
              <h3
                className="font-serif font-light leading-tight mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 3vw, 1.9rem)", color: C.ivory }}
              >
                {h.name}
              </h3>
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: C.textMuted }}>
                {h.role}
              </div>
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 45 : 0 }} className="flex-shrink-0 mt-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke={h.color} strokeWidth="1" />
            </svg>
          </motion.div>
        </div>

        {!expanded && (
          <p
            className="text-sm italic mt-4"
            style={{ color: C.textSoft, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
          >
            « {h.ton} »
          </p>
        )}

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-5 mt-5 space-y-6" style={{ borderTop: `1px solid ${C.border}` }}>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: h.color }}>
                    Persona
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                    {h.persona}
                  </p>
                </div>

                <div
                  className="p-4"
                  style={{ background: C.bgDeep, borderLeft: `2px solid ${h.color}` }}
                >
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: h.color }}>
                    Ton
                  </div>
                  <p
                    className="italic leading-snug"
                    style={{ color: C.ivory, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem" }}
                  >
                    « {h.ton} »
                  </p>
                </div>

                <div>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: h.color }}>
                    Inspirations déclarées
                  </div>
                  <div className="space-y-4">
                    {h.inspirations.map((insp, i) => (
                      <div key={i} className="pl-4" style={{ borderLeft: `1px solid ${C.border}` }}>
                        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
                          <div
                            className="font-serif text-base font-medium"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory, fontSize: "1.3rem" }}
                          >
                            {insp.nom}
                          </div>
                        </div>
                        <div className="text-xs italic mb-2" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                          {insp.œuvre}
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                          {insp.apport}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: h.color }}>
                    Lexique suggéré
                  </div>
                  <p
                    className="text-sm italic leading-relaxed"
                    style={{ color: C.textSoft, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
                  >
                    {h.lexique}
                  </p>
                </div>

                <div>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: h.color }}>
                    Pour entrer dans {h.name}
                  </div>
                  <ul className="space-y-2 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                    {h.playlist.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span style={{ color: h.color }}>·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const sections = [
  { id: "preambule", label: "Préambule" },
  { id: "noname", label: "Noname" },
  { id: "moxo", label: "Moxo" },
  { id: "imran", label: "Imran" },
  { id: "notche", label: "Notche" },
  { id: "ghostwriter", label: "GhostWriter" },
  { id: "blaise", label: "Blaise" },
  { id: "tensions", label: "Tensions" },
  { id: "transverses", label: "Transverses" },
  { id: "methode", label: "Méthode" },
];

export default function ReferentielV11() {
  const [expanded, setExpanded] = useState("noname");
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

      {/* NAV desktop */}
      <nav
        className="hidden lg:block fixed left-0 top-0 h-screen py-16 px-8 z-40 overflow-y-auto"
        style={{ width: "220px", borderRight: `1px solid ${C.border}`, background: `${C.bgDeep}cc`, backdropFilter: "blur(8px)" }}
      >
        <div className="font-serif text-xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
          Référentiel
        </div>
        <div className="font-mono text-[9px] tracking-[0.2em] uppercase mb-10" style={{ color: C.textDim }}>
          v1.1 · inspirations posse
        </div>
        <ul className="space-y-3">
          {sections.map((s, i) => {
            const active = activeSection === s.id;
            return (
              <li key={s.id}>
                <button onClick={() => scrollTo(s.id)} className="group flex items-center gap-3 text-left w-full">
                  <span className="font-mono text-[10px]" style={{ color: active ? C.gold : C.textDim }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs tracking-wider uppercase" style={{ color: active ? C.ivory : C.textMuted }}>
                    {s.label}
                  </span>
                  {active && <div className="w-4 h-px" style={{ background: C.gold }} />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile nav */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50"
        style={{ background: `${C.bgDeep}ee`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div className="font-serif text-lg font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Référentiel <span className="font-mono text-[10px]" style={{ color: C.textDim }}>v1.1</span>
          </div>
          <button onClick={() => setNavOpen(!navOpen)} className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: C.gold }}>
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
          className="relative min-h-[80vh] flex flex-col justify-between px-6 md:px-16 pt-24 md:pt-20 pb-16 overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${C.bgDeep} 0%, ${C.bg} 100%)` }}
        >
          <div className="noise absolute inset-0 opacity-[0.03] pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="h-px w-12" style={{ background: C.gold }} />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: C.gold }}>
              Version 1.1 · Inspirations de la posse Kefta Matesha
            </span>
          </div>

          <div className="relative z-10 max-w-5xl">
            <h1
              className="font-serif font-light leading-[0.95] mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(3rem, 9vw, 7rem)",
                letterSpacing: "-0.02em",
                color: C.ivory,
              }}
            >
              Référentiel<span style={{ color: C.gold }}>.</span>
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
              Les inspirations déclarées des six hétéronymes de Kefta Matesha.
            </p>
            <p className="max-w-2xl text-sm leading-relaxed" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Complément au référentiel v1.0 (références projets). Cette version 1.1 ajoute les ancrages d'écriture
              de chaque voix de la posse. Document interne — à relire avant l'écriture de chaque voix.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 md:gap-12 max-w-3xl pt-12" style={{ borderTop: `1px solid ${C.border}` }}>
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: C.textDim }}>
                Voix
              </div>
              <div className="font-serif text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                06 hétéronymes
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: C.textDim }}>
                Inspirations
              </div>
              <div className="font-serif text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.gold }}>
                30 déclarées
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: C.textDim }}>
                Tensions
              </div>
              <div className="font-serif text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                04 frictions
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-16 max-w-5xl">
          {/* PREAMBULE */}
          <Section
            id="preambule"
            eyebrow="§ 01"
            title="Ce qui change en v1.1"
            subtitle="La v1.0 listait les références projet par projet. La v1.1 ajoute les inspirations des hétéronymes — ce qui ancre chaque voix dans son territoire culturel propre."
            isIntro
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6" style={{ background: C.surface, borderLeft: `2px solid ${C.gold}` }}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: C.gold }}>
                  Ce que v1.1 ajoute
                </div>
                <ul className="space-y-2 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                  <li><span style={{ color: C.gold }}>·</span> 5 inspirations déclarées par hétéronyme</li>
                  <li><span style={{ color: C.gold }}>·</span> Ton, lexique, playlist par voix</li>
                  <li><span style={{ color: C.gold }}>·</span> Matrice des tensions entre voix</li>
                  <li><span style={{ color: C.gold }}>·</span> Cartographie transverse (socle hip-hop + rue)</li>
                  <li><span style={{ color: C.gold }}>·</span> Méthode d'usage enrichie</li>
                </ul>
              </div>
              <div className="p-6" style={{ background: C.surfaceAlt, borderLeft: `2px solid ${C.meta}` }}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: C.meta }}>
                  Usage recommandé
                </div>
                <ul className="space-y-2 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                  <li><span style={{ color: C.meta }}>·</span> Relire la voix avant d'écrire</li>
                  <li><span style={{ color: C.meta }}>·</span> Revisiter une œuvre fondatrice si &gt; 3 semaines sans écrire</li>
                  <li><span style={{ color: C.meta }}>·</span> Test mensuel de cohérence des voix</li>
                  <li><span style={{ color: C.meta }}>·</span> Enrichir au fil des découvertes</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* HETERONYMES */}
          {heteronyms.map((h) => (
            <Section
              key={h.id}
              id={h.id}
              eyebrow={`§ ${String(heteronyms.indexOf(h) + 2).padStart(2, "0")} · Régime ${h.letter}`}
              title={h.name}
              subtitle={h.role}
            >
              <HeteronymCard
                h={h}
                expanded={expanded === h.id}
                onToggle={() => setExpanded(expanded === h.id ? null : h.id)}
              />
            </Section>
          ))}

          {/* TENSIONS */}
          <Section
            id="tensions"
            eyebrow="§ 08"
            title="Tensions entre les voix"
            subtitle="Une des forces du dispositif hétéronymique : les voix ne sont pas interchangeables. Chacune pense différemment, aime différemment, refuse différemment. Ces lignes de friction sont à nourrir explicitement dans l'écriture des numéros."
          >
            <div className="space-y-4">
              {tensions.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="p-6"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}
                >
                  <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                    <span
                      className="font-serif font-light"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: C.ivory }}
                    >
                      {t.voix1}
                    </span>
                    <span className="font-mono text-xs tracking-widest uppercase" style={{ color: C.red }}>
                      vs
                    </span>
                    <span
                      className="font-serif font-light"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: C.ivory }}
                    >
                      {t.voix2}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: C.textMuted }}>
                      Nature de la tension
                    </div>
                    <p className="text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                      {t.nature}
                    </p>
                  </div>
                  <div
                    className="p-4"
                    style={{ background: C.bgDeep, borderLeft: `2px solid ${C.orange}` }}
                  >
                    <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: C.orange }}>
                      Exemple concret
                    </div>
                    <p
                      className="text-sm italic leading-relaxed"
                      style={{ color: C.textSoft, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
                    >
                      {t.exemple}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* TRANSVERSES */}
          <Section
            id="transverses"
            eyebrow="§ 09"
            title="Inspirations transverses"
            subtitle="Certaines références sont partagées par plusieurs hétéronymes. Elles constituent le socle culturel commun de Kefta Matesha — le hip-hop et l'art de rue comme bases, ramifications vers la haute littérature, le manga, l'art contemporain."
          >
            <div className="space-y-3">
              {transverses.map((t, i) => (
                <div key={i} className="p-5" style={{ background: C.surface, borderLeft: `2px solid ${C.gold}` }}>
                  <div
                    className="font-serif font-medium mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory, fontSize: "1.5rem" }}
                  >
                    {t.ref}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {t.partage.map((v, j) => (
                      <span
                        key={j}
                        className="inline-block px-3 py-1 font-mono text-xs"
                        style={{ background: `${C.gold}15`, color: C.gold, border: `1px solid ${C.gold}40` }}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6" style={{ background: C.surfaceAlt, borderLeft: `3px solid ${C.blue}` }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: C.blue }}>
                À enrichir progressivement
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                Trois directions d'élargissement identifiées pour nourrir la posse au fil des numéros :
              </p>
              <ul className="space-y-2 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                <li className="flex gap-3">
                  <span style={{ color: C.blue }}>·</span>
                  <span>Références maghrébines / nord-africaines contemporaines — cohérent avec Casa Roja / kefta matesha</span>
                </li>
                <li className="flex gap-3">
                  <span style={{ color: C.blue }}>·</span>
                  <span>Références asiatiques au-delà du manga japonais (cinéma hongkongais, coréen, singapourien)</span>
                </li>
                <li className="flex gap-3">
                  <span style={{ color: C.blue }}>·</span>
                  <span>Références latino-américaines (réalisme magique, cinéma mexicain)</span>
                </li>
              </ul>
            </div>
          </Section>

          {/* METHODE */}
          <Section
            id="methode"
            eyebrow="§ 10"
            title="Méthode d'usage"
            subtitle="Deux usages complémentaires : lors du démarrage d'un projet (v1.0) et lors de l'écriture d'une voix (v1.1)."
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.gold }}>
                  Démarrage d'un projet (v1.0)
                </div>
                <ol className="space-y-3 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                  {[
                    "Relire le tableau de références du projet",
                    "Étudier le moodboard visuel si disponible",
                    "Retrouver 2–3 œuvres qui touchent particulièrement",
                    "Les revisiter (relecture, revisionnage)",
                    "Extraire ce qui attire et ce qui repousse",
                    "Construire un moodboard de travail personnel",
                    "Le garder à portée pendant toute la durée du projet",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className="font-mono font-light flex-shrink-0"
                        style={{ color: C.goldDim, fontSize: "0.9rem" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.meta }}>
                  Écriture d'une voix (v1.1)
                </div>
                <ol className="space-y-3 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                  {[
                    "Ouvrir le carnet persona de la voix concernée",
                    "Relire les inspirations déclarées",
                    "Relire le ton et le lexique suggéré",
                    "Si > 3 semaines sans écrire cette voix : revisiter une œuvre fondatrice (20 min album ou 10 pages)",
                    "Écrire en se gardant de la contamination par d'autres voix",
                    "Relire après pause : est-ce que c'est bien X qui parle, pas Y ?",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className="font-mono font-light flex-shrink-0"
                        style={{ color: C.meta, fontSize: "0.9rem" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-10 p-6 md:p-8" style={{ background: C.bgDeep, border: `1px solid ${C.orange}40` }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: C.orange }}>
                Test mensuel de cohérence des voix
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                Une fois par mois, prendre un texte écrit ce mois-ci et se demander : <em>« si je ne savais pas qui l'a écrit, est-ce que j'identifierais la voix à coup sûr ? »</em>
              </p>
              <ul className="space-y-2 text-sm" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                <li className="flex gap-3">
                  <span style={{ color: C.green }}>✓</span>
                  <span>Oui pour tous les textes → le dispositif tient</span>
                </li>
                <li className="flex gap-3">
                  <span style={{ color: C.red }}>✕</span>
                  <span>Non pour un texte → retravailler cette voix, relire carnet persona, revisiter inspirations</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 p-6" style={{ background: C.surface, borderLeft: `2px solid ${C.textMuted}` }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: C.textMuted }}>
                Honnêteté méthodologique
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                Les inspirations citées sont ce que les personas <em>déclarent</em> aimer. Cela ne signifie pas que
                tu (l'auteur·e réel·le) partages toutes ces admirations avec la même intensité. Règle interne : chaque
                inspiration déclarée doit être au moins <strong style={{ color: C.ivory }}>effleurée sincèrement</strong> par
                toi. Tu n'es pas obligé·e d'adorer Flavor Flav, mais tu dois au moins avoir compris ce que Flavor Flav
                fait dans Public Enemy pour pouvoir écrire Blaise.
              </p>
            </div>
          </Section>

          {/* FOOTER */}
          <footer
            className="mt-20 md:mt-32 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <div>
              <div className="font-serif text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Référentiel<span style={{ color: C.gold }}>.</span>
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>
                v1.1 · Inspirations de la posse Kefta Matesha · Document interne
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: C.textDim }}>
                À enrichir
              </div>
              <div className="font-serif text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textMuted }}>
                au fil des numéros Kefta Matesha
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
