import { useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import { RINGS, STATUS_META, PRIORITY_META } from "../../data/projects";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import ProgressBar from "../ui/ProgressBar";
import { StatusBadge, PriorityDot, Tag } from "../ui/Badge";
import type { Project, ProjectStatus, ProjectPriority, RingId } from "../../types";

function generateId() {
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

type FilterStatus = "all" | ProjectStatus;

interface ProjectFormProps {
  initial?: Partial<Project>;
  onSave: (p: Omit<Project, "id">) => void;
  onCancel: () => void;
}

function ProjectForm({ initial, onSave, onCancel }: ProjectFormProps) {
  const phases = useStore((s) => s.phases);
  const [name, setName] = useState(initial?.name ?? "");
  const [ring, setRing] = useState<RingId>(initial?.ring ?? "centre");
  const [phase, setPhase] = useState(initial?.phase ?? 0);
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? "active");
  const [progress, setProgress] = useState(initial?.progress ?? 0);
  const [priority, setPriority] = useState<ProjectPriority>(initial?.priority ?? "medium");
  const [note, setNote] = useState(initial?.note ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [estimatedEndDate, setEstimatedEndDate] = useState(initial?.estimatedEndDate ?? "");

  const selectStyle = {
    background: C.surfaceAlt,
    border: `1px solid ${C.border}`,
    color: C.text,
    borderRadius: 6,
    padding: "0.3rem 0.5rem",
    fontSize: "0.72rem",
    fontFamily: FONT.mono,
    width: "100%",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), ring, phase, status, progress, priority, note, startDate: startDate || undefined, estimatedEndDate: estimatedEndDate || undefined });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du projet…"
        required
        style={{ ...selectStyle, fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
        <select value={ring} onChange={(e) => setRing(e.target.value as RingId)} style={selectStyle}>
          {RINGS.map((r) => <option key={r.id} value={r.id}>{r.label} — {r.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} style={selectStyle}>
          {(Object.entries(STATUS_META) as [ProjectStatus, (typeof STATUS_META)[ProjectStatus]][]).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value as ProjectPriority)} style={selectStyle}>
          {(Object.entries(PRIORITY_META) as [ProjectPriority, (typeof PRIORITY_META)[ProjectPriority]][]).map(([k, v]) => (
            <option key={k} value={k}>Priorité {v.label}</option>
          ))}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <select value={phase} onChange={(e) => setPhase(Number(e.target.value))} style={selectStyle}>
          {phases.map((p) => <option key={p.id} value={p.id}>{p.label} — {p.name}</option>)}
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="range" min={0} max={100} value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{ flex: 1, accentColor: C.gold }}
          />
          <span style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: C.gold, minWidth: 30 }}>{progress}%</span>
        </div>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note…"
        rows={2}
        style={{ ...selectStyle, resize: "vertical", fontSize: "0.72rem" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Début</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={selectStyle} />
        </div>
        <div>
          <label style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, display: "block", marginBottom: "0.2rem" }}>Fin estimée</label>
          <input type="date" value={estimatedEndDate} onChange={(e) => setEstimatedEndDate(e.target.value)} style={selectStyle} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.7rem" }}>
          Annuler
        </button>
        <button type="submit" style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.7rem", fontWeight: "bold" }}>
          Enregistrer
        </button>
      </div>
    </form>
  );
}

export default function ProjectsView() {
  const projects = useStore((s) => s.projects);
  const phases = useStore((s) => s.phases);
  const addProject = useStore((s) => s.addProject);
  const updateProject = useStore((s) => s.updateProject);
  const removeProject = useStore((s) => s.removeProject);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterRing, setFilterRing] = useState<"all" | RingId>("all");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterRing !== "all" && p.ring !== filterRing) return false;
    return true;
  });

  function handleAdd(data: Omit<Project, "id">) {
    addProject({ ...data, id: generateId() });
    setAdding(false);
  }

  function handleUpdate(id: string, data: Omit<Project, "id">) {
    updateProject(id, data);
    setEditingId(null);
  }

  const ringColor = (id: RingId) => RINGS.find((r) => r.id === id)?.color ?? C.textMuted;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Projets</h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            {projects.filter((p) => p.status === "active").length} actifs · {projects.filter((p) => p.status === "backlog").length} en backlog
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Filters */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textSoft, borderRadius: 6, padding: "0.3rem 0.5rem", fontSize: "0.68rem", fontFamily: FONT.mono }}
          >
            <option value="all">Tous statuts</option>
            {(Object.entries(STATUS_META) as [ProjectStatus, (typeof STATUS_META)[ProjectStatus]][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={filterRing}
            onChange={(e) => setFilterRing(e.target.value as "all" | RingId)}
            style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textSoft, borderRadius: 6, padding: "0.3rem 0.5rem", fontSize: "0.68rem", fontFamily: FONT.mono }}
          >
            <option value="all">Tous anneaux</option>
            {RINGS.map((r) => <option key={r.id} value={r.id}>{r.label} — {r.name}</option>)}
          </select>
          <button
            onClick={() => setAdding(true)}
            style={{ background: C.gold, color: "#000", border: "none", borderRadius: 6, padding: "0.35rem 0.8rem", fontSize: "0.72rem", fontFamily: FONT.mono, cursor: "pointer", fontWeight: "bold" }}
          >
            + Nouveau projet
          </button>
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <Card style={{ marginBottom: "1rem" }}>
          <SectionTitle accent={C.gold}>Nouveau projet</SectionTitle>
          <ProjectForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        </Card>
      )}

      {/* Project grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {filtered.map((project) => {
          const ring = RINGS.find((r) => r.id === project.ring);
          const phaseObj = phases.find((p) => p.id === project.phase);
          const isEditing = editingId === project.id;

          return (
            <Card key={project.id}>
              {isEditing ? (
                <>
                  <SectionTitle accent={C.gold}>Modifier</SectionTitle>
                  <ProjectForm
                    initial={project}
                    onSave={(data) => handleUpdate(project.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                </>
              ) : (
                <>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.65rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                        <PriorityDot priority={project.priority} />
                        <span style={{ fontFamily: FONT.display, fontSize: "0.9rem", color: C.text }}>{project.name}</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        <StatusBadge status={project.status} />
                        {ring && <Tag color={ring.color}>{ring.label}</Tag>}
                        <Tag color={phaseObj?.accent}>{phaseObj?.label ?? ""}</Tag>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        onClick={() => setEditingId(project.id)}
                        title="Modifier"
                        aria-label="Modifier le projet"
                        style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.85rem" }}
                      >✎</button>
                      <button
                        onClick={() => removeProject(project.id)}
                        title="Supprimer"
                        aria-label="Supprimer le projet"
                        style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem" }}
                      >×</button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.65rem", color: C.textMuted }}>Avancement</span>
                      <span style={{ fontSize: "0.65rem", color: ring?.color ?? C.gold, fontFamily: FONT.mono }}>{project.progress}%</span>
                    </div>
                    <ProgressBar value={project.progress} color={ring?.color ?? C.gold} height={4} />
                  </div>

                  {/* Quick progress slider */}
                  <input
                    type="range" min={0} max={100} value={project.progress}
                    onChange={(e) => updateProject(project.id, { progress: Number(e.target.value) })}
                    style={{ width: "100%", accentColor: ring?.color ?? C.gold, marginBottom: "0.5rem" }}
                  />

                  {/* Note */}
                  {project.note && (
                    <p style={{ fontSize: "0.68rem", color: C.textSoft, margin: 0, fontStyle: "italic", borderLeft: `2px solid ${ringColor(project.ring)}44`, paddingLeft: "0.4rem" }}>
                      {project.note}
                    </p>
                  )}

                  {/* Dates */}
                  {(project.startDate || project.estimatedEndDate) && (
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.45rem", flexWrap: "wrap" }}>
                      {project.startDate && (
                        <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim }}>
                          ▶ {new Date(project.startDate + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      )}
                      {project.estimatedEndDate && (
                        <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim }}>
                          → {new Date(project.estimatedEndDate + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && !adding && (
        <p style={{ textAlign: "center", color: C.textDim, fontSize: "0.8rem", padding: "3rem 0" }}>
          Aucun projet pour ces filtres.
        </p>
      )}
    </div>
  );
}
