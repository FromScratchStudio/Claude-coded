import { C, FONT } from "../../theme";
import type { Ring } from "../../types";

interface RingDonutProps {
  rings: Ring[];
  allocation?: Record<string, number> | { centre: number; ampli: number; collab: number; opt: number };
  size?: number;
}

export default function RingDonut({ rings, allocation, size = 140 }: RingDonutProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.37;
  const strokeWidth = size * 0.088;

  // Merge allocation overrides into ring data
  const display = allocation
    ? rings.map((ring) => {
        const key =
          ring.id === "centre"
            ? "centre"
            : ring.id === "anneau1"
            ? "ampli"
            : ring.id === "anneau2"
            ? "collab"
            : "opt";
        return { ...ring, pct: allocation[key] ?? 0 };
      })
    : rings;

  const total = display.reduce((s, r) => s + r.pct, 0) || 1;

  // Build SVG arcs
  let angle = -90;
  const arcs = display
    .filter((r) => r.pct > 0)
    .map((ring) => {
      const sweep = (ring.pct / total) * 360;
      const startAngle = angle;
      const endAngle = angle + sweep - 1.5; // small gap between arcs
      angle += sweep;

      const toRad = (d: number) => (d * Math.PI) / 180;
      const x1 = cx + radius * Math.cos(toRad(startAngle));
      const y1 = cy + radius * Math.sin(toRad(startAngle));
      const x2 = cx + radius * Math.cos(toRad(endAngle));
      const y2 = cy + radius * Math.sin(toRad(endAngle));
      const largeArc = sweep > 180 ? 1 : 0;

      return {
        ...ring,
        d: `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      };
    });

  const centreValue = display[0]?.pct ?? 0;

  return (
    <svg width={size} height={size} aria-hidden="true">
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={C.surfaceHover}
        strokeWidth={strokeWidth}
      />
      {/* Colored arcs */}
      {arcs.map((arc) => (
        <path
          key={arc.id}
          d={arc.d}
          fill="none"
          stroke={arc.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${arc.color}44)` }}
        />
      ))}
      {/* Center label */}
      <text
        x={cx}
        y={cy - 5}
        textAnchor="middle"
        fill={C.gold}
        style={{
          fontSize: size * 0.155,
          fontFamily: FONT.display,
          fontWeight: "bold",
        }}
      >
        {centreValue}%
      </text>
      <text
        x={cx}
        y={cy + size * 0.1}
        textAnchor="middle"
        fill={C.textDim}
        style={{
          fontSize: size * 0.062,
          fontFamily: FONT.mono,
          letterSpacing: 1,
        }}
      >
        CENTRE
      </text>
    </svg>
  );
}
