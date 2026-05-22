/**
 * Returns the URL unchanged if it uses a safe scheme (http or https),
 * otherwise returns undefined.  Use this before setting any href from
 * user-controlled data to prevent javascript: / data: execution.
 */
export function sanitizeUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url.trim();
    }
  } catch {
    // malformed URL — not safe
  }
  return undefined;
}
