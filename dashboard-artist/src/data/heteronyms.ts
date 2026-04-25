import { C } from "../theme";
import type { Heteronym } from "../types";

export const HETERONYMS: Heteronym[] = [
  {
    id: "fromscratch",
    code: "A",
    name: "FromScratch",
    label: "Identité publique réelle",
    color: C.blue,
    public: "Public (existant)",
    role: "Communication professionnelle hors Kefta Matesha",
    detail:
      "Pseudonyme public existant, ancré hors Kefta Matesha. Signe la vie professionnelle publique, les contenus méthodologiques, les tribunes extérieures, les making-of techniques, la présence publique d'auteur·e-ingénieur·e. Ne signe jamais dans Kefta Matesha. Peut apparaître occasionnellement comme auteur·e invité·e dans un numéro — ce qui crée un effet de réel élégant.",
  },
  {
    id: "noname",
    code: "B",
    name: "Noname",
    label: "Directeur·rice de rédaction Kefta Matesha",
    color: C.gold,
    public: "Fiction interne Kefta Matesha",
    role: "Édito-direction de la revue",
    persona:
      "L'architecte invisible. Celui·celle qui laisse les autres être vus·es à sa place. Le paradoxe d'un nom qui déclare ne pas en être un.",
    ton: "On construit quelque chose qui dure. Mais ça reste sauvage.",
    detail:
      "Hétéronyme fictionnel interne au magazine. Nom qui déclare ne pas en être un — un paradoxe performatif d'une noblesse littéraire rare. Résonance Pessoa / Kafka / Musil. Fait écho à GhostWriter : les deux jouent avec l'absence et la signature refusée. Coordonne la posse fictive, incarne la persona de l'architecte invisible.",
    lexique:
      "architecture · système · protocole · structure · cadre · pipeline · cohérence · vision · discipline · sauvage · construit · dure",
    inspirations: [
      { nom: "Kanye West", oeuvre: "My Beautiful Dark Twisted Fantasy, Yeezus", apport: "Architecture totale, coordination de multiples voix, vision maximaliste" },
      { nom: "Rick Rubin", oeuvre: "Production Johnny Cash, Jay-Z, Adele", apport: "Producteur·rice invisible qui révèle les autres plutôt que soi-même" },
      { nom: "Virgil Abloh", oeuvre: "Off-White, Louis Vuitton", apport: "L'architecte qui construit des systèmes dans plusieurs domaines simultanément" },
      { nom: "Hideo Kojima", oeuvre: "Metal Gear Solid, Death Stranding", apport: "Auteur·e qui impose sa vision malgré les contraintes, signatures cachées" },
      { nom: "Jean Giraud / Moebius", oeuvre: "Blueberry, Arzach, L'Incal", apport: "Maîtrise graphique totale, basculement entre mondes" },
    ],
    playlist: [
      "The College Dropout → My Beautiful Dark Twisted Fantasy (arc Kanye)",
      "American Recordings de Johnny Cash (production Rick Rubin)",
      "Death Stranding (jeu vidéo Kojima)",
      "Arzach de Moebius",
    ],
  },
  {
    id: "laposse",
    code: "C",
    name: "La Posse",
    label: "Moxo · Imran · Notche · GhostWriter · Blaise",
    color: C.gold,
    public: "Fiction interne Kefta Matesha",
    role: "Contributions aux numéros. Moxo seul signe Pimpologist et Darkovsky.",
    detail:
      "Hétéronymes fictionnels internes au magazine, avec personas développées. Moxo est le seul hétéronyme du régime C qui signe des œuvres hors magazine, dans la limite stricte de l'univers Las Casas.",
    members: [
      {
        name: "Moxo",
        role: "Illustrateur principal — signe Pimpologist & Darkovsky",
        voice: "T'as besoin d'un truc pour demain ? C'est fait.",
        refs: "Toriyama · Moebius · Matsumoto · Steadman · Otomo",
      },
      {
        name: "Imran",
        role: "Poète & directeur artistique",
        voice: "Je dessine pas des formes. Je dessine des silences.",
        refs: "Kendrick Lamar · Basquiat · Saul Williams · Chris Ware · Sonia Sanchez",
      },
      {
        name: "Notche",
        role: "Scénariste & beatmaker",
        voice: "Une histoire sans rythme, c'est juste des mots.",
        refs: "RZA · J Dilla · Frank Miller · Iñárritu · Tezuka",
      },
      {
        name: "GhostWriter",
        role: "Parolier & graffeur",
        voice: "Mon nom est partout. Personne sait que c'est moi.",
        refs: "Banksy · Rimbaud · Ghostface Killah · Basquiat · Shepard Fairey",
      },
      {
        name: "Blaise",
        role: "Présence indéfinie",
        voice: "Je fais rien. Mais sans moi, rien se fait.",
        refs: "Warhol · Brian Eno · Duchamp · Flavor Flav · Leos Carax",
      },
    ],
  },
  {
    id: "altazar",
    code: "D",
    name: "Altazar",
    label: "Auteur·e solo stable",
    color: C.meta,
    public: "Public littéraire séparé",
    role: "Œuvres solo (LVDMM · WIGF · Barzaq · tardives)",
    detail:
      "Pseudonyme stable pour l'œuvre d'auteur·e solo. Totalement séparé des régimes A, B, C. Convoque plusieurs résonances nobles : Altazor de Vicente Huidobro (chute cosmique, 1931), al-Hazar (la chance, le destin en arabe classique), Alcázar (forteresse, palais en arabe-andalou). Méditerranéen-hybride sans enfermer la signature dans une seule grille culturelle. Séparation rigoureuse : comptes sociaux distincts, adresses email distinctes, domaine distinct, newsletters séparées, aucun cross-link public.",
  },
  {
    id: "morad",
    code: "E",
    name: "Morad",
    label: "Signature interne de documents",
    color: C.textMuted,
    public: "Interne / barrière de contamination",
    role: "Bibles · scripts · documents de travail",
    detail:
      "Pseudonyme opérationnel interne pour les documents non destinés à publication publique directe. Barrière de contamination entre vie expressive et autres activités professionnelles. Morad seul — sans nom de famille — rompt les chaînes de recherche automatiques. Traverse les registres des neuf projets sans dissonance tonale.",
  },
];
