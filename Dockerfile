# syntax=docker/dockerfile:1.7

# ---------------------------------------------------------------------------
# A static site, so the runtime image contains no Node, no npm and no source —
# only Caddy and the contents of dist/. That is ~50MB against the ~1.2GB a
# `next start` image needs, and it is the difference between a deploy that
# pulls in seconds and one that pulls in minutes.
#
# Caddy rather than nginx, because the host already terminates TLS with Caddy
# and reverse-proxies to this container. One server, one config dialect.
# The container's Caddyfile lives inline below: it is a dozen lines and there
# is no reason for it to be a separate file that reads like host config.
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
ARG VITE_SITE_URL=https://swornim.avernek.com
ENV VITE_SITE_URL=$VITE_SITE_URL

# `npm run build` prerenders every route by loading it in a real browser, so
# the build stage needs one. Without this the build stops at that step, by
# design: shipping an empty <div id="root"> to link unfurlers is the failure
# prerendering exists to prevent, so it refuses rather than degrading quietly.
#
# Build-time only. Chromium never reaches the runtime image below, which is
# still just Caddy and dist/.
RUN apk add --no-cache chromium nss freetype harfbuzz ttf-freefont
ENV CHROME_PATH=/usr/bin/chromium-browser

# Types are checked here rather than in a separate pipeline stage: it is about
# two seconds against an already-warm node_modules, and a type error stops the
# image being built at all instead of being caught after it ships.
RUN npm run typecheck && npm run build

# Pre-compress everything Caddy will serve from the `precompressed` store, so
# compression happens once at build time at the highest level rather than per
# request at a lower one. Images are already compressed and are skipped.
RUN find dist -type f \( \
      -name '*.js' -o -name '*.css' -o -name '*.html' \
      -o -name '*.svg' -o -name '*.json' -o -name '*.xml' -o -name '*.txt' \
    \) -exec sh -c 'gzip -9 -c "$1" > "$1.gz"' _ {} \;

# --- runtime ---------------------------------------------------------------
FROM caddy:2-alpine AS runtime

# ---------------------------------------------------------------------------
# The one rule that matters is the fallback: /work/avernek is a route the
# router knows about and the filesystem does not, so any request that matches
# no file has to be answered with index.html rather than a 404. Everything
# else here is caching.
#
# TLS, HTTP/3, redirects and the hostname are the host Caddy's job. This one
# only ever speaks plain HTTP on :80 to the proxy in front of it.
# ---------------------------------------------------------------------------
COPY <<"CADDYFILE" /etc/caddy/Caddyfile
{
	admin off
	auto_https off
	persist_config off
}

:80 {
	root * /usr/share/caddy

	header {
		X-Content-Type-Options nosniff
		X-Frame-Options SAMEORIGIN
		Referrer-Policy strict-origin-when-cross-origin
		-Server
	}

	# Hashed filenames. The content of /assets/index-a1b2c3d4.js can never
	# change, so it is safe to cache for a year and never revalidate. Fonts
	# are not hashed but they do not change either.
	@immutable path /assets/* /fonts/*
	header @immutable Cache-Control "public, max-age=31536000, immutable"

	@media path *.jpg *.jpeg *.png *.webp *.avif *.gif *.ico *.svg
	header @media Cache-Control "public, max-age=2592000"

	@meta path /sitemap.xml /robots.txt
	header @meta Cache-Control "public, max-age=3600"

	# index.html is the deploy pointer — it names the current asset hashes,
	# so it must never be held in a cache. Everything else being immutable
	# only works if this one file is always fresh. Matched by exclusion so
	# that client routes, which are also served index.html, are covered too.
	@app not path /assets/* /fonts/* /sitemap.xml /robots.txt *.jpg *.jpeg *.png *.webp *.avif *.gif *.ico *.svg
	header @app Cache-Control "no-cache, must-revalidate"

	# Compression was done at build time; serve those .gz files rather than
	# spending CPU per request. `encode` stays as the fallback for anything
	# without a twin, and wraps every handler below it.
	encode gzip

	# Hashed filenames are never rewritten. A request for an asset that is
	# not on disk means a stale deploy pointer, and it has to 404 — answering
	# it with a page of HTML at a .js URL turns a missing chunk into a MIME
	# error three layers away from the cause.
	handle /assets/* {
		file_server {
			precompressed gzip
		}
	}

	handle /fonts/* {
		file_server {
			precompressed gzip
		}
	}

	# Same reasoning for anything with a media extension: it is a file or it
	# is nothing, and it is never a client route.
	@static path *.jpg *.jpeg *.png *.webp *.avif *.gif *.ico *.svg *.woff *.woff2
	handle @static {
		file_server {
			precompressed gzip
		}
	}

	# Prerendered routes first, then the SPA fallback. `{path}/index.html` is
	# what serves dist/work/index.html for /work; without that middle term
	# every route would fall through to the shell and prerendering would be
	# built and then thrown away at request time.
	handle {
		try_files {path} {path}/index.html /index.html
		file_server {
			precompressed gzip
		}
	}

	log {
		output stderr
		format console
	}
}
CADDYFILE

COPY --from=build /app/dist /usr/share/caddy

# The container runs read-only in production. Caddy writes nothing with
# `persist_config off` and no TLS to manage, but both XDG roots are pointed at
# the tmpfs anyway so a future directive cannot fail on a read-only rootfs.
ENV XDG_CONFIG_HOME=/tmp XDG_DATA_HOME=/tmp

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
