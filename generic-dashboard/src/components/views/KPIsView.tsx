import { useState } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { ProgressBar } from "../ui/ProgressBar";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import type { KpiDef } from "../../types";

export default function KPIsView() {
  const kpiDefs = useStore((s) => s.kpiDefs);
  const kpiValues = useStore((s) => s.kpiValues);
  const setKpiValue = useStore((s) => s.setKpiValue);
  const addKpiDef = useStore((s) => s.addKpiDef);
  const updateKpiDef = useStore((s) => s.updateKpiDef);
  const removeKpiDef = useStore((s) => s.removeKpiDef);

  const [showModal, setShowModal] = useState(false);
  const [editKpi, setEditKpi] = useState<KpiDef | null>(null);

  const [kLabel, setKLabel] = useState("");
  const [kKey, setKKey] = useState("");
  const [kUnit, setKUnit] = useState("");
  const [kIcon, setKIcon] = useState("");
  const [kCategory, setKCategory] = useState("");
  const [kTarget3m, setKTarget3m] = useState(0);
  const [kTarget12m, setKTarget12m] = useState(0);
  const [kTarget36m, setKTarget36m] = useState(0);

  function openNew() {
    setEditKpi(null);
    setKLabel("");
    setKKey("");
    setKUnit("");
    setKIcon("📊");
    setKCategory("General");
    setKTarget3m(0);
    setKTarget12m(0);
    setKTarget36m(0);
    setShowModal(true);
  }

  function openEdit(kpi: KpiDef) {
    setEditKpi(kpi);
    setKLabel(kpi.label);
    setKKey(kpi.key);
    setKUnit(kpi.unit);
    setKIcon(kpi.icon);
    setKCategory(kpi.category);
    setKTarget3m(kpi.target3m);
    setKTarget12m(kpi.target12m);
    setKTarget36m(kpi.target36m);
    setShowModal(true);
  }

  function save() {
    if (!kLabel.trim() || !kKey.trim()) return;
    if (editKpi) {
      updateKpiDef(editKpi.key, {
        label: kLabel.trim(),
        unit: kUnit.trim(),
        icon: kIcon.trim() || "📊",
        category: kCategory.trim(),
        target3m: kTarget3m,
        target12m: kTarget12m,
        target36m: kTarget36m,
      });
    } else {
      addKpiDef({
        key: kKey.trim().toLowerCase().replace(/\s+/g, "_"),
        label: kLabel.trim(),
        unit: kUnit.trim(),
        icon: kIcon.trim() || "📊",
        category: kCategory.trim() || "General",
        target3m: kTarget3m,
        target12m: kTarget12m,
        target36m: kTarget36m,
      });
    }
    setShowModal(false);
  }

  // Group by category
  const categories = [...new Set(kpiDefs.map((k) => k.category))];

  return (
    <div>
      <SectionTitle
        sub={`${kpiDefs.length} indicators defined`}
        action={
          <button onClick={openNew} style={{ ...btnPrimary, fontSize: "0.8rem" }}>
            + KPI
          </button>
        }
      >
        Key Performance Indicators
      </SectionTitle>

      {categories.map((category) => {
        const kpis = kpiDefs.filter((k) => k.category === category);
        return (
          <div key={category} style={{ marginBottom: "2rem" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: C.textMuted,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
                borderBottom: `1px solid ${C.border}`,
                paddingBottom: "0.4rem",
              }}
            >
              {category}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              {kpis.map((kpi) => {
                const current = kpiValues[kpi.key] ?? 0;
                const pct3m = Math.min(100, kpi.target3m > 0 ? Math.round((current / kpi.target3m) * 100) : 0);
                const pct12m = Math.min(100, kpi.target12m > 0 ? Math.round((current / kpi.target12m) * 100) : 0);
                const pct36m = Math.min(100, kpi.target36m > 0 ? Math.round((current / kpi.target36m) * 100) : 0);
                const color =
                  pct12m >= 80 ? C.green : pct12m >= 40 ? C.amber : pct12m > 0 ? C.orange : C.textDim;

                return (
                  <div
                    key={kpi.key}
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: "1.25rem",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "1.3rem" }}>{kpi.icon}</span>
                        <div>
                          <div style={{ fontSize: "0.88rem", color: C.text, fontWeight: 600 }}>
                            {kpi.label}
                          </div>
                          {kpi.unit && (
                            <div style={{ fontSize: "0.72rem", color: C.textDim }}>
                              {kpi.unit}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => openEdit(kpi)}
                        style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.78rem" }}
                      >
                        Edit
                      </button>
                    </div>

                    {/* Current value input */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: "1rem",
                      }}
                    >
                      <span style={{ fontSize: "2rem", fontWeight: 700, color }}>
                        {current.toLocaleString()}
                      </span>
                      {kpi.unit && (
                        <span style={{ fontSize: "0.9rem", color: C.textMuted }}>{kpi.unit}</span>
                      )}
                      <input
                        type="number"
                        min={0}
                        value={current}
                        onChange={(e) => setKpiValue(kpi.key, Math.max(0, Number(e.target.value)))}
                        style={{
                          marginLeft: "auto",
                          width: 80,
                          background: C.surfaceAlt,
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          color: C.text,
                          padding: "0.35rem 0.5rem",
                          fontSize: "0.85rem",
                          outline: "none",
                        }}
                      />
                    </div>

                    {/* Progress bars */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { label: "3m", pct: pct3m, target: kpi.target3m },
                        { label: "12m", pct: pct12m, target: kpi.target12m },
                        { label: "36m", pct: pct36m, target: kpi.target36m },
                      ].map(({ label, pct, target }) => (
                        <div key={label}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 3,
                              fontSize: "0.72rem",
                              color: C.textDim,
                            }}
                          >
                            <span>Target {label}</span>
                            <span>
                              {target.toLocaleString()}
                              {kpi.unit ? ` ${kpi.unit}` : ""} · {pct}%
                            </span>
                          </div>
                          <ProgressBar
                            value={pct}
                            color={pct >= 80 ? C.green : pct >= 40 ? C.amber : C.orange}
                            height={5}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {kpiDefs.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: C.textDim }}>
          <p>No KPIs defined yet.</p>
          <button onClick={openNew} style={{ ...btnPrimary, marginTop: "0.5rem" }}>
            Add your first KPI
          </button>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editKpi ? "Edit KPI" : "New KPI"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Label</label>
            <input value={kLabel} onChange={(e) => setKLabel(e.target.value)} style={inputStyle} placeholder="Revenue" autoFocus />
          </div>
          <div>
            <label style={labelStyle}>Key (unique id)</label>
            <input value={kKey} onChange={(e) => setKKey(e.target.value)} style={inputStyle} placeholder="revenue" disabled={!!editKpi} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Unit</label>
            <input value={kUnit} onChange={(e) => setKUnit(e.target.value)} style={inputStyle} placeholder="€, users, %" />
          </div>
          <div>
            <label style={labelStyle}>Icon (emoji)</label>
            <input value={kIcon} onChange={(e) => setKIcon(e.target.value)} style={inputStyle} placeholder="💰" maxLength={4} />
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Category</label>
          <input value={kCategory} onChange={(e) => setKCategory(e.target.value)} style={inputStyle} placeholder="Financial, Growth, Quality…" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          {[
            { label: "Target 3m", val: kTarget3m, set: setKTarget3m },
            { label: "Target 12m", val: kTarget12m, set: setKTarget12m },
            { label: "Target 36m", val: kTarget36m, set: setKTarget36m },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label style={labelStyle}>{label}</label>
              <input
                type="number"
                min={0}
                value={val}
                onChange={(e) => set(Math.max(0, Number(e.target.value)))}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editKpi && (
            <button onClick={() => { removeKpiDef(editKpi.key); setShowModal(false); }} style={btnDanger}>
              Delete
            </button>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={save} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
