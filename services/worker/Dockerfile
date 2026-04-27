FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=@rag-multi/worker...

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 workerjs
USER workerjs

COPY --from=builder /app/services/worker/dist ./dist
COPY --from=builder /app/services/worker/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/index.js"]
