import { useState, useEffect, useId } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import {
  KM_RUBRICS,
  KM_ISSUE_STATUS_META,
  KM_ARTICLE_STATUS_META,
  KM_ARTICLE_STATUS_ORDER,
  KM_ISSUE_STATUS_ORDER,
} from "../../data/km";
import type { KMIssue, KMArticle, KMIssueStatus, KMArticleStatus } from "../../types";

// ─── Design tokens spécifiques KM ─────────────────────────────────────────────
const KM = {
  red: "#BF3209",
  gold: "#A8821F",
  bg: "#141008",
  bgAlt: "#1c1610",
  brd: "#2a1e10",
  txt: "#EAE2D4",
  muted: "#6b5c47",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function padNum(n: number): string {
  return `N°${String(n).padStart(3, "0")}`;
}

function rubricById(id: string) {
  return KM_RUBRICS.find((r) => r.id === id) ?? { num: "—", label: id };
}

function fmtDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function articleProgress(articles: KMArticle[]): { done: number; total: number } {
  return {
    done: articles.filter((a) => a.status === "valide" || a.status === "publie").length,
    total: articles.length,
  };
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function IssueStatusBadge({ status }: { status: KMIssueStatus }) {
  const meta = KM_ISSUE_STATUS_META[status];
  return (
    <span
      style={{
        fontFamily: FONT.mono,
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: meta.color,
        background: meta.bg,
        border: `1px solid ${meta.color}33`,
        borderRadius: 4,
        padding: "2px 8px",
      }}
    >
      {meta.label}
    </span>
  );
}

function ArticleStatusBadge({
  status,
  onClick,
}: {
  status: KMArticleStatus;
  onClick?: () => void;
}) {
  const meta = KM_ARTICLE_STATUS_META[status];
  return (
    <span
      onClick={onClick}
      title={onClick ? "Cliquer pour avancer le statut" : undefined}
      style={{
        fontFamily: FONT.mono,
        fontSize: 9,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: meta.color,
        border: `1px solid ${meta.color}55`,
        borderRadius: 3,
        padding: "2px 7px",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {meta.label}
    </span>
  );
}

// ─── Progress pill ────────────────────────────────────────────────────────────
function ProgressPill({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const color = pct === 100 ? "#10b981" : pct >= 50 ? KM.gold : KM.muted;
  return (
    <span style={{ fontFamily: FONT.mono, fontSize: 11, color }}>
      {done}/{total}
    </span>
  );
}

// ─── Issue card (sidebar) ─────────────────────────────────────────────────────
function IssueCard({
  issue,
  selected,
  onClick,
}: {
  issue: KMIssue;
  selected: boolean;
  onClick: () => void;
}) {
  const { done, total } = articleProgress(issue.articles);
  const meta = KM_ISSUE_STATUS_META[issue.status];
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: selected ? KM.bgAlt : "transparent",
        border: selected ? `1px solid ${KM.red}66` : `1px solid ${KM.brd}`,
        borderRadius: 8,
        padding: "12px 14px",
        cursor: "pointer",
        marginBottom: 8,
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 13,
            fontWeight: 700,
            color: selected ? KM.red : KM.txt,
            letterSpacing: "0.05em",
          }}
        >
          {padNum(issue.num)}
        </span>
        <IssueStatusBadge status={issue.status} />
      </div>
      <div
        style={{
          fontFamily: FONT.display,
          fontSize: 12,
          color: KM.txt,
          marginBottom: 6,
          lineHeight: 1.3,
          opacity: 0.85,
        }}
      >
        {issue.theme || <em style={{ opacity: 0.5 }}>Thème non défini</em>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 10, color: KM.muted }}>
          {fmtDate(issue.targetDate)}
        </span>
        <ProgressPill done={done} total={total} />
      </div>
      {total > 0 && (
        <div
          style={{
            marginTop: 6,
            height: 3,
            background: KM.brd,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(done / total) * 100}%`,
              background: meta.color,
              borderRadius: 2,
              transition: "width 0.3s",
            }}
          />
        </div>
      )}
    </button>
  );
}

// ─── New issue form ───────────────────────────────────────────────────────────
function NewIssueForm({
  existingNums,
  onSave,
  onCancel,
}: {
  existingNums: number[];
  onSave: (issue: KMIssue) => void;
  onCancel: () => void;
}) {
  const nextNum = existingNums.length === 0 ? 1 : Math.max(...existingNums) + 1;
  const [num, setNum] = useState(nextNum);
  const [theme, setTheme] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [note, setNote] = useState("");

  const formId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: `km-${uid()}`,
      num,
      theme,
      targetDate,
      publishedDate: "",
      status: "idee",
      articles: [],
      note,
    });
  }

  const inputStyle: React.CSSProperties = {
    background: KM.bg,
    border: `1px solid ${KM.brd}`,
    borderRadius: 6,
    color: KM.txt,
    fontFamily: FONT.body,
    fontSize: 13,
    padding: "7px 10px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: KM.bgAlt,
        border: `1px solid ${KM.red}55`,
        borderRadius: 8,
        padding: "14px",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          fontFamily: FONT.mono,
          fontSize: 10,
          color: KM.red,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Nouveau numéro
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: "0 0 72px" }}>
          <label
            htmlFor={`${formId}-num`}
            style={{ display: "block", fontFamily: FONT.mono, fontSize: 9, color: KM.muted, marginBottom: 3 }}
          >
            N°
          </label>
          <input
            id={`${formId}-num`}
            type="number"
            min={1}
            value={num}
            onChange={(e) => setNum(Number(e.target.value))}
            style={{ ...inputStyle }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            htmlFor={`${formId}-date`}
            style={{ display: "block", fontFamily: FONT.mono, fontSize: 9, color: KM.muted, marginBottom: 3 }}
          >
            Date cible
          </label>
          <input
            id={`${formId}-date`}
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            style={{
              ...inputStyle,
              colorScheme: "dark",
            }}
          />
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label
          htmlFor={`${formId}-theme`}
          style={{ display: "block", fontFamily: FONT.mono, fontSize: 9, color: KM.muted, marginBottom: 3 }}
        >
          Thème
        </label>
        <input
          id={`${formId}-theme`}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Le thème central du numéro"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label
          htmlFor={`${formId}-note`}
          style={{ display: "block", fontFamily: FONT.mono, fontSize: 9, color: KM.muted, marginBottom: 3 }}
        >
          Note
        </label>
        <input
          id={`${formId}-note`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notes de contexte…"
          style={inputStyle}
        />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="submit"
          style={{
            flex: 1,
            background: KM.red,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "7px 0",
            fontFamily: FONT.mono,
            fontSize: 11,
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          Créer
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "transparent",
            color: KM.muted,
            border: `1px solid ${KM.brd}`,
            borderRadius: 6,
            padding: "7px 14px",
            fontFamily: FONT.mono,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

// ─── New article form ─────────────────────────────────────────────────────────
function NewArticleForm({
  issueId,
  onSave,
  onCancel,
}: {
  issueId: string;
  onSave: (issueId: string, article: KMArticle) => void;
  onCancel: () => void;
}) {
  const [rubricId, setRubricId] = useState(KM_RUBRICS[0].id);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<KMArticleStatus>("idee");
  const [wordTarget, setWordTarget] = useState(0);
  const [note, setNote] = useState("");
  const formId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(issueId, {
      id: `a-${uid()}`,
      rubricId,
      title: title.trim(),
      author: author.trim(),
      status,
      wordTarget,
      note: note.trim(),
    });
  }

  const inputStyle: React.CSSProperties = {
    background: "#0a0c10",
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    color: C.text,
    fontFamily: FONT.body,
    fontSize: 13,
    padding: "6px 10px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: FONT.mono,
    fontSize: 9,
    color: C.textDim,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };

  return (
    <tr>
      <td
        colSpan={7}
        style={{ padding: "12px 16px", background: C.surfaceAlt, borderTop: `1px solid ${C.border}` }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: 9,
              color: KM.gold,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Nouvel article
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
            <div style={{ flex: "0 0 160px" }}>
              <label htmlFor={`${formId}-rubric`} style={labelStyle}>Rubrique</label>
              <select
                id={`${formId}-rubric`}
                value={rubricId}
                onChange={(e) => setRubricId(e.target.value)}
                style={selectStyle}
              >
                {KM_RUBRICS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.num} — {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label htmlFor={`${formId}-title`} style={labelStyle}>Titre</label>
              <input
                id={`${formId}-title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'article"
                style={inputStyle}
                required
              />
            </div>
            <div style={{ flex: "0 1 140px" }}>
              <label htmlFor={`${formId}-author`} style={labelStyle}>Auteur·ice</label>
              <input
                id={`${formId}-author`}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Auteur·ice"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "0 0 130px" }}>
              <label htmlFor={`${formId}-status`} style={labelStyle}>Statut</label>
              <select
                id={`${formId}-status`}
                value={status}
                onChange={(e) => setStatus(e.target.value as KMArticleStatus)}
                style={selectStyle}
              >
                {KM_ARTICLE_STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {KM_ARTICLE_STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: "0 0 100px" }}>
              <label htmlFor={`${formId}-words`} style={labelStyle}>Mots cibles</label>
              <input
                id={`${formId}-words`}
                type="number"
                min={0}
                value={wordTarget}
                onChange={(e) => setWordTarget(Number(e.target.value))}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label htmlFor={`${formId}-note`} style={labelStyle}>Note</label>
              <input
                id={`${formId}-note`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Notes…"
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              style={{
                background: KM.gold,
                color: "#000",
                border: "none",
                borderRadius: 6,
                padding: "6px 16px",
                fontFamily: FONT.mono,
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: "transparent",
                color: C.textDim,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: "6px 14px",
                fontFamily: FONT.mono,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}

// ─── Article edit row ─────────────────────────────────────────────────────────
function ArticleEditRow({
  article,
  issueId,
  onSave,
  onCancel,
}: {
  article: KMArticle;
  issueId: string;
  onSave: (issueId: string, articleId: string, updates: Partial<Omit<KMArticle, "id">>) => void;
  onCancel: () => void;
}) {
  const [rubricId, setRubricId] = useState(article.rubricId);
  const [title, setTitle] = useState(article.title);
  const [author, setAuthor] = useState(article.author);
  const [status, setStatus] = useState<KMArticleStatus>(article.status);
  const [wordTarget, setWordTarget] = useState(article.wordTarget);
  const [note, setNote] = useState(article.note);
  const formId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(issueId, article.id, { rubricId, title, author, status, wordTarget, note });
  }

  const inputStyle: React.CSSProperties = {
    background: "#0a0c10",
    border: `1px solid ${C.border}`,
    borderRadius: 5,
    color: C.text,
    fontFamily: FONT.body,
    fontSize: 12,
    padding: "4px 8px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: FONT.mono,
    fontSize: 9,
    color: C.textDim,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };

  return (
    <tr>
      <td
        colSpan={7}
        style={{ padding: "12px 16px", background: C.surfaceAlt, borderTop: `1px solid ${C.border}` }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
            <div style={{ flex: "0 0 160px" }}>
              <label htmlFor={`${formId}-rubric`} style={labelStyle}>Rubrique</label>
              <select
                id={`${formId}-rubric`}
                value={rubricId}
                onChange={(e) => setRubricId(e.target.value)}
                style={selectStyle}
              >
                {KM_RUBRICS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.num} — {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label htmlFor={`${formId}-title`} style={labelStyle}>Titre</label>
              <input
                id={`${formId}-title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ flex: "0 1 140px" }}>
              <label htmlFor={`${formId}-author`} style={labelStyle}>Auteur·ice</label>
              <input
                id={`${formId}-author`}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "0 0 130px" }}>
              <label htmlFor={`${formId}-status`} style={labelStyle}>Statut</label>
              <select
                id={`${formId}-status`}
                value={status}
                onChange={(e) => setStatus(e.target.value as KMArticleStatus)}
                style={selectStyle}
              >
                {KM_ARTICLE_STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {KM_ARTICLE_STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: "0 0 100px" }}>
              <label htmlFor={`${formId}-words`} style={labelStyle}>Mots cibles</label>
              <input
                id={`${formId}-words`}
                type="number"
                min={0}
                value={wordTarget}
                onChange={(e) => setWordTarget(Number(e.target.value))}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label htmlFor={`${formId}-note`} style={labelStyle}>Note</label>
              <input
                id={`${formId}-note`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              style={{
                background: KM.gold,
                color: "#000",
                border: "none",
                borderRadius: 6,
                padding: "5px 14px",
                fontFamily: FONT.mono,
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: "transparent",
                color: C.textDim,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: "5px 12px",
                fontFamily: FONT.mono,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}

// ─── Issue detail panel ───────────────────────────────────────────────────────
function IssueDetail({ issue }: { issue: KMIssue }) {
  const updateKMIssue = useStore((s) => s.updateKMIssue);
  const removeKMIssue = useStore((s) => s.removeKMIssue);
  const addKMArticle = useStore((s) => s.addKMArticle);
  const updateKMArticle = useStore((s) => s.updateKMArticle);
  const removeKMArticle = useStore((s) => s.removeKMArticle);

  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const formId = useId();

  const { done, total } = articleProgress(issue.articles);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  function cycleArticleStatus(article: KMArticle) {
    const idx = KM_ARTICLE_STATUS_ORDER.indexOf(article.status);
    const next = KM_ARTICLE_STATUS_ORDER[Math.min(idx + 1, KM_ARTICLE_STATUS_ORDER.length - 1)] as KMArticleStatus;
    updateKMArticle(issue.id, article.id, { status: next });
  }

  const inputStyle: React.CSSProperties = {
    background: KM.bg,
    border: `1px solid ${KM.brd}`,
    borderRadius: 6,
    color: KM.txt,
    fontFamily: FONT.body,
    fontSize: 13,
    padding: "7px 10px",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "0 0 40px 0" }}>
      {/* ── Header ── */}
      <div
        style={{
          borderBottom: `1px solid ${KM.brd}`,
          paddingBottom: 20,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 6, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 28,
              fontWeight: 900,
              color: KM.red,
              letterSpacing: "0.04em",
            }}
          >
            {padNum(issue.num)}
          </span>
          <select
            value={issue.status}
            onChange={(e) =>
              updateKMIssue(issue.id, { status: e.target.value as KMIssueStatus })
            }
            style={{
              ...inputStyle,
              fontSize: 11,
              fontFamily: FONT.mono,
              letterSpacing: "0.08em",
              padding: "4px 10px",
              background: KM_ISSUE_STATUS_META[issue.status].bg,
              color: KM_ISSUE_STATUS_META[issue.status].color,
              border: `1px solid ${KM_ISSUE_STATUS_META[issue.status].color}55`,
              cursor: "pointer",
              width: "auto",
            }}
          >
            {KM_ISSUE_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {KM_ISSUE_STATUS_META[s].label}
              </option>
            ))}
          </select>

          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              title="Supprimer ce numéro"
              style={{
                marginLeft: "auto",
                background: "transparent",
                border: `1px solid ${C.border}`,
                color: C.textDim,
                borderRadius: 6,
                padding: "4px 10px",
                fontFamily: FONT.mono,
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              Supprimer
            </button>
          ) : (
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 11, color: "#ef4444" }}>Confirmer ?</span>
              <button
                onClick={() => removeKMIssue(issue.id)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontFamily: FONT.mono,
                  fontSize: 10,
                  cursor: "pointer",
                }}
              >
                Oui, supprimer
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.textDim,
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontFamily: FONT.mono,
                  fontSize: 10,
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
            </div>
          )}
        </div>

        {/* Theme */}
        <input
          value={issue.theme}
          onChange={(e) => updateKMIssue(issue.id, { theme: e.target.value })}
          placeholder="Thème du numéro…"
          style={{
            ...inputStyle,
            fontSize: 20,
            fontFamily: FONT.display,
            fontWeight: 700,
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${KM.brd}`,
            borderRadius: 0,
            color: KM.txt,
            width: "100%",
            marginBottom: 16,
            paddingLeft: 0,
          }}
        />

        {/* Dates + progress */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <label
              htmlFor={`${formId}-target`}
              style={{ display: "block", fontFamily: FONT.mono, fontSize: 9, color: KM.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              Date cible
            </label>
            <input
              id={`${formId}-target`}
              type="date"
              value={issue.targetDate}
              onChange={(e) => updateKMIssue(issue.id, { targetDate: e.target.value })}
              style={{ ...inputStyle, colorScheme: "dark", width: "auto" }}
            />
          </div>
          <div>
            <label
              htmlFor={`${formId}-published`}
              style={{ display: "block", fontFamily: FONT.mono, fontSize: 9, color: KM.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              Date de publication
            </label>
            <input
              id={`${formId}-published`}
              type="date"
              value={issue.publishedDate}
              onChange={(e) => updateKMIssue(issue.id, { publishedDate: e.target.value })}
              style={{ ...inputStyle, colorScheme: "dark", width: "auto" }}
            />
          </div>
          {total > 0 && (
            <div style={{ marginLeft: "auto" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 10, color: KM.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Progression articles
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 120, height: 6, background: KM.brd, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#10b981" : KM.gold, borderRadius: 3 }} />
                </div>
                <span style={{ fontFamily: FONT.mono, fontSize: 12, color: pct === 100 ? "#10b981" : KM.txt }}>
                  {done}/{total} ({pct}%)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Note */}
        <div style={{ marginTop: 14 }}>
          <label
            htmlFor={`${formId}-note`}
            style={{ display: "block", fontFamily: FONT.mono, fontSize: 9, color: KM.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            Note
          </label>
          <input
            id={`${formId}-note`}
            value={issue.note}
            onChange={(e) => updateKMIssue(issue.id, { note: e.target.value })}
            placeholder="Notes de production…"
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>
      </div>

      {/* ── Articles ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 11, color: KM.gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Articles — {issue.articles.length}
          </span>
          {!showAddArticle && (
            <button
              onClick={() => { setShowAddArticle(true); setEditingArticleId(null); }}
              style={{
                background: KM.red,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                fontFamily: FONT.mono,
                fontSize: 11,
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              + Ajouter un article
            </button>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                {["Rubrique", "Titre", "Auteur·ice", "Statut", "Mots", "Note", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontFamily: FONT.mono,
                      fontSize: 9,
                      color: KM.muted,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "0 10px 10px 0",
                      borderBottom: `1px solid ${KM.brd}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issue.articles.map((article) => {
                const rubric = rubricById(article.rubricId);
                if (editingArticleId === article.id) {
                  return (
                    <ArticleEditRow
                      key={article.id}
                      article={article}
                      issueId={issue.id}
                      onSave={(iid, aid, updates) => {
                        updateKMArticle(iid, aid, updates);
                        setEditingArticleId(null);
                      }}
                      onCancel={() => setEditingArticleId(null)}
                    />
                  );
                }
                return (
                  <tr key={article.id} style={{ borderBottom: `1px solid ${KM.brd}22` }}>
                    {/* Rubrique */}
                    <td style={{ padding: "10px 10px 10px 0", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontFamily: FONT.mono,
                          fontSize: 10,
                          color: KM.gold,
                          marginRight: 6,
                        }}
                      >
                        {rubric.num}
                      </span>
                      <span style={{ fontFamily: FONT.body, fontSize: 12, color: KM.muted }}>
                        {rubric.label}
                      </span>
                    </td>
                    {/* Titre */}
                    <td style={{ padding: "10px 10px 10px 0", verticalAlign: "middle", maxWidth: 280 }}>
                      <span style={{ fontFamily: FONT.body, fontSize: 13, color: KM.txt }}>
                        {article.title}
                      </span>
                    </td>
                    {/* Auteur */}
                    <td style={{ padding: "10px 10px 10px 0", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: FONT.body, fontSize: 12, color: KM.muted }}>
                        {article.author || "—"}
                      </span>
                    </td>
                    {/* Statut */}
                    <td style={{ padding: "10px 10px 10px 0", verticalAlign: "middle" }}>
                      <ArticleStatusBadge
                        status={article.status}
                        onClick={() => cycleArticleStatus(article)}
                      />
                    </td>
                    {/* Mots */}
                    <td style={{ padding: "10px 10px 10px 0", verticalAlign: "middle", textAlign: "right", whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: FONT.mono, fontSize: 11, color: article.wordTarget > 0 ? KM.muted : "transparent" }}>
                        {article.wordTarget > 0 ? `${article.wordTarget} m.` : "—"}
                      </span>
                    </td>
                    {/* Note */}
                    <td style={{ padding: "10px 10px 10px 0", verticalAlign: "middle", maxWidth: 180 }}>
                      <span style={{ fontFamily: FONT.body, fontSize: 11, color: KM.muted, opacity: 0.8, fontStyle: article.note ? "normal" : "italic" }}>
                        {article.note || "—"}
                      </span>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: "10px 0", verticalAlign: "middle", textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => { setEditingArticleId(article.id); setShowAddArticle(false); }}
                        title="Modifier"
                        style={{
                          background: "transparent",
                          border: `1px solid ${C.border}`,
                          color: C.textDim,
                          borderRadius: 5,
                          padding: "3px 9px",
                          fontFamily: FONT.mono,
                          fontSize: 10,
                          cursor: "pointer",
                          marginRight: 4,
                        }}
                      >
                        Éditer
                      </button>
                      <button
                        onClick={() => removeKMArticle(issue.id, article.id)}
                        title="Supprimer"
                        style={{
                          background: "transparent",
                          border: `1px solid ${C.border}`,
                          color: "#ef4444",
                          borderRadius: 5,
                          padding: "3px 7px",
                          fontFamily: FONT.mono,
                          fontSize: 10,
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
              {showAddArticle && (
                <NewArticleForm
                  issueId={issue.id}
                  onSave={(iid, article) => {
                    addKMArticle(iid, article);
                    setShowAddArticle(false);
                  }}
                  onCancel={() => setShowAddArticle(false)}
                />
              )}
              {issue.articles.length === 0 && !showAddArticle && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "32px 0",
                      textAlign: "center",
                      fontFamily: FONT.body,
                      fontSize: 13,
                      color: KM.muted,
                      fontStyle: "italic",
                    }}
                  >
                    Aucun article — cliquez «&nbsp;Ajouter un article&nbsp;» pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Overview grid (no issue selected) ────────────────────────────────────────
function OverviewGrid({
  issues,
  onSelect,
}: {
  issues: KMIssue[];
  onSelect: (id: string) => void;
}) {
  if (issues.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: KM.muted,
          fontFamily: FONT.body,
          fontSize: 14,
          gap: 12,
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.3 }}>◈</div>
        <div>Aucun numéro créé. Commencez par ajouter un numéro dans la barre latérale.</div>
      </div>
    );
  }
  return (
    <div
      style={{
        flex: 1,
        padding: "4px 0 40px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
        alignContent: "start",
      }}
    >
      {issues.map((issue) => {
        const { done, total } = articleProgress(issue.articles);
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        const meta = KM_ISSUE_STATUS_META[issue.status];
        return (
          <button
            key={issue.id}
            onClick={() => onSelect(issue.id)}
            style={{
              display: "block",
              textAlign: "left",
              background: KM.bgAlt,
              border: `1px solid ${KM.brd}`,
              borderRadius: 10,
              padding: "20px",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = KM.red)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = KM.brd)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 22,
                  fontWeight: 900,
                  color: KM.red,
                  letterSpacing: "0.04em",
                }}
              >
                {padNum(issue.num)}
              </span>
              <IssueStatusBadge status={issue.status} />
            </div>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 15,
                fontWeight: 700,
                color: KM.txt,
                marginBottom: 12,
                lineHeight: 1.3,
                minHeight: 40,
              }}
            >
              {issue.theme || <em style={{ opacity: 0.4, fontStyle: "normal" }}>Thème non défini</em>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 10, color: KM.muted }}>
                {fmtDate(issue.targetDate)}
              </span>
              {issue.publishedDate && (
                <span style={{ fontFamily: FONT.mono, fontSize: 10, color: "#10b981" }}>
                  ✓ Publié {fmtDate(issue.publishedDate)}
                </span>
              )}
            </div>
            {total > 0 && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: 10, color: KM.muted }}>
                    {total} article{total > 1 ? "s" : ""}
                  </span>
                  <span style={{ fontFamily: FONT.mono, fontSize: 10, color: meta.color }}>
                    {done} validé{done > 1 ? "s" : ""} · {pct}%
                  </span>
                </div>
                <div style={{ height: 4, background: KM.brd, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: meta.color, borderRadius: 2 }} />
                </div>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function KeftaMateshaView() {
  const kmIssues = useStore((s) => s.kmIssues);
  const addKMIssue = useStore((s) => s.addKMIssue);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const selectedIssue = kmIssues.find((i) => i.id === selectedId) ?? null;
  // If selected issue was deleted, reset
  useEffect(() => {
    if (selectedId && !selectedIssue) {
      setSelectedId(null);
    }
  }, [selectedId, selectedIssue]);

  const publishedCount = kmIssues.filter((i) => i.status === "publie").length;
  const inProgressCount = kmIssues.filter((i) => i.status === "production" || i.status === "finition").length;
  const allArticles = kmIssues.flatMap((i) => i.articles);
  const validatedArticles = allArticles.filter((a) => a.status === "valide" || a.status === "publie").length;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* ── Page header ── */}
      <div
        style={{
          paddingBottom: 20,
          marginBottom: 20,
          borderBottom: `1px solid ${KM.brd}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
          <h1
            style={{
              fontFamily: FONT.display,
              fontSize: 26,
              fontWeight: 900,
              color: KM.txt,
              margin: 0,
              letterSpacing: "0.03em",
            }}
          >
            Kefta Matesha
          </h1>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 10,
              color: KM.red,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderLeft: `2px solid ${KM.red}`,
              paddingLeft: 10,
            }}
          >
            Studio FromScratch & HINOIA
          </span>
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: 12, flexWrap: "wrap" }}>
          {[
            { label: "Numéros", value: kmIssues.length, color: KM.txt },
            { label: "En production", value: inProgressCount, color: KM.red },
            { label: "Publiés", value: publishedCount, color: "#10b981" },
            { label: "Articles validés", value: `${validatedArticles}/${allArticles.length}`, color: KM.gold },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{ fontFamily: FONT.mono, fontSize: 9, color: KM.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>
                {label}
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 20, fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body (sidebar + main) ── */}
      <div style={{ flex: 1, display: "flex", gap: 24, overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 9, color: KM.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Numéros
          </div>

          {showNewForm ? (
            <NewIssueForm
              existingNums={kmIssues.map((i) => i.num)}
              onSave={(issue) => {
                addKMIssue(issue);
                setShowNewForm(false);
                setSelectedId(issue.id);
              }}
              onCancel={() => setShowNewForm(false)}
            />
          ) : (
            <button
              onClick={() => setShowNewForm(true)}
              style={{
                display: "block",
                width: "100%",
                background: "transparent",
                border: `1px dashed ${KM.red}66`,
                color: KM.red,
                borderRadius: 7,
                padding: "8px 0",
                fontFamily: FONT.mono,
                fontSize: 11,
                cursor: "pointer",
                marginBottom: 10,
                letterSpacing: "0.05em",
              }}
            >
              + Nouveau numéro
            </button>
          )}

          <div style={{ overflow: "auto", flex: 1 }}>
            {kmIssues
              .slice()
              .sort((a, b) => a.num - b.num)
              .map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  selected={selectedId === issue.id}
                  onClick={() => {
                    setSelectedId(issue.id === selectedId ? null : issue.id);
                    setShowNewForm(false);
                  }}
                />
              ))}
          </div>
        </div>

        {/* Main panel */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            paddingLeft: 24,
            borderLeft: `1px solid ${KM.brd}`,
          }}
        >
          {selectedIssue ? (
            <IssueDetail issue={selectedIssue} />
          ) : (
            <OverviewGrid issues={kmIssues} onSelect={setSelectedId} />
          )}
        </div>
      </div>
    </div>
  );
}
