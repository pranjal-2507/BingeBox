from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

# Initialize FastAPI app
app = FastAPI(
    title="BingeBox Backend API",
    description="Backend for the BingeBox AI-powered movie recommendation system",
    version="1.0.0"
)

# Configure CORS
# Allow frontend running on localhost:5173 (Vite default)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "BingeBox API"}

# Entry point for running the app directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.app:app", host="0.0.0.0", port=8000, reload=True)
