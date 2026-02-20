from fastapi import APIRouter
from typing import List
from app.models.schemas import CoverageMetrics, EfficiencyMetrics
from app.services import targeting_service

router = APIRouter()

@router.get("/coverage", response_model=List[CoverageMetrics])
def get_coverage():
    """Get 4Ps coverage metrics by province"""
    return targeting_service.get_coverage_by_province()

@router.get("/efficiency", response_model=List[EfficiencyMetrics])
def get_efficiency():
    """Get targeting efficiency metrics by province"""
    return targeting_service.get_efficiency_by_province()
