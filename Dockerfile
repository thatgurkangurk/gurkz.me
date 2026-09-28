FROM ghcr.io/pnpm/pnpm:12 AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/gurkz.me"
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY patches/ ./patches/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS build
ENV CI=1
COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN CI="1" BETTER_AUTH_SECRET="changeme" DATABASE_URL="postgres://changeme" pnpm run build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm prune --prod

FROM node:26-alpine AS runner
WORKDIR /app

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321/tcp

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json

CMD ["node", "build/index.js"]
