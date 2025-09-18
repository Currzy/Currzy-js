import { FileCacheDriver, LocalStorageCacheDriver } from "./drivers";
import type { CacheDriver } from "@src/cache/types";

export function createCacheDriver<T = unknown>(providerName: string): CacheDriver<T> {
    if (typeof window !== "undefined" && "localStorage" in window) {
        return new LocalStorageCacheDriver<T>(providerName);
    } else {
        return new FileCacheDriver<T>(providerName);
    }
}
