---
title: "Deployment Node.js: Docker dan Cloud"
date: "2026-02-18T00:00:00.000Z"
description: "Panduan lengkap deployment aplikasi Node.js menggunakan Docker dan layanan cloud. Pelajari containerization, CI/CD pipeline, environment management, monitoring, dan best practices deployment production."
category: Node.js
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# Deployment Node.js: Docker dan Cloud

Deployment adalah tahap krusial dalam software development lifecycle. Artikel ini akan membimbing Anda melalui proses deployment aplikasi Node.js menggunakan Docker untuk containerization dan berbagai layanan cloud untuk hosting production.

## Mengapa Containerization?

Docker dan containerization telah merevolusi cara kita deploy aplikasi:

**Consistency**: Aplikasi berjalan sama di development, staging, dan production environment.

**Isolation**: Setiap container berjalan secara independen tanpa mengganggu container lain.

**Portability**: Container dapat dijalankan di mana saja yang mendukung Docker.

**Scalability**: Mudah untuk scale up atau scale down berdasarkan demand.

**Resource Efficiency**: Lebih ringan dibandingkan virtual machines.

## Persiapan Aplikasi untuk Production

Sebelum deployment, pastikan aplikasi Anda production-ready:

### 1. Environment Configuration

```javascript
// config/index.js
const config = {
  development: {
    port: 3000,
    db: 'mongodb://localhost:27017/dev_db',
    jwtSecret: 'dev-secret',
    logLevel: 'debug'
  },
  production: {
    port: process.env.PORT || 8080,
    db: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    logLevel: 'error'
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];
```

### 2. Health Check Endpoint

```javascript
// routes/health.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  };
  
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    
    healthcheck.database = 'Connected';
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error.message;
    healthcheck.database = 'Disconnected';
    res.status(503).json(healthcheck);
  }
});

module.exports = router;
```

### 3. Graceful Shutdown

```javascript
// server.js
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    try {
      await mongoose.connection.close();
      console.log('Database connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

## Docker Configuration

### 1. Dockerfile

```dockerfile
# Dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy app source
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "server.js"]
```

### 2. Health Check Script

```javascript
// healthcheck.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
```

### 3. .dockerignore

```
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
README.md
.env
.env.local
.env.development
.env.test
.env.production
coverage
.nyc_output
.vscode
.idea
*.log
logs
*.md
```

### 4. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nodejs-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGODB_URI=mongodb://mongo:27017/production
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  mongo:
    image: mongo:6-jammy
    container_name: nodejs-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    container_name: nodejs-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: nodejs-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  mongo-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

### 5. Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream nodejs_app {
        server app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    server {
        listen 80;
        server_name your-domain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css application/json application/javascript;

        # Static files
        location /static/ {
            alias /app/public/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API routes with rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://nodejs_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Auth routes with stricter rate limiting
        location /api/auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://nodejs_app;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Health check
        location /health {
            proxy_pass http://nodejs_app;
            access_log off;
        }

        # Default location
        location / {
            proxy_pass http://nodejs_app;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

## Build dan Run Docker

```bash
# Build Docker image
docker build -t nodejs-app .

# Run container
docker run -p 3000:3000 --env-file .env nodejs-app

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=3
```

## CI/CD Pipeline dengan GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongo:
        image: mongo:6
        ports:
          - 27017:27017
      redis:
        image: redis:7
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
      env:
        NODE_ENV: test
        MONGODB_URI: mongodb://localhost:27017/test
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          ghcr.io/${{ github.repository }}:latest
          ghcr.io/${{ github.repository }}:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /opt/app
          docker-compose pull
          docker-compose up -d
          docker system prune -f
```

## Deployment ke Cloud Providers

### 1. AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init -p node.js my-node-app

# Create environment and deploy
eb create my-node-env
eb open
```

### 2. Google Cloud Run

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA']
  
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'myapp'
      - '--image'
      - 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

### 3. Heroku

```yaml
# heroku.yml
build:
  docker:
    web: Dockerfile
run:
  web: node server.js
```

```bash
# Deploy to Heroku
heroku stack:set container -a my-node-app
git push heroku main
```

## Environment Management

### 1. Environment Variables

```javascript
// config/env.js
const Joi = require('joi');

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRE: Joi.string().default('15m'),
  REDIS_URL: Joi.string().uri(),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info')
}).unknown();

const { error, value: envVars } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongodb: {
    uri: envVars.MONGODB_URI
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expire: envVars.JWT_EXPIRE
  },
  redis: {
    url: envVars.REDIS_URL
  },
  logLevel: envVars.LOG_LEVEL
};
```

### 2. Secrets Management

Gunakan AWS Secrets Manager, Azure Key Vault, atau HashiCorp Vault untuk production secrets.

## Monitoring dan Logging

### 1. Application Logging

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'nodejs-app' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
```

### 2. Application Metrics

```javascript
// middleware/metrics.js
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDuration.startTimer();
  
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode
    };
    
    end(labels);
    httpRequestsTotal.inc(labels);
  });
  
  next();
};

module.exports = { metricsMiddleware, register: promClient.register };
```

## Backup dan Disaster Recovery

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_$DATE.gz"

# Create backup
mongodump --uri="$MONGODB_URI" --gzip --archive="$BACKUP_DIR/$FILENAME"

# Upload to S3
aws s3 cp "$BACKUP_DIR/$FILENAME" s3://my-backup-bucket/mongodb/

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "backup_*.gz" -mtime +7 -delete
```

## Best Practices

1. **Use Multi-stage Docker Builds**: Untuk ukuran image yang lebih kecil.

2. **Non-root User**: Jalankan container dengan user non-root untuk keamanan.

3. **Health Checks**: Implementasikan health checks untuk monitoring.

4. **Graceful Shutdown**: Tangani sinyal shutdown dengan baik.

5. **Environment Variables**: Jangan hardcode secrets, gunakan environment variables.

6. **Log Aggregation**: Gunakan centralized logging seperti ELK atau Datadog.

7. **Monitoring**: Monitor metrics dan set up alerts.

8. **Auto-scaling**: Konfigurasi auto-scaling berdasarkan metrics.

9. **Blue-Green Deployment**: Untuk zero-downtime deployment.

10. **Regular Backups**: Backup database secara teratur.

## Kesimpulan

Deployment aplikasi Node.js ke production memerlukan perencanaan dan konfigurasi yang matang. Dengan Docker, Anda mendapatkan consistency dan portability. Dengan cloud services, Anda mendapatkan scalability dan reliability.

Pemahaman tentang containerization, CI/CD, monitoring, dan best practices akan membantu Anda membangun deployment pipeline yang robust dan maintainable.

Selamat deploying!
