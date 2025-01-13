FROM node:22-alpine AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV CI=1

RUN BETTER_AUTH_URL="replace me" BETTER_AUTH_SECRET="replace me" DATABASE_URL="replace me" DISCORD_CLIENT_ID="replace me" DISCORD_CLIENT_SECRET="replace me" pnpm run build

FROM base
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 gurkz
ENV NODE_ENV production

COPY --from=prod-deps --chown=gurkz:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=gurkz:nodejs /app/dist /app/dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321/tcp
CMD [ "node", "./dist/server/entry.mjs" ]