// src/services/SavingsService.ts
import {
  CurrencyCode,
  SavingsResult,
  calculateSavings,
  loadCurrencyRatesFromInternet,
} from '../savings/savings';

export type SavingsRequest = {
  monthlyIncome: number;
  p: number;
  currency: CurrencyCode;
};

export type SavingsEvent =
  | { type: 'STARTED'; request: SavingsRequest }
  | { type: 'SUCCESS'; request: SavingsRequest; result: SavingsResult }
  | { type: 'ERROR'; request: SavingsRequest; error: string };

type Listener = (event: SavingsEvent) => void;

const listeners = new Set<Listener>();

export function subscribeSavingsService(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit(event: SavingsEvent) {
  listeners.forEach(l => l(event));
}

// Аналог IntentService: асинхронний розрахунок
export async function runSavingsCalculation(request: SavingsRequest) {
  try {
    emit({ type: 'STARTED', request });

    await loadCurrencyRatesFromInternet();

    const result = calculateSavings(
      request.monthlyIncome,
      request.p,
      request.currency,
    );

    emit({ type: 'SUCCESS', request, result });
  } catch (e: any) {
    emit({
      type: 'ERROR',
      request,
      error: e?.message ?? 'Unknown error',
    });
  }
}
