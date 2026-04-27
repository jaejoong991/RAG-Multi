# RAG-Multi Tenant SaaS

A multi-tenant Retrieval-Augmented Generation (RAG) platform that allows organizations to build, manage, and deploy custom AI chatbots trained on their own documents.

## 🚀 Technical Setup

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- pnpm (recommended) or npm
- API Keys for LLM Providers (OpenAI, Gemini, or Anthropic)

### 💻 Local Development (Quick Start)

Run the automated setup script:
```bash
./setup_dev.sh
```

Then start the services:
```bash
npm run dev
```

---

### 💻 Manual Local Development (Step-by-Step)
   - **Dashboard**: http://localhost:3000
   - **API**: http://localhost:4000
   - **MinIO Console**: http://localhost:9001

---

### 🏗️ Production Deployment

The project is optimized for deployment via **Docker Compose** or **Coolify**.

1. **Preparation:**
   Ensure your production server has ports 80 and 443 open. Update `DASHBOARD_URL` and `NEXT_PUBLIC_API_URL` in your `.env` to your production domain.

2. **Deploy using Compose:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Monitoring:**
   Access **Uptime Kuma** at `http://your-ip:3001` to monitor service health.

---

## 📖 User Guide

### 👑 Super Admin Guide
*For platform owners managing the entire SaaS.*

1. **Tenant Management**: View, suspend, or reactivate tenant accounts from the "Tenants" tab.
2. **Platform Analytics**: Monitor total query volume, active users, and document counts across all organizations.
3. **Cost Monitoring**: Track LLM spend in real-time to manage platform margins.

### 🏢 Tenant (Organization) Guide
*For business owners using the platform.*

1. **Knowledge Base**: 
   - Upload PDF, TXT, or DOCX files in the **Documents** section.
   - Wait for the "Indexed" status (processed by the RAG engine).
2. **Chat Playground**:
   - Test your bot's responses immediately in the playground.
   - Adjust **Bot Settings** (System Prompt, Model, Temperature) to refine behavior.
3. **Deployment**:
   - Go to **Embed Code** to copy the snippet for your website.
   - Configure the **Widget Customization** (colors, logo, greeting) to match your brand.
4. **Team Management**: Invite team members and assign roles (Admin, Member).
5. **Billing**: Monitor your usage against plan limits and manage subscriptions via the Stripe portal.

---

## 🛠️ Architecture
- **API Gateway**: Express.js service handling Auth, Billing, and Routing.
- **RAG Engine**: Processing service for embeddings and LLM generation.
- **Worker**: Background processor for document chunking and indexing.
- **Dashboard**: Next.js 15 App Router with shadcn/ui.
- **Storage**: PostgreSQL (pgvector) for vectors, MinIO for files.
