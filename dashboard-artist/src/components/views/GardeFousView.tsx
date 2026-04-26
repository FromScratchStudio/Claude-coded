import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import { DEGRADED_MODES, PRINCIPLES, TRAPS, COLLAB_CHECKLIST, BUILD_BUDGETS } from "../../data/principles";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";

type Tab = "modes" | "principles" | "traps" | "collab" | "budget";

export default function GardeFousView() {
  const degradedMode = useStore((s) => s.degradedMode);
  const setDegradedMode = useStore((s) => s.setDegradedMode);

  const [activeTab, setActiveTab] = useState<Tab>("modes");
  const [collabChecked, setCollabChecked] = useState<Record<number, boolean>>({});

  const tabs: { id: Tab; label: string }[] = [
    { id: "modes", label: "Modes dégradés" },
    { id: "principles", label: "11 principes" },
    { id: "traps", label: "10 pièges" },
    { id: "collab", label: "Checklist collab" },
    { id: "budget", label: "Budget construction" },
  ];

  const collabScore = Object.values(collabChecked).filter(Boolean).length;

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Garde-fous</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Protocoles de protection — principes, pièges, modes dégradés
        </p>
      </div>

      {/* Sub-navigation */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? C.surfaceAlt : "transparent",
              border: `1px solid ${activeTab === tab.id ? C.borderLight : C.border}`,
              color: activeTab === tab.id ? C.text : C.textDim,
              padding: "0.3rem 0.75rem",
              borderRadius: 6,
              fontSize: "0.7rem",
              cursor: "pointer",
              fontFamily: FONT.mono,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Modes dégradés */}
      {activeTab === "modes" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {/* Normal mode */}
          <Card
            onClick={() => setDegradedMode(null)}
            style={{ borderLeft: `3px solid ${!degradedMode ? C.green : C.border}`, cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
              {!degradedMode && <span style={{ color: C.green, fontSize: "0.9rem" }}>●</span>}
              <span style={{ fontFamily: FONT.display, fontSize: "0.95rem", color: !degradedMode ? C.green : C.text }}>Régime normal</span>
            </div>
            <p style={{ fontSize: "0.7rem", color: C.textSoft, margin: 0, lineHeight: 1.5 }}>
              Rythme soir/week-end standard. Production régulière. Banque d'avance maintenue.
            </p>
          </Card>

          {DEGRADED_MODES.map((mode) => {
            const isActive = degradedMode === mode.id;
            return (
              <Card
                key={mode.id}
                onClick={() => setDegradedMode(mode.id)}
                style={{ borderLeft: `3px solid ${isActive ? mode.color : C.border}`, cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  {isActive && <span style={{ color: mode.color, fontSize: "0.9rem", animation: "pulse 1.5s infinite" }}>●</span>}
                  <span style={{ fontFamily: FONT.display, fontSize: "0.95rem", color: isActive ? mode.color : C.text }}>{mode.label}</span>
                </div>
                <p style={{ fontSize: "0.65rem", color: C.textMuted, margin: "0 0 0.65rem", fontStyle: "italic" }}>{mode.trigger}</p>
                <SectionTitle accent={C.textDim}>Règles</SectionTitle>
                <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {mode.rules.map((rule, i) => (
                    <li key={i} style={{ fontSize: "0.7rem", color: C.textSoft, lineHeight: 1.45 }}>{rule}</li>
                  ))}
                </ul>
                <div style={{ marginTop: "0.65rem", padding: "0.4rem 0.5rem", background: `${mode.color}12`, borderRadius: 4, border: `1px solid ${mode.color}30` }}>
                  <p style={{ fontSize: "0.65rem", color: mode.color, margin: 0, fontFamily: FONT.mono }}>
                    → Sortie : {mode.exit}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Principles */}
      {activeTab === "principles" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {PRINCIPLES.map((principle) => (
            <Card key={principle.n}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ fontFamily: FONT.display, fontSize: "1.4rem", color: C.gold, lineHeight: 1, minWidth: 28 }}>{principle.n}</span>
                <div>
                  <p style={{ fontSize: "0.82rem", color: C.text, margin: 0, marginBottom: principle.note || principle.quote ? "0.4rem" : 0, lineHeight: 1.5 }}>
                    {principle.text}
                  </p>
                  {principle.note && (
                    <p style={{ fontSize: "0.65rem", color: C.textMuted, margin: 0, fontStyle: "italic", lineHeight: 1.4 }}>
                      {principle.note}
                    </p>
                  )}
                  {principle.quote && (
                    <p style={{ fontSize: "0.7rem", color: C.gold, margin: "0.3rem 0 0", fontStyle: "italic", fontFamily: FONT.display }}>
                      "{principle.quote}"
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Traps */}
      {activeTab === "traps" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {TRAPS.map((trap, i) => (
            <Card key={i}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <span style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: C.red, minWidth: 22, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p style={{ fontFamily: FONT.mono, fontSize: "0.72rem", color: C.red, letterSpacing: "0.05em", margin: 0, marginBottom: "0.35rem" }}>{trap.label}</p>
                  <p style={{ fontSize: "0.75rem", color: C.textSoft, margin: 0, lineHeight: 1.45 }}>{trap.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Collab checklist */}
      {activeTab === "collab" && (
        <div>
          <Card style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <SectionTitle accent={C.cyan}>Checklist de collaboration</SectionTitle>
              <div style={{ fontFamily: FONT.mono, fontSize: "0.75rem", color: collabScore >= 6 ? C.green : collabScore >= 4 ? C.amber : C.red }}>
                {collabScore}/{COLLAB_CHECKLIST.length} {collabScore >= 6 ? "✓ Acceptable" : collabScore >= 4 ? "~ Prudence" : "✗ Revoir"}
              </div>
            </div>
            <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0 0 1rem", fontStyle: "italic" }}>
              Avant toute collaboration, répondre à ces 8 questions. Si moins de 6 oui : décliner ou renégocier.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {COLLAB_CHECKLIST.map((item, i) => (
                <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={collabChecked[i] ?? false}
                    onChange={() => setCollabChecked((prev) => ({ ...prev, [i]: !prev[i] }))}
                    style={{ accentColor: C.cyan, marginTop: 3, flexShrink: 0 }}
                  />
                  <div>
                    <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.cyan, letterSpacing: "0.08em", display: "block", marginBottom: 2 }}>{item.q}</span>
                    <span style={{ fontSize: "0.75rem", color: collabChecked[i] ? C.textDim : C.textSoft, textDecoration: collabChecked[i] ? "line-through" : "none" }}>{item.text}</span>
                  </div>
                </label>
              ))}
            </div>
            <button
              onClick={() => setCollabChecked({})}
              style={{ marginTop: "1rem", background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.3rem 0.75rem", cursor: "pointer", fontSize: "0.65rem", fontFamily: FONT.mono }}
            >
              Réinitialiser
            </button>
          </Card>
        </div>
      )}

      {/* Build budget */}
      {activeTab === "budget" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {BUILD_BUDGETS.map((budget) => (
            <Card key={budget.phase} style={{ borderLeft: `3px solid ${budget.color}` }}>
              <div style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: budget.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                {budget.phase}
              </div>
              <div style={{ fontFamily: FONT.display, fontSize: "0.9rem", color: C.text, marginBottom: "0.5rem" }}>{budget.months}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: "2rem", color: budget.color, fontWeight: "bold" }}>
                {budget.maxHours}h
              </div>
              <div style={{ fontSize: "0.7rem", color: C.textMuted }}>
                budget construction max
              </div>
              <div style={{ marginTop: "0.75rem", fontSize: "0.65rem", color: C.textDim, lineHeight: 1.5 }}>
                Infrastructure, outils, automatisations — budget cumulé pour cette phase.
                Ne jamais dépasser au risque de laisser l'ingénieur·e cannibaliser l'artiste.
              </div>
            </Card>
          ))}
          <Card style={{ background: `linear-gradient(135deg, ${C.surface}, #1a0f2e)` }}>
            <SectionTitle accent={C.gold}>Règle d'or</SectionTitle>
            <p style={{ fontSize: "0.82rem", color: C.text, fontFamily: FONT.display, lineHeight: 1.6, margin: 0 }}>
              Tu construis des outils <em>pour</em> créer, pas <em>au lieu de</em> créer.
            </p>
            <p style={{ fontSize: "0.65rem", color: C.textDim, margin: "0.5rem 0 0", fontFamily: FONT.mono, letterSpacing: "0.08em" }}>
              PRINCIPE VIII — MÉTHODE UNIFIÉE
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
