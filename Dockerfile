FROM ghcr.io/nubjs/nub:alpine AS base
WORKDIR /app

FROM base AS deps
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN nub ci

FROM base AS build
ENV CI=1
ENV NODE_ENV="production"

COPY --chown=node:node --from=deps /app/node_modules /app/node_modules
COPY --chown=node:node . .

RUN BETTER_AUTH_SECRET="build_time_placeholder" DATABASE_URL="postgres://placeholder:placeholder@localhost:5432/placeholder" nub run build

FROM base AS runner

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321/tcp

COPY --from=build --chown=node:node /app/.output /app/.output

USER node

CMD [ "nub", "./.output/server/index.mjs" ]
