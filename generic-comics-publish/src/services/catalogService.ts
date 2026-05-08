import type { CatalogData, CatalogTitle, Chapter, ChaptersData, SupportLink } from "../types";
import { normalizeHexColor } from "./colorUtils";
import { sanitizeUrl } from "./sanitizeUrl";

interface RawCatalog {
  libraryName?: string;
  description?: string;
  featuredTitleId?: string;
  newsletterUrl?: string;
  newsletterProvider?: string;
  titles?: RawCatalogTitle[];
}

interface RawCatalogTitle {
  id?: string;
  name?: string;
  author?: string;
  summary?: string;
  accent?: string;
  cover?: string;
  banner?: string;
  genres?: string[];
  status?: string;
  year?: number;
  spotlight?: string;
  chaptersUrl?: string;
  supportLinks?: RawSupportLink[];
}

interface RawSupportLink {
  platform?: string;
  url?: string;
  label?: string;
  amount?: string;
}

interface RawChapters {
  titleId?: string;
  chapters?: RawChapter[];
}

interface RawChapter {
  id?: string;
  number?: number;
  title?: string;
  summary?: string;
  format?: string;
  publishedAt?: string;
  estimatedReadingMinutes?: number;
  cover?: string;
  htmlUrl?: string;
  pdfUrl?: string;
  pdfPageCount?: number;
  pages?: { src?: string; alt?: string }[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) {
    throw new Error("URL de ressource JSON invalide.");
  }

  const response = await fetch(safeUrl, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Impossible de charger ${safeUrl} (${response.status}).`);
  }
  return (await response.json()) as T;
}

function ensureId(prefix: string, index: number, value?: string) {
  return value?.trim() || `${prefix}-${index + 1}`;
}

function resolveAsset(url: string | undefined, base: string) {
  if (!url) return undefined;
  return sanitizeUrl(url, base);
}

function normalizeSupportLinks(links: RawSupportLink[] | undefined, base: string): SupportLink[] | undefined {
  if (!Array.isArray(links)) return undefined;

  const normalized = links
    .map<SupportLink | null>((link) => {
      const safeUrl = typeof link.url === "string" ? sanitizeUrl(link.url, base) : undefined;
      if (!safeUrl) return null;

      const platform = link.platform?.trim() || "support";
      const label = link.label?.trim() || undefined;
      const amount = link.amount?.trim() || undefined;

      return { platform, url: safeUrl, label, amount };
    })
    .filter((link): link is SupportLink => link !== null);

  return normalized.length > 0 ? normalized : undefined;
}

export async function loadCatalog(url: string): Promise<CatalogData> {
  const sourceUrl = sanitizeUrl(url);
  if (!sourceUrl) {
    throw new Error("Source de catalogue invalide.");
  }

  const raw = await fetchJson<RawCatalog>(sourceUrl);
  if (!Array.isArray(raw.titles) || raw.titles.length === 0) {
    throw new Error("Le catalogue distant ne contient aucun titre exploitable.");
  }

  const titles = raw.titles
    .map<CatalogTitle | null>((item, index) => {
      const chaptersUrl = resolveAsset(item.chaptersUrl, sourceUrl);
      if (!chaptersUrl) return null;
      const genres = Array.isArray(item.genres)
        ? Array.from(
            new Set(
              item.genres
                .filter((genre): genre is string => typeof genre === "string")
                .map((genre) => genre.trim())
                .filter(Boolean)
            )
          )
        : [];
      return {
        id: ensureId("title", index, item.id),
        name: item.name?.trim() || `Titre ${index + 1}`,
        author: item.author?.trim() || "Collectif",
        summary: item.summary?.trim() || "Aucune description disponible.",
        accent: normalizeHexColor(item.accent, "#ff6b7d"),
        cover: resolveAsset(item.cover, sourceUrl),
        banner: resolveAsset(item.banner, sourceUrl),
        genres,
        status: item.status?.trim() || "À découvrir",
        year: typeof item.year === "number" ? item.year : undefined,
        spotlight: item.spotlight?.trim(),
        chaptersUrl,
        supportLinks: normalizeSupportLinks(item.supportLinks, sourceUrl),
      };
    })
    .filter((item): item is CatalogTitle => item !== null);

  if (titles.length === 0) {
    throw new Error("Aucun titre valide n'a été trouvé dans la ressource distante.");
  }

  return {
    libraryName: raw.libraryName?.trim() || "Remote Comics Shelf",
    description:
      raw.description?.trim() ||
      "Collection distante chargée via JSON, prête à alimenter une vitrine de lecture sans backend.",
    featuredTitleId: raw.featuredTitleId?.trim(),
    newsletterUrl: typeof raw.newsletterUrl === "string" ? sanitizeUrl(raw.newsletterUrl, sourceUrl) : undefined,
    newsletterProvider: raw.newsletterProvider?.trim() || undefined,
    sourceUrl,
    titles,
  };
}

export async function loadChapters(url: string): Promise<ChaptersData> {
  const sourceUrl = sanitizeUrl(url);
  if (!sourceUrl) {
    throw new Error("Source de chapitres invalide.");
  }

  const raw = await fetchJson<RawChapters>(sourceUrl);
  if (!Array.isArray(raw.chapters) || raw.chapters.length === 0) {
    throw new Error("Aucun chapitre exploitable n'a été trouvé.");
  }

  const chapters = raw.chapters
    .map<Chapter | null>((chapter, index) => {
      const format = chapter.format === "pdf" || chapter.format === "html" || chapter.format === "images"
        ? chapter.format
        : undefined;

      if (!format) {
        return null;
      }

      const pages = Array.isArray(chapter.pages)
        ? chapter.pages
            .map((page) => {
              const src = resolveAsset(page.src, sourceUrl);
              if (!src) return null;
              return { src, alt: page.alt?.trim() };
            })
            .filter((page): page is NonNullable<typeof page> => page !== null)
        : undefined;

      return {
        id: ensureId("chapter", index, chapter.id),
        number: typeof chapter.number === "number" ? chapter.number : index + 1,
        title: chapter.title?.trim() || `Chapitre ${index + 1}`,
        summary: chapter.summary?.trim() || "Chapitre disponible via JSON distant.",
        format,
        publishedAt: chapter.publishedAt?.trim(),
        estimatedReadingMinutes:
          typeof chapter.estimatedReadingMinutes === "number"
            ? chapter.estimatedReadingMinutes
            : undefined,
        cover: resolveAsset(chapter.cover, sourceUrl),
        htmlUrl: resolveAsset(chapter.htmlUrl, sourceUrl),
        pdfUrl: resolveAsset(chapter.pdfUrl, sourceUrl),
        pdfPageCount: typeof chapter.pdfPageCount === "number" && chapter.pdfPageCount > 0
          ? Math.floor(chapter.pdfPageCount)
          : undefined,
        pages,
      };
    })
    .filter((chapter): chapter is Chapter => chapter !== null)
    .filter((chapter) => {
      if (chapter.format === "pdf") return Boolean(chapter.pdfUrl);
      if (chapter.format === "html") return Boolean(chapter.htmlUrl);
      return Boolean(chapter.pages?.length);
    });

  if (chapters.length === 0) {
    throw new Error("Les chapitres chargés ne contiennent aucun média compatible.");
  }

  return {
    titleId: raw.titleId?.trim() || "unknown-title",
    sourceUrl,
    chapters,
  };
}
