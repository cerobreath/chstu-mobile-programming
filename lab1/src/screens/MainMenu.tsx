import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useThemeColors } from '../theme/theme';
import { AsciiStyles } from '../theme/ascii';
import AsciiText from '../components/AsciiText';
import AsciiArt from '../components/AsciiArt';
import ThemeToggle from '../components/ThemeToggle';
import { layout } from '../theme/layout';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainMenu'>;
};

export default function MainMenu({ navigation }: Props) {
  const colors = useThemeColors();

  return (
    <View style={[layout.screen, { backgroundColor: colors.background }]}>
      <ThemeToggle style={styles.themeToggle} />

      <View style={layout.screenCentered}>
        <View style={styles.menuWrapper}>
          <View style={styles.menuItemWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate('HelloWorld')}>
              <AsciiText style={styles.menuItemText}>
                {AsciiStyles.box('Hello World')}
              </AsciiText>
            </TouchableOpacity>
          </View>

          <View style={styles.menuItemWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate('GetVariant')}>
              <AsciiText style={styles.menuItemText}>
                {AsciiStyles.box('Generation variant')}
              </AsciiText>
            </TouchableOpacity>
          </View>

          <View style={styles.menuItemWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate('Task3Intro')}>
              <AsciiText style={styles.menuItemText}>
                {AsciiStyles.box('Savings calculator')}
              </AsciiText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footerCat}>
        <AsciiArt variant="footer" />
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
  menuWrapper: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  menuItemWrapper: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  menuItemText: {
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
  },
  footerCat: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    alignItems: 'center',
  },
});
