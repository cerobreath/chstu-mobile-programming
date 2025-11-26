export const DEFAULT_MAX_VARIANT = 20;

function stringHashCode(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    // Java/Kotlin: h = 31 * h + ch
    hash = (ch + (31 * hash)) | 0;
  }

  return hash;
}

export function calcVariant(
  firstName: string,
  lastName: string,
  group: string,
  maxVariants: number = DEFAULT_MAX_VARIANT,
): number {
  // Нормалізуємо кількість варіантів
  let normalizedMax = Math.floor(maxVariants);

  if (!Number.isFinite(normalizedMax) || normalizedMax < 1) {
    normalizedMax = DEFAULT_MAX_VARIANT;
  }

  const combined = `${firstName}${lastName}${group}`.trim();

  // Якщо нічого не введено — повертаємо 1
  if (!combined) {
    return 1;
  }

  const hash = stringHashCode(combined);
  let result = hash % normalizedMax;

  if (result <= 0) {
    result += normalizedMax;
  }

  return result;
}
