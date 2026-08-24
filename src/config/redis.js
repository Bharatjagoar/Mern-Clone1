const IORedis = require('ioredis');
const env = require('./env');

// BullMQ requires maxRetriesPerRequest: null on connections it manages.
// This connection is shared for general-purpose use (dedup keys, rate limit
// store); queues/workers create their own connections with the same URL.
const redis = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null,
});

module.exports = redis;
