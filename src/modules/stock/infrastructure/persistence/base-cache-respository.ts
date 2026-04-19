import redisClient from "@shared/infra/cache/redis";

export abstract class BaseCacheRepository {
    protected abstract readonly CACHE_TAG: string;
    protected readonly TTL = 3600;

    protected async getCacheKey(suffix: string): Promise<string> {
        let version = await redisClient.get(`version:${this.CACHE_TAG}`);
        if (!version) {
            version = "1";
            await redisClient.set(`version:${this.CACHE_TAG}`, version);
        }
        return `cache:${this.CACHE_TAG}:v${version}:${suffix}`;
    }

    protected async invalidateCache(): Promise<void> {
        await redisClient.incr(`version:${this.CACHE_TAG}`);
    }
}
