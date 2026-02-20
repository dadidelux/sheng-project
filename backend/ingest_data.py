import pandas as pd
import clickhouse_connect
import os

# ClickHouse connection
client = clickhouse_connect.get_client(
    host=os.getenv('CLICKHOUSE_HOST', 'localhost'),
    port=int(os.getenv('CLICKHOUSE_PORT', 8123)),
    username=os.getenv('CLICKHOUSE_USER', 'admin'),
    password=os.getenv('CLICKHOUSE_PASSWORD', 'admin123'),
    database=os.getenv('CLICKHOUSE_DB', 'poverty_db')
)

print("Loading CSV data...")
# Try different encodings
try:
    df = pd.read_csv('/data/L2_dec_roster.csv', encoding='utf-8')
except UnicodeDecodeError:
    try:
        df = pd.read_csv('/data/L2_dec_roster.csv', encoding='latin-1')
    except:
        df = pd.read_csv('/data/L2_dec_roster.csv', encoding='cp1252')

print(f"Loaded {len(df)} rows")

# Select only columns we need (MVP subset)
columns_to_keep = [
    'hh_id', 'region_name', 'province_name', 'city_name', 'barangay_name',
    'psgc_province', 'psgc_municipality', 'psgc_barangay', 'district',
    'urb_rur', 'purok_sitio', 'no_of_indiv', 'no_of_families',
    'no_sleeping_rooms', 'l_stay', 'house_type', 'roof_mat', 'out_wall',
    'toilet_facilities', 'has_electricity', 'water_supply',
    'radio', 'television', 'ref', 'motorcycle', 'phone', 'pc',
    'received_pppp', 'received_philhealth', 'received_scholarship',
    'received_livelihood', 'poverty_status', 'poverty_status2', 'poor'
]

df_subset = df[columns_to_keep].copy()

# Data cleaning and normalization
# Convert 1/2 (Yes/No) to 0/1 for binary fields
binary_fields = ['has_electricity', 'received_pppp', 'received_philhealth',
                 'received_scholarship', 'received_livelihood']

for field in binary_fields:
    if field in df_subset.columns:
        # 1 = Yes → 1, 2 = No → 0
        df_subset[field] = df_subset[field].apply(lambda x: 0 if x == 2 else 1)

# Handle missing values
df_subset = df_subset.fillna({
    'purok_sitio': '',
    'district': '',
    'poverty_status': '0 - Non Poor'
})

# Ensure correct data types
df_subset['psgc_province'] = df_subset['psgc_province'].astype('uint64')
df_subset['psgc_municipality'] = df_subset['psgc_municipality'].astype('uint64')
df_subset['psgc_barangay'] = df_subset['psgc_barangay'].astype('uint64')

print("Inserting data into ClickHouse...")

# Insert in batches
batch_size = 10000
for i in range(0, len(df_subset), batch_size):
    batch = df_subset.iloc[i:i+batch_size]
    client.insert_df('poverty_data', batch)
    print(f"Inserted {min(i+batch_size, len(df_subset))}/{len(df_subset)} rows")

print("Data ingestion complete!")

# Verify
row_count = client.query("SELECT COUNT(*) FROM poverty_data").result_rows[0][0]
print(f"Total rows in database: {row_count}")

# Show sample statistics
stats = client.query("""
    SELECT
        province_name,
        COUNT(*) as total_households,
        SUM(poor) as poor_count,
        SUM(received_pppp) as pppp_recipients
    FROM poverty_data
    GROUP BY province_name
    ORDER BY total_households DESC
""").result_rows

print("\nProvince Statistics:")
for row in stats:
    print(f"{row[0]}: {row[1]} households, {row[2]} poor, {row[3]} 4Ps recipients")
