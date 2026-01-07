/**
 * Utility function to handle both local and remote icon URLs
 * @param iconUrl - The icon URL from data (can be local filename or remote URL)
 * @param localPath - The local path prefix for local icons
 * @returns Full URL to the icon (remote or local)
 */
export function getIconUrl(iconUrl: string | null | undefined, localPath: string): string {
  if (!iconUrl) {
    return `${localPath}default-icon.webp`;
  }

  // Check if it's already a remote URL (http:// or https://)
  if (iconUrl.startsWith('http://') || iconUrl.startsWith('https://')) {
    return iconUrl;
  }

  // Otherwise, treat it as a local file and prepend the local path
  return `${localPath}${iconUrl}`;
}
