"""
PI BICARS - Backend API
Finance & Insurance Analytics Platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn

# 🔧 Correction probable des imports dynamiques
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import des routers
from app.routers import import_router, copilot_router, credit_risk_router, analytics_ml_router  # AJOUT analytics_ml_router

# Configuration de l'application
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 PI BICARS Backend démarrage...")
    yield
    # Shutdown
    print("🛑 PI BICARS Backend arrêt...")

# Création de l'application FastAPI
app = FastAPI(
    title="PI BICARS API",
    description="API pour la plateforme d'analyse financière et d'assurance",
    version="1.0.0",
    lifespan=lifespan
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routers
app.include_router(import_router.router)
app.include_router(copilot_router.router)
app.include_router(credit_risk_router.router)
app.include_router(analytics_ml_router.router)  # AJOUT du nouveau module Analytics ML

# Route de santé
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "PI BICARS Backend",
        "version": "1.0.0"
    }

# Route racine
@app.get("/")
async def root():
    return {
        "message": "Bienvenue sur PI BICARS API",
        "documentation": "/docs",
        "health": "/health"
    }

# Endpoints d'exemple pour les données du dashboard
@app.get("/api/dashboard/kpis")
async def get_dashboard_kpis():
    """Retourne les KPIs pour le dashboard"""
    return {
        "general": [
            {
                "id": "revenue",
                "name": "Chiffre d'affaires",
                "value": "€3.24M",
                "change": "+29.6%",
                "status": "up"
            },
            {
                "id": "active_users",
                "name": "Utilisateurs actifs",
                "value": "3,540",
                "change": "+3.4%",
                "status": "up"
            }
        ],
        "banking": [
            {
                "id": "cet1",
                "name": "CET1 Ratio",
                "value": "14.8%",
                "threshold": ">10.5%",
                "status": "healthy"
            },
            {
                "id": "lcr",
                "name": "LCR",
                "value": "125.5%",
                "threshold": ">100%",
                "status": "healthy"
            }
        ],
        "insurance": [
            {
                "id": "scr",
                "name": "SCR Ratio",
                "value": "168%",
                "threshold": ">100%",
                "status": "healthy"
            },
            {
                "id": "combined",
                "name": "Combined Ratio",
                "value": "94.5%",
                "threshold": "<100%",
                "status": "healthy"
            }
        ]
    }

@app.get("/api/dashboard/charts")
async def get_dashboard_charts():
    """Retourne les données pour les graphiques"""
    return {
        "quarterly": [
            {"quarter": "Q1 2024", "revenues": 120, "costs": 85, "profit": 35},
            {"quarter": "Q2 2024", "revenues": 150, "costs": 92, "profit": 58},
            {"quarter": "Q3 2024", "revenues": 180, "costs": 98, "profit": 82},
            {"quarter": "Q4 2024", "revenues": 200, "costs": 110, "profit": 90}
        ],
        "performance": [
            {"metric": "Revenus", "value": 100},
            {"metric": "Coûts", "value": 75},
            {"metric": "Profit", "value": 92},
            {"metric": "Clients", "value": 85},
            {"metric": "Satisfaction", "value": 88}
        ]
    }

# Point d'entrée pour le développement
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )