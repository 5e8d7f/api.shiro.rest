FROM oven/bun:1.1.24-alpine AS base

WORKDIR /app

FROM base as deps

COPY package.json bun.lockb ./
RUN bun install

FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun build ./src/index.ts --target=bun --outfile=server.js

FROM oven/bun:1.1.24-distroless AS final
USER nonroot

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server.js ./server.js

CMD ["./server.js"]