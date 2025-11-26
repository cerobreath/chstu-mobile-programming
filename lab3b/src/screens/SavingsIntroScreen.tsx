// src/screens/SavingsIntroScreen.tsx
import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Button,
  Text,
  useTheme,
  Surface,
  Icon,
} from 'react-native-paper';
import {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

const SavingsIntroScreen: React.FC<Props> = ({navigation}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}>
      {/* Верхня панель з іконкою та назвою */}
      <View style={styles.header}>
        <Surface style={styles.iconCircle} elevation={4}>
          <Icon source="bank" size={32} />
        </Surface>
        <View style={styles.headerTextBlock}>
          <Text variant="headlineSmall">
            Заощадження в іноземній валюті
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Моделювання річного доходу з конвертацією частини
            доходу в USD/EUR.
          </Text>
        </View>
      </View>

      {/* Основна інформація */}
      <View style={styles.body}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Що робить додаток?
        </Text>
        <Text variant="bodyMedium" style={styles.text}>
          • обчислює гіпотетичний річний дохід Sᵧ без обміну;
          {'\n'}• моделює щомісячну купівлю валюти (USD/EUR) за частку
          p доходу;
          {'\n'}• враховує зміну курсу протягом року;
          {'\n'}• показує підсумкові заощадження R у гривнях.
        </Text>

        <Text variant="bodySmall" style={styles.note}>
          Курси валют завантажуються з API НБУ (якщо є Інтернет),
          інакше використовуються вбудовані значення.
        </Text>
      </View>

      {/* Нижня панель з кнопками */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          icon="play-circle-outline"
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Step1')}>
          Почати розрахунок
        </Button>
      </View>
    </View>
  );
};

export default SavingsIntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextBlock: {
    flex: 1,
    marginLeft: 16,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.8,
  },
  body: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  text: {
    marginBottom: 12,
  },
  note: {
    opacity: 0.7,
  },
  footer: {
    gap: 8,
  },
  primaryButton: {
    borderRadius: 999,
  },
});
