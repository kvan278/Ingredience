const NodeCache = require('node-cache');

class CacheService {
    constructor(ttlSeconds = 3600) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2 });
        this.cache.on('expired', (key, value) => {
            console.log(`Cache expired for key: ${key}`);
        });
    }

    get(key) {
        return this.cache.get(key);
    }

    set(key, value, ttl) {
        return this.cache.set(key, value, ttl);
    }

    del(key) {
        return this.cache.del(key);
    }

    flush() {
        return this.cache.flushAll();
    }

    has(key) {
        return this.cache.has(key);
    }

    getMultiple(keys = []) {
        return this.cache.mget(keys);
    }

    setMultiple(keyValuePairs = {}, ttl) {
        return this.cache.mset(Object.entries(keyValuePairs).map(([key, value]) => ({ key, val: value, ttl })));
    }

    updateOrSet(key, updateFunction, ttl) {
        const cachedData = this.get(key);
        if (cachedData) return cachedData;

        const newData = updateFunction();
        this.set(key, newData, ttl);
        return newData;
    }

    extendTTL(key, additionalSeconds) {
        const ttl = this.cache.getTtl(key);
        if (!ttl) return false;

        const newTTL = (ttl - Date.now()) / 1000 + additionalSeconds;
        const value = this.get(key);
        return this.set(key, value, newTTL);
    }

    getKeysByPattern(pattern) {
        const regex = new RegExp(pattern);
        return this.cache.keys().filter((key) => regex.test(key));
    }

    deleteByPattern(pattern) {
        const keysToDelete = this.getKeysByPattern(pattern);
        return this.cache.del(keysToDelete);
    }

    setWithAutoUpdate(key, value, updateInterval, updateFunction) {
        this.set(key, value, updateInterval);
        setInterval(async () => {
            const newValue = await updateFunction();
            this.set(key, newValue, updateInterval);
        }, updateInterval * 1000);
    }

    addOrIncrement(key, incrementValue = 1) {
        if (this.has(key)) {
            this.cache.set(key, this.cache.get(key) + incrementValue);
        } else {
            this.cache.set(key, incrementValue);
        }
    }
}

module.exports = new CacheService();
