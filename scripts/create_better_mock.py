import pickle
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, LabelEncoder
import numpy as np

print("Creating improved mock model...")

# Create mock encoder for provinces
province_encoder = LabelEncoder()
province_encoder.classes_ = np.array(['MARINDUQUE', 'OCCIDENTAL MINDORO', 'ORIENTAL MINDORO', 'PALAWAN', 'ROMBLON'])

# Create mock scaler with realistic parameters
scaler = StandardScaler()
# These should match the feature order after encoding
scaler.mean_ = np.array([2.0, 1.6, 5.2, 1.5, 3.8, 0.6, 0.4, 0.25, 0.15])
scaler.scale_ = np.array([1.2, 0.5, 2.2, 0.9, 1.6, 0.49, 0.58, 0.48, 0.38])
scaler.n_features_in_ = 9
scaler.n_samples_seen_ = 1000

# Create and train a proper mock SVM with realistic data
np.random.seed(42)

# Generate realistic-looking training data
# Features: province_encoded, urb_rur, no_of_indiv, no_sleeping_rooms, house_type, has_electricity, television, ref, motorcycle
n_samples = 1000

# Poor households: more people, fewer rooms, worse house, fewer assets
X_poor = np.column_stack([
    np.random.randint(0, 5, n_samples//2),  # province
    np.random.choice([1, 2], n_samples//2, p=[0.3, 0.7]),  # more rural
    np.random.randint(5, 10, n_samples//2),  # larger families
    np.random.randint(1, 2, n_samples//2),  # fewer rooms
    np.random.randint(4, 7, n_samples//2),  # worse house
    np.random.choice([0, 1], n_samples//2, p=[0.6, 0.4]),  # less electricity
    np.random.choice([0, 1, 2], n_samples//2, p=[0.7, 0.2, 0.1]),  # less TV
    np.random.choice([0, 1, 2], n_samples//2, p=[0.8, 0.15, 0.05]),  # less ref
    np.random.choice([0, 1, 2], n_samples//2, p=[0.9, 0.08, 0.02]),  # less motorcycle
])

# Non-poor households: fewer people, more rooms, better house, more assets
X_nonpoor = np.column_stack([
    np.random.randint(0, 5, n_samples//2),  # province
    np.random.choice([1, 2], n_samples//2, p=[0.6, 0.4]),  # more urban
    np.random.randint(2, 6, n_samples//2),  # smaller families
    np.random.randint(2, 4, n_samples//2),  # more rooms
    np.random.randint(1, 4, n_samples//2),  # better house
    np.random.choice([0, 1], n_samples//2, p=[0.2, 0.8]),  # more electricity
    np.random.choice([0, 1, 2], n_samples//2, p=[0.3, 0.6, 0.1]),  # more TV
    np.random.choice([0, 1, 2], n_samples//2, p=[0.4, 0.5, 0.1]),  # more ref
    np.random.choice([0, 1, 2], n_samples//2, p=[0.6, 0.35, 0.05]),  # more motorcycle
])

X_train = np.vstack([X_poor, X_nonpoor])
y_train = np.concatenate([np.ones(n_samples//2), np.zeros(n_samples//2)])

# Shuffle
shuffle_idx = np.random.permutation(n_samples)
X_train = X_train[shuffle_idx]
y_train = y_train[shuffle_idx]

# Scale the data
X_train_scaled = scaler.transform(X_train)

# Train SVM
print("Training mock SVM...")
svm = SVC(kernel='linear', C=1.0, probability=True, random_state=42)
svm.fit(X_train_scaled, y_train)

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
    'accuracy': 0.85,  # Mock accuracy
    'version': 'svm_mock_v2.0'
}

with open('../backend/models/svm_poverty_predictor.pkl', 'wb') as f:
    pickle.dump(model_data, f)

print("Improved mock model created successfully!")
print("Model saved to backend/models/svm_poverty_predictor.pkl")
print("")
print("Test prediction:")
# Test with a sample poor household
test_input = np.array([[2, 2, 7, 1, 5, 0, 0, 0, 0]])  # Should predict poor
test_scaled = scaler.transform(test_input)
pred = svm.predict(test_scaled)[0]
prob = svm.predict_proba(test_scaled)[0]
print(f"  Sample input (poor household): {test_input[0]}")
print(f"  Prediction: {pred} (1=Poor, 0=Non-Poor)")
print(f"  Probabilities: Non-Poor={prob[0]:.2f}, Poor={prob[1]:.2f}")
