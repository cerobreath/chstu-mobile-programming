// src/navigation/RootNavigator.tsx
import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from 'react-native-paper';
import SavingsIntroScreen from '../screens/SavingsIntroScreen';
import SavingsStep1Screen from '../screens/SavingsStep1Screen';
import SavingsStep2Screen from '../screens/SavingsStep2Screen';
import SavingsResultScreen from '../screens/SavingsResultScreen';
import type {SavingsResult} from '../savings/savings';

export type RootStackParamList = {
  Intro: undefined;
  Step1: undefined;
  Step2: {
    monthlyIncome: number;
    p: number;
  };
  Result: {
    result: SavingsResult;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgba(18, 18, 18, 0.05)',
        },
        headerBlurEffect: 'systemMaterialDark',
        headerShadowVisible: false,
        headerTintColor: theme.colors.onBackground,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Stack.Screen
        name="Intro"
        component={SavingsIntroScreen}
        options={{title: 'Savings in FX'}}
      />
      <Stack.Screen
        name="Step1"
        component={SavingsStep1Screen}
        options={{title: 'Step 1: Income & p'}}
      />
      <Stack.Screen
        name="Step2"
        component={SavingsStep2Screen}
        options={{title: 'Step 2: Currency'}}
      />
      <Stack.Screen
        name="Result"
        component={SavingsResultScreen}
        options={{title: 'Result'}}
      />
    </Stack.Navigator>
  );
};
