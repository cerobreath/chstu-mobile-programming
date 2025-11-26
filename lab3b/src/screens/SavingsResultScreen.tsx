// src/screens/SavingsResultScreen.tsx
import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Text, useTheme, Surface, Icon} from 'react-native-paper';
import {MathJaxSvg} from 'react-native-mathjax-html-to-svg';
import {RootStackParamList} from '../navigation/RootNavigator';
import {formatMoney} from '../savings/savings';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const SavingsResultScreen: React.FC<Props> = ({navigation, route}) => {
  const {result: res} = route.params;
  const theme = useTheme();

  const M = res.M.toFixed(2);
  const SY = res.S_Y.toFixed(2);
  const SC = res.S_C.toFixed(2);
  const W = res.W.toFixed(2);
  const SH = res.S_H.toFixed(2);
  const SL = res.S_L.toFixed(2);
  const H = res.H.toFixed(2);

  const steps = [
    {
      id: 'SY',
      title: '1. Річний дохід без обміну',
      formula: `S_Y = 12 \\cdot M = 12 \\cdot ${M}`,
      result: `= ${formatMoney(res.S_Y)} UAH`,
    },
    {
      id: 'SC',
      title: '2. Сума, витрачена на обмін валюти',
      formula: `S_C = p \\cdot S_Y = ${res.p} \\cdot ${SY}`,
      result: `= ${formatMoney(res.S_C)} UAH`,
    },
    {
      id: 'W',
      title: '3. Кількість купленої валюти за рік',
      formula: `W = \\sum_{i=1}^{12} \\frac{p \\cdot M}{C_i}`,
      result: `≈ ${formatMoney(res.W)} ${res.currency}`,
    },
    {
      id: 'SH',
      title: '4. Вартість валюти на кінець року',
      formula: `S_H = W \\cdot C_{\\text{END}} \\approx ${W} \\cdot C_{\\text{END}}`,
      result: `≈ ${formatMoney(res.S_H)} UAH`,
    },
    {
      id: 'SL',
      title: '5. Гривневий залишок без обміну',
      formula: `S_L = S_Y - S_C = ${SY} - ${SC}`,
      result: `= ${formatMoney(res.S_L)} UAH`,
    },
    {
      id: 'H',
      title: '6. Загальна сума на кінець року',
      formula: `H = S_H + S_L = ${SH} + ${SL}`,
      result: `= ${formatMoney(res.H)} UAH`,
    },
    {
      id: 'R',
      title: '7. Сума заощаджень',
      formula: `R = H - S_Y = ${H} - ${SY}`,
      result: `= ${formatMoney(res.R)} UAH`,
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}>
      {/* Підсумковий блок */}
      <Surface style={styles.summarySurface} elevation={3}>
        <View style={styles.summaryIconBlock}>
          <Icon source="chart-line" size={32} />
        </View>
        <View style={styles.summaryTextBlock}>
          <Text variant="titleMedium">Підсумкові заощадження R</Text>
          <Text variant="headlineSmall" style={styles.summaryValue}>
            {formatMoney(res.R)} UAH
          </Text>
          <Text variant="bodySmall" style={styles.summarySub}>
            Валюта: {res.currency} • M = {formatMoney(res.M)} UAH • p ={' '}
            {res.p}
          </Text>
        </View>
      </Surface>

      {/* Кроки з формулами та рішеннями */}
      {steps.map(step => (
        <Surface key={step.id} style={styles.stepSurface} elevation={1}>
          <Text variant="titleSmall" style={styles.stepTitle}>
            {step.title}
          </Text>
          <MathJaxSvg
            fontSize={16}
            color={theme.colors.onSurface}
            fontCache={true}>
            {`$$${step.formula}$$`}
          </MathJaxSvg>
          <Text variant="bodyMedium" style={styles.stepResult}>
            {step.result}
          </Text>
        </Surface>
      ))}

      {/* Кнопка ОК */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          icon="check-circle-outline"
          onPress={() => navigation.navigate('Intro')}>
          ОК
        </Button>
      </View>
    </ScrollView>
  );
};

export default SavingsResultScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  summarySurface: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryIconBlock: {
    marginRight: 12,
    justifyContent: 'center',
  },
  summaryTextBlock: {
    flex: 1,
  },
  summaryValue: {
    marginTop: 4,
  },
  summarySub: {
    marginTop: 4,
    opacity: 0.8,
  },
  stepSurface: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  stepTitle: {
    marginBottom: 8,
  },
  stepResult: {
    marginTop: 10,
    fontSize: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});
