#!/bin/bash

# Auto-rebuild script for satrio.dev with zero downtime
# Build image first, then replace container

APP_DIR="${APP_DIR:-/home/rio/apps/images/satrio}"
TRIGGER_FILE="/tmp/rebuild-trigger"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

rebuild() {
    log "Starting zero-downtime rebuild..."
    
    cd "$APP_DIR" || exit 1
    
    # Pull latest changes
    log "Pulling latest changes..."
    git pull origin main
    
    # Build new image first (container masih jalan)
    log "Building new image..."
    docker compose build
    
    # Replace container dengan image baru
    log "Replacing container..."
    docker compose up -d --no-build
    
    # Cleanup old images
    log "Cleaning up..."
    docker image prune -f
    
    log "Rebuild complete!"
}

log "Watching for rebuild triggers..."
log "Trigger file: $TRIGGER_FILE"
log "App directory: $APP_DIR"

LAST_TRIGGER=""

while true; do
    if [ -f "$TRIGGER_FILE" ]; then
        CURRENT_TRIGGER=$(cat "$TRIGGER_FILE")
        
        if [ "$CURRENT_TRIGGER" != "$LAST_TRIGGER" ]; then
            log "Rebuild triggered!"
            LAST_TRIGGER="$CURRENT_TRIGGER"
            
            sleep 5
            rebuild
        fi
    fi
    
    sleep 10
done
