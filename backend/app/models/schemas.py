from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# Objective 1: Targeting Analysis
class CoverageMetrics(BaseModel):
    location: str
    province_name: str
    city_name: Optional[str] = None
    total_households: int
    total_poor: int
    poor_with_pppp: int
    coverage_rate: float
    unmet_need: int

class EfficiencyMetrics(BaseModel):
    location: str
    total_recipients: int
    poor_recipients: int
    nonpoor_recipients: int
    targeting_accuracy: float
    leakage_rate: float

# Objective 3: Prediction
class PredictionRequest(BaseModel):
    province_name: str
    urb_rur: int  # 1=Urban, 2=Rural
    no_of_indiv: int
    no_sleeping_rooms: int
    house_type: int  # 1-6
    has_electricity: int  # 0/1
    television: int  # 0/1/2
    ref: int  # 0/1/2
    motorcycle: int  # 0/1/2

class PredictionResponse(BaseModel):
    prediction_id: str
    predicted_status: int  # 0=Non-Poor, 1=Poor
    predicted_label: str
    probability: float
    probability_poor: float
    probability_nonpoor: float
    model_version: str
    recommendation: str

# Data Viewer
class DataTableRequest(BaseModel):
    page: int = 1
    limit: int = 100
    columns: Optional[List[str]] = None  # If None, return all columns
    filters: Optional[Dict[str, Any]] = None  # Dynamic filters

class DataTableResponse(BaseModel):
    data: List[Dict[str, Any]]
    total: int
    page: int
    limit: int
    total_pages: int

class ColumnInfo(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
