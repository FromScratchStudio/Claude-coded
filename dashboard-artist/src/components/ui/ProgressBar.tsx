import { C } from "../../theme";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  color = C.gold,
  height = 4,
  showLabel = false,
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div
        style={{
          flex: 1,
          background: C.border,
          borderRadius: 999,
          overflow: "hidden",
          height,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 999,
            background: color,
            transition: "width 0.4s ease",
            boxShadow: pct > 0 ? `0 0 6px ${color}55` : "none",
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.65rem",
            color: C.textMuted,
            minWidth: 28,
            textAlign: "right",
          }}
        >
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
