import { useState, useId } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import type { KpiDef } from "../../types";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import ProgressBar from "../ui/ProgressBar";

const ICONS = ["📈", "👥", "⭐", "🔄", "💳", "💰", "🎯", "🔥", "📊", "📉", "✉", "🌐"];

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
    padding: "0.25rem 0.65rem",
    fontSize: "0.65rem",
    fontFamily: FONT.mono,
    cursor: "pointer",
  };
}

function KpiForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<KpiDef>;
  onSave: (def: KpiDef) => void;
  onCancel: () => void;
}) {
  const [key, setKey] = useState(initial?.key ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "📈");
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [t3, setT3] = useState(initial?.target3m ?? 0);
  const [t12, setT12] = useState(initial?.target12m ?? 0);
  const [t36, setT36] = useState(initial?.target36m ?? 0);
  const fid = useId();
  const isEdit = !!initial?.key;

  function save() {
    if (!key.trim() || !label.trim()) return;
    onSave({ key: key.trim(), label: label.trim(), icon, unit: unit.trim(), target3m: t3, target12m: t12, target36m: t36 });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {!isEdit && (
        <div>
          <label htmlFor={`${fid}-key`} style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: "0.2rem" }}>Key (unique ID) *</label>
          <input id={`${fid}-key`} value={key} onChange={(e) => setKey(e.target.value.replace(/\s/g, "_"))} placeholder="e.g. mrr" style={iStyle} />
        </div>
      )}
      <div>
        <label style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: "0.2rem" }}>Label *</label>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Monthly Revenue" style={iStyle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <div>
          <label style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: "0.2rem" }}>Icon</label>
          <select value={icon} onChange={(e) => setIcon(e.target.value)} style={{ ...iStyle, cursor: "pointer" }}>
            {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: "0.2rem" }}>Unit</label>
          <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="€, %, ..." style={iStyle} />
        </div>
        <div>
          <label style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: "0.2rem" }}>Target 3m</label>
          <input type="number" value={t3} onChange={(e) => setT3(Number(e.target.value))} style={iStyle} />
        </div>
        <div>
          <label style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: "0.2rem" }}>Target 12m</label>
          <input type="number" value={t12} onChange={(e) => setT12(Number(e.target.value))} style={iStyle} />
        </div>
        <div>
          <label style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: "0.2rem" }}>Target 36m</label>
          <input type="number" value={t36} onChange={(e) => setT36(Number(e.target.value))} style={iStyle} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={save} style={btn(C.green)}>✓ Save</button>
        <button onClick={onCancel} style={btn(C.textDim)}>Cancel</button>
      </div>
    </div>
  );
}

function colorFor(pct: number) {
  if (pct >= 100) return C.green;
  if (pct >= 60) return C.amber;
  if (pct >= 30) return C.orange;
  return C.red;
}

export default function KPIsView() {
  const kpiDefs = useStore((s) => s.kpiDefs);
  const kpiValues = useStore((s) => s.kpiValues);
  const setKpiValue = useStore((s) => s.setKpiValue);
  const addKpiDef = useStore((s) => s.addKpiDef);
  const updateKpiDef = useStore((s) => s.updateKpiDef);
  const removeKpiDef = useStore((s) => s.removeKpiDef);

  const [adding, setAdding] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>KPIs</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Track metrics against 3-month, 12-month, and 36-month targets
          </p>
        </div>
        <button onClick={() => setAdding(true)} style={btn(C.gold)}>+ New Indicator</button>
      </div>

      {adding && (
        <Card style={{ marginBottom: "1rem" }}>
          <SectionTitle accent={C.gold}>New KPI</SectionTitle>
          <KpiForm
            onSave={(def) => { addKpiDef(def); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {kpiDefs.map((def) => {
          const val = kpiValues[def.key] ?? 0;
          const pct3 = def.target3m > 0 ? Math.min(100, Math.round((val / def.target3m) * 100)) : 0;
          const pct12 = def.target12m > 0 ? Math.min(100, Math.round((val / def.target12m) * 100)) : 0;
          const pct36 = def.target36m > 0 ? Math.min(100, Math.round((val / def.target36m) * 100)) : 0;
          const col = colorFor(pct3);

          return (
            <Card key={def.key}>
              {editingKey === def.key ? (
                <>
                  <SectionTitle accent={C.gold}>{def.icon} Edit — {def.label}</SectionTitle>
                  <KpiForm
                    initial={def}
                    onSave={(updated) => { updateKpiDef(def.key, updated); setEditingKey(null); }}
                    onCancel={() => setEditingKey(null)}
                  />
                </>
              ) : (
                <>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.1rem" }}>{def.icon}</span>
                      <span style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.text, fontWeight: 500 }}>{def.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button onClick={() => setEditingKey(def.key)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.75rem" }}>✎</button>
                      {confirmDelete === def.key ? (
                        <>
                          <button onClick={() => { removeKpiDef(def.key); setConfirmDelete(null); }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.62rem", fontFamily: FONT.mono }}>Del</button>
                          <button onClick={() => setConfirmDelete(null)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.62rem", fontFamily: FONT.mono }}>×</button>
                        </>
                      ) : (
                        <button onClick={() => setConfirmDelete(def.key)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
                      )}
                    </div>
                  </div>

                  {/* Current value */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.textDim, flexShrink: 0 }}>Current</span>
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => setKpiValue(def.key, Number(e.target.value))}
                      style={{ ...iStyle, width: 100, fontFamily: FONT.mono, fontSize: "0.9rem", color: col, fontWeight: "bold" }}
                    />
                    <span style={{ fontFamily: FONT.mono, fontSize: "0.75rem", color: C.textDim }}>{def.unit}</span>
                  </div>

                  {/* Progress bars */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {[
                      { label: "3m", pct: pct3, target: def.target3m },
                      { label: "12m", pct: pct12, target: def.target12m },
                      { label: "36m", pct: pct36, target: def.target36m },
                    ].map(({ label, pct, target }) => (
                      <div key={label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                          <span style={{ fontFamily: FONT.mono, fontSize: "0.58rem", color: C.textDim }}>{label} target</span>
                          <span style={{ fontFamily: FONT.mono, fontSize: "0.58rem", color: C.textDim }}>
                            {target.toLocaleString()}{def.unit} · {pct}%
                          </span>
                        </div>
                        <ProgressBar value={pct} color={colorFor(pct)} height={4} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          );
        })}

        {kpiDefs.length === 0 && !adding && (
          <div style={{ color: C.textVeryDim, fontFamily: FONT.mono, fontSize: "0.75rem", padding: "1rem" }}>
            No KPIs defined yet. Add your first indicator.
          </div>
        )}
      </div>
    </div>
  );
}
