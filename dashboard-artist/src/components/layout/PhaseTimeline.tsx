import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";

export default function PhaseTimeline() {
  const phases = useStore((s) => s.phases);

  // Determine current phase: first phase with incomplete tasks
  let currentPhase = phases.length > 0 ? phases[phases.length - 1].id : 0;
  for (const phase of phases) {
    const doneCount = phase.tasks.filter((t) => t.done).length;
    if (doneCount < phase.tasks.length) {
      currentPhase = phase.id;
      break;
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        padding: "0.75rem 2rem",
        background: C.bg,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {phases.map((phase) => {
        const isCurrent = phase.id === currentPhase;
        const isPast = phase.id < currentPhase;
        const doneCount = phase.tasks.filter((t) => t.done).length;
        const pct = Math.round((doneCount / phase.tasks.length) * 100);

        return (
          <div key={phase.id} style={{ flex: 1 }}>
            {/* Progress bar */}
            <div
              style={{
                height: 3,
                background: C.border,
                borderRadius: 2,
                marginBottom: "0.35rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: isPast ? "100%" : isCurrent ? `${pct}%` : "0%",
                  height: "100%",
                  background: phase.accent,
                  borderRadius: 2,
                  boxShadow: isCurrent ? `0 0 8px ${phase.accent}55` : "none",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  color: isCurrent ? phase.accent : isPast ? C.textDim : C.textVeryDim,
                  textTransform: "uppercase",
                }}
              >
                {phase.label}
              </span>
              <span
                style={{
                  fontSize: "0.58rem",
                  color: C.textVeryDim,
                  fontFamily: FONT.mono,
                }}
              >
                {phase.months}
              </span>
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: isPast || isCurrent ? C.textMuted : C.textVeryDim,
                marginTop: "0.1rem",
              }}
            >
              {phase.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
