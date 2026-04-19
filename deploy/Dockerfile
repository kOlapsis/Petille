# syntax=docker/dockerfile:1.7
# Multistage build for Pétille — minimal nginx:alpine runtime.

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

### Stage 2 — nginx:alpine runtime ###
FROM nginx:1.27-alpine AS runtime

# Drop the default server config and ship ours.
RUN rm /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/petille.conf

# Static assets.
COPY --from=build /app/dist /usr/share/nginx/html

# Non-root user for hardening.
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
