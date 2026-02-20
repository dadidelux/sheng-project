import pickle
import os

_model_cache = None

def load_svm_model():
    """Load SVM model (cached)"""
    global _model_cache

    if _model_cache is None:
        model_path = '/app/models/svm_poverty_predictor.pkl'
        with open(model_path, 'rb') as f:
            _model_cache = pickle.load(f)

    return _model_cache
