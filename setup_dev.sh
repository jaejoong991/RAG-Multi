#!/bin/bash
set -e

echo "Starting local development setup..."

# 1. Copy .env if missing
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
    echo "IMPORTANT: Fill in Firebase credentials and API keys in .env before continuing."
    echo "Press Enter when ready..."
    read -r
fi

# 2. Install dependencies
echo "Installing workspace dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install --legacy-peer-deps
fi

# 3. Start infrastructure (Postgres + Redis — storage is Firebase, no MinIO)
echo "Starting Docker infrastructure (Postgres, Redis)..."
docker compose up -d postgres redis

# 4. Wait for Postgres
echo "Waiting for database..."
until docker exec rag-postgres pg_isready -U admin -d rag_db > /dev/null 2>&1; do
  echo -n "."
  sleep 2
done
echo " Database ready."

# 5. Prisma generate + migrate
echo "Running Prisma migrations..."
cd services/api-gateway
npx prisma generate
npx prisma migrate dev --name "init"
cd ../..

echo ""
echo "---------------------------------------------------"
echo "Setup complete!"
echo "---------------------------------------------------"
echo "Run all services:"
echo "  npm run dev"
echo ""
echo "URLs:"
echo "  Dashboard:   http://localhost:3000"
echo "  API Gateway: http://localhost:4000"
echo "  RAG Engine:  http://localhost:4001"
echo "---------------------------------------------------"
