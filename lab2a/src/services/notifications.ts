// src/services/notifications.ts
import {Platform} from 'react-native';
import notifee, {
  AndroidImportance,
} from '@notifee/react-native';
import {AndroidLaunchActivityFlag} from '@notifee/react-native';

export const UPDATE_ACTION_ID = 'update-gallery';

export async function showStartupUpdateNotification() {
  await notifee.requestPermission();

  let channelId: string | undefined;

  if (Platform.OS === 'android') {
    channelId = await notifee.createChannel({
      id: 'gallery-updates',
      name: 'Gallery updates',
      importance: AndroidImportance.HIGH,
    });
  }

  await notifee.displayNotification({
    title: 'Оновлення галереї',
    body: 'Доступні оновлення галереї. Запустити оновлення?',
    android:
      Platform.OS === 'android'
        ? {
          channelId: channelId ?? 'gallery-updates',
          // Нотифікація з кнопкою "Оновити"
          actions: [
            {
              title: 'Оновити',
              pressAction: {
                id: UPDATE_ACTION_ID,
                launchActivity: 'default',
                launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
              },
            },
          ],
        }
        : undefined,
  });
}
