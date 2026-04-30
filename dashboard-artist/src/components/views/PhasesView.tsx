import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import ProgressBar from "../ui/ProgressBar";
import type { Phase } from "../../types";

// ─── Add task row ─────────────────────────────────────────────────────────────
function AddTaskRow({ accent, onAdd, onCancel }: { accent: string; onAdd: (text: string) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState("");
  function submit() { const t = draft.trim(); if (t) { onAdd(t); setDraft(""); } else onCancel(); }
  return (
    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onCancel(); }} placeholder="Nouvelle tâche…" autoFocus style={{ flex: 1, background: C.surfaceAlt, border: `1px solid ${accent}55`, color: C.text, borderRadius: 4, padding: "0.2rem 0.4rem", fontSize: "0.73rem", fontFamily: FONT.body, outline: "none" }} />
      <button onClick={submit} style={{ background: accent, color: "#000", border: "none", borderRadius: 4, padding: "0.2rem 0.5rem", fontFamily: FONT.mono, fontSize: "0.62rem", cursor: "pointer", fontWeight: "bold" }}>Ajouter</button>
      <button onClick={onCancel} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.8rem" }}>×</button>
    </div>
  );
}

// ─── Task row ─────────────────────────────────────────────────────────────────
function TaskRow({ text, isDone, accent, onToggle, onRename, onDelete }: { text: string; isDone: boolean; accent: string; onToggle: () => void; onRename: (t: string) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  function save() { if (draft.trim()) onRename(draft.trim()); setEditing(false); }

  return (
    <div className="task-row" style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", position: "relative" }}>
      <input type="checkbox" checked={isDone} onChange={onToggle} style={{ accentColor: accent, marginTop: 3, flexShrink: 0 }} />
      {editing ? (
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setDraft(text); setEditing(false); } }} onBlur={save} autoFocus style={{ flex: 1, background: C.surfaceAlt, border: `1px solid ${accent}55`, color: C.text, borderRadius: 4, padding: "0.15rem 0.35rem", fontSize: "0.73rem", fontFamily: FONT.body, outline: "none" }} />
      ) : (
        <span style={{ flex: 1, fontSize: "0.75rem", color: isDone ? C.textDim : C.textSoft, textDecoration: isDone ? "line-through" : "none", lineHeight: 1.45, transition: "color 0.2s" }}>{text}</span>
      )}
      {!editing && (
        <div className="task-actions" style={{ display: "flex", gap: "0.1rem", opacity: 0, transition: "opacity 0.15s", flexShrink: 0 }}>
          <button onClick={() => { setDraft(text); setEditing(true); }} title="Renommer" style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.7rem", padding: "0 0.2rem", lineHeight: 1 }}>✎</button>
          <button onClick={onDelete} title="Supprimer" style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.75rem", padding: "0 0.2rem", lineHeight: 1 }}>×</button>
        </div>
      )}
    </div>
  );
}

// ─── Phase editor modal ───────────────────────────────────────────────────────
function PhaseEditorModal({ phase, onClose }: { phase: Phase; onClose: () => void }) {
  const updatePhase = useStore((s) => s.updatePhase);
  const [label, setLabel] = useState(phase.label);
  const [name, setName] = useState(phase.name);
  const [months, setMonths] = useState(phase.months);
  const [color, setColor] = useState(phase.color);
  const [accent, setAccent] = useState(phase.accent);
  const [startDate, setStartDate] = useState(phase.startDate ?? "");
  const [estimatedEndDate, setEstimatedEndDate] = useState(phase.estimatedEndDate ?? "");

  function save() {
    updatePhase(phase.id, { label, name, months, color, accent, startDate: startDate || undefined, estimatedEndDate: estimatedEndDate || undefined });
    onClose();
  }

  const inp = { background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 4, padding: "0.25rem 0.5rem", fontSize: "0.75rem", fontFamily: FONT.body, width: "100%" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 10, padding: "1.5rem", width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>Éditer la phase</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Label (ex: Phase 0)</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Nom</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inp} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Période (ex: Mois 1–4)</label>
          <input value={months} onChange={(e) => setMonths(e.target.value)} style={inp} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Date de début</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Fin estimée</label>
            <input type="date" value={estimatedEndDate} onChange={(e) => setEstimatedEndDate(e.target.value)} style={inp} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Couleur principale</label>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 36, height: 28, padding: 0, border: "none", background: "none", cursor: "pointer" }} />
              <input value={color} onChange={(e) => setColor(e.target.value)} style={{ ...inp, flex: 1 }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Couleur accent</label>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} style={{ width: 36, height: 28, padding: 0, border: "none", background: "none", cursor: "pointer" }} />
              <input value={accent} onChange={(e) => setAccent(e.target.value)} style={{ ...inp, flex: 1 }} />
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

// ─── Add phase modal ──────────────────────────────────────────────────────────
function AddPhaseModal({ onClose }: { onClose: () => void }) {
  const addPhase = useStore((s) => s.addPhase);
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [months, setMonths] = useState("");
  const [color, setColor] = useState("#6B7280");
  const [accent, setAccent] = useState("#9CA3AF");
  const [startDate, setStartDate] = useState("");
  const [estimatedEndDate, setEstimatedEndDate] = useState("");

  function save() {
    if (!label.trim() || !name.trim()) return;
    addPhase({ label: label.trim(), name: name.trim(), months: months.trim(), color, accent, tasks: [], startDate: startDate || undefined, estimatedEndDate: estimatedEndDate || undefined });
    onClose();
  }

  const inp = { background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 4, padding: "0.25rem 0.5rem", fontSize: "0.75rem", fontFamily: FONT.body, width: "100%" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 10, padding: "1.5rem", width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>Nouvelle phase</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Label *</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Phase 4" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Nom *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Expansion" style={inp} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Période</label>
          <input value={months} onChange={(e) => setMonths(e.target.value)} placeholder="Mois 37–48" style={inp} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Date de début</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Fin estimée</label>
            <input type="date" value={estimatedEndDate} onChange={(e) => setEstimatedEndDate(e.target.value)} style={inp} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Couleur principale</label>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 36, height: 28, padding: 0, border: "none", background: "none", cursor: "pointer" }} />
              <input value={color} onChange={(e) => setColor(e.target.value)} style={{ ...inp, flex: 1 }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Couleur accent</label>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} style={{ width: 36, height: 28, padding: 0, border: "none", background: "none", cursor: "pointer" }} />
              <input value={accent} onChange={(e) => setAccent(e.target.value)} style={{ ...inp, flex: 1 }} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontSize: "0.7rem", fontFamily: FONT.mono }}>Annuler</button>
          <button onClick={save} disabled={!label.trim() || !name.trim()} style={{ background: (label.trim() && name.trim()) ? C.gold : C.border, border: "none", color: "#000", borderRadius: 6, padding: "0.35rem 0.9rem", cursor: (label.trim() && name.trim()) ? "pointer" : "default", fontSize: "0.7rem", fontFamily: FONT.mono, fontWeight: "bold" }}>Créer</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function PhasesView() {
  const phases = useStore((s) => s.phases);
  const toggleTask = useStore((s) => s.toggleTask);
  const setTaskLabel = useStore((s) => s.setTaskLabel);
  const addCustomTask = useStore((s) => s.addCustomTask);
  const hideTask = useStore((s) => s.hideTask);
  const removePhase = useStore((s) => s.removePhase);

  const [addingPhase, setAddingPhase] = useState<number | null>(null);
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [addingNewPhase, setAddingNewPhase] = useState(false);

  return (
    <div>
      <style>{`.task-row:hover .task-actions { opacity: 1 !important; }`}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Feuille de route 36 mois</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Architecture en phases — marquer les tâches au fil de l'avancement
          </p>
        </div>
        <button onClick={() => setAddingNewPhase(true)} style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.4rem 0.85rem", fontSize: "0.68rem", fontFamily: FONT.mono, cursor: "pointer", fontWeight: "bold" }}>+ Nouvelle phase</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {phases.map((phase) => {
          const doneCount = phase.tasks.filter((t) => t.done).length;
          const total = phase.tasks.length;
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
                  {(phase.startDate || phase.estimatedEndDate) && (
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem" }}>
                      {phase.startDate && (
                        <span style={{ fontFamily: FONT.mono, fontSize: "0.58rem", color: C.textDim }}>
                          ► {new Date(phase.startDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      )}
                      {phase.estimatedEndDate && (
                        <span style={{ fontFamily: FONT.mono, fontSize: "0.58rem", color: C.textDim }}>
                          → {new Date(phase.estimatedEndDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: FONT.mono, fontSize: "1.2rem", color: isComplete ? C.green : phase.accent, fontWeight: "bold" }}>
                      {isComplete ? "✓" : total > 0 ? `${pct}%` : "—"}
                    </div>
                    <div style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: FONT.mono }}>{doneCount}/{total}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <button onClick={() => setEditingPhase(phase)} title="Éditer la phase" style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.75rem", padding: "0.1rem 0.2rem", lineHeight: 1 }}>✎</button>
                    <button onClick={() => { if (confirm(`Supprimer "${phase.name}" et toutes ses tâches ?`)) removePhase(phase.id); }} title="Supprimer la phase" style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.85rem", padding: "0.1rem 0.2rem", lineHeight: 1 }}>×</button>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {total > 0 && <div style={{ marginBottom: "0.85rem" }}><ProgressBar value={pct} color={phase.accent} height={4} /></div>}

              {/* Tasks */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {phase.tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    text={task.text}
                    isDone={task.done}
                    accent={phase.accent}
                    onToggle={() => toggleTask(task.id)}
                    onRename={(newText) => setTaskLabel(task.id, newText)}
                    onDelete={() => hideTask(task.id)}
                  />
                ))}
              </div>

              {/* Add task */}
              {addingPhase === phase.id ? (
                <div style={{ marginTop: "0.75rem" }}>
                  <AddTaskRow accent={phase.accent} onAdd={(text) => { addCustomTask(phase.id, text); setAddingPhase(null); }} onCancel={() => setAddingPhase(null)} />
                </div>
              ) : (
                <button onClick={() => setAddingPhase(phase.id)} style={{ marginTop: "0.75rem", width: "100%", background: "none", border: `1px dashed ${phase.accent}44`, color: phase.accent, borderRadius: 5, padding: "0.25rem", fontFamily: FONT.mono, fontSize: "0.6rem", cursor: "pointer", letterSpacing: "0.05em" }}>
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
          {phases.map((phase) => {
            const done = phase.tasks.filter((t) => t.done).length;
            const total = phase.tasks.length;
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

      {editingPhase && <PhaseEditorModal phase={editingPhase} onClose={() => setEditingPhase(null)} />}
      {addingNewPhase && <AddPhaseModal onClose={() => setAddingNewPhase(false)} />}
    </div>
  );
}

