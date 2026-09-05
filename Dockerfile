FROM ghcr.io/nubjs/nub:alpine AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
WORKDIR /app

FROM base AS deps
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN nub ci

FROM base AS build
ENV CI=1
COPY --chown=node:node --from=deps /app/node_modules /app/node_modules
COPY --chown=node:node . .

RUN CI="1" BETTER_AUTH_SECRET="changeme" DATABASE_URL="postgres://changeme" nub run build

FROM base

COPY --from=build --chown=node:node /app/.output /app/.output

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321/tcp

CMD [ "nub", "./.output/server/index.mjs" ]
