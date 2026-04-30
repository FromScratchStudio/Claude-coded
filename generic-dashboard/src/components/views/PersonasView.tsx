import { useState, type ReactNode } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import type { Persona } from "../../types";

function genId() {
  return `persona-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const TONE_OPTIONS = ["Professional", "Casual", "Inspirational", "Technical", "Creative", "Formal", "Conversational"];

export default function PersonasView() {
  const appConfig = useStore((s) => s.appConfig);
  const personas = useStore((s) => s.personas);
  const addPersona = useStore((s) => s.addPersona);
  const updatePersona = useStore((s) => s.updatePersona);
  const removePersona = useStore((s) => s.removePersona);

  const [selectedId, setSelectedId] = useState<string | null>(personas[0]?.id ?? null);
  const [showModal, setShowModal] = useState(false);
  const [editPersona, setEditPersona] = useState<Persona | null>(null);

  // Form state
  const [pCode, setPCode] = useState("");
  const [pName, setPName] = useState("");
  const [pLabel, setPLabel] = useState("");
  const [pColor, setPColor] = useState("#4c7fc9");
  const [pAudience, setPAudience] = useState("");
  const [pRole, setPRole] = useState("");
  const [pDetail, setPDetail] = useState("");
  const [pPersona, setPPersona] = useState("");
  const [pTone, setPTone] = useState("");
  const [pLexicon, setPLexicon] = useState("");
  const [pPlaylist, setPPlaylist] = useState("");

  const selected = personas.find((p) => p.id === selectedId) ?? null;

  function openNew() {
    setEditPersona(null);
    setPCode("");
    setPName("");
    setPLabel("");
    setPColor("#4c7fc9");
    setPAudience("");
    setPRole("");
    setPDetail("");
    setPPersona("");
    setPTone("Professional");
    setPLexicon("");
    setPPlaylist("");
    setShowModal(true);
  }

  function openEdit(persona: Persona) {
    setEditPersona(persona);
    setPCode(persona.code);
    setPName(persona.name);
    setPLabel(persona.label);
    setPColor(persona.color);
    setPAudience(persona.audience);
    setPRole(persona.role);
    setPDetail(persona.detail);
    setPPersona(persona.persona ?? "");
    setPTone(persona.tone ?? "");
    setPLexicon(persona.lexicon ?? "");
    setPPlaylist((persona.playlist ?? []).join("\n"));
    setShowModal(true);
  }

  function save() {
    if (!pName.trim()) return;
    const playlist = pPlaylist.split("\n").map((s) => s.trim()).filter(Boolean);
    if (editPersona) {
      updatePersona(editPersona.id, {
        code: pCode.trim(),
        name: pName.trim(),
        label: pLabel.trim(),
        color: pColor,
        audience: pAudience.trim(),
        role: pRole.trim(),
        detail: pDetail.trim(),
        persona: pPersona.trim(),
        tone: pTone,
        lexicon: pLexicon,
        playlist,
      });
    } else {
      const newPersona: Persona = {
        id: genId(),
        code: pCode.trim(),
        name: pName.trim(),
        label: pLabel.trim(),
        color: pColor,
        audience: pAudience.trim(),
        role: pRole.trim(),
        detail: pDetail.trim(),
        persona: pPersona.trim(),
        tone: pTone,
        lexicon: pLexicon,
        playlist,
        members: [],
        inspirations: [],
      };
      addPersona(newPersona);
      setSelectedId(newPersona.id);
    }
    setShowModal(false);
  }

  const section = (title: string, content: ReactNode) => (
    <div style={{ marginBottom: "1.25rem" }}>
      <div
        style={{
          fontSize: "0.7rem",
          color: C.textDim,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </div>
      {content}
    </div>
  );

  return (
    <div style={{ display: "flex", gap: "1.5rem", minHeight: 600 }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              color: C.textDim,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {appConfig.personasLabel}
          </span>
          <button
            onClick={openNew}
            style={{
              background: "none",
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              color: C.textSoft,
              cursor: "pointer",
              fontSize: "0.78rem",
              padding: "2px 8px",
            }}
          >
            +
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => setSelectedId(persona.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0.55rem 0.75rem",
                background: selectedId === persona.id ? `${persona.color}15` : C.surface,
                border: `1px solid ${selectedId === persona.id ? persona.color + "40" : C.border}`,
                borderRadius: 8,
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: `${persona.color}25`,
                  color: persona.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {persona.code || persona.name.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <div style={{ fontSize: "0.82rem", color: C.text, fontWeight: 500 }}>{persona.name}</div>
                <div style={{ fontSize: "0.7rem", color: C.textDim }}>{persona.label}</div>
              </div>
            </button>
          ))}
          {personas.length === 0 && (
            <p style={{ color: C.textVeryDim, fontSize: "0.82rem", padding: "0.5rem" }}>
              No personas yet
            </p>
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ flex: 1 }}>
        {selected ? (
          <div>
            <SectionTitle
              sub={selected.label}
              action={
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(selected)} style={{ ...btnSecondary, fontSize: "0.8rem" }}>Edit</button>
                  <button
                    onClick={() => {
                      removePersona(selected.id);
                      setSelectedId(personas.find((p) => p.id !== selected.id)?.id ?? null);
                    }}
                    style={{ ...btnDanger, fontSize: "0.8rem" }}
                  >
                    Delete
                  </button>
                </div>
              }
            >
              <span style={{ color: selected.color }}>{selected.code}</span> {selected.name}
            </SectionTitle>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                {section("Audience", <p style={{ color: C.textSoft, fontSize: "0.85rem", margin: 0, lineHeight: 1.6 }}>{selected.audience || <em style={{ color: C.textVeryDim }}>Not defined</em>}</p>)}
                {section("Role", <p style={{ color: C.textSoft, fontSize: "0.85rem", margin: 0, lineHeight: 1.6 }}>{selected.role || <em style={{ color: C.textVeryDim }}>Not defined</em>}</p>)}
                {section("Detail", <p style={{ color: C.textSoft, fontSize: "0.85rem", margin: 0, lineHeight: 1.6 }}>{selected.detail || <em style={{ color: C.textVeryDim }}>Not defined</em>}</p>)}
                {section("Tone", (
                  <span
                    style={{
                      padding: "0.25rem 0.65rem",
                      background: `${selected.color}15`,
                      color: selected.color,
                      borderRadius: 12,
                      fontSize: "0.82rem",
                      fontWeight: 500,
                    }}
                  >
                    {selected.tone || "—"}
                  </span>
                ))}
              </div>

              <div>
                {selected.persona && section("Persona description", <p style={{ color: C.textSoft, fontSize: "0.85rem", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>{selected.persona}</p>)}

                {selected.lexicon && selected.lexicon.length > 0 && section("Lexicon", (
                  <p style={{ color: C.textSoft, fontSize: "0.85rem", margin: 0, lineHeight: 1.7 }}>{selected.lexicon}</p>
                ))}

                {(selected.playlist?.length ?? 0) > 0 && section("Playlist / References", (
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {(selected.playlist ?? []).map((item, i) => (
                      <li key={i} style={{ fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.6 }}>{item}</li>
                    ))}
                  </ul>
                ))}

                {(selected.members?.length ?? 0) > 0 && section(`Members (${selected.members!.length})`, (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {(selected.members ?? []).map((m) => (
                      <div key={m.name} style={{ fontSize: "0.82rem", color: C.textSoft }}>
                        <strong>{m.name}</strong>{m.role ? ` — ${m.role}` : ""}
                      </div>
                    ))}
                  </div>
                ))}

                {(selected.inspirations?.length ?? 0) > 0 && section(`Inspirations (${selected.inspirations!.length})`, (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {(selected.inspirations ?? []).map((ins) => (
                      <div key={ins.name} style={{ fontSize: "0.82rem", color: C.textSoft }}>
                        <strong>{ins.name}</strong>{ins.contribution ? <span style={{ color: C.textDim }}> · {ins.contribution}</span> : ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem", color: C.textDim }}>
            <p>Select a persona from the sidebar or create a new one.</p>
            <button onClick={openNew} style={btnPrimary}>+ New {appConfig.personasLabel.replace(/s$/, "")}</button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editPersona ? "Edit Persona" : "New Persona"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input value={pName} onChange={(e) => setPName(e.target.value)} style={inputStyle} autoFocus />
          </div>
          <div>
            <label style={labelStyle}>Code (short)</label>
            <input value={pCode} onChange={(e) => setPCode(e.target.value)} style={inputStyle} placeholder="BV" maxLength={4} />
          </div>
          <div>
            <label style={labelStyle}>Color</label>
            <input type="color" value={pColor} onChange={(e) => setPColor(e.target.value)} style={{ width: 40, height: 38, border: "none", background: "none", cursor: "pointer" }} />
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Label / subtitle</label>
          <input value={pLabel} onChange={(e) => setPLabel(e.target.value)} style={inputStyle} placeholder="Brand Voice" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Audience</label>
          <input value={pAudience} onChange={(e) => setPAudience(e.target.value)} style={inputStyle} placeholder="Who this persona speaks to" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Role</label>
          <input value={pRole} onChange={(e) => setPRole(e.target.value)} style={inputStyle} placeholder="Function within the strategy" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Detail</label>
          <input value={pDetail} onChange={(e) => setPDetail(e.target.value)} style={inputStyle} placeholder="Short description" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Persona description</label>
          <textarea value={pPersona} onChange={(e) => setPPersona(e.target.value)} style={{ ...inputStyle, height: 70, resize: "vertical" }} placeholder="Longer description / archetype" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Tone</label>
          <select value={pTone} onChange={(e) => setPTone(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {TONE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Lexicon (comma-separated)</label>
          <input value={pLexicon} onChange={(e) => setPLexicon(e.target.value)} style={inputStyle} placeholder="word1, word2, word3" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Playlist / references (one per line)</label>
          <textarea value={pPlaylist} onChange={(e) => setPPlaylist(e.target.value)} style={{ ...inputStyle, height: 60, resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editPersona && <button onClick={() => { removePersona(editPersona.id); setShowModal(false); setSelectedId(null); }} style={btnDanger}>Delete</button>}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={save} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
