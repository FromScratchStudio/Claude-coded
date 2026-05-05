// ─── Google Drive backup helpers ──────────────────────────────────────────────
//
// These utilities support manual-assist backup flows: the app has no OAuth token
// and cannot write directly to Drive.  Instead:
//   • Export: the JSON is downloaded locally, then the Drive folder is opened so
//     the user can drag-and-drop the file.
//   • Import: the user pastes a Drive sharing URL pointing to a previously saved
//     JSON backup; this utility converts that URL to a direct-download URL and
//     fetches the file content.
//
// Google Drive publicly-shared files are served from drive.usercontent.google.com
// with permissive CORS headers, so the fetch works in-browser for small files.

/**
 * Extract the file ID from common Google Drive URL patterns:
 *  • https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *  • https://drive.google.com/open?id=FILE_ID
 *  • https://docs.google.com/document/d/FILE_ID/edit
 */
export function extractDriveFileId(url: string): string | null {
  const filePathMatch = url.match(/\/(?:file|document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/);
  if (filePathMatch) return filePathMatch[1];

  const queryIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryIdMatch) return queryIdMatch[1];

  return null;
}

/**
 * Convert a Google Drive sharing URL to a CORS-friendly direct-download URL
 * served from drive.usercontent.google.com.
 * Returns null when the input URL format is not recognised.
 */
export function driveShareUrlToDownloadUrl(shareUrl: string): string | null {
  const fileId = extractDriveFileId(shareUrl);
  if (!fileId) return null;
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
}

/**
 * Fetch JSON content from a Google Drive direct-download URL.
 * The file must be shared with "Anyone with the link".
 * Throws an Error with a descriptive message on failure.
 */
export async function fetchDriveJson(downloadUrl: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(downloadUrl, {
      mode: "cors",
      credentials: "omit",
    });
  } catch {
    throw new Error(
      "Network error — make sure the file is publicly shared and your browser allows cross-origin requests."
    );
  }

  if (!response.ok) {
    throw new Error(`Server returned HTTP ${response.status}. Make sure the file is shared with "Anyone with the link".`);
  }

  const text = await response.text();

  // Google sometimes returns an HTML confirmation page for large files.
  // Use a case-insensitive check to cover all casing variants.
  const trimmedLower = text.trimStart().toLowerCase();
  if (trimmedLower.startsWith("<!doctype") || trimmedLower.startsWith("<html")) {
    throw new Error(
      "Google returned an HTML page instead of JSON. The file may be too large or may require sign-in. Try downloading it manually and using the local import instead."
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The file content is not valid JSON.");
  }
}
