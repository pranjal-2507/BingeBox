import os
import pandas as pd
import json

def load_data(movies_path: str, credits_path: str) -> pd.DataFrame:
    """Loads the movies and credits datasets."""
    print("Loading datasets...")
    movies = pd.read_csv(movies_path)
    credits = pd.read_csv(credits_path)
    return movies, credits

def merge_datasets(movies: pd.DataFrame, credits: pd.DataFrame) -> pd.DataFrame:
    """Merges the two datasets on the 'title' column."""
    print("Merging datasets...")
    movies = movies.merge(credits, on='title')
    return movies

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Filters columns, removes nulls and duplicates."""
    print("Cleaning data...")
    columns_to_keep = ['movie_id', 'title', 'overview', 'genres', 'keywords', 'cast', 'crew']
    df = df[columns_to_keep]
    
    initial_shape = df.shape[0]
    df.dropna(inplace=True)
    print(f"Removed {initial_shape - df.shape[0]} rows with null values.")
    
    initial_shape = df.shape[0]
    df.drop_duplicates(inplace=True)
    print(f"Removed {initial_shape - df.shape[0]} duplicate rows.")
    
    return df

def extract_names(obj_str: str) -> list:
    """Helper to extract names from JSON string representation."""
    try:
        items = json.loads(obj_str.replace("'", '"'))
        return [i['name'] for i in items]
    except Exception:
        return []

def preprocess_json_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    (Optional/Bonus) Preprocesses JSON-like string columns into lists of names.
    This makes the dataset much cleaner for ML.
    """
    print("Preprocessing JSON-like columns...")
    
    import ast
    def convert(text):
        try:
            return [i['name'] for i in ast.literal_eval(text)]
        except:
            return []
            
    def convert_cast(text):
        try:
            L = []
            for i in ast.literal_eval(text):
                if len(L) < 3:
                    L.append(i['name'])
                else:
                    break
            return L
        except:
            return []
            
    def fetch_director(text):
        try:
            for i in ast.literal_eval(text):
                if i['job'] == 'Director':
                    return [i['name']]
            return []
        except:
            return []

    df['genres'] = df['genres'].apply(convert)
    df['keywords'] = df['keywords'].apply(convert)
    df['cast'] = df['cast'].apply(convert_cast)
    df['crew'] = df['crew'].apply(fetch_director)
    
    df['overview'] = df['overview'].apply(lambda x: x.split() if isinstance(x, str) else [])
    
    return df

def save_cleaned_data(df: pd.DataFrame, output_path: str):
    """Saves the cleaned dataset to CSV."""
    print(f"Saving cleaned dataset to {output_path}...")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print("Dataset saved successfully.")

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    movies_path = os.path.join(base_dir, 'datasets', 'tmdb_5000_movies.csv', 'tmdb_5000_movies.csv')
    credits_path = os.path.join(base_dir, 'datasets', 'tmdb_5000_credits.csv', 'tmdb_5000_credits.csv')
    output_path = os.path.join(base_dir, 'datasets', 'cleaned_movies.csv')
    
    if not os.path.exists(movies_path):
        movies_path = os.path.join(base_dir, 'datasets', 'tmdb_5000_movies.csv')
    if not os.path.exists(credits_path):
        credits_path = os.path.join(base_dir, 'datasets', 'tmdb_5000_credits.csv')

    if not os.path.exists(movies_path) or not os.path.exists(credits_path):
        print(f"Error: Datasets not found at {movies_path} or {credits_path}")
        return

    movies, credits = load_data(movies_path, credits_path)
    merged_df = merge_datasets(movies, credits)
    cleaned_df = clean_data(merged_df)
    cleaned_df = preprocess_json_columns(cleaned_df)
    save_cleaned_data(cleaned_df, output_path)

if __name__ == '__main__':
    main()
