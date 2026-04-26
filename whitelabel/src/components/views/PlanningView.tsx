import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import type { Planning } from "../../types";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";

const FIELDS: { key: keyof Planning; label: string; multiline?: boolean }[] = [
  { key: "period", label: "Period" },
  { key: "objective", label: "Objective", multiline: true },
  { key: "arc", label: "Strategic Arc" },
  { key: "arcEnd", label: "Arc End Condition", multiline: true },
  { key: "focalTool", label: "Focal Tool" },
  { key: "redZones", label: "Red Zones", multiline: true },
  { key: "singleRule", label: "Single Rule", multiline: true },
];

const iStyle: React.CSSProperties = {
  background: C.surfaceAlt,
  border: `1px solid ${C.border}`,
  color: C.text,
  borderRadius: 5,
  padding: "0.35rem 0.55rem",
  fontSize: "0.82rem",
  fontFamily: FONT.body,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  resize: "vertical",
};

function btn(color: string): React.CSSProperties {
  return {
    background: `${color}22`,
    border: `1px solid ${color}44`,
    color,
    borderRadius: 5,
    padding: "0.3rem 0.75rem",
    fontSize: "0.65rem",
    fontFamily: FONT.mono,
    cursor: "pointer",
  };
}

export default function PlanningView() {
  const planning = useStore((s) => s.planning);
  const updatePlanning = useStore((s) => s.updatePlanning);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Planning>(planning);

  function startEdit() { setDraft(planning); setEditing(true); }
  function save() { updatePlanning(draft); setEditing(false); }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Planning</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Quarterly execution plan
          </p>
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={save} style={btn(C.green)}>✓ Save</button>
            <button onClick={() => setEditing(false)} style={btn(C.textDim)}>Cancel</button>
          </div>
        ) : (
          <button onClick={startEdit} style={btn(C.gold)}>✎ Edit</button>
        )}
      </div>

      <Card>
        <SectionTitle accent={C.gold}>{planning.period || "Quarterly Plan"}</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {FIELDS.map(({ key, label, multiline }) => (
            <div key={key}>
              <div style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                {label}
              </div>
              {editing ? (
                multiline ? (
                  <textarea
                    value={draft[key]}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                    rows={3}
                    style={iStyle}
                  />
                ) : (
                  <input
                    value={draft[key]}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                    style={iStyle}
                  />
                )
              ) : (
                <div style={{ fontSize: "0.82rem", color: C.textSoft, fontFamily: FONT.body, lineHeight: 1.65 }}>
                  {planning[key] || <span style={{ color: C.textVeryDim, fontStyle: "italic" }}>Not set</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
