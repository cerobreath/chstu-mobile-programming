// src/services/galleryEvents.ts
type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeGalleryUpdated(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitGalleryUpdated() {
  listeners.forEach(fn => fn());
}
