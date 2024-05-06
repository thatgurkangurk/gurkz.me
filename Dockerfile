FROM node:20-slim AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
ENV CI=1
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm svelte-kit sync
RUN pnpm run build

FROM base
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 gurkz
ENV NODE_ENV production

COPY --from=prod-deps --chown=gurkz:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=gurkz:nodejs /app/build /app/build

EXPOSE 3000/tcp
CMD [ "node", "build" ]