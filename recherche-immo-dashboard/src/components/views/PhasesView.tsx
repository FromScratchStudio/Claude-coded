import { useState } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { ProgressBar } from "../ui/ProgressBar";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import type { Phase } from "../../types";

export default function PhasesView() {
  const phases = useStore((s) => s.phases);
  const strategyStartDate = useStore((s) => s.strategyStartDate);
  const strategyEstimatedEndDate = useStore((s) => s.strategyEstimatedEndDate);
  const addPhase = useStore((s) => s.addPhase);
  const updatePhase = useStore((s) => s.updatePhase);
  const removePhase = useStore((s) => s.removePhase);
  const setStrategyStartDate = useStore((s) => s.setStrategyStartDate);
  const setStrategyEstimatedEndDate = useStore((s) => s.setStrategyEstimatedEndDate);
  const addCustomTask = useStore((s) => s.addCustomTask);
  const toggleTask = useStore((s) => s.toggleTask);
  const removeTask = useStore((s) => s.removeTask);

  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [editPhase, setEditPhase] = useState<Phase | null>(null);

  const [pName, setPName] = useState("");
  const [pLabel, setPLabel] = useState("");
  const [pAccent, setPAccent] = useState("#4c7fc9");
  const [pStart, setPStart] = useState("");
  const [pEnd, setPEnd] = useState("");
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [newTaskText, setNewTaskText] = useState<Record<number, string>>({});

  function openNewPhase() {
    setEditPhase(null);
    setPName("New Phase");
    setPLabel(`P${phases.length + 1}`);
    setPAccent("#4c7fc9");
    setPStart("");
    setPEnd("");
    setShowPhaseModal(true);
  }

  function openEditPhase(phase: Phase) {
    setEditPhase(phase);
    setPName(phase.name);
    setPLabel(phase.label);
    setPAccent(phase.accent);
    setPStart(phase.startDate ?? "");
    setPEnd(phase.estimatedEndDate ?? "");
    setShowPhaseModal(true);
  }

  function savePhase() {
    if (!pName.trim()) return;
    if (editPhase) {
      updatePhase(editPhase.id, {
        name: pName.trim(),
        label: pLabel.trim(),
        accent: pAccent,
        startDate: pStart || undefined,
        estimatedEndDate: pEnd || undefined,
      });
    } else {
      addPhase({
        name: pName.trim(),
        label: pLabel.trim(),
        accent: pAccent,
        color: pAccent,
        months: "",
        tasks: [],
        startDate: pStart || undefined,
        estimatedEndDate: pEnd || undefined,
      });
    }
    setShowPhaseModal(false);
  }

  function addTask(phaseId: number) {
    const text = (newTaskText[phaseId] ?? "").trim();
    if (!text) return;
    addCustomTask(phaseId, text);
    setNewTaskText((prev) => ({ ...prev, [phaseId]: "" }));
  }

  function handleToggleTask(_phaseId: number, taskId: string) {
    toggleTask(taskId);
  }

  function handleRemoveTask(_phaseId: number, taskId: string) {
    removeTask(taskId);
  }

  const totalTasks = phases.reduce((s, p) => s + p.tasks.length, 0);
  const doneTasks = phases.reduce((s, p) => s + p.tasks.filter((t) => t.done).length, 0);

  return (
    <div>
      <SectionTitle
        sub={`${phases.length} phases · ${doneTasks}/${totalTasks} tasks complete`}
        action={
          <button onClick={openNewPhase} style={{ ...btnPrimary, fontSize: "0.8rem" }}>
            + Phase
          </button>
        }
      >
        Phases & Milestones
      </SectionTitle>

      {/* Strategy dates */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: "0.78rem", color: C.textMuted }}>Strategy start:</label>
          <input
            type="date"
            value={strategyStartDate ?? ""}
            onChange={(e) => setStrategyStartDate(e.target.value)}
            style={{
              background: C.surfaceAlt,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.text,
              padding: "0.3rem 0.6rem",
              fontSize: "0.82rem",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: "0.78rem", color: C.textMuted }}>Estimated end:</label>
          <input
            type="date"
            value={strategyEstimatedEndDate ?? ""}
            onChange={(e) => setStrategyEstimatedEndDate(e.target.value)}
            style={{
              background: C.surfaceAlt,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.text,
              padding: "0.3rem 0.6rem",
              fontSize: "0.82rem",
            }}
          />
        </div>
      </div>

      {/* Phase cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {phases.map((phase) => {
          const done = phase.tasks.filter((t) => t.done).length;
          const total = phase.tasks.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isExpanded = expandedPhase === phase.id;

          return (
            <div
              key={phase.id}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderLeft: `4px solid ${phase.accent}`,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {/* Phase header */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: `${phase.accent}20`,
                    color: phase.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    flexShrink: 0,
                  }}
                >
                  {phase.label}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: "0.92rem", color: C.text, fontWeight: 500 }}>
                      {phase.name}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: "0.78rem", color: C.textDim }}>
                        {done}/{total} tasks · {pct}%
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditPhase(phase);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: C.textDim,
                          cursor: "pointer",
                          fontSize: "0.78rem",
                          padding: "2px 6px",
                        }}
                      >
                        Edit
                      </button>
                      <span style={{ color: C.textDim, fontSize: "0.8rem" }}>
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>
                  <ProgressBar value={pct} color={phase.accent} height={4} />
                </div>
              </div>

              {/* Tasks */}
              {isExpanded && (
                <div
                  style={{
                    borderTop: `1px solid ${C.border}`,
                    padding: "0.75rem 1.25rem 1rem",
                  }}
                >
                  {phase.tasks.length === 0 && (
                    <p style={{ color: C.textDim, fontSize: "0.82rem", margin: "0 0 0.75rem" }}>
                      No tasks yet.
                    </p>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "0.35rem 0",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => handleToggleTask(phase.id, task.id)}
                          style={{ accentColor: phase.accent }}
                        />
                        <span
                          style={{
                            flex: 1,
                            fontSize: "0.85rem",
                            color: task.done ? C.textDim : C.textSoft,
                            textDecoration: task.done ? "line-through" : "none",
                          }}
                        >
                          {task.text}
                        </span>
                        <button
                          onClick={() => handleRemoveTask(phase.id, task.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: C.textVeryDim,
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            padding: "2px 4px",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: "0.5rem",
                    }}
                  >
                    <input
                      value={newTaskText[phase.id] ?? ""}
                      onChange={(e) =>
                        setNewTaskText((prev) => ({ ...prev, [phase.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && addTask(phase.id)}
                      placeholder="Add task…"
                      style={{
                        flex: 1,
                        background: C.bgDeep,
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        padding: "0.35rem 0.65rem",
                        color: C.text,
                        fontSize: "0.82rem",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={() => addTask(phase.id)}
                      style={{
                        background: `${phase.accent}20`,
                        color: phase.accent,
                        border: `1px solid ${phase.accent}40`,
                        borderRadius: 6,
                        padding: "0.35rem 0.9rem",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {phases.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: C.textDim }}>
          <p>No phases defined. Add your first phase to begin.</p>
          <button onClick={openNewPhase} style={{ ...btnPrimary, marginTop: "0.5rem" }}>
            Add phase
          </button>
        </div>
      )}

      <Modal open={showPhaseModal} onClose={() => setShowPhaseModal(false)} title={editPhase ? "Edit Phase" : "New Phase"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Phase name</label>
            <input value={pName} onChange={(e) => setPName(e.target.value)} style={inputStyle} autoFocus />
          </div>
          <div>
            <label style={labelStyle}>Short label</label>
            <input value={pLabel} onChange={(e) => setPLabel(e.target.value)} style={inputStyle} placeholder="P1" />
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Accent color</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="color" value={pAccent} onChange={(e) => setPAccent(e.target.value)} style={{ width: 40, height: 32, border: "none", background: "none", cursor: "pointer" }} />
            <input value={pAccent} onChange={(e) => setPAccent(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="#4c7fc9" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Start date</label>
            <input type="date" value={pStart} onChange={(e) => setPStart(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Estimated end</label>
            <input type="date" value={pEnd} onChange={(e) => setPEnd(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editPhase && (
            <button onClick={() => { removePhase(editPhase.id); setShowPhaseModal(false); }} style={btnDanger}>
              Delete
            </button>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowPhaseModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={savePhase} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
