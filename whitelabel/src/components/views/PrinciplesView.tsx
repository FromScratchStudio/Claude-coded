import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import type { Principle } from "../../types";
import Card from "../ui/Card";

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

// ─── Principle form ───────────────────────────────────────────────────────────
function PrincipleForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Principle>;
  onSave: (p: Principle) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? "#f59e0b");
  const [trigger, setTrigger] = useState(initial?.trigger ?? "");
  const [exit, setExit] = useState(initial?.exit ?? "");

  function save() {
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? `pn-${Date.now()}`,
      name: name.trim(),
      color,
      trigger: trigger.trim(),
      rules: initial?.rules ?? [],
      exit: exit.trim(),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Principle name *" style={{ ...iStyle, flex: 1 }} autoFocus />
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim }}>Color</span>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 32, height: 28, border: "none", background: "none", cursor: "pointer" }} />
        </div>
      </div>
      <textarea value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="Trigger condition — when is this activated?" rows={2} style={{ ...iStyle, resize: "vertical" }} />
      <textarea value={exit} onChange={(e) => setExit(e.target.value)} placeholder="Exit condition — when does this end?" rows={2} style={{ ...iStyle, resize: "vertical" }} />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={save} style={btn(C.green)}>✓ Save</button>
        <button onClick={onCancel} style={btn(C.textDim)}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Rule editor within a principle ──────────────────────────────────────────
function RuleEditor({ principleId }: { principleId: string }) {
  const principle = useStore((s) => s.principles.find((p) => p.id === principleId));
  const addPrincipleRule = useStore((s) => s.addPrincipleRule);
  const updatePrincipleRule = useStore((s) => s.updatePrincipleRule);
  const removePrincipleRule = useStore((s) => s.removePrincipleRule);

  const [newRule, setNewRule] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  if (!principle) return null;

  function addRule() {
    if (!newRule.trim()) return;
    addPrincipleRule(principleId, newRule.trim());
    setNewRule("");
  }

  return (
    <div>
      <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: principle.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Rules ({principle.rules.length})
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.5rem" }}>
        {principle.rules.map((rule, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
            <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: principle.color, flexShrink: 0, marginTop: "0.1rem" }}>{i + 1}.</span>
            {editingIdx === i ? (
              <>
                <input
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { updatePrincipleRule(principleId, i, editDraft.trim()); setEditingIdx(null); }
                    if (e.key === "Escape") setEditingIdx(null);
                  }}
                  onBlur={() => { if (editDraft.trim()) updatePrincipleRule(principleId, i, editDraft.trim()); setEditingIdx(null); }}
                  autoFocus
                  style={{ ...iStyle, flex: 1, fontSize: "0.73rem" }}
                />
              </>
            ) : (
              <>
                <span style={{ flex: 1, fontSize: "0.73rem", color: C.textSoft, fontFamily: FONT.body, lineHeight: 1.45 }}>{rule}</span>
                <button onClick={() => { setEditDraft(rule); setEditingIdx(i); }} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.65rem", flexShrink: 0 }}>✎</button>
                <button onClick={() => removePrincipleRule(principleId, i)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.75rem", flexShrink: 0 }}>×</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <input
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addRule(); }}
          placeholder="Add a rule…"
          style={{ ...iStyle, flex: 1, fontSize: "0.72rem", border: `1px solid ${principle.color}44` }}
        />
        <button onClick={addRule} style={{ background: principle.color, color: "#000", border: "none", borderRadius: 4, padding: "0.2rem 0.5rem", fontFamily: FONT.mono, fontSize: "0.6rem", cursor: "pointer", fontWeight: "bold" }}>
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function PrinciplesView() {
  const principles = useStore((s) => s.principles);
  const addPrinciple = useStore((s) => s.addPrinciple);
  const updatePrinciple = useStore((s) => s.updatePrinciple);
  const removePrinciple = useStore((s) => s.removePrinciple);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Principles</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Operational safeguards — define how to behave under specific conditions
          </p>
        </div>
        <button onClick={() => setAdding(true)} style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}44`, color: C.gold, borderRadius: 5, padding: "0.25rem 0.65rem", fontSize: "0.65rem", fontFamily: FONT.mono, cursor: "pointer" }}>
          + Add Principle
        </button>
      </div>

      {adding && (
        <Card style={{ marginBottom: "1rem" }}>
          <PrincipleForm
            onSave={(p) => { addPrinciple(p); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
        {principles.map((p) => (
          <Card key={p.id} style={{ borderLeft: `3px solid ${p.color}` }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                <span style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>{p.name}</span>
              </div>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <button onClick={() => setEditingId(editingId === p.id ? null : p.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.75rem" }}>✎</button>
                {confirmDelete === p.id ? (
                  <>
                    <button onClick={() => { removePrinciple(p.id); setConfirmDelete(null); }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.62rem", fontFamily: FONT.mono }}>Del</button>
                    <button onClick={() => setConfirmDelete(null)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.62rem", fontFamily: FONT.mono }}>×</button>
                  </>
                ) : (
                  <button onClick={() => setConfirmDelete(p.id)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
                )}
              </div>
            </div>

            {/* Edit form */}
            {editingId === p.id ? (
              <PrincipleForm
                initial={p}
                onSave={(updated) => { updatePrinciple(p.id, updated); setEditingId(null); }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                {/* Trigger */}
                <div style={{ marginBottom: "0.85rem" }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: p.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Trigger</div>
                  <p style={{ fontSize: "0.75rem", color: C.textSoft, fontFamily: FONT.body, lineHeight: 1.55, margin: 0 }}>{p.trigger || <span style={{ color: C.textVeryDim, fontStyle: "italic" }}>Not set</span>}</p>
                </div>

                {/* Rules */}
                <div style={{ marginBottom: "0.85rem" }}>
                  <RuleEditor principleId={p.id} />
                </div>

                {/* Exit */}
                <div style={{ padding: "0.6rem 0.75rem", background: `${p.color}12`, border: `1px solid ${p.color}25`, borderRadius: 6 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: p.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Exit Condition</div>
                  <p style={{ fontSize: "0.73rem", color: C.textSoft, fontFamily: FONT.body, lineHeight: 1.5, margin: 0 }}>{p.exit || <span style={{ color: C.textVeryDim, fontStyle: "italic" }}>Not set</span>}</p>
                </div>
              </>
            )}
          </Card>
        ))}

        {principles.length === 0 && !adding && (
          <div style={{ color: C.textVeryDim, fontFamily: FONT.mono, fontSize: "0.75rem", padding: "1rem" }}>
            No principles defined. Add your first operational safeguard.
          </div>
        )}
      </div>
    </div>
  );
}
