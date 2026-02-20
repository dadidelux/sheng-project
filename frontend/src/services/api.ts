import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Targeting API
export const targetingApi = {
  getCoverage: () => api.get('/targeting/coverage'),
  getEfficiency: () => api.get('/targeting/efficiency'),
};

// Prediction API
export const predictionApi = {
  getQuestionnaire: () => api.get('/predict/questionnaire'),
  predictPoverty: (data: any) => api.post('/predict/poverty', data),
};

// Data Viewer API
export const dataViewerApi = {
  getPovertyData: (params: {
    page?: number;
    limit?: number;
    columns?: string[];
    filters?: Record<string, any>;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.columns?.length) queryParams.append('columns', params.columns.join(','));
    if (params.filters) queryParams.append('filters', JSON.stringify(params.filters));
    return api.get(`/data-viewer/poverty-data?${queryParams.toString()}`);
  },

  getPredictions: (params: {
    page?: number;
    limit?: number;
    columns?: string[];
    filters?: Record<string, any>;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.columns?.length) queryParams.append('columns', params.columns.join(','));
    if (params.filters) queryParams.append('filters', JSON.stringify(params.filters));
    return api.get(`/data-viewer/predictions?${queryParams.toString()}`);
  },

  getPovertyDataColumns: () => api.get('/data-viewer/poverty-data/columns'),
  getPredictionsColumns: () => api.get('/data-viewer/predictions/columns'),

  exportPovertyDataCsv: (params: {
    columns?: string[];
    filters?: Record<string, any>;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.columns?.length) queryParams.append('columns', params.columns.join(','));
    if (params.filters) queryParams.append('filters', JSON.stringify(params.filters));
    return `${API_BASE_URL}/data-viewer/poverty-data/export?${queryParams.toString()}`;
  },

  exportPredictionsCsv: (params: {
    columns?: string[];
    filters?: Record<string, any>;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.columns?.length) queryParams.append('columns', params.columns.join(','));
    if (params.filters) queryParams.append('filters', JSON.stringify(params.filters));
    return `${API_BASE_URL}/data-viewer/predictions/export?${queryParams.toString()}`;
  },
};
