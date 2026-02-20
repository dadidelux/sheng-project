from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title="DSWD Poverty Analysis API",
    description="API for poverty targeting analysis and prediction",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.api_cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "DSWD Poverty Analysis API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Import routers
from app.api.v1 import targeting, prediction, data_viewer

app.include_router(targeting.router, prefix="/api/v1/targeting", tags=["Targeting Analysis"])
app.include_router(prediction.router, prefix="/api/v1/predict", tags=["Prediction"])
app.include_router(data_viewer.router, prefix="/api/v1/data-viewer", tags=["Data Viewer"])
