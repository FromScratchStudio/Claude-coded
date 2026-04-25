import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import { Tag } from "../ui/Badge";
import type { IdeaStage } from "../../types";

const STAGE_LABELS: Record<IdeaStage, string> = {
  raw: "Brut",
  sorted: "Trié",
  selected: "Retenu",
};

const STAGE_COLORS: Record<IdeaStage, string> = {
  raw: C.textDim,
  sorted: C.amber,
  selected: C.green,
};

function IdeaCard({ idea, onAdvance, onRemove }: { idea: { id: string; text: string; source: string; stage: IdeaStage; project?: string; createdAt: string }; onAdvance: (id: string) => void; onRemove: (id: string) => void }) {
  const projects = useStore((s) => s.projects);
  const project = idea.project ? projects.find((p) => p.id === idea.project) : undefined;

  return (
    <div style={{ background: C.bg, borderRadius: 8, padding: "0.75rem", border: `1px solid ${C.border}`, marginBottom: "0.5rem" }}>
      <p style={{ fontSize: "0.8rem", color: C.text, margin: 0, lineHeight: 1.5, marginBottom: "0.5rem" }}>{idea.text}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.5rem" }}>
        {idea.source && (
          <span style={{ fontFamily: FONT.mono, fontSize: "0.58rem", color: C.textDim, background: C.surfaceAlt, borderRadius: 4, padding: "0.1rem 0.35rem" }}>
            {idea.source}
          </span>
        )}
        {project && <Tag>{project.name}</Tag>}
      </div>
      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
        {idea.stage !== "selected" && (
          <button
            onClick={() => onAdvance(idea.id)}
            style={{
              background: `${STAGE_COLORS[idea.stage === "raw" ? "sorted" : "selected"]}18`,
              border: `1px solid ${STAGE_COLORS[idea.stage === "raw" ? "sorted" : "selected"]}44`,
              color: STAGE_COLORS[idea.stage === "raw" ? "sorted" : "selected"],
              borderRadius: 5,
              padding: "0.2rem 0.55rem",
              fontSize: "0.65rem",
              cursor: "pointer",
              fontFamily: FONT.mono,
            }}
          >
            → {STAGE_LABELS[idea.stage === "raw" ? "sorted" : "selected"]}
          </button>
        )}
        <button
          onClick={() => onRemove(idea.id)}
          style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 5, padding: "0.2rem 0.45rem", fontSize: "0.65rem", cursor: "pointer" }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function IdeasView() {
  const ideas = useStore((s) => s.ideas);
  const addIdea = useStore((s) => s.addIdea);
  const removeIdea = useStore((s) => s.removeIdea);
  const advanceIdea = useStore((s) => s.advanceIdea);
  const projects = useStore((s) => s.projects);

  const [newText, setNewText] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newProjectId, setNewProjectId] = useState<string>("");

  const handleAdd = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    addIdea({
      id: String(Date.now()),
      text: trimmed,
      source: newSource.trim(),
      project: newProjectId || undefined,
      stage: "raw",
      createdAt: new Date().toISOString(),
    });
    setNewText("");
    setNewSource("");
    setNewProjectId("");
  };

  const columns: { stage: IdeaStage; label: string; color: string }[] = [
    { stage: "raw", label: "Brut", color: C.textDim },
    { stage: "sorted", label: "Trié", color: C.amber },
    { stage: "selected", label: "Retenu", color: C.green },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Pipeline d'idées</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Brut → Trié → Retenu — filtrer les idées avant de s'engager
        </p>
      </div>

      {/* Add idea */}
      <Card style={{ marginBottom: "1.25rem" }}>
        <SectionTitle accent={C.gold}>Ajouter une idée</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 200px auto", gap: "0.5rem", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Idée</label>
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Décrire l'idée..."
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "0.4rem 0.65rem", fontSize: "0.8rem", width: "100%" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Source</label>
            <input
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="vie, rêve, lecture..."
              style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "0.4rem 0.65rem", fontSize: "0.8rem", width: "100%" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Projet lié</label>
            <select
              value={newProjectId}
              onChange={(e) => setNewProjectId(e.target.value)}
              style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "0.4rem 0.5rem", fontSize: "0.8rem", width: "100%" }}
            >
              <option value="">Aucun</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newText.trim()}
            style={{
              background: newText.trim() ? C.gold : C.surfaceAlt,
              border: "none",
              color: newText.trim() ? C.bg : C.textDim,
              borderRadius: 6,
              padding: "0.45rem 1.2rem",
              fontSize: "0.78rem",
              fontWeight: "bold",
              cursor: newText.trim() ? "pointer" : "not-allowed",
              fontFamily: FONT.mono,
              alignSelf: "flex-end",
            }}
          >
            + Ajouter
          </button>
        </div>
      </Card>

      {/* Kanban columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {columns.map(({ stage, label, color }) => {
          const stageIdeas = ideas.filter((i) => i.stage === stage);
          return (
            <div key={stage}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", padding: "0.4rem 0.65rem", background: C.surface, borderRadius: 8, border: `1px solid ${color}30` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                <span style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color, textTransform: "uppercase", letterSpacing: "0.1em", flex: 1 }}>{label}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.textDim }}>{stageIdeas.length}</span>
              </div>
              {stageIdeas.length === 0 ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: C.textDim, fontSize: "0.68rem", fontFamily: FONT.mono, border: `1px dashed ${C.border}`, borderRadius: 8 }}>
                  Aucune idée
                </div>
              ) : (
                stageIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} onAdvance={advanceIdea} onRemove={removeIdea} />
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
        {columns.map(({ stage, label, color }) => {
          const count = ideas.filter((i) => i.stage === stage).length;
          return (
            <span key={stage} style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color, background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 4, padding: "0.2rem 0.5rem" }}>
              {count} {label.toLowerCase()}
            </span>
          );
        })}
        <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim, background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 4, padding: "0.2rem 0.5rem" }}>
          {ideas.length} total
        </span>
      </div>
    </div>
  );
}
