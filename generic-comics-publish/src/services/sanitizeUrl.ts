export function sanitizeUrl(url: string, base?: string): string | undefined {
  try {
    const parsed = base ? new URL(url, base) : new URL(url.trim());
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // ignore invalid or unsafe URL
  }
  return undefined;
}
