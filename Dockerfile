FROM oven/bun:1.2.2 AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
COPY . /app
WORKDIR /app

FROM base AS deps
RUN bun install --frozen-lockfile

FROM base AS build
ENV CI=1
COPY --from=deps /app/node_modules /app/node_modules

RUN bun run build

FROM base
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 gurkz
ENV NODE_ENV production

COPY --from=deps --chown=gurkz:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=gurkz:nodejs /app/.vinxi /app/.vinxi
COPY --from=build --chown=gurkz:nodejs /app/.output /app/.output

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321/tcp
CMD [ "bun", "run", "./.output/server/index.mjs" ]
