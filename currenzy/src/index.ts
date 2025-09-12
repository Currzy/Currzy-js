import { CbrfProvider } from "./providers/cbrf.ts";

export { CbrfProvider };

export class Currenzy {
  provider: CbrfProvider;

  constructor(providerName: string) {
    if (providerName === "cbrf") this.provider = new CbrfProvider();
    else throw new Error("Unknown provider");
  }

  updateRates() {
    return this.provider.fetchRates();
  }

  getRate(code: string) {
    return this.provider.getRate(code);
  }

  convert(amount: number, from: string, to: string) {
    return this.provider.convert(amount, from, to);
  }

  getAllRatesTo(code?: string): Record<string, number | null> {
    return this.provider.getAllRates(code);
  }

  getLastUpdate() {
    return this.provider.getLastUpdate();
  }
}
