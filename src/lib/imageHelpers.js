/**
 * Image optimization helpers.
 *
 * - Supabase Storage: rewrite /object/public/ -> /render/image/public/ and add
 *   ?width=X&quality=Q so we serve resized versions instead of multi-MB originals.
 *   (Image Transformations are enabled on this project.)
 * - Unsplash: adds w/q/fm so the CDN returns a sized WebP.
 * - Anything else: returned unchanged.
 */

const SUPABASE_OBJECT_PREFIX = '/storage/v1/object/public/';
const SUPABASE_RENDER_PREFIX = '/storage/v1/render/image/public/';

export function optimizeImage(url, { width = 800, quality = 75 } = {}) {
  if (!url || typeof url !== 'string') return url;

  // Supabase Storage public objects -> use the render/image endpoint
  if (url.includes(SUPABASE_OBJECT_PREFIX)) {
    const rendered = url.replace(SUPABASE_OBJECT_PREFIX, SUPABASE_RENDER_PREFIX);
    const sep = rendered.includes('?') ? '&' : '?';
    return `${rendered}${sep}width=${width}&quality=${quality}`;
  }

  // Already a render URL — just append params if missing
  if (url.includes(SUPABASE_RENDER_PREFIX)) {
    if (/[?&]width=/.test(url)) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}width=${width}&quality=${quality}`;
  }

  // Unsplash — keeps existing params, just enforces width + quality + webp
  if (url.includes('images.unsplash.com')) {
    const u = new URL(url);
    u.searchParams.set('w', String(width));
    u.searchParams.set('q', String(quality));
    if (!u.searchParams.has('fm')) u.searchParams.set('fm', 'webp');
    if (!u.searchParams.has('auto')) u.searchParams.set('auto', 'format');
    return u.toString();
  }

  return url;
}

/**
 * Build a srcset string for responsive images.
 * widths: array of pixel widths to generate.
 */
export function srcSet(url, widths = [400, 800, 1200], { quality = 75 } = {}) {
  if (!url) return undefined;
  return widths
    .map((w) => `${optimizeImage(url, { width: w, quality })} ${w}w`)
    .join(', ');
}
