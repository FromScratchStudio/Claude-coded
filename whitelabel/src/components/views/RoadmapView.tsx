import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import type { Phase, PhaseTask } from "../../types";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import ProgressBar from "../ui/ProgressBar";

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

// ─── Phase form ───────────────────────────────────────────────────────────────
function PhaseForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Phase>;
  onSave: (p: Omit<Phase, "tasks">) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [accent, setAccent] = useState(initial?.accent ?? "#9ca3af");

  function save() {
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? `ph-${Date.now()}`,
      label: label.trim(),
      name: name.trim(),
      duration: duration.trim(),
      accent,
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem" }}>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (e.g. Phase 1)" style={iStyle} />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" style={iStyle} autoFocus />
        <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (e.g. Months 1–3)" style={iStyle} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, flexShrink: 0 }}>Accent</span>
          <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} style={{ width: 36, height: 28, border: "none", background: "none", cursor: "pointer" }} />
          <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: accent }}>{accent}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={save} style={btn(C.green)}>✓ Save Phase</button>
        <button onClick={onCancel} style={btn(C.textDim)}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Task row ─────────────────────────────────────────────────────────────────
function TaskRow({
  task,
  accent,
  phaseId,
}: {
  task: PhaseTask;
  accent: string;
  phaseId: string;
}) {
  const togglePhaseTask = useStore((s) => s.togglePhaseTask);
  const updatePhaseTask = useStore((s) => s.updatePhaseTask);
  const removePhaseTask = useStore((s) => s.removePhaseTask);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const [confirmDel, setConfirmDel] = useState(false);

  function save() {
    if (draft.trim()) updatePhaseTask(phaseId, task.id, { text: draft.trim() });
    setEditing(false);
  }

  return (
    <div className="task-row" style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", position: "relative" }}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => togglePhaseTask(phaseId, task.id)}
        style={{ accentColor: accent, marginTop: 3, flexShrink: 0 }}
      />
      {editing ? (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setDraft(task.text); setEditing(false); } }}
          onBlur={save}
          autoFocus
          style={{ ...iStyle, flex: 1, padding: "0.15rem 0.35rem", fontSize: "0.73rem" }}
        />
      ) : (
        <span style={{ flex: 1, fontSize: "0.75rem", color: task.done ? C.textDim : C.textSoft, textDecoration: task.done ? "line-through" : "none", lineHeight: 1.45 }}>
          {task.text}
        </span>
      )}
      {!editing && (
        <div className="task-actions" style={{ display: "flex", gap: "0.1rem", opacity: 0, transition: "opacity 0.15s", flexShrink: 0 }}>
          <button onClick={() => { setDraft(task.text); setEditing(true); }} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.7rem", padding: "0 0.2rem" }}>✎</button>
          {confirmDel ? (
            <>
              <button onClick={() => removePhaseTask(phaseId, task.id)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.6rem", fontFamily: FONT.mono }}>Del</button>
              <button onClick={() => setConfirmDel(false)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.7rem" }}>×</button>
            </>
          ) : (
            <button onClick={() => setConfirmDel(true)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.8rem", padding: "0 0.2rem" }}>×</button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Add task row ─────────────────────────────────────────────────────────────
function AddTaskRow({ accent, onAdd, onCancel }: { accent: string; onAdd: (text: string) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState("");
  function submit() {
    const t = draft.trim();
    if (t) { onAdd(t); setDraft(""); } else onCancel();
  }
  return (
    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onCancel(); }}
        placeholder="New task…"
        autoFocus
        style={{ ...iStyle, flex: 1, fontSize: "0.73rem", border: `1px solid ${accent}55` }}
      />
      <button onClick={submit} style={{ background: accent, color: "#000", border: "none", borderRadius: 4, padding: "0.2rem 0.5rem", fontFamily: FONT.mono, fontSize: "0.62rem", cursor: "pointer", fontWeight: "bold" }}>Add</button>
      <button onClick={onCancel} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.85rem" }}>×</button>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function RoadmapView() {
  const phases = useStore((s) => s.phases);
  const addPhase = useStore((s) => s.addPhase);
  const updatePhase = useStore((s) => s.updatePhase);
  const removePhase = useStore((s) => s.removePhase);
  const addPhaseTask = useStore((s) => s.addPhaseTask);

  const [addingPhase, setAddingPhase] = useState(false);
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [confirmDeletePhase, setConfirmDeletePhase] = useState<string | null>(null);
  const [addingTaskTo, setAddingTaskTo] = useState<string | null>(null);

  return (
    <div>
      <style>{`.task-row:hover .task-actions { opacity: 1 !important; }`}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Roadmap</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Define phases and track tasks — fully customizable
          </p>
        </div>
        <button onClick={() => setAddingPhase(true)} style={btn(C.gold)}>+ Add Phase</button>
      </div>

      {addingPhase && (
        <Card style={{ marginBottom: "1rem" }}>
          <SectionTitle accent={C.gold}>New Phase</SectionTitle>
          <PhaseForm
            onSave={(p) => { addPhase({ ...p, tasks: [] }); setAddingPhase(false); }}
            onCancel={() => setAddingPhase(false)}
          />
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
        {phases.map((phase) => {
          const total = phase.tasks.length;
          const done = phase.tasks.filter((t) => t.done).length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isComplete = total > 0 && done === total;

          return (
            <Card key={phase.id} style={{ borderLeft: `3px solid ${phase.accent}` }}>
              {/* Phase edit form */}
              {editingPhase === phase.id ? (
                <PhaseForm
                  initial={phase}
                  onSave={(p) => { updatePhase(phase.id, p); setEditingPhase(null); }}
                  onCancel={() => setEditingPhase(null)}
                />
              ) : (
                <>
                  {/* Phase header */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: phase.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                        {phase.label} · {phase.duration}
                      </div>
                      <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>{phase.name}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <div style={{ textAlign: "right", marginRight: "0.25rem" }}>
                        <div style={{ fontFamily: FONT.mono, fontSize: "1.1rem", color: isComplete ? C.green : phase.accent, fontWeight: "bold" }}>
                          {isComplete ? "✓" : total > 0 ? `${pct}%` : "—"}
                        </div>
                        <div style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: FONT.mono }}>{done}/{total}</div>
                      </div>
                      <button onClick={() => setEditingPhase(phase.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.75rem" }}>✎</button>
                      {confirmDeletePhase === phase.id ? (
                        <div style={{ display: "flex", gap: "0.2rem" }}>
                          <button onClick={() => { removePhase(phase.id); setConfirmDeletePhase(null); }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.62rem", fontFamily: FONT.mono }}>Del</button>
                          <button onClick={() => setConfirmDeletePhase(null)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.7rem" }}>×</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeletePhase(phase.id)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
                      )}
                    </div>
                  </div>

                  {total > 0 && (
                    <div style={{ marginBottom: "0.85rem" }}>
                      <ProgressBar value={pct} color={phase.accent} height={4} />
                    </div>
                  )}

                  {/* Tasks */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.75rem" }}>
                    {phase.tasks.map((task) => (
                      <TaskRow key={task.id} task={task} accent={phase.accent} phaseId={phase.id} />
                    ))}
                    {phase.tasks.length === 0 && (
                      <p style={{ fontSize: "0.68rem", color: C.textVeryDim, fontFamily: FONT.mono, fontStyle: "italic" }}>No tasks yet.</p>
                    )}
                  </div>

                  {/* Add task */}
                  {addingTaskTo === phase.id ? (
                    <AddTaskRow
                      accent={phase.accent}
                      onAdd={(text) => {
                        addPhaseTask(phase.id, { id: `t-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, text, done: false });
                        setAddingTaskTo(null);
                      }}
                      onCancel={() => setAddingTaskTo(null)}
                    />
                  ) : (
                    <button
                      onClick={() => setAddingTaskTo(phase.id)}
                      style={{ width: "100%", background: "none", border: `1px dashed ${phase.accent}44`, color: phase.accent, borderRadius: 5, padding: "0.25rem", fontFamily: FONT.mono, fontSize: "0.6rem", cursor: "pointer" }}
                    >
                      + Add task
                    </button>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* Global progress */}
      {phases.length > 0 && (
        <Card style={{ marginTop: "1.25rem" }}>
          <SectionTitle accent={C.gold}>Global Progress</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {phases.map((phase) => {
              const total = phase.tasks.length;
              const done = phase.tasks.filter((t) => t.done).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={phase.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.68rem", color: phase.accent, fontFamily: FONT.mono }}>{phase.label} — {phase.name}</span>
                    <span style={{ fontSize: "0.68rem", color: phase.accent, fontFamily: FONT.mono }}>{done}/{total}</span>
                  </div>
                  <ProgressBar value={pct} color={phase.accent} height={5} />
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
