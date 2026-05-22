import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";

export default function QuarterView() {
  const appConfig = useStore((s) => s.appConfig);
  const quarter = useStore((s) => s.quarter);
  const updateQuarter = useStore((s) => s.updateQuarter);
  const updateAllocation = useStore((s) => s.updateAllocation);

  const { allocationCategories } = appConfig;
  const totalAlloc = allocationCategories.reduce(
    (sum, cat) => sum + (quarter.allocation[cat.id] ?? 0),
    0
  );

  const ta = (
    key: keyof typeof quarter,
    label: string,
    placeholder?: string,
    multiline = false
  ) => (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ fontSize: "0.75rem", color: C.textMuted, display: "block", marginBottom: 4 }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={(quarter[key] as string) ?? ""}
          onChange={(e) => updateQuarter({ [key]: e.target.value })}
          style={{
            width: "100%",
            background: C.bgDeep,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: "0.45rem 0.75rem",
            color: C.text,
            fontSize: "0.88rem",
            outline: "none",
            resize: "vertical",
            minHeight: 64,
            boxSizing: "border-box",
          }}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={(quarter[key] as string) ?? ""}
          onChange={(e) => updateQuarter({ [key]: e.target.value })}
          style={{
            width: "100%",
            background: C.bgDeep,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: "0.45rem 0.75rem",
            color: C.text,
            fontSize: "0.88rem",
            outline: "none",
            boxSizing: "border-box",
          }}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <div>
      <SectionTitle sub="Quarterly planning and allocation">
        {quarter.q || "Quarterly Plan"}
      </SectionTitle>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem",
        }}
      >
        {/* Left: Goals and context */}
        <div>
          <Card style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: C.textMuted,
                marginBottom: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Identity
            </div>
            {ta("q", "Quarter label", "Q2 2025")}
            {ta("goal", appConfig.quarterGoalLabel, "What is the main objective this quarter?")}
            {ta("theme", appConfig.quarterThemeLabel, "What's the narrative arc?")}
            {ta("themeEnd", "Theme end date / milestone", "End of June 2025")}
          </Card>

          <Card style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: C.textMuted,
                marginBottom: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Execution
            </div>
            {ta("amplification", "Amplification channel", "How will you amplify the work?")}
            {ta("focalTool", "Focal tool", "Primary tool / system for this quarter")}
          </Card>

          <Card>
            <div
              style={{
                fontSize: "0.75rem",
                color: C.textMuted,
                marginBottom: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Constraints & Rules
            </div>
            {ta("redZones", "Red zones", "What to absolutely avoid this quarter?", true)}
            {ta("singleRule", "Single rule", "One binding decision for the whole quarter")}
          </Card>
        </div>

        {/* Right: Allocation */}
        <div>
          <Card style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: C.textMuted,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Allocation
              </div>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: totalAlloc === 100 ? C.green : C.amber,
                  fontWeight: 600,
                }}
              >
                {totalAlloc}% allocated
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {allocationCategories.map((cat) => {
                const val = quarter.allocation[cat.id] ?? 0;
                return (
                  <div key={cat.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                        fontSize: "0.82rem",
                      }}
                    >
                      <span style={{ color: C.textSoft }}>{cat.label}</span>
                      <span style={{ color: cat.color, fontWeight: 600 }}>{val}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={val}
                      onChange={(e) => updateAllocation(cat.id, Number(e.target.value))}
                      style={{ width: "100%", accentColor: cat.color }}
                    />
                    <ProgressBar value={val} color={cat.color} height={4} />
                  </div>
                );
              })}
            </div>

            {totalAlloc !== 100 && (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.5rem 0.75rem",
                  background: `${C.amber}15`,
                  border: `1px solid ${C.amber}40`,
                  borderRadius: 6,
                  fontSize: "0.78rem",
                  color: C.amber,
                }}
              >
                {totalAlloc < 100
                  ? `${100 - totalAlloc}% unallocated`
                  : `${totalAlloc - 100}% over-allocated — reduce to reach 100%`}
              </div>
            )}
          </Card>

          {/* Summary card */}
          <Card
            style={{
              background: `color-mix(in srgb, var(--accent) 8%, transparent)`,
              border: `1px solid color-mix(in srgb, var(--accent) 30%, transparent)`,
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: C.accent,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
              }}
            >
              Summary
            </div>
            {quarter.goal && (
              <p style={{ color: C.text, fontSize: "0.9rem", marginBottom: "0.5rem", lineHeight: 1.5 }}>
                <strong>Goal:</strong> {quarter.goal}
              </p>
            )}
            {quarter.theme && (
              <p style={{ color: C.textSoft, fontSize: "0.85rem", marginBottom: "0.5rem", fontStyle: "italic" }}>
                Theme: "{quarter.theme}"
              </p>
            )}
            {quarter.singleRule && (
              <div
                style={{
                  padding: "0.5rem 0.75rem",
                  background: C.surfaceAlt,
                  borderRadius: 6,
                  borderLeft: `3px solid ${C.accent}`,
                  fontSize: "0.82rem",
                  color: C.textSoft,
                  marginBottom: "0.5rem",
                }}
              >
                Rule: {quarter.singleRule}
              </div>
            )}
            {quarter.redZones && (
              <div
                style={{
                  padding: "0.5rem 0.75rem",
                  background: `${C.red}10`,
                  borderRadius: 6,
                  borderLeft: `3px solid ${C.red}`,
                  fontSize: "0.82rem",
                  color: C.textSoft,
                }}
              >
                <strong style={{ color: C.red }}>Red zones:</strong> {quarter.redZones}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
