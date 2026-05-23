"""
train.py
Train a Logistic Regression classifier on resume text data.
Saves model and vectorizer to ml/models/
"""

import os
import sys
import re
import string

import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.pipeline import Pipeline

# Add parent directory to path so we can import generate_data
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
sys.path.insert(0, parent_dir)


# ??? Paths ????????????????????????????????????????????????????????????????????

DATA_PATH = os.path.join(script_dir, 'data', 'resumes.csv')
MODELS_DIR = os.path.join(script_dir, 'models')
CLASSIFIER_PATH = os.path.join(MODELS_DIR, 'classifier.pkl')
VECTORIZER_PATH = os.path.join(MODELS_DIR, 'vectorizer.pkl')
LABELS_PATH = os.path.join(MODELS_DIR, 'label_classes.pkl')


# ??? Text preprocessing ???????????????????????????????????????????????????????

_STOP_WORDS_BASIC = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're",
    'your', 'yours', 'yourself', 'he', 'him', 'his', 'himself', 'she', "she's",
    'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them',
    'their', 'theirs', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll",
    'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
    'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of',
    'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
    'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then',
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both',
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will',
    'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o',
    're', 've', 'y', 'ain', "aren't", "couldn't", "didn't", "doesn't", "hadn't",
    "hasn't", "haven't", "isn't", "mightn't", "mustn't", "needn't", "shan't",
    "shouldn't", "wasn't", "weren't", "won't", "wouldn't",
}


def preprocess(text: str) -> str:
    """Preprocess resume text for TF-IDF."""
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    text = re.sub(r'\S+@\S+', ' ', text)
    text = text.translate(str.maketrans(string.punctuation, ' ' * len(string.punctuation)))
    text = re.sub(r'\d+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    words = [w for w in text.split() if w not in _STOP_WORDS_BASIC and len(w) > 1]
    return ' '.join(words)


def load_or_generate_data() -> pd.DataFrame:
    """Load CSV data or generate synthetic data if file doesn't exist."""
    if os.path.exists(DATA_PATH):
        print(f"  Loading data from {DATA_PATH}")
        df = pd.read_csv(DATA_PATH)
    else:
        print(f"  Data file not found. Generating synthetic data...")
        from ml.generate_data import generate_synthetic_data
        os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
        total = generate_synthetic_data(DATA_PATH, samples_per_category=50)
        print(f"  Generated {total} samples.")
        df = pd.read_csv(DATA_PATH)

    # Validate columns
    if 'Category' not in df.columns or 'Resume' not in df.columns:
        raise ValueError("CSV must have 'Category' and 'Resume' columns")

    df = df.dropna(subset=['Category', 'Resume'])
    df['Resume'] = df['Resume'].astype(str)
    df['Category'] = df['Category'].astype(str).str.strip()
    print(f"  Loaded {len(df)} samples across {df['Category'].nunique()} categories.")
    return df


def train():
    """Full training pipeline."""
    print("\n=== ResumeIQ AI -- ML Training Pipeline ===\n")

    # Ensure output directories exist
    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)

    # ?? Step 1: Load data ????????????????????????????????????????????????????
    print("[1/5] Loading data...")
    df = load_or_generate_data()

    # ?? Step 2: Preprocess ???????????????????????????????????????????????????
    print("[2/5] Preprocessing text...")
    df['clean_text'] = df['Resume'].apply(preprocess)
    X = df['clean_text'].values
    y = df['Category'].values

    # ?? Step 3: Train/test split ?????????????????????????????????????????????
    print("[3/5] Splitting dataset (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"  Train: {len(X_train)} | Test: {len(X_test)}")

    # ?? Step 4: TF-IDF + Logistic Regression ?????????????????????????????????
    print("[4/5] Training TF-IDF + LogisticRegression...")

    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=2,
        max_df=0.95,
    )
    classifier = LogisticRegression(
        max_iter=1000,
        C=1.0,
        solver='lbfgs',
        multi_class='auto',
        random_state=42,
    )

    # Fit vectorizer and transform
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Fit classifier
    classifier.fit(X_train_vec, y_train)

    # ?? Step 5: Evaluate ?????????????????????????????????????????????????????
    print("[5/5] Evaluating model...\n")
    y_pred = classifier.predict(X_test_vec)
    acc = accuracy_score(y_test, y_pred)
    print(f"  Accuracy: {acc * 100:.2f}%\n")
    print("  Classification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # ?? Save artifacts ????????????????????????????????????????????????????????
    print("  Saving model artifacts...")
    joblib.dump(vectorizer, VECTORIZER_PATH)
    joblib.dump(classifier, CLASSIFIER_PATH)
    joblib.dump(list(classifier.classes_), LABELS_PATH)

    print(f"\n[OK] Vectorizer saved -> {VECTORIZER_PATH}")
    print(f"[OK] Classifier saved -> {CLASSIFIER_PATH}")
    print(f"[OK] Label classes saved -> {LABELS_PATH}")
    print("\n=== Training Complete ===\n")

    return {
        'accuracy': acc,
        'train_size': len(X_train),
        'test_size': len(X_test),
        'num_categories': df['Category'].nunique(),
        'categories': sorted(df['Category'].unique().tolist()),
    }


if __name__ == '__main__':
    result = train()
    print(f"Final Accuracy: {result['accuracy']*100:.2f}%")
    print(f"Categories: {result['categories']}")
