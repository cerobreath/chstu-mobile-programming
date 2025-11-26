// src/native/GalleryTasks.ts
import {NativeModules} from 'react-native';
import type {GalleryItem} from '../types/gallery';

type GalleryTasksModuleType = {
    fetchRemoteGallery(limit: number): Promise<GalleryItem[]>;
};

const {GalleryTasks} = NativeModules;

export default GalleryTasks as GalleryTasksModuleType;
