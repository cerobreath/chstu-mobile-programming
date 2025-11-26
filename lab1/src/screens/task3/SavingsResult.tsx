import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTheme, useThemeColors } from '../../theme/theme';
import { layout } from '../../theme/layout';
import ThemeToggle from '../../components/ThemeToggle';
import AsciiText from '../../components/AsciiText';
import { AsciiStyles } from '../../theme/ascii';
import { calculateSavings, formatMoney } from '../../utils/savings';
import AsciiBackButton from '../../components/AsciiBackButton';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Task3Result'>;
type RouteProps = RouteProp<RootStackParamList, 'Task3Result'>;

type Props = {
  navigation: NavProp;
  route: RouteProps;
};

export default function SavingsResultScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const colors = useThemeColors();
  const { monthlyIncome, p, currency } = route.params;

  const res = calculateSavings(monthlyIncome, p, currency);

  const lines = [
    `Currency: ${res.currency}`,
    `M  = ${formatMoney(res.M)} UAH`,
    `p  = ${res.p}`,
    '',
    `S_Y = 12 * M      = ${formatMoney(res.S_Y)} UAH`,
    `S_C = p * S_Y     = ${formatMoney(res.S_C)} UAH`,
    `W   = Σ (p*M/C_i) = ${formatMoney(res.W)} ${res.currency}`,
    `S_H = W * C_END   = ${formatMoney(res.S_H)} UAH`,
    `S_L = S_Y - S_C   = ${formatMoney(res.S_L)} UAH`,
    `H   = S_H + S_L   = ${formatMoney(res.H)} UAH`,
    `R   = H - S_Y     = ${formatMoney(res.R)} UAH`,
  ].join('\n');

  const summaryBox = AsciiStyles.box(`R = ${formatMoney(res.R)} UAH`);

  return (
    <View style={[layout.screen, { backgroundColor: colors.background }]}>
      <ThemeToggle style={layout.themeToggle} />

      <KeyboardAvoidingView
        style={layout.scrollScreen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={layout.scrollContentCentered}>
          <View style={layout.centerBlock}>
            <AsciiText theme={theme} style={styles.summary}>
              {summaryBox}
            </AsciiText>

            <AsciiText theme={theme} style={styles.details}>
              {lines}
            </AsciiText>

            <TouchableOpacity
              style={styles.okButton}
              onPress={() => navigation.navigate('Task3Intro')}
            >
              <AsciiText theme={theme}>
                {AsciiStyles.button('OK')}
              </AsciiText>
            </TouchableOpacity>

            <AsciiBackButton
              label="Back to Main Menu"
              onPress={() => navigation.navigate('MainMenu')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    marginBottom: 24,
  },
  details: {
    marginBottom: 32,
    textAlign: 'left',
    alignSelf: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  okButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
});
