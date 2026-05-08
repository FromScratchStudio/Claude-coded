import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { loadCatalog, loadChapters } from "./services/catalogService";
import { withHexAlpha } from "./services/colorUtils";
import { sanitizeUrl } from "./services/sanitizeUrl";
import { useStore } from "./store/useStore";
import { applyAccent, C, FONT } from "./theme";
import type { CatalogData, Chapter, ChaptersData } from "./types";

// ─── Style tokens ─────────────────────────────────────────────────────────────

const LABEL: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.28em",
  color: C.textDim,
  textTransform: "uppercase",
};

const BTN_RED: React.CSSProperties = {
  background: C.red,
  color: "#fff",
  border: "none",
  padding: "8px 18px",
  fontSize: 11,
  letterSpacing: "0.22em",
  fontWeight: 600,
  cursor: "pointer",
};

const BTN_WHITE: React.CSSProperties = {
  background: "#f5f5f0",
  color: "#0a0a0a",
  border: "none",
  padding: "10px 22px",
  fontSize: 11,
  letterSpacing: "0.22em",
  fontWeight: 600,
  cursor: "pointer",
};

const BTN_OUTLINE: React.CSSProperties = {
  background: "transparent",
  color: C.text,
  border: `1px solid ${C.borderMid}`,
  padding: "10px 18px",
  fontSize: 11,
  letterSpacing: "0.22em",
  cursor: "pointer",
};

const INPUT_STYLE: React.CSSProperties = {
  padding: "10px 14px",
  background: C.bgDeep,
  border: `1px solid ${C.borderMid}`,
  color: C.text,
  fontSize: 12,
  letterSpacing: "0.04em",
  width: "100%",
};

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ReaderDisplayMode = "default" | "booklet" | "paged";
type MobileTab = "home" | "library" | "reader";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(date?: string) {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatSourceLabel(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.pathname.split("/").filter(Boolean).slice(-2).join("/") || parsed.hostname;
  } catch {
    return url;
  }
}

function buildPdfPageUrl(pdfUrl: string, page: number) {
  const [base, fragment] = pdfUrl.split("#");
  const params = new URLSearchParams(fragment || "");
  params.set("page", String(page));
  params.set("zoom", "page-width");
  return `${base}#${params.toString()}`;
}

// ─── CoverArt: diagonal split panel matching the mockup ──────────────────────

function CoverArt({
  accent,
  cover,
  name,
  volume,
  minHeight = 300,
}: {
  accent?: string;
  cover?: string;
  name?: string;
  volume?: string;
  minHeight?: number;
}) {
  const accentColor = accent || C.red;
  return (
    <div style={{ position: "relative", minHeight, overflow: "hidden", background: "#0a0a0a", width: "100%" }}>
      {cover ? (
        <img
          src={cover}
          alt={name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor} 58%, #0a0a0a 58.4%, #0a0a0a 100%)`,
          }}
        />
      )}
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(10,10,10,0.72) 0%, transparent 55%)",
        }}
      />
      {/* Decorative geometry (only without cover) */}
      {!cover && (
        <>
          <div
            style={{
              position: "absolute", right: 28, bottom: 40,
              width: 80, height: 80,
              border: "1.5px solid rgba(255,255,255,0.38)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute", right: 48, bottom: 60,
              width: 40, height: 40,
              background: "rgba(255,255,255,0.12)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute", left: 18, top: 56,
              height: 1, width: 60,
              background: "rgba(255,255,255,0.38)",
            }}
          />
        </>
      )}
      {/* Volume label top-left */}
      {volume && (
        <div style={{ position: "absolute", top: 14, left: 14, ...LABEL, color: "#fff", letterSpacing: "0.3em" }}>
          {volume}
        </div>
      )}
      {/* Title bottom-left */}
      {name && (
        <div
          style={{
            position: "absolute", bottom: 16, left: 16,
            fontFamily: FONT.display,
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#fff",
            lineHeight: 0.9,
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
}

// ─── ChapterRow: Akira-style numbered row ─────────────────────────────────────

function ChapterRow({
  chapter,
  index,
  active,
  locked,
  accent,
  onClick,
}: {
  chapter: Chapter;
  index: number;
  active: boolean;
  locked?: boolean;
  accent?: string;
  onClick: () => void;
}) {
  const accentColor = accent || C.red;
  const num = String(chapter.number ?? index + 1).padStart(3, "0");

  return (
    <button
      onClick={onClick}
      disabled={locked}
      style={{
        display: "grid",
        gridTemplateColumns: "52px 1fr auto",
        gap: 16,
        padding: "14px 0",
        borderTop: `1px solid ${C.borderSoft}`,
        background: "transparent",
        border: "none",
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: C.borderSoft,
        textAlign: "left",
        width: "100%",
        cursor: locked ? "default" : "pointer",
        alignItems: "center",
        opacity: locked ? 0.45 : 1,
      }}
    >
      {/* Number */}
      <div
        style={{
          fontFamily: FONT.display,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: locked ? C.borderMid : active ? accentColor : C.red,
          lineHeight: 1,
        }}
      >
        {num}
      </div>

      {/* Info */}
      <div>
        <div
          style={{
            fontSize: 14,
            color: locked ? C.textMuted : C.text,
            fontWeight: active ? 600 : 400,
            letterSpacing: "0.01em",
          }}
        >
          {chapter.title}
        </div>
        <div style={{ fontSize: 11, color: C.textDim, marginTop: 3, letterSpacing: "0.06em" }}>
          {chapter.format.toUpperCase()}
          {chapter.estimatedReadingMinutes ? ` · ${chapter.estimatedReadingMinutes} min` : ""}
          {chapter.publishedAt ? ` · ${formatDate(chapter.publishedAt)}` : ""}
        </div>
      </div>

      {/* Action */}
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          color: locked ? C.textDim : active ? accentColor : C.textDim,
          padding: "5px 12px",
          border: `1px solid ${locked ? C.border : active ? accentColor : C.borderMid}`,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {locked ? "VERROUILLÉ" : active ? "EN COURS" : "LIRE"}
      </div>
    </button>
  );
}

// ─── ReaderPanel ──────────────────────────────────────────────────────────────

function ReaderPanel({
  chapter,
  immersiveMode,
  displayMode,
  onDisplayModeChange,
}: {
  chapter: Chapter | null;
  immersiveMode: boolean;
  displayMode: ReaderDisplayMode;
  onDisplayModeChange: (mode: ReaderDisplayMode) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoverZone, setHoverZone] = useState<"prev" | "next" | null>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    setCurrentPage(1);
    setHoverZone(null);
  }, [chapter?.id, displayMode]);

  if (!chapter) {
    return (
      <div
        style={{
          padding: "3rem 1.5rem",
          textAlign: "center",
          minHeight: 280,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: FONT.display, fontSize: "2.5rem", letterSpacing: "0.06em", color: C.textDim }}>
          LIRE
        </div>
        <div style={{ ...LABEL, marginTop: 8 }}>Sélectionne un chapitre</div>
      </div>
    );
  }

  const isReaderModeAvailable = chapter.format === "images" || chapter.format === "pdf";
  const imagePages = chapter.pages ?? [];
  const totalImagePages = imagePages.length;
  const safeImagePage = totalImagePages > 0 ? Math.min(currentPage, totalImagePages) : 1;
  const safePdfPage = Math.max(1, currentPage);
  const maxPdfPage = chapter.pdfPageCount && chapter.pdfPageCount > 0 ? chapter.pdfPageCount : undefined;
  const canGoToNextPdfPage = maxPdfPage ? safePdfPage < maxPdfPage : true;
  const bookletStartPage = Math.max(1, safePdfPage % 2 === 0 ? safePdfPage - 1 : safePdfPage);
  const canGoToNextBookletSpread = maxPdfPage ? bookletStartPage + 2 <= maxPdfPage : true;

  return (
    <div style={{ padding: immersiveMode ? "0.8rem" : "1.25rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: "1rem",
          alignItems: "flex-start",
          paddingBottom: "1rem",
          borderBottom: `1px solid ${C.borderSoft}`,
        }}
      >
        <div>
          <div style={LABEL}>Lecteur · {chapter.format.toUpperCase()}</div>
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: "2rem",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              marginTop: 4,
            }}
          >
            {chapter.title}
          </div>
          {(chapter.estimatedReadingMinutes || chapter.publishedAt) && (
            <div style={{ color: C.textDim, fontSize: 11, letterSpacing: "0.14em", marginTop: 6 }}>
              {chapter.estimatedReadingMinutes ? `${chapter.estimatedReadingMinutes} MIN` : ""}
              {chapter.estimatedReadingMinutes && chapter.publishedAt ? " · " : ""}
              {chapter.publishedAt ? formatDate(chapter.publishedAt).toUpperCase() : ""}
            </div>
          )}
        </div>
        <a
          href={chapter.pdfUrl || chapter.htmlUrl || chapter.pages?.[0]?.src}
          target="_blank"
          rel="noreferrer"
          style={{ ...BTN_OUTLINE, textDecoration: "none", flexShrink: 0 }}
        >
          OUVRIR ↗
        </a>
      </div>

      {/* Mode switcher */}
      {isReaderModeAvailable && (
        <div
          style={{
            display: "flex",
            marginBottom: "1rem",
            border: `1px solid ${C.borderMid}`,
          }}
        >
          {(
            [
              { id: "default" as const, label: "STANDARD" },
              { id: "booklet" as const, label: "BOOKLET" },
              { id: "paged" as const, label: "PAGES" },
            ] as const
          ).map((mode, i) => (
            <button
              key={mode.id}
              onClick={() => onDisplayModeChange(mode.id)}
              style={{
                flex: 1,
                padding: "8px 4px",
                fontSize: 10,
                letterSpacing: "0.22em",
                fontWeight: displayMode === mode.id ? 600 : 400,
                background: displayMode === mode.id ? C.red : "transparent",
                color: displayMode === mode.id ? "#fff" : C.textDim,
                border: "none",
                borderRight: i < 2 ? `1px solid ${C.borderMid}` : "none",
                cursor: "pointer",
                transition: "background 0.12s ease, color 0.12s ease",
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      )}

      {/* PDF Standard */}
      {chapter.format === "pdf" && chapter.pdfUrl && displayMode === "default" && (
        <iframe
          title={chapter.title}
          src={chapter.pdfUrl}
          sandbox="allow-downloads"
          referrerPolicy="no-referrer"
          style={{ width: "100%", minHeight: immersiveMode ? "78vh" : 560, background: "#111" }}
        />
      )}

      {/* PDF Booklet */}
      {chapter.format === "pdf" && chapter.pdfUrl && displayMode === "booklet" && (
        <div style={{ display: "grid", gap: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => setCurrentPage((v) => Math.max(1, v - 2))}
              disabled={bookletStartPage <= 1}
              aria-label="Aller au spread précédent"
              style={{ ...BTN_OUTLINE, padding: "7px 14px" }}
            >
              ← PRÉC.
            </button>
            <span style={LABEL}>
              {maxPdfPage
                ? `P. ${bookletStartPage}–${Math.min(bookletStartPage + 1, maxPdfPage)} / ${maxPdfPage}`
                : `P. ${bookletStartPage}–${bookletStartPage + 1}`}
            </span>
            <button
              onClick={() => setCurrentPage((v) => (maxPdfPage ? Math.min(maxPdfPage, v + 2) : v + 2))}
              disabled={!canGoToNextBookletSpread}
              aria-label="Aller au spread suivant"
              style={{ ...BTN_OUTLINE, padding: "7px 14px" }}
            >
              SUIV. →
            </button>
          </div>
          <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {[bookletStartPage, bookletStartPage + 1]
              .filter((page) => !maxPdfPage || page <= maxPdfPage)
              .map((page, idx) => (
                <iframe
                  key={`${page}-${idx}`}
                  title={`${chapter.title} - page ${page}`}
                  src={buildPdfPageUrl(chapter.pdfUrl!, page)}
                  sandbox="allow-downloads"
                  referrerPolicy="no-referrer"
                  style={{ width: "100%", minHeight: immersiveMode ? "72vh" : 520, background: "#111" }}
                />
              ))}
          </div>
        </div>
      )}

      {/* PDF Paged */}
      {chapter.format === "pdf" && chapter.pdfUrl && displayMode === "paged" && (
        <div style={{ display: "grid", gap: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => setCurrentPage((v) => Math.max(1, v - 1))}
              disabled={safePdfPage <= 1}
              aria-label="Page PDF précédente"
              style={{ ...BTN_OUTLINE, padding: "7px 14px" }}
            >
              ← PAGE PRÉC.
            </button>
            <span style={LABEL}>{maxPdfPage ? `P. ${safePdfPage} / ${maxPdfPage}` : `P. ${safePdfPage}`}</span>
            <button
              onClick={() => setCurrentPage((v) => (maxPdfPage ? Math.min(maxPdfPage, v + 1) : v + 1))}
              disabled={!canGoToNextPdfPage}
              aria-label="Page PDF suivante"
              style={{ ...BTN_OUTLINE, padding: "7px 14px" }}
            >
              PAGE SUIV. →
            </button>
          </div>
          <iframe
            title={`${chapter.title} - page ${safePdfPage}`}
            src={buildPdfPageUrl(chapter.pdfUrl, safePdfPage)}
            sandbox="allow-downloads"
            referrerPolicy="no-referrer"
            style={{ width: "100%", minHeight: immersiveMode ? "76vh" : 540, background: "#111" }}
          />
        </div>
      )}

      {/* HTML */}
      {chapter.format === "html" && chapter.htmlUrl && (
        <iframe
          title={chapter.title}
          src={chapter.htmlUrl}
          sandbox="allow-scripts"
          style={{ width: "100%", minHeight: immersiveMode ? "78vh" : 560, background: "#fff" }}
        />
      )}

      {/* Images – default: all pages */}
      {chapter.format === "images" && totalImagePages > 0 && displayMode === "default" && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {imagePages.map((page, idx) => (
            <img
              key={page.src}
              src={page.src}
              alt={page.alt || `${chapter.title} page ${idx + 1}`}
              style={{ width: "100%", display: "block" }}
            />
          ))}
        </div>
      )}

      {/* Images – booklet: two columns */}
      {chapter.format === "images" && totalImagePages > 0 && displayMode === "booklet" && (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {imagePages.map((page, idx) => (
            <img
              key={page.src}
              src={page.src}
              alt={page.alt || `${chapter.title} page ${idx + 1}`}
              style={{ width: "100%", display: "block" }}
            />
          ))}
        </div>
      )}

      {/* Images – paged */}
      {chapter.format === "images" && totalImagePages > 0 && displayMode === "paged" && (
        <div style={{ display: "grid", gap: "0.8rem" }}>
          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => setCurrentPage((v) => Math.max(1, v - 1))}
              disabled={safeImagePage <= 1}
              aria-label="Page image précédente"
              style={{ ...BTN_OUTLINE, padding: "7px 14px" }}
            >
              ← PAGE PRÉC.
            </button>
            <span style={LABEL}>
              P. {safeImagePage} / {totalImagePages}
            </span>
            <button
              onClick={() => setCurrentPage((v) => Math.min(totalImagePages, v + 1))}
              disabled={safeImagePage >= totalImagePages}
              aria-label="Page image suivante"
              style={{ ...BTN_OUTLINE, padding: "7px 14px" }}
            >
              PAGE SUIV. →
            </button>
          </div>

          {/* Clickable / swipeable image */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`Page ${safeImagePage} sur ${totalImagePages} — cliquez à gauche pour reculer, à droite pour avancer`}
            style={{
              position: "relative",
              userSelect: "none",
              cursor: hoverZone === "prev"
                ? (safeImagePage > 1 ? "w-resize" : "default")
                : hoverZone === "next"
                  ? (safeImagePage < totalImagePages ? "e-resize" : "default")
                  : "default",
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              if ((e.clientX - rect.left) > rect.width / 2) {
                setCurrentPage((v) => Math.min(totalImagePages, v + 1));
              } else {
                setCurrentPage((v) => Math.max(1, v - 1));
              }
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoverZone((e.clientX - rect.left) > rect.width / 2 ? "next" : "prev");
            }}
            onMouseLeave={() => setHoverZone(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setCurrentPage((v) => Math.min(totalImagePages, v + 1));
              if (e.key === "ArrowLeft") setCurrentPage((v) => Math.max(1, v - 1));
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setCurrentPage((v) => Math.min(totalImagePages, v + 1));
              }
            }}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const delta = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(delta) > 40) {
                if (delta > 0) {
                  setCurrentPage((v) => Math.min(totalImagePages, v + 1));
                } else {
                  setCurrentPage((v) => Math.max(1, v - 1));
                }
              }
            }}
          >
            <img
              src={imagePages[safeImagePage - 1].src}
              alt={imagePages[safeImagePage - 1].alt || `${chapter.title} page ${safeImagePage}`}
              style={{ width: "100%", display: "block", pointerEvents: "none" }}
              draggable={false}
            />

            {/* Prev zone hint */}
            {hoverZone === "prev" && safeImagePage > 1 && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "50%",
                  background: "linear-gradient(to right, rgba(0,0,0,0.28) 0%, transparent 100%)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 18,
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: FONT.display,
                    fontSize: 36,
                    color: "rgba(255,255,255,0.72)",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  ←
                </span>
              </div>
            )}

            {/* Next zone hint */}
            {hoverZone === "next" && safeImagePage < totalImagePages && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  left: "50%",
                  background: "linear-gradient(to left, rgba(0,0,0,0.28) 0%, transparent 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 18,
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: FONT.display,
                    fontSize: 36,
                    color: "rgba(255,255,255,0.72)",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  →
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { isMobile, isTablet } = useBreakpoint();

  // Store
  const sources = useStore((s) => s.sources);
  const activeSource = useStore((s) => s.activeSource);
  const selectedTitleId = useStore((s) => s.selectedTitleId);
  const selectedChapterId = useStore((s) => s.selectedChapterId);
  const searchQuery = useStore((s) => s.searchQuery);
  const selectedGenre = useStore((s) => s.selectedGenre);
  const immersiveMode = useStore((s) => s.immersiveMode);
  const readerDisplayMode = useStore((s) => s.readerDisplayMode);
  const ensureSource = useStore((s) => s.ensureSource);
  const addSource = useStore((s) => s.addSource);
  const removeSource = useStore((s) => s.removeSource);
  const setActiveSource = useStore((s) => s.setActiveSource);
  const selectTitle = useStore((s) => s.selectTitle);
  const selectChapter = useStore((s) => s.selectChapter);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const setSelectedGenre = useStore((s) => s.setSelectedGenre);
  const toggleImmersiveMode = useStore((s) => s.toggleImmersiveMode);
  const setReaderDisplayMode = useStore((s) => s.setReaderDisplayMode);

  // Local state
  const [sourceInput, setSourceInput] = useState("");
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [loadingTitleId, setLoadingTitleId] = useState<string | null>(null);
  const [chapterCache, setChapterCache] = useState<Record<string, ChaptersData>>({});
  const [chapterErrors, setChapterErrors] = useState<Record<string, string>>({});
  const [refreshTick, setRefreshTick] = useState(0);
  const [mobileTab, setMobileTab] = useState<MobileTab>("home");
  const [showSources, setShowSources] = useState(false);

  const defaultSourceUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URL(`${import.meta.env.BASE_URL}demo/catalog.json`, window.location.origin).toString();
  }, []);

  useEffect(() => {
    if (defaultSourceUrl) ensureSource(defaultSourceUrl);
  }, [defaultSourceUrl, ensureSource]);

  // Load catalog
  useEffect(() => {
    if (!activeSource) return;
    let cancelled = false;
    setLoadingCatalog(true);
    setCatalogError(null);
    loadCatalog(activeSource)
      .then((c) => { if (!cancelled) { setCatalog(c); setChapterCache({}); setChapterErrors({}); } })
      .catch((e: Error) => { if (!cancelled) { setCatalog(null); setCatalogError(e.message); } })
      .finally(() => { if (!cancelled) setLoadingCatalog(false); });
    return () => { cancelled = true; };
  }, [activeSource, refreshTick]);

  // Auto-select first title
  useEffect(() => {
    if (!catalog?.titles.length) return;
    const exists = catalog.titles.some((t) => t.id === selectedTitleId);
    if (!selectedTitleId || !exists) {
      selectTitle(
        catalog.featuredTitleId && catalog.titles.some((t) => t.id === catalog.featuredTitleId)
          ? catalog.featuredTitleId
          : catalog.titles[0].id
      );
    }
  }, [catalog, selectTitle, selectedTitleId]);

  const selectedTitle = useMemo(
    () => catalog?.titles.find((t) => t.id === selectedTitleId) ?? null,
    [catalog, selectedTitleId]
  );

  // Load chapters for selected title
  useEffect(() => {
    if (!selectedTitle || chapterCache[selectedTitle.id] || loadingTitleId === selectedTitle.id) return;
    let cancelled = false;
    setLoadingTitleId(selectedTitle.id);
    setChapterErrors((c) => ({ ...c, [selectedTitle.id]: "" }));
    loadChapters(selectedTitle.chaptersUrl)
      .then((r) => { if (!cancelled) setChapterCache((c) => ({ ...c, [selectedTitle.id]: r })); })
      .catch((e: Error) => { if (!cancelled) setChapterErrors((c) => ({ ...c, [selectedTitle.id]: e.message })); })
      .finally(() => {
        if (!cancelled) setLoadingTitleId((curr) => (curr === selectedTitle.id ? null : curr));
      });
    return () => { cancelled = true; };
  }, [chapterCache, loadingTitleId, selectedTitle]);

  const selectedTitleChapters = selectedTitle ? chapterCache[selectedTitle.id]?.chapters ?? [] : [];

  // Auto-select first chapter
  useEffect(() => {
    if (!selectedTitle || !selectedTitleChapters.length) return;
    const exists = selectedTitleChapters.some((c) => c.id === selectedChapterId);
    if (!selectedChapterId || !exists) selectChapter(selectedTitleChapters[0].id);
  }, [selectChapter, selectedChapterId, selectedTitle, selectedTitleChapters]);

  const selectedChapter = selectedTitleChapters.find((c) => c.id === selectedChapterId) ?? null;

  const genres = useMemo(() => {
    const vals = new Set<string>();
    catalog?.titles.forEach((t) => t.genres.forEach((g) => vals.add(g)));
    return ["all", ...Array.from(vals)];
  }, [catalog]);

  const filteredTitles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (catalog?.titles ?? []).filter((t) => {
      const matchQ =
        !q || [t.name, t.author, t.summary, t.genres.join(" ")].join(" ").toLowerCase().includes(q);
      const matchG = selectedGenre === "all" || t.genres.includes(selectedGenre);
      return matchQ && matchG;
    });
  }, [catalog, searchQuery, selectedGenre]);

  // Apply accent from selected title
  useEffect(() => {
    applyAccent(
      selectedTitle?.accent || C.red,
      withHexAlpha(selectedTitle?.accent, "88", C.red)
    );
  }, [selectedTitle]);

  function handleAddSource() {
    const safeUrl = sanitizeUrl(sourceInput);
    if (!safeUrl) return;
    addSource(safeUrl);
    setSourceInput("");
  }

  function handleSelectChapter(id: string) {
    selectChapter(id);
    if (isMobile) setMobileTab("reader");
  }

  const accentColor = selectedTitle?.accent || C.red;
  const appName = catalog?.libraryName || "COMICS PRESS";
  const [appWord1, ...appWordRest] = appName.split(" ");
  const appWord2 = appWordRest.join(" ") || "PRESS";

  // ─── Sources panel ────────────────────────────────────────────────────────

  const SourcesPanel = (
    <div
      style={{
        padding: "12px 1.5rem",
        background: C.bgDeep,
        borderBottom: `1px solid ${C.borderSoft}`,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      <input
        value={sourceInput}
        onChange={(e) => setSourceInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddSource()}
        placeholder="URL JSON du catalogue distant…"
        style={{ ...INPUT_STYLE, width: 300, flex: "none" }}
      />
      <button
        onClick={handleAddSource}
        disabled={!sanitizeUrl(sourceInput)}
        style={{ ...BTN_RED, padding: "10px 16px" }}
      >
        AJOUTER
      </button>
      <button
        onClick={() => setRefreshTick((n) => n + 1)}
        style={{ ...BTN_OUTLINE, padding: "10px 14px" }}
      >
        ↺ RECHARGER
      </button>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {sources.map((src) => {
          const active = src === activeSource;
          return (
            <div key={src} style={{ display: "flex" }}>
              <button
                onClick={() => setActiveSource(src)}
                style={{
                  ...BTN_OUTLINE,
                  padding: "6px 12px",
                  fontSize: 10,
                  background: active ? accentColor : "transparent",
                  color: active ? "#fff" : C.textDim,
                  border: `1px solid ${active ? accentColor : C.borderMid}`,
                  letterSpacing: "0.14em",
                }}
              >
                {formatSourceLabel(src)}
              </button>
              {src !== defaultSourceUrl && (
                <button
                  onClick={() => removeSource(src)}
                  aria-label={`Supprimer ${formatSourceLabel(src)}`}
                  style={{
                    ...BTN_OUTLINE,
                    padding: "6px 10px",
                    fontSize: 14,
                    color: C.textDim,
                    border: `1px solid ${C.borderMid}`,
                    borderLeft: "none",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ─── Title list panel (catalogue) ─────────────────────────────────────────

  const CataloguePanel = (
    <div>
      {/* Search + filter */}
      <div
        style={{
          padding: "1rem",
          borderBottom: `1px solid ${C.borderSoft}`,
          display: "grid",
          gap: 8,
        }}
      >
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Titre, auteur, genre…"
          style={INPUT_STYLE}
        />
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={INPUT_STYLE}
        >
          {genres.map((g) => (
            <option key={g} value={g} style={{ color: "#111" }}>
              {g === "all" ? "Tous les genres" : g}
            </option>
          ))}
        </select>
      </div>

      {/* Title list */}
      <div>
        {loadingCatalog && (
          <div style={{ padding: "1.5rem", ...LABEL }}>CHARGEMENT…</div>
        )}
        {catalogError && (
          <div style={{ padding: "1rem", fontSize: 12, color: C.red, letterSpacing: "0.04em" }}>
            {catalogError}
          </div>
        )}
        {filteredTitles.map((title) => {
          const active = title.id === selectedTitleId;
          const titleAccent = title.accent || C.red;
          return (
            <motion.button
              key={title.id}
              whileHover={{ x: 2 }}
              onClick={() => selectTitle(title.id)}
              style={{
                display: "flex",
                gap: 12,
                padding: "14px 1rem",
                width: "100%",
                textAlign: "left",
                background: active ? `${withHexAlpha(titleAccent, "14", "rgba(230,0,18,0.08)")}` : "transparent",
                border: "none",
                borderBottom: `1px solid ${C.borderSoft}`,
                borderLeft: active ? `3px solid ${titleAccent}` : "3px solid transparent",
                cursor: "pointer",
                color: C.text,
                alignItems: "flex-start",
              }}
            >
              {title.cover && (
                <img
                  src={title.cover}
                  alt={title.name}
                  style={{ width: 52, height: 72, objectFit: "cover", flexShrink: 0 }}
                />
              )}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: FONT.display,
                    fontSize: "1.5rem",
                    letterSpacing: "-0.03em",
                    lineHeight: 0.92,
                    color: active ? titleAccent : C.text,
                  }}
                >
                  {title.name}
                </div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, letterSpacing: "0.08em" }}>
                  {title.author}
                  {title.year ? ` · ${title.year}` : ""}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textMuted,
                    marginTop: 5,
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {title.summary}
                </div>
                {title.genres.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {title.genres.map((g) => (
                      <span
                        key={g}
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.18em",
                          color: C.textDim,
                          border: `1px solid ${C.borderMid}`,
                          padding: "2px 7px",
                        }}
                      >
                        {g.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
        {!loadingCatalog && !catalogError && filteredTitles.length === 0 && (
          <div style={{ padding: "1rem", ...LABEL }}>Aucun titre</div>
        )}
      </div>
    </div>
  );

  // ─── Hero section: featured title ─────────────────────────────────────────

  const HeroSection = (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedTitle?.id ?? "empty"}
        variants={fadeIn}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ borderBottom: `1px solid ${C.borderSoft}` }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 1.15fr",
            minHeight: 300,
          }}
        >
          {/* Left: title info */}
          <div
            style={{
              padding: isMobile ? "1.5rem 1rem" : "2rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div>
              <div style={{ ...LABEL, color: accentColor, marginBottom: 14 }}>
                ↳ {selectedTitle?.status?.toUpperCase() || "CATALOGUE"}
              </div>
              <h1
                style={{
                  margin: 0,
                  fontFamily: FONT.display,
                  fontSize: isMobile ? "3.5rem" : "4.8rem",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                  color: C.text,
                }}
              >
                {selectedTitle?.name || catalog?.libraryName || "COMICS"}
              </h1>
              {selectedTitle?.summary && (
                <p
                  style={{
                    fontSize: 13,
                    color: C.textMuted,
                    lineHeight: 1.65,
                    margin: "16px 0 0",
                    maxWidth: 400,
                  }}
                >
                  {selectedTitle.summary}
                </p>
              )}
              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                <button
                  onClick={() => selectedTitleChapters[0] && handleSelectChapter(selectedTitleChapters[0].id)}
                  style={{ ...BTN_WHITE }}
                >
                  {selectedTitleChapters.length > 0 ? "LIRE LE VOL. 01" : "CATALOGUE"}
                </button>
                {selectedTitle && (
                  <span
                    style={{
                      ...BTN_OUTLINE,
                      display: "inline-block",
                      padding: "10px 18px",
                    }}
                  >
                    {selectedTitle.author}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            {(catalog?.titles.length || selectedTitleChapters.length) ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, auto)",
                  gap: 24,
                  justifyContent: "start",
                }}
              >
                {[
                  { n: catalog?.titles.length ?? 0, label: "TITRES" },
                  { n: selectedTitleChapters.length, label: "CHAPITRES" },
                  { n: sources.length, label: "SOURCES" },
                ].map(({ n, label }) => (
                  <div key={label}>
                    <div
                      style={{
                        fontFamily: FONT.display,
                        fontSize: "1.8rem",
                        letterSpacing: "-0.04em",
                        color: C.text,
                        lineHeight: 1,
                      }}
                    >
                      {n}
                    </div>
                    <div style={{ ...LABEL, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right: cover art */}
          {!isMobile && (
            <CoverArt
              accent={accentColor}
              cover={selectedTitle?.cover}
              name={selectedTitle?.name}
              volume={selectedTitleChapters.length > 0 ? `VOL. 01 / ${selectedTitleChapters.length}` : undefined}
              minHeight={300}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );

  // ─── Chapters panel ───────────────────────────────────────────────────────

  const ChaptersPanel = (
    <div>
      {/* Chapter list header */}
      <div
        style={{
          padding: "1rem 1rem 0.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          borderBottom: `1px solid ${C.borderSoft}`,
        }}
      >
        <div style={{ ...LABEL, color: C.text, letterSpacing: "0.22em" }}>
          {selectedTitle ? `CHAPITRES — ${selectedTitle.name.toUpperCase()}` : "CHAPITRES"}
        </div>
        {selectedTitleChapters.length > 0 && (
          <div style={{ ...LABEL }}>
            {selectedTitleChapters.length} ÉP.
          </div>
        )}
      </div>

      {/* Chapter rows */}
      <div style={{ padding: "0 1rem" }}>
        {loadingTitleId === selectedTitle?.id && (
          <div style={{ padding: "1rem 0", ...LABEL }}>CHARGEMENT…</div>
        )}
        {selectedTitle && chapterErrors[selectedTitle.id] && (
          <div style={{ padding: "0.5rem 0", fontSize: 12, color: C.red }}>
            {chapterErrors[selectedTitle.id]}
          </div>
        )}
        {selectedTitleChapters.map((chapter, idx) => (
          <ChapterRow
            key={chapter.id}
            chapter={chapter}
            index={idx}
            active={chapter.id === selectedChapterId}
            accent={accentColor}
            onClick={() => handleSelectChapter(chapter.id)}
          />
        ))}
        {!loadingTitleId && selectedTitle && selectedTitleChapters.length === 0 && (
          <div style={{ padding: "1rem 0", ...LABEL }}>AUCUN CHAPITRE</div>
        )}
      </div>
    </div>
  );

  // ─── Reader section header ─────────────────────────────────────────────────

  const ReaderHeader = (
    <div
      style={{
        padding: "0.75rem 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid ${C.borderSoft}`,
      }}
    >
      <div style={{ ...LABEL, color: C.text }}>
        {selectedChapter ? `CHAP. ${String(selectedChapter.number ?? "").padStart(3, "0")}` : "LECTEUR"}
      </div>
      <button
        onClick={toggleImmersiveMode}
        style={{ ...BTN_OUTLINE, padding: "6px 14px", fontSize: 10, letterSpacing: "0.22em" }}
      >
        {immersiveMode ? "← QUITTER" : "IMMERSIF →"}
      </button>
    </div>
  );

  // ─── Immersive mode ────────────────────────────────────────────────────────

  if (immersiveMode) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: C.bgSoft,
            borderBottom: `1px solid ${C.borderSoft}`,
            padding: "0 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 48,
          }}
        >
          <div style={{ ...LABEL, color: accentColor }}>
            {selectedChapter?.title?.toUpperCase() || "LECTEUR"}
          </div>
          <button
            onClick={toggleImmersiveMode}
            style={{ ...BTN_OUTLINE, padding: "5px 14px", fontSize: 10 }}
          >
            ← QUITTER
          </button>
        </div>
        <ReaderPanel
          chapter={selectedChapter}
          immersiveMode={true}
          displayMode={readerDisplayMode}
          onDisplayModeChange={setReaderDisplayMode}
        />
      </div>
    );
  }

  // ─── MOBILE LAYOUT ────────────────────────────────────────────────────────

  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
        {/* Mobile header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: C.bgSoft,
            borderBottom: `1px solid ${C.borderSoft}`,
            padding: "0 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 52,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span
              style={{
                fontFamily: FONT.display,
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                color: C.red,
                lineHeight: 1,
              }}
            >
              {appWord1}
            </span>
            <span style={{ ...LABEL, color: C.textDim, fontSize: 9 }}>{appWord2}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowSources(!showSources)}
              style={{
                ...BTN_OUTLINE,
                padding: "5px 10px",
                fontSize: 9,
                color: showSources ? C.red : C.textDim,
                borderColor: showSources ? C.red : C.borderMid,
              }}
            >
              SRC
            </button>
            <button
              onClick={toggleImmersiveMode}
              style={{ ...BTN_RED, padding: "5px 10px", fontSize: 9 }}
            >
              IMMERSIF
            </button>
          </div>
        </header>

        {/* Mobile sources drawer */}
        {showSources && (
          <div style={{ padding: "12px 1rem", background: C.bgDeep, borderBottom: `1px solid ${C.borderSoft}` }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <input
                value={sourceInput}
                onChange={(e) => setSourceInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSource()}
                placeholder="URL catalogue JSON…"
                style={{ ...INPUT_STYLE, flex: 1 }}
              />
              <button onClick={handleAddSource} disabled={!sanitizeUrl(sourceInput)} style={{ ...BTN_RED, flexShrink: 0 }}>
                +
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {sources.map((src) => {
                const active = src === activeSource;
                return (
                  <button
                    key={src}
                    onClick={() => setActiveSource(src)}
                    style={{
                      ...BTN_OUTLINE,
                      padding: "5px 10px",
                      fontSize: 9,
                      background: active ? accentColor : "transparent",
                      color: active ? "#fff" : C.textDim,
                      border: `1px solid ${active ? accentColor : C.borderMid}`,
                    }}
                  >
                    {formatSourceLabel(src)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile tab content */}
        <AnimatePresence mode="wait">
          {mobileTab === "home" && (
            <motion.div key="home" variants={fadeIn} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.18 }}>
              {/* Cover card */}
              <div style={{ margin: "1rem", border: `1px solid ${C.border}` }}>
                <CoverArt
                  accent={accentColor}
                  cover={selectedTitle?.cover}
                  name={selectedTitle?.name}
                  minHeight={240}
                />
              </div>
              {/* Title info */}
              {selectedTitle && (
                <div style={{ padding: "0 1rem 1rem" }}>
                  <div style={{ ...LABEL, color: accentColor, marginBottom: 8 }}>↳ EN COURS</div>
                  <div
                    style={{
                      fontFamily: FONT.display,
                      fontSize: "2.8rem",
                      letterSpacing: "-0.04em",
                      lineHeight: 0.9,
                    }}
                  >
                    {selectedTitle.name}
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 6, letterSpacing: "0.08em" }}>
                    {selectedTitle.author}
                  </div>
                  {selectedTitle.summary && (
                    <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginTop: 10 }}>
                      {selectedTitle.summary}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    <button
                      onClick={() => setMobileTab("library")}
                      style={{ ...BTN_WHITE, flex: 1, textAlign: "center" }}
                    >
                      CHAPITRES
                    </button>
                    <button
                      onClick={() => {
                        if (selectedTitleChapters[0]) handleSelectChapter(selectedTitleChapters[0].id);
                      }}
                      style={{ ...BTN_OUTLINE, flex: 1, textAlign: "center" }}
                    >
                      LIRE →
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
                    {[
                      { n: catalog?.titles.length ?? 0, label: "TITRES" },
                      { n: selectedTitleChapters.length, label: "CHAPITRES" },
                      { n: sources.length, label: "SOURCES" },
                    ].map(({ n, label }) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontFamily: FONT.display,
                            fontSize: "1.6rem",
                            letterSpacing: "-0.04em",
                            color: C.text,
                          }}
                        >
                          {n}
                        </div>
                        <div style={{ ...LABEL, fontSize: 9, marginTop: 2 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {loadingCatalog && <div style={{ padding: "2rem 1rem", ...LABEL }}>CHARGEMENT…</div>}
              {catalogError && <div style={{ padding: "1rem", fontSize: 12, color: C.red }}>{catalogError}</div>}
            </motion.div>
          )}

          {mobileTab === "library" && (
            <motion.div key="library" variants={fadeIn} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.18 }}>
              {/* Title selector */}
              <div style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                <div style={{ padding: "0.75rem 1rem", ...LABEL, color: C.text }}>CATALOGUE</div>
                <div style={{ padding: "0 1rem 0.75rem", display: "grid", gap: 6 }}>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher…"
                    style={INPUT_STYLE}
                  />
                </div>
                <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.borderSoft}`, overflowX: "auto" }}>
                  {genres.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      style={{
                        background: "none",
                        border: "none",
                        borderBottom: selectedGenre === g ? `2px solid ${C.red}` : "2px solid transparent",
                        padding: "8px 14px",
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        color: selectedGenre === g ? C.text : C.textDim,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {g === "all" ? "TOUS" : g.toUpperCase()}
                    </button>
                  ))}
                </div>
                {filteredTitles.map((title) => {
                  const active = title.id === selectedTitleId;
                  return (
                    <button
                      key={title.id}
                      onClick={() => selectTitle(title.id)}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "12px 1rem",
                        width: "100%",
                        textAlign: "left",
                        background: active ? withHexAlpha(title.accent, "12", "rgba(230,0,18,0.06)") : "transparent",
                        border: "none",
                        borderBottom: `1px solid ${C.borderSoft}`,
                        borderLeft: active ? `3px solid ${title.accent || C.red}` : "3px solid transparent",
                        cursor: "pointer",
                        color: C.text,
                        alignItems: "center",
                      }}
                    >
                      {title.cover && (
                        <img src={title.cover} alt={title.name} style={{ width: 40, height: 54, objectFit: "cover", flexShrink: 0 }} />
                      )}
                      <div>
                        <div
                          style={{
                            fontFamily: FONT.display,
                            fontSize: "1.2rem",
                            letterSpacing: "-0.03em",
                            lineHeight: 0.95,
                            color: active ? (title.accent || C.red) : C.text,
                          }}
                        >
                          {title.name}
                        </div>
                        <div style={{ fontSize: 10, color: C.textDim, marginTop: 3, letterSpacing: "0.06em" }}>
                          {title.author}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Chapter list for selected title */}
              <div style={{ padding: "0.75rem 1rem 0.25rem", ...LABEL, color: C.text }}>
                {selectedTitle ? `CHAPITRES — ${selectedTitle.name.toUpperCase()}` : "CHAPITRES"}
              </div>
              <div style={{ padding: "0 1rem" }}>
                {loadingTitleId === selectedTitle?.id && (
                  <div style={{ padding: "1rem 0", ...LABEL }}>CHARGEMENT…</div>
                )}
                {selectedTitleChapters.map((chapter, idx) => (
                  <ChapterRow
                    key={chapter.id}
                    chapter={chapter}
                    index={idx}
                    active={chapter.id === selectedChapterId}
                    accent={accentColor}
                    onClick={() => handleSelectChapter(chapter.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {mobileTab === "reader" && (
            <motion.div key="reader" variants={fadeIn} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.18 }}>
              {ReaderHeader}
              <ReaderPanel
                chapter={selectedChapter}
                immersiveMode={false}
                displayMode={readerDisplayMode}
                onDisplayModeChange={setReaderDisplayMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile bottom tab bar */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            background: C.bgSoft,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
          }}
        >
          {(
            [
              { id: "home" as MobileTab, label: "ACCUEIL" },
              { id: "library" as MobileTab, label: "BIBLI." },
              { id: "reader" as MobileTab, label: "LIRE" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              style={{
                flex: 1,
                padding: "14px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 9,
                letterSpacing: "0.24em",
                color: mobileTab === tab.id ? C.red : C.textDim,
                borderTop: mobileTab === tab.id ? `2px solid ${C.red}` : "2px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── DESKTOP / TABLET LAYOUT ──────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: C.bgSoft,
          borderBottom: `1px solid ${C.borderSoft}`,
        }}
      >
        {/* Main nav row */}
        <div
          style={{
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            borderBottom: `1px solid ${C.borderSoft}`,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, padding: "16px 0" }}>
            <span
              style={{
                fontFamily: FONT.display,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                color: C.red,
                lineHeight: 1,
              }}
            >
              {appWord1}
            </span>
            <span style={{ ...LABEL, color: C.textDim, fontSize: 9 }}>{appWord2}</span>
          </div>

          {/* Nav tabs */}
          <nav style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
            {[
              { id: "catalogue", label: "CATALOGUE" },
              { id: "volumes", label: "VOLUMES" },
              { id: "sources", label: "SOURCES" },
            ].map((item) => {
              const active = item.id === "sources" ? showSources : false;
              return (
                <button
                  key={item.id}
                  onClick={() => item.id === "sources" && setShowSources(!showSources)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: active ? `2px solid ${C.red}` : "2px solid transparent",
                    padding: "0 22px",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    cursor: "pointer",
                    color: active ? C.text : C.textDim,
                    transition: "color 0.12s",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 0" }}>
            <button
              onClick={() => setRefreshTick((n) => n + 1)}
              style={{ ...BTN_OUTLINE, padding: "6px 12px", fontSize: 10 }}
            >
              ↺
            </button>
            <button onClick={toggleImmersiveMode} style={{ ...BTN_RED, padding: "7px 16px" }}>
              IMMERSIF
            </button>
          </div>
        </div>

        {/* Sources panel (toggleable) */}
        {showSources && SourcesPanel}
      </header>

      {/* Grid layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "280px 1fr",
          minHeight: "calc(100vh - 53px)",
        }}
      >
        {/* Left: catalogue (hidden on tablet) */}
        {!isTablet && (
          <div
            style={{
              borderRight: `1px solid ${C.border}`,
              overflowY: "auto",
              position: "sticky",
              top: 53,
              maxHeight: "calc(100vh - 53px)",
            }}
          >
            {CataloguePanel}
          </div>
        )}

        {/* Right: hero + volumes + reader */}
        <div>
          {/* Hero section */}
          {HeroSection}

          {/* On tablet: show catalogue below hero */}
          {isTablet && (
            <div style={{ borderBottom: `1px solid ${C.border}` }}>
              {CataloguePanel}
            </div>
          )}

          {/* Volumes + reader (2-column on desktop-wide, stacked on tablet) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "1fr 1.1fr",
            }}
          >
            {/* Chapter list */}
            <div style={{ borderRight: isTablet ? "none" : `1px solid ${C.border}`, borderBottom: isTablet ? `1px solid ${C.border}` : "none" }}>
              {ChaptersPanel}
            </div>

            {/* Reader */}
            <div>
              {ReaderHeader}
              <ReaderPanel
                chapter={selectedChapter}
                immersiveMode={false}
                displayMode={readerDisplayMode}
                onDisplayModeChange={setReaderDisplayMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
