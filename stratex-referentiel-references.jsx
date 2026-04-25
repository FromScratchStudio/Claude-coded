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

const projects = [
  {
    num: "01",
    title: "The Pimpologist",
    veine: "social",
    veineLabel: "Morale sociale urbaine",
    heart: "Trait cartoon déformé expressif sur décors sobres, registre mixte tragédie + ironie cartoon, univers urbain fictionnel (Casaroja), cosmologie anges-démons.",
    refs: [
      { author: "Taiyô Matsumoto", work: "Tekkonkinkreet, Sunny", context: "Lignée du trait cartoon déformé au service de la marge urbaine et de la dissociation psychique" },
      { author: "Bastien Vivès", work: "Registres urbains", context: "Parenté stylistique (trait expressif + sujets urbains)" },
      { author: "Brecht Evens", work: "Œuvre en général", context: "Déformation expressive, traitement de la pauvreté et de la marge" },
      { author: "Tomer Hanuka", work: "Œuvre en général", context: "Trait cartoon+réaliste mêlé, énergie graphique urbaine" },
      { author: "Masaaki Yuasa", work: "Mind Game", context: "Énergie expressive, dysmorphie volontaire" },
      { author: "Jason Latour", work: "Loose Ends", context: "Tension décors sobres / personnages cartoon" },
      { author: "Geof Darrow", work: "Shaolin Cowboy", context: "Pages à haute densité graphique" },
      { author: "Garth Ennis & Steve Dillon", work: "Preacher", context: "Coexistence ton parodique et gravité métaphysique, démons/anges au premier degré" },
      { author: "Todd McFarlane", work: "Spawn", context: "Pacte faustien, moralité grise, iconographie sombre" },
      { author: "Matt Fraction", work: "Casanova", context: "Registre mixte soutenu par l'auteur" },
      { author: "Vince Gilligan", work: "Breaking Bad", context: "Moralité grise sérieuse, descente du protagoniste" },
      { author: "Alan Moore & Dave Gibbons", work: "Watchmen", context: "Territoire de la moralité grise et déconstruction du héros" },
      { author: "Garth Ennis", work: "The Boys", context: "Moralité grise, déconstruction héroïque" },
      { author: "Tom Kapinos et al.", work: "Lucifer (série)", context: "Démon principal sympathique, pacte" },
      { author: "Neil Gaiman & Terry Pratchett", work: "Good Omens", context: "Anges et démons qui dialoguent et parient" },
      { author: "Neil Gaiman", work: "American Gods", context: "Figures divines en coulisses du monde moderne" },
      { author: "Hikaru Nakamura", work: "Saint Young Men", context: "Dieux en quotidien urbain" },
      { author: "Rockstar Games", work: "Grand Theft Auto", context: "Urbain ludique/parodique cité comme registre possible" },
      { author: "Mathieu Kassovitz", work: "La Haine", context: "Registre drame urbain cité comme alternative tonale" },
      { author: "Dante Alighieri", work: "La Divine Comédie", context: "Allégorie morale structurée" },
      { author: "C.S. Lewis", work: "Chroniques de Narnia", context: "Allégorie spirituelle explicite" },
      { author: "Frank Miller", work: "Sin City", context: "Ville-personnage noire" },
      { author: "Bob Kane et al.", work: "Gotham (Batman)", context: "Ville-personnage iconique" },
      { author: "Frank Miller / Brian Michael Bendis", work: "La New York de Daredevil", context: "Ville-personnage" },
      { author: "Jirô Taniguchi", work: "Quartier lointain", context: "Texture BD auteuriste" },
    ],
    palette: "Rouge-ocre dominant (cohérent avec les planches existantes), noirs profonds, accents jaunes chauds.",
    grammar: "Figures déformées avec grandes oreilles, visages longs, corps étirés ; décors urbains réalistes en contrepoint ; lettering vivant et argotique ; typographie handwritten pour les voix-off ; cadres irréguliers quand la scène bascule dans le surnaturel.",
    signature: "Le chapeau rouge hypertrophique de Mr Moula — à traiter comme signature visuelle récurrente.",
  },
  {
    num: "02",
    title: "La vie de ma mère",
    veine: "social",
    veineLabel: "Morale sociale urbaine",
    heart: "Court métrage social, juxtaposition discours politique / réalité silencieuse, structure flashback autour d'un pic de crise.",
    refs: [
      { author: "Jacques Audiard", work: "Un Prophète", context: "Crime comme symptôme économique et social" },
      { author: "Ladj Ly", work: "Les Misérables (2019)", context: "Spécificité géographique et grammaire visuelle de Montfermeil" },
      { author: "Victor Hugo / adaptations", work: "Les Misérables", context: "Racines du motif « crime par dignité familiale »" },
      { author: "Frères Dardenne", work: "Rosetta", context: "Drame social réaliste, précarité économique" },
      { author: "Stéphane Brizé", work: "La Loi du marché", context: "Drame social réaliste, ton juste" },
      { author: "Cinéma français", work: "Films de Roubaix, Marseille, banlieues", context: "Spécificité géographique urbaine comme principe" },
    ],
    palette: "Sobre et grisée, grain doux, lumières domestiques chaudes en contrepoint des néons pharmaceutiques et des écrans de télévision.",
    grammar: "Caméra proche des visages, téléviseurs omniprésents en arrière-plan, intérieurs modestes mais précis, faible profondeur de champ, durées longues sur les silences.",
    signature: "Le téléviseur politique en arrière-plan des scènes intimes — à traiter avec variété de registres (politique, publicité, talk-show, reportage) pour éviter le didactisme du discours unique.",
  },
  {
    num: "03",
    title: "When I Get Free",
    veine: "social",
    veineLabel: "Morale sociale urbaine",
    heart: "Tragédie sociale longue, double miroir finance/trafic, structure à trois (Adam / Youssouf / le frère mort), fin tragique-transmissive.",
    refs: [
      { author: "Michael Lewis", work: "The Big Short, Flash Boys", context: "Critique non-fictionnelle de la finance comme violence légale" },
      { author: "Adam McKay", work: "The Big Short (film)", context: "Risque de l'exposition didactique" },
      { author: "J.C. Chandor", work: "Margin Call", context: "Thriller économique sans exposition, tension des décisions" },
      { author: "Jesse Armstrong", work: "Succession", context: "Finance, dynastie, tragédie familiale" },
      { author: "Roberto Saviano", work: "Gomorra (livre et série)", context: "Trafic traité sans héroïsation ni didactisme" },
      { author: "Martin Scorsese", work: "The Wolf of Wall Street", context: "Satire noire côté critique" },
      { author: "Mickey Down & Konrad Kay", work: "Industry (HBO)", context: "Thriller économique contemporain" },
      { author: "Francis Ford Coppola", work: "The Godfather", context: "Tragédie du bascule moral, structure à 3 (Michael/Sonny/Kay)" },
      { author: "Vince Gilligan", work: "Breaking Bad", context: "Tragédie avec ironie, structure à 3 (Walt/Jesse/Skyler)" },
      { author: "Michael Mann", work: "Heat", context: "Structure miroir (De Niro/Pacino), tiers (Eady)" },
      { author: "Martin Scorsese", work: "The Departed", context: "Structure miroir taupe/infiltré" },
      { author: "Vince Gilligan et al.", work: "Better Call Saul", context: "Bascule graduelle, compromission morale" },
      { author: "Rapman", work: "Blue Story", context: "Quartier britannique, tragédie de rue" },
      { author: "Ronan Bennett", work: "Top Boy", context: "Quartier britannique, trafic mis en récit" },
      { author: "2Pac / Tupac Shakur", work: "When I Get Free", context: "Figure tutélaire du titre, scène d'exposition musicale" },
      { author: "Rachid Djaïdani", work: "Œuvre", context: "Littérature quartier francophone" },
      { author: "Édouard Louis", work: "Œuvre", context: "Littérature du déclassement contemporain" },
      { author: "Leïla Slimani", work: "Œuvre", context: "Littérature française contemporaine" },
      { author: "Jean-Claude Izzo", work: "Trilogie marseillaise", context: "Noir social français" },
      { author: "Paul Thomas Anderson", work: "There Will Be Blood", context: "Fin tragique où la victoire laisse vide" },
      { author: "Alejandro González Iñárritu", work: "Birdman", context: "Fin tragique, victoire ambiguë" },
      { author: "Kenneth Lonergan", work: "Manchester by the Sea", context: "Connaissance asymétrique, deuil caché" },
      { author: "Barry Jenkins", work: "Moonlight", context: "Connaissance asymétrique, silence et charge" },
    ],
    palette: "Double contraste — bleus-gris urbains et ocres pâles des intérieurs financiers ; verts sombres et lumières jaunes des espaces de trafic ; lumières nocturnes urbaines.",
    grammar: "Jeu sur les mains (signatures, poignées de main, téléphones), contraste textile fort (costume Adam vs streetwear Youssouf), cadres serrés sur visages aux moments de bascule morale, parallèles visuels entre salle de marché et point de deal.",
    signature: "La plateforme numérique — à visualiser comme un espace graphique récurrent (interface, écrans, flux de transactions anonymisées).",
  },
  {
    num: "04",
    title: "Barzaq",
    veine: "meta",
    veineLabel: "Métaphysique et civilisation",
    heart: "SF métaphysique dialoguant avec la tradition islamique du Barzakh, paradoxe « pour survivre il faut accepter de mourir », voyage spatial puis checkpoint personnel.",
    refs: [
      { author: "Stanisław Lem / Tarkovski / Soderbergh", work: "Solaris", context: "Conscience cosmique, mémoire comme territoire habité" },
      { author: "Ted Chiang / Denis Villeneuve", work: "Arrival / L'Histoire de ta vie", context: "Langage et perception du temps, choix tragique conscient" },
      { author: "Christopher Nolan", work: "Interstellar", context: "Amour et temps comme dimensions physiques" },
      { author: "Liu Cixin", work: "The Three-Body Problem", context: "Extraterrestre comme métaphysique matérialiste" },
      { author: "Morten Tyldum", work: "Passengers", context: "Voyage spatial générationnel (contre-exemple)" },
      { author: "Jeff VanderMeer / Alex Garland", work: "Annihilation", context: "Zone comme transformation ontologique" },
      { author: "Pella Kågerman & Hugo Lilja", work: "Aniara", context: "Vaisseau-générationnel dérivant, microsociété en dérive" },
      { author: "Bong Joon-ho", work: "Snowpiercer", context: "Microsociété en espace clos, stratification sociale" },
      { author: "J.G. Ballard", work: "High-Rise", context: "Microsociété close et décomposition sociale" },
      { author: "Andreï Tarkovski", work: "Stalker", context: "SF métaphysique d'auteur, zone sacrée" },
      { author: "Terrence Malick", work: "The Tree of Life", context: "Poétique spirituelle cosmologique" },
      { author: "Greg Egan", work: "Œuvre", context: "Hard SF cosmologique spéculative" },
      { author: "Iain M. Banks", work: "Cycle de la Culture", context: "Espèce non-humaine régulatrice sophistiquée" },
      { author: "Ursula K. Le Guin", work: "Œuvre", context: "SF humaniste à dimension anthropologique" },
      { author: "Frank Capra", work: "It's a Wonderful Life", context: "Archétype du sauvetage-à-l'instant-du-suicide" },
      { author: "Fiodor Dostoïevski", work: "Les Frères Karamazov", context: "Grande œuvre métaphysique" },
      { author: "Rûmî", work: "Masnavi", context: "Vérité traversée par le doute, mystique islamique" },
      { author: "Ibn 'Arabi", work: "Œuvre", context: "Mystique islamique et concept de Barzakh" },
      { author: "Marilynne Robinson", work: "Gilead", context: "Écrire depuis la foi avec exigence littéraire" },
      { author: "Martin Heidegger", work: "Être et Temps", context: "Être-pour-la-mort comme condition de l'authenticité" },
    ],
    palette: "Palette bicéphale — vaisseau (gris, bleu, acier, blancs froids, silence visuel) et checkpoints (or, violet, blanc saturé, iridescences, énergie pure).",
    grammar: "Deux régimes formels contrastés — la froideur contemplative du voyage (plans larges, symétries, durées longues) et l'intensité sensorielle des checkpoints (gros plans, lumières mouvantes, flou, transparences).",
    signature: "Le basculement chromatique au passage du checkpoint — à orchestrer comme transition visuelle majeure de l'œuvre.",
  },
  {
    num: "05",
    title: "Darkovsky",
    veine: "social",
    veineLabel: "Extension Pimpologist",
    heart: "Conte fantastique sériel, faucheur d'âmes damnées pactisé avec le Diable, ton cynique-mélancolique.",
    refs: [
      { author: "Marvel Studios", work: "Marvel Cinematic Universe", context: "Modèle d'univers partagé assumé" },
      { author: "Stephen King", work: "La Tour sombre", context: "Multiverse personnel d'auteur, univers croisés" },
    ],
    explore: [
      { author: "Neil Gaiman", work: "The Sandman", note: "Morpheus comme figure lasse du devoir éternel" },
      { author: "Neil Gaiman", work: "Death: The High Cost of Living", note: "Figure de la mort humanisée" },
      { author: "Mike Mignola", work: "Hellboy", note: "Figure surnaturelle mélancolique entre les mondes" },
    ],
    palette: "À construire lors du démarrage — piste : palette sombre nocturne.",
    grammar: "Trait plus fin et plus cerné que Pimpologist, personnage de Darkovsky iconique (silhouette reconnaissable).",
    signature: "À définir.",
  },
  {
    num: "06",
    title: "Endormis",
    veine: "meta",
    veineLabel: "Métaphysique et civilisation",
    heart: "Fable dialectique IA à twist final, deux enfants qui découvrent le monde, révèlent être des IA d'un chercheur.",
    refs: [
      { author: "Ted Chiang / Denis Villeneuve", work: "Arrival", context: "Twist qui reconfigure rétrospectivement sans démentir" },
    ],
    explore: [
      { author: "Christopher Nolan", work: "The Prestige", note: "Twist reconfigurant" },
      { author: "Alex Garland", work: "Ex Machina", note: "IA et question du vivant" },
      { author: "Jonathan Nolan", work: "Westworld", note: "Personnages-IA qui ignorent leur nature" },
    ],
    palette: "À construire — esthétique en deux temps, lumineuse-pure pendant la fable, révélatrice au twist.",
    grammar: "À définir lors du démarrage du projet.",
    signature: "À définir.",
  },
  {
    num: "07",
    title: "COCORICO",
    veine: "respiration",
    veineLabel: "Respiration tendre",
    heart: "Famille de poulets séparée, quête de retrouvailles, mythe explicatif du chant du coq à l'aube.",
    refs: [
      { author: "Richard Adams", work: "Watership Down", context: "Prendre les animaux au sérieux comme êtres vivants" },
      { author: "Jean de La Fontaine", work: "Fables", context: "Tradition de la fable animalière morale" },
      { author: "Ésope", work: "Fables", context: "Racines du genre" },
    ],
    explore: [
      { author: "Anonyme", work: "Le Roman de Renart", note: "Tradition médiévale française" },
      { author: "Art Spiegelman", work: "Maus", note: "Sérieux appliqué à des animaux anthropomorphes" },
      { author: "Aardman Animations", work: "Chicken Run", note: "Ton et registre familial" },
    ],
    palette: "Palette chaude et tendre, lumière montagneuse rurale.",
    grammar: "Trait cartoon plus rond et plus doux que les autres projets, décors soignés.",
    signature: "Le chant du coq à l'aube comme élément narratif récurrent.",
  },
  {
    num: "08",
    title: "FOLIE NATURELLE",
    veine: "meta",
    veineLabel: "Métaphysique et civilisation",
    heart: "Comédie dramatique dystopique IA, résistance par l'imprévisibilité, registre mixte comédie absurde + humour noir + spiritualité poétique.",
    refs: [
      { author: "Milan Kundera", work: "Œuvre", context: "Maîtrise du registre comédie + drame + philosophie" },
      { author: "Boris Vian", work: "Œuvre", context: "Absurde et gravité mêlés" },
      { author: "Raymond Queneau", work: "Œuvre", context: "Jeu avec la langue, comédie savante" },
      { author: "Jacques Tardi", work: "Certaines BD", context: "Mixité de registre en BD" },
      { author: "George Orwell", work: "1984", context: "Totalitarisme dystopique" },
      { author: "Aldous Huxley", work: "Le Meilleur des mondes", context: "Dystopie de confort" },
      { author: "Ray Bradbury", work: "Fahrenheit 451", context: "Résistance culturelle" },
    ],
    explore: [
      { author: "Terry Gilliam", work: "Brazil", note: "Dystopie absurde" },
      { author: "Charlie Brooker", work: "Black Mirror", note: "IA et société" },
      { author: "Mike Judge", work: "Idiocracy", note: "Humour noir politique" },
    ],
    palette: "Esthétique contrastée entre cadres sobres et lisses de la société IA et ruptures graphiques des scènes de résistance.",
    grammar: "À construire lors du démarrage du projet.",
    signature: "Les quatrains poétiques comme ponctuation récurrente.",
  },
  {
    num: "09",
    title: "Simply 21",
    veine: "meta",
    veineLabel: "Métaphysique et civilisation",
    heart: "Fable post-apocalyptique — survivants atteints de trisomie 21, arrivée d'un enfant « normal » qui va mal tourner.",
    refs: [
      { author: "Cormac McCarthy", work: "The Road", context: "Post-apocalyptique d'auteur" },
      { author: "P.D. James / Alfonso Cuarón", work: "Children of Men", context: "Survie d'une espèce fragile" },
    ],
    explore: [
      { author: "Emily St. John Mandel", work: "Station Eleven", note: "Post-effondrement culturel" },
      { author: "Kazuo Ishiguro", work: "Never Let Me Go", note: "Dignité des personnages marginalisés" },
    ],
    palette: "À construire après consultations éthiques préalables.",
    grammar: "Trait cartoon déformé de Pimpologist potentiellement approprié pour déjouer la représentation réaliste problématique.",
    signature: "Village post-urbain où la nature a repris le dessus — Casa Mecanica en écho à Casaroja.",
  },
];

const transversal = {
  modeles: [
    { author: "Fiodor Dostoïevski", note: "Morale sociale (Crime et Châtiment) + métaphysique (Karamazov)" },
    { author: "Andreï Tarkovski", note: "Intime (Le Miroir) + métaphysique (Stalker, Solaris)" },
    { author: "Denis Villeneuve", note: "Social (Polytechnique) + SF cosmologique (Arrival, Blade Runner 2049)" },
    { author: "Ursula K. Le Guin", note: "Anthropologie + SF métaphysique" },
    { author: "Liu Cixin", note: "Hard SF + métaphysique" },
  ],
  avertissements: [
    { author: "Philip K. Dick", note: "Auteur prolifique mort avec 30 projets inachevés" },
    { author: "Franz Kafka", note: "Auteur refusant la publication de la plupart de son œuvre" },
  ],
  esthetique: [
    { author: "Jirô Taniguchi", work: "Quartier lointain", note: "Texture BD auteuriste, intériorité" },
    { author: "Chris Ware", work: "Building Stories", note: "Densité roman graphique" },
  ],
};

function VeineBadge({ veine, label }) {
  const color = veine === "social" ? C.gold : veine === "meta" ? C.meta : C.respiration;
  return (
    <div className="inline-flex items-center gap-2" style={{ color }}>
      <div className="w-1 h-3" style={{ background: color }} />
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase">{label}</span>
    </div>
  );
}

function RefRow({ ref_, color }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-3 grid grid-cols-12 gap-3 md:gap-5 items-start"
      style={{ borderBottom: `1px solid ${C.border}` }}
    >
      <div className="col-span-12 md:col-span-3">
        <div
          className="font-serif text-base md:text-lg"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory, lineHeight: 1.2 }}
        >
          {ref_.author}
        </div>
      </div>
      <div className="col-span-12 md:col-span-4">
        <div className="font-mono text-xs italic" style={{ color: color, letterSpacing: "0.02em" }}>
          {ref_.work}
        </div>
      </div>
      <div className="col-span-12 md:col-span-5">
        <div className="text-sm leading-snug" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
          {ref_.context || ref_.note}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectSection({ project, expanded, onToggle }) {
  const color =
    project.veine === "social" ? C.gold : project.veine === "meta" ? C.meta : C.respiration;

  return (
    <motion.div
      layout
      className="mb-4"
      style={{
        background: C.surface,
        border: `1px solid ${expanded ? color : C.border}`,
        borderLeft: `2px solid ${color}`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 md:p-7 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-baseline gap-4 min-w-0 flex-1">
            <span className="font-mono text-xs tracking-[0.2em]" style={{ color: C.textDim }}>
              § {project.num}
            </span>
            <div className="min-w-0 flex-1">
              <h3
                className="font-serif font-light leading-tight mb-2"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  color: C.ivory,
                }}
              >
                {project.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-3">
                <VeineBadge veine={project.veine} label={project.veineLabel} />
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: C.textDim }}>
                  {project.refs.length} références
                  {project.explore && ` · ${project.explore.length} pistes`}
                </span>
              </div>
              {!expanded && (
                <p
                  className="text-sm leading-relaxed max-w-2xl italic"
                  style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}
                >
                  {project.heart}
                </p>
              )}
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 mt-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke={color} strokeWidth="1" />
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-7 pb-7">
              <div className="mb-8 pt-2 pb-6" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color }}>
                  Cœur du projet
                </div>
                <p
                  className="text-base leading-relaxed italic max-w-3xl"
                  style={{ color: C.textSoft, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem" }}
                >
                  {project.heart}
                </p>
              </div>

              <div className="mb-8">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color }}>
                  Références principales
                </div>
                <div className="hidden md:grid grid-cols-12 gap-5 pb-2 mb-1" style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                  <div className="col-span-3 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>
                    Auteur·e
                  </div>
                  <div className="col-span-4 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>
                    Œuvre
                  </div>
                  <div className="col-span-5 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>
                    Contexte
                  </div>
                </div>
                <div>
                  {project.refs.map((r, i) => (
                    <RefRow key={i} ref_={r} color={color} />
                  ))}
                </div>
              </div>

              {project.explore && (
                <div className="mb-8">
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: C.textMuted }}>
                    Pistes à explorer
                  </div>
                  <p className="text-xs italic mb-4 max-w-2xl" style={{ color: C.textDim, fontFamily: "Georgia, serif" }}>
                    Non évoquées dans notre conversation — directions naturelles que tu pourrais explorer, à considérer avec un regard critique.
                  </p>
                  <div>
                    {project.explore.map((r, i) => (
                      <RefRow key={i} ref_={r} color={C.textMuted} />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4 md:gap-5">
                <div className="p-5" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color }}>
                    Palette
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                    {project.palette}
                  </p>
                </div>
                <div className="p-5" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color }}>
                    Grammaire visuelle
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                    {project.grammar}
                  </p>
                </div>
                <div className="p-5" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color }}>
                    Élément signature
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                    {project.signature}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ReferentielReferences() {
  const [expanded, setExpanded] = useState("01");
  const [filterVeine, setFilterVeine] = useState("all");

  const filteredProjects = projects.filter((p) =>
    filterVeine === "all" ? true : p.veine === filterVeine
  );

  const totalRefs = projects.reduce((sum, p) => sum + p.refs.length, 0);
  const totalExplore = projects.reduce((sum, p) => sum + (p.explore?.length || 0), 0);

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

      {/* HERO */}
      <header
        className="relative px-6 md:px-16 pt-20 md:pt-24 pb-12 md:pb-16"
        style={{ background: `linear-gradient(180deg, ${C.bgDeep} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="noise absolute inset-0 opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: C.gold }} />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: C.gold }}>
              Document compagnon · Référentiel
            </span>
          </div>

          <h1
            className="font-serif font-light leading-[1] mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              letterSpacing: "-0.02em",
              color: C.ivory,
            }}
          >
            Référentiel <span style={{ color: C.gold }}>des références</span>
          </h1>

          <p
            className="font-serif italic leading-relaxed mb-10 max-w-3xl"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              fontWeight: 300,
              color: C.textSoft,
            }}
          >
            Les œuvres et auteur·es évoqué·es lors de l'analyse des neuf projets — carte du territoire
            culturel dans lequel tes œuvres s'inscriront.
          </p>

          <div className="grid grid-cols-3 gap-4 md:gap-12 max-w-2xl pt-8" style={{ borderTop: `1px solid ${C.border}` }}>
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: C.textDim }}>
                Projets
              </div>
              <div className="font-serif text-xl md:text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                09 cartographiés
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: C.textDim }}>
                Références
              </div>
              <div className="font-serif text-xl md:text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.gold }}>
                {totalRefs} évoquées
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: C.textDim }}>
                Pistes
              </div>
              <div className="font-serif text-xl md:text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textSoft }}>
                + {totalExplore} explorables
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 md:px-16 py-12 md:py-16 max-w-5xl mx-auto">
        {/* INTRO */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: C.gold }}>
              Usage recommandé
            </div>
            <p className="text-base leading-relaxed mb-4" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
              Avant de démarrer le travail profond sur un projet, relire son tableau de références, compléter
              par tes propres découvertes, construire un moodboard de travail qui devient un instrument de
              décision graphique et narrative.
            </p>
            <p className="text-sm italic" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Ce référentiel n'est pas un catalogue d'influences à imiter. C'est une carte du territoire
              culturel. Une fois que tu sais où tu es, tu peux décider où tu vas.
            </p>
          </div>
          <div className="p-6" style={{ background: C.surface, borderLeft: `2px solid ${C.gold}` }}>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.gold }}>
              Deux registres de références
            </div>
            <div className="space-y-4">
              <div>
                <div className="font-serif text-base mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                  Registre 1 — Positionnement
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                  Les œuvres qui situent l'ambition, la famille esthétique, la parenté thématique.
                </p>
              </div>
              <div>
                <div className="font-serif text-base mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                  Registre 2 — Contre-modèle
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                  Les œuvres citées pour signaler un piège à éviter ou un succès à ne pas reproduire par facilité.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTRE */}
        <div className="mb-10">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.textMuted }}>
            Filtrer par veine
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { k: "all", label: "Tous", color: C.text },
              { k: "social", label: "Morale sociale", color: C.gold },
              { k: "meta", label: "Métaphysique", color: C.meta },
              { k: "respiration", label: "Respiration", color: C.respiration },
            ].map((f) => (
              <button
                key={f.k}
                onClick={() => setFilterVeine(f.k)}
                className="px-4 py-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-all"
                style={{
                  background: filterVeine === f.k ? f.color : "transparent",
                  color: filterVeine === f.k ? C.bg : f.color,
                  border: `1px solid ${f.color}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECTS */}
        <section className="mb-20">
          {filteredProjects.map((p) => (
            <ProjectSection
              key={p.num}
              project={p}
              expanded={expanded === p.num}
              onToggle={() => setExpanded(expanded === p.num ? null : p.num)}
            />
          ))}
        </section>

        {/* TRANSVERSAL */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: C.gold }} />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: C.gold }}>
              § 10
            </span>
          </div>
          <h2
            className="font-serif font-light leading-[1.1] mb-10"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: C.ivory,
            }}
          >
            Références transversales — <em style={{ color: C.goldDim }}>figure d'auteur·e</em>
          </h2>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12">
            <div className="p-6" style={{ background: C.surface, borderTop: `2px solid ${C.meta}` }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.meta }}>
                Modèles d'auteur·es à deux veines
              </div>
              <ul className="space-y-3">
                {transversal.modeles.map((m, i) => (
                  <li key={i}>
                    <div className="font-serif text-base mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                      {m.author}
                    </div>
                    <div className="text-xs leading-snug" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                      {m.note}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6" style={{ background: C.surface, borderTop: `2px solid ${C.red}` }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.red }}>
                Avertissements
              </div>
              <p className="text-xs italic mb-4" style={{ color: C.textDim, fontFamily: "Georgia, serif" }}>
                Figures tutélaires négatives des auteur·es prolifiques
              </p>
              <ul className="space-y-3">
                {transversal.avertissements.map((m, i) => (
                  <li key={i}>
                    <div className="font-serif text-base mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                      {m.author}
                    </div>
                    <div className="text-xs leading-snug" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                      {m.note}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6" style={{ background: C.surface, borderTop: `2px solid ${C.blue}` }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.blue }}>
                Esthétique roman graphique
              </div>
              <ul className="space-y-3">
                {transversal.esthetique.map((m, i) => (
                  <li key={i}>
                    <div className="font-serif text-base mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.ivory }}>
                      {m.author}
                    </div>
                    <div className="font-mono text-[10px] italic mb-1" style={{ color: C.blue }}>
                      {m.work}
                    </div>
                    <div className="text-xs leading-snug" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
                      {m.note}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* METHODE */}
        <section className="mb-16">
          <div className="p-6 md:p-10" style={{ background: C.surfaceAlt, borderLeft: `3px solid ${C.gold}` }}>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-5" style={{ color: C.gold }}>
              Méthode d'usage à chaque ouverture de projet
            </div>
            <ol className="space-y-4">
              {[
                "Relire le tableau de références du projet concerné",
                "Retrouver deux ou trois œuvres qui te touchent particulièrement",
                "Les revisiter (relecture, revisionnage)",
                "Extraire ce qui t'attire précisément — palette, rythme, type de personnage, procédé narratif",
                "Extraire aussi ce que tu refuses — les choses qui ne seront pas dans ton projet",
                "Construire ton propre moodboard de travail — images, notes, extraits",
                "Le garder à portée pendant toute la durée du projet",
              ].map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span
                    className="font-serif font-light flex-shrink-0"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.8rem",
                      color: C.gold,
                      lineHeight: 0.9,
                      minWidth: "2rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm md:text-base leading-relaxed pt-1" style={{ color: C.textSoft, fontFamily: "Georgia, serif" }}>
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* HONNETETE */}
        <section className="mb-16">
          <div
            className="p-6 md:p-8 border"
            style={{ borderColor: C.border, background: `${C.bgDeep}80` }}
          >
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: C.textMuted }}>
              Honnêteté méthodologique
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Ce document recense les références qui ont effectivement été évoquées lors du travail d'analyse.
              Les mentions signalées comme <em>pistes à explorer</em> ne viennent pas de notre conversation —
              ce sont des directions que tu pourrais explorer, à considérer avec un regard critique, pas comme
              des recommandations autoritaires.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: C.textMuted, fontFamily: "Georgia, serif" }}>
              Certaines dates et attributions précises n'ont pas été vérifiées systématiquement. Pour un usage
              rigoureux (note éditoriale, candidature à aide), une vérification individuelle des références
              restera nécessaire.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className="pt-10 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <div>
            <div className="font-serif text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              STRAT<span style={{ color: C.gold }}>EX</span>
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: C.textDim }}>
              Document compagnon · Référentiel des références
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: C.textDim }}>
              À relire
            </div>
            <div className="font-serif text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textMuted }}>
              avant chaque démarrage de projet
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
