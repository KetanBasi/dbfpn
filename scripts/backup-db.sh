#!/bin/bash

# Database Backup Script
# Loads DATABASE_URL from .env and creates a timestamped backup

set -e

# Load .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not found in .env"
    exit 1
fi

# Create backups directory if it doesn't exist
mkdir -p backups

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/backup_${TIMESTAMP}.sql"

echo "Creating database backup..."
echo "Backup file: $BACKUP_FILE"

# Run pg_dump
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

# Check if backup was successful
if [ -s "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup created successfully! Size: $SIZE"
else
    echo "⚠️ Warning: Backup file is empty"
    rm "$BACKUP_FILE"
    exit 1
fi
