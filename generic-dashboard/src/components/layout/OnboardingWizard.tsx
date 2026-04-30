import { useState, type CSSProperties } from "react";
import { useStore } from "../../store/useStore";
import { C, FONT, applyAccentColor } from "../../theme";

const ACCENT_PRESETS = [
  { label: "Blue", value: "#4c7fc9" },
  { label: "Teal", value: "#06b6d4" },
  { label: "Green", value: "#10b981" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Orange", value: "#f97316" },
  { label: "Pink", value: "#ec4899" },
  { label: "Gold", value: "#c9a84c" },
  { label: "Red", value: "#ef4444" },
];

const MODULE_LIST = [
  { key: "pipeline", label: "Pipeline", desc: "Track deliverables through workflow stages" },
  { key: "projects", label: "Projects", desc: "Portfolio of projects with ring-based priority" },
  { key: "kpis", label: "KPIs", desc: "Key performance indicators with targets" },
  { key: "quarter", label: "Quarterly Plan", desc: "Quarterly goals and allocation planning" },
  { key: "phases", label: "Roadmap Phases", desc: "Phased strategic roadmap with tasks" },
  { key: "guardrails", label: "Guardrails", desc: "Principles, modes, and risk patterns" },
  { key: "personas", label: "Personas", desc: "Identity profiles, voices, or team personas" },
  { key: "ideas", label: "Ideas Board", desc: "Kanban-style idea capture and filtering" },
  { key: "contentHub", label: "Content Hub", desc: "Manage content series and publication pipeline" },
  { key: "weeklyCalendar", label: "Weekly Calendar", desc: "Schedule work sessions with time unit tracking" },
  { key: "retrospective", label: "Retrospective", desc: "Weekly reflection and energy tracking" },
] as const;

export default function OnboardingWizard() {
  const appConfig = useStore((s) => s.appConfig);
  const updateAppConfig = useStore((s) => s.updateAppConfig);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("My Dashboard");
  const [tagline, setTagline] = useState("Strategy · Projects · Execution");
  const [accent, setAccent] = useState("#4c7fc9");
  const [customAccent, setCustomAccent] = useState("#4c7fc9");
  const [modules, setModules] = useState({ ...appConfig.modules });
  const [timeUnitLabel, setTimeUnitLabel] = useState("UT");
  const [timeUnitMinutes, setTimeUnitMinutes] = useState(90);
  const [weeklyTarget, setWeeklyTarget] = useState(12);

  function toggleModule(key: string) {
    setModules((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  }

  function handleAccentChange(hex: string) {
    setAccent(hex);
    setCustomAccent(hex);
    applyAccentColor(hex);
  }

  function finish() {
    updateAppConfig({
      appName: name.trim() || "My Dashboard",
      appTagline: tagline.trim(),
      accentColor: accent,
      timeUnitLabel: timeUnitLabel.trim() || "UT",
      timeUnitPluralLabel: (timeUnitLabel.trim() || "UT") + "s",
      timeUnitMinutes,
      weeklyTimeUnitTarget: weeklyTarget,
      modules,
      onboardingComplete: true,
    });
  }

  const steps = [
    // Step 0: Welcome
    <div key="welcome" style={{ textAlign: "center", padding: "2rem 1rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>◈</div>
      <h1
        style={{
          fontFamily: FONT.display,
          fontSize: "2rem",
          color: C.text,
          marginBottom: "0.5rem",
        }}
      >
        Welcome to Generic Dashboard
      </h1>
      <p style={{ color: C.textSoft, fontSize: "1rem", maxWidth: 500, margin: "0 auto 2rem" }}>
        A fully configurable strategy and project dashboard. Let's set it up for your needs in
        just a few steps.
      </p>
      <button onClick={() => setStep(1)} style={nextBtn}>
        Get started →
      </button>
    </div>,

    // Step 1: Name & tagline
    <div key="name" style={{ padding: "0.5rem" }}>
      <h2 style={{ fontFamily: FONT.display, fontSize: "1.5rem", color: C.text, marginBottom: "0.5rem" }}>
        Name your dashboard
      </h2>
      <p style={{ color: C.textMuted, marginBottom: "1.5rem" }}>
        Give it a name that reflects your project or strategy.
      </p>
      <label style={lbl}>Dashboard name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inp}
        placeholder="e.g. Startup OS, Product Strategy 2025, Studio Dashboard"
        maxLength={60}
      />
      <label style={{ ...lbl, marginTop: "1rem" }}>Tagline / subtitle</label>
      <input
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        style={inp}
        placeholder="e.g. Strategy · Projects · Execution"
        maxLength={80}
      />
      <div style={navRow}>
        <button onClick={() => setStep(0)} style={backBtn}>← Back</button>
        <button onClick={() => setStep(2)} style={nextBtn}>Next →</button>
      </div>
    </div>,

    // Step 2: Accent color
    <div key="color" style={{ padding: "0.5rem" }}>
      <h2 style={{ fontFamily: FONT.display, fontSize: "1.5rem", color: C.text, marginBottom: "0.5rem" }}>
        Choose your accent color
      </h2>
      <p style={{ color: C.textMuted, marginBottom: "1.5rem" }}>
        This color is used throughout the interface for highlights and active states.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: "1.5rem" }}>
        {ACCENT_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handleAccentChange(preset.value)}
            title={preset.label}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: preset.value,
              border: `3px solid ${accent === preset.value ? C.text : "transparent"}`,
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
          />
        ))}
      </div>
      <label style={lbl}>Custom hex color</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          value={customAccent}
          onChange={(e) => handleAccentChange(e.target.value)}
          style={{ width: 40, height: 34, padding: 2, background: "none", border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer" }}
        />
        <input
          value={customAccent}
          onChange={(e) => {
            setCustomAccent(e.target.value);
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
              handleAccentChange(e.target.value);
            }
          }}
          style={{ ...inp, flex: 1 }}
          placeholder="#4c7fc9"
          maxLength={7}
        />
      </div>
      <div style={{ marginTop: "1.5rem", padding: "0.75rem 1rem", background: C.surfaceAlt, borderRadius: 8, border: `1px solid ${C.border}` }}>
        <span style={{ color: C.accent, fontWeight: 600, marginRight: 8 }}>Preview:</span>
        <span style={{ color: C.text }}>{name || "My Dashboard"}</span>
        <span style={{ color: C.textMuted, marginLeft: 8, fontSize: "0.85rem" }}>{tagline}</span>
      </div>
      <div style={navRow}>
        <button onClick={() => setStep(1)} style={backBtn}>← Back</button>
        <button onClick={() => setStep(3)} style={nextBtn}>Next →</button>
      </div>
    </div>,

    // Step 3: Modules
    <div key="modules" style={{ padding: "0.5rem" }}>
      <h2 style={{ fontFamily: FONT.display, fontSize: "1.5rem", color: C.text, marginBottom: "0.5rem" }}>
        Enable the modules you need
      </h2>
      <p style={{ color: C.textMuted, marginBottom: "1.25rem" }}>
        You can change these at any time in Settings.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {MODULE_LIST.map((mod) => {
          const enabled = modules[mod.key as keyof typeof modules];
          return (
            <label
              key={mod.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0.65rem 0.85rem",
                borderRadius: 8,
                background: enabled ? `${C.accent}15` : C.surfaceAlt,
                border: `1px solid ${enabled ? C.accent + "50" : C.border}`,
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleModule(mod.key)}
                style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
              />
              <div>
                <div style={{ fontSize: "0.88rem", color: C.text, fontWeight: 500 }}>
                  {mod.label}
                </div>
                <div style={{ fontSize: "0.75rem", color: C.textMuted }}>{mod.desc}</div>
              </div>
            </label>
          );
        })}
      </div>
      <div style={navRow}>
        <button onClick={() => setStep(2)} style={backBtn}>← Back</button>
        <button onClick={() => setStep(4)} style={nextBtn}>Next →</button>
      </div>
    </div>,

    // Step 4: Time units
    <div key="time" style={{ padding: "0.5rem" }}>
      <h2 style={{ fontFamily: FONT.display, fontSize: "1.5rem", color: C.text, marginBottom: "0.5rem" }}>
        Configure work units
      </h2>
      <p style={{ color: C.textMuted, marginBottom: "1.5rem" }}>
        Work units are your basic time blocks for scheduling and tracking capacity.
      </p>
      <label style={lbl}>Unit name (abbreviation)</label>
      <input
        value={timeUnitLabel}
        onChange={(e) => setTimeUnitLabel(e.target.value)}
        style={inp}
        placeholder="e.g. UT, WU, Block, Session, Sprint"
        maxLength={10}
      />
      <label style={{ ...lbl, marginTop: "1rem" }}>Duration per unit (minutes)</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {[25, 45, 60, 90, 120].map((m) => (
          <button
            key={m}
            onClick={() => setTimeUnitMinutes(m)}
            style={{
              padding: "0.35rem 0.9rem",
              borderRadius: 6,
              background: timeUnitMinutes === m ? C.accent : C.surfaceAlt,
              color: timeUnitMinutes === m ? "#fff" : C.textSoft,
              border: `1px solid ${timeUnitMinutes === m ? "transparent" : C.border}`,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {m} min
          </button>
        ))}
      </div>
      <label style={{ ...lbl, marginTop: "1rem" }}>Weekly target (units per week)</label>
      <input
        type="number"
        value={weeklyTarget}
        onChange={(e) => setWeeklyTarget(Math.max(1, Number(e.target.value)))}
        style={{ ...inp, width: 100 }}
        min={1}
        max={60}
      />
      <p style={{ color: C.textDim, fontSize: "0.78rem", marginTop: 6 }}>
        = {Math.round((weeklyTarget * timeUnitMinutes) / 60 * 10) / 10} hours/week of tracked work
      </p>
      <div style={navRow}>
        <button onClick={() => setStep(3)} style={backBtn}>← Back</button>
        <button onClick={() => setStep(5)} style={nextBtn}>Next →</button>
      </div>
    </div>,

    // Step 5: Done
    <div key="done" style={{ textAlign: "center", padding: "2rem 1rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
      <h2
        style={{
          fontFamily: FONT.display,
          fontSize: "1.8rem",
          color: C.text,
          marginBottom: "0.5rem",
        }}
      >
        You're all set!
      </h2>
      <p style={{ color: C.textSoft, fontSize: "0.95rem", maxWidth: 440, margin: "0 auto 0.5rem" }}>
        <strong style={{ color: C.accent }}>{name || "My Dashboard"}</strong> is configured and ready to use.
      </p>
      <p style={{ color: C.textMuted, fontSize: "0.85rem", maxWidth: 440, margin: "0 auto 2rem" }}>
        You can always adjust everything in <strong>Settings</strong>. Let's go!
      </p>
      <button onClick={finish} style={{ ...nextBtn, padding: "0.7rem 2rem", fontSize: "1rem" }}>
        Open Dashboard →
      </button>
    </div>,
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: C.surface,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 16,
          padding: "2rem",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Step indicator */}
        {step > 0 && step < 5 && (
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: "1.5rem",
            }}
          >
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 3,
                  background: step >= s ? C.accent : C.surfaceAlt,
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        )}

        {steps[step]}
      </div>
    </div>
  );
}

// ─── Local styles ─────────────────────────────────────────────────────────────

const inp: CSSProperties = {
  width: "100%",
  background: C.bgDeep,
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  padding: "0.5rem 0.75rem",
  color: C.text,
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};

const lbl: CSSProperties = {
  fontSize: "0.75rem",
  color: C.textMuted,
  display: "block",
  marginBottom: 4,
};

const nextBtn: CSSProperties = {
  background: "var(--accent)",
  border: "none",
  color: "#fff",
  padding: "0.55rem 1.5rem",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 600,
};

const backBtn: CSSProperties = {
  background: C.surfaceAlt,
  border: `1px solid ${C.border}`,
  color: C.textSoft,
  padding: "0.55rem 1.2rem",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: "0.9rem",
};

const navRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "1.5rem",
};
