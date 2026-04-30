import type { ReactNode } from "react";
import { C } from "../../theme";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, children, width = 480 }: ModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 12,
          padding: "1.5rem",
          width: "100%",
          maxWidth: width,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1rem", color: C.text }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: C.textMuted,
              cursor: "pointer",
              fontSize: "1.2rem",
              lineHeight: 1,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Shared form input styles ─────────────────────────────────────────────────

export const inputStyle = {
  width: "100%",
  background: "#0a0c10",
  border: "1px solid #1f2535",
  borderRadius: 6,
  padding: "0.45rem 0.75rem",
  color: "#e8e4dc",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box" as const,
};

export const labelStyle = {
  fontSize: "0.75rem",
  color: "#8a8fa8",
  display: "block",
  marginBottom: 4,
};

export const formRow = {
  marginBottom: "0.85rem",
};

export const btnPrimary = {
  background: "var(--accent)",
  border: "none",
  color: "#fff",
  padding: "0.5rem 1.2rem",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "0.88rem",
  fontWeight: 600,
};

export const btnSecondary = {
  background: "#141820",
  border: "1px solid #1f2535",
  color: "#c4c0b5",
  padding: "0.5rem 1.2rem",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "0.88rem",
};

export const btnDanger = {
  background: "none",
  border: "1px solid #450a0a",
  color: "#ef4444",
  padding: "0.45rem 1rem",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "0.85rem",
};
