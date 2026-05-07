export const C = {
  bg: "#080910",
  bgSoft: "#11131d",
  panel: "rgba(17, 19, 29, 0.82)",
  panelStrong: "rgba(18, 20, 33, 0.94)",
  panelAlt: "rgba(255, 255, 255, 0.05)",
  border: "rgba(255, 255, 255, 0.12)",
  borderStrong: "rgba(255, 255, 255, 0.22)",
  text: "#f7f5ff",
  textSoft: "rgba(247, 245, 255, 0.78)",
  textMuted: "rgba(247, 245, 255, 0.56)",
  textDim: "rgba(247, 245, 255, 0.38)",
  accent: "var(--accent)",
  accentSecondary: "var(--accent-secondary)",
  lime: "#99f6a8",
  cyan: "#75e8ff",
  orange: "#ffb56b",
  red: "#ff6b7d",
  gold: "#ffd76b",
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
