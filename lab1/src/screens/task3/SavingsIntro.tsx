import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTheme, useThemeColors } from '../../theme/theme';
import { layout } from '../../theme/layout';
import AsciiText from '../../components/AsciiText';
import { AsciiStyles } from '../../theme/ascii';
import ThemeToggle from '../../components/ThemeToggle';
import AsciiBackButton from '../../components/AsciiBackButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Task3Intro'>;
};

export default function SavingsIntroScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = useThemeColors();

  const infoTitle = 'Savings in foreign currency\n';
  const infoText =
    '- Input monthly income M (UAH)\n' +
    '- Input share p (0 < p < 1)\n' +
    '- Choose currency (USD / EUR)\n' +
    '- See yearly savings R';

  return (
    <View style={[layout.screen, { backgroundColor: colors.background }]}>
      <ThemeToggle style={layout.themeToggle} />

      <View style={layout.screenCentered}>
        <AsciiText theme={theme} style={styles.infoTitle}>
          {infoTitle}
        </AsciiText>

        <AsciiText theme={theme} style={styles.infoText}>
          {infoText}
        </AsciiText>

        <View style={layout.buttonsColumn}>
          <TouchableOpacity onPress={() => navigation.navigate('Task3Step1')}>
            <AsciiText theme={theme} style={styles.startButtonText}>
              {AsciiStyles.button('Start calculation')}
            </AsciiText>
          </TouchableOpacity>

          <AsciiBackButton
            label="Back to Main Menu"
            onPress={() => navigation.navigate('MainMenu')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoTitle: {
    marginBottom: 8,
    alignSelf: 'center',
    textAlign: 'left',
    fontSize: 18,
    lineHeight: 22,
  },
  infoText: {
    marginBottom: 32,
    alignSelf: 'center',
    textAlign: 'left',
    fontSize: 16,
    lineHeight: 22,
  },
  startButtonText: {
    fontSize: 18,
    lineHeight: 20,
    color: '#00ff7f',
  },
});
