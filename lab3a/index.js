import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import notifee from '@notifee/react-native';
import {handleNotificationEvent} from './src/services/notificationEvents';
import {registerBackgroundFetch} from './src/background/backgroundFetch';

// Події Notifee (натискання по нотифікаціях)
notifee.onBackgroundEvent(handleNotificationEvent);
notifee.onForegroundEvent(handleNotificationEvent);

// Реєстрація фонового оновлення (JobService-аналог)
registerBackgroundFetch();

AppRegistry.registerComponent(appName, () => App);
