#!/bin/sh
set -e

echo "🚀 Starting Nuxt application with content watcher..."

# Content directory (from volume mount)
CONTENT_DIR="/app/content"
DATA_DIR="/app/.data"

# Create data directory with correct permissions (run as root)
mkdir -p "$DATA_DIR"
mkdir -p "$DATA_DIR/content"

# Fix ownership for the data directory to match the nuxtjs user
chown -R nuxtjs:nodejs "$DATA_DIR"

# Check if content directory exists
if [ -d "$CONTENT_DIR" ]; then
    echo "✅ Content directory found"
    
    # Count markdown files
    MD_COUNT=$(find "$CONTENT_DIR" -name "*.md" | wc -l)
    echo "📄 Found $MD_COUNT markdown files"
    
    echo "✅ Content ready - database will be rebuilt on first request"
else
    echo "⚠️  Content directory not found, using built-in content"
fi

# Function to trigger content rebuild
# @nuxt/content v3 rebuilds database on first request after detecting changes
rebuild_content() {
    echo "🔄 Triggering content rebuild..."
    # Remove old database to force fresh build
    rm -f "$DATA_DIR/content/contents.sqlite"
    # Wait a moment for file system
    sleep 1
    echo "✅ Content rebuild triggered - access any page to build database"
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
            
            # Trigger content rebuild (database will be rebuilt on next request)
            sleep 2  # Wait for file writes to complete
            rebuild_content
        fi
    done
) &

WATCHER_PID=$!
echo "👀 Content watcher started with PID: $WATCHER_PID"

# Execute the main command (Nuxt server)
echo "🚀 Starting Nuxt server..."
exec "$@"
