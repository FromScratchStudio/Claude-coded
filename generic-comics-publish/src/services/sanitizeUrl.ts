export function sanitizeUrl(url: string, base?: string): string | undefined {
  const trimmedUrl = url.trim();
  try {
    const parsed = base ? new URL(trimmedUrl, base) : new URL(trimmedUrl);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // ignore invalid or unsafe URL
  }
  return undefined;
}
