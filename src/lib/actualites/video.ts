/** URL d'intégration (iframe) pour YouTube, Vimeo ou Dailymotion ; null si l'URL n'est pas reconnue. */
export function videoEmbedUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  const host = url.hostname.replace(/^www\.|^m\./, '');

  if (host === 'youtube.com') {
    const id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{6,})/)?.[1];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === 'youtu.be') {
    const id = url.pathname.slice(1);
    return /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = url.pathname.match(/(\d{5,})/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === 'dailymotion.com') {
    const id = url.pathname.match(/\/video\/([a-z0-9]+)/i)?.[1];
    return id ? `https://www.dailymotion.com/embed/video/${id}` : null;
  }
  if (host === 'dai.ly') {
    const id = url.pathname.slice(1);
    return /^[a-z0-9]+$/i.test(id) ? `https://www.dailymotion.com/embed/video/${id}` : null;
  }
  return null;
}
