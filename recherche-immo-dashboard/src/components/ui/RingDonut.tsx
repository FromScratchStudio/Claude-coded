import { C } from "../../theme";

interface RingSegment {
  id: string;
  label: string;
  pct: number;
  color: string;
}

interface RingDonutProps {
  segments: RingSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSub?: string;
}

export function RingDonut({
  segments,
  size = 140,
  strokeWidth = 18,
  centerLabel,
  centerSub,
}: RingDonutProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.pct / 100) * circ;
    const gap = circ - dash;
    const rotation = offset * 3.6 - 90;
    offset += seg.pct;
    return { ...seg, dash, gap, rotation };
  });

  return (
    <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size}>
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={C.surfaceAlt}
          strokeWidth={strokeWidth}
        />
        {/* Segments */}
        {arcs.map((arc) => (
          <circle
            key={arc.id}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth - 2}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeLinecap="round"
            transform={`rotate(${arc.rotation} ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        ))}
        {/* Center text */}
        {centerLabel && (
          <text
            x={cx}
            y={cy - (centerSub ? 8 : 4)}
            textAnchor="middle"
            fill={C.text}
            fontSize={centerSub ? 16 : 14}
            fontWeight="600"
          >
            {centerLabel}
          </text>
        )}
        {centerSub && (
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fill={C.textMuted}
            fontSize={10}
          >
            {centerSub}
          </text>
        )}
      </svg>
      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", justifyContent: "center", marginTop: 8 }}>
        {segments.map((seg) => (
          <div key={seg.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: seg.color,
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: "0.72rem", color: C.textSoft }}>
              {seg.label} <span style={{ color: C.textMuted }}>{seg.pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
