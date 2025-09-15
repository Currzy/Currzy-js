import { ofetch } from "ofetch";
import { XMLParser } from "fast-xml-parser";
import fs from "fs/promises";
import path from "path";

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
  private cacheFile = path.resolve(".cbrf-cache.json");
  private initialized = false;
  private cacheTTL = 1000 * 60 * 60;

  public availableCurrencies: readonly CurrencyCode[] = AVAILABLE_CURRENCIES;

  private async loadCache() {
    try {
      const raw = await fs.readFile(this.cacheFile, "utf-8");
      const parsed = JSON.parse(raw);
      this.rates = parsed.rates;
      this.lastUpdate = parsed.lastUpdate ? new Date(parsed.lastUpdate) : null;
      this.initialized = true;
      console.log("Cache loaded successfully.");
    } catch {
      console.log("No cache found or it is corrupted.");
    }
  }

  private async saveCache() {
    try {
      await fs.writeFile(
          this.cacheFile,
          JSON.stringify(
              {
                rates: this.rates,
                lastUpdate: this.lastUpdate,
              },
              null,
              2
          ),
          "utf-8"
      );
    } catch (e) {
      console.error("Не удалось сохранить кеш:", e);
    }
  }

  public async clearCache() {
    try {
      await fs.unlink(this.cacheFile);
      console.log("Cache file deleted.");
    } catch {
      console.log("Cache file does not exist.");
    }
    this.rates = {} as Record<CurrencyCode, Rate>;
    this.lastUpdate = null;
    this.initialized = false;
  }

  private async fetchRates(): Promise<void> {
    try {
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

      this.rates["RUB"] = { code: "RUB", nominal: 1, value: 1, vunitRate: 1 };
      this.lastUpdate = new Date();
      this.initialized = true;
      await this.saveCache();
    } catch (e) {
      console.error("Error fetching CBR rates:", e);
      if (!this.initialized) {
        await this.loadCache();
        if (!this.initialized) throw new Error("No CBR data available and cache is missing.");
      }
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.loadCache();
    }

    const cacheExpired =
        this.lastUpdate === null ||
        new Date().getTime() - this.lastUpdate.getTime() > this.cacheTTL;

    if (!this.initialized || cacheExpired) {
      await this.fetchRates();
    }
  }

  async getRate(code: string, base: string = "USD"): Promise<number> {
    await this.ensureInitialized();
    assertCurrency(code);
    assertCurrency(base);

    const rateInRub = this.rates[code].vunitRate;
    const baseRateInRub = this.rates[base].vunitRate;

    return baseRateInRub / rateInRub;
  }

  async convert(amount: number, from: string, to: string): Promise<number> {
    await this.ensureInitialized();
    assertCurrency(from);
    assertCurrency(to);

    const fromRateInRub = this.rates[from].vunitRate;
    const toRateInRub = this.rates[to].vunitRate;

    return (amount * fromRateInRub) / toRateInRub;
  }

  async getAllRates(
      baseCode: string = "USD"
  ): Promise<Record<CurrencyCode, number>> {
    await this.ensureInitialized();
    assertCurrency(baseCode);

    const result: Partial<Record<CurrencyCode, number>> = {};

    for (const code of this.availableCurrencies) {
      if (code === baseCode) continue;
      result[code] = await this.getRate(code, baseCode);
    }

    return result as Record<CurrencyCode, number>;
  }

  getLastUpdate(): Date | null {
    return this.lastUpdate;
  }
}

