import React from "react";
import { C, FONT } from "../../theme";

interface SectionTitleProps {
  children: React.ReactNode;
  accent?: string;
}

export default function SectionTitle({ children, accent }: SectionTitleProps) {
  const color = accent ?? C.textDim;
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontSize: "0.66rem",
        letterSpacing: "0.15em",
        color,
        textTransform: "uppercase",
        marginBottom: "1rem",
        borderLeft: `2px solid ${color}`,
        paddingLeft: "0.5rem",
      }}
    >
      {children}
    </div>
  );
}
