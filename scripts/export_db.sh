#!/bin/bash
# Export poverty_db from ClickHouse to compressed files
# Usage: ./scripts/export_db.sh

set -e

HOST=${CLICKHOUSE_HOST:-localhost}
PORT=${CLICKHOUSE_PORT:-8123}
USER=${CLICKHOUSE_USER:-admin}
PASS=${CLICKHOUSE_PASSWORD:-admin123}
DB=${CLICKHOUSE_DB:-poverty_db}

OUTPUT_DIR="./database/export"
mkdir -p "$OUTPUT_DIR"

echo "Exporting ClickHouse database: $DB"

# Export poverty_data table
echo "Exporting poverty_data..."
clickhouse-client \
  --host "$HOST" --port 9000 \
  --user "$USER" --password "$PASS" \
  --database "$DB" \
  --query "SELECT * FROM poverty_data FORMAT CSVWithNames" \
  | gzip > "$OUTPUT_DIR/poverty_data.csv.gz"

echo "Export complete: $OUTPUT_DIR/poverty_data.csv.gz"
echo "File size: $(du -h $OUTPUT_DIR/poverty_data.csv.gz | cut -f1)"
