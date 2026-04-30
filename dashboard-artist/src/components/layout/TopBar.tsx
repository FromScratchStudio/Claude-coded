import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";

import type { ViewId } from "../../types";

const TABS: { id: ViewId; label: string }[] = [
  { id: "dashboard", label: "Vue d'ensemble" },
  { id: "trimestre", label: "Trimestre" },
  { id: "weekly-calendar", label: "Agenda" },
  { id: "pipeline", label: "Pipeline" },
  { id: "projects", label: "Projets" },
  { id: "kpis", label: "KPIs" },
  { id: "phases", label: "Phases" },
  { id: "ideas", label: "Idées" },
  { id: "garde-fous", label: "Garde-fous" },
  { id: "referentiel", label: "Référentiel" },
  { id: "kefta-matesha", label: "Kefta Matesha" },
  { id: "settings", label: "Réglages" },
  { id: "user-guide", label: "Guide" },
];

export default function TopBar() {
  const activeView = useStore((s) => s.activeView);
  const setActiveView = useStore((s) => s.setActiveView);
  const degradedMode = useStore((s) => s.degradedMode);
  const degradedModes = useStore((s) => s.degradedModes);

  const activeMode = degradedModes.find((m) => m.id === degradedMode);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: C.bgDeep,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {/* Brand row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          height: 52,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: 26,
              height: 26,
              background: "linear-gradient(135deg, #E8C547, #F97316)",
              borderRadius: 6,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: FONT.display,
              fontSize: "1.1rem",
              color: C.gold,
              letterSpacing: "0.03em",
            }}
          >
            STRATEX
          </span>
          <span style={{ color: C.textVeryDim }}>|</span>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.62rem",
              color: C.textDim,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Méthode unifiée — 3 couches
          </span>
        </div>

        {/* Degraded mode indicator */}
        {activeMode && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.25rem 0.65rem",
              borderRadius: 4,
              background: "#2a0808",
              border: `1px solid ${activeMode.color}66`,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: activeMode.color,
                boxShadow: `0 0 6px ${activeMode.color}`,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: "0.62rem",
                color: activeMode.color,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Mode {activeMode.label}
            </span>
          </div>
        )}
      </div>

      {/* Navigation tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.2rem",
          padding: "0 2rem 0.6rem",
          overflowX: "auto",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                background: isActive ? C.surfaceAlt : "transparent",
                border: `1px solid ${isActive ? C.borderLight : "transparent"}`,
                color: isActive ? C.gold : C.textDim,
                padding: "0.35rem 0.85rem",
                borderRadius: 6,
                fontSize: "0.7rem",
                cursor: "pointer",
                fontFamily: FONT.mono,
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = C.textSoft;
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = C.textDim;
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
