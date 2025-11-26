// src/navigation/RootNavigator.tsx
import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GalleryScreen from '../screens/GalleryScreen';
import PhotoScreen from '../screens/PhotoScreen';
import {GalleryItem} from '../types/gallery';

export type RootStackParamList = {
  Gallery: undefined;
  Photo: {item: GalleryItem; localPath?: string | null};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Gallery">
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{title: 'Random Gallery'}}
      />
      <Stack.Screen
        name="Photo"
        component={PhotoScreen}
        options={{title: 'Photo'}}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
