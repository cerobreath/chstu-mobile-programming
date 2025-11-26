// src/services/gallery.ts
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {
    CameraRoll,
    PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import {GalleryItem} from '../types/gallery';
import GalleryTasks from '../native/GalleryTasks';

// Рандомна галерея: завантаження йде через native-модуль з ExecutorService
export async function fetchRemoteGallery(
    limit = 30,
): Promise<GalleryItem[]> {
    // Уся робота (HTTP + рандомізація) тепер в Kotlin-потоці
    return GalleryTasks.fetchRemoteGallery(limit);
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

    return saved.node.image.uri;
}
