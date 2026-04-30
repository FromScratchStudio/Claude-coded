// ─── Design tokens ────────────────────────────────────────────────────────────
// Static palette. Accent color is injected as --accent CSS variable by App.tsx.

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

  // Accent (CSS variable override)
  accent: "var(--accent)",
  accentLight: "var(--accent-light)",
  accentDim: "var(--accent-dim)",

  // Text
  text: "#e8e4dc",
  textSoft: "#c4c0b5",
  textMuted: "#8a8fa8",
  textDim: "#555b70",
  textVeryDim: "#3a3f52",

  // Semantic colors
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
} as const;

// ─── Accent color utilities ───────────────────────────────────────────────────

/** Lighten a hex color by blending it toward white. */
export function lightenHex(hex: string, amount = 0.25): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (ch: number) => Math.round(ch + (255 - ch) * amount);
  return `#${mix(r).toString(16).padStart(2, "0")}${mix(g).toString(16).padStart(2, "0")}${mix(b).toString(16).padStart(2, "0")}`;
}

/** Darken a hex color by blending it toward black. */
export function darkenHex(hex: string, amount = 0.5): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (ch: number) => Math.round(ch * (1 - amount));
  return `#${mix(r).toString(16).padStart(2, "0")}${mix(g).toString(16).padStart(2, "0")}${mix(b).toString(16).padStart(2, "0")}`;
}

/** Inject accent CSS variables onto :root. Call when accentColor changes. */
export function applyAccentColor(hex: string) {
  const root = document.documentElement;
  root.style.setProperty("--accent", hex);
  root.style.setProperty("--accent-light", lightenHex(hex, 0.3));
  root.style.setProperty("--accent-dim", darkenHex(hex, 0.45));
}

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
