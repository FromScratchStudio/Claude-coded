import { useState } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";
import { Badge, PriorityDot, StatusBadge, Tag } from "../ui/Badge";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import { GoogleDrivePanel, DriveRefBadges } from "../ui/GoogleDrivePanel";
import type { Project, ProjectStatus, ProjectPriority } from "../../types";

function genId() {
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function ProjectsView() {
  const appConfig = useStore((s) => s.appConfig);
  const projects = useStore((s) => s.projects);
  const phases = useStore((s) => s.phases);
  const addProject = useStore((s) => s.addProject);
  const updateProject = useStore((s) => s.updateProject);
  const removeProject = useStore((s) => s.removeProject);

  const rings = appConfig.rings;

  const [filterStatus, setFilterStatus] = useState<"all" | ProjectStatus>("all");
  const [filterRing, setFilterRing] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [driveProjectId, setDriveProjectId] = useState<string | null>(null);

  // Form state
  const [pName, setPName] = useState("");
  const [pRing, setPRing] = useState(rings[0]?.id ?? "core");
  const [pPhase, setPPhase] = useState(phases[0]?.id ?? 1);
  const [pStatus, setPStatus] = useState<ProjectStatus>("active");
  const [pPriority, setPPriority] = useState<ProjectPriority>("medium");
  const [pProgress, setPProgress] = useState(0);
  const [pNote, setPNote] = useState("");
  const [pTags, setPTags] = useState("");
  const [pStart, setPStart] = useState("");
  const [pEnd, setPEnd] = useState("");

  function openNew() {
    setEditProject(null);
    setPName("");
    setPRing(rings[0]?.id ?? "core");
    setPPhase(phases[0]?.id ?? 1);
    setPStatus("active");
    setPPriority("medium");
    setPProgress(0);
    setPNote("");
    setPTags("");
    setPStart("");
    setPEnd("");
    setShowModal(true);
  }

  function openEdit(project: Project) {
    setEditProject(project);
    setPName(project.name);
    setPRing(project.ringId);
    setPPhase(project.phase);
    setPStatus(project.status);
    setPPriority(project.priority);
    setPProgress(project.progress);
    setPNote(project.note);
    setPTags(project.tags.join(", "));
    setPStart(project.startDate ?? "");
    setPEnd(project.estimatedEndDate ?? "");
    setShowModal(true);
  }

  function save() {
    if (!pName.trim()) return;
    const tags = pTags.split(",").map((t) => t.trim()).filter(Boolean);
    if (editProject) {
      updateProject(editProject.id, {
        name: pName.trim(),
        ringId: pRing,
        phase: pPhase,
        status: pStatus,
        priority: pPriority,
        progress: pProgress,
        note: pNote.trim(),
        tags,
        startDate: pStart || undefined,
        estimatedEndDate: pEnd || undefined,
      });
    } else {
      addProject({
        id: genId(),
        name: pName.trim(),
        ringId: pRing,
        phase: pPhase,
        status: pStatus,
        priority: pPriority,
        progress: pProgress,
        note: pNote.trim(),
        tags,
        startDate: pStart || undefined,
        estimatedEndDate: pEnd || undefined,
      });
    }
    setShowModal(false);
  }

  const filtered = projects.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterRing !== "all" && p.ringId !== filterRing) return false;
    return true;
  });

  const grouped = rings.map((ring) => ({
    ring,
    projects: filtered.filter((p) => p.ringId === ring.id),
  }));

  return (
    <div>
      <SectionTitle
        sub={`${projects.length} projets sur ${rings.length} axes`}
        action={
          <button onClick={openNew} style={{ ...btnPrimary, fontSize: "0.8rem" }}>
            + Projet
          </button>
        }
      >
        Projets
      </SectionTitle>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["all", "active", "pending", "backlog"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: "0.3rem 0.8rem",
                borderRadius: 6,
                background: filterStatus === s ? C.accent : C.surfaceAlt,
                color: filterStatus === s ? "#fff" : C.textSoft,
                border: `1px solid ${filterStatus === s ? "transparent" : C.border}`,
                cursor: "pointer",
                fontSize: "0.78rem",
                textTransform: "none",
              }}
            >
              {s === "all" ? "Tous" : s === "active" ? "Actifs" : s === "pending" ? "En attente" : "Backlog"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <button
            onClick={() => setFilterRing("all")}
            style={{
              padding: "0.3rem 0.8rem",
              borderRadius: 6,
              background: filterRing === "all" ? C.surfaceHover : C.surfaceAlt,
              color: filterRing === "all" ? C.text : C.textSoft,
              border: `1px solid ${filterRing === "all" ? C.borderLight : C.border}`,
              cursor: "pointer",
              fontSize: "0.78rem",
            }}
          >
            Tous les axes
          </button>
          {rings.map((ring) => (
            <button
              key={ring.id}
              onClick={() => setFilterRing(ring.id)}
              style={{
                padding: "0.3rem 0.8rem",
                borderRadius: 6,
                background: filterRing === ring.id ? `${ring.color}20` : C.surfaceAlt,
                color: filterRing === ring.id ? ring.color : C.textSoft,
                border: `1px solid ${filterRing === ring.id ? ring.color + "50" : C.border}`,
                cursor: "pointer",
                fontSize: "0.78rem",
              }}
            >
              {ring.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups */}
      {grouped.map(({ ring, projects: ringProjects }) => {
        if (filterRing !== "all" && ring.id !== filterRing) return null;
        if (ringProjects.length === 0 && filterRing !== ring.id) return null;
        return (
          <div key={ring.id} style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: ring.color,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: "0.85rem", color: ring.color, fontWeight: 600 }}>
                {ring.label}
              </span>
              <span style={{ fontSize: "0.78rem", color: C.textDim }}>
                {ring.description}
              </span>
              <span
                style={{
                  marginLeft: 4,
                  fontSize: "0.7rem",
                  background: C.surfaceAlt,
                  color: C.textDim,
                  borderRadius: 10,
                  padding: "1px 7px",
                }}
              >
                {ringProjects.length}
              </span>
            </div>
            {ringProjects.length === 0 ? (
              <p style={{ color: C.textVeryDim, fontSize: "0.82rem", paddingLeft: 18 }}>
                Aucun projet {filterStatus === "all" ? "" : filterStatus}
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {ringProjects.map((project) => {
                  const phase = phases.find((p) => p.id === project.phase);
                  return (
                    <Card
                      key={project.id}
                      hover
                      style={{ borderLeft: `3px solid ${ring.color}` }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 8,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <PriorityDot priority={project.priority} />
                          <span style={{ fontSize: "0.9rem", color: C.text, fontWeight: 500 }}>
                            {project.name}
                          </span>
                        </div>
                        <StatusBadge status={project.status} />
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                            fontSize: "0.75rem",
                            color: C.textMuted,
                          }}
                        >
                          <span>Progression</span>
                          <span>{project.progress}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={project.progress}
                          onChange={(e) =>
                            updateProject(project.id, { progress: Number(e.target.value) })
                          }
                          style={{ width: "100%", accentColor: ring.color }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        {phase && (
                          <Badge
                            label={phase.label}
                            color={phase.accent}
                            bg={`${phase.accent}15`}
                            small
                          />
                        )}
                        {project.tags.slice(0, 2).map((tag) => (
                          <Tag key={tag} label={tag} />
                        ))}
                        <DriveRefBadges
                          refs={project.driveDocRefs ?? []}
                          onManage={() => setDriveProjectId(project.id)}
                        />
                        <button
                          onClick={() => openEdit(project)}
                          style={{
                            marginLeft: "auto",
                            background: "none",
                            border: "none",
                            color: C.textDim,
                            cursor: "pointer",
                            fontSize: "0.78rem",
                          }}
                        >
                          Modifier
                        </button>
                      </div>
                      {project.note && (
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: "0.75rem",
                            color: C.textMuted,
                            borderTop: `1px solid ${C.border}`,
                            paddingTop: 6,
                          }}
                        >
                          {project.note}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editProject ? "Modifier projet" : "Nouveau projet"}
      >
        <div style={formRow}>
          <label style={labelStyle}>Nom</label>
          <input value={pName} onChange={(e) => setPName(e.target.value)} style={inputStyle} autoFocus />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Axe</label>
            <select value={pRing} onChange={(e) => setPRing(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {rings.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Phase</label>
            <select value={pPhase} onChange={(e) => setPPhase(Number(e.target.value))} style={{ ...inputStyle, cursor: "pointer" }}>
              {phases.map((p) => (
                <option key={p.id} value={p.id}>{p.label} — {p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Statut</label>
            <select value={pStatus} onChange={(e) => setPStatus(e.target.value as ProjectStatus)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="backlog">Backlog</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Priorité</label>
            <select value={pPriority} onChange={(e) => setPPriority(e.target.value as ProjectPriority)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Progression : {pProgress}%</label>
          <input type="range" min={0} max={100} value={pProgress} onChange={(e) => setPProgress(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Note</label>
          <input value={pNote} onChange={(e) => setPNote(e.target.value)} style={inputStyle} placeholder="Description courte" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Tags (séparés par des virgules)</label>
          <input value={pTags} onChange={(e) => setPTags(e.target.value)} style={inputStyle} placeholder="achat, secteur" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Date de début</label>
            <input type="date" value={pStart} onChange={(e) => setPStart(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Date cible</label>
            <input type="date" value={pEnd} onChange={(e) => setPEnd(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editProject && (
            <button onClick={() => { removeProject(editProject.id); setShowModal(false); }} style={btnDanger}>
              Supprimer
            </button>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowModal(false)} style={btnSecondary}>Annuler</button>
            <button onClick={save} style={btnPrimary}>Enregistrer</button>
          </div>
        </div>
      </Modal>

      {/* Google Drive panel */}
      {driveProjectId && (() => {
        const proj = projects.find((p) => p.id === driveProjectId);
        if (!proj) return null;
        return (
          <GoogleDrivePanel
            projectId={driveProjectId}
            driveDocRefs={proj.driveDocRefs ?? []}
            onClose={() => setDriveProjectId(null)}
          />
        );
      })()}
    </div>
  );
}
