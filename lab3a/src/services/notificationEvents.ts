// src/services/notificationEvents.ts
import {Platform, ToastAndroid} from 'react-native';
import {
  EventType,
  Event,
} from '@notifee/react-native';
import {performGalleryUpdate} from './updates';
import {UPDATE_ACTION_ID} from './notifications';
import {emitGalleryUpdated} from './galleryEvents';

export async function handleNotificationEvent(
  event: Event,
) {
  const {type, detail} = event;
  console.log('[notifee] event', type, detail);

  if (
    type === EventType.ACTION_PRESS ||
    type === EventType.PRESS
  ) {
    const actionId = detail.pressAction?.id;

    if (actionId === UPDATE_ACTION_ID) {
      await performGalleryUpdate();

      emitGalleryUpdated();

      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Доступні оновлення галереї',
          ToastAndroid.SHORT,
        );
      }
    }
  }
}
