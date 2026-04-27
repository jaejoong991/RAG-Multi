# RAG-Multi Local Development Setup Script for Windows
$ErrorActionPreference = "Stop"

Write-Host ">>> Starting local development setup..." -ForegroundColor Cyan

# 1. Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "[INFO] .env file not found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "[WARN] Please update your .env file with your LLM API keys before running the services." -ForegroundColor Yellow
}

# 2. Install dependencies
Write-Host "[STEP] Installing workspace dependencies..." -ForegroundColor Cyan
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm install
} else {
    Write-Host "pnpm not found, falling back to npm with --legacy-peer-deps..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}

# 3. Start infrastructure
Write-Host "[STEP] Starting Docker infrastructure (Postgres, Redis, MinIO)..." -ForegroundColor Cyan
docker-compose up -d postgres redis minio

# 4. Wait for Postgres to be ready
Write-Host "[WAIT] Waiting for database to be ready..." -ForegroundColor Cyan
$retries = 0
$maxRetries = 30
while ($retries -lt $maxRetries) {
    # Check if container is running first
    $status = docker inspect -f '{{.State.Status}}' rag-postgres 2>$null
    if ($status -eq "running") {
        $check = docker exec rag-postgres pg_isready -U admin -d rag_db 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n[OK] Database is ready!" -ForegroundColor Green
            break
        }
    }
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 2
    $retries++
}

if ($retries -eq $maxRetries) {
    Write-Host "`n[ERROR] Database failed to start in time. Please check docker logs: docker logs rag-postgres" -ForegroundColor Red
    exit 1
}

# 5. Initialize Prisma
Write-Host "[STEP] Initializing Prisma and pushing database schema..." -ForegroundColor Cyan
try {
    npx prisma generate --schema=services/api-gateway/prisma/schema.prisma
    npx prisma db push --schema=services/api-gateway/prisma/schema.prisma --accept-data-loss
} catch {
    Write-Host "[ERROR] Prisma initialization failed." -ForegroundColor Red
}


Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host "To start the application, run:"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "Dashboard: http://localhost:3000"
Write-Host "API Gateway: http://localhost:4000"
Write-Host "MinIO Console: http://localhost:9001"
Write-Host "---------------------------------------------------"
