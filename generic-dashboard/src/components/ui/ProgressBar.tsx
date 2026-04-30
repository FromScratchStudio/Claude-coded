import { C } from "../../theme";

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  color,
  height = 6,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  const barColor = color ?? C.accent;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {(showLabel || label) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: C.textMuted,
          }}
        >
          {label && <span>{label}</span>}
          {showLabel && <span>{pct}%</span>}
        </div>
      )}
      <div
        style={{
          width: "100%",
          height,
          background: C.surfaceAlt,
          borderRadius: height,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: barColor,
            borderRadius: height,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
