/**
 * Sprite loading with caching. Returns loaded HTMLImageElement or null
 * while still loading / on error (allows the renderer to gracefully
 * fall back to colored placeholders).
 */

type CacheEntry = {
  image: HTMLImageElement | null;
  status: "loading" | "loaded" | "error";
};

const cache = new Map<string, CacheEntry>();
const listeners = new Set<() => void>();

/** Subscribe to be notified whenever a new sprite finishes loading. */
export function onSpriteLoad(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notifyLoaded() {
  for (const fn of listeners) fn();
}

/** Get a sprite synchronously. Triggers async load if not cached. */
export function getSprite(path: string): HTMLImageElement | null {
  const entry = cache.get(path);
  if (entry) return entry.image;

  // Kick off load
  const img = new Image();
  const newEntry: CacheEntry = { image: null, status: "loading" };
  cache.set(path, newEntry);

  img.onload = () => {
    newEntry.image = img;
    newEntry.status = "loaded";
    notifyLoaded();
  };
  img.onerror = () => {
    newEntry.status = "error";
  };
  img.src = path;

  return null;
}

/** Preload a list of sprites. */
export function preloadSprites(paths: string[]): void {
  for (const path of paths) {
    getSprite(path);
  }
}

/** Get cache status for diagnostics. */
export function getSpriteStatus(path: string): CacheEntry["status"] | "missing" {
  return cache.get(path)?.status ?? "missing";
}
