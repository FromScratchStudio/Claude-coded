export type ChapterFormat = "images" | "pdf" | "html";

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
}

export interface CatalogData {
  libraryName: string;
  description: string;
  featuredTitleId?: string;
  sourceUrl: string;
  titles: CatalogTitle[];
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
