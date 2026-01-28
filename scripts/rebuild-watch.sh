#!/bin/bash

# Auto-rebuild script for satrio.dev
# Run this script on the host to watch for rebuild triggers
# Usage: ./rebuild-watch.sh

set -e

APP_DIR="${APP_DIR:-/home/rio/apps/images/satrio}"
TRIGGER_FILE="/tmp/rebuild-trigger"
LOG_FILE="/var/log/satrio-rebuild.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

rebuild() {
    log "Starting rebuild..."
    
    cd "$APP_DIR"
    
    # Pull latest changes
    log "Pulling latest changes..."
    git pull origin main
    
    # Rebuild container
    log "Rebuilding container..."
    docker compose up -d --build
    
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
            
            # Small delay to ensure git push is complete
            sleep 5
            
            rebuild
        fi
    fi
    
    sleep 10
done
