import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import AsciiArt from './AsciiArt';
import { useTheme } from '../theme/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export default function ThemeToggle({ style }: Props) {
  const { toggleTheme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={[styles.container, style]}>
      <AsciiArt variant="theme" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
});
