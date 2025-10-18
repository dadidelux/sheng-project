import pandas as pd
import clickhouse_connect
import os
import sys
import chardet
import numpy as np

def detect_encoding(file_path):
    """Detect the encoding of a file"""
    with open(file_path, 'rb') as f:
        raw_data = f.read(10000)  # Read first 10KB to detect encoding
        result = chardet.detect(raw_data)
        encoding = result['encoding']
        confidence = result['confidence']
        print(f"Detected encoding: {encoding} (confidence: {confidence:.2f})")
        return encoding

def create_clickhouse_table(client, table_name: str = 'dswd_roster'):
    """Create the ClickHouse table based on the CSV structure"""
    
    create_table_sql = f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
        region_name String,
        psgc_province String,
        psgc_municipality String,
        province_name String,
        city_name String,
        barangay_name String,
        psgc_barangay String,
        district String,
        urb_rur String,
        purok_sitio String,
        street_address String,
        n_hh String,
        telephone String,
        l_stay String,
        no_sleeping_rooms String,
        house_type String,
        roof_mat String,
        out_wall String,
        tenure_status String,
        has_other_property String,
        location_of_property String,
        toilet_facilities String,
        has_electricity String,
        water_supply String,
        radio String,
        television String,
        video String,
        stereo String,
        ref String,
        wash_mach String,
        aircon String,
        sala_set String,
        dining String,
        car_jeep String,
        phone String,
        pc String,
        microwave String,
        motorcycle String,
        experienced_displacement String,
        displacement_manmade String,
        displacement_armed String,
        displacement_dev_project String,
        displacement_other String,
        received_programs String,
        received_scholarship String,
        received_day_care String,
        received_feeding String,
        received_rice String,
        received_philhealth String,
        received_livelihood String,
        received_housing String,
        received_microedit String,
        received_self_employment String,
        received_pppp String,
        received_cash_transfer String,
        received_other String,
        is_indigenous String,
        indigenous_group String,
        respondent String,
        type_of_household_id String,
        server String,
        hh_id String,
        poverty_status2 String,
        no_of_indiv String,
        no_of_families String,
        indigenous String,
        archive String,
        poor String,
        poverty_status String
    ) ENGINE = MergeTree()
    ORDER BY (psgc_province, psgc_municipality, psgc_barangay)
    """
    
    try:
        client.command(create_table_sql)
        print(f"Table '{table_name}' created successfully!")
        return True
    except Exception as e:
        print(f"Error creating table: {e}")
        return False

def load_and_clean_csv(csv_file_path: str):
    """Load CSV into Pandas and apply data cleaning"""
    
    print(f"Loading CSV file: {csv_file_path}")
    
    # Detect encoding
    encoding = detect_encoding(csv_file_path)
    
    # Try different encodings
    encodings_to_try = [encoding, 'latin-1', 'cp1252', 'iso-8859-1', 'utf-8-sig']
    
    for enc in encodings_to_try:
        try:
            print(f"Trying encoding: {enc}")
            
            # Load the entire CSV into Pandas
            df = pd.read_csv(csv_file_path, encoding=enc, low_memory=False)
            print(f"Successfully loaded with encoding: {enc}")
            print(f"Original data shape: {df.shape}")
            print(f"Columns: {list(df.columns)}")
            
            # Apply data cleaning
            df_cleaned = clean_dataframe(df)
            
            return df_cleaned
            
        except UnicodeDecodeError as e:
            print(f"Failed with encoding {enc}: {e}")
            continue
        except Exception as e:
            print(f"Error with encoding {enc}: {e}")
            continue
    
    print("All encodings failed!")
    return None

def clean_dataframe(df):
    """Apply comprehensive data cleaning to the dataframe"""
    
    print("Applying data cleaning...")
    
    # Make a copy to avoid modifying original
    df_clean = df.copy()
    
    # 1. Handle missing values
    print("Handling missing values...")
    df_clean = df_clean.fillna('')
    
    # 2. Convert all columns to string type
    print("Converting all columns to string type...")
    for col in df_clean.columns:
        df_clean[col] = df_clean[col].astype(str)
    
    # 3. Clean problematic characters
    print("Cleaning problematic characters...")
    df_clean = df_clean.replace(['\n', '\r', '\t'], ' ', regex=True)
    
    # 4. Remove any extremely long strings that might cause issues
    print("Truncating extremely long strings...")
    max_length = 1000  # Reasonable max length for ClickHouse String columns
    for col in df_clean.columns:
        df_clean[col] = df_clean[col].str.slice(0, max_length)
    
    # 5. Handle special characters that might cause issues
    print("Handling special characters...")
    # Replace any null bytes or other problematic characters
    df_clean = df_clean.replace('\x00', '', regex=True)
    
    # 6. Ensure no empty strings become None
    df_clean = df_clean.replace('', ' ')
    
    print(f"Cleaned data shape: {df_clean.shape}")
    
    # Show sample of cleaned data
    print("Sample of cleaned data:")
    print(df_clean.head(2).to_dict('records'))
    
    return df_clean

def ingest_dataframe_to_clickhouse(client, df, table_name: str, batch_size: int = 5000):
    """Ingest cleaned dataframe into ClickHouse in batches"""
    
    print(f"Ingesting {len(df)} rows to ClickHouse...")
    
    total_rows = 0
    total_batches = (len(df) + batch_size - 1) // batch_size
    
    for batch_num in range(total_batches):
        start_idx = batch_num * batch_size
        end_idx = min((batch_num + 1) * batch_size, len(df))
        
        try:
            print(f"Processing batch {batch_num + 1}/{total_batches} (rows {start_idx}-{end_idx})")
            
            # Get the batch
            batch_df = df.iloc[start_idx:end_idx]
            
            # Ensure we have data
            if batch_df.empty:
                print(f"Batch {batch_num + 1} is empty, skipping...")
                continue
            
            # Convert to list of lists instead of dict records for ClickHouse
            print(f"Converting batch data to ClickHouse format...")
            batch_data = batch_df.values.tolist()
            column_names = list(batch_df.columns)
            
            # Validate data consistency
            if not batch_data:
                print(f"Batch {batch_num + 1} has no data after conversion, skipping...")
                continue
                
            if len(batch_data[0]) != len(column_names):
                print(f"Column count mismatch: {len(column_names)} columns, {len(batch_data[0])} values")
                continue
            
            print(f"Inserting {len(batch_data)} rows with {len(column_names)} columns...")
            
            # Insert the batch using column names
            insert_result = client.insert(table_name, batch_data, column_names=column_names)
            print(f"Insert result: {insert_result}")
            
            total_rows += len(batch_data)
            print(f"Inserted batch {batch_num + 1}: {len(batch_data)} rows (Total: {total_rows})")
            
            # Verify the insertion
            try:
                count_result = client.query(f"SELECT COUNT(*) as total_rows FROM {table_name}")
                current_count = count_result.result_rows[0][0]
                print(f"Current table count: {current_count}")
            except Exception as e:
                print(f"Could not verify count: {e}")
                
        except Exception as batch_error:
            print(f"Error processing batch {batch_num + 1}: {batch_error}")
            print(f"Batch data sample: {batch_df.head(2).values.tolist()}")
            import traceback
            traceback.print_exc()
            continue
    
    print(f"Data ingestion completed! Total rows inserted: {total_rows}")
    return total_rows

def main():
    """Main function to run the data ingestion"""
    
    # ClickHouse connection parameters
    host = '67.217.58.19'
    port = 8123
    username = 'default'
    password = ''
    database = 'analyst'
    
    # CSV file path
    csv_file_path = 'data/L2_dec_roster.csv'
    table_name = 'dswd_roster'
    
    try:
        # Connect to ClickHouse
        print("Connecting to ClickHouse...")
        client = clickhouse_connect.get_client(
            host=host,
            port=port,
            username=username,
            password=password,
            database=database
        )
        print("Connected to ClickHouse successfully!")
        
        # Test connection
        try:
            result = client.query("SELECT 1 as test")
            print("Connection test successful!")
        except Exception as e:
            print(f"Connection test failed: {e}")
            return
        
        # Create table
        print(f"Creating table '{table_name}'...")
        if not create_clickhouse_table(client, table_name):
            print("Failed to create table. Exiting.")
            return
        
        # Load and clean data in Pandas
        df_cleaned = load_and_clean_csv(csv_file_path)
        if df_cleaned is None:
            print("Failed to load and clean CSV data. Exiting.")
            return
        
        # Ingest to ClickHouse
        print(f"Ingesting data to ClickHouse...")
        rows_inserted = ingest_dataframe_to_clickhouse(client, df_cleaned, table_name)
        
        if rows_inserted > 0:
            print("Data ingestion completed successfully!")
            
            # Final verification
            try:
                count_result = client.query(f"SELECT COUNT(*) as total_rows FROM {table_name}")
                final_count = count_result.result_rows[0][0]
                print(f"Final verification: Table contains {final_count} rows")
            except Exception as e:
                print(f"Could not verify final row count: {e}")
        else:
            print("Data ingestion failed - no rows were inserted!")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        print("Please check your ClickHouse connection parameters and try again.")
    
    finally:
        if 'client' in locals():
            client.close()
            print("ClickHouse connection closed.")

if __name__ == "__main__":
    main()













