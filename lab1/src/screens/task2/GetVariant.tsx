import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsciiText from '../../components/AsciiText';
import { AsciiStyles } from '../../theme/ascii';
import { useThemeColors } from '../../theme/theme';
import { calcVariant, DEFAULT_MAX_VARIANT } from '../../utils/variant';
import ThemeToggle from '../../components/ThemeToggle';
import AsciiBackButton from '../../components/AsciiBackButton';
import AsciiFormField from '../../components/AsciiFormField';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GetVariant'>;
};

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  group?: string;
  maxVariants?: string;
};

export default function GetVariantScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [group, setGroup] = useState('');
  const [maxVariantsStr, setMaxVariantsStr] = useState(
    String(DEFAULT_MAX_VARIANT),
  );
  const [variant, setVariant] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const filterName = (text: string) =>
    text.replace(/[^A-Za-zА-Яа-яЁёІіЇїЄєҐґ' -]/gu, '');

  const filterGroup = (text: string) =>
    text.replace(/[^A-Za-zА-Яа-яЁёІіЇїЄєҐґ0-9-]/gu, '').toUpperCase();

  const filterDigits = (text: string) =>
    text.replace(/[^0-9]/g, '');

  const handleGenerate = () => {
    setVariant(null);
    const errors: FieldErrors = {};

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedGroup = group.trim();
    const trimmedMax = maxVariantsStr.trim();

    if (!trimmedFirst) {
      errors.firstName = 'Required field';
    } else if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ' -]+$/u.test(trimmedFirst)) {
    }

    if (!trimmedLast) {
      errors.lastName = 'Required field';
    } else if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ' -]+$/u.test(trimmedLast)) {
    }

    if (!trimmedGroup) {
      errors.group = 'Required field';
    } else if (!/^[A-ZА-ЯІЇЄҐ0-9-]+$/u.test(trimmedGroup)) {
    }

    let max: number = DEFAULT_MAX_VARIANT;

    if (trimmedMax.length === 0) {
      max = DEFAULT_MAX_VARIANT;
    } else {
      const parsed = Number(trimmedMax);

      if (
        !Number.isFinite(parsed) ||
        !Number.isInteger(parsed) ||
        parsed < 1
      ) {
      } else {
        max = parsed;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const v = calcVariant(trimmedFirst, trimmedLast, trimmedGroup, max);
    setVariant(v);
  };

  const resultBox = variant
    ? AsciiStyles.box(`Variant: ${variant}`)
    : AsciiStyles.box('Variant: —');

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ThemeToggle style={styles.themeToggle} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AsciiFormField
            label="First name"
            value={firstName}
            onChangeText={text => setFirstName(filterName(text))}
            placeholder="Ivan"
            errorMessage={fieldErrors.firstName}
          />

          <AsciiFormField
            label="Last name"
            value={lastName}
            onChangeText={text => setLastName(filterName(text))}
            placeholder="Ivanov"
            errorMessage={fieldErrors.lastName}
          />

          <AsciiFormField
            label="Group"
            value={group}
            onChangeText={text => setGroup(filterGroup(text))}
            placeholder="KI-101"
            errorMessage={fieldErrors.group}
          />

          <AsciiFormField
            label="Number of variants"
            value={maxVariantsStr}
            onChangeText={text => setMaxVariantsStr(filterDigits(text))}
            placeholder={String(DEFAULT_MAX_VARIANT)}
            keyboardType="numeric"
            errorMessage={fieldErrors.maxVariants}
          />

          <TouchableOpacity style={styles.button} onPress={handleGenerate}>
            <AsciiText style={styles.sectionTitle}>
              {AsciiStyles.box('Get Variant')}
            </AsciiText>
          </TouchableOpacity>

          <AsciiText style={styles.resultBox}>{resultBox}</AsciiText>

          <AsciiBackButton onPress={() => navigation.navigate('MainMenu')} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 160,
    paddingBottom: 80,
  },
  themeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  button: {
    alignItems: 'center',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultBox: {
    marginTop: 8,
    textAlign: 'center',
  },
});
