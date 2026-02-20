from app.database import get_clickhouse_client
from typing import List, Dict, Any, Optional
import math
import io

# Column definitions for poverty_data table
POVERTY_DATA_COLUMNS = {
    'hh_id': 'String',
    'region_name': 'String',
    'province_name': 'String',
    'city_name': 'String',
    'barangay_name': 'String',
    'urb_rur': 'UInt8',
    'no_of_indiv': 'UInt8',
    'no_of_families': 'UInt8',
    'no_sleeping_rooms': 'UInt8',
    'house_type': 'UInt8',
    'roof_mat': 'UInt8',
    'out_wall': 'UInt8',
    'toilet_facilities': 'UInt8',
    'has_electricity': 'UInt8',
    'water_supply': 'UInt8',
    'radio': 'UInt8',
    'television': 'UInt8',
    'ref': 'UInt8',
    'motorcycle': 'UInt8',
    'phone': 'UInt8',
    'pc': 'UInt8',
    'received_pppp': 'UInt8',
    'received_philhealth': 'UInt8',
    'received_scholarship': 'UInt8',
    'received_livelihood': 'UInt8',
    'poverty_status': 'String',
    'poverty_status2': 'UInt8',
    'poor': 'UInt8'
}

# Column definitions for poverty_predictions table
PREDICTIONS_COLUMNS = {
    'prediction_id': 'UUID',
    'prediction_date': 'DateTime',
    'province_name': 'String',
    'urb_rur': 'UInt8',
    'no_of_indiv': 'UInt8',
    'no_sleeping_rooms': 'UInt8',
    'house_type': 'UInt8',
    'has_electricity': 'UInt8',
    'television': 'UInt8',
    'ref': 'UInt8',
    'motorcycle': 'UInt8',
    'predicted_poverty_status': 'UInt8',
    'prediction_probability': 'Float32',
    'model_version': 'String'
}

def build_where_clause(filters: Optional[Dict[str, Any]]) -> str:
    """Build SQL WHERE clause from filters"""
    if not filters:
        return ""

    conditions = []
    for key, value in filters.items():
        if value is None or value == "":
            continue

        # Handle different filter types
        if isinstance(value, dict):
            # Range filter: {'min': 10, 'max': 20}
            if 'min' in value and value['min'] is not None:
                conditions.append(f"{key} >= {value['min']}")
            if 'max' in value and value['max'] is not None:
                conditions.append(f"{key} <= {value['max']}")
        elif isinstance(value, list):
            # IN filter: ['value1', 'value2']
            if value:
                values_str = "', '".join(str(v) for v in value)
                conditions.append(f"{key} IN ('{values_str}')")
        elif isinstance(value, str):
            # String contains filter
            conditions.append(f"{key} LIKE '%{value}%'")
        else:
            # Exact match
            if isinstance(value, str):
                conditions.append(f"{key} = '{value}'")
            else:
                conditions.append(f"{key} = {value}")

    if conditions:
        return " WHERE " + " AND ".join(conditions)
    return ""

def get_poverty_data(
    page: int = 1,
    limit: int = 100,
    columns: Optional[List[str]] = None,
    filters: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Get paginated poverty data"""
    client = get_clickhouse_client()

    # Determine columns to select
    if columns:
        # Validate requested columns
        valid_columns = [col for col in columns if col in POVERTY_DATA_COLUMNS]
        if not valid_columns:
            valid_columns = list(POVERTY_DATA_COLUMNS.keys())[:15]  # Default to first 15
        select_columns = ', '.join(valid_columns)
    else:
        # Default columns
        default_cols = ['hh_id', 'province_name', 'city_name', 'barangay_name', 'urb_rur',
                       'no_of_indiv', 'no_sleeping_rooms', 'house_type', 'has_electricity',
                       'television', 'ref', 'motorcycle', 'poverty_status', 'poor']
        select_columns = ', '.join(default_cols)
        valid_columns = default_cols

    # Build WHERE clause
    where_clause = build_where_clause(filters)

    # Get total count
    count_query = f"SELECT COUNT(*) FROM poverty_data{where_clause}"
    count_result = client.query(count_query)
    total = count_result.result_rows[0][0]

    # Calculate pagination
    offset = (page - 1) * limit
    total_pages = math.ceil(total / limit) if limit > 0 else 0

    # Get data
    data_query = f"""
        SELECT {select_columns}
        FROM poverty_data
        {where_clause}
        ORDER BY province_name, city_name, hh_id
        LIMIT {limit} OFFSET {offset}
    """

    result = client.query(data_query)
    rows = result.result_rows

    # Convert to list of dicts
    data = []
    for row in rows:
        row_dict = {}
        for idx, col_name in enumerate(valid_columns):
            row_dict[col_name] = row[idx]
        data.append(row_dict)

    return {
        'data': data,
        'total': total,
        'page': page,
        'limit': limit,
        'total_pages': total_pages
    }

def get_predictions_data(
    page: int = 1,
    limit: int = 100,
    columns: Optional[List[str]] = None,
    filters: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Get paginated predictions data"""
    client = get_clickhouse_client()

    # Determine columns to select
    if columns:
        valid_columns = [col for col in columns if col in PREDICTIONS_COLUMNS]
        if not valid_columns:
            valid_columns = list(PREDICTIONS_COLUMNS.keys())
        select_columns = ', '.join(valid_columns)
    else:
        # All columns by default
        select_columns = ', '.join(PREDICTIONS_COLUMNS.keys())
        valid_columns = list(PREDICTIONS_COLUMNS.keys())

    # Build WHERE clause
    where_clause = build_where_clause(filters)

    # Get total count
    count_query = f"SELECT COUNT(*) FROM poverty_predictions{where_clause}"
    count_result = client.query(count_query)
    total = count_result.result_rows[0][0]

    # Calculate pagination
    offset = (page - 1) * limit
    total_pages = math.ceil(total / limit) if limit > 0 else 0

    # Get data
    data_query = f"""
        SELECT {select_columns}
        FROM poverty_predictions
        {where_clause}
        ORDER BY prediction_date DESC
        LIMIT {limit} OFFSET {offset}
    """

    result = client.query(data_query)
    rows = result.result_rows

    # Convert to list of dicts
    data = []
    for row in rows:
        row_dict = {}
        for idx, col_name in enumerate(valid_columns):
            value = row[idx]
            # Convert UUID and DateTime to string for JSON serialization
            if isinstance(value, (bytes,)):
                value = str(value)
            row_dict[col_name] = value
        data.append(row_dict)

    return {
        'data': data,
        'total': total,
        'page': page,
        'limit': limit,
        'total_pages': total_pages
    }

def get_available_columns(table_name: str) -> List[Dict[str, str]]:
    """Get available columns for a table"""
    if table_name == 'poverty_data':
        columns = POVERTY_DATA_COLUMNS
    elif table_name == 'poverty_predictions':
        columns = PREDICTIONS_COLUMNS
    else:
        return []

    return [
        {'name': name, 'type': col_type}
        for name, col_type in columns.items()
    ]

def generate_csv_export(
    table_name: str,
    columns: Optional[List[str]] = None,
    filters: Optional[Dict[str, Any]] = None
) -> str:
    """Generate CSV export for data with filters"""
    client = get_clickhouse_client()

    # Determine which table and columns
    if table_name == 'poverty_data':
        available_columns = POVERTY_DATA_COLUMNS
        order_by = "province_name, city_name, hh_id"
    elif table_name == 'poverty_predictions':
        available_columns = PREDICTIONS_COLUMNS
        order_by = "prediction_date DESC"
    else:
        return ""

    # Validate and select columns
    if columns:
        valid_columns = [col for col in columns if col in available_columns]
        if not valid_columns:
            valid_columns = list(available_columns.keys())
    else:
        valid_columns = list(available_columns.keys())

    select_columns = ', '.join(valid_columns)

    # Build WHERE clause
    where_clause = build_where_clause(filters)

    # Query data
    query = f"""
        SELECT {select_columns}
        FROM {table_name}
        {where_clause}
        ORDER BY {order_by}
        LIMIT 100000
    """

    result = client.query(query)
    rows = result.result_rows

    # Generate CSV
    output = io.StringIO()

    # Write header
    output.write(','.join(valid_columns) + '\n')

    # Write data
    for row in rows:
        # Escape commas and quotes in data
        escaped_row = []
        for value in row:
            value_str = str(value) if value is not None else ''
            # If value contains comma or quote, wrap in quotes and escape quotes
            if ',' in value_str or '"' in value_str or '\n' in value_str:
                value_str = '"' + value_str.replace('"', '""') + '"'
            escaped_row.append(value_str)
        output.write(','.join(escaped_row) + '\n')

    csv_content = output.getvalue()
    output.close()

    return csv_content
