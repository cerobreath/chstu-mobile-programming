// src/navigation/RootNavigator.tsx
import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';
import UniversityListScreen from '../screens/UniversityListScreen';
import UniversityDetailsScreen from '../screens/UniversityDetailsScreen';
import type {University} from '../native/UniversitiesNative';

export type RootStackParamList = {
  UniversityList: undefined;
  UniversityDetails: {university: University};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="UniversityList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTransparent: Platform.OS === 'android',
        headerBlurEffect: Platform.OS === 'ios' ? 'systemThinMaterial' : undefined,
      }}>
      <Stack.Screen
        name="UniversityList"
        component={UniversityListScreen}
        options={{title: 'UK Universities'}}
      />
      <Stack.Screen
        name="UniversityDetails"
        component={UniversityDetailsScreen}
        options={{title: 'Details'}}
      />
    </Stack.Navigator>
  );
};