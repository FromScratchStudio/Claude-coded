import type { CSSProperties, ReactNode } from "react";
import { C } from "../../theme";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 24,
        backdropFilter: "blur(18px)",
        boxShadow: "0 20px 45px rgba(0, 0, 0, 0.24)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
