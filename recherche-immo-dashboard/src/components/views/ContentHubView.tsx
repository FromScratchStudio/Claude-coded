import { useState } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { ProgressBar } from "../ui/ProgressBar";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import type { ContentSeries, ContentEntry, ContentSeriesStatus, ContentItemStatus } from "../../types";

function genId() {
  return `content-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const SERIES_STATUSES: ContentSeriesStatus[] = ["idea", "preparation", "production", "finishing", "published", "archived"];
const ITEM_STATUSES: ContentItemStatus[] = ["idea", "brief", "draft", "review", "approved", "published"];

const SERIES_STATUS_COLOR: Record<ContentSeriesStatus, string> = {
  idea: C.textDim,
  preparation: "#8b80e8",
  production: C.amber,
  finishing: "#e8a040",
  published: C.green,
  archived: C.textVeryDim,
};

const ITEM_STATUS_COLOR: Record<ContentItemStatus, string> = {
  idea: C.textDim,
  brief: "#8b80e8",
  draft: C.amber,
  review: "#e8a040",
  approved: "#40bcd8",
  published: C.green,
};

export default function ContentHubView() {
  const appConfig = useStore((s) => s.appConfig);
  const contentSeries = useStore((s) => s.contentSeries);
  const addContentSeries = useStore((s) => s.addContentSeries);
  const updateContentSeries = useStore((s) => s.updateContentSeries);
  const removeContentSeries = useStore((s) => s.removeContentSeries);
  const addContentEntry = useStore((s) => s.addContentEntry);
  const updateContentEntry = useStore((s) => s.updateContentEntry);
  const removeContentEntry = useStore((s) => s.removeContentEntry);

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(contentSeries[0]?.id ?? null);
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [editSeries, setEditSeries] = useState<ContentSeries | null>(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editEntry, setEditEntry] = useState<ContentEntry | null>(null);

  // Series form
  const [sNum, setSNum] = useState(1);
  const [sTheme, setSTheme] = useState("");
  const [sTargetDate, setSTargetDate] = useState("");
  const [sStatus, setSStatus] = useState<ContentSeriesStatus>("idea");
  const [sNote, setSNote] = useState("");

  // Entry form
  const [eCatId, setECatId] = useState("");
  const [eTitle, setETitle] = useState("");
  const [eAuthor, setEAuthor] = useState("");
  const [eStatus, setEStatus] = useState<ContentItemStatus>("idea");
  const [eWordTarget, setEWordTarget] = useState(0);
  const [eNote, setENote] = useState("");

  const selected = contentSeries.find((s) => s.id === selectedSeriesId) ?? null;

  function openNewSeries() {
    setEditSeries(null);
    setSNum(contentSeries.length + 1);
    setSTheme("");
    setSTargetDate("");
    setSStatus("idea");
    setSNote("");
    setShowSeriesModal(true);
  }

  function openEditSeries(series: ContentSeries) {
    setEditSeries(series);
    setSNum(series.num);
    setSTheme(series.theme);
    setSTargetDate(series.targetDate ?? "");
    setSStatus(series.status);
    setSNote(series.note ?? "");
    setShowSeriesModal(true);
  }

  function saveSeries() {
    if (!sTheme.trim()) return;
    if (editSeries) {
      updateContentSeries(editSeries.id, {
        num: sNum,
        theme: sTheme.trim(),
        targetDate: sTargetDate,
        status: sStatus,
        note: sNote.trim(),
      });
    } else {
      const newSeries: ContentSeries = {
        id: genId(),
        num: sNum,
        theme: sTheme.trim(),
        targetDate: sTargetDate,
        publishedDate: "",
        status: sStatus,
        entries: [],
        note: sNote.trim(),
      };
      addContentSeries(newSeries);
      setSelectedSeriesId(newSeries.id);
    }
    setShowSeriesModal(false);
  }

  function openNewEntry() {
    if (!selected) return;
    setEditEntry(null);
    setECatId("");
    setETitle("");
    setEAuthor("");
    setEStatus("idea");
    setEWordTarget(0);
    setENote("");
    setShowEntryModal(true);
  }

  function openEditEntry(entry: ContentEntry) {
    setEditEntry(entry);
    setECatId(entry.categoryId);
    setETitle(entry.title);
    setEAuthor(entry.author ?? "");
    setEStatus(entry.status);
    setEWordTarget(entry.wordTarget ?? 0);
    setENote(entry.note ?? "");
    setShowEntryModal(true);
  }

  function saveEntry() {
    if (!eTitle.trim() || !selected) return;
    if (editEntry) {
      updateContentEntry(selected.id, editEntry.id, {
        categoryId: eCatId.trim(),
        title: eTitle.trim(),
        author: eAuthor.trim(),
        status: eStatus,
        wordTarget: eWordTarget,
        note: eNote.trim(),
      });
    } else {
      addContentEntry(selected.id, {
        id: genId(),
        categoryId: eCatId.trim(),
        title: eTitle.trim(),
        author: eAuthor.trim(),
        status: eStatus,
        wordTarget: eWordTarget,
        note: eNote.trim(),
      });
    }
    setShowEntryModal(false);
  }

  const published = selected ? selected.entries.filter((e) => e.status === "published").length : 0;
  const total = selected ? selected.entries.length : 0;
  const pct = total > 0 ? Math.round((published / total) * 100) : 0;

  return (
    <div style={{ display: "flex", gap: "1.5rem", minHeight: 600 }}>
      {/* Sidebar */}
      <div style={{ width: 240, flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              color: C.textDim,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {appConfig.contentSeriesLabel}
          </span>
          <button
            onClick={openNewSeries}
            style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 4, color: C.textSoft, cursor: "pointer", fontSize: "0.78rem", padding: "2px 8px" }}
          >
            +
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {contentSeries.map((series) => {
            const done = series.entries.filter((e) => e.status === "published").length;
            const tot = series.entries.length;
            return (
              <button
                key={series.id}
                onClick={() => setSelectedSeriesId(series.id)}
                style={{
                  padding: "0.6rem 0.75rem",
                  background: selectedSeriesId === series.id ? `${C.accent}15` : C.surface,
                  border: `1px solid ${selectedSeriesId === series.id ? C.accent + "40" : C.border}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: "0.72rem", color: C.textDim }}>#{series.num}</span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: SERIES_STATUS_COLOR[series.status],
                      fontWeight: 600,
                    }}
                  >
                    {series.status}
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: C.text, marginBottom: 4 }}>{series.theme}</div>
                <div style={{ fontSize: "0.7rem", color: C.textDim }}>{done}/{tot} published</div>
              </button>
            );
          })}
          {contentSeries.length === 0 && (
            <p style={{ color: C.textVeryDim, fontSize: "0.82rem", padding: "0.5rem" }}>No series yet</p>
          )}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex: 1 }}>
        {selected ? (
          <div>
            <SectionTitle
              sub={`${appConfig.contentSeriesLabel} #${selected.num} · ${selected.targetDate ?? "No target date"}`}
              action={
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={openNewEntry} style={{ ...btnPrimary, fontSize: "0.8rem" }}>
                    + {appConfig.contentItemLabel}
                  </button>
                  <button onClick={() => openEditSeries(selected)} style={{ ...btnSecondary, fontSize: "0.8rem" }}>
                    Edit series
                  </button>
                  <button
                    onClick={() => {
                      removeContentSeries(selected.id);
                      setSelectedSeriesId(contentSeries.find((s) => s.id !== selected.id)?.id ?? null);
                    }}
                    style={{ ...btnDanger, fontSize: "0.8rem" }}
                  >
                    Delete
                  </button>
                </div>
              }
            >
              {selected.theme}
            </SectionTitle>

            {/* Progress */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.78rem", color: C.textMuted }}>
                <span>{published} / {total} published</span>
                <span>{pct}%</span>
              </div>
              <ProgressBar value={pct} color={C.green} />
            </div>

            {/* Status indicators */}
            <div style={{ display: "flex", gap: 6, marginBottom: "1rem", flexWrap: "wrap" }}>
              {ITEM_STATUSES.map((s) => {
                const count = selected.entries.filter((e) => e.status === s).length;
                return (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: ITEM_STATUS_COLOR[s], display: "inline-block" }} />
                    <span style={{ color: ITEM_STATUS_COLOR[s] }}>{s}</span>
                    <span style={{ color: C.textDim }}>({count})</span>
                  </div>
                );
              })}
            </div>

            {/* Entries table */}
            {selected.entries.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {selected.entries.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "0.6rem 1rem",
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      borderLeft: `3px solid ${ITEM_STATUS_COLOR[entry.status]}`,
                    }}
                  >
                    <div
                      style={{
                        width: 70,
                        fontSize: "0.72rem",
                        color: ITEM_STATUS_COLOR[entry.status],
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {entry.status}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.85rem", color: C.text }}>{entry.title}</div>
                      {entry.categoryId && (
                        <div style={{ fontSize: "0.72rem", color: C.textDim }}>{entry.categoryId}</div>
                      )}
                    </div>
                    {entry.author && (
                      <div style={{ fontSize: "0.75rem", color: C.textMuted, minWidth: 80 }}>{entry.author}</div>
                    )}
                    {entry.wordTarget && (
                      <div style={{ fontSize: "0.72rem", color: C.textDim, minWidth: 60 }}>{entry.wordTarget}w</div>
                    )}
                    {/* Status progressor */}
                    <select
                      value={entry.status}
                      onChange={(e) => updateContentEntry(selected.id, entry.id, { status: e.target.value as ContentItemStatus })}
                      style={{
                        background: C.bgDeep,
                        border: `1px solid ${C.border}`,
                        borderRadius: 4,
                        color: ITEM_STATUS_COLOR[entry.status],
                        fontSize: "0.72rem",
                        padding: "2px 4px",
                        cursor: "pointer",
                      }}
                    >
                      {ITEM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button
                      onClick={() => openEditEntry(entry)}
                      style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.78rem" }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "2rem", textAlign: "center", color: C.textDim, border: `1px dashed ${C.border}`, borderRadius: 8 }}>
                <p>No entries yet.</p>
                <button onClick={openNewEntry} style={btnPrimary}>Add first {appConfig.contentItemLabel.toLowerCase()}</button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: C.textDim, gap: "1rem" }}>
            <p>Select or create a {appConfig.contentSeriesLabel.toLowerCase().replace(/s$/, "")}.</p>
            <button onClick={openNewSeries} style={btnPrimary}>+ New {appConfig.contentSeriesLabel.replace(/s$/, "")}</button>
          </div>
        )}
      </div>

      {/* Series Modal */}
      <Modal open={showSeriesModal} onClose={() => setShowSeriesModal(false)} title={editSeries ? "Edit Series" : "New Series"}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>#</label>
            <input type="number" min={1} value={sNum} onChange={(e) => setSNum(Number(e.target.value))} style={{ ...inputStyle, width: 60 }} />
          </div>
          <div>
            <label style={labelStyle}>Theme / title</label>
            <input value={sTheme} onChange={(e) => setSTheme(e.target.value)} style={inputStyle} autoFocus />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Target date</label>
            <input type="date" value={sTargetDate} onChange={(e) => setSTargetDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={sStatus} onChange={(e) => setSStatus(e.target.value as ContentSeriesStatus)} style={{ ...inputStyle, cursor: "pointer" }}>
              {SERIES_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Note</label>
          <textarea value={sNote} onChange={(e) => setSNote(e.target.value)} style={{ ...inputStyle, height: 60, resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => setShowSeriesModal(false)} style={btnSecondary}>Cancel</button>
          <button onClick={saveSeries} style={btnPrimary}>Save</button>
        </div>
      </Modal>

      {/* Entry Modal */}
      <Modal open={showEntryModal} onClose={() => setShowEntryModal(false)} title={editEntry ? `Edit ${appConfig.contentItemLabel}` : `New ${appConfig.contentItemLabel}`}>
        <div style={formRow}>
          <label style={labelStyle}>Title</label>
          <input value={eTitle} onChange={(e) => setETitle(e.target.value)} style={inputStyle} autoFocus />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Category</label>
            <input value={eCatId} onChange={(e) => setECatId(e.target.value)} style={inputStyle} placeholder="blog, video, social" />
          </div>
          <div>
            <label style={labelStyle}>Author</label>
            <input value={eAuthor} onChange={(e) => setEAuthor(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={eStatus} onChange={(e) => setEStatus(e.target.value as ContentItemStatus)} style={{ ...inputStyle, cursor: "pointer" }}>
              {ITEM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Word target</label>
            <input type="number" min={0} value={eWordTarget} onChange={(e) => setEWordTarget(Number(e.target.value))} style={inputStyle} />
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Note</label>
          <input value={eNote} onChange={(e) => setENote(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editEntry && selected && <button onClick={() => { removeContentEntry(selected.id, editEntry.id); setShowEntryModal(false); }} style={btnDanger}>Delete</button>}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowEntryModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={saveEntry} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
