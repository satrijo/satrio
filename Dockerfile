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

# Install runtime dependencies for better-sqlite3
RUN apk add --no-cache sqlite-dev

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# Copy built application from builder
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output

# Create content directory (will be mounted as volume)
RUN mkdir -p /app/content && chown -R nuxtjs:nodejs /app/content

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Switch to non-root user
USER nuxtjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]
