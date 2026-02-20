import numpy as np
import uuid
from app.ml.model_loader import load_svm_model

def predict_poverty(input_data: dict):
    """Predict poverty status"""
    model_data = load_svm_model()

    # Encode province
    province_encoded = model_data['province_encoder'].transform([input_data['province_name']])[0]

    # Prepare features
    # Order must match training: province_encoded, urb_rur, no_of_indiv, etc.
    features = np.array([[
        province_encoded,
        input_data['urb_rur'],
        input_data['no_of_indiv'],
        input_data['no_sleeping_rooms'],
        input_data['house_type'],
        input_data['has_electricity'],
        input_data['television'],
        input_data['ref'],
        input_data['motorcycle']
    ]])

    # Scale
    features_scaled = model_data['scaler'].transform(features)

    # Predict
    prediction = model_data['model'].predict(features_scaled)[0]
    probabilities = model_data['model'].predict_proba(features_scaled)[0]

    # Convert prediction to integer for indexing
    pred_idx = int(prediction)

    # Format response
    return {
        'prediction_id': str(uuid.uuid4()),
        'predicted_status': pred_idx,
        'predicted_label': 'Poor' if pred_idx == 1 else 'Non-Poor',
        'probability': float(probabilities[pred_idx]),
        'probability_poor': float(probabilities[1]),
        'probability_nonpoor': float(probabilities[0]),
        'model_version': model_data['version'],
        'recommendation': 'Eligible for 4Ps program' if pred_idx == 1 else 'Not eligible for 4Ps'
    }
