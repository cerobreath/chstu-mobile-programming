import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsciiText from '../../components/AsciiText';
import { AsciiStyles } from '../../theme/ascii';
import { useThemeColors } from '../../theme/theme';
import ThemeToggle from '../../components/ThemeToggle';
import AsciiBackButton from '../../components/AsciiBackButton';
import { layout } from '../../theme/layout';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HelloWorld'>;
};

export default function HelloWorld({ navigation }: Props) {
  const colors = useThemeColors();

  return (
    <View style={[layout.screen, { backgroundColor: colors.background }]}>
      <ThemeToggle style={styles.themeToggle} />

      <View style={layout.screenCentered}>
        <AsciiText style={styles.title}>
          Hello, World!
        </AsciiText>

        <AsciiText style={styles.cat}>
          {AsciiStyles.helloWorldCat}
        </AsciiText>

        <AsciiBackButton onPress={() => navigation.navigate('MainMenu')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  title: {
    marginBottom: 24,
    fontSize: 20,
  },
  cat: {
    marginBottom: 30,
    textAlign: 'left',
    fontSize: 14,
    lineHeight: 16,
  },
});
