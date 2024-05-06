FROM oven/bun:alpine

WORKDIR /app

COPY package.json /app/
COPY bun.lockb /app/

RUN bun install

COPY . /app

CMD ["bun", "run", "start"]