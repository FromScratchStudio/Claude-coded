import { C } from "../../theme";

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
}

export default function ProgressBar({ value, color = C.gold, height = 6 }: ProgressBarProps) {
  return (
    <div style={{ background: C.border, borderRadius: height, height, overflow: "hidden" }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
          background: color,
          borderRadius: height,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}
