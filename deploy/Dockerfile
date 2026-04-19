# syntax=docker/dockerfile:1.7
# Multistage build for Pétille — minimal caddy:alpine runtime.

### Stage 1 — Build the PWA (SSG output) ###
FROM node:20-alpine AS build
WORKDIR /app

RUN corepack enable

# Install deps first (layer cache).
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy sources and build.
COPY . .
RUN pnpm build && node scripts/check-bundle-size.mjs

### Stage 2 — caddy:alpine runtime ###
FROM caddy:2-alpine AS runtime

COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
