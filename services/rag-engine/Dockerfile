FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=@rag-multi/rag-engine...

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 enginejs
USER enginejs

COPY --from=builder /app/services/rag-engine/dist ./dist
COPY --from=builder /app/services/rag-engine/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/index.js"]
