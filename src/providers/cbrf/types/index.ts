export * from "./rate";
export * from "./currency";
export * from "./api";

import type { Rate, CurrencyCode } from "@src/providers/cbrf/types/index";

export interface CbrfCache {
    rates: Record<CurrencyCode, Rate>;
}