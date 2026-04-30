import type { Persona } from "../types";

export const PERSONAS: Persona[] = [
  {
    id: "p-brand",
    code: "BRAND",
    name: "Brand Voice",
    label: "Core Identity",
    color: "#4c7fc9",
    audience: "Customers & partners",
    role: "The primary public face of the project",
    detail:
      "Authoritative, warm, and professional. Used in all official communications, website, and marketing materials.",
    members: [
      {
        name: "Primary Author",
        role: "Lead voice",
        voice: "Clear, direct, empathetic",
        refs: "Simon Sinek, Brené Brown",
      },
    ],
    inspirations: [
      {
        name: "Basecamp",
        work: "Shape Up methodology",
        contribution: "Clear, opinionated communication style",
      },
    ],
    lexicon: "Ship • Iteration • User value • Clarity",
    playlist: [],
    persona: "A trusted expert who simplifies complexity",
    tone: "Confident but approachable. Never jargon-heavy.",
  },
  {
    id: "p-community",
    code: "COMM",
    name: "Community Voice",
    label: "Engagement",
    color: "#10b981",
    audience: "Community members, users, collaborators",
    role: "The relatable, human-facing identity",
    detail:
      "Casual, curious, celebratory. Used in social media, newsletters, and community interactions.",
    tone: "Friendly, enthusiastic, real.",
  },
  {
    id: "p-thought",
    code: "THINK",
    name: "Thought Leadership",
    label: "Industry Voice",
    color: "#8b5cf6",
    audience: "Industry peers, press, investors",
    role: "Strategic positioning and credibility",
    detail:
      "Analytical and visionary. Used in long-form articles, presentations, and expert commentary.",
    tone: "Insightful, data-backed, forward-looking.",
  },
];
