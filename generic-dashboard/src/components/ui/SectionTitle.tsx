import type { ReactNode } from "react";
import { C, FONT } from "../../theme";

interface SectionTitleProps {
  children: ReactNode;
  sub?: string;
  accent?: string;
  action?: ReactNode;
}

export function SectionTitle({ children, sub, accent, action }: SectionTitleProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 3,
            height: 22,
            borderRadius: 2,
            background: accent ?? C.accent,
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: "1.15rem",
              color: C.text,
              lineHeight: 1.2,
            }}
          >
            {children}
          </div>
          {sub && (
            <div style={{ fontSize: "0.78rem", color: C.textMuted, marginTop: 2 }}>
              {sub}
            </div>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
