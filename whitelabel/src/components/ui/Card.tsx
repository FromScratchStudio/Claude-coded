import type { CSSProperties, ReactNode, KeyboardEvent, MouseEvent } from "react";
import { C } from "../../theme";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function Card({ children, style, onClick }: CardProps) {
  const interactiveProps = onClick
    ? {
        role: "button" as const,
        tabIndex: 0,
        onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
        },
        onMouseEnter: (e: MouseEvent<HTMLDivElement>) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px ${C.borderLight}`;
        },
        onMouseLeave: (e: MouseEvent<HTMLDivElement>) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        },
      }
    : {};

  return (
    <div
      onClick={onClick}
      {...interactiveProps}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "1.25rem",
        cursor: onClick ? "pointer" : undefined,
        transition: onClick ? "box-shadow 0.15s" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
