export type CurrencyCode = 'USD' | 'PHP' | 'EUR'

export const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'USD', label: 'DOLLAR', symbol: '$' },
  { code: 'PHP', label: 'PESO', symbol: '₱' },
  { code: 'EUR', label: 'EURO', symbol: '€' },
]

const exchangeRates: Record<CurrencyCode, number> = {
  USD: 1,
  PHP: 56,
  EUR: 0.92,
}

export function formatCurrency(amountInUsd: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(currency === 'PHP' ? 'en-PH' : currency === 'EUR' ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountInUsd * exchangeRates[currency])
}

export function convertToUsd(amount: number, currency: CurrencyCode): number {
  return amount / exchangeRates[currency]
}

export function currencySymbol(currency: CurrencyCode): string {
  return currencies.find((item) => item.code === currency)?.symbol ?? '$'
}
