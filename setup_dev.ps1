# RAG-Multi Local Development Setup Script for Windows
$ErrorActionPreference = "Stop"

Write-Host "Starting local development setup..." -ForegroundColor Cyan

# 1. Copy .env if missing
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example" -ForegroundColor Yellow
    Write-Host "IMPORTANT: Fill in Firebase credentials and API keys in .env before continuing." -ForegroundColor Yellow
    Read-Host "Press Enter when ready"
}

# 2. Install dependencies
Write-Host "Installing workspace dependencies..." -ForegroundColor Cyan
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm install
} else {
    Write-Host "pnpm not found, falling back to npm..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}

# 3. Start infrastructure (Postgres + Redis — storage is Firebase, no MinIO)
Write-Host "Starting Docker infrastructure (Postgres, Redis)..." -ForegroundColor Cyan
docker compose up -d postgres redis

# 4. Wait for Postgres
Write-Host "Waiting for database..." -ForegroundColor Cyan
$retries = 0
$maxRetries = 30
while ($retries -lt $maxRetries) {
    $status = docker inspect -f '{{.State.Status}}' rag-postgres 2>$null
    if ($status -eq "running") {
        docker exec rag-postgres pg_isready -U admin -d rag_db 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host " Database ready." -ForegroundColor Green
            break
        }
    }
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 2
    $retries++
}

if ($retries -eq $maxRetries) {
    Write-Host "Database failed to start. Check: docker logs rag-postgres" -ForegroundColor Red
    exit 1
}

# 5. Prisma generate + migrate
Write-Host "Running Prisma migrations..." -ForegroundColor Cyan
Set-Location services/api-gateway
npx prisma generate
npx prisma migrate dev --name "init"
Set-Location ../..

Write-Host ""
Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host "Run all services:"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "URLs:"
Write-Host "  Dashboard:   http://localhost:3000"
Write-Host "  API Gateway: http://localhost:4000"
Write-Host "  RAG Engine:  http://localhost:4001"
Write-Host "---------------------------------------------------" -ForegroundColor Green
