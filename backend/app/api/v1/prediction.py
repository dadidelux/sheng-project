from fastapi import APIRouter
from app.models.schemas import PredictionRequest, PredictionResponse
from app.services import ml_service

router = APIRouter()

@router.post("/poverty", response_model=PredictionResponse)
def predict_poverty(request: PredictionRequest):
    """Predict poverty status"""
    result = ml_service.predict_poverty(request.dict())
    return result

@router.get("/questionnaire")
def get_questionnaire():
    """Get questionnaire fields"""
    return {
        "version": "mvp_v1.0",
        "total_fields": 9,
        "fields": [
            {"name": "province_name", "label": "Province", "type": "select",
             "options": ["MARINDUQUE", "PALAWAN", "OCCIDENTAL MINDORO", "ORIENTAL MINDORO", "ROMBLON"]},
            {"name": "urb_rur", "label": "Location Type", "type": "radio",
             "options": [{"value": 1, "label": "Urban"}, {"value": 2, "label": "Rural"}]},
            {"name": "no_of_indiv", "label": "Number of household members", "type": "number", "min": 1, "max": 20},
            {"name": "no_sleeping_rooms", "label": "Number of sleeping rooms", "type": "number", "min": 0, "max": 10},
            {"name": "house_type", "label": "House type (1=Strong, 6=Weak)", "type": "number", "min": 1, "max": 6},
            {"name": "has_electricity", "label": "Has electricity?", "type": "radio",
             "options": [{"value": 1, "label": "Yes"}, {"value": 0, "label": "No"}]},
            {"name": "television", "label": "Television", "type": "radio",
             "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}, {"value": 2, "label": "Non-functional"}]},
            {"name": "ref", "label": "Refrigerator", "type": "radio",
             "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}, {"value": 2, "label": "Non-functional"}]},
            {"name": "motorcycle", "label": "Motorcycle", "type": "radio",
             "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}, {"value": 2, "label": "Non-functional"}]}
        ]
    }
