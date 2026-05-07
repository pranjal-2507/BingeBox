# BingeBox

BingeBox is a state-of-the-art, AI-powered movie recommendation platform. Stop endlessly scrolling through streaming services and let our machine learning engine perfectly tailor movie suggestions to your unique mood and taste.

## Features

- **Advanced AI Recommendations:** Uses `CountVectorizer` and cosine similarity to match user queries and moods against thousands of movie keywords, cast members, and genres.
- **Smart Search Autocomplete:** Get instant movie suggestions as you type, powered by a fast Python backend.
- **TMDB Integration:** Fetches high-quality dynamic posters, precise ratings, and release dates directly from The Movie Database API.
- **Watchlist & Favorites:** Save movies for later. Fully persistent local storage integration ensures your lists are always waiting for you.
- **Mood & Genre Filtering:** Filter AI results instantly by specific genres or select quick "Moods" like *Spooky*, *Chill*, or *Mind-bending*.
- **Premium Netflix-Inspired UI:** A sleek, fully responsive dark mode interface built with React and Tailwind CSS, featuring glassmorphic components, smooth micro-animations, and skeleton loading states.

## Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios

**Backend:**
- Python & FastAPI
- Scikit-Learn (Machine Learning pipeline)
- Pandas & NumPy (Data Processing)
- Uvicorn

## Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites
- Node.js (v16+)
- Python 3.9+
- A TMDB API Key

### 1. Backend Setup (Machine Learning & API)

Navigate to the backend directory:
```bash
cd backend
```

Install the required Python dependencies:
```bash
pip install -r requirements.txt
```

*(Optional)* Train the ML Model:
If you have the raw Kaggle datasets, place them in `backend/datasets/` and run the preprocessing and training scripts to generate the `.pkl` models:
```bash
python scripts/preprocess.py
python scripts/train_model.py
```

Start the FastAPI server:
```bash
python -m app.app
```
*The backend API will now be running on `http://localhost:8000`.*

### 2. Frontend Setup (React App)

Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```

Install the NPM dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend application will now be running on `http://localhost:5173`.*

## Project Structure

```text
BingeBox/
├── backend/
│   ├── app/
│   │   ├── api/routes.py         # FastAPI endpoints
│   │   └── services/recommender.py # Core ML recommendation logic
│   ├── datasets/                 # Raw Kaggle CSV files (Ignored in Git)
│   ├── models/                   # Pickled ML models (Ignored in Git)
│   └── scripts/                  # Preprocessing & Training scripts
└── frontend/
    ├── src/
    │   ├── components/           # React UI Components
    │   ├── context/              # Global State (Watchlist/Favorites)
    │   ├── utils/tmdb.js         # TMDB API integration & Caching
    │   └── App.jsx               # Main Layout and Routing
    └── tailwind.config.js        # Design System Tokens
```
