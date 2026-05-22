import { useMemo, useState } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import { sanitizeUrl } from "../../services/sanitizeUrl";
import type { PipelineItem, WorkflowStage } from "../../types";

function genId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function PipelineView() {
  const appConfig = useStore((s) => s.appConfig);
  const projects = useStore((s) => s.projects);
  const workflowStages = useStore((s) => s.workflowStages);
  const pipelineItems = useStore((s) => s.pipelineItems);
  const addPipelineItem = useStore((s) => s.addPipelineItem);
  const updatePipelineItem = useStore((s) => s.updatePipelineItem);
  const removePipelineItem = useStore((s) => s.removePipelineItem);
  const togglePipelineGate = useStore((s) => s.togglePipelineGate);
  const addWorkflowStage = useStore((s) => s.addWorkflowStage);
  const updateWorkflowStage = useStore((s) => s.updateWorkflowStage);
  const removeWorkflowStage = useStore((s) => s.removeWorkflowStage);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [editStage, setEditStage] = useState<WorkflowStage | null>(null);
  const [editItem, setEditItem] = useState<PipelineItem | null>(null);

  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemStage, setItemStage] = useState(workflowStages[0]?.id ?? 1);
  const [itemProjectId, setItemProjectId] = useState<string | null>(null);
  const [itemDocumentName, setItemDocumentName] = useState("");
  const [itemDocumentUrl, setItemDocumentUrl] = useState("");
  const [itemNbPieces, setItemNbPieces] = useState("");
  const [itemSurface, setItemSurface] = useState("");
  const [itemPrix, setItemPrix] = useState("");
  const [itemEtage, setItemEtage] = useState("");
  const [itemContactNom, setItemContactNom] = useState("");
  const [itemContactPrenom, setItemContactPrenom] = useState("");
  const [itemContactEmail, setItemContactEmail] = useState("");
  const [itemContactTelephone, setItemContactTelephone] = useState("");
  const [itemContactAgence, setItemContactAgence] = useState("");
  const [itemStart, setItemStart] = useState("");
  const [itemEnd, setItemEnd] = useState("");

  const [stageLabel, setStageLabel] = useState("");
  const [stageFullName, setStageFullName] = useState("");
  const [stageWhen, setStageWhen] = useState("");
  const [stageRule, setStageRule] = useState("");
  const [stageGates, setStageGates] = useState("");
  const [stageForCalendar, setStageForCalendar] = useState(false);

  const selectedItem = useMemo(
    () => pipelineItems.find((item) => item.id === selectedItemId) ?? null,
    [pipelineItems, selectedItemId]
  );

  function resetItemForm() {
    setItemTitle("");
    setItemDescription("");
    setItemStage(workflowStages[0]?.id ?? 1);
    setItemProjectId(null);
    setItemDocumentName("");
    setItemDocumentUrl("");
    setItemNbPieces("");
    setItemSurface("");
    setItemPrix("");
    setItemEtage("");
    setItemContactNom("");
    setItemContactPrenom("");
    setItemContactEmail("");
    setItemContactTelephone("");
    setItemContactAgence("");
    setItemStart("");
    setItemEnd("");
  }

  function openNewItem() {
    setEditItem(null);
    resetItemForm();
    setShowItemModal(true);
  }

  function openEditItem(item: PipelineItem) {
    setEditItem(item);
    setItemTitle(item.title);
    setItemDescription(item.description);
    setItemStage(item.stage);
    setItemProjectId(item.projectId);
    setItemDocumentName(item.documentName);
    setItemDocumentUrl(item.documentUrl);
    setItemNbPieces(item.nbPieces);
    setItemSurface(item.surface);
    setItemPrix(item.prix);
    setItemEtage(item.etage);
    setItemContactNom(item.contactNom);
    setItemContactPrenom(item.contactPrenom);
    setItemContactEmail(item.contactEmail);
    setItemContactTelephone(item.contactTelephone);
    setItemContactAgence(item.contactAgence);
    setItemStart(item.startDate ?? "");
    setItemEnd(item.estimatedEndDate ?? "");
    setShowItemModal(true);
  }

  function saveItem() {
    if (!itemTitle.trim()) return;
    const stage = workflowStages.find((s) => s.id === itemStage);
    const safeDocumentUrl = sanitizeUrl(itemDocumentUrl) ?? "";

    const payload = {
      title: itemTitle.trim(),
      description: itemDescription.trim(),
      stage: itemStage,
      projectId: itemProjectId,
      documentName: itemDocumentName.trim() || itemTitle.trim(),
      documentUrl: safeDocumentUrl,
      nbPieces: itemNbPieces.trim(),
      surface: itemSurface.trim(),
      prix: itemPrix.trim(),
      etage: itemEtage.trim(),
      contactNom: itemContactNom.trim(),
      contactPrenom: itemContactPrenom.trim(),
      contactEmail: itemContactEmail.trim(),
      contactTelephone: itemContactTelephone.trim(),
      contactAgence: itemContactAgence.trim(),
      startDate: itemStart || undefined,
      estimatedEndDate: itemEnd || undefined,
      lastUpdate: "mis à jour",
    };

    if (editItem) {
      updatePipelineItem(editItem.id, payload);
    } else {
      addPipelineItem({
        id: genId(),
        ...payload,
        gates: Array(stage?.gates.length ?? 0).fill(false),
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
    setStageForCalendar(false);
    setShowStageModal(true);
  }

  function openEditStage(stage: WorkflowStage) {
    setEditStage(stage);
    setStageLabel(stage.label);
    setStageFullName(stage.fullName);
    setStageWhen(stage.when);
    setStageRule(stage.rule);
    setStageGates(stage.gates.join("\n"));
    setStageForCalendar(Boolean(stage.isCalendarStage));
    setShowStageModal(true);
  }

  function saveStage() {
    if (!stageLabel.trim()) return;
    const gates = stageGates.split("\n").map((g) => g.trim()).filter(Boolean);
    if (editStage) {
      updateWorkflowStage(editStage.id, {
        label: stageLabel.trim(),
        fullName: stageFullName.trim(),
        when: stageWhen.trim(),
        rule: stageRule.trim(),
        gates,
        isCalendarStage: stageForCalendar,
      });
    } else {
      addWorkflowStage({
        label: stageLabel.trim(),
        fullName: stageFullName.trim(),
        when: stageWhen.trim(),
        rule: stageRule.trim(),
        gates,
        isCalendarStage: stageForCalendar,
      });
    }
    setShowStageModal(false);
  }

  const doneStageId = workflowStages[workflowStages.length - 1]?.id;
  const activeItems = pipelineItems.filter((item) => item.stage !== doneStageId);
  const archivedItems = pipelineItems.filter((item) => item.stage === doneStageId);

  return (
    <div>
      <SectionTitle
        sub={`${appConfig.pipelineItemPluralLabel} de recherche immobilière`}
        action={(
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={openNewStage} style={{ ...btnSecondary, fontSize: "0.8rem" }}>
              + Étape
            </button>
            <button onClick={openNewItem} style={{ ...btnPrimary, fontSize: "0.8rem" }}>
              + {appConfig.pipelineItemLabel}
            </button>
          </div>
        )}
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
                minWidth: 250,
                flex: 1,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "0.65rem 0.85rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surfaceAlt }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 4, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                    {stage.id}
                  </span>
                  <div>
                    <span style={{ fontSize: "0.82rem", color: C.textSoft, fontWeight: 600 }}>{stage.label}</span>
                    {stage.isCalendarStage && (
                      <div style={{ fontSize: "0.68rem", color: C.accent }}>Étape calendrier</div>
                    )}
                  </div>
                </div>
                <button onClick={() => openEditStage(stage)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.9rem" }}>⚙</button>
              </div>

              <div style={{ padding: "0.5rem", display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map((item) => {
                  const project = projects.find((projectItem) => projectItem.id === item.projectId);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)}
                      style={{
                        padding: "0.6rem 0.75rem",
                        background: selectedItemId === item.id ? C.accentDim : C.surfaceAlt,
                        border: `1px solid ${selectedItemId === item.id ? C.accentLight : C.border}`,
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: "0.82rem", color: C.text, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: "0.72rem", color: C.textMuted }}>{project?.name || "Projet non défini"}</div>
                      <div style={{ marginTop: 4, fontSize: "0.7rem", color: C.textDim }}>
                        {item.nbPieces || "?"} p · {item.surface || "?"} m² · {item.prix || "?"} €
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div style={{ padding: "0.75rem", textAlign: "center", color: C.textVeryDim, fontSize: "0.78rem" }}>
                    Vide
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <Card style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <h3 style={{ margin: 0, color: C.text, fontSize: "1rem" }}>{selectedItem.title}</h3>
              <p style={{ margin: "4px 0 0", color: C.textMuted, fontSize: "0.82rem" }}>{selectedItem.description || "Aucune description"}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEditItem(selectedItem)} style={{ ...btnSecondary, fontSize: "0.8rem" }}>Modifier</button>
              <button
                onClick={() => {
                  removePipelineItem(selectedItem.id);
                  setSelectedItemId(null);
                }}
                style={{ ...btnDanger, fontSize: "0.8rem" }}
              >
                Supprimer
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10, marginBottom: "1rem" }}>
            <Info label="Projet" value={projects.find((p) => p.id === selectedItem.projectId)?.name || "Non défini"} />
            <Info label="Document source" value={selectedItem.documentName || "Non défini"} />
            <Info label="Nb pièces" value={selectedItem.nbPieces || "—"} />
            <Info label="Surface (m²)" value={selectedItem.surface || "—"} />
            <Info label="Prix (€)" value={selectedItem.prix || "—"} />
            <Info label="Étage" value={selectedItem.etage || "—"} />
            <Info label="Nom contact" value={selectedItem.contactNom || "—"} />
            <Info label="Prénom contact" value={selectedItem.contactPrenom || "—"} />
            <Info label="Email contact" value={selectedItem.contactEmail || "—"} />
            <Info label="Téléphone contact" value={selectedItem.contactTelephone || "—"} />
            <Info label="Agence" value={selectedItem.contactAgence || "—"} />
          </div>

          {sanitizeUrl(selectedItem.documentUrl) && (
            <a
              href={sanitizeUrl(selectedItem.documentUrl) ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.accent, textDecoration: "none", fontSize: "0.82rem" }}
            >
              Ouvrir le document lié
            </a>
          )}

          <div style={{ marginTop: "0.9rem", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: 6 }}>Changer d’étape</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {workflowStages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => updatePipelineItem(selectedItem.id, { stage: stage.id, gates: Array(stage.gates.length).fill(false) })}
                  style={{ padding: "0.3rem 0.75rem", borderRadius: 6, background: selectedItem.stage === stage.id ? C.accent : C.surfaceAlt, color: selectedItem.stage === stage.id ? "#fff" : C.textSoft, border: "none", cursor: "pointer", fontSize: "0.78rem" }}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const stage = workflowStages.find((s) => s.id === selectedItem.stage);
            if (!stage || stage.gates.length === 0) return null;
            return (
              <div>
                <div style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: 6 }}>Critères de validation</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {stage.gates.map((gate, idx) => {
                    const checked = selectedItem.gates[idx] ?? false;
                    return (
                      <label key={idx} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.82rem", color: checked ? C.green : C.textSoft, padding: "0.2rem 0" }}>
                        <input type="checkbox" checked={checked} onChange={() => togglePipelineGate(selectedItem.id, idx)} style={{ accentColor: C.green }} />
                        <span style={{ textDecoration: checked ? "line-through" : "none" }}>{gate}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </Card>
      )}

      {archivedItems.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: C.textDim, marginBottom: "0.75rem" }}>
            Dossiers clôturés ({archivedItems.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.5rem" }}>
            {archivedItems.map((item) => (
              <div key={item.id} style={{ padding: "0.55rem 0.75rem", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                <div style={{ fontSize: "0.82rem", color: C.textSoft }}>{item.title}</div>
                <div style={{ fontSize: "0.7rem", color: C.textDim, marginTop: 2 }}>{item.lastUpdate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={showItemModal} onClose={() => setShowItemModal(false)} title={editItem ? `Modifier ${appConfig.pipelineItemLabel}` : `Nouveau ${appConfig.pipelineItemLabel}`}>
        <div style={formRow}>
          <label style={labelStyle}>Titre</label>
          <input value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} style={inputStyle} autoFocus />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Description</label>
          <input value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} style={inputStyle} />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Projet</label>
          <select value={itemProjectId ?? ""} onChange={(e) => setItemProjectId(e.target.value || null)} style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">Aucun</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Étape</label>
          <select value={itemStage} onChange={(e) => setItemStage(Number(e.target.value))} style={{ ...inputStyle, cursor: "pointer" }}>
            {workflowStages.map((stage) => (
              <option key={stage.id} value={stage.id}>{stage.label}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Nom du document</label>
            <input value={itemDocumentName} onChange={(e) => setItemDocumentName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Lien document</label>
            <input value={itemDocumentUrl} onChange={(e) => setItemDocumentUrl(e.target.value)} style={inputStyle} placeholder="https://..." />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Nb pièces</label>
            <input value={itemNbPieces} onChange={(e) => setItemNbPieces(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Surface (m²)</label>
            <input value={itemSurface} onChange={(e) => setItemSurface(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Prix (€)</label>
            <input value={itemPrix} onChange={(e) => setItemPrix(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Étage</label>
            <input value={itemEtage} onChange={(e) => setItemEtage(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Nom contact</label>
            <input value={itemContactNom} onChange={(e) => setItemContactNom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Prénom contact</label>
            <input value={itemContactPrenom} onChange={(e) => setItemContactPrenom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email contact</label>
            <input value={itemContactEmail} onChange={(e) => setItemContactEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Téléphone contact</label>
            <input value={itemContactTelephone} onChange={(e) => setItemContactTelephone(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Agence immobilière</label>
          <input value={itemContactAgence} onChange={(e) => setItemContactAgence(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Date début</label>
            <input type="date" value={itemStart} onChange={(e) => setItemStart(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Date cible</label>
            <input type="date" value={itemEnd} onChange={(e) => setItemEnd(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => setShowItemModal(false)} style={btnSecondary}>Annuler</button>
          <button onClick={saveItem} style={btnPrimary}>{editItem ? "Enregistrer" : "Ajouter"}</button>
        </div>
      </Modal>

      <Modal open={showStageModal} onClose={() => setShowStageModal(false)} title={editStage ? "Modifier étape" : "Nouvelle étape"}>
        <div style={formRow}>
          <label style={labelStyle}>Libellé court</label>
          <input value={stageLabel} onChange={(e) => setStageLabel(e.target.value)} style={inputStyle} />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Nom complet</label>
          <input value={stageFullName} onChange={(e) => setStageFullName(e.target.value)} style={inputStyle} />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Quand utiliser</label>
          <input value={stageWhen} onChange={(e) => setStageWhen(e.target.value)} style={inputStyle} />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Règle</label>
          <input value={stageRule} onChange={(e) => setStageRule(e.target.value)} style={inputStyle} />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Critères (un par ligne)</label>
          <textarea value={stageGates} onChange={(e) => setStageGates(e.target.value)} style={{ ...inputStyle, height: 90, resize: "vertical" }} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.9rem", fontSize: "0.8rem", color: C.textSoft }}>
          <input type="checkbox" checked={stageForCalendar} onChange={(e) => setStageForCalendar(e.target.checked)} style={{ accentColor: C.accent }} />
          Étape cible pour la planification calendrier
        </label>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editStage && (
            <button
              onClick={() => {
                removeWorkflowStage(editStage.id);
                setShowStageModal(false);
              }}
              style={btnDanger}
            >
              Supprimer étape
            </button>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowStageModal(false)} style={btnSecondary}>Annuler</button>
            <button onClick={saveStage} style={btnPrimary}>Enregistrer</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 6, padding: "0.55rem 0.65rem" }}>
      <div style={{ fontSize: "0.68rem", color: C.textDim, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: "0.8rem", color: C.textSoft }}>{value}</div>
    </div>
  );
}
