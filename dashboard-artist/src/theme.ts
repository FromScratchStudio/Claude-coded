// ─── Design tokens ────────────────────────────────────────────────────────────
// Single source of truth for all colors used across the application.

export const C = {
  // Backgrounds
  bg: "#0a0c10",
  bgDeep: "#06080c",
  surface: "#0d1118",
  surfaceAlt: "#141820",
  surfaceHover: "#1a2030",

  // Borders
  border: "#1f2535",
  borderLight: "#2d3449",

  // Brand
  gold: "#c9a84c",
  goldLight: "#e0c070",
  goldDim: "#8a6e30",

  // Text
  text: "#e8e4dc",
  textSoft: "#c4c0b5",
  textMuted: "#8a8fa8",
  textDim: "#555b70",
  textVeryDim: "#3a3f52",

  // Accents
  green: "#10b981",
  greenDark: "#064e3b",
  red: "#ef4444",
  redDark: "#450a0a",
  amber: "#f59e0b",
  orange: "#f97316",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  violetDark: "#4c1d95",
  pink: "#ec4899",
  blue: "#4c7fc9",
  meta: "#9b6ec9",

  // Phase accent colors (mirror PHASES data)
  phase0: "#9ca3af",
  phase1: "#f59e0b",
  phase2: "#10b981",
  phase3: "#8b5cf6",
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const FONT = {
  display: "'DM Serif Display', Georgia, serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const;

// ─── Common style helpers ─────────────────────────────────────────────────────

export const styleCard = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: "1.25rem",
} as const;

export const styleMonoLabel = {
  fontFamily: FONT.mono,
  fontSize: "0.68rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
};
