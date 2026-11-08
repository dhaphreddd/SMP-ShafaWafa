/** Resolve local /public assets and transform public Google Drive links into direct high-res images. */
export function resolveAssetUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Google Drive public image conversion
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    // 1. Match /file/d/{id}
    const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch) {
      return `https://drive.google.com/thumbnail?id=${fileDMatch[1]}&sz=w1600`;
    }
    // 2. Match id={id}
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1600`;
    }
  }

  // Google User Content direct links
  if (trimmed.includes('googleusercontent.com')) {
    if (trimmed.includes('=w') || trimmed.includes('=s')) {
      return trimmed.replace(/=[ws]\d+.*$/, '=w1600');
    }
    return trimmed;
  }

  if (/^(https?:|data:|blob:|\/\/)/i.test(trimmed)) return trimmed;
  const path = trimmed.replace(/^\/+/, '');
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
  return `${baseUrl}${path}`;
}
