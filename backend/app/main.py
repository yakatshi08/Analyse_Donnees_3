"""
Main FastAPI application - Version minimale pour démarrer
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Créer l'application FastAPI
app = FastAPI(
    title="FinTech Analysis Platform API",
    description="API pour la plateforme d'analyse de données financières",
    version="1.0.0"
)

# Configuration CORS pour permettre les requêtes du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # URLs du frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route de santé
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

# Route racine
@app.get("/")
async def root():
    return {"message": "Welcome to FinTech Analysis Platform API"}

# Routes temporaires pour tester l'intégration
@app.get("/api/v1/dashboard/metrics")
async def get_dashboard_metrics():
    """Métriques pour le dashboard"""
    return {
        "npl_ratio": 2.8,
        "cet1_ratio": 15.5,
        "lcr": 142,
        "roe": 12.3
    }

@app.get("/api/v1/dashboard/risk-metrics")
async def get_risk_metrics():
    """Métriques de risque"""
    return {
        "portfolio_evolution": [
            {"month": "Jan", "performing": 4200, "doubtful": 180, "default": 120},
            {"month": "Fév", "performing": 4350, "doubtful": 165, "default": 115},
            {"month": "Mar", "performing": 4500, "doubtful": 150, "default": 110}
        ],
        "risk_indicators": [
            {"metric": "VaR 95%", "value": 85, "benchmark": 100},
            {"metric": "VaR 99%", "value": 110, "benchmark": 120}
        ]
    }

@app.get("/api/v1/datasets")
async def list_datasets():
    """Liste des datasets"""
    return [
        {
            "id": "ds-001",
            "name": "Portefeuille Crédit Q4 2024",
            "type": "credit_risk",
            "created_at": "2024-01-15T10:00:00",
            "rows": 15420,
            "columns": 48,
            "quality_score": 98,
            "is_validated": True
        },
        {
            "id": "ds-002",
            "name": "Données Liquidité Janvier",
            "type": "liquidity",
            "created_at": "2024-01-20T14:30:00",
            "rows": 8654,
            "columns": 32,
            "quality_score": 95,
            "is_validated": True
        }
    ]

# Point d'entrée pour l'inclusion des routes (à ajouter plus tard)
# from app.api.v1.api import api_router
# app.include_router(api_router, prefix="/api/v1")