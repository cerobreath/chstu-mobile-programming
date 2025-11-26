// src/native/SavingsExecutor.ts
import {NativeModules} from 'react-native';
import type {SavingsResult} from '../savings/savings';

type SavingsExecutorModuleType = {
    calculateSavings(
        M: number,
        p: number,
        currency: string,
        cStart: number,
        cEnd: number,
    ): Promise<SavingsResult>;
};

const {SavingsExecutor} = NativeModules;

export default SavingsExecutor as SavingsExecutorModuleType;
