const redis = require('redis');
const logger = require('../utils/logger');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

// Connect immediately, but wrap in an async function if needed later, 
// for now connect here to ensure it's available.
redisClient.connect().catch(logger.error);

module.exports = redisClient;
