import { useState } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import type { OperationalMode, RiskPattern } from "../../types";

type Tab = "modes" | "principles" | "risks" | "checklist" | "budgets";

function genId() {
  return `g-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function GuardrailsView() {
  const operationalModes = useStore((s) => s.operationalModes);
  const principles = useStore((s) => s.principles);
  const riskPatterns = useStore((s) => s.riskPatterns);
  const collabChecklist = useStore((s) => s.collabChecklist);
  const phaseBudgets = useStore((s) => s.phaseBudgets);

  const addOperationalMode = useStore((s) => s.addOperationalMode);
  const updateOperationalMode = useStore((s) => s.updateOperationalMode);
  const removeOperationalMode = useStore((s) => s.removeOperationalMode);
  const addPrinciple = useStore((s) => s.addPrinciple);
  const updatePrinciple = useStore((s) => s.updatePrinciple);
  const removePrinciple = useStore((s) => s.removePrinciple);
  const addRiskPattern = useStore((s) => s.addRiskPattern);
  const updateRiskPattern = useStore((s) => s.updateRiskPattern);
  const removeRiskPattern = useStore((s) => s.removeRiskPattern);
  const addCollabCheck = useStore((s) => s.addCollabCheck);
  const updateCollabCheck = useStore((s) => s.updateCollabCheck);
  const removeCollabCheck = useStore((s) => s.removeCollabCheck);
  const addPhaseBudget = useStore((s) => s.addPhaseBudget);
  const updatePhaseBudget = useStore((s) => s.updatePhaseBudget);
  const removePhaseBudget = useStore((s) => s.removePhaseBudget);

  const [tab, setTab] = useState<Tab>("modes");

  // Mode form
  const [showModeModal, setShowModeModal] = useState(false);
  const [editMode, setEditMode] = useState<OperationalMode | null>(null);
  const [mLabel, setMLabel] = useState("");
  const [mColor, setMColor] = useState("#4c7fc9");
  const [mTrigger, setMTrigger] = useState("");
  const [mRules, setMRules] = useState("");
  const [mExit, setMExit] = useState("");
  const [mSlot, setMSlot] = useState(90);

  // Risk form
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [editRisk, setEditRisk] = useState<RiskPattern | null>(null);
  const [rLabel, setRLabel] = useState("");
  const [rDesc, setRDesc] = useState("");

  // Principle form
  const [editPrincipleN, setEditPrincipleN] = useState<string | null>(null);
  const [pText, setPText] = useState("");

  // Checklist new item
  const [newCheckQ, setNewCheckQ] = useState("");

  // Budget form
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editBudgetIdx, setEditBudgetIdx] = useState<number | null>(null);
  const [bPhase, setBPhase] = useState("");
  const [bMonths, setBMonths] = useState("3");
  const [bMaxHours, setBMaxHours] = useState(100);
  const [bColor, setBColor] = useState("#4c7fc9");

  const TABS: { id: Tab; label: string }[] = [
    { id: "modes", label: "Op Modes" },
    { id: "principles", label: "Principles" },
    { id: "risks", label: "Risk Patterns" },
    { id: "checklist", label: "Checklist" },
    { id: "budgets", label: "Phase Budgets" },
  ];

  function openNewMode() {
    setEditMode(null);
    setMLabel(""); setMColor("#4c7fc9"); setMTrigger(""); setMRules(""); setMExit(""); setMSlot(90);
    setShowModeModal(true);
  }
  function openEditMode(m: OperationalMode) {
    setEditMode(m);
    setMLabel(m.label); setMColor(m.color); setMTrigger(m.trigger);
    setMRules(m.rules.join("\n")); setMExit(m.exit); setMSlot(m.slotDurationMin ?? 90);
    setShowModeModal(true);
  }
  function saveMode() {
    if (!mLabel.trim()) return;
    const rules = mRules.split("\n").map((r) => r.trim()).filter(Boolean);
    if (editMode) {
      updateOperationalMode(editMode.id, { label: mLabel, color: mColor, trigger: mTrigger, rules, exit: mExit, slotDurationMin: mSlot });
    } else {
      addOperationalMode({ id: genId(), label: mLabel, color: mColor, trigger: mTrigger, rules, exit: mExit, slotDurationMin: mSlot });
    }
    setShowModeModal(false);
  }

  function openNewRisk() {
    setEditRisk(null); setRLabel(""); setRDesc(""); setShowRiskModal(true);
  }
  function openEditRisk(r: RiskPattern) {
    setEditRisk(r); setRLabel(r.label); setRDesc(r.desc); setShowRiskModal(true);
  }
  function saveRisk() {
    if (!rLabel.trim()) return;
    if (editRisk) {
      updateRiskPattern(editRisk.id, { label: rLabel, desc: rDesc });
    } else {
      addRiskPattern({ id: genId(), label: rLabel, desc: rDesc });
    }
    setShowRiskModal(false);
  }

  function openNewBudget() {
    setEditBudgetIdx(null); setBPhase(""); setBMonths("3"); setBMaxHours(100); setBColor("#4c7fc9");
    setShowBudgetModal(true);
  }
  function openEditBudget(idx: number) {
    const b = phaseBudgets[idx];
    setEditBudgetIdx(idx); setBPhase(b.phase); setBMonths(b.months); setBMaxHours(b.maxHours); setBColor(b.color);
    setShowBudgetModal(true);
  }
  function saveBudget() {
    if (!bPhase.trim()) return;
    if (editBudgetIdx !== null) {
      updatePhaseBudget(editBudgetIdx, { phase: bPhase, months: bMonths, maxHours: bMaxHours, color: bColor });
    } else {
      addPhaseBudget({ phase: bPhase, months: bMonths, maxHours: bMaxHours, color: bColor });
    }
    setShowBudgetModal(false);
  }

  return (
    <div>
      <SectionTitle sub="Operational guardrails, principles, and risk management">
        Guardrails
      </SectionTitle>

      <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "0.4rem 1rem", borderRadius: 6, background: tab === t.id ? C.accent : C.surfaceAlt, color: tab === t.id ? "#fff" : C.textSoft, border: "none", cursor: "pointer", fontSize: "0.82rem" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Operational Modes */}
      {tab === "modes" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
            <button onClick={openNewMode} style={{ ...btnPrimary, fontSize: "0.8rem" }}>+ Mode</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {operationalModes.map((mode) => (
              <Card key={mode.id} style={{ borderLeft: `3px solid ${mode.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "0.92rem", color: mode.color, fontWeight: 600, marginBottom: 4 }}>{mode.label}</div>
                    {mode.trigger && <div style={{ fontSize: "0.78rem", color: C.textMuted, marginBottom: 6 }}>Trigger: {mode.trigger}</div>}
                    {mode.rules.length > 0 && (
                      <ul style={{ margin: "0 0 6px", paddingLeft: 16 }}>
                        {mode.rules.map((r, i) => <li key={i} style={{ fontSize: "0.82rem", color: C.textSoft, lineHeight: 1.5 }}>{r}</li>)}
                      </ul>
                    )}
                    {mode.exit && <div style={{ fontSize: "0.75rem", color: C.textDim }}>Exit: {mode.exit}</div>}
                    <div style={{ fontSize: "0.72rem", color: C.textVeryDim, marginTop: 4 }}>Slot: {mode.slotDurationMin ?? 90} min</div>
                  </div>
                  <button onClick={() => openEditMode(mode)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.78rem" }}>Edit</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Principles */}
      {tab === "principles" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
            <button
              onClick={() => {
                const n = `P${principles.length + 1}`;
                addPrinciple({ n, text: "New principle" });
              }}
              style={{ ...btnPrimary, fontSize: "0.8rem" }}
            >
              + Principle
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {principles.map((p, idx) => (
              <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "0.6rem 1rem" }}>
                <span style={{ fontSize: "0.88rem", color: C.accent, fontWeight: 700, minWidth: 30 }}>{idx + 1}.</span>
                {editPrincipleN === p.n ? (
                  <input
                    value={pText}
                    onChange={(e) => setPText(e.target.value)}
                    onBlur={() => { updatePrinciple(p.n, { text: pText }); setEditPrincipleN(null); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { updatePrinciple(p.n, { text: pText }); setEditPrincipleN(null); } }}
                    style={{ flex: 1, background: "transparent", border: `1px solid ${C.accent}`, borderRadius: 4, color: C.text, fontSize: "0.88rem", outline: "none", padding: "2px 6px" }}
                    autoFocus
                  />
                ) : (
                  <span
                    style={{ flex: 1, fontSize: "0.88rem", color: C.textSoft, cursor: "pointer" }}
                    onClick={() => { setEditPrincipleN(p.n); setPText(p.text); }}
                  >
                    {p.text}
                    {p.note && <span style={{ fontSize: "0.75rem", color: C.textDim, marginLeft: 8 }}>({p.note})</span>}
                  </span>
                )}
                <button onClick={() => removePrinciple(p.n)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Patterns */}
      {tab === "risks" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
            <button onClick={openNewRisk} style={{ ...btnPrimary, fontSize: "0.8rem" }}>+ Risk</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
            {riskPatterns.map((risk) => (
              <Card key={risk.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.88rem", color: C.red, fontWeight: 600 }}>⚠ {risk.label}</span>
                  <button onClick={() => openEditRisk(risk)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.78rem" }}>Edit</button>
                </div>
                {risk.desc && <p style={{ margin: 0, fontSize: "0.82rem", color: C.textMuted }}>{risk.desc}</p>}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      {tab === "checklist" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
            {collabChecklist.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "0.55rem 1rem" }}>
                <span style={{ fontSize: "0.85rem", color: C.accent, minWidth: 20 }}>☐</span>
                <input
                  value={item.q}
                  onChange={(e) => updateCollabCheck(item.id, { q: e.target.value })}
                  style={{ flex: 1, background: "transparent", border: "none", color: C.textSoft, fontSize: "0.85rem", outline: "none" }}
                />
                <button onClick={() => removeCollabCheck(item.id)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer" }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={newCheckQ}
              onChange={(e) => setNewCheckQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newCheckQ.trim()) {
                  addCollabCheck({ id: genId(), q: newCheckQ.trim(), text: "" });
                  setNewCheckQ("");
                }
              }}
              placeholder="Add checklist item…"
              style={{ flex: 1, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 6, padding: "0.4rem 0.75rem", color: C.text, fontSize: "0.85rem", outline: "none" }}
            />
            <button
              onClick={() => {
                if (newCheckQ.trim()) {
                  addCollabCheck({ id: genId(), q: newCheckQ.trim(), text: "" });
                  setNewCheckQ("");
                }
              }}
              style={btnPrimary}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Phase Budgets */}
      {tab === "budgets" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
            <button onClick={openNewBudget} style={{ ...btnPrimary, fontSize: "0.8rem" }}>+ Budget</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {phaseBudgets.map((b, idx) => (
              <Card key={`${b.phase}-${idx}`} style={{ borderTop: `3px solid ${b.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.9rem", color: b.color, fontWeight: 600 }}>{b.phase}</span>
                  <button onClick={() => openEditBudget(idx)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.78rem" }}>Edit</button>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: 2 }}>{b.maxHours}h</div>
                <div style={{ fontSize: "0.78rem", color: C.textMuted }}>{b.months} months</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Mode Modal */}
      <Modal open={showModeModal} onClose={() => setShowModeModal(false)} title={editMode ? "Edit Mode" : "New Mode"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Label</label>
            <input value={mLabel} onChange={(e) => setMLabel(e.target.value)} style={inputStyle} autoFocus />
          </div>
          <div>
            <label style={labelStyle}>Color</label>
            <input type="color" value={mColor} onChange={(e) => setMColor(e.target.value)} style={{ width: 40, height: 38, border: "none", background: "none", cursor: "pointer" }} />
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Trigger</label>
          <input value={mTrigger} onChange={(e) => setMTrigger(e.target.value)} style={inputStyle} />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Rules (one per line)</label>
          <textarea value={mRules} onChange={(e) => setMRules(e.target.value)} style={{ ...inputStyle, height: 80, resize: "vertical" }} />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Exit condition</label>
          <input value={mExit} onChange={(e) => setMExit(e.target.value)} style={inputStyle} />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Slot duration (min): {mSlot}</label>
          <input type="range" min={15} max={240} step={15} value={mSlot} onChange={(e) => setMSlot(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editMode && <button onClick={() => { removeOperationalMode(editMode.id); setShowModeModal(false); }} style={btnDanger}>Delete</button>}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowModeModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={saveMode} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>

      {/* Risk Modal */}
      <Modal open={showRiskModal} onClose={() => setShowRiskModal(false)} title={editRisk ? "Edit Risk" : "New Risk"}>
        <div style={formRow}>
          <label style={labelStyle}>Label</label>
          <input value={rLabel} onChange={(e) => setRLabel(e.target.value)} style={inputStyle} autoFocus />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Description</label>
          <textarea value={rDesc} onChange={(e) => setRDesc(e.target.value)} style={{ ...inputStyle, height: 80, resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editRisk && <button onClick={() => { removeRiskPattern(editRisk.id); setShowRiskModal(false); }} style={btnDanger}>Delete</button>}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowRiskModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={saveRisk} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>

      {/* Budget Modal */}
      <Modal open={showBudgetModal} onClose={() => setShowBudgetModal(false)} title={editBudgetIdx !== null ? "Edit Budget" : "New Budget"}>
        <div style={formRow}>
          <label style={labelStyle}>Phase name</label>
          <input value={bPhase} onChange={(e) => setBPhase(e.target.value)} style={inputStyle} autoFocus disabled={editBudgetIdx !== null} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Months</label>
            <input value={bMonths} onChange={(e) => setBMonths(e.target.value)} style={inputStyle} placeholder="3" />
          </div>
          <div>
            <label style={labelStyle}>Max hours</label>
            <input type="number" min={0} value={bMaxHours} onChange={(e) => setBMaxHours(Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Color</label>
            <input type="color" value={bColor} onChange={(e) => setBColor(e.target.value)} style={{ width: 40, height: 38, border: "none", background: "none", cursor: "pointer" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editBudgetIdx !== null && <button onClick={() => { removePhaseBudget(editBudgetIdx); setShowBudgetModal(false); }} style={btnDanger}>Delete</button>}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowBudgetModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={saveBudget} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
