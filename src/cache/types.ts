export interface CacheData<T = unknown> {
    payload: T;
    lastUpdate: string | null;
}

export interface CacheDriver<T = unknown> {
    load(): Promise<CacheData<T> | null>;
    save(data: CacheData<T>): Promise<void>;
    clear(): Promise<void>;
}
