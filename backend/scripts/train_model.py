import os
import pandas as pd
import ast
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def safe_literal_eval(val):
    if isinstance(val, list):
        return val
    try:
        return ast.literal_eval(val)
    except:
        return []

def preprocess_for_ml(df: pd.DataFrame) -> pd.DataFrame:
    """Prepares the tags column by combining genres, keywords, cast, and crew."""
    print("Engineering features...")
    
    for col in ['overview', 'genres', 'keywords', 'cast', 'crew']:
        df[col] = df[col].apply(safe_literal_eval)

    def collapse(L):
        return [str(i).replace(" ", "") for i in L]

    df['cast'] = df['cast'].apply(collapse)
    df['crew'] = df['crew'].apply(collapse)
    df['genres'] = df['genres'].apply(collapse)
    df['keywords'] = df['keywords'].apply(collapse)

    df['tags'] = df['overview'] + df['genres'] + df['keywords'] + df['cast'] + df['crew']
    df['tags'] = df['tags'].apply(lambda x: " ".join(x).lower())
    
    new_df = df[['movie_id', 'title', 'tags', 'genres']].copy()
    
    return new_df

def train_and_save(base_dir: str):
    input_path = os.path.join(base_dir, 'datasets', 'cleaned_movies.csv')
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Run preprocess.py first.")
        return

    print("Loading cleaned dataset...")
    df = pd.read_csv(input_path)
    
    new_df = preprocess_for_ml(df)
    
    print("Training Count Vectorizer...")
    from sklearn.feature_extraction.text import CountVectorizer
    vectorizer = CountVectorizer(max_features=5000, stop_words='english')
    count_matrix = vectorizer.fit_transform(new_df['tags'])
    
    print("Calculating full Cosine Similarity Matrix...")
    similarity_matrix = cosine_similarity(count_matrix)

    print("Saving models to disk...")
    with open(os.path.join(models_dir, 'movies_dict.pkl'), 'wb') as f:
        pickle.dump(new_df.to_dict(), f)
        
    with open(os.path.join(models_dir, 'similarity.pkl'), 'wb') as f:
        pickle.dump(similarity_matrix, f)

    with open(os.path.join(models_dir, 'vectorizer.pkl'), 'wb') as f:
        pickle.dump(vectorizer, f)
        
    with open(os.path.join(models_dir, 'count_matrix.pkl'), 'wb') as f:
        pickle.dump(count_matrix, f)

    print("Training complete! Models saved in backend/models/")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    train_and_save(base_dir)
