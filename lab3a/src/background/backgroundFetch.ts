// src/background/backgroundFetch.ts
import BackgroundFetch from 'react-native-background-fetch';
import {hasGalleryUpdates} from '../services/updates';
import {isUnmeteredConnection} from '../services/network';
import {showStartupUpdateNotification} from '../services/notifications';

export async function registerBackgroundFetch() {
  const status = await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_UNMETERED,
    },
    async taskId => {
      try {
        console.log('[BackgroundFetch] task start:', taskId);

        const unmetered = await isUnmeteredConnection();
        if (!unmetered) {
          console.log(
            '[BackgroundFetch] metered or no internet, skip',
          );
          return;
        }

        if (await hasGalleryUpdates()) {
          await showStartupUpdateNotification();
          console.log(
            '[BackgroundFetch] update available, notification shown',
          );
        } else {
          console.log(
            '[BackgroundFetch] no updates required',
          );
        }
      } catch (e) {
        console.error('[BackgroundFetch] error', e);
      } finally {
        BackgroundFetch.finish(taskId);
      }
    },
    error => {
      console.warn(
        '[BackgroundFetch] failed to configure',
        error,
      );
    },
  );

  console.log('[BackgroundFetch] configured, status:', status);
}
