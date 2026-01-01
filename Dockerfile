FROM oven/bun:1.3.3 AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
COPY patches/ ./patches/
RUN bun install --frozen-lockfile

FROM base AS build
ENV CI=1
COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN CI="1" DATABASE_URL="postgres://changeme" bun run --bun build

FROM gcr.io/distroless/base

COPY --from=build --chown=gurkz:nodejs /app/dist/gurkz-me gurkz-me

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
ENV ORIGIN="https://www.gurkz.me/"
EXPOSE 4321/tcp

CMD [ "./gurkz-me" ]
