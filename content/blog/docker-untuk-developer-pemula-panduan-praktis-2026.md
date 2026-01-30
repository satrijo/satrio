---
title: "Docker untuk Developer Pemula: Panduan Praktis 2026"
date: 2026-01-29T00:00:00.000Z
description: "Pelajari Docker dari nol untuk development modern. Containerization, Docker Compose, dan best practices untuk developer web 2026."
category: Node.js
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

Docker telah menjadi tools essential untuk developer modern di tahun 2026. Containerization memungkinkan kita membuat environment development yang konsisten, isolasi dependencies, dan deployment yang mudah. Dalam artikel ini, kita akan mempelajari Docker dari dasar hingga praktis untuk development web.

## Apa itu Docker?

Docker adalah platform containerization yang memungkinkan kita:
- **Package aplikasi** dengan semua dependencies
- **Isolasi environment** dari host system
- **Konsistensi** antara development dan production
- **Portability** - run anywhere

### Perbandingan: VM vs Container

**Virtual Machine:**
- Heavy (GBs)
- Slow boot
- Full OS
- Resource intensive

**Docker Container:**
- Lightweight (MBs)
- Fast boot (seconds)
- Share host OS kernel
- Efficient resource usage

## Instalasi Docker

### Windows/Mac
Download Docker Desktop dari [docker.com](https://docker.com)

### Linux (Ubuntu/Debian)
```bash
# Update package index
sudo apt update

# Install dependencies
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
sudo docker --version
sudo docker compose version
```

### Post-installation (Linux)
```bash
# Add user to docker group (no sudo needed)
sudo usermod -aG docker $USER
newgrp docker

# Test
docker run hello-world
```

## Konsep Dasar Docker

### 1. Images
Blueprint untuk container. Read-only template dengan OS, dependencies, dan aplikasi.

```bash
# List images
docker images

# Pull image dari Docker Hub
docker pull node:20-alpine

# Remove image
docker rmi node:20-alpine
```

### 2. Containers
Running instance dari image. Isolated environment dengan own filesystem, network, dan processes.

```bash
# Run container
docker run -d -p 3000:3000 --name my-app node:20-alpine

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop container
docker stop my-app

# Start container
docker start my-app

# Remove container
docker rm my-app
```

### 3. Dockerfile
Script untuk build custom image.

```dockerfile
# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "server.js"]
```

Build dan run:
```bash
# Build image
docker build -t my-node-app .

# Run container
docker run -d -p 3000:3000 my-node-app
```

## Docker Compose

Mengelola multi-container applications dengan satu file.

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://db:27017/myapp
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  db:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  mongo_data:
```

### Perintah Docker Compose
```bash
# Start all services
docker compose up -d

# Build dan start
docker compose up -d --build

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f app

# Stop services
docker compose down

# Stop dan remove volumes
docker compose down -v

# Restart service
docker compose restart app

# Scale service
docker compose up -d --scale app=3
```

## Praktik: Node.js + MongoDB

### Struktur Project
```
my-docker-app/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── package.json
└── src/
    └── server.js
```

### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

### .dockerignore
```
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.env
.env.local
coverage
.nyc_output
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/devdb
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - mongo
    command: npm run dev

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Development Workflow
```bash
# Start development
docker compose up -d

# View logs
docker compose logs -f web

# Execute command in container
docker compose exec web npm install express

# Run tests
docker compose exec web npm test

# Stop
docker compose down
```

## Docker Best Practices 2026

### 1. Use Specific Tags
```dockerfile
# ❌ Bad
FROM node:latest

# ✅ Good
FROM node:20.11.0-alpine
```

### 2. Multi-stage Builds
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 3. Security
```dockerfile
# Run as non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Scan for vulnerabilities
docker scan my-image
```

### 4. Optimize Layer Caching
```dockerfile
# Copy package files first (cached if not changed)
COPY package*.json ./
RUN npm ci

# Copy source (changes frequently)
COPY . .
```

### 5. Health Checks
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

## Common Commands Cheat Sheet

```bash
# Images
docker images                    # List images
docker pull image:tag           # Download image
docker build -t name .          # Build image
docker rmi image_id             # Remove image

# Containers
docker ps                       # List running
docker ps -a                    # List all
docker run -d -p 80:80 image    # Run detached
docker run -it image sh         # Run interactive
docker stop container           # Stop
docker start container          # Start
docker rm container             # Remove
docker logs -f container        # View logs
docker exec -it container sh    # Shell access

# Compose
docker compose up -d            # Start
docker compose down             # Stop
docker compose build            # Build
docker compose logs -f          # Logs
docker compose exec service cmd # Run command

# Cleanup
docker system prune             # Remove unused data
docker volume prune             # Remove unused volumes
docker image prune              # Remove unused images
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
docker run -p 3001:3000 my-app
```

### Permission Denied
```bash
# Fix Docker socket permissions
sudo chmod 666 /var/run/docker.sock

# Or add user to docker group
sudo usermod -aG docker $USER
```

### Container Exits Immediately
```bash
# Check logs
docker logs container_name

# Run interactive to debug
docker run -it --rm my-app sh
```

## Kesimpulan

Docker membuat development dan deployment menjadi:
- ✅ **Konsisten** - Same environment everywhere
- ✅ **Isolated** - No dependency conflicts
- ✅ **Portable** - Run on any machine
- ✅ **Scalable** - Easy to scale horizontally

Mulai dengan project kecil, pelajari step-by-step, dan gradually adopt Docker dalam workflow Anda. Di tahun 2026, Docker knowledge adalah **must-have skill** untuk developer modern.

Selamat containerizing! 🐳🚀
