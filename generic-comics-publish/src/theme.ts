export const C = {
  bg: "#0a0a0a",
  bgSoft: "#141414",
  bgDeep: "#070707",
  panel: "#141414",
  panelAlt: "#0f0f0f",
  border: "#1f1f1f",
  borderSoft: "#161616",
  borderMid: "#2a2a2a",
  text: "#f5f5f0",
  textSoft: "rgba(245,245,240,0.78)",
  textMuted: "#888888",
  textDim: "#6a6a6a",
  accent: "var(--accent, #E60012)",
  red: "#E60012",
} as const;

export const FONT = {
  display: '"Bebas Neue", Impact, sans-serif',
  body: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", monospace',
} as const;

export function applyAccent(accent: string, secondary: string) {
  const root = document.documentElement;
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-secondary", secondary);
}
