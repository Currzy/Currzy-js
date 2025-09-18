export const AVAILABLE_CURRENCIES = [
    "AUD", "AZN", "DZD", "GBP", "AMD", "BHD", "BYN", "BGN", "BOB", "BRL",
    "HUF", "VND", "HKD", "GEL", "DKK", "AED", "USD", "EUR", "EGP", "INR",
    "IDR", "IRR", "KZT", "CAD", "QAR", "KGS", "CNY", "CUP", "MDL", "MNT",
    "NGN", "NZD", "NOK", "OMR", "PLN", "SAR", "RON", "XDR", "SGD", "TJS",
    "THB", "BDT", "TRY", "TMT", "UZS", "UAH", "CZK", "SEK", "CHF", "ETB",
    "RSD", "ZAR", "KRW", "JPY", "MMK", "RUB"
] as const;

export type CurrencyCode = (typeof AVAILABLE_CURRENCIES)[number];

export function assertCurrency(code: string): asserts code is CurrencyCode {
    if (!AVAILABLE_CURRENCIES.includes(code as CurrencyCode)) {
        throw new Error(`Unknown currency: ${code}`);
    }
}
