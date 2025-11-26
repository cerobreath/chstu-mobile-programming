// src/savings/savings.ts
export type CurrencyCode = 'USD' | 'EUR';

export type CurrencyRates = Record<
  CurrencyCode,
  { start: number; end: number }
>;

// Вбудований fallback на всякий випадок
const FALLBACK_RATES: CurrencyRates = {
  USD: {
    start: 38.0,
    end: 42.0,
  },
  EUR: {
    start: 41.0,
    end: 45.0,
  },
};

let currentRates: CurrencyRates = FALLBACK_RATES;

export function getCurrencyRates(): CurrencyRates {
  return currentRates;
}

export type SavingsResult = {
  currency: CurrencyCode;
  M: number;
  p: number;
  S_Y: number;
  S_C: number;
  W: number;
  S_H: number;
  S_L: number;
  H: number;
  R: number;
  monthlyRates: number[];
};

export function formatMoney(value: number): string {
  return value.toFixed(2);
}

async function fetchNbuRate(
  valcode: CurrencyCode,
  date: string,
): Promise<number | null> {
  const url = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${valcode}&date=${date}&json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!Array.isArray(data) || !data[0] || typeof data[0].rate !== 'number') {
      return null;
    }

    return data[0].rate as number;
  } catch {
    return null;
  }
}

export async function loadCurrencyRatesFromFile(): Promise<CurrencyRates> {
  try {
    const data = require('../assets/currency-rates.json') as CurrencyRates;
    currentRates = data;
    return data;
  } catch {
    currentRates = FALLBACK_RATES;
    return FALLBACK_RATES;
  }
}

/**
 * Завантажує курси USD/EUR з НБУ.
 * Якщо нічого не вдалося взяти з НБУ — намагається прочитати з текстового файлу.
 * Якщо і файл недоступний — використовує вбудований fallback.
 *
 * Повертає:
 *  - rates — які курси зараз використовуються
 *  - fromNetwork — чи вдалося щось реально взяти з НБУ
 */
export async function loadCurrencyRatesFromInternet(): Promise<{
  rates: CurrencyRates;
  fromNetwork: boolean;
}> {
  const now = new Date();
  const year = now.getFullYear();

  const startDate = `${year}0101`;
  const endDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const [usdStart, usdEnd, eurStart, eurEnd] = await Promise.all([
    fetchNbuRate('USD', startDate),
    fetchNbuRate('USD', endDate),
    fetchNbuRate('EUR', startDate),
    fetchNbuRate('EUR', endDate),
  ]);

  const anyFromNet =
    usdStart !== null ||
    usdEnd !== null ||
    eurStart !== null ||
    eurEnd !== null;

  if (!anyFromNet) {
    // Немає доступу до НБУ → читаємо з текстового файлу
    const fileRates = await loadCurrencyRatesFromFile();
    return {
      rates: fileRates,
      fromNetwork: false,
    };
  }

  const updated: CurrencyRates = {
    USD: {
      start: usdStart ?? currentRates.USD.start,
      end: usdEnd ?? currentRates.USD.end,
    },
    EUR: {
      start: eurStart ?? currentRates.EUR.start,
      end: eurEnd ?? currentRates.EUR.end,
    },
  };

  currentRates = updated;

  return {
    rates: updated,
    fromNetwork: true,
  };
}
