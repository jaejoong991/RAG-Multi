# Project Tasks

## Phase 1: Foundation
- [x] **TSK-1.1**: Initialize Turborepo workspace.
- [x] **TSK-1.2**: Set up Docker Compose (PostgreSQL, pgvector, Redis, MinIO).
- [x] **TSK-1.3**: Scaffold `api-gateway` service.
- [x] **TSK-1.4**: Define Prisma schema for core entities.
- [x] **TSK-1.5**: Implement core middleware (error handler, logger).
- [x] **TSK-1.6**: Implement Auth module (JWT, OAuth).
- [x] **TSK-1.7**: Implement Tenant isolation logic.

## Phase 2: RAG Engine
- [x] **TSK-2.1**: Scaffold `rag-engine` service.
- [x] **TSK-2.2**: Implement LLM Factory (Multi-provider).
- [x] **TSK-2.3**: Build document indexing pipeline in `worker` service.
- [x] **TSK-2.4**: Implement tenant-scoped vector search.

## Phase 3: Dashboard UI
- [x] **TSK-3.1**: Initialize Next.js dashboard app.
- [x] **TSK-3.2**: Implement base layout and theme.
- [x] **TSK-3.3**: Build Documents management UI.
- [x] **TSK-3.4**: Build Chat Playground.
- [x] **TSK-3.5**: Build Analytics page.
- [x] **TSK-3.6**: Build Conversations page.
- [x] **TSK-3.7**: Build Bot Settings page.
- [x] **TSK-3.8**: Build Widget Customization page.
- [x] **TSK-3.9**: Build Embed Code generator page.
- [x] **TSK-3.10**: Build Team Management page.
- [x] **TSK-3.11**: Build API Keys page.
- [x] **TSK-3.12**: Build Billing page.

## Phase 4: Super Admin & Polish
- [x] **TSK-4.1**: Super admin layout + tenant list.
- [x] **TSK-4.2**: Platform analytics page.
- [x] **TSK-4.3**: Cost monitor page.
- [x] **TSK-4.4**: Stripe integration.
- [x] **TSK-4.5**: Plan enforcement middleware (Quotas).

## Phase 5: Production
- [x] **TSK-5.1**: Dockerfiles for all services.
- [x] **TSK-5.2**: CI/CD setup with Coolify.
- [x] **TSK-5.3**: Production deployment preparation (Compose, Nginx). (Completed)
