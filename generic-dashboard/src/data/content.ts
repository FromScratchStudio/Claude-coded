import type { ContentSeries } from "../types";

export const CONTENT_SERIES_SEED: ContentSeries[] = [
  {
    id: "s1",
    num: 1,
    theme: "Getting Started with the Methodology",
    targetDate: "2025-05-01",
    publishedDate: "",
    status: "production",
    note: "Introductory series for new audience",
    entries: [
      {
        id: "e1-1",
        categoryId: "overview",
        title: "Why This Approach Works",
        author: "Team",
        status: "draft",
        wordTarget: 800,
        note: "Strong hook needed",
      },
      {
        id: "e1-2",
        categoryId: "tutorial",
        title: "Step-by-Step Setup Guide",
        author: "Team",
        status: "brief",
        wordTarget: 1200,
        note: "Screenshots required",
      },
    ],
  },
  {
    id: "s2",
    num: 2,
    theme: "Case Studies & Results",
    targetDate: "2025-07-01",
    publishedDate: "",
    status: "preparation",
    note: "Need 3 confirmed case study subjects",
    entries: [],
  },
];
