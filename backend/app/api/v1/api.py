from fastapi import APIRouter
from app.api.v1.endpoints import financial, banking, risk, dashboard, reports, credit_risk  # ✅ Ajout de credit_risk

api_router = APIRouter()

# Inclusion des différentes routes
api_router.include_router(
    financial.router,
    prefix="/financial",
    tags=["financial"]
)

api_router.include_router(
    banking.router,
    prefix="/banking",
    tags=["banking"]
)

api_router.include_router(
    risk.router,
    prefix="/risk",
    tags=["risk"]
)

api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["dashboard"]
)

# Route reports
api_router.include_router(
    reports.router,
    prefix="/reports",
    tags=["reports"]
)

# ✅ Ajout du router credit_risk
api_router.include_router(
    credit_risk.router,
    prefix="/credit-risk",
    tags=["credit-risk"]
)
