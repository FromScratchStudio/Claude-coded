import type { CSSProperties, ReactNode } from "react";
import { C } from "../../theme";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, style, onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "1.25rem",
        cursor: onClick ? "pointer" : "default",
        transition: hover ? "border-color 0.15s, background 0.15s" : undefined,
        ...style,
      }}
      onMouseEnter={
        hover
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = C.borderLight;
              (e.currentTarget as HTMLDivElement).style.background = C.surfaceHover;
            }
          : undefined
      }
      onMouseLeave={
        hover
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = C.border;
              (e.currentTarget as HTMLDivElement).style.background = C.surface;
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
