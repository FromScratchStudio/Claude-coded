import { C } from "../../theme";

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  dot?: boolean;
  small?: boolean;
}

export function Badge({ label, color, bg, dot = false, small = false }: BadgeProps) {
  const textColor = color ?? C.textMuted;
  const bgColor = bg ?? C.surfaceAlt;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: small ? "2px 7px" : "3px 9px",
        borderRadius: 20,
        background: bgColor,
        color: textColor,
        fontSize: small ? "0.65rem" : "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
        border: `1px solid ${textColor}30`,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: textColor,
            flexShrink: 0,
          }}
        />
      )}
      {label}
    </span>
  );
}

// ─── Priority dot ─────────────────────────────────────────────────────────────

const PRIORITY_COLORS: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#8a8fa8",
};

export function PriorityDot({ priority }: { priority: string }) {
  return (
    <span
      title={priority}
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: PRIORITY_COLORS[priority] ?? C.textDim,
        flexShrink: 0,
      }}
    />
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  active: { color: "#10b981", bg: "#064e3b40" },
  pending: { color: "#f59e0b", bg: "#78350f30" },
  backlog: { color: "#8a8fa8", bg: "#1f253530" },
  "in-progress": { color: "#4c7fc9", bg: "#1e3a5f40" },
  done: { color: "#10b981", bg: "#064e3b40" },
  blocked: { color: "#ef4444", bg: "#450a0a40" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { color: C.textMuted, bg: C.surfaceAlt };
  return <Badge label={status} color={s.color} bg={s.bg} />;
}

// ─── Tag chip ─────────────────────────────────────────────────────────────────

export function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        background: C.surfaceAlt,
        color: C.textMuted,
        fontSize: "0.68rem",
        border: `1px solid ${C.border}`,
      }}
    >
      {label}
    </span>
  );
}
