from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from typing import List, Optional, Dict, Any
from app.models.schemas import DataTableResponse, ColumnInfo
from app.services import data_service
import json
from datetime import datetime

router = APIRouter()

@router.get("/poverty-data", response_model=DataTableResponse)
def get_poverty_data(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=1000),
    columns: Optional[str] = Query(None),  # Comma-separated list
    filters: Optional[str] = Query(None)  # JSON string
):
    """Get paginated poverty data with optional filtering and column selection"""

    # Parse columns
    column_list = None
    if columns:
        column_list = [c.strip() for c in columns.split(',')]

    # Parse filters
    filter_dict = None
    if filters:
        try:
            filter_dict = json.loads(filters)
        except json.JSONDecodeError:
            filter_dict = None

    result = data_service.get_poverty_data(
        page=page,
        limit=limit,
        columns=column_list,
        filters=filter_dict
    )

    return result

@router.get("/predictions", response_model=DataTableResponse)
def get_predictions_data(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=1000),
    columns: Optional[str] = Query(None),
    filters: Optional[str] = Query(None)
):
    """Get paginated predictions data with optional filtering and column selection"""

    # Parse columns
    column_list = None
    if columns:
        column_list = [c.strip() for c in columns.split(',')]

    # Parse filters
    filter_dict = None
    if filters:
        try:
            filter_dict = json.loads(filters)
        except json.JSONDecodeError:
            filter_dict = None

    result = data_service.get_predictions_data(
        page=page,
        limit=limit,
        columns=column_list,
        filters=filter_dict
    )

    return result

@router.get("/poverty-data/columns", response_model=List[ColumnInfo])
def get_poverty_data_columns():
    """Get available columns for poverty data table"""
    return data_service.get_available_columns('poverty_data')

@router.get("/predictions/columns", response_model=List[ColumnInfo])
def get_predictions_columns():
    """Get available columns for predictions table"""
    return data_service.get_available_columns('poverty_predictions')

@router.get("/poverty-data/export")
def export_poverty_data_csv(
    columns: Optional[str] = Query(None),
    filters: Optional[str] = Query(None)
):
    """Export poverty data as CSV with current filters"""

    # Parse columns
    column_list = None
    if columns:
        column_list = [c.strip() for c in columns.split(',')]

    # Parse filters
    filter_dict = None
    if filters:
        try:
            filter_dict = json.loads(filters)
        except json.JSONDecodeError:
            filter_dict = None

    csv_content = data_service.generate_csv_export(
        table_name='poverty_data',
        columns=column_list,
        filters=filter_dict
    )

    # Generate filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"poverty_data_{timestamp}.csv"

    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/predictions/export")
def export_predictions_csv(
    columns: Optional[str] = Query(None),
    filters: Optional[str] = Query(None)
):
    """Export predictions data as CSV with current filters"""

    # Parse columns
    column_list = None
    if columns:
        column_list = [c.strip() for c in columns.split(',')]

    # Parse filters
    filter_dict = None
    if filters:
        try:
            filter_dict = json.loads(filters)
        except json.JSONDecodeError:
            filter_dict = None

    csv_content = data_service.generate_csv_export(
        table_name='poverty_predictions',
        columns=column_list,
        filters=filter_dict
    )

    # Generate filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"predictions_{timestamp}.csv"

    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
