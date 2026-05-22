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
  { key: "pipeline", label: "Pipeline", desc: "Suivre les livrables à travers les étapes du workflow" },
  { key: "projects", label: "Projets", desc: "Portefeuille de projets avec priorité par anneaux" },
  { key: "kpis", label: "KPIs", desc: "Indicateurs clés de performance avec objectifs" },
  { key: "quarter", label: "Plan trimestriel", desc: "Objectifs trimestriels et planification de l'allocation" },
  { key: "phases", label: "Phases de la feuille de route", desc: "Feuille de route stratégique phasée avec tâches" },
  { key: "guardrails", label: "Garde-fous", desc: "Principes, modes opératoires et risques" },
  { key: "personas", label: "Personas", desc: "Profils d'identité, voix ou personas d'équipe" },
  { key: "ideas", label: "Tableau d'idées", desc: "Capture et filtrage d'idées en mode Kanban" },
  { key: "contentHub", label: "Hub de contenu", desc: "Gérer les séries de contenu et le pipeline de publication" },
  { key: "weeklyCalendar", label: "Calendrier hebdomadaire", desc: "Planifier les sessions de travail avec suivi des unités de temps" },
  { key: "retrospective", label: "Rétrospective", desc: "Bilan hebdomadaire et suivi de l'énergie" },
] as const;

export default function OnboardingWizard() {
  const appConfig = useStore((s) => s.appConfig);
  const updateAppConfig = useStore((s) => s.updateAppConfig);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("Mon Tableau de Bord");
  const [tagline, setTagline] = useState("Recherche · Projets · Stratégie");
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
      appName: name.trim() || "Mon Tableau de Bord",
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
        Bienvenue sur Recherche Immo
      </h1>
      <p style={{ color: C.textSoft, fontSize: "1rem", maxWidth: 500, margin: "0 auto 2rem" }}>
        Un tableau de bord configurable pour votre recherche immobilière. Configurons-le en quelques étapes.
      </p>
      <button onClick={() => setStep(1)} style={nextBtn}>
        Commencer →
      </button>
    </div>,

    // Step 1: Name & tagline
    <div key="name" style={{ padding: "0.5rem" }}>
      <h2 style={{ fontFamily: FONT.display, fontSize: "1.5rem", color: C.text, marginBottom: "0.5rem" }}>
        Nommez votre tableau de bord
      </h2>
      <p style={{ color: C.textMuted, marginBottom: "1.5rem" }}>
        Donnez-lui un nom qui reflète votre projet ou stratégie.
      </p>
      <label style={lbl}>Nom du tableau de bord</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inp}
        placeholder="ex. Recherche Appartement, Investissement 2025, Projet Maison"
        maxLength={60}
      />
      <label style={{ ...lbl, marginTop: "1rem" }}>Sous-titre</label>
      <input
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        style={inp}
        placeholder="ex. Recherche · Projets · Stratégie"
        maxLength={80}
      />
      <div style={navRow}>
        <button onClick={() => setStep(0)} style={backBtn}>← Retour</button>
        <button onClick={() => setStep(2)} style={nextBtn}>Suivant →</button>
      </div>
    </div>,

    // Step 2: Accent color
    <div key="color" style={{ padding: "0.5rem" }}>
      <h2 style={{ fontFamily: FONT.display, fontSize: "1.5rem", color: C.text, marginBottom: "0.5rem" }}>
        Choisissez votre couleur d'accentuation
      </h2>
      <p style={{ color: C.textMuted, marginBottom: "1.5rem" }}>
        Cette couleur est utilisée dans toute l'interface pour les surlignages et les états actifs.
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
      <label style={lbl}>Couleur hexadécimale personnalisée</label>
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
        <span style={{ color: C.accent, fontWeight: 600, marginRight: 8 }}>Aperçu :</span>
        <span style={{ color: C.text }}>{name || "Mon Tableau de Bord"}</span>
        <span style={{ color: C.textMuted, marginLeft: 8, fontSize: "0.85rem" }}>{tagline}</span>
      </div>
      <div style={navRow}>
        <button onClick={() => setStep(1)} style={backBtn}>← Retour</button>
        <button onClick={() => setStep(3)} style={nextBtn}>Suivant →</button>
      </div>
    </div>,

    // Step 3: Modules
    <div key="modules" style={{ padding: "0.5rem" }}>
      <h2 style={{ fontFamily: FONT.display, fontSize: "1.5rem", color: C.text, marginBottom: "0.5rem" }}>
        Activez les modules dont vous avez besoin
      </h2>
      <p style={{ color: C.textMuted, marginBottom: "1.25rem" }}>
        Vous pouvez les modifier à tout moment dans les Paramètres.
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
                background: enabled ? `color-mix(in srgb, var(--accent) 15%, transparent)` : C.surfaceAlt,
                border: `1px solid ${enabled ? `color-mix(in srgb, var(--accent) 50%, transparent)` : C.border}`,
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
        <button onClick={() => setStep(2)} style={backBtn}>← Retour</button>
        <button onClick={() => setStep(4)} style={nextBtn}>Suivant →</button>
      </div>
    </div>,

    // Step 4: Time units
    <div key="time" style={{ padding: "0.5rem" }}>
      <h2 style={{ fontFamily: FONT.display, fontSize: "1.5rem", color: C.text, marginBottom: "0.5rem" }}>
        Configurer les unités de travail
      </h2>
      <p style={{ color: C.textMuted, marginBottom: "1.5rem" }}>
        Les unités de travail sont vos blocs de temps de base pour planifier et suivre votre capacité.
      </p>
      <label style={lbl}>Nom de l'unité (abréviation)</label>
      <input
        value={timeUnitLabel}
        onChange={(e) => setTimeUnitLabel(e.target.value)}
        style={inp}
        placeholder="ex. UT, UW, Bloc, Session, Sprint"
        maxLength={10}
      />
      <label style={{ ...lbl, marginTop: "1rem" }}>Durée par unité (minutes)</label>
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
      <label style={{ ...lbl, marginTop: "1rem" }}>Objectif hebdomadaire (unités par semaine)</label>
      <input
        type="number"
        value={weeklyTarget}
        onChange={(e) => setWeeklyTarget(Math.max(1, Number(e.target.value)))}
        style={{ ...inp, width: 100 }}
        min={1}
        max={60}
      />
      <p style={{ color: C.textDim, fontSize: "0.78rem", marginTop: 6 }}>
        = {Math.round((weeklyTarget * timeUnitMinutes) / 60 * 10) / 10} heures/semaine de travail suivi
      </p>
      <div style={navRow}>
        <button onClick={() => setStep(3)} style={backBtn}>← Retour</button>
        <button onClick={() => setStep(5)} style={nextBtn}>Suivant →</button>
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
        Vous êtes prêt·e !
      </h2>
      <p style={{ color: C.textSoft, fontSize: "0.95rem", maxWidth: 440, margin: "0 auto 0.5rem" }}>
        <strong style={{ color: C.accent }}>{name || "Mon Tableau de Bord"}</strong> est configuré et prêt à l'emploi.
      </p>
      <p style={{ color: C.textMuted, fontSize: "0.85rem", maxWidth: 440, margin: "0 auto 2rem" }}>
        Vous pouvez tout ajuster à tout moment dans <strong>Paramètres</strong>. C'est parti !
      </p>
      <button onClick={finish} style={{ ...nextBtn, padding: "0.7rem 2rem", fontSize: "1rem" }}>
        Ouvrir le tableau de bord →
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
