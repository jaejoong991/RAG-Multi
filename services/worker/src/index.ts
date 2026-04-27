async function bootstrap() {
  console.log('👷 Background Worker starting...');
  // TODO: Initialize BullMQ workers
}

bootstrap().catch((err) => {
  console.error('Fatal error in Worker:', err);
  process.exit(1);
});
