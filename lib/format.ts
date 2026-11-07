const numberFormatter = new Intl.NumberFormat("fa-IR");

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
}

/** Empty strings and malformed amounts stay invalid rather than becoming zero. */
export function parseWholeAmount(value: string): number {
  const normalized = normalizeDigits(value).trim();
  if (!/^(?:\d+|\d{1,3}(?:[,٬]\d{3})+)$/.test(normalized)) {
    return NaN;
  }
  const amount = Number(normalized.replace(/[,٬]/g, ""));
  return Number.isSafeInteger(amount) ? amount : NaN;
}
