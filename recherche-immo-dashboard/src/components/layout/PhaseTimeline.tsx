import { useStore } from "../../store/useStore";
import { C, FONT } from "../../theme";

export default function PhaseTimeline() {
  const phases = useStore((s) => s.phases);
  const strategyStart = useStore((s) => s.strategyStartDate);
  const strategyEnd = useStore((s) => s.strategyEstimatedEndDate);

  const startMs = new Date(strategyStart).getTime();
  const endMs = new Date(strategyEnd).getTime();
  const totalMs = endMs - startMs;
  const nowMs = Date.now();
  const overallPct = totalMs > 0
    ? Math.min(100, Math.max(0, ((nowMs - startMs) / totalMs) * 100))
    : 0;

  // Find current phase
  const currentPhase = phases.find((p) => {
    if (!p.startDate || !p.estimatedEndDate) return false;
    const s = new Date(p.startDate).getTime();
    const e = new Date(p.estimatedEndDate).getTime();
    return nowMs >= s && nowMs <= e;
  });

  // Task completion per phase
  function phasePct(phase: (typeof phases)[number]) {
    const total = phase.tasks.length;
    if (total === 0) return 0;
    return Math.round((phase.tasks.filter((t) => t.done).length / total) * 100);
  }

  return (
    <div
      style={{
        background: C.bgDeep,
        borderBottom: `1px solid ${C.border}`,
        padding: "0.5rem 0",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: 16,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/* Overall progress */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              color: C.textDim,
              textTransform: "uppercase",
            }}
          >
            Overall
          </span>
          <div
            style={{
              width: 60,
              height: 4,
              background: C.surfaceAlt,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${overallPct}%`,
                height: "100%",
                background: C.accent,
                borderRadius: 4,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.65rem",
              color: C.textMuted,
            }}
          >
            {Math.round(overallPct)}%
          </span>
        </div>

        <div
          style={{
            width: 1,
            height: 16,
            background: C.border,
            flexShrink: 0,
          }}
        />

        {/* Phase bars */}
        <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
          {phases.map((phase) => {
            const pct = phasePct(phase);
            const isCurrent = currentPhase?.id === phase.id;
            return (
              <div
                key={phase.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: isCurrent ? 1 : 0.55,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: "0.65rem",
                    color: isCurrent ? phase.accent : C.textDim,
                    letterSpacing: "0.08em",
                  }}
                >
                  {phase.label}
                </span>
                <div
                  style={{
                    width: 48,
                    height: 3,
                    background: C.surfaceAlt,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: phase.accent,
                      borderRadius: 3,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: "0.63rem",
                    color: C.textDim,
                  }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
