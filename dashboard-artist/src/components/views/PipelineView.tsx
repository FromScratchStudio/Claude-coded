import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import type { Chapter, WorkflowStage } from "../../types";

function generateId() {
  return `ch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const STAGE_COLORS = [C.textDim, C.amber, C.blue, C.orange, C.green, C.cyan, C.gold, C.red, "#A78BFA", "#EC4899"];
function stageColor(idx: number) { return STAGE_COLORS[idx % STAGE_COLORS.length]; }

// ─── Stage editor modal ───────────────────────────────────────────────────────
function StageEditor({ stage, onClose }: { stage: WorkflowStage; onClose: () => void }) {
  const updateWorkflowStage = useStore((s) => s.updateWorkflowStage);
  const [label, setLabel] = useState(stage.label);
  const [fullName, setFullName] = useState(stage.fullName);
  const [when, setWhen] = useState(stage.when);
  const [rule, setRule] = useState(stage.rule);
  const [gates, setGates] = useState<string[]>([...stage.gates]);
  const [newGate, setNewGate] = useState("");

  function save() {
    updateWorkflowStage(stage.id, { label, fullName, when, rule, gates });
    onClose();
  }

  const inp = {
    background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text,
    borderRadius: 4, padding: "0.25rem 0.5rem", fontSize: "0.75rem", fontFamily: FONT.body, width: "100%",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 10, padding: "1.5rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>Éditer l'étape {stage.id}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Label court</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Nom complet</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={inp} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Quand / durée</label>
          <input value={when} onChange={(e) => setWhen(e.target.value)} style={inp} />
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Règle</label>
          <textarea value={rule} onChange={(e) => setRule(e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div>
          <div style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.4rem" }}>Portes de qualité</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {gates.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <input value={g} onChange={(e) => setGates(gates.map((x, j) => j === i ? e.target.value : x))} style={{ ...inp, flex: 1 }} />
                <button onClick={() => setGates(gates.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "1rem" }}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <input value={newGate} onChange={(e) => setNewGate(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newGate.trim()) { setGates([...gates, newGate.trim()]); setNewGate(""); } }} placeholder="Nouvelle porte…" style={{ ...inp, flex: 1 }} />
              <button onClick={() => { if (newGate.trim()) { setGates([...gates, newGate.trim()]); setNewGate(""); } }} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 4, padding: "0.25rem 0.6rem", fontSize: "0.65rem", fontFamily: FONT.mono, cursor: "pointer" }}>+ Ajouter</button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontSize: "0.7rem", fontFamily: FONT.mono }}>Annuler</button>
          <button onClick={save} style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.35rem 0.9rem", cursor: "pointer", fontSize: "0.7rem", fontFamily: FONT.mono, fontWeight: "bold" }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add stage modal ──────────────────────────────────────────────────────────
function AddStageModal({ onClose }: { onClose: () => void }) {
  const addWorkflowStage = useStore((s) => s.addWorkflowStage);
  const [label, setLabel] = useState("");
  const [fullName, setFullName] = useState("");
  const [when, setWhen] = useState("");
  const [rule, setRule] = useState("");
  const [gates, setGates] = useState<string[]>([""]);

  function save() {
    if (!label.trim()) return;
    addWorkflowStage({ label: label.trim(), fullName: fullName.trim() || label.trim(), when: when.trim(), rule: rule.trim(), gates: gates.map((g) => g.trim()).filter(Boolean) });
    onClose();
  }

  const inp = {
    background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text,
    borderRadius: 4, padding: "0.25rem 0.5rem", fontSize: "0.75rem", fontFamily: FONT.body, width: "100%",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 10, padding: "1.5rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>Nouvelle étape</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Label court *</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex: Finition" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Nom complet</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ex: Finition finale" style={inp} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Quand / durée</label>
          <input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="Ex: Week-end, 1 bloc" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Règle</label>
          <textarea value={rule} onChange={(e) => setRule(e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div>
          <div style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.4rem" }}>Portes de qualité</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {gates.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem" }}>
                <input value={g} onChange={(e) => setGates(gates.map((x, j) => j === i ? e.target.value : x))} placeholder={`Porte ${i + 1}…`} style={{ ...inp, flex: 1 }} />
                {gates.length > 1 && <button onClick={() => setGates(gates.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "1rem" }}>×</button>}
              </div>
            ))}
            <button onClick={() => setGates([...gates, ""])} style={{ alignSelf: "flex-start", background: "none", border: `1px dashed ${C.border}`, color: C.textDim, borderRadius: 4, padding: "0.2rem 0.5rem", fontSize: "0.62rem", fontFamily: FONT.mono, cursor: "pointer" }}>+ Ajouter une porte</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontSize: "0.7rem", fontFamily: FONT.mono }}>Annuler</button>
          <button onClick={save} disabled={!label.trim()} style={{ background: label.trim() ? C.gold : C.border, border: "none", color: "#000", borderRadius: 6, padding: "0.35rem 0.9rem", cursor: label.trim() ? "pointer" : "default", fontSize: "0.7rem", fontFamily: FONT.mono, fontWeight: "bold" }}>Créer</button>
        </div>
      </div>
    </div>
  );
}

// ─── Stage indicator ──────────────────────────────────────────────────────────
function StageIndicator({ stage, stages, color }: { stage: number; stages: WorkflowStage[]; color: string }) {
  return (
    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      {stages.map((s) => (
        <div key={s.id} title={s.fullName} style={{ width: 18, height: 18, borderRadius: 4, background: s.id <= stage ? color : C.border, border: `1px solid ${s.id === stage ? color : "transparent"}`, boxShadow: s.id === stage ? `0 0 5px ${color}66` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", fontFamily: FONT.mono, color: s.id <= stage ? "#000" : C.textDim, transition: "background 0.2s" }}>
          {s.id}
        </div>
      ))}
    </div>
  );
}

// ─── Chapter card ─────────────────────────────────────────────────────────────
function ChapterCard({ chapter, stages }: { chapter: Chapter; stages: WorkflowStage[] }) {
  const updateChapter = useStore((s) => s.updateChapter);
  const removeChapter = useStore((s) => s.removeChapter);
  const toggleChapterGate = useStore((s) => s.toggleChapterGate);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chapter.title);
  const [hook, setHook] = useState(chapter.hook);

  const maxStageId = stages.length > 0 ? Math.max(...stages.map((s) => s.id)) : 0;
  const stageObj = stages.find((s) => s.id === chapter.stage);
  const stageIdx = stages.findIndex((s) => s.id === chapter.stage);
  const color = stageColor(stageIdx >= 0 ? stageIdx : 0);
  const gatesTotal = stageObj?.gates.length ?? 0;
  const gatesDone = chapter.gates.slice(0, gatesTotal).filter(Boolean).length;
  const isPublished = chapter.stage === maxStageId;
  const canAdvance = gatesDone === gatesTotal && !isPublished;
  const nextStage = stages.find((s) => s.id > chapter.stage);

  function save() { updateChapter(chapter.id, { title, hook }); setEditing(false); }

  return (
    <div style={{ background: C.bg, border: `1px solid ${isPublished ? `${C.green}44` : C.border}`, borderRadius: 8, padding: "0.9rem", opacity: isPublished ? 0.7 : 1, marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.65rem" }}>
        <div style={{ flex: 1 }}>
          {editing ? (
            <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={save} onKeyDown={(e) => e.key === "Enter" && save()} autoFocus style={{ background: C.surfaceAlt, border: `1px solid ${C.borderLight}`, color: C.text, borderRadius: 4, padding: "0.2rem 0.4rem", fontSize: "0.85rem", fontFamily: FONT.display, width: "100%" }} />
          ) : (
            <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: FONT.display, fontSize: "0.85rem", color: C.text, textAlign: "left" }}>{chapter.title}</button>
          )}
          <div style={{ fontSize: "0.6rem", color: C.textDim, marginTop: 2, fontFamily: FONT.mono }}>{chapter.lastUpdate}</div>
        </div>
        <button onClick={() => removeChapter(chapter.id)} title="Supprimer" style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem", padding: "0 0 0 0.5rem" }}>×</button>
      </div>

      <div style={{ marginBottom: "0.65rem" }}>
        <StageIndicator stage={chapter.stage} stages={stages} color={color} />
        <div style={{ marginTop: "0.3rem", fontSize: "0.62rem", fontFamily: FONT.mono, color }}>
          {isPublished ? "✓ Publié" : `Étape ${chapter.stage} — ${stageObj?.label ?? ""}`}
          {!isPublished && <span style={{ color: C.textDim }}> · {gatesDone}/{gatesTotal} portes</span>}
        </div>
      </div>

      {!isPublished && stageObj && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.65rem" }}>
          {stageObj.gates.map((gate, idx) => {
            const done = chapter.gates[idx] ?? false;
            return (
              <label key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", cursor: "pointer" }}>
                <input type="checkbox" checked={done} onChange={() => toggleChapterGate(chapter.id, idx)} style={{ accentColor: color, marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: "0.65rem", color: done ? C.textMuted : C.textSoft, textDecoration: done ? "line-through" : "none" }}>{gate}</span>
              </label>
            );
          })}
        </div>
      )}

      {editing ? (
        <input value={hook} onChange={(e) => setHook(e.target.value)} placeholder="Hook transmédia (optionnel)…" style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 4, padding: "0.2rem 0.4rem", fontSize: "0.65rem", width: "100%", marginBottom: "0.5rem" }} />
      ) : (
        chapter.hook && <div style={{ fontSize: "0.63rem", color: C.orange, fontStyle: "italic", marginBottom: "0.55rem", borderLeft: `2px solid ${C.orange}44`, paddingLeft: "0.4rem" }}>→ {chapter.hook}</div>
      )}

      <div style={{ display: "flex", gap: "0.4rem" }}>
        {canAdvance && nextStage && (
          <button onClick={() => { const ng = Array(nextStage.gates.length).fill(false); updateChapter(chapter.id, { stage: nextStage.id, gates: ng, lastUpdate: "à l'instant" }); }} style={{ fontSize: "0.62rem", fontFamily: FONT.mono, background: color, color: "#000", border: "none", borderRadius: 4, padding: "0.25rem 0.6rem", cursor: "pointer" }}>
            Avancer → {nextStage.label}
          </button>
        )}
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ fontSize: "0.62rem", fontFamily: FONT.mono, background: C.surfaceAlt, color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: 4, padding: "0.25rem 0.6rem", cursor: "pointer" }}>Éditer</button>
        ) : (
          <button onClick={save} style={{ fontSize: "0.62rem", fontFamily: FONT.mono, background: C.gold, color: "#000", border: "none", borderRadius: 4, padding: "0.25rem 0.6rem", cursor: "pointer" }}>✓ Sauver</button>
        )}
      </div>
    </div>
  );
}

// ─── Stages management panel ──────────────────────────────────────────────────
function StagesPanel({ onClose }: { onClose: () => void }) {
  const stages = useStore((s) => s.workflowStages);
  const removeWorkflowStage = useStore((s) => s.removeWorkflowStage);
  const [editingStage, setEditingStage] = useState<WorkflowStage | null>(null);
  const [addingStage, setAddingStage] = useState(false);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 10, padding: "1.25rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <SectionTitle accent={C.gold}>Gérer les étapes du pipeline</SectionTitle>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => setAddingStage(true)} style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.3rem 0.75rem", fontSize: "0.68rem", fontFamily: FONT.mono, cursor: "pointer", fontWeight: "bold" }}>+ Nouvelle étape</button>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.3rem 0.6rem", fontSize: "0.68rem", fontFamily: FONT.mono, cursor: "pointer" }}>Fermer</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {stages.map((stage, idx) => {
          const color = stageColor(idx);
          return (
            <div key={stage.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.65rem 0.75rem", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}`, borderLeft: `3px solid ${color}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{stage.id}. {stage.label}</span>
                  <span style={{ fontSize: "0.68rem", color: C.textMuted }}>{stage.fullName}</span>
                </div>
                <p style={{ fontSize: "0.62rem", color: C.textDim, margin: "0 0 0.1rem", fontFamily: FONT.mono }}>{stage.when}</p>
                <p style={{ fontSize: "0.62rem", color: C.textVeryDim, margin: 0, fontStyle: "italic" }}>{stage.gates.length} porte{stage.gates.length !== 1 ? "s" : ""}</p>
              </div>
              <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0 }}>
                <button onClick={() => setEditingStage(stage)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 4, padding: "0.2rem 0.5rem", fontSize: "0.62rem", fontFamily: FONT.mono, cursor: "pointer" }}>Éditer</button>
                <button onClick={() => { if (confirm(`Supprimer l'étape "${stage.label}" ?`)) removeWorkflowStage(stage.id); }} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem", padding: "0.1rem 0.3rem" }}>×</button>
              </div>
            </div>
          );
        })}
      </div>
      {editingStage && <StageEditor stage={editingStage} onClose={() => setEditingStage(null)} />}
      {addingStage && <AddStageModal onClose={() => setAddingStage(false)} />}
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function PipelineView() {
  const chapters = useStore((s) => s.chapters);
  const stages = useStore((s) => s.workflowStages);
  const addChapter = useStore((s) => s.addChapter);
  const [newTitle, setNewTitle] = useState("");
  const [showStagesPanel, setShowStagesPanel] = useState(false);

  function handleAdd() {
    const t = newTitle.trim();
    if (!t || stages.length === 0) return;
    const firstStage = stages[0];
    addChapter({ id: generateId(), title: t, stage: firstStage.id, gates: Array(firstStage.gates.length).fill(false), lastUpdate: "à l'instant", hook: "" });
    setNewTitle("");
  }

  const maxStageId = stages.length > 0 ? Math.max(...stages.map((s) => s.id)) : 0;
  const byStage = stages.map((stage) => ({ stage, chapters: chapters.filter((c) => c.stage === stage.id) }));
  const published = chapters.filter((c) => c.stage === maxStageId);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Pipeline des chapitres</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Chaîne fermée à {stages.length} étapes — Soir : décider · Week-end : exécuter
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button onClick={() => setShowStagesPanel(!showStagesPanel)} style={{ background: showStagesPanel ? C.surfaceAlt : "transparent", border: `1px solid ${showStagesPanel ? C.borderLight : C.border}`, color: showStagesPanel ? C.text : C.textDim, borderRadius: 6, padding: "0.4rem 0.75rem", fontSize: "0.68rem", fontFamily: FONT.mono, cursor: "pointer" }}>⚙ Étapes</button>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Titre du chapitre…" style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "0.4rem 0.75rem", fontSize: "0.75rem", width: 200 }} />
          <button onClick={handleAdd} style={{ background: C.gold, color: "#000", border: "none", borderRadius: 6, padding: "0.4rem 0.75rem", fontSize: "0.72rem", fontFamily: FONT.mono, cursor: "pointer", fontWeight: "bold" }}>+ Ajouter</button>
        </div>
      </div>

      {showStagesPanel && <StagesPanel onClose={() => setShowStagesPanel(false)} />}

      {/* Stages reference grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, Math.min(stages.length, 6))}, 1fr)`, gap: "0.5rem", marginBottom: "1.5rem" }}>
        {stages.map((stage, idx) => {
          const color = stageColor(idx);
          const count = chapters.filter((c) => c.stage === stage.id).length;
          return (
            <Card key={stage.id} style={{ padding: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{stage.id}. {stage.label}</span>
                {count > 0 && <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color, background: `${color}22`, borderRadius: 10, padding: "0 0.35rem" }}>{count}</span>}
              </div>
              <p style={{ fontSize: "0.63rem", color: C.textSoft, margin: 0, marginBottom: "0.3rem" }}>{stage.fullName}</p>
              <p style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: FONT.mono, margin: 0 }}>{stage.when}</p>
            </Card>
          );
        })}
      </div>

      {/* Chapters by stage (excluding last/published stage) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {byStage.filter((g) => g.stage.id !== maxStageId && g.chapters.length > 0).map(({ stage, chapters: sc }) => (
          <div key={stage.id}>
            {sc.map((chapter) => <ChapterCard key={chapter.id} chapter={chapter} stages={stages} />)}
          </div>
        ))}
      </div>

      {/* Published */}
      {published.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <SectionTitle accent={C.green}>{`Publiés (${published.length})`}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {published.map((chapter) => <ChapterCard key={chapter.id} chapter={chapter} stages={stages} />)}
          </div>
        </div>
      )}
    </div>
  );
}

