// src/services/galleryStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GalleryItem} from '../types/gallery';

const GALLERY_ITEMS_KEY = 'gallery:lastItems';

export async function saveGalleryItems(
  items: GalleryItem[],
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      GALLERY_ITEMS_KEY,
      JSON.stringify(items),
    );
  } catch (e) {
    console.error('saveGalleryItems error', e);
  }
}

export async function loadGalleryItems(): Promise<
  GalleryItem[] | null
> {
  try {
    const raw = await AsyncStorage.getItem(GALLERY_ITEMS_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as GalleryItem[];
    return parsed;
  } catch (e) {
    console.error('loadGalleryItems error', e);
    return null;
  }
}
