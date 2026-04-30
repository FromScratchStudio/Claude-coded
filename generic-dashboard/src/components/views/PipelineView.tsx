import { useState } from "react";
import { useStore } from "../../store/useStore";
import { C, FONT } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import type { PipelineItem, WorkflowStage } from "../../types";

function genId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function PipelineView() {
  const appConfig = useStore((s) => s.appConfig);
  const workflowStages = useStore((s) => s.workflowStages);
  const pipelineItems = useStore((s) => s.pipelineItems);
  const addPipelineItem = useStore((s) => s.addPipelineItem);
  const updatePipelineItem = useStore((s) => s.updatePipelineItem);
  const removePipelineItem = useStore((s) => s.removePipelineItem);
  const togglePipelineGate = useStore((s) => s.togglePipelineGate);
  const addWorkflowStage = useStore((s) => s.addWorkflowStage);
  const updateWorkflowStage = useStore((s) => s.updateWorkflowStage);
  const removeWorkflowStage = useStore((s) => s.removeWorkflowStage);

  const [selectedItem, setSelectedItem] = useState<PipelineItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [editStage, setEditStage] = useState<WorkflowStage | null>(null);
  const [editItem, setEditItem] = useState<PipelineItem | null>(null);

  // Item form state
  const [itemTitle, setItemTitle] = useState("");
  const [itemStage, setItemStage] = useState(workflowStages[0]?.id ?? 1);
  const [itemHook, setItemHook] = useState("");
  const [itemTags, setItemTags] = useState("");
  const [itemStart, setItemStart] = useState("");
  const [itemEnd, setItemEnd] = useState("");

  // Stage form state
  const [stageLabel, setStageLabel] = useState("");
  const [stageFullName, setStageFullName] = useState("");
  const [stageWhen, setStageWhen] = useState("");
  const [stageRule, setStageRule] = useState("");
  const [stageGates, setStageGates] = useState("");

  function openNewItem() {
    setEditItem(null);
    setItemTitle("");
    setItemStage(workflowStages[0]?.id ?? 1);
    setItemHook("");
    setItemTags("");
    setItemStart("");
    setItemEnd("");
    setShowItemModal(true);
  }

  function openEditItem(item: PipelineItem) {
    setEditItem(item);
    setItemTitle(item.title);
    setItemStage(item.stage);
    setItemHook(item.hook);
    setItemTags(item.tags.join(", "));
    setItemStart(item.startDate ?? "");
    setItemEnd(item.estimatedEndDate ?? "");
    setShowItemModal(true);
  }

  function saveItem() {
    if (!itemTitle.trim()) return;
    const stage = workflowStages.find((s) => s.id === itemStage);
    const tags = itemTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (editItem) {
      updatePipelineItem(editItem.id, {
        title: itemTitle.trim(),
        stage: itemStage,
        hook: itemHook.trim(),
        tags,
        startDate: itemStart || undefined,
        estimatedEndDate: itemEnd || undefined,
      });
      if (selectedItem?.id === editItem.id) {
        setSelectedItem((prev) =>
          prev ? { ...prev, title: itemTitle.trim(), stage: itemStage, hook: itemHook.trim(), tags } : null
        );
      }
    } else {
      const gates = stage ? Array(stage.gates.length).fill(false) : [];
      addPipelineItem({
        id: genId(),
        title: itemTitle.trim(),
        stage: itemStage,
        gates,
        lastUpdate: "just now",
        hook: itemHook.trim(),
        tags,
        startDate: itemStart || undefined,
        estimatedEndDate: itemEnd || undefined,
      });
    }
    setShowItemModal(false);
  }

  function openNewStage() {
    setEditStage(null);
    setStageLabel("");
    setStageFullName("");
    setStageWhen("");
    setStageRule("");
    setStageGates("");
    setShowStageModal(true);
  }

  function openEditStage(stage: WorkflowStage) {
    setEditStage(stage);
    setStageLabel(stage.label);
    setStageFullName(stage.fullName);
    setStageWhen(stage.when);
    setStageRule(stage.rule);
    setStageGates(stage.gates.join("\n"));
    setShowStageModal(true);
  }

  function saveStage() {
    if (!stageLabel.trim()) return;
    const gates = stageGates
      .split("\n")
      .map((g) => g.trim())
      .filter(Boolean);
    if (editStage) {
      updateWorkflowStage(editStage.id, {
        label: stageLabel.trim(),
        fullName: stageFullName.trim(),
        when: stageWhen.trim(),
        rule: stageRule.trim(),
        gates,
      });
    } else {
      addWorkflowStage({
        label: stageLabel.trim(),
        fullName: stageFullName.trim(),
        when: stageWhen.trim(),
        rule: stageRule.trim(),
        gates,
      });
    }
    setShowStageModal(false);
  }

  const publishedItems = pipelineItems.filter((item) => {
    const lastStage = workflowStages[workflowStages.length - 1];
    return item.stage === lastStage?.id;
  });

  const activeItems = pipelineItems.filter((item) => {
    const lastStage = workflowStages[workflowStages.length - 1];
    return item.stage !== lastStage?.id;
  });

  return (
    <div>
      <SectionTitle
        sub={`${appConfig.pipelineItemPluralLabel} through your workflow`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={openNewStage} style={{ ...btnSecondary, fontSize: "0.8rem" }}>
              + Stage
            </button>
            <button onClick={openNewItem} style={{ ...btnPrimary, fontSize: "0.8rem" }}>
              + {appConfig.pipelineItemLabel}
            </button>
          </div>
        }
      >
        Pipeline
      </SectionTitle>

      <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
        {workflowStages.map((stage) => {
          const items = activeItems.filter((item) => item.stage === stage.id);
          return (
            <div
              key={stage.id}
              style={{
                minWidth: 220,
                flex: 1,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {/* Stage header */}
              <div
                style={{
                  padding: "0.65rem 0.85rem",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: C.surfaceAlt,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: C.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem",
                      color: "#fff",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {stage.id}
                  </span>
                  <span style={{ fontSize: "0.82rem", color: C.textSoft, fontWeight: 600 }}>
                    {stage.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      background: C.surfaceHover,
                      color: C.textDim,
                      borderRadius: 10,
                      padding: "1px 7px",
                    }}
                  >
                    {items.length}
                  </span>
                </div>
                <button
                  onClick={() => openEditStage(stage)}
                  style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.9rem" }}
                >
                  ⚙
                </button>
              </div>

              {/* Items */}
              <div style={{ padding: "0.5rem", display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map((item) => {
                  const stage = workflowStages.find((s) => s.id === item.stage);
                  const gatesDone = item.gates.filter(Boolean).length;
                  const gatesTotal = stage?.gates.length ?? item.gates.length;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item === selectedItem ? null : item)}
                      style={{
                        padding: "0.6rem 0.75rem",
                        background:
                          selectedItem?.id === item.id ? `${C.accent}15` : C.surfaceAlt,
                        border: `1px solid ${selectedItem?.id === item.id ? C.accent + "50" : C.border}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: C.text,
                          fontWeight: 500,
                          marginBottom: 4,
                        }}
                      >
                        {item.title}
                      </div>
                      {item.hook && (
                        <div
                          style={{
                            fontSize: "0.73rem",
                            color: C.textMuted,
                            marginBottom: 4,
                          }}
                        >
                          {item.hook}
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontSize: "0.68rem", color: C.textDim }}>
                          {gatesDone}/{gatesTotal} gates
                        </span>
                        <div style={{ display: "flex", gap: 3 }}>
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} label={tag} small />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                      color: C.textVeryDim,
                      fontSize: "0.78rem",
                    }}
                  >
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected item detail */}
      {selectedItem && (
        <Card style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h3 style={{ margin: 0, color: C.text, fontSize: "1rem" }}>
                {selectedItem.title}
              </h3>
              {selectedItem.hook && (
                <p style={{ margin: "4px 0 0", color: C.textMuted, fontSize: "0.82rem" }}>
                  {selectedItem.hook}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => openEditItem(selectedItem)}
                style={{ ...btnSecondary, fontSize: "0.8rem" }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  removePipelineItem(selectedItem.id);
                  setSelectedItem(null);
                }}
                style={{ ...btnDanger, fontSize: "0.8rem" }}
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ ...btnSecondary, fontSize: "0.8rem" }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Move to stage */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: 6 }}>
              Stage
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {workflowStages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => {
                    const newGates = Array(stage.gates.length).fill(false);
                    updatePipelineItem(selectedItem.id, { stage: stage.id, gates: newGates });
                    setSelectedItem({ ...selectedItem, stage: stage.id, gates: newGates });
                  }}
                  style={{
                    padding: "0.3rem 0.75rem",
                    borderRadius: 6,
                    background:
                      selectedItem.stage === stage.id ? C.accent : C.surfaceAlt,
                    color:
                      selectedItem.stage === stage.id ? "#fff" : C.textSoft,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                  }}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gate checklist */}
          {(() => {
            const stage = workflowStages.find((s) => s.id === selectedItem.stage);
            if (!stage || stage.gates.length === 0) return null;
            return (
              <div>
                <div style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: 6 }}>
                  Completion Gates
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {stage.gates.map((gate, idx) => {
                    const checked = selectedItem.gates[idx] ?? false;
                    return (
                      <label
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          color: checked ? C.green : C.textSoft,
                          padding: "0.2rem 0",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            togglePipelineGate(selectedItem.id, idx);
                            const newGates = [...selectedItem.gates];
                            newGates[idx] = !checked;
                            setSelectedItem({ ...selectedItem, gates: newGates });
                          }}
                          style={{ accentColor: C.green }}
                        />
                        <span style={{ textDecoration: checked ? "line-through" : "none" }}>
                          {gate}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {stage.rule && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.75rem",
                      color: C.textDim,
                      borderLeft: `2px solid ${C.accent}`,
                      paddingLeft: 8,
                    }}
                  >
                    Rule: {stage.rule}
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
      )}

      {/* Published items */}
      {publishedItems.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.textDim,
              marginBottom: "0.75rem",
            }}
          >
            Published / Done ({publishedItems.length})
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {publishedItems.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "0.55rem 0.75rem",
                  background: C.surfaceAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: "0.82rem", color: C.textSoft }}>{item.title}</div>
                <div style={{ fontSize: "0.7rem", color: C.textDim, marginTop: 2 }}>
                  {item.lastUpdate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Modal */}
      <Modal
        open={showItemModal}
        onClose={() => setShowItemModal(false)}
        title={editItem ? `Edit ${appConfig.pipelineItemLabel}` : `New ${appConfig.pipelineItemLabel}`}
      >
        <div style={formRow}>
          <label style={labelStyle}>Title</label>
          <input
            value={itemTitle}
            onChange={(e) => setItemTitle(e.target.value)}
            style={inputStyle}
            placeholder="What is this item?"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && saveItem()}
          />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Hook / description</label>
          <input
            value={itemHook}
            onChange={(e) => setItemHook(e.target.value)}
            style={inputStyle}
            placeholder="One-sentence value statement"
          />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Stage</label>
          <select
            value={itemStage}
            onChange={(e) => setItemStage(Number(e.target.value))}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {workflowStages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} — {s.fullName}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Start date</label>
            <input type="date" value={itemStart} onChange={(e) => setItemStart(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Target end</label>
            <input type="date" value={itemEnd} onChange={(e) => setItemEnd(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input
            value={itemTags}
            onChange={(e) => setItemTags(e.target.value)}
            style={inputStyle}
            placeholder="design, product, ux"
          />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => setShowItemModal(false)} style={btnSecondary}>
            Cancel
          </button>
          <button onClick={saveItem} style={btnPrimary}>
            {editItem ? "Save" : "Add"}
          </button>
        </div>
      </Modal>

      {/* Stage Modal */}
      <Modal
        open={showStageModal}
        onClose={() => setShowStageModal(false)}
        title={editStage ? "Edit Stage" : "New Stage"}
      >
        <div style={formRow}>
          <label style={labelStyle}>Short label</label>
          <input value={stageLabel} onChange={(e) => setStageLabel(e.target.value)} style={inputStyle} placeholder="e.g. Review" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Full name</label>
          <input value={stageFullName} onChange={(e) => setStageFullName(e.target.value)} style={inputStyle} placeholder="e.g. Review & Testing" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>When to use</label>
          <input value={stageWhen} onChange={(e) => setStageWhen(e.target.value)} style={inputStyle} placeholder="Condition for entering this stage" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Rule</label>
          <input value={stageRule} onChange={(e) => setStageRule(e.target.value)} style={inputStyle} placeholder="One binding rule for this stage" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Gates (one per line)</label>
          <textarea
            value={stageGates}
            onChange={(e) => setStageGates(e.target.value)}
            style={{ ...inputStyle, height: 90, resize: "vertical" }}
            placeholder="Criterion 1&#10;Criterion 2"
          />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editStage && (
            <button
              onClick={() => {
                removeWorkflowStage(editStage.id);
                setShowStageModal(false);
              }}
              style={btnDanger}
            >
              Delete stage
            </button>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowStageModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={saveStage} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
