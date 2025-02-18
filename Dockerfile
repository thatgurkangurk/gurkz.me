FROM oven/bun:1.2.2 AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
COPY . /app
WORKDIR /app

FROM base AS deps
RUN bun install --frozen-lockfile

FROM base AS build
ENV CI=1
COPY --from=deps /app/node_modules /app/node_modules

RUN CI="1" REMOTE_AUTH_HOST="change me" DATABASE_URL="postgres://change.me" PASSPORT_CLIENT_ID="change me" bun run build

FROM base
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 gurkz
ENV NODE_ENV production

COPY --from=deps --chown=gurkz:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=gurkz:nodejs /app/build /app/build

ENV HOST=0.0.0.0
ENV PORT=4321
ENV ORIGIN=https://www.gurkz.me
EXPOSE 4321/tcp

CMD [ "node", "build" ]
