import pickle
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, LabelEncoder
import numpy as np

# Create a simple mock model that can make predictions
# This is temporary until the real model finishes training

# Create mock encoder for provinces
province_encoder = LabelEncoder()
province_encoder.classes_ = np.array(['MARINDUQUE', 'OCCIDENTAL MINDORO', 'ORIENTAL MINDORO', 'PALAWAN', 'ROMBLON'])

# Create mock scaler
scaler = StandardScaler()
scaler.mean_ = np.array([2.5, 1.5, 5.5, 1.2, 3.5, 0.7, 0.5, 0.3, 0.2])
scaler.scale_ = np.array([1.5, 0.5, 2.5, 0.8, 1.5, 0.5, 0.6, 0.5, 0.4])

# Create mock SVM
svm = SVC(kernel='linear', C=1.0, probability=True, random_state=42)

# Fit with dummy data to enable predictions
X_dummy = np.random.randn(100, 9)
y_dummy = np.random.randint(0, 2, 100)
svm.fit(X_dummy, y_dummy)

# Selected features
selected_features = [
    'province_name',
    'urb_rur',
    'no_of_indiv',
    'no_sleeping_rooms',
    'house_type',
    'has_electricity',
    'television',
    'ref',
    'motorcycle'
]

# Save mock model
model_data = {
    'model': svm,
    'scaler': scaler,
    'province_encoder': province_encoder,
    'features': selected_features,
    'accuracy': 0.87,  # Mock accuracy
    'version': 'svm_mock_v1.0'
}

with open('../backend/models/svm_poverty_predictor.pkl', 'wb') as f:
    pickle.dump(model_data, f)

print("Mock model created successfully!")
print("Model saved to backend/models/svm_poverty_predictor.pkl")
print("This is a temporary model for testing.")
print("The real model is still training in the background.")
