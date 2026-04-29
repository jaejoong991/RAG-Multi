# RAG-Multi Tenant SaaS

A multi-tenant Retrieval-Augmented Generation (RAG) platform. Organizations upload documents, get a chat API backed by their own knowledge base, and choose their own LLM (managed, bring-your-own-key, or self-hosted).

## Stack

| Layer | Technology |
|-------|-----------|
| Dashboard | Next.js 15 App Router + shadcn/ui |
| API Gateway | Express.js (TypeScript) |
| RAG Engine | Express.js (TypeScript) + LangChain.js |
| Worker | BullMQ (TypeScript) |
| Auth | Firebase Auth (email/password + Google OAuth) |
| File Storage | Firebase Storage |
| Vector DB | PostgreSQL + pgvector (Prisma) |
| Queue | Redis + BullMQ |
| Cache | Redis |

## Service URLs (local)

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| API Gateway | http://localhost:4000 |
| RAG Engine | http://localhost:4001 |

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- pnpm (recommended) or npm
- Firebase project (Auth + Storage enabled)
- OpenAI API key (or another LLM provider)

### macOS / Linux

```bash
./setup_dev.sh
```

### Windows

```powershell
.\setup_dev.ps1
```

Both scripts:
1. Copy `.env.example` → `.env` (if missing) and prompt you to fill it in
2. Install workspace dependencies
3. Start Docker infrastructure (Postgres, Redis)
4. Wait for Postgres to be ready
5. Run Prisma migrations

Then start all services:

```bash
npm run dev
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase client SDK API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID (client) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `INTERNAL_SECRET` | Shared secret for rag-engine ↔ api-gateway calls |
| `ENCRYPTION_KEY` | 64-char hex key for AES-256-GCM (BYOK key encryption) |
| `OPENAI_API_KEY` | Default managed LLM key |
| `STRIPE_SECRET_KEY` | Stripe billing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification |
| `OLLAMA_BASE_URL` | Ollama endpoint for BYOE mode (default: http://localhost:11434) |

---

## Per-Tenant LLM Modes

Each tenant configures their LLM under **Settings → LLM Config**:

| Mode | Description |
|------|-------------|
| **Managed** | Platform-hosted LLM (OpenAI/Anthropic/Google) — billed via Stripe |
| **BYOK** | Tenant provides their own API key — stored AES-256-GCM encrypted |
| **BYOE** | Tenant provides a self-hosted Ollama/vLLM endpoint URL |

Supported providers: `openai`, `anthropic`, `google`, `ollama`

---

## Architecture

```
Browser
  └── Next.js Dashboard (3000)
        └── API Gateway (4000)
              ├── Firebase Auth (session cookies)
              ├── Stripe billing
              ├── Document upload → Firebase Storage
              ├── BullMQ index-document job → Worker
              └── Chat query → RAG Engine (4001)
                    ├── Fetch tenant LLM config (internal secret)
                    ├── Embed query → pgvector similarity search
                    └── Generate answer via tenant LLM
```

### Services

- **api-gateway** — Auth, billing, document management, chat CRUD, analytics, admin, LLM config
- **rag-engine** — Document indexing (chunking + embedding) and query pipeline (retrieval + generation)
- **worker** — BullMQ processors for async document indexing, deletion, and usage aggregation
- **dashboard** — Next.js frontend with Firebase client SDK

---

## User Guide

### Super Admin

1. **Tenant Management** — View, suspend, or reactivate tenants from the Admin tab.
2. **Platform Analytics** — Monitor query volume, active users, and document counts.
3. **Cost Monitoring** — Track LLM spend across all tenants.

### Tenant (Organization)

1. **Knowledge Base** — Upload PDF, TXT, or DOCX files in Documents. Wait for "Indexed" status.
2. **LLM Config** — Choose Managed, BYOK, or BYOE mode and configure provider/model.
3. **Chat Playground** — Test responses and adjust system prompt, temperature, and retrieval settings.
4. **Embed** — Copy the widget snippet for your website.
5. **Team** — Invite members and assign Admin or Member roles.
6. **Billing** — Monitor usage and manage subscription via the Stripe portal.

---

## Production Deployment

Optimized for **Docker Compose** or **Coolify**.

1. Set production env vars (`DASHBOARD_URL`, `NEXT_PUBLIC_API_URL`, etc.)
2. Deploy:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
