import type { ReactNode } from "react";
import { FONT } from "../../theme";

interface BadgeProps {
  children: ReactNode;
  color?: string;
}

export default function Badge({ children, color = "#c9a84c" }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.1rem 0.45rem",
        borderRadius: 4,
        background: `${color}22`,
        color,
        fontFamily: FONT.mono,
        fontSize: "0.62rem",
        letterSpacing: "0.08em",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
