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
import { useTheme, useThemeColors } from '../../theme/theme';
import { layout } from '../../theme/layout';
import ThemeToggle from '../../components/ThemeToggle';
import AsciiText from '../../components/AsciiText';
import AsciiFormField from '../../components/AsciiFormField';
import AsciiBackButton from '../../components/AsciiBackButton';
import { AsciiStyles } from '../../theme/ascii';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Task3Step1'>;
};

export default function SavingsStep1Screen({ navigation }: Props) {
    const { theme } = useTheme();
    const colors = useThemeColors();
    const [incomeStr, setIncomeStr] = useState('');
    const [pStr, setPStr] = useState('');
    const [incomeError, setIncomeError] = useState<string | undefined>();
    const [pError, setPError] = useState<string | undefined>();

    const numericFilter = (text: string) =>
        text.replace(/[^0-9.,]/g, '').replace(',', '.');

    const handleNext = () => {
        setIncomeError(undefined);
        setPError(undefined);

        const income = Number(incomeStr.trim());
        const p = Number(pStr.trim());

        let hasError = false;

        if (!incomeStr.trim()) {
            setIncomeError('Required');
            hasError = true;
        } else if (!Number.isFinite(income) || income <= 0) {
            setIncomeError('Must be > 0');
            hasError = true;
        }

        if (!pStr.trim()) {
            setPError('Required');
            hasError = true;
        } else if (!Number.isFinite(p)) {
            setPError('Must be a number');
            hasError = true;
        } else if (p <= 0 || p >= 1) {
            setPError('0 < p < 1');
            hasError = true;
        }

        if (hasError) return;

        navigation.navigate('Task3Step2', {
            monthlyIncome: income,
            p,
        });
    };

    const hintText =
        'Enter monthly income M (UAH)\n' +
        'and share p (0 < p < 1)\n' +
        'that is converted each month.';

    return (
        <View style={[layout.screen, { backgroundColor: colors.background }]}>
            <ThemeToggle style={layout.themeToggle} />

            <KeyboardAvoidingView
                style={layout.scrollScreen}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={[
                        layout.scrollContentCentered,
                        styles.scrollContent,
                    ]}
                    keyboardShouldPersistTaps="handled"
                >
                    <AsciiText theme={theme} style={styles.hint}>
                        {hintText}
                    </AsciiText>

                    <AsciiFormField
                        label="Monthly income M (UAH)"
                        value={incomeStr}
                        onChangeText={text => setIncomeStr(numericFilter(text))}
                        placeholder="e.g. 25000"
                        keyboardType="numeric"
                        errorMessage={incomeError}
                    />

                    <AsciiFormField
                        label="Share p (0 < p < 1)"
                        value={pStr}
                        onChangeText={text => setPStr(numericFilter(text))}
                        placeholder="e.g. 0.3"
                        keyboardType="numeric"
                        errorMessage={pError}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <AsciiText theme={theme} style={styles.startButtonText}>
                            {AsciiStyles.button('Next')}
                        </AsciiText>
                    </TouchableOpacity>

                    <AsciiBackButton
                        label="Back to intro"
                        onPress={() => navigation.navigate('Task3Intro')}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingTop: 160,
        paddingBottom: 80,
    },
    hint: {
        marginBottom: 24,
        alignSelf: 'center',
        textAlign: 'left',
        fontSize: 16,
        lineHeight: 22,
    },
    button: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    startButtonText: {
        fontSize: 18,
        lineHeight: 20,
        color: '#00ff7f',
    },
});
