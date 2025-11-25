FROM oven/bun:1.3.3 AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build
ENV CI=1
COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN CI="1" DATABASE_URL="postgres://changeme" bun run --bun build

FROM base
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 gurkz

COPY --from=build --chown=gurkz:nodejs /app/build /app/build

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
ENV ORIGIN="https://www.gurkz.me/"
EXPOSE 4321/tcp

CMD [ "bun", "./build/index.js" ]
