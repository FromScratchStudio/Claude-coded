import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "./components/ui/Card";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { loadCatalog, loadChapters } from "./services/catalogService";
import { sanitizeUrl } from "./services/sanitizeUrl";
import { useStore } from "./store/useStore";
import { applyAccent, C, FONT } from "./theme";
import type { CatalogData, Chapter, ChaptersData } from "./types";

const CHIP_STYLES = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 999,
  border: `1px solid ${C.border}`,
  padding: "0.45rem 0.8rem",
  fontSize: "0.78rem",
  color: C.textSoft,
} as const;

const buttonBase = {
  border: `1px solid ${C.border}`,
  background: C.panelAlt,
  color: C.text,
  borderRadius: 999,
  cursor: "pointer",
} as const;

const inputStyle = {
  width: "100%",
  borderRadius: 18,
  padding: "0.9rem 1rem",
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${C.border}`,
  color: C.text,
} as const;

const fadeIn = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function formatDate(date?: string) {
  if (!date) return "Date flexible";
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

function ReaderPanel({ chapter, immersiveMode }: { chapter: Chapter | null; immersiveMode: boolean }) {
  if (!chapter) {
    return (
      <Card style={{ padding: "1.5rem", minHeight: 360, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ fontFamily: FONT.display, fontSize: "2rem", letterSpacing: "0.08em" }}>Ready to Read</div>
          <p style={{ color: C.textMuted }}>
            Sélectionne un chapitre pour afficher un lecteur compatible PDF, galerie d'images ou rendu HTML.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ padding: immersiveMode ? "0.8rem" : "1.25rem", overflow: "hidden" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginBottom: "1rem" }}>
        <div>
          <div style={{ color: C.textDim, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Lecteur
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: "2rem", lineHeight: 1 }}>{chapter.title}</div>
          <div style={{ color: C.textMuted, fontSize: "0.9rem" }}>
            Format {chapter.format.toUpperCase()} · {chapter.estimatedReadingMinutes ?? 8} min · {formatDate(chapter.publishedAt)}
          </div>
        </div>
        <a
          href={chapter.pdfUrl || chapter.htmlUrl || chapter.pages?.[0]?.src}
          target="_blank"
          rel="noreferrer"
          style={{ ...buttonBase, padding: "0.75rem 1rem", textDecoration: "none", alignSelf: "flex-start" }}
        >
          Ouvrir dans un onglet
        </a>
      </div>

      {chapter.format === "pdf" && chapter.pdfUrl && (
        <iframe
          title={chapter.title}
          src={chapter.pdfUrl}
          style={{ width: "100%", minHeight: immersiveMode ? "78vh" : 560, borderRadius: 18, background: "#111" }}
        />
      )}

      {chapter.format === "html" && chapter.htmlUrl && (
        <iframe
          title={chapter.title}
          src={chapter.htmlUrl}
          sandbox="allow-scripts allow-same-origin"
          style={{ width: "100%", minHeight: immersiveMode ? "78vh" : 560, borderRadius: 18, background: "#fff" }}
        />
      )}

      {chapter.format === "images" && chapter.pages?.length && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {chapter.pages.map((page, index) => (
            <figure key={page.src} style={{ margin: 0 }}>
              <img
                src={page.src}
                alt={page.alt || `${chapter.title} page ${index + 1}`}
                style={{ width: "100%", display: "block", borderRadius: 18, border: `1px solid ${C.border}` }}
              />
              <figcaption style={{ marginTop: 8, fontSize: "0.78rem", color: C.textDim }}>
                Page {index + 1}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function App() {
  const { isMobile, isTablet } = useBreakpoint();
  const sources = useStore((state) => state.sources);
  const activeSource = useStore((state) => state.activeSource);
  const selectedTitleId = useStore((state) => state.selectedTitleId);
  const selectedChapterId = useStore((state) => state.selectedChapterId);
  const searchQuery = useStore((state) => state.searchQuery);
  const selectedGenre = useStore((state) => state.selectedGenre);
  const immersiveMode = useStore((state) => state.immersiveMode);
  const ensureSource = useStore((state) => state.ensureSource);
  const addSource = useStore((state) => state.addSource);
  const removeSource = useStore((state) => state.removeSource);
  const setActiveSource = useStore((state) => state.setActiveSource);
  const selectTitle = useStore((state) => state.selectTitle);
  const selectChapter = useStore((state) => state.selectChapter);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSelectedGenre = useStore((state) => state.setSelectedGenre);
  const toggleImmersiveMode = useStore((state) => state.toggleImmersiveMode);

  const [sourceInput, setSourceInput] = useState("");
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [loadingTitleId, setLoadingTitleId] = useState<string | null>(null);
  const [chapterCache, setChapterCache] = useState<Record<string, ChaptersData>>({});
  const [chapterErrors, setChapterErrors] = useState<Record<string, string>>({});
  const [refreshTick, setRefreshTick] = useState(0);

  const defaultSourceUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URL(`${import.meta.env.BASE_URL}demo/catalog.json`, window.location.origin).toString();
  }, []);

  useEffect(() => {
    if (defaultSourceUrl) {
      ensureSource(defaultSourceUrl);
    }
  }, [defaultSourceUrl, ensureSource]);

  useEffect(() => {
    if (!activeSource) return;
    let cancelled = false;
    setLoadingCatalog(true);
    setCatalogError(null);

    loadCatalog(activeSource)
      .then((nextCatalog) => {
        if (cancelled) return;
        setCatalog(nextCatalog);
        setChapterCache({});
        setChapterErrors({});
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setCatalog(null);
        setCatalogError(error.message);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingCatalog(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeSource, refreshTick]);

  useEffect(() => {
    if (!catalog?.titles.length) return;
    const titleStillExists = catalog.titles.some((title) => title.id === selectedTitleId);
    if (!selectedTitleId || !titleStillExists) {
      selectTitle(catalog.featuredTitleId && catalog.titles.some((title) => title.id === catalog.featuredTitleId)
        ? catalog.featuredTitleId
        : catalog.titles[0].id);
    }
  }, [catalog, selectTitle, selectedTitleId]);

  const selectedTitle = useMemo(
    () => catalog?.titles.find((title) => title.id === selectedTitleId) ?? null,
    [catalog, selectedTitleId]
  );

  useEffect(() => {
    if (!selectedTitle || chapterCache[selectedTitle.id] || loadingTitleId === selectedTitle.id) return;
    let cancelled = false;
    setLoadingTitleId(selectedTitle.id);
    setChapterErrors((current) => ({ ...current, [selectedTitle.id]: "" }));

    loadChapters(selectedTitle.chaptersUrl)
      .then((resource) => {
        if (cancelled) return;
        setChapterCache((current) => ({ ...current, [selectedTitle.id]: resource }));
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setChapterErrors((current) => ({ ...current, [selectedTitle.id]: error.message }));
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingTitleId((current) => (current === selectedTitle.id ? null : current));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chapterCache, loadingTitleId, selectedTitle]);

  const selectedTitleChapters = selectedTitle ? chapterCache[selectedTitle.id]?.chapters ?? [] : [];

  useEffect(() => {
    if (!selectedTitle || !selectedTitleChapters.length) return;
    const chapterStillExists = selectedTitleChapters.some((chapter) => chapter.id === selectedChapterId);
    if (!selectedChapterId || !chapterStillExists) {
      selectChapter(selectedTitleChapters[0].id);
    }
  }, [selectChapter, selectedChapterId, selectedTitle, selectedTitleChapters]);

  const selectedChapter = selectedTitleChapters.find((chapter) => chapter.id === selectedChapterId) ?? null;
  const genres = useMemo(() => {
    const values = new Set<string>();
    catalog?.titles.forEach((title) => title.genres.forEach((genre) => values.add(genre)));
    return ["all", ...Array.from(values)];
  }, [catalog]);

  const filteredTitles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return (catalog?.titles ?? []).filter((title) => {
      const matchesQuery =
        !query ||
        [title.name, title.author, title.summary, title.genres.join(" ")].join(" ").toLowerCase().includes(query);
      const matchesGenre = selectedGenre === "all" || title.genres.includes(selectedGenre);
      return matchesQuery && matchesGenre;
    });
  }, [catalog, searchQuery, selectedGenre]);

  useEffect(() => {
    applyAccent(selectedTitle?.accent || "#ff6b7d", selectedTitle?.accent ? `${selectedTitle.accent}88` : "#7c5cff");
  }, [selectedTitle]);

  const titleFormats = useMemo(() => {
    const formats = new Set<string>();
    selectedTitleChapters.forEach((chapter) => formats.add(chapter.format));
    return Array.from(formats);
  }, [selectedTitleChapters]);

  const stats = [
    { label: "Sources", value: sources.length },
    { label: "Titres", value: catalog?.titles.length ?? 0 },
    { label: "Chapitres", value: selectedTitleChapters.length },
  ];

  function handleAddSource() {
    const safeUrl = sanitizeUrl(sourceInput);
    if (!safeUrl) return;
    addSource(safeUrl);
    setSourceInput("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        color: C.text,
        background:
          "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 26%), linear-gradient(180deg, #080910 0%, #11131d 50%, #080910 100%)",
      }}
    >
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: isMobile ? "1rem" : "1.4rem" }}>
        <Card style={{ padding: isMobile ? "1rem" : "1.4rem", marginBottom: "1rem", position: "sticky", top: 12, zIndex: 10 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: isMobile ? "2rem" : "2.8rem", letterSpacing: "0.08em", lineHeight: 0.95 }}>
                Generic Comics Publish
              </div>
              <div style={{ color: C.textMuted, maxWidth: 720 }}>
                Vitrine sans backend pour explorer des bandes dessinées et comics diffusés via catalogues JSON distants.
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              {stats.map((item) => (
                <div key={item.label} style={{ ...CHIP_STYLES, minWidth: 108, justifyContent: "space-between" }}>
                  <span style={{ color: C.textDim }}>{item.label}</span>
                  <strong style={{ color: C.text }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.8fr 1fr", gap: 14, marginTop: 16 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                value={sourceInput}
                onChange={(event) => setSourceInput(event.target.value)}
                placeholder="Ajoute une URL JSON distante de catalogue…"
                style={inputStyle}
              />
              <button onClick={handleAddSource} disabled={!sanitizeUrl(sourceInput)} style={{ ...buttonBase, padding: "0.9rem 1.1rem" }}>
                Ajouter
              </button>
              <button onClick={() => setRefreshTick((tick) => tick + 1)} style={{ ...buttonBase, padding: "0.9rem 1.1rem" }}>
                Recharger
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: isMobile ? "flex-start" : "flex-end" }}>
              {sources.map((source) => {
                const active = source === activeSource;
                return (
                  <div key={source} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button
                      onClick={() => setActiveSource(source)}
                      style={{
                        ...buttonBase,
                        padding: "0.7rem 0.95rem",
                        background: active ? "linear-gradient(135deg, var(--accent), var(--accent-secondary))" : C.panelAlt,
                        borderColor: active ? "transparent" : C.border,
                        color: active ? "#080910" : C.text,
                      }}
                    >
                      {formatSourceLabel(source)}
                    </button>
                    {source !== defaultSourceUrl && (
                      <button onClick={() => removeSource(source)} style={{ ...buttonBase, padding: "0.65rem 0.75rem" }}>
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <AnimatePresence mode="wait">
          <motion.section key={selectedTitle?.id ?? catalog?.sourceUrl ?? "empty"} variants={fadeIn} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.22, ease: "easeOut" }}>
            <Card style={{ padding: isMobile ? "1rem" : "1.4rem", marginBottom: "1rem", overflow: "hidden", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: selectedTitle
                    ? `radial-gradient(circle at top right, ${selectedTitle.accent}35, transparent 34%)`
                    : "radial-gradient(circle at top right, rgba(255,107,125,0.2), transparent 34%)",
                  pointerEvents: "none",
                }}
              />
              {loadingCatalog ? (
                <div style={{ padding: "2rem 0", color: C.textMuted }}>Chargement du catalogue distant…</div>
              ) : catalogError ? (
                <div style={{ color: C.red, padding: "1rem 0" }}>{catalogError}</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1.45fr 0.95fr", gap: 18, position: "relative" }}>
                  <div>
                    <div style={{ ...CHIP_STYLES, marginBottom: 12, borderColor: `${selectedTitle?.accent || C.border}66` }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: selectedTitle?.accent || C.red }} />
                      {catalog?.libraryName || "Catalogue distant"}
                    </div>
                    <h1 style={{ margin: 0, fontFamily: FONT.display, fontSize: isMobile ? "3rem" : "4.5rem", letterSpacing: "0.04em", lineHeight: 0.9 }}>
                      {selectedTitle?.name || "Comics Explorer"}
                    </h1>
                    <p style={{ color: C.textSoft, fontSize: "1rem", maxWidth: 720, marginTop: 12 }}>
                      {selectedTitle?.summary || catalog?.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
                      <span style={CHIP_STYLES}>{selectedTitle?.author || "Collectif"}</span>
                      <span style={CHIP_STYLES}>{selectedTitle?.status || "Toujours en cours"}</span>
                      <span style={CHIP_STYLES}>{selectedTitle?.year || new Date().getFullYear()}</span>
                      {titleFormats.map((format) => (
                        <span key={format} style={CHIP_STYLES}>{format.toUpperCase()}</span>
                      ))}
                    </div>
                    {selectedTitle?.spotlight && (
                      <p style={{ marginTop: 18, paddingLeft: 14, borderLeft: `3px solid ${selectedTitle.accent}`, color: C.textSoft }}>
                        {selectedTitle.spotlight}
                      </p>
                    )}
                  </div>
                  <Card style={{ padding: "1rem", background: "rgba(255,255,255,0.04)" }}>
                    <div style={{ color: C.textDim, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                      Pipeline éditorial distant
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {[
                        "1. Un catalogue JSON expose les séries et leurs URLs de chapitres.",
                        "2. Chaque série charge sa ressource JSON distante à la demande.",
                        "3. Le lecteur choisit le rendu PDF, images ou HTML sans backend.",
                      ].map((line) => (
                        <div key={line} style={{ display: "flex", gap: 10, color: C.textSoft }}>
                          <span style={{ color: selectedTitle?.accent || C.red }}>✦</span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 18, fontSize: "0.84rem", color: C.textMuted }}>
                      Source active: {activeSource ? formatSourceLabel(activeSource) : "Aucune"}
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </motion.section>
        </AnimatePresence>

        <section style={{ display: "grid", gridTemplateColumns: immersiveMode ? "1fr" : isMobile ? "1fr" : isTablet ? "1fr" : "1.05fr 0.95fr", gap: 16 }}>
          {!immersiveMode && (
            <div style={{ display: "grid", gap: 16, alignSelf: "start" }}>
              <Card style={{ padding: "1rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Rechercher un titre, un auteur, un genre…"
                    style={inputStyle}
                  />
                  <select
                    value={selectedGenre}
                    onChange={(event) => setSelectedGenre(event.target.value)}
                    style={{ ...inputStyle, maxWidth: 220 }}
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre} style={{ color: "#111" }}>
                        {genre === "all" ? "Tous les genres" : genre}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {filteredTitles.map((title) => {
                    const active = title.id === selectedTitleId;
                    return (
                      <motion.button
                        key={title.id}
                        whileHover={{ y: -2 }}
                        onClick={() => selectTitle(title.id)}
                        style={{
                          display: "grid",
                          gridTemplateColumns: title.cover ? "120px 1fr" : "1fr",
                          gap: 14,
                          textAlign: "left",
                          width: "100%",
                          padding: 12,
                          borderRadius: 20,
                          border: `1px solid ${active ? `${title.accent}88` : C.border}`,
                          background: active ? `${title.accent}20` : C.panelAlt,
                          color: C.text,
                          cursor: "pointer",
                        }}
                      >
                        {title.cover && (
                          <img src={title.cover} alt={title.name} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 16 }} />
                        )}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                            <div style={{ fontFamily: FONT.display, fontSize: "2rem", lineHeight: 0.9, letterSpacing: "0.04em" }}>{title.name}</div>
                            <span style={{ color: C.textDim, fontSize: "0.78rem" }}>{title.year || ""}</span>
                          </div>
                          <div style={{ color: C.textSoft, fontSize: "0.9rem", marginBottom: 8 }}>{title.author}</div>
                          <div style={{ color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.5 }}>{title.summary}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                            {title.genres.map((genre) => (
                              <span key={genre} style={{ ...CHIP_STYLES, padding: "0.32rem 0.65rem" }}>{genre}</span>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                  {!filteredTitles.length && (
                    <div style={{ color: C.textMuted, padding: "0.75rem 0.2rem" }}>Aucun titre ne correspond au filtre courant.</div>
                  )}
                </div>
              </Card>

              <Card style={{ padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ color: C.textDim, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                      File des chapitres
                    </div>
                    <div style={{ fontFamily: FONT.display, fontSize: "2rem", lineHeight: 0.9 }}>{selectedTitle?.name || "Sélection"}</div>
                  </div>
                  <button onClick={toggleImmersiveMode} style={{ ...buttonBase, padding: "0.75rem 1rem" }}>
                    Mode immersif
                  </button>
                </div>
                {loadingTitleId === selectedTitle?.id && <div style={{ color: C.textMuted }}>Chargement des chapitres…</div>}
                {selectedTitle && chapterErrors[selectedTitle.id] && (
                  <div style={{ color: C.red }}>{chapterErrors[selectedTitle.id]}</div>
                )}
                <div style={{ display: "grid", gap: 10 }}>
                  {selectedTitleChapters.map((chapter) => {
                    const active = chapter.id === selectedChapterId;
                    return (
                      <button
                        key={chapter.id}
                        onClick={() => selectChapter(chapter.id)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "0.9rem 1rem",
                          borderRadius: 18,
                          border: `1px solid ${active ? `${selectedTitle?.accent || C.red}88` : C.border}`,
                          background: active ? `${selectedTitle?.accent || C.red}18` : C.panelAlt,
                          color: C.text,
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                          <strong>#{String(chapter.number).padStart(2, "0")} · {chapter.title}</strong>
                          <span style={{ color: C.textDim, fontSize: "0.78rem" }}>{chapter.format.toUpperCase()}</span>
                        </div>
                        <div style={{ color: C.textMuted, fontSize: "0.84rem", lineHeight: 1.5 }}>{chapter.summary}</div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ color: C.textDim, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Reader stage
                </div>
                <div style={{ fontFamily: FONT.display, fontSize: "2rem", lineHeight: 0.9 }}>
                  {selectedChapter?.title || "Choisis un chapitre"}
                </div>
              </div>
              <button onClick={toggleImmersiveMode} style={{ ...buttonBase, padding: "0.75rem 1rem" }}>
                {immersiveMode ? "Quitter l'immersion" : "Mode immersif"}
              </button>
            </div>
            <ReaderPanel chapter={selectedChapter} immersiveMode={immersiveMode} />
          </div>
        </section>
      </div>
    </div>
  );
}
