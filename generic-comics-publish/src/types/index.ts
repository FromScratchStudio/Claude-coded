export type ChapterFormat = "images" | "pdf" | "html";

export interface SupportLink {
  platform: string; // "paypal" | "kofi" | "patreon" | "stripe" | "bmac" | "github" | free string
  url: string;
  label?: string;   // override display label
  amount?: string;  // suggested amount e.g. "5€"
}

export interface CatalogTitle {
  id: string;
  name: string;
  author: string;
  summary: string;
  accent: string;
  cover?: string;
  banner?: string;
  genres: string[];
  status: string;
  year?: number;
  spotlight?: string;
  chaptersUrl: string;
  supportLinks?: SupportLink[];
}

export interface CatalogData {
  libraryName: string;
  description: string;
  featuredTitleId?: string;
  sourceUrl: string;
  titles: CatalogTitle[];
  newsletterUrl?: string;     // newsletter provider endpoint (Mailchimp, Brevo…)
  newsletterProvider?: string; // hint for UX copy: "mailchimp" | "brevo" | "substack" | …
}

export interface ChapterImage {
  src: string;
  alt?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  summary: string;
  format: ChapterFormat;
  publishedAt?: string;
  estimatedReadingMinutes?: number;
  cover?: string;
  htmlUrl?: string;
  pdfUrl?: string;
  pdfPageCount?: number;
  pages?: ChapterImage[];
}

export interface ChaptersData {
  titleId: string;
  sourceUrl: string;
  chapters: Chapter[];
}
