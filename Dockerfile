FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY patches ./patches
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1-slim AS runner

WORKDIR /app

# adapter-node bundles all dependencies into build/, so no node_modules needed here.
COPY --from=builder /app/build ./build
COPY --from=builder /app/static ./static

CMD ["bun", "run", "build/index.js"]
