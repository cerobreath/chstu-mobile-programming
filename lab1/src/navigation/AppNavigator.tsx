import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMenu from '../screens/MainMenu';
import HelloWorld from '../screens/task1/HelloWorld';
import GetVariantScreen from '../screens/task2/GetVariant';
import { CurrencyCode } from '../utils/savings.ts';
import SavingsIntroScreen from '../screens/task3/SavingsIntro';
import SavingsStep1Screen from '../screens/task3/SavingsStep1';
import SavingsStep2Screen from '../screens/task3/SavingsStep2';
import SavingsResultScreen from '../screens/task3/SavingsResult';

export type RootStackParamList = {
  MainMenu: undefined;
  HelloWorld: undefined;
  GetVariant: undefined;

  Task3Intro: undefined;
  Task3Step1: undefined;
  Task3Step2: {
    monthlyIncome: number;
    p: number;
  };
  Task3Result: {
    monthlyIncome: number;
    p: number;
    currency: CurrencyCode;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
    card: 'transparent',
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="MainMenu"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="HelloWorld" component={HelloWorld} />
        <Stack.Screen name="GetVariant" component={GetVariantScreen} />

        <Stack.Screen name="Task3Intro" component={SavingsIntroScreen} />
        <Stack.Screen name="Task3Step1" component={SavingsStep1Screen} />
        <Stack.Screen name="Task3Step2" component={SavingsStep2Screen} />
        <Stack.Screen name="Task3Result" component={SavingsResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
