import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import { WORKFLOW_STAGES, gatesCountForStage } from "../../data/workflow";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import type { Chapter } from "../../types";

function generateId() {
  return `ch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function StageIndicator({ stage, color }: { stage: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {WORKFLOW_STAGES.map((s) => (
        <div
          key={s.id}
          title={s.fullName}
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            background: s.id <= stage ? color : C.border,
            border: `1px solid ${s.id === stage ? color : "transparent"}`,
            boxShadow: s.id === stage ? `0 0 5px ${color}66` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.5rem",
            fontFamily: FONT.mono,
            color: s.id <= stage ? "#000" : C.textDim,
            transition: "background 0.2s",
          }}
        >
          {s.id}
        </div>
      ))}
    </div>
  );
}

function ChapterCard({ chapter }: { chapter: Chapter }) {
  const updateChapter = useStore((s) => s.updateChapter);
  const removeChapter = useStore((s) => s.removeChapter);
  const toggleChapterGate = useStore((s) => s.toggleChapterGate);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chapter.title);
  const [hook, setHook] = useState(chapter.hook);

  const stage = WORKFLOW_STAGES.find((s) => s.id === chapter.stage);
  const stageColor = [C.textDim, C.amber, C.blue, C.orange, C.green, C.cyan, C.gold][chapter.stage] ?? C.textMuted;
  const gatesTotal = gatesCountForStage(chapter.stage);
  const gatesDone = chapter.gates.slice(0, gatesTotal).filter(Boolean).length;
  const isPublished = chapter.stage === 6;

  const canAdvance = gatesDone === gatesTotal && chapter.stage < 6;

  function save() {
    updateChapter(chapter.id, { title, hook });
    setEditing(false);
  }

  return (
    <div
      style={{
        background: C.bg,
        border: `1px solid ${isPublished ? `${C.green}44` : C.border}`,
        borderRadius: 8,
        padding: "0.9rem",
        opacity: isPublished ? 0.7 : 1,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.65rem" }}>
        <div style={{ flex: 1 }}>
          {editing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => e.key === "Enter" && save()}
              autoFocus
              style={{ background: C.surfaceAlt, border: `1px solid ${C.borderLight}`, color: C.text, borderRadius: 4, padding: "0.2rem 0.4rem", fontSize: "0.85rem", fontFamily: FONT.display, width: "100%" }}
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: FONT.display, fontSize: "0.85rem", color: C.text, textAlign: "left" }}
            >
              {chapter.title}
            </button>
          )}
          <div style={{ fontSize: "0.6rem", color: C.textDim, marginTop: 2, fontFamily: FONT.mono }}>{chapter.lastUpdate}</div>
        </div>
        <button
          onClick={() => removeChapter(chapter.id)}
          title="Supprimer"
          style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem", padding: "0 0 0 0.5rem" }}
        >
          ×
        </button>
      </div>

      {/* Stage indicator */}
      <div style={{ marginBottom: "0.65rem" }}>
        <StageIndicator stage={chapter.stage} color={stageColor} />
        <div style={{ marginTop: "0.3rem", fontSize: "0.62rem", fontFamily: FONT.mono, color: stageColor }}>
          {isPublished ? "✓ Publié" : `Étape ${chapter.stage} — ${stage?.label ?? ""}`}
          {!isPublished && <span style={{ color: C.textDim }}> · {gatesDone}/{gatesTotal} portes</span>}
        </div>
      </div>

      {/* Gates for current stage */}
      {!isPublished && stage && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.65rem" }}>
          {stage.gates.map((gate, idx) => {
            const done = chapter.gates[idx] ?? false;
            return (
              <label key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleChapterGate(chapter.id, idx)}
                  style={{ accentColor: stageColor, marginTop: 2, flexShrink: 0 }}
                />
                <span style={{ fontSize: "0.65rem", color: done ? C.textMuted : C.textSoft, textDecoration: done ? "line-through" : "none" }}>
                  {gate}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Hook */}
      {editing ? (
        <input
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          placeholder="Hook transmédia (optionnel)…"
          style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 4, padding: "0.2rem 0.4rem", fontSize: "0.65rem", width: "100%", marginBottom: "0.5rem" }}
        />
      ) : (
        chapter.hook && (
          <div style={{ fontSize: "0.63rem", color: C.orange, fontStyle: "italic", marginBottom: "0.55rem", borderLeft: `2px solid ${C.orange}44`, paddingLeft: "0.4rem" }}>
            → {chapter.hook}
          </div>
        )
      )}

      {/* Advance / Edit buttons */}
      <div style={{ display: "flex", gap: "0.4rem" }}>
        {canAdvance && (
          <button
            onClick={() => {
              const nextGates = Array(gatesCountForStage(chapter.stage + 1)).fill(false);
              updateChapter(chapter.id, { stage: chapter.stage + 1, gates: nextGates, lastUpdate: "à l'instant" });
            }}
            style={{ fontSize: "0.62rem", fontFamily: FONT.mono, background: stageColor, color: "#000", border: "none", borderRadius: 4, padding: "0.25rem 0.6rem", cursor: "pointer" }}
          >
            Avancer → {WORKFLOW_STAGES[chapter.stage]?.label ?? "Publié"}
          </button>
        )}
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{ fontSize: "0.62rem", fontFamily: FONT.mono, background: C.surfaceAlt, color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: 4, padding: "0.25rem 0.6rem", cursor: "pointer" }}
          >
            Éditer
          </button>
        )}
      </div>
    </div>
  );
}

export default function PipelineView() {
  const chapters = useStore((s) => s.chapters);
  const addChapter = useStore((s) => s.addChapter);

  const [newTitle, setNewTitle] = useState("");

  function handleAdd() {
    const t = newTitle.trim();
    if (!t) return;
    const chapter: Chapter = {
      id: generateId(),
      title: t,
      stage: 1,
      gates: Array(gatesCountForStage(1)).fill(false),
      lastUpdate: "à l'instant",
      hook: "",
    };
    addChapter(chapter);
    setNewTitle("");
  }

  // Group chapters by stage
  const byStage = WORKFLOW_STAGES.map((stage) => ({
    stage,
    chapters: chapters.filter((c) => c.stage === stage.id),
  }));
  const published = chapters.filter((c) => c.stage === 6);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Pipeline des chapitres</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Chaîne fermée à 6 étapes — Soir : décider · Week-end : exécuter
          </p>
        </div>
        {/* Add chapter */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Titre du chapitre…"
            style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "0.4rem 0.75rem", fontSize: "0.75rem", width: 200 }}
          />
          <button
            onClick={handleAdd}
            style={{ background: C.gold, color: "#000", border: "none", borderRadius: 6, padding: "0.4rem 0.75rem", fontSize: "0.72rem", fontFamily: FONT.mono, cursor: "pointer", fontWeight: "bold" }}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* Workflow stages reference */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {WORKFLOW_STAGES.map((stage) => {
          const stageColor = [C.textDim, C.amber, C.blue, C.orange, C.green, C.cyan, C.gold][stage.id] ?? C.textMuted;
          const count = chapters.filter((c) => c.stage === stage.id).length;
          return (
            <Card key={stage.id} style={{ padding: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: stageColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>{stage.id}. {stage.label}</span>
                {count > 0 && (
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: stageColor, background: `${stageColor}22`, borderRadius: 10, padding: "0 0.35rem" }}>{count}</span>
                )}
              </div>
              <p style={{ fontSize: "0.63rem", color: C.textSoft, margin: 0, marginBottom: "0.3rem" }}>{stage.fullName}</p>
              <p style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: FONT.mono, margin: 0 }}>{stage.when}</p>
            </Card>
          );
        })}
      </div>

      {/* Chapter cards by stage */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {byStage.filter((g) => g.chapters.length > 0).map(({ stage, chapters: stageChapters }) => (
          <div key={stage.id}>
            {stageChapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        ))}
      </div>

      {/* Published */}
      {published.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <SectionTitle accent={C.green}>{`Publiés (${published.length})`}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {published.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
