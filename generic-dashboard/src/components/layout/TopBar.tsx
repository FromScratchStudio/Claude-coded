import { useStore } from "../../store/useStore";
import { C, FONT } from "../../theme";
import type { ViewId } from "../../types";

const ALL_NAV: { id: ViewId; label: string; icon: string; module?: string }[] = [
  { id: "dashboard", label: "Overview", icon: "◈" },
  { id: "pipeline", label: "Pipeline", icon: "⇒", module: "pipeline" },
  { id: "projects", label: "Projects", icon: "◻", module: "projects" },
  { id: "kpis", label: "KPIs", icon: "◎", module: "kpis" },
  { id: "quarter", label: "Quarter", icon: "◷", module: "quarter" },
  { id: "phases", label: "Phases", icon: "▦", module: "phases" },
  { id: "guardrails", label: "Guardrails", icon: "⚑", module: "guardrails" },
  { id: "personas", label: "Personas", icon: "◆", module: "personas" },
  { id: "ideas", label: "Ideas", icon: "◌", module: "ideas" },
  { id: "content-hub", label: "Content", icon: "▤", module: "contentHub" },
  { id: "weekly-calendar", label: "Calendar", icon: "▦", module: "weeklyCalendar" },
  { id: "retrospective", label: "Retro", icon: "↺", module: "retrospective" },
  { id: "settings", label: "Settings", icon: "⚙" },
  { id: "user-guide", label: "Guide", icon: "?" },
];

export default function TopBar() {
  const activeView = useStore((s) => s.activeView);
  const appConfig = useStore((s) => s.appConfig);
  const operationalMode = useStore((s) => s.operationalMode);
  const operationalModes = useStore((s) => s.operationalModes);
  const setActiveView = useStore((s) => s.setActiveView);

  const visibleNav = ALL_NAV.filter((item) => {
    if (!item.module) return true;
    return appConfig.modules[item.module as keyof typeof appConfig.modules] ?? true;
  });

  // Use configured labels for dynamic sections
  const labelOverrides: Partial<Record<ViewId, string>> = {
    "content-hub": appConfig.contentHubLabel,
    "personas": appConfig.personasLabel,
  };

  const currentMode = operationalModes.find((m) => m.id === operationalMode);

  return (
    <header
      style={{
        background: C.bgDeep,
        borderBottom: `1px solid ${C.border}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* App name row */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0.6rem 1.25rem 0",
          display: "flex",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: FONT.display,
            fontSize: "1.05rem",
            color: C.accent,
          }}
        >
          {appConfig.appName}
        </span>
        <span style={{ fontSize: "0.75rem", color: C.textDim }}>
          {appConfig.appTagline}
        </span>
        {currentMode && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.72rem",
              color: currentMode.color,
              border: `1px solid ${currentMode.color}50`,
              borderRadius: 4,
              padding: "2px 8px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: currentMode.color,
                display: "inline-block",
              }}
            />
            {currentMode.label}
          </span>
        )}
      </div>

      {/* Nav row */}
      <nav
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 1.25rem",
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {visibleNav.map((item) => {
          const label = labelOverrides[item.id] ?? item.label;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${isActive ? C.accent : "transparent"}`,
                color: isActive ? C.text : C.textMuted,
                padding: "0.6rem 0.9rem",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: isActive ? 600 : 400,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "color 0.15s, border-color 0.15s",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
              {label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
