from fastapi import APIRouter, Query
from app.services.recommender import recommender

router = APIRouter()

@router.get("/recommend")
async def get_recommendations(
    q: str = Query(..., description="The user's query or mood"), 
    limit: int = 5,
    genre: str = Query(None, description="Optional genre to filter by")
):
    """
    Endpoint to get movie recommendations based on a user query.
    """
    results = recommender.get_recommendations(query=q, limit=limit, genre=genre)
    return {
        "query": q,
        "genre": genre,
        "recommendations": results
    }

@router.get("/autocomplete")
async def get_autocomplete(
    q: str = Query(..., description="The user's search query"), 
    limit: int = 5
):
    """
    Endpoint to get search autocomplete suggestions.
    """
    results = recommender.get_autocomplete(query=q, limit=limit)
    return {
        "query": q,
        "suggestions": results
    }
