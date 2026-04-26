import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import type { Entity } from "../../types";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

const iStyle: React.CSSProperties = {
  background: C.surfaceAlt,
  border: `1px solid ${C.border}`,
  color: C.text,
  borderRadius: 5,
  padding: "0.35rem 0.55rem",
  fontSize: "0.78rem",
  fontFamily: FONT.body,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

function btn(color: string): React.CSSProperties {
  return {
    background: `${color}22`,
    border: `1px solid ${color}44`,
    color,
    borderRadius: 5,
    padding: "0.25rem 0.65rem",
    fontSize: "0.65rem",
    fontFamily: FONT.mono,
    cursor: "pointer",
  };
}

function Field({ label, value, multiline, onChange }: { label: string; value: string; multiline?: boolean; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ fontFamily: FONT.mono, fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{label}</div>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={{ ...iStyle, resize: "vertical" }} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} style={iStyle} />
      )}
    </div>
  );
}

// ─── Entity form ──────────────────────────────────────────────────────────────
function EntityForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Entity>;
  onSave: (e: Entity) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [color, setColor] = useState(initial?.color ?? "#06b6d4");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [contact, setContact] = useState(initial?.contact ?? "");
  const [tagsRaw, setTagsRaw] = useState((initial?.tags ?? []).join(", "));
  const [notes, setNotes] = useState(initial?.notes ?? "");

  function save() {
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? `en-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      color,
      description: description.trim(),
      contact: contact.trim(),
      tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      notes: notes.trim(),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <Field label="Name *" value={name} onChange={setName} />
        <Field label="Role" value={role} onChange={setRole} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim }}>Accent color</span>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 36, height: 28, border: "none", background: "none", cursor: "pointer" }} />
        <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color }}>{color}</span>
      </div>
      <Field label="Description" value={description} onChange={setDescription} multiline />
      <Field label="Contact" value={contact} onChange={setContact} />
      <Field label="Tags (comma-separated)" value={tagsRaw} onChange={setTagsRaw} />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={save} style={btn(C.green)}>✓ Save</button>
        <button onClick={onCancel} style={btn(C.textDim)}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Entity read view ─────────────────────────────────────────────────────────
function EntityReadView({ entity }: { entity: Entity }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {entity.description && (
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: entity.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Description</div>
          <p style={{ fontSize: "0.78rem", color: C.textSoft, fontFamily: FONT.body, lineHeight: 1.6, margin: 0 }}>{entity.description}</p>
        </div>
      )}
      {entity.contact && (
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: entity.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Contact</div>
          <p style={{ fontSize: "0.78rem", color: C.textSoft, fontFamily: FONT.body, margin: 0 }}>{entity.contact}</p>
        </div>
      )}
      {entity.tags.length > 0 && (
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: entity.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Tags</div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {entity.tags.map((tag) => <Badge key={tag} color={entity.color}>{tag}</Badge>)}
          </div>
        </div>
      )}
      {entity.notes && (
        <div style={{ padding: "0.75rem", background: `${entity.color}10`, border: `1px solid ${entity.color}25`, borderRadius: 8 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: entity.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Notes</div>
          <p style={{ fontSize: "0.75rem", color: C.textSoft, fontFamily: FONT.body, lineHeight: 1.6, margin: 0 }}>{entity.notes}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function ReferentielView() {
  const entities = useStore((s) => s.entities);
  const addEntity = useStore((s) => s.addEntity);
  const updateEntity = useStore((s) => s.updateEntity);
  const removeEntity = useStore((s) => s.removeEntity);

  const [selectedId, setSelectedId] = useState<string | null>(entities[0]?.id ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const selected = entities.find((e) => e.id === selectedId);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Referentiel</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Key entities, stakeholders and relationships
          </p>
        </div>
        <button onClick={() => { setAdding(true); setSelectedId(null); setEditingId(null); }} style={btn(C.gold)}>+ Add Entity</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.25rem", alignItems: "start" }}>
        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {entities.map((entity) => (
            <Card
              key={entity.id}
              onClick={() => { setSelectedId(entity.id); setAdding(false); setEditingId(null); }}
              style={{
                borderLeft: `3px solid ${entity.color}`,
                padding: "0.75rem 1rem",
                cursor: "pointer",
                boxShadow: selectedId === entity.id ? `0 0 0 1px ${entity.color}55` : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entity.color, flexShrink: 0 }} />
                <span style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: selectedId === entity.id ? entity.color : C.text, fontWeight: 500 }}>
                  {entity.name}
                </span>
              </div>
              {entity.role && (
                <div style={{ fontFamily: FONT.mono, fontSize: "0.58rem", color: C.textDim, marginTop: "0.2rem", marginLeft: "1.2rem" }}>
                  {entity.role}
                </div>
              )}
            </Card>
          ))}
          {entities.length === 0 && (
            <div style={{ color: C.textVeryDim, fontFamily: FONT.mono, fontSize: "0.7rem", padding: "0.5rem" }}>
              No entities yet.
            </div>
          )}
        </div>

        {/* Detail / add panel */}
        <div>
          {adding ? (
            <Card>
              <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text, marginBottom: "1rem" }}>New Entity</div>
              <EntityForm
                onSave={(e) => { addEntity(e); setAdding(false); setSelectedId(e.id); }}
                onCancel={() => setAdding(false)}
              />
            </Card>
          ) : selected ? (
            <Card style={{ borderLeft: `3px solid ${selected.color}` }}>
              {/* Entity header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: selected.color }} />
                    <span style={{ fontFamily: FONT.display, fontSize: "1.1rem", color: C.text }}>{selected.name}</span>
                  </div>
                  {selected.role && (
                    <Badge color={selected.color}>{selected.role}</Badge>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    onClick={() => setEditingId(editingId === selected.id ? null : selected.id)}
                    style={btn(C.gold)}
                  >
                    {editingId === selected.id ? "Cancel" : "✎ Edit"}
                  </button>
                  {confirmDelete === selected.id ? (
                    <>
                      <button onClick={() => { removeEntity(selected.id); setSelectedId(entities.find((e) => e.id !== selected.id)?.id ?? null); setConfirmDelete(null); }} style={btn(C.red)}>Confirm delete</button>
                      <button onClick={() => setConfirmDelete(null)} style={btn(C.textDim)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmDelete(selected.id)} style={btn(C.red)}>Delete</button>
                  )}
                </div>
              </div>

              {editingId === selected.id ? (
                <EntityForm
                  initial={selected}
                  onSave={(updated) => { updateEntity(selected.id, updated); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <EntityReadView entity={selected} />
              )}
            </Card>
          ) : (
            <Card>
              <p style={{ fontSize: "0.75rem", color: C.textVeryDim, fontFamily: FONT.mono }}>
                Select an entity from the sidebar or add a new one.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
