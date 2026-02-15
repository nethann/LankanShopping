export type CurrencyCode = "LKR" | "USD" | "EUR" | "GBP" | "CAD" | "AUD";

export const DEFAULT_LKR_RATES: Record<CurrencyCode, number> = {
  LKR: 1,
  USD: 0.0033,
  EUR: 0.003,
  GBP: 0.0026,
  CAD: 0.0045,
  AUD: 0.0051,
};

export const SUPPORTED_CURRENCIES = Object.keys(DEFAULT_LKR_RATES) as CurrencyCode[];

export function isSupportedCurrency(value: unknown): value is CurrencyCode {
  return typeof value === "string" && SUPPORTED_CURRENCIES.includes(value as CurrencyCode);
}

const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  FR: "EUR",
  DE: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  PT: "EUR",
  AT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
  LK: "LKR",
};

export function getCurrencyFromLocale(): CurrencyCode {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const region = locale.split("-")[1]?.toUpperCase();
  if (region && COUNTRY_TO_CURRENCY[region]) {
    return COUNTRY_TO_CURRENCY[region];
  }
  return "USD";
}

export function getCurrencyFromCountry(countryCode: string | null | undefined): CurrencyCode {
  if (!countryCode) return "USD";
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] ?? "USD";
}

export function convertFromLkr(valueInLkr: number, currency: CurrencyCode, rates: Record<CurrencyCode, number>) {
  return valueInLkr * (rates[currency] ?? 1);
}

export function formatFromLkr(valueInLkr: number, currency: CurrencyCode, rates: Record<CurrencyCode, number>) {
  const converted = convertFromLkr(valueInLkr, currency, rates);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "LKR" ? 0 : 2,
  }).format(converted);
}
