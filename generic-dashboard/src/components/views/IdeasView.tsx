import { useState } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";
import { Tag } from "../ui/Badge";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import type { Idea } from "../../types";

function genId() {
  return `idea-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

import type { IdeaStage } from "../../types";
type IdeaStatus = IdeaStage;

const STATUS_LABELS: Record<IdeaStatus, string> = {
  raw: "Raw",
  sorted: "Sorted",
  selected: "Selected",
};

const STATUS_COLORS: Record<IdeaStatus, string> = {
  raw: C.textDim,
  sorted: C.amber,
  selected: C.green,
};

export default function IdeasView() {
  const ideas = useStore((s) => s.ideas);
  const addIdea = useStore((s) => s.addIdea);
  const updateIdea = useStore((s) => s.updateIdea);
  const removeIdea = useStore((s) => s.removeIdea);

  const [showModal, setShowModal] = useState(false);
  const [editIdea, setEditIdea] = useState<Idea | null>(null);

  const [iText, setIText] = useState("");
  const [iSource, setISource] = useState("");
  const [iTags, setITags] = useState("");
  const [iStatus, setIStatus] = useState<IdeaStatus>("raw");

  function openNew() {
    setEditIdea(null);
    setIText("");
    setISource("");
    setITags("");
    setIStatus("raw");
    setShowModal(true);
  }

  function openEdit(idea: Idea) {
    setEditIdea(idea);
    setIText(idea.text);
    setISource(idea.source ?? "");
    setITags((idea.tags ?? []).join(", "));
    setIStatus(idea.stage);
    setShowModal(true);
  }

  function save() {
    if (!iText.trim()) return;
    const tags = iTags.split(",").map((t) => t.trim()).filter(Boolean);
    if (editIdea) {
      updateIdea(editIdea.id, {
        text: iText.trim(),
        source: iSource.trim(),
        tags,
        stage: iStatus,
      });
    } else {
      addIdea({
        id: genId(),
        text: iText.trim(),
        source: iSource.trim(),
        tags,
        stage: iStatus,
        createdAt: new Date().toISOString(),
      });
    }
    setShowModal(false);
  }

  const columns: IdeaStatus[] = ["raw", "sorted", "selected"];

  const advance = (idea: Idea) => {
    const order: IdeaStatus[] = ["raw", "sorted", "selected"];
    const cur = order.indexOf(idea.stage);
    if (cur < order.length - 1) {
      updateIdea(idea.id, { stage: order[cur + 1] });
    }
  };

  const retreat = (idea: Idea) => {
    const order: IdeaStatus[] = ["raw", "sorted", "selected"];
    const cur = order.indexOf(idea.stage);
    if (cur > 0) {
      updateIdea(idea.id, { stage: order[cur - 1] });
    }
  };

  return (
    <div>
      <SectionTitle
        sub={`${ideas.length} ideas captured`}
        action={
          <button onClick={openNew} style={{ ...btnPrimary, fontSize: "0.8rem" }}>
            + Idea
          </button>
        }
      >
        Ideas
      </SectionTitle>

      {/* Kanban */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {columns.map((col) => {
          const colIdeas = ideas.filter((i) => i.stage === col);
          return (
            <div key={col}>
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: "0.75rem",
                  paddingBottom: "0.5rem",
                  borderBottom: `2px solid ${STATUS_COLORS[col]}40`,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: STATUS_COLORS[col],
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: "0.85rem", color: STATUS_COLORS[col], fontWeight: 600 }}>
                  {STATUS_LABELS[col]}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    background: C.surfaceAlt,
                    color: C.textDim,
                    borderRadius: 10,
                    padding: "1px 7px",
                  }}
                >
                  {colIdeas.length}
                </span>
              </div>

              {/* Ideas */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {colIdeas.map((idea) => (
                  <Card key={idea.id} hover>
                    <p style={{ margin: "0 0 8px", fontSize: "0.85rem", color: C.text, lineHeight: 1.5 }}>
                      {idea.text}
                    </p>
                    {idea.source && (
                      <p style={{ margin: "0 0 6px", fontSize: "0.72rem", color: C.textDim }}>
                        Source: {idea.source}
                      </p>
                    )}
                    {(idea.tags ?? []).length > 0 && (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                        {(idea.tags ?? []).map((tag) => (
                          <Tag key={tag} label={tag} />
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {col !== "raw" && (
                          <button
                            onClick={() => retreat(idea)}
                            style={{
                              padding: "2px 8px",
                              background: C.surfaceAlt,
                              border: `1px solid ${C.border}`,
                              borderRadius: 4,
                              color: C.textDim,
                              cursor: "pointer",
                              fontSize: "0.72rem",
                            }}
                          >
                            ←
                          </button>
                        )}
                        {col !== "selected" && (
                          <button
                            onClick={() => advance(idea)}
                            style={{
                              padding: "2px 8px",
                              background: `${STATUS_COLORS[col]}10`,
                              border: `1px solid ${STATUS_COLORS[col]}30`,
                              borderRadius: 4,
                              color: STATUS_COLORS[col],
                              cursor: "pointer",
                              fontSize: "0.72rem",
                            }}
                          >
                            →
                          </button>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => openEdit(idea)}
                          style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.72rem" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeIdea(idea.id)}
                          style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.72rem" }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
                {colIdeas.length === 0 && (
                  <div
                    style={{
                      padding: "1.5rem",
                      textAlign: "center",
                      color: C.textVeryDim,
                      fontSize: "0.78rem",
                      border: `1px dashed ${C.border}`,
                      borderRadius: 8,
                    }}
                  >
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editIdea ? "Edit Idea" : "Capture Idea"}>
        <div style={formRow}>
          <label style={labelStyle}>Idea</label>
          <textarea
            value={iText}
            onChange={(e) => setIText(e.target.value)}
            style={{ ...inputStyle, height: 80, resize: "vertical" }}
            placeholder="Describe the idea…"
            autoFocus
          />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Source / inspiration</label>
          <input value={iSource} onChange={(e) => setISource(e.target.value)} style={inputStyle} placeholder="Where did this come from?" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input value={iTags} onChange={(e) => setITags(e.target.value)} style={inputStyle} placeholder="design, growth, feature" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Status</label>
          <select value={iStatus} onChange={(e) => setIStatus(e.target.value as IdeaStatus)} style={{ ...inputStyle, cursor: "pointer" }}>
            {columns.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editIdea && <button onClick={() => { removeIdea(editIdea.id); setShowModal(false); }} style={btnDanger}>Delete</button>}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={save} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
