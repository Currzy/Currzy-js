import { CbrfProvider } from "@src/providers/cbrf";

export { CbrfProvider };

export class Currzy {
  provider: CbrfProvider;

  constructor(providerName: string) {
    if (providerName === "cbrf") this.provider = new CbrfProvider();
    else throw new Error("Unknown provider");
  }

  async getRate(code: string) {
    return await this.provider.getRate(code);
  }

  async convert(amount: number, from: string, to: string) {
    return await this.provider.convert(amount, from, to);
  }

  async getAllRatesTo(code?: string): Promise<Record<string, number | null>> {
    return await this.provider.getAllRates(code);
  }

  async clearCache(): Promise<void> {
    return this.provider.clearCache();
  }

  getLastUpdate(): Date | null {
    return this.provider.getLastUpdate();
  }
}

