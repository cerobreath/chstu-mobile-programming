// src/screens/SavingsStep1Screen.tsx
import * as React from 'react';
import {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Button,
  HelperText,
  TextInput,
  Text,
  useTheme,
  Surface,
  Icon,
} from 'react-native-paper';
import {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Step1'>;

const numericFilter = (text: string) =>
  text.replace(/[^0-9.,]/g, '').replace(',', '.');

const SavingsStep1Screen: React.FC<Props> = ({navigation}) => {
  const [incomeStr, setIncomeStr] = useState('');
  const [pStr, setPStr] = useState('');
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [pError, setPError] = useState<string | null>(null);
  const theme = useTheme();

  const handleNext = useCallback(() => {
    setIncomeError(null);
    setPError(null);

    const income = Number(incomeStr.trim());
    const p = Number(pStr.trim());
    let hasError = false;

    if (!incomeStr.trim()) {
      setIncomeError('Обов’язкове поле');
      hasError = true;
    } else if (!Number.isFinite(income) || income <= 0) {
      setIncomeError('M має бути > 0');
      hasError = true;
    }

    if (!pStr.trim()) {
      setPError('Обов’язкове поле');
      hasError = true;
    } else if (!Number.isFinite(p)) {
      setPError('p має бути числом');
      hasError = true;
    } else if (p <= 0 || p >= 1) {
      setPError('0 < p < 1');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    navigation.navigate('Step2', {
      monthlyIncome: income,
      p,
    });
  }, [incomeStr, pStr, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View
        style={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        {/* Верхній опис */}
        <View style={styles.header}>
          <Icon source="cash-multiple" size={32} />
          <View style={styles.headerTextBlock}>
            <Text variant="titleMedium">
              Крок 1. Доходи та частка p
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Введіть місячний дохід у гривнях і частку доходу, яка щомісяця
              конвертується у валюту.
            </Text>
          </View>
        </View>

        <Surface style={styles.formSurface} elevation={2}>
          <TextInput
            label="Місячний дохід M (UAH)"
            mode="outlined"
            keyboardType="numeric"
            value={incomeStr}
            onChangeText={t => setIncomeStr(numericFilter(t))}
            style={styles.input}
            left={<TextInput.Icon icon="cash" />}
          />
          <HelperText type="error" visible={!!incomeError}>
            {incomeError}
          </HelperText>

          <TextInput
            label="Частка p (0 < p < 1)"
            mode="outlined"
            keyboardType="numeric"
            value={pStr}
            onChangeText={t => setPStr(numericFilter(t))}
            style={styles.input}
            left={<TextInput.Icon icon="percent" />}
          />
          <HelperText type="error" visible={!!pError}>
            {pError}
          </HelperText>
        </Surface>

        {/* Кнопки навігації */}
        <View style={styles.footer}>
          <Button mode="text" onPress={() => navigation.goBack()}>
            Назад
          </Button>
          <Button
            mode="contained"
            icon="arrow-right-bold"
            onPress={handleNext}>
            Далі
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SavingsStep1Screen;

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {
    flex: 1,
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
  formSurface: {
    padding: 16,
    borderRadius: 16,
  },
  input: {
    marginBottom: 4,
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
