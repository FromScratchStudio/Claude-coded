import { type ReactNode } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";

export default function UserGuideView() {
  const appConfig = useStore((s) => s.appConfig);

  const section = (title: string, content: ReactNode) => (
    <Card style={{ marginBottom: "1.25rem" }}>
      <h3
        style={{
          margin: "0 0 0.75rem",
          fontSize: "0.95rem",
          color: C.accent,
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: "0.5rem",
        }}
      >
        {title}
      </h3>
      <div style={{ fontSize: "0.85rem", color: C.textSoft, lineHeight: 1.7 }}>
        {content}
      </div>
    </Card>
  );

  const tip = (text: string) => (
    <div
      style={{
        padding: "0.4rem 0.75rem",
        background: `${C.accent}10`,
        borderLeft: `3px solid ${C.accent}`,
        borderRadius: 4,
        marginBottom: 8,
        fontSize: "0.82rem",
        color: C.textSoft,
      }}
    >
      {text}
    </div>
  );

  return (
    <div>
      <SectionTitle sub="How to use every feature of your dashboard">
        User Guide
      </SectionTitle>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Table of contents */}
        <div
          style={{
            position: "sticky",
            top: 80,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              color: C.textDim,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.75rem",
            }}
          >
            Contents
          </div>
          {[
            "Overview",
            "Dashboard",
            "Pipeline",
            "Projects",
            "KPIs",
            "Quarter",
            "Phases",
            "Guardrails",
            appConfig.personasLabel,
            "Ideas",
            appConfig.contentHubLabel,
            "Weekly Calendar",
            "Retrospective",
            "Settings",
          ].map((item) => (
            <a
              key={item}
              href={`#guide-${item.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                display: "block",
                fontSize: "0.78rem",
                color: C.textMuted,
                marginBottom: 4,
                textDecoration: "none",
                padding: "2px 0",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Guide content */}
        <div>
          <div id="guide-overview">
            {section("Overview", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  <strong style={{ color: C.text }}>{appConfig.appName}</strong> is a configurable strategy and project dashboard.
                  Everything is stored locally in your browser — no account, no server. Export your data as JSON anytime.
                </p>
                {tip("All changes are saved automatically to localStorage. Use Settings → Export to back up your data.")}
                <p style={{ margin: 0 }}>
                  Navigate using the top navigation bar. Modules can be enabled or disabled in Settings → Modules.
                </p>
              </>
            ))}
          </div>

          <div id="guide-dashboard">
            {section("Dashboard", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  The main overview. Shows your current state, allocation donut, UT tracker, active projects, KPI summary, and quick-access buttons.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li><strong>Weekly state:</strong> Use the sliders to log {appConfig.energyLabel.toLowerCase()}, {appConfig.satisfactionLabel.toLowerCase()}, and {appConfig.capacityLabel.toLowerCase()} each week.</li>
                  <li><strong>Allocation donut:</strong> Visual breakdown of your configured ring allocations.</li>
                  <li><strong>UT tracker:</strong> Track your time units across 4 weeks (Mon–Thu/Fri–Sat columns).</li>
                  <li><strong>Operational mode:</strong> Quickly switch between configured work modes.</li>
                </ul>
                {tip("Click any KPI or project card to navigate directly to that module.")}
              </>
            ))}
          </div>

          <div id="guide-pipeline">
            {section("Pipeline", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  A Kanban board for tracking {appConfig.pipelineItemPluralLabel.toLowerCase()} through your workflow stages.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li>Click <strong>+ Stage</strong> to add or configure workflow columns.</li>
                  <li>Click <strong>+ {appConfig.pipelineItemLabel}</strong> to add a new item.</li>
                  <li>Click any card to open its detail panel with gate checklist.</li>
                  <li>Move items between stages using the stage buttons in the detail panel.</li>
                </ul>
                {tip("Each stage can have completion gates — checkboxes that must be ticked before moving on.")}
              </>
            ))}
          </div>

          <div id="guide-projects">
            {section("Projects", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  Full project portfolio view, grouped by ring.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li>Filter by status (active / pending / backlog) or by ring.</li>
                  <li>Adjust progress directly with the inline slider on each card.</li>
                  <li>Rings are configured in Settings → Rings.</li>
                </ul>
                {tip("Assign projects to a ring to segment your portfolio by strategic priority.")}
              </>
            ))}
          </div>

          <div id="guide-kpis">
            {section("KPIs", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  Define and track your key performance indicators with 3-month, 12-month, and 36-month targets.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li>Update current values using the number input on each card.</li>
                  <li>Color coding: green ≥ 80%, amber ≥ 40%, orange &gt; 0%, grey = 0%.</li>
                  <li>Group KPIs by category for better organization.</li>
                </ul>
              </>
            ))}
          </div>

          <div id="guide-quarter">
            {section("Quarter", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  Set your quarterly goal, theme, amplification channel, and resource allocation.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li><strong>{appConfig.quarterGoalLabel}:</strong> The primary objective for the quarter.</li>
                  <li><strong>{appConfig.quarterThemeLabel}:</strong> The narrative arc or framing.</li>
                  <li><strong>Allocation sliders:</strong> Assign percentages across your configured categories.</li>
                  <li><strong>Red zones:</strong> Things to explicitly avoid this quarter.</li>
                  <li><strong>Single rule:</strong> One binding constraint for the quarter.</li>
                </ul>
                {tip("Aim for allocation to sum to 100%. A warning will appear if it doesn't.")}
              </>
            ))}
          </div>

          <div id="guide-phases">
            {section("Phases", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  Organize your strategy into sequential phases with task lists.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li>Click a phase card to expand and manage its tasks.</li>
                  <li>Check off tasks to track completion.</li>
                  <li>Set overall strategy start and end dates at the top.</li>
                </ul>
              </>
            ))}
          </div>

          <div id="guide-guardrails">
            {section("Guardrails", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  Five tabs for operational risk management:
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li><strong>Op Modes:</strong> Define degraded or alternative working modes with rules and triggers.</li>
                  <li><strong>Principles:</strong> A numbered list of your binding operating principles.</li>
                  <li><strong>Risk Patterns:</strong> Known failure modes to watch for.</li>
                  <li><strong>Checklist:</strong> Collaboration or process checklist items.</li>
                  <li><strong>Phase Budgets:</strong> Time budgets per phase (months + max hours).</li>
                </ul>
              </>
            ))}
          </div>

          <div id={`guide-${appConfig.personasLabel.toLowerCase().replace(/\s+/g, "-")}`}>
            {section(appConfig.personasLabel, (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  Define your strategic personas — brand voices, user archetypes, stakeholder types, or team members.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li>Select a persona from the sidebar to see full details.</li>
                  <li>Each persona has audience, role, tone, lexicon, playlist, members, and inspirations.</li>
                </ul>
                {tip("Use lexicon to define the vocabulary this persona uses or avoids.")}
              </>
            ))}
          </div>

          <div id="guide-ideas">
            {section("Ideas", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  A Kanban for capturing and processing ideas through three stages: Raw → Sorted → Selected.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li>Capture ideas quickly with the + button.</li>
                  <li>Use → / ← buttons to advance or retreat ideas.</li>
                  <li>Tag ideas for filtering and context.</li>
                </ul>
              </>
            ))}
          </div>

          <div id={`guide-${appConfig.contentHubLabel.toLowerCase().replace(/\s+/g, "-")}`}>
            {section(appConfig.contentHubLabel, (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  Manage {appConfig.contentSeriesLabel.toLowerCase()} with individual {appConfig.contentItemLabel.toLowerCase()} entries.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li>Each {appConfig.contentSeriesLabel.toLowerCase().replace(/s$/, "")} can contain multiple {appConfig.contentItemLabel.toLowerCase()} items.</li>
                  <li>Items progress through: idea → brief → draft → review → approved → published.</li>
                  <li>Use the inline dropdown in the table to quickly update status.</li>
                </ul>
              </>
            ))}
          </div>

          <div id="guide-weekly-calendar">
            {section("Weekly Calendar", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  Plan your week with a 7-day grid from 6:00 to 22:00.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li>Click any cell to add a slot.</li>
                  <li>Assign work modes and projects to slots.</li>
                  <li>Check "Count as {appConfig.timeUnitLabel}" to track your {appConfig.timeUnitPluralLabel}.</li>
                  <li>The UT progress bar at the top shows filled vs. target.</li>
                </ul>
                {tip(`1 ${appConfig.timeUnitLabel} = ${appConfig.timeUnitMinutes} minutes. Configure in Settings → Time units.`)}
              </>
            ))}
          </div>

          <div id="guide-retrospective">
            {section("Retrospective", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  Weekly reflection — score your {appConfig.energyLabel.toLowerCase()}, {appConfig.satisfactionLabel.toLowerCase()}, and completion, then write a brief review.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li>One retro per week — updates the existing record if you save again.</li>
                  <li>View history to see all past retros.</li>
                </ul>
              </>
            ))}
          </div>

          <div id="guide-settings">
            {section("Settings", (
              <>
                <p style={{ margin: "0 0 0.75rem" }}>
                  Full configuration of the dashboard.
                </p>
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: 18 }}>
                  <li><strong>General:</strong> App name, tagline, accent color, and all label overrides.</li>
                  <li><strong>Rings:</strong> Strategic portfolio rings (add/edit/remove).</li>
                  <li><strong>Categories:</strong> Allocation categories for the quarter view.</li>
                  <li><strong>Modules:</strong> Toggle which views appear in the nav.</li>
                  <li><strong>Time units:</strong> Configure the unit label and duration.</li>
                  <li><strong>Data:</strong> Export/import JSON, reset to defaults.</li>
                </ul>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
