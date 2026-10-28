// Swaps a content image URL for the WebP copies built by
// scripts/optimize-images.mjs (embedded in prerendered pages as
// window.__IMAGES__). URLs the manifest doesn't know — e.g. an image added
// since the last build — fall back to the original file.
const manifest = (typeof window !== 'undefined' && window.__IMAGES__) || {};

export const mediaUrl = (src) => {
  if (!src || /^(https?:|data:|blob:)/.test(src)) return src;
  return `/${src.replace(/\\/g, '/').replace(/^\/+/, '')}`;
};

export function imageProps(src, sizes) {
  const m = manifest[src];
  if (!m) return { src: mediaUrl(src) };
  return { src: m.src, srcSet: m.srcSet, sizes, width: m.width, height: m.height };
}
