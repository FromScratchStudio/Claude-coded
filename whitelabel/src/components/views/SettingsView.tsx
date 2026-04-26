import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import type { Category } from "../../types";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";

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
    padding: "0.2rem 0.6rem",
    fontSize: "0.62rem",
    fontFamily: FONT.mono,
    cursor: "pointer",
  };
}

// ─── Category form ────────────────────────────────────────────────────────────
function CategoryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Category>;
  onSave: (c: Category) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? "#6366f1");
  const [pct, setPct] = useState(initial?.pct ?? 25);

  function save() {
    if (!name.trim()) return;
    onSave({ id: initial?.id ?? `cat-${Date.now()}`, label: label.trim(), name: name.trim(), color, pct: Math.max(0, Math.min(100, Number(pct))) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", padding: "0.75rem", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.4rem" }}>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (e.g. OPS)" style={iStyle} autoFocus />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" style={iStyle} />
      </div>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim }}>Color</span>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 32, height: 28, border: "none", background: "none", cursor: "pointer" }} />
          <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color }}>{color}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim }}>Pct %</span>
          <input type="number" min={0} max={100} value={pct} onChange={(e) => setPct(Number(e.target.value))} style={{ ...iStyle, width: 64 }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <button onClick={save} style={btn(C.green)}>✓ Save</button>
        <button onClick={onCancel} style={btn(C.textDim)}>Cancel</button>
      </div>
    </div>
  );
}

export default function SettingsView() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const categories = useStore((s) => s.categories);
  const addCategory = useStore((s) => s.addCategory);
  const updateCategory = useStore((s) => s.updateCategory);
  const removeCategory = useStore((s) => s.removeCategory);

  // App settings draft
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [accentColor, setAccentColor] = useState(settings.accentColor);
  const [saved, setSaved] = useState(false);

  function saveSettings() {
    updateSettings({ name: name.trim() || settings.name, tagline: tagline.trim(), accentColor });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  // Category CRUD state
  const [addingCat, setAddingCat] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div>
      <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, marginBottom: "1.25rem" }}>Settings</h2>

      {/* App settings */}
      <Card style={{ marginBottom: "1.25rem" }}>
        <SectionTitle accent={accentColor}>App Settings</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 520 }}>
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>App Name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} style={iStyle} placeholder="App name" />
          </div>
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>Tagline</div>
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} style={iStyle} placeholder="Short tagline" />
          </div>
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>Accent Color</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: 40, height: 32, border: "none", background: "none", cursor: "pointer" }} />
              <span style={{ fontFamily: FONT.mono, fontSize: "0.75rem", color: accentColor }}>{accentColor}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${accentColor}22, ${accentColor})` }} />
            </div>
          </div>
          <div>
            <button
              onClick={saveSettings}
              style={{ background: accentColor, color: "#000", border: "none", borderRadius: 5, padding: "0.4rem 1.25rem", fontFamily: FONT.mono, fontSize: "0.7rem", fontWeight: "bold", cursor: "pointer", transition: "opacity 0.15s" }}
            >
              {saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </Card>

      {/* Categories */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <SectionTitle accent={C.gold}>Categories</SectionTitle>
          <button onClick={() => setAddingCat(true)} style={btn(C.gold)}>+ Add</button>
        </div>

        {addingCat && (
          <div style={{ marginBottom: "0.75rem" }}>
            <CategoryForm
              onSave={(c) => { addCategory(c); setAddingCat(false); }}
              onCancel={() => setAddingCat(false)}
            />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {categories.map((cat) => (
            <div key={cat.id}>
              {editingCatId === cat.id ? (
                <CategoryForm
                  initial={cat}
                  onSave={(c) => { updateCategory(cat.id, c); setEditingCatId(null); }}
                  onCancel={() => setEditingCatId(null)}
                />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.75rem", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 7 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: cat.color, minWidth: 48 }}>{cat.label}</span>
                  <span style={{ fontFamily: FONT.body, fontSize: "0.78rem", color: C.text, flex: 1 }}>{cat.name}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim, minWidth: 40, textAlign: "right" }}>{cat.pct}%</span>
                  <div style={{ width: 80, height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${cat.pct}%`, height: "100%", background: cat.color, borderRadius: 3 }} />
                  </div>
                  <button onClick={() => setEditingCatId(cat.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.7rem" }}>✎</button>
                  {confirmDelete === cat.id ? (
                    <>
                      <button onClick={() => { removeCategory(cat.id); setConfirmDelete(null); }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.62rem", fontFamily: FONT.mono }}>Del</button>
                      <button onClick={() => setConfirmDelete(null)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.7rem" }}>×</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmDelete(cat.id)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
                  )}
                </div>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <p style={{ fontSize: "0.7rem", color: C.textVeryDim, fontFamily: FONT.mono }}>No categories defined.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
