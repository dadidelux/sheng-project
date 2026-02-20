import pandas as pd
import pickle
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

print("Loading data...")
# Try different encodings
try:
    df = pd.read_csv('../data/L2_dec_roster.csv', encoding='utf-8')
except UnicodeDecodeError:
    try:
        df = pd.read_csv('../data/L2_dec_roster.csv', encoding='latin-1')
    except:
        df = pd.read_csv('../data/L2_dec_roster.csv', encoding='cp1252')

# MVP Features (simplified)
selected_features = [
    'province_name',  # Categorical
    'urb_rur',
    'no_of_indiv',
    'no_sleeping_rooms',
    'house_type',
    'has_electricity',
    'television',
    'ref',
    'motorcycle'
]

# Prepare data
X = df[selected_features].copy()
y = df['poverty_status2']

# Encode province_name
province_encoder = LabelEncoder()
X['province_name_encoded'] = province_encoder.fit_transform(X['province_name'])
X = X.drop('province_name', axis=1)

# Normalize binary fields
binary_cols = ['has_electricity']
for col in binary_cols:
    if col in X.columns:
        X[col] = X[col].apply(lambda x: 0 if x == 2 else 1)

# Handle missing values
X = X.fillna(0)

print(f"Dataset: {len(X)} samples, {len(X.columns)} features")
print(f"Poverty rate: {y.mean():.2%}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\nTraining SVM model...")
# Use Linear kernel for MVP (faster training)
svm = SVC(kernel='linear', C=1.0, probability=True, random_state=42)
svm.fit(X_train_scaled, y_train)

# Evaluate
y_pred = svm.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n✅ Model Accuracy: {accuracy:.2%}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Non-Poor', 'Poor']))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Save model
model_data = {
    'model': svm,
    'scaler': scaler,
    'province_encoder': province_encoder,
    'features': selected_features,
    'accuracy': accuracy,
    'version': 'svm_mvp_v1.0'
}

with open('../backend/models/svm_poverty_predictor.pkl', 'wb') as f:
    pickle.dump(model_data, f)

print("\n✅ Model saved to backend/models/svm_poverty_predictor.pkl")
