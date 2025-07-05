from fastapi import FastAPI, Response
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from pathlib import Path

app = FastAPI(
    title="PI DatAnalyz API",
    version="1.0.0",
    openapi_url=f"{settings.api_v1_str}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.api_v1_str)

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to PI DatAnalyz API", "docs": "/docs"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Route pour le favicon
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    favicon_path = Path("static/favicon.ico")
    if favicon_path.exists():
        return FileResponse(favicon_path)
    return Response(content="", status_code=204)
