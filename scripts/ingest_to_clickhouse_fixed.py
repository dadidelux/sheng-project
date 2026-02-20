import pandas as pd
import clickhouse_connect
import os
import sys

def create_clickhouse_table(client, table_name: str = 'dswd_roster'):
    """Create the ClickHouse table based on the CSV structure"""
    
    # Define the table schema based on the CSV columns
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

def clean_data_for_clickhouse(df):
    """Clean and prepare data for ClickHouse insertion"""
    
    # Replace NaN values with empty strings
    df = df.fillna('')
    
    # Convert all columns to string type to ensure compatibility
    for col in df.columns:
        df[col] = df[col].astype(str)
    
    # Remove any problematic characters that might cause issues
    df = df.replace(['\n', '\r', '\t'], ' ', regex=True)
    
    return df

def ingest_csv_data(client, csv_file_path: str, table_name: str = 'dswd_roster', batch_size: int = 5000):
    """Ingest CSV data into ClickHouse table in batches with improved error handling"""
    
    if not os.path.exists(csv_file_path):
        print(f"CSV file not found: {csv_file_path}")
        return False
    
    try:
        print(f"Reading CSV file: {csv_file_path}")
        
        # First, let's check the CSV structure
        sample_df = pd.read_csv(csv_file_path, nrows=5)
        print(f"CSV columns: {list(sample_df.columns)}")
        print(f"Sample data shape: {sample_df.shape}")
        
        # Read CSV in chunks to handle large files
        chunk_iter = pd.read_csv(csv_file_path, chunksize=batch_size, dtype=str)
        
        total_rows = 0
        for chunk_num, chunk in enumerate(chunk_iter):
            try:
                print(f"Processing chunk {chunk_num + 1}...")
                
                # Clean the data
                cleaned_chunk = clean_data_for_clickhouse(chunk)
                
                # Convert chunk to list of dictionaries for insertion
                records = cleaned_chunk.to_dict('records')
                
                print(f"Inserting {len(records)} rows...")
                
                # Insert the chunk
                client.insert(table_name, records)
                
                total_rows += len(records)
                print(f"✓ Inserted chunk {chunk_num + 1}: {len(records)} rows (Total: {total_rows})")
                
            except Exception as chunk_error:
                print(f"✗ Error processing chunk {chunk_num + 1}: {chunk_error}")
                print(f"Chunk data sample: {chunk.head(2).to_dict('records')}")
                continue
        
        print(f"Data ingestion completed! Total rows inserted: {total_rows}")
        return True
        
    except Exception as e:
        print(f"Error ingesting data: {e}")
        import traceback
        traceback.print_exc()
        return False

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
        
        # Test connection with a simple query
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
        
        # Ingest data
        print(f"Ingesting data from {csv_file_path}...")
        if ingest_csv_data(client, csv_file_path, table_name):
            print("Data ingestion completed successfully!")
            
            # Verify the data was inserted
            try:
                count_result = client.query(f"SELECT COUNT(*) as total_rows FROM {table_name}")
                print(f"Verification: Table now contains {count_result.result_rows[0][0]} rows")
            except Exception as e:
                print(f"Could not verify row count: {e}")
        else:
            print("Data ingestion failed!")
            
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













