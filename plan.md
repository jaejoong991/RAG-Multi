# RAG Multi-Tenant SaaS — Implementation Plan

## Stack Decision (Locked)

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | 5.x |
| API | Express.js | 5.x |
| ORM | Prisma | 5.x |
| Dashboard | Next.js 15 (App Router) | 15.x |
| UI Components | shadcn/ui + Tailwind CSS v4 | latest |
| Auth | Auth.js (NextAuth v5) + Google OAuth | 5.x |
| LLM Orchestration | LangChain.js | 1.x |
| LLM Providers | OpenAI, Gemini, Anthropic, Ollama | latest |
| Database | PostgreSQL 16 + pgvector | 16.x |
| Queue | BullMQ | 5.x |
| Cache | Redis 7 | 7.x |
| Object Storage | MinIO | latest |
| Payments | Stripe | 17.x |
| Containerization | Docker + Docker Compose | latest |
| Reverse Proxy | Nginx | latest |
| Monitoring | Uptime Kuma | latest |
| CI/CD | Coolify | — |

---

## Architecture: Modular Services (Not Monolith)

```
RAG-Multi/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .gitignore
├── plan.md
├── turbo.json                        # Turborepo config
├── package.json                      # Workspace root
├── tsconfig.base.json                # Shared TS config
│
├── services/
│   ├── api-gateway/                  # SERVICE 1: Express API Gateway
│   │   ├── src/
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   ├── config/
│   │   │   │   ├── env.ts            # Zod-validated env vars
│   │   │   │   ├── database.ts
│   │   │   │   └── redis.ts
│   │   │   ├── middleware/
│   │   │   │   ├── authenticate.ts   # JWT validation
│   │   │   │   ├── tenantScope.ts    # Injects tenantId into req
│   │   │   │   ├── rateLimiter.ts    # Per-tenant rate limiting
│   │   │   │   ├── errorHandler.ts   # Global error handler
│   │   │   │   ├── requestLogger.ts  # Structured logging
│   │   │   │   └── validateRequest.ts # Zod schema validation
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   ├── auth.schema.ts    # Zod request/response
│   │   │   │   │   └── auth.types.ts
│   │   │   │   ├── tenant/
│   │   │   │   │   ├── tenant.controller.ts
│   │   │   │   │   ├── tenant.service.ts
│   │   │   │   │   ├── tenant.repository.ts  # Data access layer
│   │   │   │   │   ├── tenant.routes.ts
│   │   │   │   │   ├── tenant.schema.ts
│   │   │   │   │   └── tenant.types.ts
│   │   │   │   ├── document/
│   │   │   │   │   ├── document.controller.ts
│   │   │   │   │   ├── document.service.ts
│   │   │   │   │   ├── document.repository.ts
│   │   │   │   │   ├── document.routes.ts
│   │   │   │   │   ├── document.schema.ts
│   │   │   │   │   └── document.types.ts
│   │   │   │   ├── chat/
│   │   │   │   │   ├── chat.controller.ts
│   │   │   │   │   ├── chat.service.ts
│   │   │   │   │   ├── chat.repository.ts
│   │   │   │   │   ├── chat.gateway.ts       # WebSocket handler
│   │   │   │   │   ├── chat.routes.ts
│   │   │   │   │   ├── chat.schema.ts
│   │   │   │   │   └── chat.types.ts
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── analytics.controller.ts
│   │   │   │   │   ├── analytics.service.ts
│   │   │   │   │   ├── analytics.repository.ts
│   │   │   │   │   ├── analytics.routes.ts
│   │   │   │   │   └── analytics.types.ts
│   │   │   │   ├── billing/
│   │   │   │   │   ├── billing.controller.ts
│   │   │   │   │   ├── billing.service.ts
│   │   │   │   │   ├── billing.webhook.ts    # Stripe webhooks
│   │   │   │   │   ├── billing.routes.ts
│   │   │   │   │   └── billing.types.ts
│   │   │   │   └── admin/
│   │   │   │       ├── admin.controller.ts
│   │   │   │       ├── admin.service.ts
│   │   │   │       ├── admin.routes.ts
│   │   │   │       └── admin.types.ts
│   │   │   ├── shared/
│   │   │   │   ├── errors/
│   │   │   │   │   ├── AppError.ts           # Base error class
│   │   │   │   │   ├── NotFoundError.ts
│   │   │   │   │   ├── UnauthorizedError.ts
│   │   │   │   │   ├── ForbiddenError.ts
│   │   │   │   │   └── ValidationError.ts
│   │   │   │   ├── utils/
│   │   │   │   │   ├── logger.ts             # Pino structured logger
│   │   │   │   │   ├── pagination.ts
│   │   │   │   │   └── crypto.ts
│   │   │   │   └── types/
│   │   │   │       ├── express.d.ts          # Extend Express Request
│   │   │   │       └── common.ts
│   │   │   └── prisma/
│   │   │       ├── schema.prisma
│   │   │       ├── migrations/
│   │   │       └── seed.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── rag-engine/                   # SERVICE 2: RAG Processing Engine
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── config/
│   │   │   │   └── llm.ts            # Multi-LLM factory
│   │   │   ├── providers/
│   │   │   │   ├── LLMFactory.ts     # Creates LLM by provider name
│   │   │   │   ├── openai.provider.ts
│   │   │   │   ├── gemini.provider.ts
│   │   │   │   ├── anthropic.provider.ts
│   │   │   │   └── ollama.provider.ts
│   │   │   ├── services/
│   │   │   │   ├── embedding.service.ts   # Batch embedding
│   │   │   │   ├── retrieval.service.ts   # Vector search (tenant-scoped)
│   │   │   │   ├── generation.service.ts  # LLM response generation
│   │   │   │   └── reranker.service.ts    # Optional re-ranking
│   │   │   ├── pipelines/
│   │   │   │   ├── queryPipeline.ts       # Search → Retrieve → Generate
│   │   │   │   └── indexPipeline.ts       # Parse → Chunk → Embed → Store
│   │   │   └── utils/
│   │   │       ├── tokenCounter.ts
│   │   │       └── costCalculator.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── worker/                       # SERVICE 3: Background Job Worker
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── processors/
│   │   │   │   ├── indexDocument.processor.ts
│   │   │   │   ├── deleteDocument.processor.ts
│   │   │   │   └── usageAggregation.processor.ts
│   │   │   └── queues/
│   │   │       └── registry.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── widget/                       # SERVICE 4: Embeddable Chat Widget
│       ├── src/
│       │   ├── loader.ts
│       │   ├── widget.ts
│       │   ├── styles.css
│       │   └── types.ts
│       ├── rollup.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   └── dashboard/                    # APP: Next.js Back Office
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx
│       │   │   └── register/page.tsx
│       │   ├── (super-admin)/
│       │   │   ├── layout.tsx
│       │   │   ├── tenants/page.tsx
│       │   │   ├── platform-analytics/page.tsx
│       │   │   └── cost-monitor/page.tsx
│       │   └── (tenant)/
│       │       ├── layout.tsx
│       │       ├── dashboard/page.tsx
│       │       ├── documents/page.tsx
│       │       ├── conversations/page.tsx
│       │       ├── playground/page.tsx
│       │       ├── analytics/page.tsx
│       │       ├── settings/
│       │       │   ├── bot/page.tsx
│       │       │   ├── widget/page.tsx
│       │       │   ├── team/page.tsx
│       │       │   ├── api-keys/page.tsx
│       │       │   └── billing/page.tsx
│       │       └── embed-code/page.tsx
│       ├── components/
│       │   ├── ui/                   # shadcn/ui components
│       │   ├── layouts/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Header.tsx
│       │   │   └── BreadcrumbNav.tsx
│       │   ├── documents/
│       │   │   ├── UploadDropzone.tsx
│       │   │   ├── DocumentTable.tsx
│       │   │   └── IndexingProgress.tsx
│       │   ├── chat/
│       │   │   ├── ChatPlayground.tsx
│       │   │   ├── MessageBubble.tsx
│       │   │   └── SourceCard.tsx
│       │   ├── analytics/
│       │   │   ├── UsageChart.tsx
│       │   │   ├── TopQuestionsTable.tsx
│       │   │   └── CostBreakdown.tsx
│       │   └── billing/
│       │       ├── PlanSelector.tsx
│       │       ├── UsageMeter.tsx
│       │       └── InvoiceHistory.tsx
│       ├── lib/
│       │   ├── api.ts                # API client (fetch wrapper)
│       │   ├── auth.ts               # Auth.js config
│       │   └── stripe.ts             # Stripe client
│       ├── hooks/
│       │   ├── useDocuments.ts
│       │   ├── useConversations.ts
│       │   └── useAnalytics.ts
│       ├── Dockerfile
│       ├── next.config.ts
│       ├── package.json
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── packages/
│   └── shared/                       # SHARED: Types, constants, utils
│       ├── src/
│       │   ├── types/
│       │   │   ├── tenant.types.ts
│       │   │   ├── document.types.ts
│       │   │   ├── chat.types.ts
│       │   │   ├── billing.types.ts
│       │   │   └── api.types.ts      # Shared API response shapes
│       │   ├── constants/
│       │   │   ├── plans.ts          # Plan definitions & limits
│       │   │   ├── models.ts         # Supported LLM models list
│       │   │   └── errors.ts         # Error codes
│       │   └── utils/
│       │       └── validators.ts
│       ├── package.json
│       └── tsconfig.json
│
└── infra/
    ├── nginx/
    │   └── nginx.conf
    ├── postgres/
    │   └── init.sql                  # Enable pgvector extension
    └── scripts/
        ├── deploy.sh
        └── backup.sh
```

---

## Coding Rules & Standards (MANDATORY)

### Rule 1: Module Pattern (Controller → Service → Repository)

Every module follows a strict 3-layer separation:

```
Route → Controller → Service → Repository → Prisma/DB
         (HTTP)      (Logic)    (Data Access)
```

- **Controller:** Parse request, call service, return response. NO business logic.
- **Service:** Business logic, orchestration, validation. NO direct DB queries.
- **Repository:** Data access only. Every query MUST include `tenantId` filter.

```typescript
// ❌ WRONG — Controller has business logic
export const getDocuments = async (req: Request, res: Response) => {
  const docs = await prisma.document.findMany({
    where: { tenantId: req.tenantId, status: 'indexed' }
  });
  const withStats = docs.map(d => ({ ...d, sizeFormatted: formatBytes(d.fileSize) }));
  res.json(withStats);
};

// ✅ CORRECT — Controller delegates to service
export const getDocuments = async (req: Request, res: Response) => {
  const docs = await documentService.listByTenant(req.tenantId, req.query);
  res.json({ success: true, data: docs });
};
```

### Rule 2: Tenant Isolation Is Non-Negotiable

```typescript
// Every repository method MUST accept tenantId as first parameter
class DocumentRepository {
  // ✅ tenantId is always the first parameter
  async findAll(tenantId: string, filters?: DocumentFilters) {
    return prisma.document.findMany({
      where: { tenantId, ...filters }
    });
  }

  // ❌ NEVER — a query without tenantId
  async findAll(filters?: DocumentFilters) {
    return prisma.document.findMany({ where: filters });
  }
}
```

**Enforcement mechanisms:**
1. TypeScript interface forces `tenantId` on all repository methods
2. Prisma middleware logs warnings if any query lacks `tenantId` in WHERE
3. PostgreSQL RLS as database-level safety net
4. Integration tests that verify cross-tenant data is never returned

### Rule 3: Error Handling — Custom Error Classes

```typescript
// All errors extend AppError
throw new NotFoundError('Document', documentId);
throw new ForbiddenError('You do not have access to this resource');
throw new ValidationError('File type not supported', { allowed: ['pdf', 'txt', 'docx'] });

// Global error handler catches and formats consistently
// { success: false, error: { code: 'NOT_FOUND', message: '...', details: {} } }
```

Never use `res.status(500).json({ error: err.message })`. Always throw typed errors.

### Rule 4: Request Validation — Zod Schemas

```typescript
// Every route has a schema
const createDocumentSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
  }),
  params: z.object({
    tenantId: z.string().uuid(),
  }),
});

// Middleware validates before controller runs
router.post('/', validate(createDocumentSchema), documentController.create);
```

### Rule 5: Environment Variables — Validated at Startup

```typescript
// config/env.ts — Zod validates ALL env vars on boot
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  // ...
});

// App crashes immediately if env is misconfigured — not 30 minutes later
export const env = envSchema.parse(process.env);
```

### Rule 6: Logging — Structured JSON (Pino)

```typescript
// Always structured, always with context
logger.info({ tenantId, documentId, chunkCount: 42 }, 'Document indexed successfully');
logger.error({ tenantId, err, requestId }, 'Failed to process document');

// NEVER
console.log('Document indexed');
console.error(err);
```

### Rule 7: API Response Format — Consistent

```typescript
// Success
{ success: true, data: T, meta?: { page, limit, total } }

// Error
{ success: false, error: { code: string, message: string, details?: any } }

// Never return raw arrays or untyped objects
```

### Rule 8: Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | `camelCase.purpose.ts` | `document.controller.ts` |
| Classes | `PascalCase` | `DocumentService` |
| Interfaces/Types | `PascalCase` | `TenantSettings` |
| Functions | `camelCase` | `getDocumentsByTenant` |
| Constants | `UPPER_SNAKE` | `MAX_FILE_SIZE` |
| DB tables | `snake_case` | `document_chunks` |
| API routes | `kebab-case` | `/api/v1/api-keys` |
| Env vars | `UPPER_SNAKE` | `DATABASE_URL` |

### Rule 9: API Versioning

All public APIs are versioned: `/api/v1/...`. Internal dashboard APIs use `/api/internal/...`.

### Rule 10: No Hardcoded Values

```typescript
// ❌ NEVER
if (plan === 'pro') { limit = 5000; }

// ✅ ALWAYS — from shared constants
import { PLAN_LIMITS } from '@rag-multi/shared';
const limit = PLAN_LIMITS[tenant.plan].queriesPerMonth;
```

### Rule 11: Git Conventions

- **Branching:** `feature/xxx`, `fix/xxx`, `refactor/xxx`
- **Commits:** Conventional commits — `feat(document): add batch upload endpoint`
- **PR required** for `main` branch. No direct pushes.

### Rule 12: Testing Strategy

| Layer | Tool | Minimum Coverage |
|-------|------|-----------------|
| Unit (services) | Vitest | 80% |
| Integration (API routes) | Supertest + Vitest | Critical paths |
| E2E (dashboard) | Playwright | Happy paths |
| Tenant isolation | Custom suite | 100% — every query tested |

---

## Future Development Considerations

### Scalability Path

| Current (10 tenants) | Mid-term (50 tenants) | Long-term (500+ tenants) |
|----------------------|----------------------|--------------------------|
| Single VPS | 2 VPS (API + DB separate) | Kubernetes cluster |
| Docker Compose | Docker Compose | Helm charts |
| pgvector | pgvector (tuned) | Qdrant dedicated cluster |
| Single worker | 3 workers | Auto-scaled worker pool |
| MinIO single node | MinIO distributed | S3 |
| Ollama on VPS | Dedicated GPU VPS | vLLM cluster |

### Extensibility Points (Design Now, Build Later)

1. **Plugin System for Document Loaders**
   - Current: PDF, TXT, DOCX
   - Future: Web scraping, Notion API, Google Drive, Confluence, Slack
   - Design: `DocumentLoader` interface — new sources implement `load(): Document[]`

2. **Webhook System**
   - Tenants receive webhooks on: document indexed, chat completed, usage threshold hit
   - Design: `webhooks` table + async dispatch queue

3. **Multi-language Support**
   - System prompts and widget UI in tenant's language
   - Design: `locale` field on tenant settings, i18n on dashboard

4. **Advanced RAG Features**
   - Hybrid search (vector + keyword BM25)
   - Conversation memory (multi-turn context window)
   - Citation with page numbers
   - Confidence scoring on answers
   - Design: `queryPipeline.ts` is already modular — add pipeline steps

5. **White-label**
   - Tenants use custom domain for their widget
   - Design: `custom_domain` field on tenant, Nginx dynamic routing

6. **SSO / SAML**
   - Enterprise tenants bring their own IdP
   - Design: Auth.js supports custom providers — add per-tenant provider config

7. **Audit Trail**
   - Full audit log of all admin actions for compliance
   - Design: `audit_logs` table, middleware that auto-logs mutations

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Initialize Turborepo workspace
- [ ] Set up Docker Compose (PostgreSQL + pgvector + Redis + MinIO)
- [ ] Scaffold `api-gateway` service with Express + TypeScript
- [ ] Configure Prisma schema (tenants, users, documents, chunks, conversations, messages, usage_logs)
- [ ] Run initial migration
- [ ] Implement core middleware (errorHandler, requestLogger, validateRequest)
- [ ] Implement auth module (register, login, JWT, refresh tokens, Google OAuth)
- [ ] Implement tenantScope middleware
- [ ] Implement tenant module (CRUD)
- [ ] Seed script for dev data
- [ ] Health check endpoint

### Phase 2: RAG Engine + Document Pipeline (Week 3-4)
- [ ] Scaffold `rag-engine` service
- [ ] Implement LLMFactory (multi-provider)
- [ ] Implement embedding service (batch)
- [ ] Implement document upload API → MinIO storage
- [ ] Scaffold `worker` service with BullMQ
- [ ] Implement indexDocument processor (parse → chunk → embed → store)
- [ ] Implement tenant-scoped vector search via pgvector
- [ ] Implement query pipeline (retrieve → generate)
- [ ] Chat API (REST endpoint)
- [ ] Chat WebSocket gateway
- [ ] Usage logging (tokens, cost per query)

### Phase 3: Dashboard — Tenant Features (Week 5-6)
- [ ] Initialize Next.js app with shadcn/ui
- [ ] Auth pages (login, register)
- [ ] Tenant layout (sidebar, header, breadcrumbs)
- [ ] Documents page (upload dropzone, table, indexing status)
- [ ] Chat playground page
- [ ] Conversations page (list + detail view)
- [ ] Bot settings page (system prompt, model, temperature)
- [ ] Widget customization page
- [ ] Embed code generator page
- [ ] Analytics page (query volume, top questions, response times)

### Phase 4: Super Admin + Billing + Widget (Week 7-8)
- [ ] Super admin layout + tenant list page
- [ ] Platform analytics page (all tenants)
- [ ] Cost monitor page (LLM spend breakdown)
- [ ] Stripe integration (subscriptions, checkout, portal)
- [ ] Billing webhook handler
- [ ] Plan enforcement middleware (quota checks)
- [ ] Tenant billing page (usage meter, invoices)
- [ ] Build embeddable chat widget (loader.js + iframe)
- [ ] Widget API (public, API-key authenticated)
- [ ] Rate limiting per tenant/plan

### Phase 5: Polish + Production (Week 9-10)
- [ ] Dockerfiles for all services
- [ ] docker-compose.prod.yml
- [ ] Nginx config (SSL, reverse proxy, subdomains)
- [ ] GitHub Actions CI/CD pipeline
- [ ] Uptime Kuma monitoring
- [ ] Security audit (RLS, tenant isolation tests)
- [ ] API documentation
- [ ] README.md
- [ ] Production deployment to VPS
