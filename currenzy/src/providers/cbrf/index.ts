import { ofetch } from "ofetch";
import { XMLParser } from "fast-xml-parser";
import { createCacheDriver } from "@src/cache";
import {
  Rate,
  CurrencyCode,
  AVAILABLE_CURRENCIES,
  assertCurrency,
  CbrfValute,
  CbrfData,
  CbrfCache,
} from "@src/providers/cbrf/types";

export class CbrfProvider {
  private url =
      "https://api.allorigins.win/raw?url=https://www.cbr.ru/scripts/XML_daily.asp";

  private rates: Record<CurrencyCode, Rate> = {} as Record<CurrencyCode, Rate>;
  private lastUpdate: Date | null = null;
  private initialized = false;
  private cacheTTL = 1000 * 60 * 60;
  private cache = createCacheDriver<CbrfCache>("cbrf");

  public availableCurrencies: readonly CurrencyCode[] = AVAILABLE_CURRENCIES;

  private async loadCache() {
    const data = await this.cache.load();
    if (data) {
      this.rates = data.payload.rates;
      this.lastUpdate = data.lastUpdate ? new Date(data.lastUpdate) : null;
      this.initialized = true;
    }
  }

  private async saveCache() {
    await this.cache.save({
      payload: { rates: this.rates },
      lastUpdate: this.lastUpdate ? this.lastUpdate.toISOString() : null,
    });
  }

  public async clearCache() {
    await this.cache.clear();
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

        const rate: Rate = { code: item.CharCode, nominal, value, vunitRate };

        if (this.availableCurrencies.includes(rate.code as CurrencyCode)) {
          this.rates[rate.code as CurrencyCode] = rate;
        }
      }

      this.rates["RUB"] = { code: "RUB", nominal: 1, value: 1, vunitRate: 1 };
      this.lastUpdate = new Date();
      this.initialized = true;
      await this.saveCache();
    } catch (e) {
      console.error("Error fetching CBRF rates:", e);
      if (!this.initialized) {
        await this.loadCache();
        if (!this.initialized) throw new Error("No CBRF data and no cache");
      }
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) await this.loadCache();

    const expired =
        this.lastUpdate === null ||
        new Date().getTime() - this.lastUpdate.getTime() > this.cacheTTL;

    if (!this.initialized || expired) {
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

  async getAllRates(base: string = "USD"): Promise<Record<CurrencyCode, number>> {
    await this.ensureInitialized();
    assertCurrency(base);

    const result: Partial<Record<CurrencyCode, number>> = {};

    for (const code of this.availableCurrencies) {
      if (code === base) continue;
      result[code] = await this.getRate(code, base);
    }

    return result as Record<CurrencyCode, number>;
  }

  getLastUpdate(): Date | null {
    return this.lastUpdate;
  }
}

