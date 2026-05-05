/**
 * Retourne l'URL inchangée si elle utilise un schéma sûr (http ou https),
 * sinon retourne undefined.  À utiliser avant tout href issu d'une saisie
 * utilisateur pour éviter l'exécution de javascript: / data:.
 */
export function sanitizeUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url.trim();
    }
  } catch {
    // URL mal formée — non sûre
  }
  return undefined;
}
