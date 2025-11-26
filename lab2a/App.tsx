// App.tsx
import * as React from 'react';
import {useEffect} from 'react';
import {hasGalleryUpdates} from './src/services/updates';
import {showStartupUpdateNotification} from './src/services/notifications';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  useEffect(() => {
    (async () => {
      try {
        if (await hasGalleryUpdates()) {
          await showStartupUpdateNotification();
        }
      } catch (e) {
        console.error('Startup update check error', e);
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
