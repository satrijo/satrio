#!/bin/sh
set -e

echo "🚀 Starting Nuxt application with content watcher..."

# Content directory (from volume mount)
CONTENT_DIR="/app/content"
DATA_DIR="/app/.data"

# Create data directory if not exists
mkdir -p "$DATA_DIR"

# Check if content directory exists
if [ -d "$CONTENT_DIR" ]; then
    echo "✅ Content directory found"
    
    # Count markdown files
    MD_COUNT=$(find "$CONTENT_DIR" -name "*.md" | wc -l)
    echo "📄 Found $MD_COUNT markdown files"
    
    # Remove old SQLite database to force rebuild
    if [ -f "$DATA_DIR/content.sqlite" ]; then
        echo "🗑️  Removing old database..."
        rm -f "$DATA_DIR/content.sqlite"
    fi
    
    echo "✅ Content ready - database will be rebuilt on first request"
else
    echo "⚠️  Content directory not found, using built-in content"
fi

# Function to trigger content reload
trigger_reload() {
    echo "🔄 Triggering content reload..."
    # Remove database to force rebuild on next request
    rm -f "$DATA_DIR/content.sqlite"
    # Make a request to trigger rebuild (use /blog page to trigger content build)
    curl -s http://localhost:3000/blog > /dev/null 2>&1 || true
    echo "✅ Content reload triggered"
}

# Start file watcher in background
(
    echo "👀 Starting content watcher..."
    
    # Store initial state
    LAST_MD5=$(find "$CONTENT_DIR" -name "*.md" -type f -exec md5sum {} \; 2>/dev/null | sort | md5sum | awk '{print $1}')
    
    while true; do
        sleep 5
        
        # Check current state
        CURRENT_MD5=$(find "$CONTENT_DIR" -name "*.md" -type f -exec md5sum {} \; 2>/dev/null | sort | md5sum | awk '{print $1}')
        
        if [ "$CURRENT_MD5" != "$LAST_MD5" ]; then
            echo "📄 Content changes detected!"
            LAST_MD5=$CURRENT_MD5
            
            # Count new files
            NEW_COUNT=$(find "$CONTENT_DIR" -name "*.md" | wc -l)
            echo "📄 New file count: $NEW_COUNT"
            
            # Trigger reload
            sleep 2  # Wait for file writes to complete
            trigger_reload
        fi
    done
) &

WATCHER_PID=$!
echo "👀 Content watcher started with PID: $WATCHER_PID"

# Execute the main command (Nuxt server)
echo "🚀 Starting Nuxt server..."
exec "$@"
