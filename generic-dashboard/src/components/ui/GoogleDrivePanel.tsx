import { useState } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "./Modal";
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
  folder: "Folder",
  other: "Other",
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
    addDriveDocRef(projectId, {
      id: genRefId(),
      name: refName.trim(),
      url: refUrl.trim(),
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
        background: "rgba(0,0,0,0.55)",
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
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.1rem" }}>🗂</span>
            <span style={{ fontSize: "0.95rem", fontWeight: 600, color: C.text }}>
              Google Drive Documents
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "1.1rem" }}
          >
            ×
          </button>
        </div>

        {/* Folder link */}
        {googleDriveConfig.folderUrl && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0.5rem 0.75rem",
              background: C.surfaceAlt,
              borderRadius: 6,
              marginBottom: "1rem",
              fontSize: "0.78rem",
            }}
          >
            <span>📁</span>
            <span style={{ color: C.textMuted, flexShrink: 0 }}>Drive folder:</span>
            <a
              href={googleDriveConfig.folderUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.accent, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {googleDriveConfig.folderName || googleDriveConfig.folderUrl}
            </a>
          </div>
        )}

        {/* Document list */}
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
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: C.text, textDecoration: "none", fontSize: "0.82rem", fontWeight: 500, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {ref.name}
                  </a>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                    <span style={{ fontSize: "0.68rem", color: C.textDim, background: C.surfaceAlt, padding: "1px 6px", borderRadius: 4 }}>
                      {DOC_TYPE_LABELS[ref.type]}
                    </span>
                    {ref.note && (
                      <span style={{ fontSize: "0.68rem", color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ref.note}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeDriveDocRef(projectId, ref.id)}
                  style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.9rem", flexShrink: 0 }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: C.textVeryDim, fontSize: "0.8rem", textAlign: "center", margin: "0.5rem 0 1rem" }}>
            No documents linked yet.
          </p>
        )}

        {/* Add form */}
        {showForm ? (
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "0.85rem", background: C.surface }}>
            <div style={formRow}>
              <label style={labelStyle}>Document name</label>
              <input
                value={refName}
                onChange={(e) => setRefName(e.target.value)}
                style={inputStyle}
                placeholder="My Document"
                autoFocus
              />
            </div>
            <div style={formRow}>
              <label style={labelStyle}>Google Drive URL</label>
              <input
                value={refUrl}
                onChange={(e) => setRefUrl(e.target.value)}
                style={inputStyle}
                placeholder="https://docs.google.com/..."
              />
            </div>
            <div style={formRow}>
              <label style={labelStyle}>Type</label>
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
            <div style={formRow}>
              <label style={labelStyle}>Note (optional)</label>
              <input
                value={refNote}
                onChange={(e) => setRefNote(e.target.value)}
                style={inputStyle}
                placeholder="Short description"
              />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button onClick={resetForm} style={btnSecondary}>Cancel</button>
              <button onClick={handleAdd} style={btnPrimary} disabled={!refName.trim() || !refUrl.trim()}>
                Add
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
            <button onClick={() => setShowForm(true)} style={btnPrimary}>
              + Add Document
            </button>
            <button onClick={onClose} style={btnSecondary}>Close</button>
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
          fontSize: "0.7rem",
          padding: "2px 8px",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
        title="Link Google Drive documents"
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
        fontSize: "0.7rem",
        padding: "2px 8px",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
      title="Manage Google Drive documents"
    >
      <span>🗂</span>
      {refs.length} doc{refs.length > 1 ? "s" : ""}
    </button>
  );
}

export function DriveDeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={btnDanger}>
      Delete
    </button>
  );
}
