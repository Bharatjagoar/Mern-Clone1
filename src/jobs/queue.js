const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const env = require('../config/env');

// BullMQ needs its own connection with maxRetriesPerRequest: null.
const connection = new IORedis(env.redisUrl, { maxRetriesPerRequest: null });

const EMAIL_QUEUE_NAME = 'email-notifications';
const EMAIL_DLQ_NAME = 'email-notifications-dlq';

const emailQueue = new Queue(EMAIL_QUEUE_NAME, { connection });
const emailDlq = new Queue(EMAIL_DLQ_NAME, { connection });

module.exports = { connection, emailQueue, emailDlq, EMAIL_QUEUE_NAME, EMAIL_DLQ_NAME };
