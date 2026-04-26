import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import type { Idea, IdeaStage } from "../../types";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";

const STAGE_META: Record<IdeaStage, { label: string; color: string; desc: string }> = {
  raw: { label: "Raw", color: C.textDim, desc: "Unfiltered captures" },
  sorted: { label: "Sorted", color: C.amber, desc: "Worth exploring" },
  selected: { label: "Selected", color: C.green, desc: "Committed to action" },
};

const iStyle: React.CSSProperties = {
  background: C.surfaceAlt,
  border: `1px solid ${C.border}`,
  color: C.text,
  borderRadius: 5,
  padding: "0.35rem 0.55rem",
  fontSize: "0.78rem",
  fontFamily: FONT.body,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

function btn(color: string): React.CSSProperties {
  return {
    background: `${color}22`,
    border: `1px solid ${color}44`,
    color,
    borderRadius: 5,
    padding: "0.2rem 0.6rem",
    fontSize: "0.62rem",
    fontFamily: FONT.mono,
    cursor: "pointer",
  };
}

function IdeaForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Idea>;
  onSave: (idea: Idea) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initial?.text ?? "");
  const [source, setSource] = useState(initial?.source ?? "");
  const [stage, setStage] = useState<IdeaStage>(initial?.stage ?? "raw");
  const [project, setProject] = useState(initial?.project ?? "");

  function save() {
    if (!text.trim()) return;
    onSave({
      id: initial?.id ?? `id-${Date.now()}`,
      text: text.trim(),
      source: source.trim(),
      stage,
      project: project.trim() || undefined,
      createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", padding: "0.75rem", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8 }}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Idea description *" rows={2} style={{ ...iStyle, resize: "vertical" }} autoFocus />
      <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source (team, user, research…)" style={iStyle} />
      <input value={project} onChange={(e) => setProject(e.target.value)} placeholder="Linked project (optional)" style={iStyle} />
      <select value={stage} onChange={(e) => setStage(e.target.value as IdeaStage)} style={{ ...iStyle, cursor: "pointer" }}>
        {(["raw", "sorted", "selected"] as IdeaStage[]).map((s) => (
          <option key={s} value={s}>{STAGE_META[s].label}</option>
        ))}
      </select>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={save} style={btn(C.green)}>✓ Save</button>
        <button onClick={onCancel} style={btn(C.textDim)}>Cancel</button>
      </div>
    </div>
  );
}

function IdeaCard({
  idea,
  onAdvance,
  onEdit,
  onDelete,
}: {
  idea: Idea;
  onAdvance: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const sm = STAGE_META[idea.stage];
  return (
    <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <p style={{ fontSize: "0.78rem", color: C.text, fontFamily: FONT.body, lineHeight: 1.5, margin: 0 }}>{idea.text}</p>
      {idea.source && (
        <span style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono }}>↗ {idea.source}</span>
      )}
      {idea.project && (
        <span style={{ fontSize: "0.62rem", color: C.textMuted, fontFamily: FONT.mono }}>→ {idea.project}</span>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.2rem" }}>
        <span style={{ fontSize: "0.58rem", color: C.textVeryDim, fontFamily: FONT.mono }}>{idea.createdAt}</span>
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {idea.stage !== "selected" && (
            <button onClick={onAdvance} title="Advance" style={{ background: `${sm.color}22`, border: `1px solid ${sm.color}44`, color: sm.color, borderRadius: 4, padding: "0.1rem 0.4rem", fontSize: "0.6rem", fontFamily: FONT.mono, cursor: "pointer" }}>
              → {idea.stage === "raw" ? "Sort" : "Select"}
            </button>
          )}
          <button onClick={onEdit} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.7rem" }}>✎</button>
          <button onClick={onDelete} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.8rem" }}>×</button>
        </div>
      </div>
    </div>
  );
}

export default function IdeasView() {
  const ideas = useStore((s) => s.ideas);
  const addIdea = useStore((s) => s.addIdea);
  const updateIdea = useStore((s) => s.updateIdea);
  const removeIdea = useStore((s) => s.removeIdea);
  const advanceIdea = useStore((s) => s.advanceIdea);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const byStage = (stage: IdeaStage) => ideas.filter((i) => i.stage === stage);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Ideas</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Capture → Sort → Select — {ideas.length} idea{ideas.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button onClick={() => setAdding(!adding)} style={btn(C.gold)}>+ Add Idea</button>
      </div>

      {adding && (
        <div style={{ marginBottom: "1rem" }}>
          <IdeaForm
            onSave={(idea) => { addIdea(idea); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", alignItems: "start" }}>
        {(["raw", "sorted", "selected"] as IdeaStage[]).map((stage) => {
          const sm = STAGE_META[stage];
          const stageIdeas = byStage(stage);
          return (
            <div key={stage}>
              <SectionTitle accent={sm.color}>{sm.label} · {stageIdeas.length}</SectionTitle>
              <p style={{ fontSize: "0.62rem", color: C.textVeryDim, fontFamily: FONT.mono, marginBottom: "0.75rem" }}>{sm.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {stageIdeas.map((idea) =>
                  editingId === idea.id ? (
                    <IdeaForm
                      key={idea.id}
                      initial={idea}
                      onSave={(updated) => { updateIdea(idea.id, updated); setEditingId(null); }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      onAdvance={() => advanceIdea(idea.id)}
                      onEdit={() => setEditingId(idea.id)}
                      onDelete={() => removeIdea(idea.id)}
                    />
                  )
                )}
                {stageIdeas.length === 0 && (
                  <Card style={{ padding: "0.75rem", textAlign: "center" }}>
                    <p style={{ fontSize: "0.65rem", color: C.textVeryDim, fontFamily: FONT.mono }}>Empty</p>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
