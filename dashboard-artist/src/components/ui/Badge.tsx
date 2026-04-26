import { C, FONT } from "../../theme";
import { STATUS_META, PRIORITY_META } from "../../data/projects";
import type { ProjectStatus, ProjectPriority } from "../../types";

interface StatusBadgeProps {
  status: ProjectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const m = STATUS_META[status];
  return (
    <span
      style={{
        fontFamily: FONT.mono,
        fontSize: "0.6rem",
        letterSpacing: "0.08em",
        color: m.color,
        background: m.bg,
        borderRadius: 4,
        padding: "0.15rem 0.45rem",
        border: `1px solid ${m.color}40`,
      }}
    >
      {m.label}
    </span>
  );
}

interface PriorityDotProps {
  priority: ProjectPriority;
}

export function PriorityDot({ priority }: PriorityDotProps) {
  const m = PRIORITY_META[priority];
  return (
    <span
      title={m.label}
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: m.dot,
        flexShrink: 0,
      }}
    />
  );
}

interface TagProps {
  children: string;
  color?: string;
}

export function Tag({ children, color = C.textMuted }: TagProps) {
  return (
    <span
      style={{
        fontFamily: FONT.mono,
        fontSize: "0.58rem",
        letterSpacing: "0.1em",
        color,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        padding: "0.1rem 0.4rem",
      }}
    >
      {children}
    </span>
  );
}
