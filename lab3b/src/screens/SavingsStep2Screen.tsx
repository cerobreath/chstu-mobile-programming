// src/screens/SavingsStep2Screen.tsx
import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Button,
  HelperText,
  Text,
  useTheme,
  Surface,
  SegmentedButtons,
  ActivityIndicator,
  Icon,
} from 'react-native-paper';
import {RootStackParamList} from '../navigation/RootNavigator';
import {
  CurrencyCode,
  CurrencyRates,
  getCurrencyRates,
  loadCurrencyRatesFromInternet,
} from '../savings/savings';
import {
  runSavingsCalculation,
  subscribeSavingsService,
} from '../services/SavingsService';

type Props = NativeStackScreenProps<RootStackParamList, 'Step2'>;

const SavingsStep2Screen: React.FC<Props> = ({navigation, route}) => {
  const {monthlyIncome, p} = route.params;
  const theme = useTheme();

  const [currency, setCurrency] = useState<CurrencyCode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [ratesFromNet, setRatesFromNet] = useState(false);
  const [loadingRates, setLoadingRates] = useState(true);

  const [calculating, setCalculating] = useState(false);

  // 1) Завантаження курсів: спочатку НБУ, якщо ні — текстовий файл
  useEffect(() => {
    let isMounted = true;

    const loadRates = async () => {
      try {
        const {rates: loaded, fromNetwork} =
          await loadCurrencyRatesFromInternet();
        if (!isMounted) {
          return;
        }
        setRates(loaded);
        setRatesFromNet(fromNetwork);
      } catch {
        if (!isMounted) {
          return;
        }
        setRates(getCurrencyRates());
        setRatesFromNet(false);
      } finally {
        if (isMounted) {
          setLoadingRates(false);
        }
      }
    };

    loadRates();

    return () => {
      isMounted = false;
    };
  }, []);

  const effectiveRates = rates ?? getCurrencyRates();

  // 2) Observer: слухаємо події від "IntentService"-подібного сервісу
  useEffect(() => {
    const unsubscribe = subscribeSavingsService(event => {
      if (event.type === 'STARTED') {
        setCalculating(true);
      } else if (event.type === 'SUCCESS') {
        setCalculating(false);
        // Переходимо на екран результату з готовим результатом
        navigation.navigate('Result', {result: event.result});
      } else if (event.type === 'ERROR') {
        setCalculating(false);
        setError('Помилка розрахунку: ' + event.error);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleCalculate = () => {
    setError(null);
    if (!currency) {
      setError('Оберіть валюту (USD / EUR)');
      return;
    }

    // Запускаємо асинхронний розрахунок через сервіс
    runSavingsCalculation({
      monthlyIncome,
      p,
      currency,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        {/* Заголовок + іконка */}
        <View style={styles.header}>
          <Icon source="currency-usd" size={32} />
          <View style={styles.headerTextBlock}>
            <Text variant="titleMedium">
              Крок 2. Оберіть валюту
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Курси валют беруться з НБУ, а при відсутності доступу — з
              локального текстового файлу.
            </Text>
          </View>
        </View>

        {/* Курси */}
        <Surface style={styles.ratesSurface} elevation={2}>
          {loadingRates ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>
                Завантаження курсів...
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.ratesText}>
                USD: {effectiveRates.USD.start.toFixed(2)} →{' '}
                {effectiveRates.USD.end.toFixed(2)}
                {'\n'}
                EUR: {effectiveRates.EUR.start.toFixed(2)} →{' '}
                {effectiveRates.EUR.end.toFixed(2)}
              </Text>
              <Text style={styles.ratesInfo}>
                {ratesFromNet
                  ? 'Курси завантажені з НБУ.'
                  : 'Курси завантажені з локального файлу або використовується резерв.'}
              </Text>
            </>
          )}
        </Surface>

        {/* Вибір валюти */}
        <Surface style={styles.currencySurface} elevation={1}>
          <Text variant="bodyMedium" style={styles.currencyLabel}>
            Валюта для заощаджень
          </Text>
          <SegmentedButtons
            value={currency ?? ''}
            onValueChange={val => setCurrency(val as CurrencyCode)}
            buttons={[
              {
                value: 'USD',
                label: 'USD',
                icon: 'currency-usd',
              },
              {
                value: 'EUR',
                label: 'EUR',
                icon: 'currency-eur',
              },
            ]}
          />
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
        </Surface>

        {/* Кнопки */}
        <View style={styles.footer}>
          <Button mode="text" onPress={() => navigation.goBack()}>
            Назад
          </Button>
          <Button
            mode="contained"
            icon="calculator-variant"
            onPress={handleCalculate}
            loading={calculating}
            disabled={loadingRates || calculating}>
            Розрахувати
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SavingsStep2Screen;

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  headerTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.8,
  },
  ratesSurface: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
  ratesText: {
    marginBottom: 8,
  },
  ratesInfo: {
    fontStyle: 'italic',
    opacity: 0.8,
  },
  currencySurface: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  currencyLabel: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
