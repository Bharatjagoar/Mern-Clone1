const { createEmailWorker } = require('./jobs/emailWorker');

const worker = createEmailWorker();

console.log('TaskFlow email worker started');

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

process.on('SIGTERM', async () => {
  await worker.close();
  process.exit(0);
});
