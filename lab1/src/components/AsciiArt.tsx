import React from 'react';
import { Text, StyleSheet, Platform, TextStyle } from 'react-native';
import { AsciiStyles } from '../theme/ascii';
import { Colors } from '../theme/colors';
import { useTheme } from '../theme/theme';

type AsciiVariant = 'header' | 'footer' | 'theme';

interface Props {
  variant?: AsciiVariant;
  style?: TextStyle | TextStyle[];
}

export default function AsciiArt({ variant = 'footer', style }: Props) {
  const { theme } = useTheme();
  const colors = Colors[theme];

  let art = AsciiStyles.footerCat;

  if (variant === 'header') {
    art = AsciiStyles.headerCat;
  } else if (variant === 'theme') {
    art = theme === 'dark' ? AsciiStyles.moon : AsciiStyles.sun;
  }

  return (
    <Text
      style={[
        styles.cat,
        {
          color: colors.text,
          fontSize: variant === 'footer' ? 18 : 14,
        },
        style,
      ]}
    >
      {art}
    </Text>
  );
}

const styles = StyleSheet.create({
  cat: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'Courier New',
    }),
    includeFontPadding: false,
    lineHeight: 16,
    letterSpacing: 0,
  },
});
