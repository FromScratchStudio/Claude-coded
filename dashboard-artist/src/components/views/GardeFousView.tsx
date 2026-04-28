import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import type { DegradedMode, Trap, CollabCheck, BuildBudget } from "../../types";

type Tab = "modes" | "principles" | "traps" | "collab" | "budget";

// ─── Inline text edit ─────────────────────────────────────────────────────────
function InlineEdit({ value, onSave, style: s, multiline }: { value: string; onSave: (v: string) => void; style?: React.CSSProperties; multiline?: boolean }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  function save() { if (draft.trim()) onSave(draft.trim()); setEditing(false); }
  const base: React.CSSProperties = { background: "none", border: "none", padding: 0, cursor: "text", color: "inherit", fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit", textAlign: "left", width: "100%", ...s };
  if (editing) {
    const editStyle: React.CSSProperties = { background: C.surfaceAlt, border: `1px solid ${C.borderLight}`, color: C.text, borderRadius: 4, padding: "0.15rem 0.35rem", fontSize: "0.8rem", fontFamily: FONT.body, width: "100%", resize: multiline ? "vertical" : "none", outline: "none" };
    return multiline
      ? <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={save} autoFocus rows={3} style={editStyle as React.CSSProperties & { resize: string }} />
      : <input value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={save} onKeyDown={(e) => e.key === "Enter" && save()} autoFocus style={editStyle} />;
  }
  return <button onClick={() => { setDraft(value); setEditing(true); }} style={base} title="Cliquer pour éditer">{value || <em style={{ color: C.textVeryDim }}>—</em>}</button>;
}

// ─── DegradedMode editor ──────────────────────────────────────────────────────
function DegradedModeEditor({ mode, onClose }: { mode: DegradedMode; onClose: () => void }) {
  const updateDegradedMode = useStore((s) => s.updateDegradedMode);
  const [label, setLabel] = useState(mode.label);
  const [color, setColor] = useState(mode.color);
  const [trigger, setTrigger] = useState(mode.trigger);
  const [rules, setRules] = useState<string[]>([...mode.rules]);
  const [exit, setExit] = useState(mode.exit);
  const [newRule, setNewRule] = useState("");

  function save() {
    updateDegradedMode(mode.id, { label, color, trigger, rules, exit });
    onClose();
  }

  const inp: React.CSSProperties = { background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 4, padding: "0.25rem 0.5rem", fontSize: "0.75rem", fontFamily: FONT.body, width: "100%" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 10, padding: "1.5rem", width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>Éditer le mode dégradé</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Nom</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Couleur</label>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 36, height: 28, padding: 0, border: "none", background: "none", cursor: "pointer" }} />
              <input value={color} onChange={(e) => setColor(e.target.value)} style={{ ...inp, flex: 1 }} />
            </div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Déclencheur</label>
          <textarea value={trigger} onChange={(e) => setTrigger(e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div>
          <div style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.4rem" }}>Règles</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {rules.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem" }}>
                <input value={r} onChange={(e) => setRules(rules.map((x, j) => j === i ? e.target.value : x))} style={{ ...inp, flex: 1 }} />
                <button onClick={() => setRules(rules.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "1rem" }}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <input value={newRule} onChange={(e) => setNewRule(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newRule.trim()) { setRules([...rules, newRule.trim()]); setNewRule(""); } }} placeholder="Nouvelle règle…" style={{ ...inp, flex: 1 }} />
              <button onClick={() => { if (newRule.trim()) { setRules([...rules, newRule.trim()]); setNewRule(""); } }} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 4, padding: "0.25rem 0.6rem", fontSize: "0.62rem", fontFamily: FONT.mono, cursor: "pointer" }}>+</button>
            </div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Condition de sortie</label>
          <textarea value={exit} onChange={(e) => setExit(e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontSize: "0.7rem", fontFamily: FONT.mono }}>Annuler</button>
          <button onClick={save} style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.35rem 0.9rem", cursor: "pointer", fontSize: "0.7rem", fontFamily: FONT.mono, fontWeight: "bold" }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add degraded mode modal ──────────────────────────────────────────────────
function AddModeModal({ onClose }: { onClose: () => void }) {
  const addDegradedMode = useStore((s) => s.addDegradedMode);
  const [id, setId] = useState("");
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#EF4444");
  const [trigger, setTrigger] = useState("");
  const [exit, setExit] = useState("");
  const [rules, setRules] = useState<string[]>([""]);

  function save() {
    if (!id.trim() || !label.trim()) return;
    addDegradedMode({ id: id.trim(), label: label.trim(), color, trigger: trigger.trim(), exit: exit.trim(), rules: rules.map((r) => r.trim()).filter(Boolean) });
    onClose();
  }
  const inp: React.CSSProperties = { background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 4, padding: "0.25rem 0.5rem", fontSize: "0.75rem", fontFamily: FONT.body, width: "100%" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 10, padding: "1.5rem", width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>Nouveau mode dégradé</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>ID (slug) *</label>
            <input value={id} onChange={(e) => setId(e.target.value)} placeholder="ex: voyage" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Nom *</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Voyage prolongé" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Couleur</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: "100%", height: 28, padding: 0, border: "none", background: "none", cursor: "pointer" }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Déclencheur</label>
          <textarea value={trigger} onChange={(e) => setTrigger(e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div>
          <div style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.4rem" }}>Règles</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {rules.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem" }}>
                <input value={r} onChange={(e) => setRules(rules.map((x, j) => j === i ? e.target.value : x))} placeholder={`Règle ${i + 1}…`} style={{ ...inp, flex: 1 }} />
                {rules.length > 1 && <button onClick={() => setRules(rules.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "1rem" }}>×</button>}
              </div>
            ))}
            <button onClick={() => setRules([...rules, ""])} style={{ alignSelf: "flex-start", background: "none", border: `1px dashed ${C.border}`, color: C.textDim, borderRadius: 4, padding: "0.2rem 0.5rem", fontSize: "0.62rem", fontFamily: FONT.mono, cursor: "pointer" }}>+ Règle</button>
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Condition de sortie</label>
          <textarea value={exit} onChange={(e) => setExit(e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontSize: "0.7rem", fontFamily: FONT.mono }}>Annuler</button>
          <button onClick={save} disabled={!id.trim() || !label.trim()} style={{ background: (id.trim() && label.trim()) ? C.gold : C.border, border: "none", color: "#000", borderRadius: 6, padding: "0.35rem 0.9rem", cursor: (id.trim() && label.trim()) ? "pointer" : "default", fontSize: "0.7rem", fontFamily: FONT.mono, fontWeight: "bold" }}>Créer</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function GardeFousView() {
  const degradedMode = useStore((s) => s.degradedMode);
  const setDegradedMode = useStore((s) => s.setDegradedMode);

  const degradedModes = useStore((s) => s.degradedModes);
  const removeDegradedMode = useStore((s) => s.removeDegradedMode);

  const principles = useStore((s) => s.principles);
  const updatePrinciple = useStore((s) => s.updatePrinciple);
  const addPrinciple = useStore((s) => s.addPrinciple);
  const removePrinciple = useStore((s) => s.removePrinciple);

  const traps = useStore((s) => s.traps);
  const updateTrap = useStore((s) => s.updateTrap);
  const addTrap = useStore((s) => s.addTrap);
  const removeTrap = useStore((s) => s.removeTrap);

  const collabChecklist = useStore((s) => s.collabChecklist);
  const updateCollabCheck = useStore((s) => s.updateCollabCheck);
  const addCollabCheck = useStore((s) => s.addCollabCheck);
  const removeCollabCheck = useStore((s) => s.removeCollabCheck);

  const buildBudgets = useStore((s) => s.buildBudgets);
  const updateBuildBudget = useStore((s) => s.updateBuildBudget);
  const addBuildBudget = useStore((s) => s.addBuildBudget);
  const removeBuildBudget = useStore((s) => s.removeBuildBudget);

  const [activeTab, setActiveTab] = useState<Tab>("modes");
  const [collabChecked, setCollabChecked] = useState<Record<string, boolean>>({});
  const [editingMode, setEditingMode] = useState<DegradedMode | null>(null);
  const [addingMode, setAddingMode] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: "modes", label: "Modes dégradés" },
    { id: "principles", label: "Principes" },
    { id: "traps", label: "Pièges" },
    { id: "collab", label: "Checklist collab" },
    { id: "budget", label: "Budget construction" },
  ];

  const collabScore = Object.values(collabChecked).filter(Boolean).length;

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Garde-fous</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Protocoles de protection — principes, pièges, modes dégradés
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? C.surfaceAlt : "transparent", border: `1px solid ${activeTab === tab.id ? C.borderLight : C.border}`, color: activeTab === tab.id ? C.text : C.textDim, padding: "0.3rem 0.75rem", borderRadius: 6, fontSize: "0.7rem", cursor: "pointer", fontFamily: FONT.mono }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Modes dégradés ── */}
      {activeTab === "modes" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
            <button onClick={() => setAddingMode(true)} style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.3rem 0.75rem", fontSize: "0.68rem", fontFamily: FONT.mono, cursor: "pointer", fontWeight: "bold" }}>+ Nouveau mode</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
            {/* Normal mode */}
            <Card onClick={() => setDegradedMode(null)} style={{ borderLeft: `3px solid ${!degradedMode ? C.green : C.border}`, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                {!degradedMode && <span style={{ color: C.green, fontSize: "0.9rem" }}>●</span>}
                <span style={{ fontFamily: FONT.display, fontSize: "0.95rem", color: !degradedMode ? C.green : C.text }}>Régime normal</span>
              </div>
              <p style={{ fontSize: "0.7rem", color: C.textSoft, margin: 0, lineHeight: 1.5 }}>Rythme soir/week-end standard. Production régulière. Banque d'avance maintenue.</p>
            </Card>

            {degradedModes.map((mode) => {
              const isActive = degradedMode === mode.id;
              return (
                <Card key={mode.id} style={{ borderLeft: `3px solid ${isActive ? mode.color : C.border}`, position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <button onClick={() => setDegradedMode(mode.id)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
                      {isActive && <span style={{ color: mode.color, fontSize: "0.9rem" }}>●</span>}
                      <span style={{ fontFamily: FONT.display, fontSize: "0.95rem", color: isActive ? mode.color : C.text }}>{mode.label}</span>
                    </button>
                    <div style={{ display: "flex", gap: "0.3rem" }}>
                      <button onClick={() => setEditingMode(mode)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.75rem", padding: "0.1rem 0.2rem" }}>✎</button>
                      <button onClick={() => { if (confirm(`Supprimer "${mode.label}" ?`)) removeDegradedMode(mode.id); }} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem", padding: "0.1rem 0.2rem" }}>×</button>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.65rem", color: C.textMuted, margin: "0 0 0.65rem", fontStyle: "italic" }}>{mode.trigger}</p>
                  <SectionTitle accent={C.textDim}>Règles</SectionTitle>
                  <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {mode.rules.map((rule, i) => <li key={i} style={{ fontSize: "0.7rem", color: C.textSoft, lineHeight: 1.45 }}>{rule}</li>)}
                  </ul>
                  <div style={{ marginTop: "0.65rem", padding: "0.4rem 0.5rem", background: `${mode.color}12`, borderRadius: 4, border: `1px solid ${mode.color}30` }}>
                    <p style={{ fontSize: "0.65rem", color: mode.color, margin: 0, fontFamily: FONT.mono }}>→ Sortie : {mode.exit}</p>
                  </div>
                </Card>
              );
            })}
          </div>
          {editingMode && <DegradedModeEditor mode={editingMode} onClose={() => setEditingMode(null)} />}
          {addingMode && <AddModeModal onClose={() => setAddingMode(false)} />}
        </div>
      )}

      {/* ── Principles ── */}
      {activeTab === "principles" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            {principles.map((p) => (
              <Card key={p.n}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: FONT.display, fontSize: "1.4rem", color: C.gold, lineHeight: 1, minWidth: 28, flexShrink: 0 }} title="Identifiant du principe">
                    {p.n}
                  </span>
                  <div style={{ flex: 1 }}>
                    <InlineEdit value={p.text} onSave={(v) => updatePrinciple(p.n, { text: v })} style={{ fontSize: "0.82rem", color: C.text, lineHeight: 1.5, display: "block", marginBottom: (p.note || p.quote) ? "0.4rem" : 0 }} multiline />
                    {p.note !== undefined && (
                      <InlineEdit value={p.note || ""} onSave={(v) => updatePrinciple(p.n, { note: v })} style={{ fontSize: "0.65rem", color: C.textMuted, fontStyle: "italic", lineHeight: 1.4, display: "block", marginBottom: "0.2rem" }} />
                    )}
                    {p.quote !== undefined && (
                      <InlineEdit value={p.quote || ""} onSave={(v) => updatePrinciple(p.n, { quote: v })} style={{ fontSize: "0.7rem", color: C.gold, fontStyle: "italic", fontFamily: FONT.display, display: "block" }} />
                    )}
                  </div>
                  <button onClick={() => { if (confirm(`Supprimer le principe ${p.n} ?`)) removePrinciple(p.n); }} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.85rem", padding: "0.1rem 0.2rem", flexShrink: 0 }}>×</button>
                </div>
              </Card>
            ))}
          </div>
          <button onClick={() => addPrinciple({ n: `${principles.length + 1}`, text: "Nouveau principe", note: "" })} style={{ background: "none", border: `1px dashed ${C.gold}44`, color: C.gold, borderRadius: 6, padding: "0.4rem 1rem", fontSize: "0.68rem", fontFamily: FONT.mono, cursor: "pointer", width: "100%" }}>+ Ajouter un principe</button>
        </div>
      )}

      {/* ── Traps ── */}
      {activeTab === "traps" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            {traps.map((trap, i) => (
              <Card key={trap.id}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: C.red, minWidth: 22, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div style={{ flex: 1 }}>
                    <InlineEdit value={trap.label} onSave={(v) => updateTrap(trap.id, { label: v })} style={{ fontFamily: FONT.mono, fontSize: "0.72rem", color: C.red, letterSpacing: "0.05em", display: "block", marginBottom: "0.35rem" }} />
                    <InlineEdit value={trap.desc} onSave={(v) => updateTrap(trap.id, { desc: v })} style={{ fontSize: "0.75rem", color: C.textSoft, lineHeight: 1.45, display: "block" }} multiline />
                  </div>
                  <button onClick={() => { if (confirm(`Supprimer ce piège ?`)) removeTrap(trap.id); }} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.85rem", padding: "0.1rem 0.2rem", flexShrink: 0 }}>×</button>
                </div>
              </Card>
            ))}
          </div>
          <button onClick={() => addTrap({ id: `trap-${Date.now()}`, label: "Nouveau piège", desc: "Description du piège…" })} style={{ background: "none", border: `1px dashed ${C.red}44`, color: C.red, borderRadius: 6, padding: "0.4rem 1rem", fontSize: "0.68rem", fontFamily: FONT.mono, cursor: "pointer", width: "100%" }}>+ Ajouter un piège</button>
        </div>
      )}

      {/* ── Collab checklist ── */}
      {activeTab === "collab" && (
        <div>
          <Card style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <SectionTitle accent={C.cyan}>Checklist de collaboration</SectionTitle>
              <div style={{ fontFamily: FONT.mono, fontSize: "0.75rem", color: collabScore >= 6 ? C.green : collabScore >= 4 ? C.amber : C.red }}>
                {collabScore}/{collabChecklist.length} {collabScore >= 6 ? "✓ Acceptable" : collabScore >= 4 ? "~ Prudence" : "✗ Revoir"}
              </div>
            </div>
            <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0 0 1rem", fontStyle: "italic" }}>
              Avant toute collaboration, répondre à ces questions. Si moins de 6 oui : décliner ou renégocier.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {collabChecklist.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                  <input type="checkbox" checked={collabChecked[item.id] ?? false} onChange={() => setCollabChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))} style={{ accentColor: C.cyan, marginTop: 3, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <InlineEdit value={item.q} onSave={(v) => updateCollabCheck(item.id, { q: v })} style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.cyan, letterSpacing: "0.08em", display: "block", marginBottom: 2 }} />
                    <InlineEdit value={item.text} onSave={(v) => updateCollabCheck(item.id, { text: v })} style={{ fontSize: "0.75rem", color: collabChecked[item.id] ? C.textDim : C.textSoft, textDecoration: collabChecked[item.id] ? "line-through" : "none", display: "block" }} />
                  </div>
                  <button onClick={() => removeCollabCheck(item.id)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.85rem", padding: "0.1rem 0.2rem", flexShrink: 0 }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button onClick={() => addCollabCheck({ id: `col-${Date.now()}`, q: "Nouveau critère", text: "Question à répondre…" })} style={{ background: "none", border: `1px dashed ${C.cyan}44`, color: C.cyan, borderRadius: 6, padding: "0.3rem 0.75rem", cursor: "pointer", fontSize: "0.65rem", fontFamily: FONT.mono }}>+ Ajouter un critère</button>
              <button onClick={() => setCollabChecked({})} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.3rem 0.75rem", cursor: "pointer", fontSize: "0.65rem", fontFamily: FONT.mono }}>Réinitialiser</button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Build budget ── */}
      {activeTab === "budget" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            {buildBudgets.map((budget, idx) => (
              <Card key={idx} style={{ borderLeft: `3px solid ${budget.color}`, position: "relative" }}>
                <button onClick={() => removeBuildBudget(idx)} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.85rem" }}>×</button>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                  <InlineEdit value={budget.color} onSave={(v) => updateBuildBudget(idx, { color: v })} style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: budget.color, textTransform: "uppercase", letterSpacing: "0.1em" }} />
                  <input type="color" value={budget.color} onChange={(e) => updateBuildBudget(idx, { color: e.target.value })} style={{ width: 20, height: 20, padding: 0, border: "none", background: "none", cursor: "pointer", borderRadius: 3 }} />
                </div>
                <InlineEdit value={budget.phase} onSave={(v) => updateBuildBudget(idx, { phase: v })} style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: budget.color, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.3rem" }} />
                <InlineEdit value={budget.months} onSave={(v) => updateBuildBudget(idx, { months: v })} style={{ fontFamily: FONT.display, fontSize: "0.9rem", color: C.text, display: "block", marginBottom: "0.5rem" }} />
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                  <InlineEdit value={String(budget.maxHours)} onSave={(v) => { const n = parseInt(v); if (!isNaN(n)) updateBuildBudget(idx, { maxHours: n }); }} style={{ fontFamily: FONT.mono, fontSize: "2rem", color: budget.color, fontWeight: "bold", display: "inline" }} />
                  <span style={{ fontSize: "0.7rem", color: C.textMuted }}>h max</span>
                </div>
                <div style={{ fontSize: "0.65rem", color: C.textDim, marginTop: "0.4rem", lineHeight: 1.5 }}>Budget construction max — phase cumulée.</div>
              </Card>
            ))}
            <Card style={{ background: `linear-gradient(135deg, ${C.surface}, #1a0f2e)` }}>
              <SectionTitle accent={C.gold}>Règle d'or</SectionTitle>
              <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FONT.display, lineHeight: 1.6, margin: 0 }}>Tu construis des outils <em>pour</em> créer, pas <em>au lieu de</em> créer.</p>
              <p style={{ fontSize: "0.65rem", color: C.textDim, margin: "0.5rem 0 0", fontFamily: FONT.mono, letterSpacing: "0.08em" }}>PRINCIPE VIII — MÉTHODE UNIFIÉE</p>
            </Card>
          </div>
          <button onClick={() => addBuildBudget({ phase: "Nouvelle phase", months: "Mois X–Y", maxHours: 50, color: "#6B7280" })} style={{ background: "none", border: `1px dashed ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.4rem 1rem", fontSize: "0.68rem", fontFamily: FONT.mono, cursor: "pointer" }}>+ Ajouter un budget</button>
        </div>
      )}
    </div>
  );
}

