const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeHexColor(color: string | undefined, fallback: string) {
  const value = color?.trim();
  if (!value || !HEX_COLOR_RE.test(value)) {
    return fallback;
  }

  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toLowerCase();
  }

  return value.toLowerCase();
}

export function withHexAlpha(color: string | undefined, alpha: string, fallback: string) {
  const normalized = normalizeHexColor(color, "");
  if (!normalized) {
    return fallback;
  }

  return `${normalized}${alpha}`.toLowerCase();
}
