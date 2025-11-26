// src/services/gallery.ts
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import {GalleryItem} from '../types/gallery';

const PICSUM_URL = 'https://picsum.photos/v2/list';

export async function fetchRemoteGallery(
  limit = 30,
): Promise<GalleryItem[]> {
  const randomPage = Math.floor(Math.random() * 10) + 1; // 1..10
  const url = `${PICSUM_URL}?page=${randomPage}&limit=${limit}&ts=${Date.now()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch gallery');
  }

  const items = (await res.json()) as GalleryItem[];
  return items.sort(() => Math.random() - 0.5);
}

// Завантажити зображення + зберегти в системну галерею
export async function downloadImage(
  item: GalleryItem,
  onProgress?: (progress: number) => void,
): Promise<string> {
  let baseDir: string;

  if (Platform.OS === 'android') {
    baseDir = RNFS.CachesDirectoryPath;
  } else {
    baseDir = RNFS.DocumentDirectoryPath;
  }

  const destPath = `${baseDir}/picsum-${item.id}-${Date.now()}.jpg`;

  const task = RNFS.downloadFile({
    fromUrl: item.download_url,
    toFile: destPath,
    progressDivider: 5,
    progress: data => {
      if (data.contentLength && data.contentLength > 0) {
        const pct = data.bytesWritten / data.contentLength;
        const clamped = Math.max(0, Math.min(1, pct));
        onProgress?.(clamped);
      }
    },
  });

  await task.promise;

  onProgress?.(1);

  const uriForSave =
    Platform.OS === 'android' ? 'file://' + destPath : destPath;

  const saved: PhotoIdentifier = await CameraRoll.saveAsset(
    uriForSave,
    {type: 'photo'},
  );

  const savedUri = saved.node.image.uri; // це вже string

  return savedUri;
}
