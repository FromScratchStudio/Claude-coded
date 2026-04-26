import { useState, useId } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import ProgressBar from "../ui/ProgressBar";
import type { KpiDef } from "../../types";

const ICONS = ["✉", "📬", "💳", "📈", "📚", "🎯", "⭐", "🔥", "🎵", "📷", "🌐", "💡"];

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
  const [icon, setIcon] = useState(initial?.icon ?? "🎯");
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [t3, setT3] = useState(initial?.target3m ?? 0);
  const [t12, setT12] = useState(initial?.target12m ?? 0);
  const [t36, setT36] = useState(initial?.target36m ?? 0);
  const formId = useId();
  const isEdit = !!initial?.key;

  const inputStyle: React.CSSProperties = {
    background: C.surfaceAlt,
    border: `1px solid ${C.border}`,
    color: C.text,
    borderRadius: 6,
    padding: "0.35rem 0.55rem",
    fontSize: "0.75rem",
    fontFamily: FONT.mono,
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.6rem",
    color: C.textDim,
    fontFamily: FONT.mono,
    marginBottom: "0.25rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim() || (!isEdit && !key.trim())) return;
    onSave({
      key: isEdit ? (initial!.key as string) : key.trim().replace(/\s+/g, "_"),
      label: label.trim(),
      icon,
      unit: unit.trim(),
      target3m: t3,
      target12m: t12,
      target36m: t36,
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {!isEdit && (
        <div>
          <label htmlFor={`${formId}-key`} style={labelStyle}>Identifiant</label>
          <input id={`${formId}-key`} value={key} onChange={(e) => setKey(e.target.value)} placeholder="ex: youtube_subs" style={inputStyle} required />
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "0.5rem", alignItems: "end" }}>
        <div>
          <label htmlFor={`${formId}-label`} style={labelStyle}>Libellé</label>
          <input id={`${formId}-label`} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Abonnés YouTube" style={inputStyle} required />
        </div>
        <div>
          <label htmlFor={`${formId}-icon`} style={labelStyle}>Icône</label>
          <select id={`${formId}-icon`} value={icon} onChange={(e) => setIcon(e.target.value)} style={{ ...inputStyle, width: "3rem" }}>
            {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${formId}-unit`} style={labelStyle}>Unité</label>
          <input id={`${formId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="€, %, …" style={inputStyle} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
        {[["3 mois", t3, setT3] as const, ["12 mois", t12, setT12] as const, ["36 mois", t36, setT36] as const].map(([lbl, val, setter]) => (
          <div key={lbl}>
            <label style={labelStyle}>Objectif {lbl}</label>
            <input type="number" min={0} value={val} onChange={(e) => setter(Number(e.target.value))} style={inputStyle} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.3rem 0.75rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.68rem" }}>
          Annuler
        </button>
        <button type="submit" style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.3rem 0.75rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.68rem", fontWeight: "bold" }}>
          {isEdit ? "Enregistrer" : "Créer"}
        </button>
      </div>
    </form>
  );
}

export default function KPIsView() {
  const kpiValues = useStore((s) => s.kpiValues);
  const kpiDefs = useStore((s) => s.kpiDefs);
  const setKpiValue = useStore((s) => s.setKpiValue);
  const addKpiDef = useStore((s) => s.addKpiDef);
  const updateKpiDef = useStore((s) => s.updateKpiDef);
  const removeKpiDef = useStore((s) => s.removeKpiDef);

  const [adding, setAdding] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>KPIs</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Indicateurs clés — objectifs à 3 mois, 12 mois, 36 mois
          </p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditingKey(null); }}
          style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.4rem 0.9rem", fontFamily: FONT.mono, fontSize: "0.68rem", fontWeight: "bold", cursor: "pointer" }}
        >
          + Nouvel indicateur
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <Card style={{ marginBottom: "1.25rem", border: `1px solid ${C.gold}44` }}>
          <div style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.gold, marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Nouvel indicateur
          </div>
          <KpiForm
            onSave={(def) => { addKpiDef(def); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1rem" }}>
        {kpiDefs.map((kpi) => {
          const current = kpiValues[kpi.key] ?? 0;
          const pct3m = kpi.target3m > 0 ? Math.min((current / kpi.target3m) * 100, 100) : 0;
          const pct12m = kpi.target12m > 0 ? Math.min((current / kpi.target12m) * 100, 100) : 0;
          const pct36m = kpi.target36m > 0 ? Math.min((current / kpi.target36m) * 100, 100) : 0;
          const progressColor =
            pct12m >= 80 ? C.green : pct12m >= 40 ? C.amber : pct12m > 0 ? C.orange : C.textDim;

          if (editingKey === kpi.key) {
            return (
              <Card key={kpi.key} style={{ border: `1px solid ${C.gold}44` }}>
                <div style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.gold, marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Modifier — {kpi.label}
                </div>
                <KpiForm
                  initial={kpi}
                  onSave={(updated) => { updateKpiDef(kpi.key, updated); setEditingKey(null); }}
                  onCancel={() => setEditingKey(null)}
                />
              </Card>
            );
          }

          return (
            <Card key={kpi.key} style={{ position: "relative" }}>
              {/* Confirm delete overlay */}
              {confirmDelete === kpi.key && (
                <div style={{ position: "absolute", inset: 0, background: `${C.bg}ee`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", zIndex: 10 }}>
                  <p style={{ color: C.text, fontFamily: FONT.mono, fontSize: "0.72rem", textAlign: "center" }}>
                    Supprimer «{kpi.label}» ?
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => { removeKpiDef(kpi.key); setConfirmDelete(null); }} style={{ background: C.orange, border: "none", color: "#fff", borderRadius: 5, padding: "0.3rem 0.8rem", fontFamily: FONT.mono, fontSize: "0.68rem", cursor: "pointer", fontWeight: "bold" }}>Supprimer</button>
                    <button onClick={() => setConfirmDelete(null)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 5, padding: "0.3rem 0.8rem", fontFamily: FONT.mono, fontSize: "0.68rem", cursor: "pointer" }}>Annuler</button>
                  </div>
                </div>
              )}

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.4rem" }}>{kpi.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT.display, fontSize: "0.9rem", color: C.text }}>{kpi.label}</div>
                </div>
                <div style={{ fontFamily: FONT.mono, fontSize: "1.6rem", color: progressColor, fontWeight: "bold" }}>
                  {current.toLocaleString("fr-FR")}{kpi.unit}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <button onClick={() => { setEditingKey(kpi.key); setAdding(false); }} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.72rem", padding: "0.1rem 0.2rem" }}>✎</button>
                  <button onClick={() => setConfirmDelete(kpi.key)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.78rem", padding: "0.1rem 0.2rem" }}>×</button>
                </div>
              </div>

              {/* Current value input */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Valeur actuelle
                </label>
                <input
                  type="number"
                  min={0}
                  value={current}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!isNaN(v) && v >= 0) setKpiValue(kpi.key, v);
                  }}
                  style={{
                    background: C.surfaceAlt,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                    borderRadius: 6,
                    padding: "0.4rem 0.65rem",
                    fontSize: "0.85rem",
                    fontFamily: FONT.mono,
                    width: "100%",
                  }}
                />
              </div>

              {/* Progress toward targets */}
              <SectionTitle accent={C.textDim}>Objectifs</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {[
                  { label: "3 mois", target: kpi.target3m, pct: pct3m, color: C.cyan },
                  { label: "12 mois", target: kpi.target12m, pct: pct12m, color: C.gold },
                  { label: "36 mois", target: kpi.target36m, pct: pct36m, color: C.violet },
                ].map((obj) => (
                  <div key={obj.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.65rem", color: C.textMuted, fontFamily: FONT.mono }}>{obj.label}</span>
                      <span style={{ fontSize: "0.65rem", color: obj.color, fontFamily: FONT.mono }}>
                        {obj.target > 0
                          ? `${current.toLocaleString("fr-FR")} / ${obj.target.toLocaleString("fr-FR")}${kpi.unit}`
                          : "—"}
                      </span>
                    </div>
                    {obj.target > 0 && (
                      <ProgressBar value={obj.pct} color={obj.color} height={4} showLabel />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {kpiDefs.length === 0 && !adding && (
        <p style={{ textAlign: "center", color: C.textDim, fontSize: "0.8rem", padding: "3rem 0" }}>
          Aucun indicateur défini. Cliquez «&nbsp;Nouvel indicateur&nbsp;» pour commencer.
        </p>
      )}
    </div>
  );
}
