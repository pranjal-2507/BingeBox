import os
import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

class MovieRecommender:
    def __init__(self):
        self.is_ready = False
        self.movies_df = None
        self.similarity_matrix = None
        self.vectorizer = None
        self.count_matrix = None
        self.load_models()
        
    def load_models(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        models_dir = os.path.join(base_dir, 'models')
        
        try:
            with open(os.path.join(models_dir, 'movies_dict.pkl'), 'rb') as f:
                movies_dict = pickle.load(f)
                self.movies_df = pd.DataFrame(movies_dict)
            
            with open(os.path.join(models_dir, 'similarity.pkl'), 'rb') as f:
                self.similarity_matrix = pickle.load(f)
                
            with open(os.path.join(models_dir, 'vectorizer.pkl'), 'rb') as f:
                self.vectorizer = pickle.load(f)
                
            with open(os.path.join(models_dir, 'count_matrix.pkl'), 'rb') as f:
                self.count_matrix = pickle.load(f)
                
            self.is_ready = True
            print("ML Models loaded successfully.")
        except Exception as e:
            print(f"Warning: Could not load ML models. {e}")
            print("Run 'python scripts/train_model.py' first.")

    def get_autocomplete(self, query: str, limit: int = 5):
        if not self.is_ready or not query:
            return []
        
        matches = self.movies_df[self.movies_df['title'].str.contains(query, case=False, na=False)]
        results = matches.head(limit)['title'].tolist()
        return results

    def get_recommendations(self, query: str, limit: int = 5, genre: str = None):
        if not self.is_ready:
            return [{"error": "ML Models not loaded. Please train the model first."}]

        matches = self.movies_df[self.movies_df['title'].str.lower() == query.lower()]
        
        if not matches.empty:
            movie_idx = matches.index[0]
            matched_title = self.movies_df.iloc[movie_idx]['title']
            distances = self.similarity_matrix[movie_idx]
            movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])
            
            recommendations = []
            for i in movies_list:
                idx = i[0]
                movie_row = self.movies_df.iloc[idx]
                
                if genre and genre.lower() != 'all':
                    if genre.lower().replace(" ", "") not in movie_row['tags']:
                        continue

                similarity_score = round(i[1] * 100, 1)
                
                if idx == movie_idx:
                    explanation = "Exact match for your search."
                else:
                    explanation = f"Recommended because you searched for '{matched_title}'."

                recommendations.append({
                    "id": int(movie_row['movie_id']),
                    "title": movie_row['title'],
                    "match": similarity_score,
                    "year": 2024,
                    "explanation": explanation
                })
                
                if len(recommendations) >= limit:
                    break
                    
            return recommendations
            
        else:
            query_vector = self.vectorizer.transform([query.lower()])
            cosine_similarities = cosine_similarity(query_vector, self.count_matrix).flatten()
            related_docs_indices = cosine_similarities.argsort()[::-1]
            
            recommendations = []
            for idx in related_docs_indices:
                similarity_score = round(cosine_similarities[idx] * 100, 1)
                movie_row = self.movies_df.iloc[idx]
                
                if similarity_score > 0:
                    if genre and genre.lower() != 'all':
                        if genre.lower().replace(" ", "") not in movie_row['tags']:
                            continue
                            
                    recommendations.append({
                        "id": int(movie_row['movie_id']),
                        "title": movie_row['title'],
                        "match": similarity_score,
                        "year": 2024,
                        "explanation": "Strongly matches your mood and keywords."
                    })
                    
                    if len(recommendations) >= limit:
                        break
                        
            return recommendations

recommender = MovieRecommender()
