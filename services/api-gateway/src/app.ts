import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import authRoutes from './modules/auth/auth.routes';
import billingRoutes from './modules/billing/billing.routes';
import tenantRoutes from './modules/tenant/tenant.routes';
import llmConfigRoutes from './modules/llm-config/llm-config.routes';
import chatRoutes from './modules/chat/chat.routes';
import adminRoutes from './modules/admin/admin.routes';
import documentRoutes from './modules/document/document.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());

// Raw body parser for Stripe webhooks
app.use(
  express.json({
    verify: (req, _res, buf) => {
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
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/llm-config', llmConfigRoutes);
app.use('/api/v1/conversations', chatRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Error Handling
app.use(errorHandler);

export default app;
