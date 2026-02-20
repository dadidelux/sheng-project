# DSWD Poverty Analysis Dashboard

Web application for analyzing poverty data and predicting household poverty status in MIMAROPA region.

## Project Structure

```
sheng_data/
├── backend/          # FastAPI backend API
├── frontend/         # React/TypeScript frontend
├── database/         # ClickHouse init scripts
├── scripts/          # Utility & ingestion scripts
├── docs/             # Documentation & notebooks
├── docker-compose.yml
├── requirements.txt  # Python dependencies
└── README.md
```

## Quick Start

```bash
docker-compose up -d
```

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Features

1. **Analytics Dashboard** - Coverage & efficiency charts
2. **Prediction Tool** - 9-question poverty assessment
3. **Data Viewer** - Browse 584,562 household records

## Train ML Model

```bash
cd scripts
python train_svm.py
docker-compose restart backend
```

## Documentation

- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [MVP Checklist](docs/MVP_CHECKLIST.md)
- [Progress Report](docs/PROGRESS_REPORT.md)
- [Daily Metrics Guide](docs/README_daily_metrics.md)
