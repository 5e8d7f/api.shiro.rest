FROM oven/bun:1.1.8-alpine as base

WORKDIR /app

FROM base as deps

COPY package.json bun.lockb ./
RUN bun install

FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV production
RUN bun build ./src/index.ts --target=bun --outfile=server.js --minify

FROM base as final

USER bun

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server.js ./server.js

CMD ["bun", "--bun", "server.js"]