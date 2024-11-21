const NodeCache = require('node-cache');
const cache = new NodeCache();

function cacheMiddleware(duration) {
    const ttl = duration * 60;
    return (req, res, next) => {
        const key = req.originalUrl;
        if (cache.has(key)) {
            return res.json(cache.get(key));
        }

        const originalJson = res.json;
        res.json = (data) => {
            cache.set(key, data, ttl);
            console.log(`Cache size: ${cache.keys().length}`);
            originalJson.call(res, data);
        };

        next();
    };
}

module.exports = cacheMiddleware;
