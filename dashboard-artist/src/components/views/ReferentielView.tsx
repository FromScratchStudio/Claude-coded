import { useState, useId } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import type { Heteronym, HeteronymMember, Inspiration } from "../../types";

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  background: C.surfaceAlt,
  border: `1px solid ${C.border}`,
  color: C.text,
  borderRadius: 6,
  padding: "0.35rem 0.55rem",
  fontSize: "0.78rem",
  fontFamily: FONT.body,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const monoLabel: React.CSSProperties = {
  display: "block",
  fontSize: "0.6rem",
  color: C.textDim,
  fontFamily: FONT.mono,
  marginBottom: "0.2rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

// ─── Editable text field ──────────────────────────────────────────────────────
function Field({
  label,
  value,
  multiline,
  mono,
  onChange,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  mono?: boolean;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div style={{ marginBottom: "0.65rem" }}>
      <label htmlFor={id} style={monoLabel}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={{ ...inputBase, resize: "vertical", fontFamily: mono ? FONT.mono : FONT.body, fontSize: mono ? "0.7rem" : "0.78rem" }}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputBase, fontFamily: mono ? FONT.mono : FONT.body }}
        />
      )}
    </div>
  );
}

// ─── Playlist editor ──────────────────────────────────────────────────────────
function PlaylistEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const t = draft.trim();
    if (!t) return;
    onChange([...items, t]);
    setDraft("");
  }

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.4rem" }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: C.bg, borderRadius: 5, padding: "0.3rem 0.5rem" }}>
            <span style={{ flex: 1, fontSize: "0.72rem", color: C.textSoft }}>{item}</span>
            <button
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.8rem", padding: "0 0.2rem", flexShrink: 0 }}
            >×</button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Ajouter un élément…"
          style={{ ...inputBase, flex: 1 }}
        />
        <button
          onClick={add}
          style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textSoft, borderRadius: 6, padding: "0.35rem 0.65rem", fontFamily: FONT.mono, fontSize: "0.65rem", cursor: "pointer" }}
        >+ Ajouter</button>
      </div>
    </div>
  );
}

// ─── Inspirations editor ──────────────────────────────────────────────────────
function InspirationsEditor({
  items,
  color,
  onChange,
}: {
  items: Inspiration[];
  color: string;
  onChange: (items: Inspiration[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const blankInsp: Inspiration = { nom: "", oeuvre: "", apport: "" };
  const [draft, setDraft] = useState<Inspiration>(blankInsp);
  const formId = useId();

  function saveAdd() {
    if (!draft.nom.trim()) return;
    onChange([...items, draft]);
    setDraft(blankInsp);
    setAdding(false);
  }

  function saveEdit(idx: number) {
    onChange(items.map((it, i) => (i === idx ? draft : it)));
    setEditIdx(null);
  }

  const rowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    gap: "0.6rem",
    padding: "0.45rem 0.5rem",
    background: C.bg,
    borderRadius: 6,
    marginBottom: "0.3rem",
  };

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      {items.map((insp, idx) => (
        editIdx === idx ? (
          <div key={idx} style={{ ...rowStyle, background: C.surfaceAlt, gridTemplateColumns: "1fr" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                <div>
                  <label htmlFor={`${formId}-nom-${idx}`} style={monoLabel}>Nom</label>
                  <input id={`${formId}-nom-${idx}`} value={draft.nom} onChange={(e) => setDraft({ ...draft, nom: e.target.value })} style={inputBase} autoFocus />
                </div>
                <div>
                  <label htmlFor={`${formId}-oeuvre-${idx}`} style={monoLabel}>Œuvre / référence</label>
                  <input id={`${formId}-oeuvre-${idx}`} value={draft.oeuvre} onChange={(e) => setDraft({ ...draft, oeuvre: e.target.value })} style={inputBase} />
                </div>
              </div>
              <div>
                <label htmlFor={`${formId}-apport-${idx}`} style={monoLabel}>Apport</label>
                <input id={`${formId}-apport-${idx}`} value={draft.apport} onChange={(e) => setDraft({ ...draft, apport: e.target.value })} style={inputBase} />
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button onClick={() => saveEdit(idx)} style={{ background: C.gold, color: "#000", border: "none", borderRadius: 5, padding: "0.25rem 0.65rem", fontFamily: FONT.mono, fontSize: "0.65rem", cursor: "pointer", fontWeight: "bold" }}>Enregistrer</button>
                <button onClick={() => setEditIdx(null)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 5, padding: "0.25rem 0.65rem", fontFamily: FONT.mono, fontSize: "0.65rem", cursor: "pointer" }}>Annuler</button>
              </div>
            </div>
          </div>
        ) : (
          <div key={idx} style={rowStyle}>
            <div>
              <div style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color }}>{insp.nom}</div>
              <div style={{ fontSize: "0.62rem", color: C.textDim, fontStyle: "italic" }}>{insp.oeuvre}</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
              <span style={{ flex: 1, fontSize: "0.7rem", color: C.textSoft, lineHeight: 1.4 }}>{insp.apport}</span>
              <button onClick={() => { setDraft(insp); setEditIdx(idx); setAdding(false); }} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.72rem", padding: "0 0.15rem", flexShrink: 0 }}>✎</button>
              <button onClick={() => onChange(items.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.78rem", padding: "0 0.15rem", flexShrink: 0 }}>×</button>
            </div>
          </div>
        )
      ))}

      {adding && (
        <div style={{ ...rowStyle, background: C.surfaceAlt, gridTemplateColumns: "1fr" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
              <div>
                <label htmlFor={`${formId}-nom-new`} style={monoLabel}>Nom</label>
                <input id={`${formId}-nom-new`} value={draft.nom} onChange={(e) => setDraft({ ...draft, nom: e.target.value })} style={inputBase} autoFocus />
              </div>
              <div>
                <label htmlFor={`${formId}-oeuvre-new`} style={monoLabel}>Œuvre / référence</label>
                <input id={`${formId}-oeuvre-new`} value={draft.oeuvre} onChange={(e) => setDraft({ ...draft, oeuvre: e.target.value })} style={inputBase} />
              </div>
            </div>
            <div>
              <label htmlFor={`${formId}-apport-new`} style={monoLabel}>Apport</label>
              <input id={`${formId}-apport-new`} value={draft.apport} onChange={(e) => setDraft({ ...draft, apport: e.target.value })} style={inputBase} />
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button onClick={saveAdd} style={{ background: C.gold, color: "#000", border: "none", borderRadius: 5, padding: "0.25rem 0.65rem", fontFamily: FONT.mono, fontSize: "0.65rem", cursor: "pointer", fontWeight: "bold" }}>Ajouter</button>
              <button onClick={() => { setAdding(false); setDraft(blankInsp); }} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 5, padding: "0.25rem 0.65rem", fontFamily: FONT.mono, fontSize: "0.65rem", cursor: "pointer" }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
      {!adding && editIdx === null && (
        <button
          onClick={() => { setDraft(blankInsp); setAdding(true); setEditIdx(null); }}
          style={{ background: "none", border: `1px dashed ${color}44`, color, borderRadius: 5, padding: "0.2rem 0.6rem", fontFamily: FONT.mono, fontSize: "0.6rem", cursor: "pointer", letterSpacing: "0.05em" }}
        >+ Ajouter une inspiration</button>
      )}
    </div>
  );
}

// ─── Members editor ───────────────────────────────────────────────────────────
function MembersEditor({
  items,
  color,
  onChange,
}: {
  items: HeteronymMember[];
  color: string;
  onChange: (items: HeteronymMember[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const blankMember: HeteronymMember = { name: "", role: "", voice: "", refs: "" };
  const [draft, setDraft] = useState<HeteronymMember>(blankMember);
  const formId = useId();

  function saveAdd() {
    if (!draft.name.trim()) return;
    onChange([...items, draft]);
    setDraft(blankMember);
    setAdding(false);
  }
  function saveEdit(idx: number) {
    onChange(items.map((it, i) => (i === idx ? draft : it)));
    setEditIdx(null);
  }

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.6rem", marginBottom: "0.5rem" }}>
        {items.map((member, idx) => (
          editIdx === idx ? (
            <div key={idx} style={{ background: C.surfaceAlt, borderRadius: 8, padding: "0.75rem", border: `1px solid ${color}30`, gridColumn: "1 / -1" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.4rem" }}>
                <div>
                  <label htmlFor={`${formId}-mname-${idx}`} style={monoLabel}>Nom</label>
                  <input id={`${formId}-mname-${idx}`} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} style={inputBase} autoFocus />
                </div>
                <div>
                  <label htmlFor={`${formId}-mrole-${idx}`} style={monoLabel}>Rôle</label>
                  <input id={`${formId}-mrole-${idx}`} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} style={inputBase} />
                </div>
              </div>
              <div style={{ marginBottom: "0.4rem" }}>
                <label htmlFor={`${formId}-mvoice-${idx}`} style={monoLabel}>Voix / Persona</label>
                <input id={`${formId}-mvoice-${idx}`} value={draft.voice} onChange={(e) => setDraft({ ...draft, voice: e.target.value })} style={inputBase} />
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <label htmlFor={`${formId}-mrefs-${idx}`} style={monoLabel}>Références</label>
                <input id={`${formId}-mrefs-${idx}`} value={draft.refs} onChange={(e) => setDraft({ ...draft, refs: e.target.value })} style={inputBase} />
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button onClick={() => saveEdit(idx)} style={{ background: C.gold, color: "#000", border: "none", borderRadius: 5, padding: "0.25rem 0.65rem", fontFamily: FONT.mono, fontSize: "0.65rem", cursor: "pointer", fontWeight: "bold" }}>Enregistrer</button>
                <button onClick={() => setEditIdx(null)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 5, padding: "0.25rem 0.65rem", fontFamily: FONT.mono, fontSize: "0.65rem", cursor: "pointer" }}>Annuler</button>
              </div>
            </div>
          ) : (
            <div key={idx} style={{ background: C.bg, borderRadius: 8, padding: "0.75rem", border: `1px solid ${color}25` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.3rem" }}>
                <div style={{ fontFamily: FONT.display, fontSize: "0.9rem", color }}>{member.name}</div>
                <div style={{ display: "flex", gap: "0.1rem" }}>
                  <button onClick={() => { setDraft(member); setEditIdx(idx); setAdding(false); }} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.72rem", padding: "0 0.15rem" }}>✎</button>
                  <button onClick={() => onChange(items.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.78rem", padding: "0 0.15rem" }}>×</button>
                </div>
              </div>
              <div style={{ fontSize: "0.65rem", color: C.textMuted, marginBottom: "0.5rem" }}>{member.role}</div>
              <div style={{ fontSize: "0.68rem", color: C.textSoft, fontStyle: "italic", marginBottom: "0.4rem" }}>"{member.voice}"</div>
              <div style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: FONT.mono }}>{member.refs}</div>
            </div>
          )
        ))}
      </div>
      {adding && (
        <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: "0.75rem", border: `1px solid ${color}44`, marginBottom: "0.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.4rem" }}>
            <div>
              <label htmlFor={`${formId}-mname-new`} style={monoLabel}>Nom</label>
              <input id={`${formId}-mname-new`} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} style={inputBase} autoFocus />
            </div>
            <div>
              <label htmlFor={`${formId}-mrole-new`} style={monoLabel}>Rôle</label>
              <input id={`${formId}-mrole-new`} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} style={inputBase} />
            </div>
          </div>
          <div style={{ marginBottom: "0.4rem" }}>
            <label htmlFor={`${formId}-mvoice-new`} style={monoLabel}>Voix / Persona</label>
            <input id={`${formId}-mvoice-new`} value={draft.voice} onChange={(e) => setDraft({ ...draft, voice: e.target.value })} style={inputBase} />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label htmlFor={`${formId}-mrefs-new`} style={monoLabel}>Références</label>
            <input id={`${formId}-mrefs-new`} value={draft.refs} onChange={(e) => setDraft({ ...draft, refs: e.target.value })} style={inputBase} />
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button onClick={saveAdd} style={{ background: C.gold, color: "#000", border: "none", borderRadius: 5, padding: "0.25rem 0.65rem", fontFamily: FONT.mono, fontSize: "0.65rem", cursor: "pointer", fontWeight: "bold" }}>Ajouter</button>
            <button onClick={() => { setAdding(false); setDraft(blankMember); }} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 5, padding: "0.25rem 0.65rem", fontFamily: FONT.mono, fontSize: "0.65rem", cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}
      {!adding && editIdx === null && (
        <button
          onClick={() => { setDraft(blankMember); setAdding(true); setEditIdx(null); }}
          style={{ background: "none", border: `1px dashed ${color}44`, color, borderRadius: 5, padding: "0.2rem 0.6rem", fontFamily: FONT.mono, fontSize: "0.6rem", cursor: "pointer", letterSpacing: "0.05em" }}
        >+ Ajouter un membre</button>
      )}
    </div>
  );
}

// ─── Heteronym detail (read view) ─────────────────────────────────────────────
function HeteronymReadView({ h }: { h: Heteronym }) {
  return (
    <div>
      <p style={{ fontSize: "0.78rem", color: C.textSoft, lineHeight: 1.6, margin: "0 0 1rem" }}>{h.detail}</p>

      {h.members && h.members.length > 0 && (
        <>
          <SectionTitle accent={h.color}>Membres</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
            {h.members.map((member) => (
              <div key={member.name} style={{ background: C.bg, borderRadius: 8, padding: "0.75rem", border: `1px solid ${h.color}25` }}>
                <div style={{ fontFamily: FONT.display, fontSize: "0.9rem", color: h.color, marginBottom: "0.3rem" }}>{member.name}</div>
                <div style={{ fontSize: "0.65rem", color: C.textMuted, marginBottom: "0.5rem" }}>{member.role}</div>
                <div style={{ fontSize: "0.68rem", color: C.textSoft, fontStyle: "italic", marginBottom: "0.4rem" }}>"{member.voice}"</div>
                <div style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: FONT.mono }}>{member.refs}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {h.inspirations && h.inspirations.length > 0 && (
        <>
          <SectionTitle accent={h.color}>Inspirations</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            {h.inspirations.map((insp) => (
              <div key={insp.nom} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.75rem", padding: "0.5rem", background: C.bg, borderRadius: 6 }}>
                <div>
                  <div style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: h.color }}>{insp.nom}</div>
                  <div style={{ fontSize: "0.62rem", color: C.textDim, fontStyle: "italic" }}>{insp.oeuvre}</div>
                </div>
                <div style={{ fontSize: "0.7rem", color: C.textSoft, lineHeight: 1.4 }}>{insp.apport}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {h.lexique && (
        <>
          <SectionTitle accent={C.textDim}>Lexique</SectionTitle>
          <p style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.textMuted, lineHeight: 1.8, margin: "0 0 1rem" }}>{h.lexique}</p>
        </>
      )}

      {h.playlist && h.playlist.length > 0 && (
        <>
          <SectionTitle accent={C.textDim}>Playlist / Références</SectionTitle>
          <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {h.playlist.map((item) => (
              <li key={item} style={{ fontSize: "0.7rem", color: C.textSoft }}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {(h.persona || h.ton) && (
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {h.persona && (
            <div style={{ padding: "0.5rem 0.75rem", background: `${h.color}10`, borderRadius: 6, borderLeft: `2px solid ${h.color}` }}>
              <p style={{ fontSize: "0.7rem", color: C.textSoft, margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>{h.persona}</p>
            </div>
          )}
          {h.ton && (
            <div style={{ padding: "0.4rem 0.75rem", background: C.bg, borderRadius: 6 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.textDim, display: "block", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>Ton</span>
              <p style={{ fontFamily: FONT.display, fontSize: "0.82rem", color: h.color, margin: 0, fontStyle: "italic" }}>"{h.ton}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Heteronym detail (edit view) ─────────────────────────────────────────────
function HeteronymEditView({
  h,
  onSave,
  onCancel,
}: {
  h: Heteronym;
  onSave: (updates: Partial<Heteronym>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(h.name);
  const [label, setLabel] = useState(h.label);
  const [publicStr, setPublicStr] = useState(h.public);
  const [role, setRole] = useState(h.role);
  const [detail, setDetail] = useState(h.detail);
  const [persona, setPersona] = useState(h.persona ?? "");
  const [ton, setTon] = useState(h.ton ?? "");
  const [lexique, setLexique] = useState(h.lexique ?? "");
  const [playlist, setPlaylist] = useState<string[]>(h.playlist ?? []);
  const [inspirations, setInspirations] = useState<Inspiration[]>(h.inspirations ?? []);
  const [members, setMembers] = useState<HeteronymMember[]>(h.members ?? []);

  function handleSave() {
    onSave({
      name,
      label,
      public: publicStr,
      role,
      detail,
      persona: persona || undefined,
      ton: ton || undefined,
      lexique: lexique || undefined,
      playlist: playlist.length > 0 ? playlist : undefined,
      inspirations: inspirations.length > 0 ? inspirations : undefined,
      members: members.length > 0 ? members : undefined,
    });
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
        <Field label="Nom" value={name} onChange={setName} />
        <Field label="Label / Sous-titre" value={label} onChange={setLabel} />
        <Field label="Visibilité" value={publicStr} onChange={setPublicStr} />
        <Field label="Rôle" value={role} onChange={setRole} />
      </div>
      <Field label="Description détaillée" value={detail} multiline onChange={setDetail} />
      <Field label="Persona" value={persona} multiline onChange={setPersona} />
      <Field label="Ton" value={ton} onChange={setTon} />
      <Field label="Lexique (mots-clés séparés par ·)" value={lexique} mono multiline onChange={setLexique} />

      <SectionTitle accent={C.textDim}>Playlist / Références</SectionTitle>
      <PlaylistEditor items={playlist} onChange={setPlaylist} />

      <SectionTitle accent={h.color}>Inspirations</SectionTitle>
      <InspirationsEditor items={inspirations} color={h.color} onChange={setInspirations} />

      {(members.length > 0 || h.members !== undefined) && (
        <>
          <SectionTitle accent={h.color}>Membres</SectionTitle>
          <MembersEditor items={members} color={h.color} onChange={setMembers} />
        </>
      )}

      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem", paddingTop: "1rem", borderTop: `1px solid ${C.border}` }}>
        <button onClick={onCancel} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.7rem" }}>
          Annuler
        </button>
        <button onClick={handleSave} style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.7rem", fontWeight: "bold" }}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function ReferentielView() {
  const heteronymData = useStore((s) => s.heteronymData);
  const updateHeteronym = useStore((s) => s.updateHeteronym);

  const [selectedId, setSelectedId] = useState<string>(heteronymData[0]?.id ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);

  const selected = heteronymData.find((h) => h.id === selectedId) ?? heteronymData[0];

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Référentiel des régimes de signature</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Cinq régimes — aucun glissement sans décision documentée
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.25rem", alignItems: "start" }}>
        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {heteronymData.map((h) => {
            const isSelected = selectedId === h.id;
            return (
              <Card
                key={h.id}
                onClick={() => { setSelectedId(h.id); setEditingId(null); }}
                style={{
                  padding: "0.75rem",
                  cursor: "pointer",
                  borderLeft: `3px solid ${isSelected ? h.color : "transparent"}`,
                  background: isSelected ? C.surfaceAlt : C.surface,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: h.color, background: `${h.color}18`, borderRadius: 4, padding: "0.1rem 0.35rem" }}>
                    Rég. {h.code}
                  </span>
                  <span style={{ fontFamily: FONT.display, fontSize: "0.9rem", color: isSelected ? h.color : C.text }}>{h.name}</span>
                </div>
                <p style={{ fontSize: "0.65rem", color: C.textDim, margin: 0, lineHeight: 1.4 }}>{h.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontFamily: FONT.mono, fontSize: "0.75rem", color: selected.color, background: `${selected.color}18`, borderRadius: 6, padding: "0.2rem 0.6rem" }}>
                  Régime {selected.code}
                </span>
                <div>
                  <div style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: selected.color }}>{selected.name}</div>
                  <div style={{ fontSize: "0.68rem", color: C.textMuted }}>{selected.label}</div>
                </div>
              </div>
              {editingId !== selected.id && (
                <button
                  onClick={() => setEditingId(selected.id)}
                  style={{
                    background: C.surfaceAlt,
                    border: `1px solid ${C.border}`,
                    color: C.textMuted,
                    borderRadius: 6,
                    padding: "0.3rem 0.75rem",
                    fontFamily: FONT.mono,
                    fontSize: "0.68rem",
                    cursor: "pointer",
                  }}
                >
                  ✎ Modifier
                </button>
              )}
            </div>

            {editingId !== selected.id && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1rem" }}>
                <div style={{ padding: "0.4rem 0.6rem", background: C.bg, borderRadius: 6 }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: 2, textTransform: "uppercase" }}>Visibilité</span>
                  <span style={{ fontSize: "0.72rem", color: C.textSoft }}>{selected.public}</span>
                </div>
                <div style={{ padding: "0.4rem 0.6rem", background: C.bg, borderRadius: 6 }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: 2, textTransform: "uppercase" }}>Rôle</span>
                  <span style={{ fontSize: "0.72rem", color: C.textSoft }}>{selected.role}</span>
                </div>
              </div>
            )}

            {editingId === selected.id ? (
              <HeteronymEditView
                h={selected}
                onSave={(updates) => {
                  updateHeteronym(selected.id, updates);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <HeteronymReadView h={selected} />
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

