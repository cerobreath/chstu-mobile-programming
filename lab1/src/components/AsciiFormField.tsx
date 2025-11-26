import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardTypeOptions,
  TextStyle,
} from 'react-native';
import AsciiText from './AsciiText';
import { useThemeColors } from '../theme/theme';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  errorMessage?: string;
  charFilter?: (text: string) => string;
}

export default function AsciiFormField({
                                         label,
                                         value,
                                         onChangeText,
                                         placeholder,
                                         keyboardType,
                                         errorMessage,
                                         charFilter,
                                       }: Props) {
  const colors = useThemeColors();
  const errorColor = '#ff5555';

  const handleChange = (text: string) => {
    const filtered = charFilter ? charFilter(text) : text;
    onChangeText(filtered);
  };

  const borderColor = errorMessage ? errorColor : colors.text;

  return (
    <View style={styles.fieldBlock}>
      <View style={styles.inner}>
        <AsciiText
          style={[
            styles.label,
            errorMessage ? styles.labelError : undefined,
          ]}
        >
          {label}
        </AsciiText>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.text + '55'}
            value={value}
            onChangeText={handleChange}
            keyboardType={keyboardType}
          />
        </View>

        {errorMessage && (
          <AsciiText style={styles.inlineError}>
            {errorMessage}
          </AsciiText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldBlock: {
    marginBottom: 18,
    alignItems: 'center',
  },
  inner: {
    width: '75%',
    alignSelf: 'center',
  },
  label: {
    marginBottom: 6,
    textAlign: 'left',
  } as TextStyle,
  labelError: {
    color: '#ff5555',
    fontWeight: '600',
  } as TextStyle,
  inputWrapper: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    width: '100%',
    fontFamily:
      Platform.OS === 'android'
        ? 'monospace'
        : 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
  } as TextStyle,
  errorIcon: {
    position: 'absolute',
    right: 6,
    top: 3,
    fontSize: 16,
  } as TextStyle,
  inlineError: {
    marginTop: 4,
    textAlign: 'left',
    fontSize: 12,
  } as TextStyle,
});
