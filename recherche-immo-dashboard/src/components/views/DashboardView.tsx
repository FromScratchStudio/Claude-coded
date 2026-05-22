import { useStore } from "../../store/useStore";
import { C, FONT, styleCard } from "../../theme";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { SectionTitle } from "../ui/SectionTitle";
import { RingDonut } from "../ui/RingDonut";
import { ProgressBar } from "../ui/ProgressBar";
import { Card } from "../ui/Card";

export default function DashboardView() {
  const appConfig = useStore((s) => s.appConfig);
  const energy = useStore((s) => s.energy);
  const satisfaction = useStore((s) => s.satisfaction);
  const daysOut = useStore((s) => s.daysOut);
  const utWeek = useStore((s) => s.utWeek);
  const operationalMode = useStore((s) => s.operationalMode);
  const operationalModes = useStore((s) => s.operationalModes);
  const phases = useStore((s) => s.phases);
  const projects = useStore((s) => s.projects);
  const kpiDefs = useStore((s) => s.kpiDefs);
  const kpiValues = useStore((s) => s.kpiValues);
  const quarter = useStore((s) => s.quarter);
  const principles = useStore((s) => s.principles);
  const setEnergy = useStore((s) => s.setEnergy);
  const setSatisfaction = useStore((s) => s.setSatisfaction);
  const setDaysOut = useStore((s) => s.setDaysOut);
  const setUtWeek = useStore((s) => s.setUtWeek);
  const setOperationalMode = useStore((s) => s.setOperationalMode);
  const setActiveView = useStore((s) => s.setActiveView);

  // Allocation rings data
  const rings = appConfig.rings;
  const ringSegments = rings.map((ring) => ({
    id: ring.id,
    label: ring.label,
    pct: ring.defaultPct,
    color: ring.color,
  }));



  // Phase progress
  const totalTasks = phases.reduce((s, p) => s + p.tasks.length, 0);
  const doneTasks = phases.reduce((s, p) => s + p.tasks.filter((t) => t.done).length, 0);
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Weekly UT tracker
  const totalUt = utWeek.reduce((a, b) => a + b, 0);
  const target = appConfig.weeklyTimeUnitTarget;
  const utPct = Math.min(100, Math.round((totalUt / target) * 100));

  // Top KPIs (max 3 for dashboard widget)
  const topKpis = kpiDefs.slice(0, 3);

  // Current mode
  const currentMode = operationalModes.find((m) => m.id === operationalMode);

  // Random principle quote
  const quotePrinciple = principles.find((p) => p.quote) ?? principles[0];

  // Active projects
  const activeProjects = projects.filter((p) => p.status === "active").slice(0, 4);

  const { isMobile, isTablet } = useBreakpoint();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.6rem", color: C.text, margin: 0 }}>
          {appConfig.appName}
        </h2>
        <p style={{ color: C.textMuted, fontSize: "0.88rem", marginTop: 4 }}>
          {appConfig.appTagline} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Row 1: Metrics + Donut + Mode */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {/* Wellness metrics */}
        <Card style={{ gridColumn: "span 1" }}>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.textDim,
              marginBottom: "1rem",
            }}
          >
            Weekly State
          </div>
          {[
            { label: appConfig.energyLabel, value: energy, set: setEnergy, color: "#10b981" },
            { label: appConfig.satisfactionLabel, value: satisfaction, set: setSatisfaction, color: C.accent },
          ].map(({ label, value, set, color }) => (
            <div key={label} style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  fontSize: "0.8rem",
                }}
              >
                <span style={{ color: C.textSoft }}>{label}</span>
                <span style={{ color, fontWeight: 600 }}>{value}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                style={{ width: "100%", accentColor: color }}
              />
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: C.textSoft }}>{appConfig.capacityLabel}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setDaysOut(Math.max(0, daysOut - 1))}
                style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, width: 24, height: 24, borderRadius: 4, cursor: "pointer", fontSize: "0.9rem" }}
              >−</button>
              <span style={{ color: C.amber, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{daysOut}</span>
              <button
                onClick={() => setDaysOut(daysOut + 1)}
                style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, width: 24, height: 24, borderRadius: 4, cursor: "pointer", fontSize: "0.9rem" }}
              >+</button>
            </div>
          </div>
        </Card>

        {/* Allocation donut */}
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.textDim,
              marginBottom: "0.75rem",
              alignSelf: "flex-start",
            }}
          >
            Allocation
          </div>
          <RingDonut
            segments={ringSegments}
            size={120}
            strokeWidth={14}
            centerLabel={`${activeProjects.length}`}
            centerSub="active"
          />
        </Card>

        {/* Operational mode selector */}
        <Card>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.textDim,
              marginBottom: "0.75rem",
            }}
          >
            Operational Mode
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {operationalModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() =>
                  setOperationalMode(operationalMode === mode.id ? null : mode.id)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0.45rem 0.75rem",
                  borderRadius: 6,
                  background:
                    operationalMode === mode.id ? `${mode.color}20` : C.surfaceAlt,
                  border: `1px solid ${operationalMode === mode.id ? mode.color + "60" : C.border}`,
                  color: operationalMode === mode.id ? mode.color : C.textSoft,
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: mode.color,
                    flexShrink: 0,
                  }}
                />
                {mode.label}
              </button>
            ))}
          </div>
          {currentMode && (
            <div
              style={{
                marginTop: "0.75rem",
                fontSize: "0.75rem",
                color: C.textMuted,
                borderTop: `1px solid ${C.border}`,
                paddingTop: "0.5rem",
              }}
            >
              {currentMode.rules[0]}
            </div>
          )}
        </Card>
      </div>

      {/* Row 2: UT tracker + Phase progress + Quarter */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {/* UT tracker */}
        <Card>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.textDim,
              marginBottom: "0.75rem",
            }}
          >
            {appConfig.timeUnitPluralLabel} this week
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 700, color: C.accent }}>
              {totalUt}
            </span>
            <span style={{ color: C.textDim, fontSize: "0.85rem", alignSelf: "flex-end" }}>
              / {target} {appConfig.timeUnitPluralLabel}
            </span>
          </div>
          <ProgressBar value={utPct} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 4,
              marginTop: "0.75rem",
            }}
          >
            {utWeek.map((val, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: C.textDim,
                    textAlign: "center",
                    marginBottom: 2,
                  }}
                >
                  W{i + 1}
                </div>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={val}
                  onChange={(e) => {
                    const v = Math.max(0, Number(e.target.value));
                    setUtWeek((prev) => {
                      const next = [...prev] as [number, number, number, number];
                      next[i] = v;
                      return next;
                    });
                  }}
                  style={{
                    width: "100%",
                    background: C.surfaceAlt,
                    border: `1px solid ${C.border}`,
                    borderRadius: 4,
                    color: C.text,
                    fontSize: "0.85rem",
                    textAlign: "center",
                    padding: "3px 0",
                    outline: "none",
                  }}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Phase progress */}
        <Card>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.textDim,
              marginBottom: "0.75rem",
            }}
          >
            Roadmap Progress
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: C.green, marginBottom: 4 }}>
            {overallProgress}%
          </div>
          <ProgressBar value={overallProgress} color={C.green} />
          <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: 6 }}>
            {phases.map((phase) => {
              const total = phase.tasks.length;
              const done = phase.tasks.filter((t) => t.done).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={phase.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 28,
                      fontSize: "0.7rem",
                      color: phase.accent,
                      fontFamily: FONT.mono,
                      flexShrink: 0,
                    }}
                  >
                    {phase.label}
                  </span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar value={pct} color={phase.accent} height={4} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: C.textDim,
                      width: 28,
                      textAlign: "right",
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quarter goal */}
        <Card>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.textDim,
              marginBottom: "0.75rem",
            }}
          >
            {quarter.q}
          </div>
          <div
            style={{
              fontSize: "0.88rem",
              color: C.text,
              fontWeight: 600,
              marginBottom: "0.5rem",
              lineHeight: 1.4,
            }}
          >
            {quarter.goal || "No goal set"}
          </div>
          {quarter.theme && (
            <div
              style={{
                fontSize: "0.78rem",
                color: C.textMuted,
                fontStyle: "italic",
                marginBottom: "0.75rem",
              }}
            >
              "{quarter.theme}"
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {appConfig.allocationCategories.map((cat) => {
              const pct = quarter.allocation[cat.id] ?? 0;
              return (
                <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.72rem", color: C.textMuted, width: 80, flexShrink: 0 }}>
                    {cat.label}
                  </span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar value={pct} color={cat.color} height={4} />
                  </div>
                  <span style={{ fontSize: "0.7rem", color: C.textDim, width: 28, textAlign: "right" }}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
          {quarter.singleRule && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.5rem 0.75rem",
                background: C.surfaceAlt,
                borderRadius: 6,
                fontSize: "0.78rem",
                color: C.textSoft,
                borderLeft: `3px solid ${C.accent}`,
              }}
            >
              {quarter.singleRule}
            </div>
          )}
        </Card>
      </div>

      {/* Row 3: KPIs + Active projects + Principle */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "2fr 2fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {/* KPI summary */}
        <Card>
          <SectionTitle
            action={
              <button
                onClick={() => setActiveView("kpis")}
                style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: "0.78rem" }}
              >
                All KPIs →
              </button>
            }
          >
            Key Metrics
          </SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {topKpis.map((kpi) => {
              const current = kpiValues[kpi.key] ?? 0;
              const pct12m = Math.min(100, Math.round((current / kpi.target12m) * 100));
              const color =
                pct12m >= 80 ? C.green : pct12m >= 40 ? C.amber : pct12m > 0 ? C.orange : C.textDim;
              return (
                <div key={kpi.key}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      fontSize: "0.82rem",
                    }}
                  >
                    <span style={{ color: C.textSoft }}>
                      {kpi.icon} {kpi.label}
                    </span>
                    <span style={{ color, fontWeight: 600 }}>
                      {current.toLocaleString()}
                      {kpi.unit ? ` ${kpi.unit}` : ""}
                    </span>
                  </div>
                  <ProgressBar value={pct12m} color={color} height={4} />
                  <div style={{ fontSize: "0.68rem", color: C.textDim, marginTop: 2 }}>
                    12m target: {kpi.target12m.toLocaleString()}{kpi.unit ? ` ${kpi.unit}` : ""}
                  </div>
                </div>
              );
            })}
            {topKpis.length === 0 && (
              <p style={{ color: C.textDim, fontSize: "0.85rem" }}>No KPIs defined yet.</p>
            )}
          </div>
        </Card>

        {/* Active projects */}
        <Card>
          <SectionTitle
            action={
              <button
                onClick={() => setActiveView("projects")}
                style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: "0.78rem" }}
              >
                All projects →
              </button>
            }
          >
            Active Projects
          </SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {activeProjects.map((project) => {
              const ring = rings.find((r) => r.id === project.ringId);
              return (
                <div
                  key={project.id}
                  style={{
                    padding: "0.55rem 0.75rem",
                    background: C.surfaceAlt,
                    borderRadius: 6,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", color: C.text, fontWeight: 500 }}>
                      {project.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: ring?.color ?? C.textMuted,
                        fontWeight: 600,
                      }}
                    >
                      {project.progress}%
                    </span>
                  </div>
                  <ProgressBar
                    value={project.progress}
                    color={ring?.color ?? C.accent}
                    height={3}
                  />
                </div>
              );
            })}
            {activeProjects.length === 0 && (
              <p style={{ color: C.textDim, fontSize: "0.85rem" }}>No active projects.</p>
            )}
          </div>
        </Card>

        {/* Principle / quote */}
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: `color-mix(in srgb, var(--accent) 8%, transparent)`,
            border: `1px solid color-mix(in srgb, var(--accent) 30%, transparent)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.accent,
              marginBottom: "0.75rem",
            }}
          >
            Principle
          </div>
          {quotePrinciple ? (
            <>
              <p
                style={{
                  color: C.text,
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                {quotePrinciple.text}
              </p>
              {quotePrinciple.quote && (
                <p
                  style={{
                    color: C.textMuted,
                    fontSize: "0.78rem",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  "{quotePrinciple.quote}"
                </p>
              )}
            </>
          ) : (
            <p style={{ color: C.textDim, fontSize: "0.85rem", margin: 0 }}>
              No principles defined yet.
            </p>
          )}
        </Card>
      </div>

      {/* Quick navigation */}
      <div style={{ ...styleCard, marginTop: "0.5rem" }}>
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: C.textDim,
            marginBottom: "0.75rem",
          }}
        >
          Quick Access
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(
            [
              ["pipeline", "Pipeline"],
              ["ideas", "Capture Idea"],
              ["weekly-calendar", "Schedule"],
              ["retrospective", "Retro"],
              ["phases", "Roadmap"],
              ["guardrails", "Guardrails"],
            ] as [Parameters<typeof setActiveView>[0], string][]
          ).map(([view, label]) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              style={{
                background: C.surfaceAlt,
                border: `1px solid ${C.border}`,
                color: C.textSoft,
                padding: "0.35rem 0.85rem",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "0.82rem",
                transition: "border-color 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
