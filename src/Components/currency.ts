export type CurrencyCode = 'USD' | 'PHP' | 'EUR'

export const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'USD', label: 'DOLLAR', symbol: '$' },
  { code: 'PHP', label: 'PESO', symbol: '₱' },
  { code: 'EUR', label: 'EURO', symbol: '€' },
]

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(currency === 'PHP' ? 'en-PH' : currency === 'EUR' ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function currencySymbol(currency: CurrencyCode): string {
  return currencies.find((item) => item.code === currency)?.symbol ?? '$'
}
