from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

from app.schemas.financial import (
    DashboardData, 
    MarketDataResponse,
    BankingMetricResponse,
    RiskMetricResponse,
    KPIDataResponse
)

router = APIRouter()

@router.get("/", response_model=DashboardData)
async def get_dashboard_data():
    """
    Récupère toutes les données nécessaires pour le dashboard
    """
    # Simulation de données - À remplacer par des requêtes DB réelles
    
    # Données de marché
    market_data = []
    base_price = 116.0
    for i in range(10):
        date = datetime.now() - timedelta(days=9-i)
        market_data.append(MarketDataResponse(
            id=i+1,
            symbol="CAC40",
            date=date,
            open=base_price + random.uniform(-1, 1),
            high=base_price + random.uniform(0, 2),
            low=base_price + random.uniform(-2, 0),
            close=base_price + random.uniform(-1, 1),
            volume=random.randint(1000000, 2000000),
            created_at=datetime.now()
        ))
        base_price += random.uniform(-0.5, 1)
    
    # Métriques bancaires
    banking_metrics = [
        BankingMetricResponse(
            id=1,
            metric_name="NII",
            value=45.2,
            unit="M€",
            category="revenue",
            date=datetime.now(),
            metadata={"change": 3.4},
            created_at=datetime.now()
        ),
        BankingMetricResponse(
            id=2,
            metric_name="NSFR",
            value=118,
            unit="%",
            category="liquidity",
            date=datetime.now(),
            metadata={"minimum": 100},
            created_at=datetime.now()
        )
    ]
    
    # Métriques de risque
    risk_metrics = [
        RiskMetricResponse(
            id=1,
            risk_type="credit",
            risk_level=0.75,
            exposure=450000,
            var_95=-125000,
            cvar_95=-180000,
            date=datetime.now(),
            metadata={"category": "high"},
            created_at=datetime.now()
        )
    ]
    
    # KPIs
    kpis = [
        KPIDataResponse(
            id=1,
            kpi_name="CET1 Ratio",
            value="14.5%",
            target="> 13%",
            status="good",
            trend=0.3,
            date=datetime.now(),
            created_at=datetime.now()
        ),
        KPIDataResponse(
            id=2,
            kpi_name="LCR",
            value="135%",
            target="> 100%",
            status="good",
            trend=2.1,
            date=datetime.now(),
            created_at=datetime.now()
        ),
        KPIDataResponse(
            id=3,
            kpi_name="NPL Ratio",
            value="3.2%",
            target="< 5%",
            status="good",
            trend=-0.4,
            date=datetime.now(),
            created_at=datetime.now()
        ),
        KPIDataResponse(
            id=4,
            kpi_name="ROE",
            value="8.7%",
            target="> 10%",
            status="warning",
            trend=-0.8,
            date=datetime.now(),
            created_at=datetime.now()
        )
    ]
    
    return DashboardData(
        market_data=market_data,
        banking_metrics=banking_metrics,
        risk_metrics=risk_metrics,
        kpis=kpis,
        last_update=datetime.now()
    )

@router.get("/metrics/summary")
async def get_metrics_summary():
    """
    Récupère un résumé des métriques principales
    """
    return {
        "revenue_total": "€3.24M",
        "new_clients": 847,
        "retention_rate": "92.8%",
        "net_margin": "23.4%",
        "quarterly_growth": "29.6%"
    }

@router.get("/waterfall")
async def get_waterfall_data():
    """
    Récupère les données pour le graphique waterfall
    """
    return [
        {"name": "Revenu Q4 2023", "value": 2500000, "type": "initial"},
        {"name": "Nouveaux clients", "value": 450000, "type": "increase"},
        {"name": "Expansion clients", "value": 320000, "type": "increase"},
        {"name": "Churn", "value": -180000, "type": "decrease"},
        {"name": "Ajustements prix", "value": 150000, "type": "increase"},
        {"name": "Revenu Q1 2024", "value": 3240000, "type": "total"}
    ]

@router.get("/correlation")
async def get_correlation_data():
    """
    Récupère la matrice de corrélation
    """
    return {
        "assets": ["CAC 40", "S&P 500", "EUR/USD", "Gold", "Oil"],
        "matrix": [
            [1.00, 0.85, -0.60, 0.45, 0.72],
            [0.85, 1.00, -0.45, 0.38, 0.68],
            [-0.60, -0.45, 1.00, -0.35, -0.52],
            [0.45, 0.38, -0.35, 1.00, 0.42],
            [0.72, 0.68, -0.52, 0.42, 1.00]
        ]
    }