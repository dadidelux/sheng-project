#!/bin/bash
# Restore poverty_db into ClickHouse from exported files
# Usage: ./scripts/restore_db.sh
# Run this on a new device after: docker-compose up -d

set -e

HOST=${CLICKHOUSE_HOST:-localhost}
PORT=${CLICKHOUSE_PORT:-9000}
USER=${CLICKHOUSE_USER:-admin}
PASS=${CLICKHOUSE_PASSWORD:-admin123}
DB=${CLICKHOUSE_DB:-poverty_db}

EXPORT_DIR="./database/export"

if [ ! -f "$EXPORT_DIR/poverty_data.csv.gz" ]; then
  echo "Error: $EXPORT_DIR/poverty_data.csv.gz not found."
  echo "Get the export file and place it in $EXPORT_DIR, then re-run."
  exit 1
fi

echo "Waiting for ClickHouse to be ready..."
until clickhouse-client --host "$HOST" --port "$PORT" --user "$USER" --password "$PASS" --query "SELECT 1" > /dev/null 2>&1; do
  sleep 2
done

echo "Applying schema..."
clickhouse-client --host "$HOST" --port "$PORT" --user "$USER" --password "$PASS" < ./database/init/01_create_tables.sql

echo "Restoring poverty_data..."
gunzip -c "$EXPORT_DIR/poverty_data.csv.gz" | clickhouse-client \
  --host "$HOST" --port "$PORT" \
  --user "$USER" --password "$PASS" \
  --database "$DB" \
  --query "INSERT INTO poverty_data FORMAT CSVWithNames"

ROW_COUNT=$(clickhouse-client --host "$HOST" --port "$PORT" --user "$USER" --password "$PASS" \
  --database "$DB" --query "SELECT COUNT(*) FROM poverty_data")

echo "Restore complete. Rows in poverty_data: $ROW_COUNT"
