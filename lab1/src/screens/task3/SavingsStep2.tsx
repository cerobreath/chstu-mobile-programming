import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTheme, useThemeColors } from '../../theme/theme';
import { layout } from '../../theme/layout';
import ThemeToggle from '../../components/ThemeToggle';
import AsciiText from '../../components/AsciiText';
import AsciiBackButton from '../../components/AsciiBackButton';
import { AsciiStyles } from '../../theme/ascii';
import type { CurrencyCode, CurrencyRates } from '../../utils/savings';
import {
  getCurrencyRates,
  loadCurrencyRatesFromInternet,
} from '../../utils/savings';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Task3Step2'>;
type RouteProps = RouteProp<RootStackParamList, 'Task3Step2'>;

type Props = {
  navigation: NavProp;
  route: RouteProps;
};

export default function SavingsStep2Screen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const colors = useThemeColors();
  const { monthlyIncome, p } = route.params;

  const [currency, setCurrency] = useState<CurrencyCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [ratesFromNet, setRatesFromNet] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRates = async () => {
      try {
        const { rates: loaded, fromNetwork } =
          await loadCurrencyRatesFromInternet();

        if (!isMounted) return;
        setRates(loaded);
        setRatesFromNet(fromNetwork);
      } catch {
        if (!isMounted) return;
        setRates(getCurrencyRates());
        setRatesFromNet(false);
      }
    };

    loadRates();

    return () => {
      isMounted = false;
    };
  }, []);

  const effectiveRates = rates ?? getCurrencyRates();

  const hintText =
    'Choose foreign currency.\n\n' +
    'Rates (start -> end):\n' +
    `USD: ${effectiveRates.USD.start.toFixed(2)} -> ${effectiveRates.USD.end.toFixed(2)}\n` +
    `EUR: ${effectiveRates.EUR.start.toFixed(2)} -> ${effectiveRates.EUR.end.toFixed(2)}\n\n` +
    (ratesFromNet
      ? '(Loaded from NBU API)'
      : '(Using built-in fallback rates)');

  const handleCalculate = () => {
    setError(null);
    if (!currency) {
      setError('Select currency (USD/EUR)');
      return;
    }

    navigation.navigate('Task3Result', {
      monthlyIncome,
      p,
      currency,
    });
  };

  return (
    <View style={[layout.screen, { backgroundColor: colors.background }]}>
      <ThemeToggle style={layout.themeToggle} />

      <KeyboardAvoidingView
        style={layout.scrollScreen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={layout.scrollContentCentered}>
          <View style={layout.centerBlock}>
            <AsciiText theme={theme} style={styles.hint}>
              {hintText}
            </AsciiText>

            <View style={styles.choiceBlock}>
              <TouchableOpacity onPress={() => setCurrency('USD')}>
                <AsciiText
                  theme={theme}
                  style={[
                    styles.choice,
                    currency === 'USD' && styles.activeChoice,
                  ]}
                >
                  {AsciiStyles.button('USD')}
                </AsciiText>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setCurrency('EUR')}>
                <AsciiText
                  theme={theme}
                  style={[
                    styles.choice,
                    currency === 'EUR' && styles.activeChoice,
                  ]}
                >
                  {AsciiStyles.button('EUR')}
                </AsciiText>
              </TouchableOpacity>
            </View>

            {error && (
              <AsciiText theme={theme} style={styles.errorText}>
                {AsciiStyles.box(error)}
              </AsciiText>
            )}

            <TouchableOpacity style={styles.button} onPress={handleCalculate}>
              <AsciiText theme={theme} style={styles.calculateText}>
                {AsciiStyles.button('Calculate')}
              </AsciiText>
            </TouchableOpacity>

            <AsciiBackButton
              label="Back to step 1"
              onPress={() => navigation.goBack()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginBottom: 32,
    alignSelf: 'center',
    textAlign: 'left',
    fontSize: 16,
    lineHeight: 22,
  },
  choiceBlock: {
    gap: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  choice: {
    fontSize: 16,
    lineHeight: 18,
  },
  activeChoice: {
    fontSize: 18,
    lineHeight: 20,
    color: '#00ff7f',
  },
  button: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  calculateText: {
    marginTop: 8,
    fontSize: 18,
    lineHeight: 20,
    color: '#00ff7f',
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
  },
});
