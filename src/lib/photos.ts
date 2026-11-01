import type { ImageMetadata } from 'astro';

// Real job photos live in src/assets/photos/ and are referenced by filename in site.config.json.
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

export function photo(filename: string): ImageMetadata | undefined {
  if (!filename) return undefined;
  const hit = files[`/src/assets/photos/${filename}`];
  if (!hit) throw new Error(`Photo "${filename}" not found in src/assets/photos/`);
  return hit.default;
}
