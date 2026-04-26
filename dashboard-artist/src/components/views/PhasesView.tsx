import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import { PHASES } from "../../data/phases";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import ProgressBar from "../ui/ProgressBar";

// ─── Add task form ────────────────────────────────────────────────────────────
function AddTaskRow({
  phaseAccent,
  onAdd,
  onCancel,
}: {
  phaseAccent: string;
  onAdd: (text: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState("");

  function submit() {
    const t = draft.trim();
    if (t) { onAdd(t); setDraft(""); }
    else onCancel();
  }

  return (
    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onCancel(); }}
        placeholder="Nouvelle tâche…"
        autoFocus
        style={{
          flex: 1,
          background: C.surfaceAlt,
          border: `1px solid ${phaseAccent}55`,
          color: C.text,
          borderRadius: 4,
          padding: "0.2rem 0.4rem",
          fontSize: "0.73rem",
          fontFamily: FONT.body,
          outline: "none",
        }}
      />
      <button
        onClick={submit}
        style={{ background: phaseAccent, color: "#000", border: "none", borderRadius: 4, padding: "0.2rem 0.5rem", fontFamily: FONT.mono, fontSize: "0.62rem", cursor: "pointer", fontWeight: "bold" }}
      >Ajouter</button>
      <button
        onClick={onCancel}
        style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.8rem" }}
      >×</button>
    </div>
  );
}

// ─── Task row ─────────────────────────────────────────────────────────────────
function TaskRowInner({
  text,
  isDone,
  accent,
  onToggle,
  onRename,
  onDelete,
}: {
  text: string;
  isDone: boolean;
  accent: string;
  onToggle: () => void;
  onRename: (newText: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  function save() {
    if (draft.trim()) onRename(draft.trim());
    setEditing(false);
  }

  return (
    <div className="task-row" style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", position: "relative" }}>
      <input
        type="checkbox"
        checked={isDone}
        onChange={onToggle}
        style={{ accentColor: accent, marginTop: 3, flexShrink: 0 }}
      />
      {editing ? (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setDraft(text); setEditing(false); } }}
          onBlur={save}
          autoFocus
          style={{ flex: 1, background: C.surfaceAlt, border: `1px solid ${accent}55`, color: C.text, borderRadius: 4, padding: "0.15rem 0.35rem", fontSize: "0.73rem", fontFamily: FONT.body, outline: "none" }}
        />
      ) : (
        <span
          style={{ flex: 1, fontSize: "0.75rem", color: isDone ? C.textDim : C.textSoft, textDecoration: isDone ? "line-through" : "none", lineHeight: 1.45, transition: "color 0.2s" }}
        >
          {text}
        </span>
      )}
      {!editing && (
        <div className="task-actions" style={{ display: "flex", gap: "0.1rem", opacity: 0, transition: "opacity 0.15s", flexShrink: 0 }}>
          <button
            onClick={() => { setDraft(text); setEditing(true); }}
            title="Renommer"
            style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.7rem", padding: "0 0.2rem", lineHeight: 1 }}
          >✎</button>
          <button
            onClick={onDelete}
            title="Supprimer"
            style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.75rem", padding: "0 0.2rem", lineHeight: 1 }}
          >×</button>
        </div>
      )}
    </div>
  );
}

export default function PhasesView() {
  const tasks = useStore((s) => s.tasks);
  const toggleTask = useStore((s) => s.toggleTask);
  const taskLabels = useStore((s) => s.taskLabels);
  const setTaskLabel = useStore((s) => s.setTaskLabel);
  const customTasks = useStore((s) => s.customTasks);
  const addCustomTask = useStore((s) => s.addCustomTask);
  const removeCustomTask = useStore((s) => s.removeCustomTask);
  const hiddenTasks = useStore((s) => s.hiddenTasks);
  const hideTask = useStore((s) => s.hideTask);

  const [addingPhase, setAddingPhase] = useState<number | null>(null);

  // Build combined task counts per phase for global progress
  const allCustomByPhase = customTasks.reduce<Record<number, typeof customTasks>>((acc, ct) => {
    if (!acc[ct.phaseId]) acc[ct.phaseId] = [];
    acc[ct.phaseId].push(ct);
    return acc;
  }, {});

  return (
    <div>
      <style>{`.task-row:hover .task-actions { opacity: 1 !important; }`}</style>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Feuille de route 36 mois</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Architecture en phases — marquer les tâches au fil de l'avancement
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {PHASES.map((phase) => {
          const phaseCustom = allCustomByPhase[phase.id] ?? [];
          const staticVisible = phase.tasks.filter((t) => !hiddenTasks.includes(t.id));
          const doneCount =
            staticVisible.filter((task) => (tasks[task.id] ?? task.done)).length +
            phaseCustom.filter((task) => (tasks[task.id] ?? false)).length;
          const total = staticVisible.length + phaseCustom.length;
          const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
          const isComplete = total > 0 && doneCount === total;

          return (
            <Card key={phase.id} style={{ borderLeft: `3px solid ${phase.accent}` }}>
              {/* Phase header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: phase.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                    {phase.label} · {phase.months}
                  </div>
                  <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>{phase.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: "1.2rem", color: isComplete ? C.green : phase.accent, fontWeight: "bold" }}>
                    {isComplete ? "✓" : total > 0 ? `${pct}%` : "—"}
                  </div>
                  <div style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: FONT.mono }}>{doneCount}/{total}</div>
                </div>
              </div>

              {/* Progress bar */}
              {total > 0 && (
                <div style={{ marginBottom: "0.85rem" }}>
                  <ProgressBar value={pct} color={phase.accent} height={4} />
                </div>
              )}

              {/* Static tasks */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {staticVisible.map((task) => {
                  const isDone = tasks[task.id] ?? task.done;
                  const displayText = taskLabels[task.id] ?? task.text;
                  return (
                    <TaskRowInner
                      key={task.id}
                      text={displayText}
                      isDone={isDone}
                      accent={phase.accent}
                      onToggle={() => toggleTask(task.id)}
                      onRename={(newText) => setTaskLabel(task.id, newText)}
                      onDelete={() => hideTask(task.id)}
                    />
                  );
                })}

                {/* Custom tasks */}
                {phaseCustom.map((ct) => {
                  const isDone = tasks[ct.id] ?? false;
                  return (
                    <TaskRowInner
                      key={ct.id}
                      text={ct.text}
                      isDone={isDone}
                      accent={phase.accent}
                      onToggle={() => toggleTask(ct.id)}
                      onRename={(newText) => {
                        // custom tasks rename via addCustomTask replacement not implemented;
                        // for simplicity reuse taskLabels
                        setTaskLabel(ct.id, newText);
                      }}
                      onDelete={() => removeCustomTask(ct.id)}
                    />
                  );
                })}
              </div>

              {/* Add task */}
              {addingPhase === phase.id ? (
                <AddTaskRow
                  phaseAccent={phase.accent}
                  onAdd={(text) => { addCustomTask(phase.id, text); setAddingPhase(null); }}
                  onCancel={() => setAddingPhase(null)}
                />
              ) : (
                <button
                  onClick={() => setAddingPhase(phase.id)}
                  style={{ marginTop: "0.75rem", width: "100%", background: "none", border: `1px dashed ${phase.accent}44`, color: phase.accent, borderRadius: 5, padding: "0.25rem", fontFamily: FONT.mono, fontSize: "0.6rem", cursor: "pointer", letterSpacing: "0.05em" }}
                >
                  + Ajouter une tâche
                </button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Global progress */}
      <Card style={{ marginTop: "1.25rem" }}>
        <SectionTitle accent={C.gold}>Avancement global</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {PHASES.map((phase) => {
            const phaseCustom = allCustomByPhase[phase.id] ?? [];
            const staticVisible = phase.tasks.filter((t) => !hiddenTasks.includes(t.id));
            const allIds = [...staticVisible.map((t) => t.id), ...phaseCustom.map((ct) => ct.id)];
            const doneCount = allIds.filter((id) => tasks[id]).length;
            const total = allIds.length;
            const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
            return (
              <div key={phase.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "0.68rem", color: phase.accent, fontFamily: FONT.mono }}>{phase.label} — {phase.name}</span>
                  <span style={{ fontSize: "0.68rem", color: phase.accent, fontFamily: FONT.mono }}>{doneCount}/{total}</span>
                </div>
                <ProgressBar value={pct} color={phase.accent} height={5} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
