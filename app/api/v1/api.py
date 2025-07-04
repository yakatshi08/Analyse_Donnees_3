from fastapi import APIRouter
from app.api.v1.endpoints import financial, banking, risk, dashboard

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