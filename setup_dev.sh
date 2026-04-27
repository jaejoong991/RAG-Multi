#!/bin/bash

# RAG-Multi Local Development Setup Script
set -e

echo "🚀 Starting local development setup..."

# 1. Check for .env file
if [ ! -f .env ]; then
    echo "📄 .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update your .env file with your LLM API keys before running the services."
fi

# 2. Install dependencies
echo "📦 Installing workspace dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    echo "pnpm not found, falling back to npm with --legacy-peer-deps..."
    npm install --legacy-peer-deps
fi

# 3. Start infrastructure
echo "🐳 Starting Docker infrastructure (Postgres, Redis, MinIO)..."
docker-compose up -d postgres redis minio

# 4. Wait for Postgres to be ready
echo "⏳ Waiting for database to be ready..."
until docker exec rag-postgres pg_isready -U admin -d rag_db > /dev/null 2>&1; do
  echo -n "."
  sleep 2
done
echo "✅ Database is ready!"

# 5. Initialize Prisma
echo "🏗️  Initializing Prisma and pushing database schema..."
cd services/api-gateway
npx prisma generate
npx prisma db push
cd ../..

echo "---------------------------------------------------"
echo "🎉 Setup complete!"
echo "---------------------------------------------------"
echo "To start the application, run:"
echo "   npm run dev"
echo ""
echo "Dashboard: http://localhost:3000"
echo "API Gateway: http://localhost:4000"
echo "MinIO Console: http://localhost:9001"
echo "---------------------------------------------------"
