FROM node:20-slim AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

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



CMD [ "bun", "run", "./build/index.js" ]
