import fs from "fs/promises";
import path from "path";
import type { CacheData, CacheDriver } from "@src/cache/types";

export class FileCacheDriver<T = unknown> implements CacheDriver<T> {
    private readonly cacheFile: string;

    constructor(providerName: string) {
        this.cacheFile = path.resolve("cache", `${providerName}-cache.json`);
    }

    async load(): Promise<CacheData<T> | null> {
        try {
            const raw = await fs.readFile(this.cacheFile, "utf-8");
            return JSON.parse(raw) as CacheData<T>;
        } catch {
            return null;
        }
    }

    async save(data: CacheData<T>): Promise<void> {
        await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });
        await fs.writeFile(this.cacheFile, JSON.stringify(data, null, 2), "utf-8");
    }

    async clear(): Promise<void> {
        try {
            await fs.unlink(this.cacheFile);
        } catch { /* empty */ }
    }
}

export class LocalStorageCacheDriver<T = unknown> implements CacheDriver<T> {
    private readonly key: string;

    constructor(providerName: string) {
        this.key = `currenzy-${providerName}-cache`;
    }

    async load(): Promise<CacheData<T> | null> {
        const raw = localStorage.getItem(this.key);
        return raw ? (JSON.parse(raw) as CacheData<T>) : null;
    }

    async save(data: CacheData<T>): Promise<void> {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    async clear(): Promise<void> {
        localStorage.removeItem(this.key);
    }
}
