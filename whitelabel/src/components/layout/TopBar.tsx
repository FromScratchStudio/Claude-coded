import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import type { ViewId } from "../../types";

const TABS: { id: ViewId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "pipeline", label: "Pipeline" },
  { id: "projects", label: "Projects" },
  { id: "kpis", label: "KPIs" },
  { id: "roadmap", label: "Roadmap" },
  { id: "ideas", label: "Ideas" },
  { id: "planning", label: "Planning" },
  { id: "principles", label: "Principles" },
  { id: "referentiel", label: "Referentiel" },
  { id: "settings", label: "⚙ Settings" },
];

export default function TopBar() {
  const activeView = useStore((s) => s.activeView);
  const setActiveView = useStore((s) => s.setActiveView);
  const name = useStore((s) => s.settings.name);
  const tagline = useStore((s) => s.settings.tagline);
  const accentColor = useStore((s) => s.settings.accentColor);

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
              background: `linear-gradient(135deg, ${accentColor}, #f97316)`,
              borderRadius: 6,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: FONT.display,
              fontSize: "1.1rem",
              color: accentColor,
              letterSpacing: "0.03em",
            }}
          >
            {name}
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
            {tagline}
          </span>
        </div>
      </div>

      {/* Nav tabs */}
      <nav
        style={{
          display: "flex",
          gap: "0.15rem",
          padding: "0 1.5rem",
          overflowX: "auto",
        }}
      >
        {TABS.map((tab) => {
          const active = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: active ? `2px solid ${accentColor}` : "2px solid transparent",
                color: active ? accentColor : C.textDim,
                fontFamily: FONT.mono,
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                padding: "0.6rem 0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
