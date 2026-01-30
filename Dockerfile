# Stage 1: Dependencies (cached)
FROM node:20-alpine AS deps

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++ sqlite-dev

# Copy package files only
COPY package*.json ./

# Install dependencies (cached jika package.json tidak berubah)
RUN npm install

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

# Build the application
RUN npm run build

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

# Create data directory for SQLite database (persisted volume)
RUN mkdir -p /app/.data && chown -R nuxtjs:nodejs /app/.data

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

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
