import type { CSSProperties, ReactNode } from "react";
import { C } from "../../theme";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function Card({ children, style, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "1.25rem",
        cursor: onClick ? "pointer" : undefined,
        transition: onClick ? "border-color 0.15s" : undefined,
        ...style,
      }}
      onMouseEnter={
        onClick
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = C.borderLight;
            }
          : undefined
      }
      onMouseLeave={
        onClick
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = C.border;
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
