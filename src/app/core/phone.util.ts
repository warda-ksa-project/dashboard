/** Domestic mobile rules aligned with backend PhoneHelper. */

export type PhoneCountryCode = '+966' | '+968' | string;

const SA_NINE = /^[579]\d{8}$/;
const SA_TEN = /^0[579]\d{8}$/;
const OM_NINE = /^0[79]\d{7}$/;
const OM_EIGHT = /^[79]\d{7}$/;

export function extractDigits(value: string | null | undefined): string {
  return (value ?? '').replace(/\D/g, '');
}

export function normalizeCountryCode(code: string | null | undefined): string {
  const trimmed = (code ?? '+966').trim();
  return trimmed.startsWith('+') ? trimmed : `+${trimmed}`;
}

/** Display in forms: 9 digits without leading zero (e.g. 500000003). */
export function formatPhoneForInput(
  phone: string | null | undefined,
  countryCode: PhoneCountryCode = '+966',
): string {
  let digits = extractDigits(phone);
  const code = normalizeCountryCode(countryCode).replace('+', '');

  if (digits.startsWith(code) && digits.length > code.length) {
    digits = digits.slice(code.length);
  }

  digits = digits.replace(/^0+/, '');

  if (code === '966' && digits.length === 9) return digits;
  if (code === '968' && digits.length === 8) return digits;

  return digits;
}

/** Value sent to API (digits only, no leading zero for SA). */
export function normalizePhoneForApi(
  phone: string | null | undefined,
  countryCode: PhoneCountryCode = '+966',
): string {
  const code = normalizeCountryCode(countryCode).replace('+', '');
  let digits = extractDigits(phone);

  if (digits.startsWith(code) && digits.length > code.length) {
    digits = digits.slice(code.length);
  }

  digits = digits.replace(/^0+/, '');

  if (code === '966' && digits.length === 9) return digits;
  if (code === '968' && digits.length === 8) return digits;

  return digits;
}

export function isValidDomesticPhone(
  phone: string | null | undefined,
  countryCode: PhoneCountryCode = '+966',
): boolean {
  const value = (phone ?? '').trim();
  if (!value) return false;

  const digits = extractDigits(value);
  const code = normalizeCountryCode(countryCode).replace('+', '');

  if (code === '966') {
    return SA_NINE.test(digits) || SA_TEN.test(digits);
  }

  if (code === '968') {
    return OM_NINE.test(digits) || OM_EIGHT.test(digits);
  }

  const expectedLength = parseInt(code, 10) > 0 ? 9 : 9;
  return digits.length === expectedLength;
}

export function getDomesticPhoneHintKey(
  countryCode: PhoneCountryCode = '+966',
): string {
  const code = normalizeCountryCode(countryCode);
  if (code === '+966') return 'validation_message.phoneHint_sa';
  if (code === '+968') return 'validation_message.phoneHint_om';
  return 'validation_message.phoneHint_default';
}

export function getDomesticPhoneHint(
  countryCode: PhoneCountryCode = '+966',
  translate?: (key: string) => string,
): string {
  const key = getDomesticPhoneHintKey(countryCode);
  return translate ? translate(key) : key;
}

export function getDomesticPhoneMaxLength(countryCode: PhoneCountryCode = '+966'): number {
  return normalizeCountryCode(countryCode) === '+966' ? 10 : 9;
}
