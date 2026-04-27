import 'dotenv/config';
import app from './app';
import prisma from './config/database';
import logger from './shared/utils/logger';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    // Check database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`API Gateway running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

bootstrap();
