import type { ReactNode } from "react";
import { C, FONT } from "../../theme";

interface SectionTitleProps {
  children: ReactNode;
  accent?: string;
}

export default function SectionTitle({ children, accent = C.gold }: SectionTitleProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
      <div style={{ width: 3, height: 16, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: FONT.mono,
          fontSize: "0.7rem",
          color: accent,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}
