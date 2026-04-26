import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import type { PipelineItem, PipelineStage } from "../../types";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

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
    padding: "0.25rem 0.6rem",
    fontSize: "0.65rem",
    fontFamily: FONT.mono,
    cursor: "pointer",
    letterSpacing: "0.04em",
  };
}

// ─── Stage edit form ──────────────────────────────────────────────────────────
function StageForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<PipelineStage>;
  onSave: (s: PipelineStage) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial.label ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [color, setColor] = useState(initial.color ?? "#6b7280");

  function save() {
    if (!label.trim()) return;
    onSave({
      id: initial.id ?? `st-${Date.now()}`,
      label: label.trim(),
      description: description.trim(),
      color,
      order: initial.order ?? 99,
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "0.75rem" }}>
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Stage label *" style={iStyle} />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" style={iStyle} />
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.textDim }}>Color</span>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 36, height: 28, border: "none", background: "none", cursor: "pointer" }} />
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={save} style={btn(C.green)}>✓ Save</button>
        <button onClick={onCancel} style={btn(C.textDim)}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Item form ────────────────────────────────────────────────────────────────
function ItemForm({
  initial,
  stageId,
  stages,
  categories,
  onSave,
  onCancel,
}: {
  initial?: Partial<PipelineItem>;
  stageId: string;
  stages: PipelineStage[];
  categories: { id: string; label: string; color: string }[];
  onSave: (item: PipelineItem) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [sid, setSid] = useState(initial?.stageId ?? stageId);
  const [catId, setCatId] = useState(initial?.categoryId ?? (categories[0]?.id ?? ""));
  const [note, setNote] = useState(initial?.note ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");

  function save() {
    if (!title.trim()) return;
    onSave({
      id: initial?.id ?? `pi-${Date.now()}`,
      title: title.trim(),
      stageId: sid,
      categoryId: catId,
      note: note.trim(),
      dueDate,
    });
  }

  const selStyle: React.CSSProperties = { ...iStyle, cursor: "pointer" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", padding: "0.75rem", background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 8 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Item title *" style={iStyle} autoFocus />
      <select value={sid} onChange={(e) => setSid(e.target.value)} style={selStyle}>
        {stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      <select value={catId} onChange={(e) => setCatId(e.target.value)} style={selStyle}>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" style={iStyle} />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={iStyle} />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={save} style={btn(C.green)}>✓ Save</button>
        <button onClick={onCancel} style={btn(C.textDim)}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function PipelineView() {
  const stages = useStore((s) => s.pipelineStages);
  const items = useStore((s) => s.pipelineItems);
  const categories = useStore((s) => s.categories);
  const addPipelineStage = useStore((s) => s.addPipelineStage);
  const updatePipelineStage = useStore((s) => s.updatePipelineStage);
  const removePipelineStage = useStore((s) => s.removePipelineStage);
  const addPipelineItem = useStore((s) => s.addPipelineItem);
  const updatePipelineItem = useStore((s) => s.updatePipelineItem);
  const removePipelineItem = useStore((s) => s.removePipelineItem);
  const movePipelineItem = useStore((s) => s.movePipelineItem);

  const [addingStage, setAddingStage] = useState(false);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [confirmDeleteStage, setConfirmDeleteStage] = useState<string | null>(null);
  const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<string | null>(null);

  const sorted = [...stages].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Pipeline</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            Workflow stages — manage deliverables across stages
          </p>
        </div>
        <button onClick={() => setAddingStage(true)} style={btn(C.gold)}>+ Add Stage</button>
      </div>

      {addingStage && (
        <div style={{ marginBottom: "1rem" }}>
          <StageForm
            initial={{ order: stages.length }}
            onSave={(s) => { addPipelineStage(s); setAddingStage(false); }}
            onCancel={() => setAddingStage(false)}
          />
        </div>
      )}

      {/* Kanban board */}
      <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", alignItems: "flex-start" }}>
        {sorted.map((stage) => {
          const stageItems = items.filter((it) => it.stageId === stage.id);
          return (
            <div key={stage.id} style={{ minWidth: 270, maxWidth: 300, flex: "0 0 270px" }}>
              <Card style={{ borderTop: `3px solid ${stage.color}`, padding: "0.85rem" }}>
                {/* Stage header */}
                {editingStage === stage.id ? (
                  <StageForm
                    initial={stage}
                    onSave={(s) => { updatePipelineStage(stage.id, s); setEditingStage(null); }}
                    onCancel={() => setEditingStage(null)}
                  />
                ) : (
                  <div style={{ marginBottom: "0.85rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: FONT.mono, fontSize: "0.72rem", color: stage.color, fontWeight: "bold", letterSpacing: "0.08em" }}>
                        {stage.label}
                      </span>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <button onClick={() => setEditingStage(stage.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.75rem" }} title="Edit stage">✎</button>
                        {confirmDeleteStage === stage.id ? (
                          <>
                            <button onClick={() => { removePipelineStage(stage.id); setConfirmDeleteStage(null); }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.65rem", fontFamily: FONT.mono }}>Confirm</button>
                            <button onClick={() => setConfirmDeleteStage(null)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.65rem", fontFamily: FONT.mono }}>Cancel</button>
                          </>
                        ) : (
                          <button onClick={() => setConfirmDeleteStage(stage.id)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.85rem" }} title="Delete stage">×</button>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginTop: "0.2rem" }}>
                      {stage.description} · {stageItems.length} item{stageItems.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {stageItems.map((item) => {
                    const cat = categories.find((c) => c.id === item.categoryId);
                    return editingItem === item.id ? (
                      <ItemForm
                        key={item.id}
                        initial={item}
                        stageId={stage.id}
                        stages={sorted}
                        categories={categories}
                        onSave={(updated) => { updatePipelineItem(item.id, updated); setEditingItem(null); }}
                        onCancel={() => setEditingItem(null)}
                      />
                    ) : (
                      <div
                        key={item.id}
                        style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 7, padding: "0.6rem 0.7rem" }}
                      >
                        <div style={{ fontSize: "0.78rem", color: C.text, fontFamily: FONT.body, marginBottom: "0.35rem", fontWeight: 500 }}>
                          {item.title}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                          {cat && <Badge color={cat.color}>{cat.label}</Badge>}
                          {item.dueDate && (
                            <span style={{ fontFamily: FONT.mono, fontSize: "0.58rem", color: C.textDim }}>{item.dueDate}</span>
                          )}
                        </div>
                        {item.note && (
                          <div style={{ fontSize: "0.68rem", color: C.textDim, fontFamily: FONT.body, marginBottom: "0.5rem", lineHeight: 1.4 }}>
                            {item.note}
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
                          <select
                            value={item.stageId}
                            onChange={(e) => movePipelineItem(item.id, e.target.value)}
                            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 4, padding: "0.15rem 0.3rem", fontSize: "0.6rem", fontFamily: FONT.mono, cursor: "pointer" }}
                          >
                            {sorted.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                          <div style={{ display: "flex", gap: "0.2rem" }}>
                            <button onClick={() => setEditingItem(item.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.7rem" }}>✎</button>
                            {confirmDeleteItem === item.id ? (
                              <>
                                <button onClick={() => { removePipelineItem(item.id); setConfirmDeleteItem(null); }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.62rem", fontFamily: FONT.mono }}>Del</button>
                                <button onClick={() => setConfirmDeleteItem(null)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.62rem", fontFamily: FONT.mono }}>×</button>
                              </>
                            ) : (
                              <button onClick={() => setConfirmDeleteItem(item.id)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.85rem" }}>×</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add item form */}
                  {addingItemTo === stage.id ? (
                    <ItemForm
                      stageId={stage.id}
                      stages={sorted}
                      categories={categories}
                      onSave={(item) => { addPipelineItem(item); setAddingItemTo(null); }}
                      onCancel={() => setAddingItemTo(null)}
                    />
                  ) : (
                    <button
                      onClick={() => setAddingItemTo(stage.id)}
                      style={{ marginTop: "0.25rem", width: "100%", background: "none", border: `1px dashed ${stage.color}44`, color: stage.color, borderRadius: 5, padding: "0.3rem", fontFamily: FONT.mono, fontSize: "0.6rem", cursor: "pointer" }}
                    >
                      + Add item
                    </button>
                  )}
                </div>
              </Card>
            </div>
          );
        })}

        {stages.length === 0 && (
          <div style={{ padding: "2rem", color: C.textVeryDim, fontFamily: FONT.mono, fontSize: "0.75rem" }}>
            No stages yet. Add a stage to start your pipeline.
          </div>
        )}
      </div>
    </div>
  );
}
