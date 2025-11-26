import React from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Colors, ThemeMode } from '../theme/colors';
import { useTheme } from '../theme/theme';

interface Props {
  children: string;
  theme?: ThemeMode;
  style?: StyleProp<TextStyle>;
}

export default function AsciiText({ children, theme, style }: Props) {
  const { theme: ctxTheme } = useTheme();
  const activeTheme = theme ?? ctxTheme;

  return (
    <Text
      style={[
        styles.text,
        { color: Colors[activeTheme].text },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'Courier New',
    }),
    includeFontPadding: false,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 16,
  } as TextStyle,
});
