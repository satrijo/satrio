#!/bin/sh
set -e

echo "🚀 Starting Nuxt application with PostgreSQL sync..."

# Content directory
CONTENT_DIR="/app/content"

# Function to sync articles
sync_articles() {
    echo "🔄 Syncing articles to PostgreSQL..."
    node /app/scripts/sync-articles.js
    echo "✅ Sync completed"
}

# Initial sync on startup
echo "📄 Initial sync..."
sync_articles

# Start file watcher in background
(
    echo "👀 Starting content watcher..."
    
    LAST_MD5=$(find "$CONTENT_DIR" -name "*.md" -type f -exec md5sum {} \; 2>/dev/null | sort | md5sum | awk '{print $1}')
    
    while true; do
        sleep 5
        
        CURRENT_MD5=$(find "$CONTENT_DIR" -name "*.md" -type f -exec md5sum {} \; 2>/dev/null | sort | md5sum | awk '{print $1}')
        
        if [ "$CURRENT_MD5" != "$LAST_MD5" ]; then
            echo "📄 Content changes detected!"
            LAST_MD5=$CURRENT_MD5
            sleep 2
            sync_articles
        fi
    done
) &

echo "👀 Content watcher started"

# Start Nuxt
echo "🚀 Starting Nuxt server..."
exec "$@"
