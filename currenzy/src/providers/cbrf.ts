import { ofetch } from "ofetch";
import { XMLParser } from "fast-xml-parser";

export interface Rate {
  code: string;
  nominal: number;
  value: number;
  vunitRate: number;
}

interface CbrfValute {
  CharCode: string;
  Nominal: string;
  Name: string;
  Value: string;
}

interface CbrfData {
  ValCurs: {
    Valute: CbrfValute[] | CbrfValute;
  };
}

export const AVAILABLE_CURRENCIES = [
  "AUD",
  "AZN",
  "DZD",
  "GBP",
  "AMD",
  "BHD",
  "BYN",
  "BGN",
  "BOB",
  "BRL",
  "HUF",
  "VND",
  "HKD",
  "GEL",
  "DKK",
  "AED",
  "USD",
  "EUR",
  "EGP",
  "INR",
  "IDR",
  "IRR",
  "KZT",
  "CAD",
  "QAR",
  "KGS",
  "CNY",
  "CUP",
  "MDL",
  "MNT",
  "NGN",
  "NZD",
  "NOK",
  "OMR",
  "PLN",
  "SAR",
  "RON",
  "XDR",
  "SGD",
  "TJS",
  "THB",
  "BDT",
  "TRY",
  "TMT",
  "UZS",
  "UAH",
  "CZK",
  "SEK",
  "CHF",
  "ETB",
  "RSD",
  "ZAR",
  "KRW",
  "JPY",
  "MMK",
  "RUB",
] as const;

export type CurrencyCode = (typeof AVAILABLE_CURRENCIES)[number];

export function assertCurrency(code: string): asserts code is CurrencyCode {
  if (!AVAILABLE_CURRENCIES.includes(code as CurrencyCode)) {
    throw new Error(`Unknown currency: ${code}`);
  }
}

export class CbrfProvider {
  private url =
    "https://api.allorigins.win/raw?url=https://www.cbr.ru/scripts/XML_daily.asp";
  private rates: Record<CurrencyCode, Rate> = {} as Record<CurrencyCode, Rate>;
  private lastUpdate: Date | null = null;

  public availableCurrencies: readonly CurrencyCode[] = AVAILABLE_CURRENCIES;

  async fetchRates(): Promise<void> {
    const xml = await ofetch(this.url, { responseType: "text" });

    const parser = new XMLParser();
    const data: CbrfData = parser.parse(xml) as CbrfData;

    const items: CbrfValute[] = Array.isArray(data.ValCurs.Valute)
      ? data.ValCurs.Valute
      : [data.ValCurs.Valute];
    this.rates = {} as Record<CurrencyCode, Rate>;

    for (const item of items) {
      const nominal = Number(item.Nominal);
      const value = parseFloat(item.Value.replace(",", "."));
      const vunitRate = value / nominal;

      const rate: Rate = {
        code: item.CharCode,
        nominal,
        value,
        vunitRate,
      };

      if (this.availableCurrencies.includes(rate.code as CurrencyCode)) {
        this.rates[rate.code as CurrencyCode] = rate;
      }
    }

    this.rates["RUB"] = {
      code: "RUB",
      nominal: 1,
      value: 1,
      vunitRate: 1,
    };

    this.lastUpdate = new Date();
  }

  getRate(code: string, base: string = "USD"): number {
    assertCurrency(code);
    assertCurrency(base);

    const rateInRub = this.rates[code].vunitRate;
    const baseRateInRub = this.rates[base].vunitRate;

    return baseRateInRub / rateInRub;
  }

  convert(amount: number, from: string, to: string): number {
    assertCurrency(from);
    assertCurrency(to);

    const fromRateInRub = this.rates[from].vunitRate;
    const toRateInRub = this.rates[to].vunitRate;

    return (amount * fromRateInRub) / toRateInRub;
  }

  getAllRates(baseCode: string = "USD"): Record<CurrencyCode, number> {
    assertCurrency(baseCode);

    const result: Partial<Record<CurrencyCode, number>> = {};

    for (const code of this.availableCurrencies) {
      if (code === baseCode) continue;
      result[code] = this.getRate(code, baseCode);
    }

    return result as Record<CurrencyCode, number>;
  }

  getLastUpdate(): Date | null {
    return this.lastUpdate;
  }
}
