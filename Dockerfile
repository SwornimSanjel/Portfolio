# syntax=docker/dockerfile:1.7

# ---------------------------------------------------------------------------
# A static site, so the runtime image contains no Node, no npm and no source —
# only nginx and the contents of dist/. That is ~25MB against the ~1.2GB a
# `next start` image needs, and it is the difference between a deploy that
# pulls in seconds and one that pulls in minutes.
#
# Three things keep the build itself short:
#
#   1. package*.json is copied on its own, before the source. Editing a
#      component then costs nothing — the install layer is still valid.
#   2. `--mount=type=cache` keeps the npm cache between builds without ever
#      putting it in a layer. A warm rebuild installs from cache in seconds.
#   3. .dockerignore keeps node_modules, .git and dist out of the context.
#      Without it the daemon uploads several hundred MB before starting.
#
# Requires BuildKit, which is the default in Docker 23+. If a very old daemon
# is in play, `DOCKER_BUILDKIT=1` in the environment turns it on.
# ---------------------------------------------------------------------------

# --- dependencies ----------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# --- build -----------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Vite inlines VITE_* at build time — there is no runtime config to change
# later, so the origin has to be correct here.
ARG VITE_SITE_URL=https://swornimsanjel.com
ENV VITE_SITE_URL=$VITE_SITE_URL

# Types are checked here rather than in a separate pipeline stage: it is about
# two seconds against an already-warm node_modules, and a type error stops the
# image being built at all instead of being caught after it ships.
RUN npm run typecheck && npm run build

# Pre-compress everything nginx will serve with `gzip_static`, so compression
# happens once at build time at the highest level rather than per request at a
# lower one. Images are already compressed and are skipped.
RUN find dist -type f \( \
      -name '*.js' -o -name '*.css' -o -name '*.html' \
      -o -name '*.svg' -o -name '*.json' -o -name '*.xml' -o -name '*.txt' \
    \) -exec sh -c 'gzip -9 -c "$1" > "$1.gz"' _ {} \;

# --- runtime ---------------------------------------------------------------
FROM nginx:1.27-alpine-slim AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# nginx's own image runs as root to bind :80 and drops to the `nginx` user for
# workers, which is what we want. The content is read-only to those workers.
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
