import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import { RINGS } from "../../data/projects";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import RingDonut from "../ui/RingDonut";
import type { QuarterAllocation } from "../../types";

const inputStyle = {
  background: "#0d1118",
  border: `1px solid #1f2535`,
  color: "#e8e4dc",
  borderRadius: 6,
  padding: "0.4rem 0.65rem",
  fontSize: "0.8rem",
  width: "100%",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical" as const,
  lineHeight: 1.5,
};

export default function TrimestreView() {
  const quarter = useStore((s) => s.quarter);
  const updateQuarter = useStore((s) => s.updateQuarter);
  const updateAllocation = useStore((s) => s.updateAllocation);

  const totalAlloc = Object.values(quarter.allocation).reduce((s, v) => s + v, 0);
  const allocOk = totalAlloc === 100;

  const allocationKeys: { key: keyof QuarterAllocation; ring: (typeof RINGS)[0] }[] = [
    { key: "centre", ring: RINGS[0] },
    { key: "ampli", ring: RINGS[1] },
    { key: "collab", ring: RINGS[2] },
    { key: "opt", ring: RINGS[3] },
  ];

  return (
    <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "1fr 1fr" }}>

      {/* ─── Quarter header */}
      <Card style={{ gridColumn: "1 / 3" }}>
        <SectionTitle accent={C.gold}>Planification du trimestre</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Trimestre</label>
            <input value={quarter.q} onChange={(e) => updateQuarter({ q: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ gridColumn: "2 / 4" }}>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>PLP — Produit Livrable Principal</label>
            <input value={quarter.plp} onChange={(e) => updateQuarter({ plp: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Arc narratif</label>
            <input value={quarter.arc} onChange={(e) => updateQuarter({ arc: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ gridColumn: "2 / 4" }}>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Fin d'arc</label>
            <input value={quarter.arcEnd} onChange={(e) => updateQuarter({ arcEnd: e.target.value })} style={inputStyle} />
          </div>
        </div>
      </Card>

      {/* ─── Allocation sliders */}
      <Card>
        <SectionTitle accent={C.gold}>Allocation des anneaux</SectionTitle>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
          <RingDonut rings={RINGS} allocation={quarter.allocation} size={130} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {allocationKeys.map(({ key, ring }) => (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.64rem", color: ring.color }}>{ring.label} — {ring.name}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: ring.color }}>{quarter.allocation[key]}%</span>
                </div>
                <input
                  type="range" min={0} max={100}
                  value={quarter.allocation[key]}
                  onChange={(e) => updateAllocation(key, Number(e.target.value))}
                  style={{ width: "100%", accentColor: ring.color }}
                />
              </div>
            ))}
            <div style={{
              fontFamily: FONT.mono,
              fontSize: "0.65rem",
              padding: "0.35rem 0.5rem",
              borderRadius: 4,
              background: allocOk ? C.greenDark : C.redDark,
              border: `1px solid ${allocOk ? C.green : C.red}44`,
              color: allocOk ? C.green : C.red,
            }}>
              Total : {totalAlloc}% {allocOk ? "✓" : `(écart : ${totalAlloc > 100 ? "+" : ""}${totalAlloc - 100}%)`}
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Context fields */}
      <Card>
        <SectionTitle accent={C.cyan}>Contexte opérationnel</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Amplification (anneau 1)</label>
            <textarea value={quarter.amplification} onChange={(e) => updateQuarter({ amplification: e.target.value })} rows={2} style={textareaStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Outil focal du trimestre</label>
            <input value={quarter.outilFocal} onChange={(e) => updateQuarter({ outilFocal: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Zones rouges (contraintes professionnelles)</label>
            <textarea value={quarter.zonesRouges} onChange={(e) => updateQuarter({ zonesRouges: e.target.value })} rows={2} style={textareaStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Règle unique du trimestre</label>
            <input value={quarter.regleUnique} onChange={(e) => updateQuarter({ regleUnique: e.target.value })} style={inputStyle} />
          </div>
        </div>
      </Card>

      {/* ─── Summary card */}
      <Card style={{ gridColumn: "1 / 3", background: `linear-gradient(135deg, ${C.surface}, ${C.surfaceAlt})` }}>
        <SectionTitle accent={C.gold}>{`Résumé ${quarter.q}`}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.65rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase" }}>PLP</p>
            <p style={{ fontSize: "0.85rem", color: C.text, margin: 0 }}>{quarter.plp}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.65rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase" }}>Arc narratif</p>
            <p style={{ fontSize: "0.85rem", color: C.text, margin: 0 }}>{quarter.arc}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.65rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase" }}>Outil focal</p>
            <p style={{ fontSize: "0.85rem", color: C.cyan, margin: 0 }}>{quarter.outilFocal}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.65rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase" }}>Règle unique</p>
            <p style={{ fontSize: "0.85rem", color: C.amber, margin: 0, fontStyle: "italic" }}>{quarter.regleUnique}</p>
          </div>
        </div>
        {quarter.zonesRouges && (
          <div style={{ marginTop: "0.85rem", padding: "0.5rem 0.75rem", background: C.redDark, borderRadius: 6, border: `1px solid ${C.red}33` }}>
            <p style={{ fontSize: "0.62rem", color: C.red, fontFamily: FONT.mono, margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>⚠ Zones rouges</p>
            <p style={{ fontSize: "0.75rem", color: C.text, margin: 0 }}>{quarter.zonesRouges}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
