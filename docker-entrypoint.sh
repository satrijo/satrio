#!/bin/sh
set -e

# Script ini dijalankan setiap kali container start
# Memastikan content database selalu up-to-date dengan markdown files

echo "🔄 Checking content updates..."

# Content directory (from volume mount)
CONTENT_DIR="/app/content"
# Data directory (SQLite database location)
DATA_DIR="/app/.data"

# Create data directory if not exists
mkdir -p "$DATA_DIR"

# Check if content directory exists (mounted from host)
if [ -d "$CONTENT_DIR" ]; then
    echo "✅ Content directory found"
    
    # Count markdown files
    MD_COUNT=$(find "$CONTENT_DIR" -name "*.md" | wc -l)
    echo "📄 Found $MD_COUNT markdown files"
    
    # Remove old SQLite database to force rebuild
    # @nuxt/content will rebuild it on first request
    if [ -f "$DATA_DIR/content.sqlite" ]; then
        echo "🗑️  Removing old database..."
        rm -f "$DATA_DIR/content.sqlite"
    fi
    
    echo "✅ Content ready - database will be rebuilt on first request"
else
    echo "⚠️  Content directory not found, using built-in content"
fi

# Execute the main command
exec "$@"
