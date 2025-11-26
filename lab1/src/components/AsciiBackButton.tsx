import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import AsciiText from './AsciiText';
import { AsciiStyles } from '../theme/ascii';

interface Props {
  label?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export default function AsciiBackButton({ label = 'Back to Main Menu', style, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <AsciiText style={styles.text}>
        {AsciiStyles.button(label)}
      </AsciiText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 32,
  },
  text: {
    fontSize: 20,
    lineHeight: 20,
  },
});
