"""
Router FastAPI pour le module Credit Risk
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

from app.services.credit_risk_service import (
    CreditRiskService, 
    RatingClass, 
    StressScenario,
    CreditExposure
)

router = APIRouter(
    prefix="/api/credit-risk",
    tags=["credit-risk"],
    responses={404: {"description": "Not found"}},
)

# Modèles Pydantic
class PDRequest(BaseModel):
    """Requête pour le calcul de PD"""
    rating: str
    horizon_months: Optional[int] = 12
    scenario: Optional[str] = "baseline"

class LGDRequest(BaseModel):
    """Requête pour le calcul de LGD"""
    exposure_amount: float
    collateral_value: float
    collateral_type: Optional[str] = "unsecured"
    scenario: Optional[str] = "baseline"

class EADRequest(BaseModel):
    """Requête pour le calcul d'EAD"""
    drawn_amount: float
    undrawn_amount: float
    ccf: Optional[float] = 0.75
    product_type: Optional[str] = "loan"

class ECLRequest(BaseModel):
    """Requête pour le calcul d'ECL"""
    pd: float
    lgd: float
    ead: float

class PortfolioExposure(BaseModel):
    """Exposition dans le portefeuille"""
    exposure_id: str
    borrower_id: str
    exposure_amount: float
    drawn_amount: float
    undrawn_amount: Optional[float] = 0
    rating: str
    collateral_value: Optional[float] = 0
    collateral_type: Optional[str] = "unsecured"
    sector: Optional[str] = "other"
    country: Optional[str] = "FR"
    maturity_months: Optional[int] = 12

class StressTestRequest(BaseModel):
    """Requête de stress test"""
    portfolio: List[PortfolioExposure]
    scenarios: Optional[List[str]] = ["baseline", "adverse", "severe"]

# Instance du service
credit_risk_service = CreditRiskService()

@router.get("/health")
async def health_check():
    """Vérification de santé du module Credit Risk"""
    return {
        'status': 'healthy',
        'module': 'credit_risk',
        'version': '1.0.0',
        'models': ['PD', 'LGD', 'EAD', 'ECL'],
        'scenarios': ['baseline', 'adverse', 'severe']
    }

@router.post("/calculate/pd")
async def calculate_pd(request: PDRequest):
    """
    Calcule la Probability of Default
    
    Exemple:
    - Rating: "BBB"
    - Horizon: 12 mois
    - Scénario: "baseline"
    """
    try:
        rating = RatingClass[request.rating.upper()]
        scenario = StressScenario[request.scenario.upper()]
        
        pd = await credit_risk_service.calculate_pd(
            rating=rating,
            horizon=request.horizon_months,
            scenario=scenario
        )
        
        return {
            'rating': request.rating,
            'horizon_months': request.horizon_months,
            'scenario': request.scenario,
            'pd': pd,
            'pd_percentage': round(pd * 100, 2),
            'interpretation': _interpret_pd(pd)
        }
        
    except KeyError:
        raise HTTPException(status_code=400, detail="Rating ou scénario invalide")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate/lgd")
async def calculate_lgd(request: LGDRequest):
    """
    Calcule la Loss Given Default
    """
    try:
        scenario = StressScenario[request.scenario.upper()]
        
        lgd = await credit_risk_service.calculate_lgd(
            exposure_amount=request.exposure_amount,
            collateral_value=request.collateral_value,
            collateral_type=request.collateral_type,
            scenario=scenario
        )
        
        recovery_rate = 1 - lgd
        
        return {
            'exposure_amount': request.exposure_amount,
            'collateral_value': request.collateral_value,
            'collateral_type': request.collateral_type,
            'scenario': request.scenario,
            'lgd': lgd,
            'lgd_percentage': round(lgd * 100, 2),
            'recovery_rate': round(recovery_rate * 100, 2),
            'coverage_ratio': round(request.collateral_value / request.exposure_amount * 100, 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate/ead")
async def calculate_ead(request: EADRequest):
    """
    Calcule l'Exposure at Default
    """
    try:
        ead = await credit_risk_service.calculate_ead(
            drawn_amount=request.drawn_amount,
            undrawn_amount=request.undrawn_amount,
            ccf=request.ccf,
            product_type=request.product_type
        )
        
        utilization_rate = request.drawn_amount / (request.drawn_amount + request.undrawn_amount) * 100
        
        return {
            'drawn_amount': request.drawn_amount,
            'undrawn_amount': request.undrawn_amount,
            'ccf': request.ccf,
            'product_type': request.product_type,
            'ead': ead,
            'utilization_rate': round(utilization_rate, 2),
            'undrawn_exposure': round(request.ccf * request.undrawn_amount, 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate/ecl")
async def calculate_ecl(request: ECLRequest):
    """
    Calcule l'Expected Credit Loss (ECL)
    """
    try:
        ecl_data = await credit_risk_service.calculate_expected_loss(
            pd=request.pd,
            lgd=request.lgd,
            ead=request.ead
        )
        
        return {
            'inputs': {
                'pd': request.pd,
                'lgd': request.lgd,
                'ead': request.ead
            },
            'results': ecl_data,
            'ifrs9_stage': ecl_data['stage'],
            'interpretation': _interpret_ecl(ecl_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate/full-assessment")
async def calculate_full_assessment(exposure: PortfolioExposure):
    """
    Calcul complet pour une exposition : PD, LGD, EAD et ECL
    """
    try:
        # Calculs
        rating = RatingClass[exposure.rating.upper()]
        
        pd = await credit_risk_service.calculate_pd(rating, exposure.maturity_months)
        lgd = await credit_risk_service.calculate_lgd(
            exposure.exposure_amount,
            exposure.collateral_value,
            exposure.collateral_type
        )
        ead = await credit_risk_service.calculate_ead(
            exposure.drawn_amount,
            exposure.undrawn_amount
        )
        ecl_data = await credit_risk_service.calculate_expected_loss(pd, lgd, ead)
        
        return {
            'exposure': exposure.dict(),
            'risk_metrics': {
                'pd': pd,
                'lgd': lgd,
                'ead': ead,
                'ecl_12_months': ecl_data['ecl_12_months'],
                'ecl_lifetime': ecl_data['ecl_lifetime'],
                'ifrs9_stage': ecl_data['stage']
            },
            'percentages': {
                'pd_percentage': round(pd * 100, 2),
                'lgd_percentage': round(lgd * 100, 2),
                'provision_rate': ecl_data['provision_rate']
            },
            'risk_rating': _calculate_risk_rating(pd, lgd),
            'recommendations': _generate_exposure_recommendations(exposure, ecl_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stress-test")
async def run_stress_test(request: StressTestRequest):
    """
    Exécute un stress test sur un portefeuille
    """
    try:
        # Conversion des expositions
        portfolio = []
        for exp in request.portfolio:
            portfolio.append(exp.dict())
        
        # Conversion des scénarios
        scenarios = [StressScenario[s.upper()] for s in request.scenarios]
        
        # Exécution du stress test
        results = await credit_risk_service.run_stress_test(portfolio, scenarios)
        
        return {
            'summary': {
                'portfolio_size': results['portfolio_size'],
                'scenarios_tested': request.scenarios,
                'execution_time': datetime.now().isoformat()
            },
            'results': results['scenarios'],
            'comparison': results['comparison'],
            'recommendations': results['recommendations'],
            'visualizations': _generate_stress_test_charts(results)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rating-migration")
async def analyze_rating_migration(portfolio: List[PortfolioExposure], time_period: int = 12):
    """
    Analyse la migration des ratings
    """
    try:
        # Conversion du portefeuille
        portfolio_data = [exp.dict() for exp in portfolio]
        
        # Génération de la matrice
        migration_data = await credit_risk_service.generate_rating_migration_matrix(
            portfolio_data, 
            time_period
        )
        
        return {
            'period_months': time_period,
            'matrix': migration_data['matrix'],
            'portfolio_analysis': migration_data['portfolio_migrations'],
            'stability_index': migration_data['stability_index'],
            'visualization': _generate_migration_heatmap(migration_data['matrix'])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/portfolio/upload")
async def upload_portfolio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Upload d'un portefeuille pour analyse
    """
    try:
        # Validation du type de fichier
        if not file.filename.endswith(('.csv', '.xlsx')):
            raise HTTPException(
                status_code=400,
                detail="Format de fichier non supporté. Utilisez CSV ou Excel."
            )
        
        # Sauvegarde temporaire
        file_location = f"uploads/credit_risk_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        
        with open(file_location, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Traitement en arrière-plan
        background_tasks.add_task(process_portfolio_file, file_location)
        
        return {
            'filename': file.filename,
            'status': 'uploaded',
            'message': 'Fichier uploadé avec succès. L\'analyse est en cours.',
            'job_id': file_location.split('/')[-1]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/templates")
async def get_templates():
    """
    Retourne les templates pour l'import de données
    """
    return {
        'portfolio_template': {
            'columns': [
                'exposure_id',
                'borrower_id',
                'exposure_amount',
                'drawn_amount',
                'undrawn_amount',
                'rating',
                'collateral_value',
                'collateral_type',
                'sector',
                'country',
                'maturity_months'
            ],
            'example': {
                'exposure_id': 'EXP001',
                'borrower_id': 'BRW001',
                'exposure_amount': 1000000,
                'drawn_amount': 800000,
                'undrawn_amount': 200000,
                'rating': 'BBB',
                'collateral_value': 500000,
                'collateral_type': 'real_estate',
                'sector': 'retail',
                'country': 'FR',
                'maturity_months': 36
            }
        },
        'ratings': ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'],
        'collateral_types': ['unsecured', 'real_estate', 'financial', 'guarantee', 'other'],
        'sectors': ['retail', 'corporate', 'real_estate', 'financial', 'other']
    }

# Fonctions helper
def _interpret_pd(pd: float) -> str:
    """Interprète le niveau de PD"""
    if pd < 0.01:
        return "Très faible risque"
    elif pd < 0.05:
        return "Risque faible"
    elif pd < 0.10:
        return "Risque modéré"
    elif pd < 0.20:
        return "Risque élevé"
    else:
        return "Risque très élevé"

def _interpret_ecl(ecl_data: Dict) -> str:
    """Interprète les résultats ECL"""
    stage = ecl_data['stage']
    if stage == 1:
        return "Exposition performante - Provision sur 12 mois"
    elif stage == 2:
        return "Augmentation significative du risque - Provision lifetime"
    else:
        return "Exposition en défaut - Provision totale"

def _calculate_risk_rating(pd: float, lgd: float) -> str:
    """Calcule un rating de risque global"""
    risk_score = pd * lgd
    if risk_score < 0.005:
        return "AAA"
    elif risk_score < 0.01:
        return "AA"
    elif risk_score < 0.02:
        return "A"
    elif risk_score < 0.05:
        return "BBB"
    elif risk_score < 0.10:
        return "BB"
    else:
        return "B ou moins"

def _generate_exposure_recommendations(exposure: PortfolioExposure, ecl_data: Dict) -> List[str]:
    """Génère des recommandations pour une exposition"""
    recommendations = []
    
    if ecl_data['stage'] >= 2:
        recommendations.append("🔍 Surveillance renforcée recommandée")
    
    if exposure.collateral_value < exposure.exposure_amount * 0.5:
        recommendations.append("🛡️ Envisager des garanties supplémentaires")
    
    if ecl_data['provision_rate'] > 10:
        recommendations.append("⚠️ Niveau de provision élevé - Revoir les conditions")
    
    return recommendations

def _generate_stress_test_charts(results: Dict) -> Dict:
    """Génère les configurations de graphiques pour le stress test"""
    return {
        'ecl_by_scenario': {
            'type': 'bar_chart',
            'title': 'ECL par scénario',
            'data': [
                {
                    'scenario': scenario,
                    'ecl': data.get('total_ecl', 0),
                    'ecl_rate': data.get('ecl_rate', 0)
                }
                for scenario, data in results['scenarios'].items()
            ]
        },
        'capital_impact': {
            'type': 'waterfall_chart',
            'title': 'Impact sur le capital',
            'baseline': results['scenarios'].get('baseline', {}).get('capital_impact', 0),
            'changes': results['comparison']
        }
    }

def _generate_migration_heatmap(matrix: Dict) -> Dict:
    """Génère une heatmap pour la matrice de migration"""
    return {
        'type': 'heatmap',
        'title': 'Matrice de migration des ratings',
        'x_labels': list(matrix.keys()),
        'y_labels': list(matrix.keys()),
        'data': matrix,
        'color_scale': 'Blues'
    }

async def process_portfolio_file(file_location: str):
    """Traite un fichier de portefeuille en arrière-plan"""
    # Implémentation du traitement
    pass