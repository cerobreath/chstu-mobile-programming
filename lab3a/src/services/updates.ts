// src/services/updates.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform, ToastAndroid} from 'react-native';
import {fetchRemoteGallery} from './gallery';
import {hasInternet, isUnmeteredConnection} from './network';

const LAST_UPDATE_KEY = 'gallery:lastUpdatedAt';
const UPDATE_TTL_MS = 10 * 60 * 1000; // 10 хвилин

export async function hasGalleryUpdates(): Promise<boolean> {
  const last = await AsyncStorage.getItem(LAST_UPDATE_KEY);
  if (!last) {
    return true;
  }
  const lastNum = Number(last);
  if (!Number.isFinite(lastNum)) {
    return true;
  }
  return Date.now() - lastNum > UPDATE_TTL_MS;
}

function toast(msg: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    console.log('[Toast]', msg);
  }
}

// Служба оновлень
export async function performGalleryUpdate(): Promise<void> {
  if (!(await hasInternet())) {
    toast('Немає підключення до Інтернету');
    return;
  }

  if (!(await isUnmeteredConnection())) {
    toast(
      'Оновлення галереї можливе лише в нетарифікованій мережі (Wi-Fi)',
    );
    return;
  }

  await fetchRemoteGallery(30);
  await AsyncStorage.setItem(
    LAST_UPDATE_KEY,
    Date.now().toString(),
  );
}
