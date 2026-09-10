FROM ghcr.io/pnpm/pnpm:12 AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
WORKDIR /app

FROM base AS deps
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS prod-deps
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
ENV CI=1
COPY --chown=node:node --from=deps /app/node_modules /app/node_modules
COPY --chown=node:node . .

RUN CI="1" BETTER_AUTH_SECRET="changeme" DATABASE_URL="postgres://changeme" nub run build

FROM base

COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/build /app/build
COPY --chown=node:node package.json ./

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321/tcp

CMD [ "node", "./build/index.js" ]
