FROM oven/bun:1.1.15 AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN bun install --production --frozen-lockfile

FROM base AS build
ENV CI=1
RUN bun install --frozen-lockfile

ENV PUBLIC_SITE_URL="set me"
ENV DISCORD_CLIENT_ID="set me"
ENV DISCORD_CLIENT_SECRET="set me"

RUN bun run build

FROM base
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 gurkz
ENV NODE_ENV production

COPY --from=prod-deps --chown=gurkz:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=gurkz:nodejs /app/build /app/build

EXPOSE 4321/tcp
CMD [ "bun", "run", "build/entry.mjs" ]