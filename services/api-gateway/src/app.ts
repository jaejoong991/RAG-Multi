import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import authRoutes from './modules/auth/auth.routes';
import billingRoutes from './modules/billing/billing.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());

// Raw body parser for Stripe webhooks
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      if (req.originalUrl.startsWith('/api/v1/billing/webhook')) {
        req.rawBody = buf;
      }
    },
  })
);

app.use(requestLogger);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/billing', billingRoutes);

// Error Handling
app.use(errorHandler);

export default app;
