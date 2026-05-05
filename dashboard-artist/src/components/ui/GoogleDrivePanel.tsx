import { useState } from "react";
import { useStore } from "../../store/useStore";
import { C, FONT } from "../../theme";
import { sanitizeUrl } from "../../services/sanitizeUrl";
import type { DriveDocRef, DriveDocType } from "../../types";

const DOC_TYPE_ICONS: Record<DriveDocType, string> = {
  doc: "📄",
  sheet: "📊",
  slides: "📑",
  form: "📋",
  folder: "📁",
  other: "🔗",
};

const DOC_TYPE_LABELS: Record<DriveDocType, string> = {
  doc: "Doc",
  sheet: "Sheet",
  slides: "Slides",
  form: "Form",
  folder: "Dossier",
  other: "Autre",
};

const inputStyle = {
  background: C.surfaceAlt,
  border: `1px solid ${C.border}`,
  color: C.text,
  borderRadius: 6,
  padding: "0.4rem 0.6rem",
  fontSize: "0.78rem",
  fontFamily: FONT.mono,
  width: "100%",
  boxSizing: "border-box" as const,
};

function genRefId() {
  return `dr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

interface GoogleDrivePanelProps {
  projectId: string;
  driveDocRefs: DriveDocRef[];
  onClose: () => void;
}

export function GoogleDrivePanel({ projectId, driveDocRefs, onClose }: GoogleDrivePanelProps) {
  const googleDriveConfig = useStore((s) => s.googleDriveConfig);
  const addDriveDocRef = useStore((s) => s.addDriveDocRef);
  const removeDriveDocRef = useStore((s) => s.removeDriveDocRef);

  const [showForm, setShowForm] = useState(false);
  const [refName, setRefName] = useState("");
  const [refUrl, setRefUrl] = useState("");
  const [refType, setRefType] = useState<DriveDocType>("doc");
  const [refNote, setRefNote] = useState("");

  function resetForm() {
    setRefName("");
    setRefUrl("");
    setRefType("doc");
    setRefNote("");
    setShowForm(false);
  }

  function handleAdd() {
    if (!refName.trim() || !refUrl.trim()) return;
    const safeUrl = sanitizeUrl(refUrl);
    if (!safeUrl) return;
    addDriveDocRef(projectId, {
      id: genRefId(),
      name: refName.trim(),
      url: safeUrl,
      type: refType,
      note: refNote.trim(),
      addedAt: new Date().toISOString(),
    });
    resetForm();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.bgDeep,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "1.25rem",
          width: "100%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflowY: "auto",
          fontFamily: FONT.mono,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.1rem" }}>🗂</span>
            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: C.text, fontFamily: FONT.mono }}>
              Documents Google Drive
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "1.1rem" }}
          >
            ×
          </button>
        </div>

        {/* Lien dossier */}
        {googleDriveConfig.folderUrl && (() => {
          const safeFolder = sanitizeUrl(googleDriveConfig.folderUrl);
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0.5rem 0.75rem",
                background: C.surfaceAlt,
                borderRadius: 6,
                marginBottom: "1rem",
                fontSize: "0.72rem",
              }}
            >
              <span>📁</span>
              <span style={{ color: C.textMuted, flexShrink: 0 }}>Dossier Drive :</span>
              {safeFolder ? (
                <a
                  href={safeFolder}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: C.gold, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {googleDriveConfig.folderName || safeFolder}
                </a>
              ) : (
                <span style={{ color: C.textVeryDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {googleDriveConfig.folderName || googleDriveConfig.folderUrl} (URL invalide)
                </span>
              )}
            </div>
          );
        })()}

        {/* Liste de documents */}
        {driveDocRefs.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1rem" }}>
            {driveDocRefs.map((ref) => (
              <div
                key={ref.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "0.6rem 0.75rem",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                }}
              >
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>{DOC_TYPE_ICONS[ref.type]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {sanitizeUrl(ref.url) ? (
                    <a
                      href={sanitizeUrl(ref.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: C.text, textDecoration: "none", fontSize: "0.78rem", fontWeight: 500, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {ref.name}
                    </a>
                  ) : (
                    <span style={{ color: C.textVeryDim, fontSize: "0.78rem", fontWeight: 500, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ref.name}
                    </span>
                  )}
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                    <span style={{ fontSize: "0.65rem", color: C.textDim, background: C.surfaceAlt, padding: "1px 6px", borderRadius: 4 }}>
                      {DOC_TYPE_LABELS[ref.type]}
                    </span>
                    {ref.note && (
                      <span style={{ fontSize: "0.65rem", color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ref.note}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeDriveDocRef(projectId, ref.id)}
                  style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem", flexShrink: 0 }}
                  title="Supprimer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: C.textVeryDim, fontSize: "0.75rem", textAlign: "center", margin: "0.5rem 0 1rem" }}>
            Aucun document lié pour l'instant.
          </p>
        )}

        {/* Formulaire d'ajout */}
        {showForm ? (
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "0.85rem", background: C.surface }}>
            <div style={{ marginBottom: "0.65rem" }}>
              <label style={{ fontSize: "0.62rem", color: C.textDim, display: "block", marginBottom: "0.25rem" }}>
                Nom du document
              </label>
              <input
                value={refName}
                onChange={(e) => setRefName(e.target.value)}
                style={inputStyle}
                placeholder="Mon Document"
                autoFocus
              />
            </div>
            <div style={{ marginBottom: "0.65rem" }}>
              <label style={{ fontSize: "0.62rem", color: C.textDim, display: "block", marginBottom: "0.25rem" }}>
                URL Google Drive
              </label>
              <input
                value={refUrl}
                onChange={(e) => setRefUrl(e.target.value)}
                style={{ ...inputStyle, borderColor: refUrl && !sanitizeUrl(refUrl) ? C.red : undefined }}
                placeholder="https://docs.google.com/..."
              />
              {refUrl && !sanitizeUrl(refUrl) && (
                <span style={{ fontSize: "0.62rem", color: C.red, marginTop: 2, display: "block", fontFamily: FONT.mono }}>
                  L'URL doit commencer par https:// ou http://
                </span>
              )}
            </div>
            <div style={{ marginBottom: "0.65rem" }}>
              <label style={{ fontSize: "0.62rem", color: C.textDim, display: "block", marginBottom: "0.25rem" }}>
                Type
              </label>
              <select
                value={refType}
                onChange={(e) => setRefType(e.target.value as DriveDocType)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {(Object.entries(DOC_TYPE_LABELS) as [DriveDocType, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{DOC_TYPE_ICONS[k]} {v}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "0.85rem" }}>
              <label style={{ fontSize: "0.62rem", color: C.textDim, display: "block", marginBottom: "0.25rem" }}>
                Note (optionnel)
              </label>
              <input
                value={refNote}
                onChange={(e) => setRefNote(e.target.value)}
                style={inputStyle}
                placeholder="Courte description…"
              />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={resetForm}
                style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.7rem" }}
              >
                Annuler
              </button>
              <button
                onClick={handleAdd}
                disabled={!refName.trim() || !sanitizeUrl(refUrl)}
                style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.7rem", fontWeight: "bold", opacity: (!refName.trim() || !sanitizeUrl(refUrl)) ? 0.5 : 1 }}
              >
                Ajouter
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
            <button
              onClick={() => setShowForm(true)}
              style={{ background: C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.4rem 0.9rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.72rem", fontWeight: "bold" }}
            >
              + Ajouter un document
            </button>
            <button
              onClick={onClose}
              style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.4rem 0.9rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.72rem" }}
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface DriveRefBadgesProps {
  refs: DriveDocRef[];
  onManage: () => void;
}

export function DriveRefBadges({ refs, onManage }: DriveRefBadgesProps) {
  if (refs.length === 0) {
    return (
      <button
        onClick={onManage}
        style={{
          background: "none",
          border: `1px dashed ${C.border}`,
          borderRadius: 5,
          color: C.textVeryDim,
          cursor: "pointer",
          fontSize: "0.65rem",
          padding: "2px 8px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontFamily: FONT.mono,
        }}
        title="Lier des documents Google Drive"
      >
        <span>🗂</span> Drive
      </button>
    );
  }

  return (
    <button
      onClick={onManage}
      style={{
        background: "none",
        border: `1px solid ${C.border}`,
        borderRadius: 5,
        color: C.textMuted,
        cursor: "pointer",
        fontSize: "0.65rem",
        padding: "2px 8px",
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontFamily: FONT.mono,
      }}
      title="Gérer les documents Google Drive"
    >
      <span>🗂</span>
      {refs.length} doc{refs.length > 1 ? "s" : ""}
    </button>
  );
}
