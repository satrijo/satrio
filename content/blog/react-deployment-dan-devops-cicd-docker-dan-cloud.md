---
title: "React Deployment dan DevOps: CI/CD, Docker, dan Cloud"
date: 2026-01-30T00:00:00.000Z
description: "Pelajari deployment React modern dengan Docker, CI/CD pipelines, dan cloud platforms. Setup production-ready dengan monitoring, logging, dan best practices DevOps."
category: React
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

Deployment yang baik bukan hanya tentang mengupload file, tetapi tentang setup yang reliable, scalable, dan maintainable. Dalam artikel ini, kita akan membahas deployment React modern dengan pendekatan DevOps.

> **Prasyarat:** Artikel ini mengasumsikan Anda sudah memahami React Hooks, Testing, dan Server Components. Jika Anda belum familiar dengan Server Components, silakan baca [React Server Components dan Server Actions dengan Next.js App Router](/blog/react-server-components-dan-server-actions-nextjs-app-router) terlebih dahulu.

## Arsitektur Deployment Modern

### Perubahan Paradigma Deployment

Deployment React telah berevolusi signifikan:

**Era Tradisional (2015-2018):**
- Static hosting (GitHub Pages, Netlify Drop)
- Manual FTP uploads
- Tidak ada CI/CD

**Era Modern (2026):**
- Git-based deployment
- Automated CI/CD pipelines
- Containerization dengan Docker
- Serverless dan edge deployment
- Infrastructure as Code (IaC)

### Platform Deployment 2026

**Static Site Hosting:**
- Vercel (Next.js optimized)
- Netlify (Git-based)
- Cloudflare Pages (Edge network)
- AWS Amplify (AWS integrated)

**Container Orchestration:**
- Kubernetes (Enterprise scale)
- Docker Swarm (Simple orchestration)
- AWS ECS/Fargate (Serverless containers)
- Google Cloud Run (Scale to zero)

**Serverless:**
- Vercel Functions
- Netlify Functions
- AWS Lambda
- Cloudflare Workers

## Docker untuk React Applications

### Dockerfile untuk React SPA

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets dari stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Dockerfile untuk Next.js

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### Docker Compose untuk Development

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
      - API_URL=http://api:4000
    depends_on:
      - api
    networks:
      - app-network
    restart: unless-stopped

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db
    networks:
      - app-network
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

## CI/CD dengan GitHub Actions

### Workflow untuk React SPA

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-files
          path: dist/
      
      - name: Deploy to Vercel (Staging)
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-files
          path: dist/
      
      - name: Deploy to Production
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: "dist/"
          target: "/var/www/html"
      
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Workflow untuk Docker Deployment

```yaml
name: Docker CI/CD

on:
  push:
    branches: [main]
    tags: ['v*']

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/app
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

## Environment Variables dan Secrets

### Managing Environment Variables

```typescript
// .env.development
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=MyApp Dev

// .env.production
VITE_API_URL=https://api.myapp.com
VITE_APP_NAME=MyApp

// env.d.ts
declare interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Usage
const apiUrl = import.meta.env.VITE_API_URL
```

### Secrets Management

**GitHub Secrets:**
1. Go to Settings > Secrets and variables > Actions
2. Add repository secrets:
   - `VERCEL_TOKEN`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `API_KEY`

**Docker Secrets (Swarm):**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: myapp:latest
    secrets:
      - database_url
      - jwt_secret
    environment:
      - DATABASE_URL_FILE=/run/secrets/database_url
      - JWT_SECRET_FILE=/run/secrets/jwt_secret

secrets:
  database_url:
    external: true
  jwt_secret:
    external: true
```

## Monitoring dan Logging

### Application Monitoring dengan Sentry

```typescript
// main.tsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false
    })
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})
```

### Performance Monitoring

```typescript
// hooks/usePerformance.ts
export function usePerformance() {
  useEffect(() => {
    // Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Send to analytics
        console.log(`${entry.name}: ${entry.value}`)
      }
    })
    
    observer.observe({ entryTypes: ['web-vitals'] })
    
    return () => observer.disconnect()
  }, [])
}
```

### Logging dengan Structured Logging

```typescript
// utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
}

class Logger {
  private static instance: Logger
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }
  
  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    }
    
    // Send to logging service
    if (import.meta.env.PROD) {
      fetch('/api/logs', {
        method: 'POST',
        body: JSON.stringify(entry)
      }).catch(console.error)
    } else {
      console[level](message, context)
    }
  }
  
  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context)
  }
  
  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context)
  }
  
  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context)
  }
  
  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context)
  }
}

export const logger = Logger.getInstance()
```

## Security Best Practices

### Content Security Policy (CSP)

```nginx
# nginx.conf
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.myapp.com;" always;
```

### HTTPS dan SSL

```yaml
# docker-compose with Traefik
version: '3.8'

services:
  traefik:
    image: traefik:v3.0
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@myapp.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./letsencrypt:/letsencrypt

  app:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`myapp.com`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
```

## Deployment Checklist

### Pre-Deployment
- [ ] Semua tests passing
- [ ] Type checking tanpa error
- [ ] Build berhasil
- [ ] Environment variables terset
- [ ] Secrets tersimpan dengan aman

### Deployment
- [ ] Docker image berhasil build
- [ ] CI/CD pipeline berjalan lancar
- [ ] Health checks passing
- [ ] Smoke tests passing

### Post-Deployment
- [ ] Aplikasi accessible
- [ ] Monitoring aktif
- [ ] Error tracking aktif
- [ ] SSL certificate valid
- [ ] CDN caching configured

## Platform-Specific Deployment

### Vercel (Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables
vercel env add DATABASE_URL
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### AWS Amplify

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Troubleshooting Deployment

### Common Issues

**1. Build Failures**
```bash
# Check Node version
node --version

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

**2. Environment Variables Not Loading**
```bash
# Verify .env files
ls -la | grep env

# Check variable names (must start with VITE_ for Vite)
grep VITE_ .env.production
```

**3. 404 Errors on Refresh**
```nginx
# Ensure nginx config has try_files
location / {
    try_files $uri $uri/ /index.html;
}
```

## Kesimpulan

Deployment modern memerlukan pendekatan DevOps yang terintegrasi. Dengan Docker, CI/CD, dan monitoring yang tepat, kita dapat memastikan aplikasi React berjalan reliably di production.

**Key Takeaways:**
1. Gunakan Docker untuk consistency
2. Implementasikan CI/CD untuk automation
3. Setup monitoring dan logging dari awal
4. Gunakan environment variables dengan benar
5. Prioritaskan security (HTTPS, CSP, secrets)

Selamat deploying! 🚀
