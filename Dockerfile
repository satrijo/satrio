# syntax=docker/dockerfile:1

# Stage 1: Dependencies (cached)
FROM node:20-alpine AS deps

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++ sqlite-dev

# Copy package files only
COPY package*.json ./

# Install dependencies with cache mounts for faster rebuilds
# Using npm install (not ci) due to dependency version conflicts
RUN --mount=type=cache,target=/root/.npm \
    npm install --prefer-offline --no-audit --no-fund

# Stage 2: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ sqlite-dev

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy source code
COPY . .

# Build the application with cache mounts
ENV NODE_ENV=production
RUN --mount=type=cache,target=/app/.nuxt/cache \
    npm run build

# Stage 3: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Install runtime dependencies for better-sqlite3, file watching, and su command
RUN apk add --no-cache sqlite-dev curl util-linux

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# Copy built application from builder
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output

# Copy content from builder (fallback if volume not mounted)
COPY --from=builder --chown=nuxtjs:nodejs /app/content /app/content

# Copy scripts and node_modules needed for sync-articles.js
COPY --from=builder --chown=nuxtjs:nodejs /app/scripts /app/scripts
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/pg /app/node_modules/pg
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/gray-matter /app/node_modules/gray-matter
# Copy gray-matter dependencies
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/js-yaml /app/node_modules/js-yaml
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/argparse /app/node_modules/argparse
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/toml /app/node_modules/toml
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/section-matter /app/node_modules/section-matter
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/strip-bom-string /app/node_modules/strip-bom-string
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/kind-of /app/node_modules/kind-of
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/extend-shallow /app/node_modules/extend-shallow
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/is-extendable /app/node_modules/is-extendable
# Copy pg dependencies
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/pg-pool /app/node_modules/pg-pool
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/pg-protocol /app/node_modules/pg-protocol
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/pg-types /app/node_modules/pg-types
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/pg-int8 /app/node_modules/pg-int8
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/pg-numeric /app/node_modules/pg-numeric
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/pgpass /app/node_modules/pgpass
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/postgres-array /app/node_modules/postgres-array
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/postgres-bytea /app/node_modules/postgres-bytea
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/postgres-date /app/node_modules/postgres-date
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/postgres-interval /app/node_modules/postgres-interval
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/postgres-range /app/node_modules/postgres-range
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/split2 /app/node_modules/split2
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/xtend /app/node_modules/xtend
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/buffer-writer /app/node_modules/buffer-writer
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/packet-reader /app/node_modules/packet-reader
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/ws /app/node_modules/ws
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/obuf /app/node_modules/obuf
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/through2 /app/node_modules/through2
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/readable-stream /app/node_modules/readable-stream
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/safe-buffer /app/node_modules/safe-buffer
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/string_decoder /app/node_modules/string_decoder
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/util-deprecate /app/node_modules/util-deprecate
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/inherits /app/node_modules/inherits
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/core-util-is /app/node_modules/core-util-is
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/isarray /app/node_modules/isarray
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules/process-nextick-args /app/node_modules/process-nextick-args

# Create data directory for SQLite database (persisted volume)
RUN mkdir -p /app/.data && chown -R nuxtjs:nodejs /app/.data

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_PRESET=node-server

# Note: Don't switch to nuxtjs here - entrypoint needs to run as root for chown
# The application will run as nuxtjs via su in CMD

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start script that rebuilds content database on startup
# Copy as root so entrypoint can run as root (for chown)
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["su", "-s", "/bin/sh", "-c", "exec node .output/server/index.mjs", "nuxtjs"]
