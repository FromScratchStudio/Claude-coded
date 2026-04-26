import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import type { Project, ProjectStatus, ProjectPriority } from "../../types";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import ProgressBar from "../ui/ProgressBar";
import SectionTitle from "../ui/SectionTitle";

const STATUS_META: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "#10b981" },
  pending: { label: "Pending", color: "#f59e0b" },
  backlog: { label: "Backlog", color: "#6b7280" },
  done: { label: "Done", color: "#4c7fc9" },
};

const PRIORITY_META: Record<ProjectPriority, { label: string; color: string }> = {
  high: { label: "High", color: "#ef4444" },
  medium: { label: "Medium", color: "#f59e0b" },
  low: { label: "Low", color: "#6b7280" },
};

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

function ProjectForm({
  initial,
  categories,
  phases,
  onSave,
  onCancel,
}: {
  initial?: Partial<Project>;
  categories: { id: string; label: string }[];
  phases: { id: string; label: string; name: string }[];
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? (categories[0]?.id ?? ""));
  const [phaseId, setPhaseId] = useState(initial?.phaseId ?? (phases[0]?.id ?? ""));
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? "backlog");
  const [priority, setPriority] = useState<ProjectPriority>(initial?.priority ?? "medium");
  const [progress, setProgress] = useState(initial?.progress ?? 0);
  const [note, setNote] = useState(initial?.note ?? "");

  function save() {
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? `pr-${Date.now()}`,
      name: name.trim(),
      categoryId,
      phaseId,
      status,
      priority,
      progress,
      note: note.trim(),
    });
  }

  const selStyle: React.CSSProperties = { ...iStyle, cursor: "pointer" };

  return (
    <Card style={{ borderLeft: `3px solid ${C.gold}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name *" style={{ ...iStyle, gridColumn: "1 / -1" }} autoFocus />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={selStyle}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={phaseId} onChange={(e) => setPhaseId(e.target.value)} style={selStyle}>
          {phases.map((p) => <option key={p.id} value={p.id}>{p.label} — {p.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} style={selStyle}>
          {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value as ProjectPriority)} style={selStyle}>
          {Object.entries(PRIORITY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
            <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.textDim }}>Progress</span>
            <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.textDim }}>{progress}%</span>
          </div>
          <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} style={{ width: "100%", accentColor: C.gold }} />
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" rows={2} style={{ ...iStyle, gridColumn: "1 / -1", resize: "vertical" }} />
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={save} style={btn(C.green)}>✓ Save</button>
        <button onClick={onCancel} style={btn(C.textDim)}>Cancel</button>
      </div>
    </Card>
  );
}

export default function ProjectsView() {
  const projects = useStore((s) => s.projects);
  const categories = useStore((s) => s.categories);
  const phases = useStore((s) => s.phases);
  const addProject = useStore((s) => s.addProject);
  const updateProject = useStore((s) => s.updateProject);
  const removeProject = useStore((s) => s.removeProject);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all">("all");

  const visible = filterStatus === "all" ? projects : projects.filter((p) => p.status === filterStatus);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Projects</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} · {projects.filter((p) => p.status === "active").length} active
          </p>
        </div>
        <button onClick={() => setAdding(true)} style={btn(C.gold)}>+ New Project</button>
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {(["all", "active", "pending", "backlog", "done"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              background: filterStatus === s ? `${C.gold}22` : "none",
              border: `1px solid ${filterStatus === s ? C.gold : C.border}`,
              color: filterStatus === s ? C.gold : C.textDim,
              borderRadius: 5,
              padding: "0.2rem 0.6rem",
              fontSize: "0.62rem",
              fontFamily: FONT.mono,
              cursor: "pointer",
              letterSpacing: "0.06em",
            }}
          >
            {s === "all" ? "All" : STATUS_META[s].label}
          </button>
        ))}
      </div>

      {adding && (
        <div style={{ marginBottom: "1rem" }}>
          <ProjectForm
            categories={categories}
            phases={phases}
            onSave={(p) => { addProject(p); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {visible.map((project) => {
          const cat = categories.find((c) => c.id === project.categoryId);
          const phase = phases.find((p) => p.id === project.phaseId);
          const sm = STATUS_META[project.status];
          const pm = PRIORITY_META[project.priority];

          if (editingId === project.id) {
            return (
              <div key={project.id} style={{ gridColumn: "1 / -1" }}>
                <ProjectForm
                  initial={project}
                  categories={categories}
                  phases={phases}
                  onSave={(updated) => { updateProject(project.id, updated); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            );
          }

          return (
            <Card key={project.id} style={{ borderLeft: `3px solid ${cat?.color ?? C.border}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: pm.color, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.text, fontWeight: 500 }}>{project.name}</span>
                </div>
                <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
                  <button onClick={() => setEditingId(project.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.75rem" }}>✎</button>
                  {confirmDelete === project.id ? (
                    <>
                      <button onClick={() => { removeProject(project.id); setConfirmDelete(null); }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.62rem", fontFamily: FONT.mono }}>Del</button>
                      <button onClick={() => setConfirmDelete(null)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.62rem", fontFamily: FONT.mono }}>×</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmDelete(project.id)} style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                {cat && <Badge color={cat.color}>{cat.label}</Badge>}
                {phase && <Badge color={phase.accent}>{phase.label}</Badge>}
                <Badge color={sm.color}>{sm.label}</Badge>
              </div>

              <div style={{ marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim }}>Progress</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim }}>{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} color={cat?.color ?? C.gold} height={4} />
              </div>

              {project.note && (
                <p style={{ fontSize: "0.72rem", color: C.textDim, fontFamily: FONT.body, lineHeight: 1.5, margin: 0 }}>
                  {project.note}
                </p>
              )}
            </Card>
          );
        })}

        {visible.length === 0 && (
          <div style={{ color: C.textVeryDim, fontFamily: FONT.mono, fontSize: "0.75rem", padding: "1rem" }}>
            No projects match this filter.
          </div>
        )}
      </div>

      {projects.length === 0 && !adding && (
        <SectionTitle>No projects yet. Click "+ New Project" to start.</SectionTitle>
      )}
    </div>
  );
}
