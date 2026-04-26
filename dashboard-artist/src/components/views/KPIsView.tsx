import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import { KPI_DEFS } from "../../data/kpis";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import ProgressBar from "../ui/ProgressBar";

export default function KPIsView() {
  const kpiValues = useStore((s) => s.kpiValues);
  const setKpiValue = useStore((s) => s.setKpiValue);

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>KPIs</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Indicateurs clés — objectifs à 3 mois, 12 mois, 36 mois
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1rem" }}>
        {KPI_DEFS.map((kpi) => {
          const current = kpiValues[kpi.key] ?? 0;
          const pct3m = kpi.target3m > 0 ? Math.min((current / kpi.target3m) * 100, 100) : 0;
          const pct12m = kpi.target12m > 0 ? Math.min((current / kpi.target12m) * 100, 100) : 0;
          const pct36m = kpi.target36m > 0 ? Math.min((current / kpi.target36m) * 100, 100) : 0;

          // Color based on 12m progress
          const progressColor =
            pct12m >= 80 ? C.green : pct12m >= 40 ? C.amber : pct12m > 0 ? C.orange : C.textDim;

          return (
            <Card key={kpi.key}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.4rem" }}>{kpi.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT.display, fontSize: "0.9rem", color: C.text }}>{kpi.label}</div>
                </div>
                <div style={{ fontFamily: FONT.mono, fontSize: "1.6rem", color: progressColor, fontWeight: "bold" }}>
                  {current.toLocaleString("fr-FR")}{kpi.unit}
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
    </div>
  );
}
