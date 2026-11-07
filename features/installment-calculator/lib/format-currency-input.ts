import { normalizeDigits } from "@/lib/format";

function persianDigits(value: string): string {
  return value.replace(/\d/g, (digit) => String.fromCharCode(0x06f0 + Number(digit)));
}

/** Formats text without converting to Number, so unsafe amounts are never rounded. */
export function formatCurrencyInput(value: string, caret: number) {
  const normalized = normalizeDigits(value);
  const digits = normalized.replace(/[,٬]/g, "");

  // Keep invalid text visible so validation can explain it; never turn 1.5 into 15.
  if (!/^\d*$/.test(digits)) {
    return { value: persianDigits(normalized), caret };
  }

  const leadingZeros = digits.match(/^0+(?=\d)/)?.[0].length ?? 0;
  const canonical = digits.slice(leadingZeros);
  const formatted = persianDigits(canonical.replace(/\B(?=(\d{3})+(?!\d))/g, "٬"));
  const digitsBeforeCaret = Math.max(0,
    normalized.slice(0, caret).replace(/[,٬]/g, "").length - leadingZeros);

  let nextCaret = 0;
  let seenDigits = 0;
  while (nextCaret < formatted.length && seenDigits < digitsBeforeCaret) {
    if (formatted[nextCaret] !== "٬") seenDigits += 1;
    nextCaret += 1;
  }

  return { value: formatted, caret: nextCaret };
}
