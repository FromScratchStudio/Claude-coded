import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import ProgressBar from "../ui/ProgressBar";

function MetricSlider({
  label,
  value,
  color,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.textDim, width: 90, flexShrink: 0 }}>
        {label}
      </span>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: color }}
      />
      <span
        style={{
          fontFamily: FONT.mono,
          fontSize: "1rem",
          color,
          fontWeight: "bold",
          width: 28,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function DashboardView() {
  const settings = useStore((s) => s.settings);
  const energy = useStore((s) => s.energy);
  const focus = useStore((s) => s.focus);
  const momentum = useStore((s) => s.momentum);
  const setEnergy = useStore((s) => s.setEnergy);
  const setFocus = useStore((s) => s.setFocus);
  const setMomentum = useStore((s) => s.setMomentum);
  const projects = useStore((s) => s.projects);
  const pipelineItems = useStore((s) => s.pipelineItems);
  const ideas = useStore((s) => s.ideas);
  const kpiDefs = useStore((s) => s.kpiDefs);
  const kpiValues = useStore((s) => s.kpiValues);
  const phases = useStore((s) => s.phases);
  const categories = useStore((s) => s.categories);
  const setActiveView = useStore((s) => s.setActiveView);

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const inProgressItems = pipelineItems.length;
  const openIdeas = ideas.filter((i) => i.stage !== "selected").length;

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.4rem", color: C.text, margin: 0 }}>
          {settings.name}
        </h2>
        <p style={{ fontSize: "0.72rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          {settings.tagline}
        </p>
      </div>

      {/* Health check */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
        <Card>
          <SectionTitle accent={C.green}>Health Check</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <MetricSlider label="Energy" value={energy} color={C.green} onChange={setEnergy} />
            <MetricSlider label="Focus" value={focus} color={C.cyan} onChange={setFocus} />
            <MetricSlider label="Momentum" value={momentum} color={C.amber} onChange={setMomentum} />
          </div>
        </Card>

        {/* At a glance */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {[
            { label: "Active Projects", value: activeProjects, color: C.green, view: "projects" as const },
            { label: "Pipeline Items", value: inProgressItems, color: C.cyan, view: "pipeline" as const },
            { label: "Open Ideas", value: openIdeas, color: C.amber, view: "ideas" as const },
            { label: "KPIs Tracked", value: kpiDefs.length, color: C.violet, view: "kpis" as const },
          ].map(({ label, value, color, view }) => (
            <Card key={label} onClick={() => setActiveView(view)}>
              <div style={{ fontFamily: FONT.mono, fontSize: "1.6rem", color, fontWeight: "bold" }}>{value}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, marginTop: "0.3rem", letterSpacing: "0.08em" }}>
                {label}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Phase progress */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
        <Card>
          <SectionTitle accent={settings.accentColor}>Roadmap Progress</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {phases.map((phase) => {
              const total = phase.tasks.length;
              const done = phase.tasks.filter((t) => t.done).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={phase.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.68rem", color: phase.accent, fontFamily: FONT.mono }}>
                      {phase.label} — {phase.name}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: phase.accent, fontFamily: FONT.mono }}>
                      {done}/{total}
                    </span>
                  </div>
                  <ProgressBar value={pct} color={phase.accent} height={5} />
                </div>
              );
            })}
            {phases.length === 0 && (
              <p style={{ fontSize: "0.75rem", color: C.textVeryDim, fontFamily: FONT.mono }}>
                No phases defined yet.
              </p>
            )}
          </div>
        </Card>

        {/* Category allocation */}
        <Card>
          <SectionTitle accent={settings.accentColor}>Category Allocation</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {categories.map((cat) => (
              <div key={cat.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "0.68rem", color: cat.color, fontFamily: FONT.mono }}>
                    {cat.label} — {cat.name}
                  </span>
                  <span style={{ fontSize: "0.68rem", color: cat.color, fontFamily: FONT.mono }}>{cat.pct}%</span>
                </div>
                <ProgressBar value={cat.pct} color={cat.color} height={5} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* KPI snapshot */}
      <Card>
        <SectionTitle accent={settings.accentColor}>KPI Snapshot</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
          {kpiDefs.slice(0, 5).map((def) => {
            const val = kpiValues[def.key] ?? 0;
            const pct = def.target3m > 0 ? Math.min(100, Math.round((val / def.target3m) * 100)) : 0;
            const color = pct >= 100 ? C.green : pct >= 60 ? C.amber : C.red;
            return (
              <div key={def.key} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "1rem" }}>{def.icon}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.textDim }}>{def.label}</span>
                </div>
                <div style={{ fontFamily: FONT.mono, fontSize: "1.1rem", color, fontWeight: "bold" }}>
                  {val.toLocaleString()}{def.unit}
                </div>
                <div style={{ fontSize: "0.58rem", color: C.textVeryDim, fontFamily: FONT.mono }}>
                  3m target: {def.target3m.toLocaleString()}{def.unit}
                </div>
                <ProgressBar value={pct} color={color} height={4} />
              </div>
            );
          })}
          {kpiDefs.length === 0 && (
            <p style={{ fontSize: "0.75rem", color: C.textVeryDim, fontFamily: FONT.mono }}>
              No KPIs defined yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
