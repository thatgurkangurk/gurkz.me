FROM ghcr.io/pnpm/pnpm:12.3.4 AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches/ ./patches/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches/ ./patches/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
ENV CI=1
COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN CI="1" BETTER_AUTH_SECRET="changeme" DATABASE_URL="postgres://changeme" pnpm run build

FROM base

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY package.json ./

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321/tcp

CMD [  "pnpm", "start" ]
