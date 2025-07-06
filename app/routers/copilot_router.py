"""
Router FastAPI pour le Co-Pilot IA
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import asyncio
from datetime import datetime

from app.services.ai_service import FinanceAIService, IntentType, SectorContext

router = APIRouter(
    prefix="/api/copilot",
    tags=["copilot"],
    responses={404: {"description": "Not found"}},
)

# Modèles Pydantic pour les requêtes/réponses
class ChatMessage(BaseModel):
    """Message de chat"""
    role: str  # 'user' ou 'assistant'
    content: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    """Requête de chat"""
    query: str
    context: Optional[Dict[str, Any]] = None
    history: Optional[List[ChatMessage]] = []
    stream: Optional[bool] = False

class ChatResponse(BaseModel):
    """Réponse de chat"""
    response: Dict[str, Any]
    suggestions: List[Dict[str, str]]
    intent: str
    sector: str

class ReportRequest(BaseModel):
    """Requête de génération de rapport"""
    report_type: str  # 'regulatory', 'executive', 'risk', 'compliance'
    sector: str  # 'banking', 'insurance', 'mixed'
    period: Optional[str] = "current"
    metrics: Optional[List[str]] = []
    format: Optional[str] = "pdf"  # 'pdf', 'excel', 'html'

# Instance du service IA
ai_service = FinanceAIService()

# Stockage en mémoire des conversations (à remplacer par une DB en production)
conversations = {}

@router.post("/chat", response_model=ChatResponse)
async def chat_with_copilot(request: ChatRequest):
    """
    Endpoint principal pour interagir avec le Co-Pilot IA
    
    Exemples de requêtes:
    - "Calcule mon ratio CET1"
    - "Génère un rapport Bâle III"
    - "Analyse l'évolution de mes KPIs"
    - "Explique ce qu'est le ratio SCR"
    """
    try:
        # Traiter la requête avec le service IA
        result = await ai_service.process_query(
            query=request.query,
            context=request.context
        )
        
        # Si streaming demandé, retourner une réponse SSE
        if request.stream:
            return StreamingResponse(
                stream_response(result),
                media_type="text/event-stream"
            )
        
        # Sinon, retourner une réponse normale
        return ChatResponse(
            response=result['response'],
            suggestions=result['suggestions'],
            intent=result['intent'],
            sector=result['sector']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Endpoint pour le chat en streaming (Server-Sent Events)
    """
    async def generate():
        try:
            # Traiter la requête
            result = await ai_service.process_query(
                query=request.query,
                context=request.context
            )
            
            # Simuler un streaming progressif
            response_text = json.dumps(result['response'])
            
            # Envoyer par chunks
            chunk_size = 50
            for i in range(0, len(response_text), chunk_size):
                chunk = response_text[i:i + chunk_size]
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                await asyncio.sleep(0.05)  # Délai pour effet streaming
            
            # Envoyer les suggestions à la fin
            yield f"data: {json.dumps({'suggestions': result['suggestions'], 'complete': True})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@router.post("/generate/report")
async def generate_report(request: ReportRequest):
    """
    Génère un rapport automatique
    
    Types de rapports:
    - regulatory: COREP, FINREP, QRT Solvency II
    - executive: Rapport exécutif avec KPIs
    - risk: Analyse des risques
    - compliance: Conformité réglementaire
    """
    try:
        # Validation du type de rapport
        valid_types = ['regulatory', 'executive', 'risk', 'compliance']
        if request.report_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Type de rapport invalide. Valeurs acceptées: {valid_types}"
            )
        
        # Génération du rapport (simulation)
        report_id = f"RPT-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Structure du rapport selon le type
        if request.report_type == 'regulatory':
            if request.sector == 'banking':
                sections = ['Capital Adequacy', 'Liquidity Ratios', 'Asset Quality', 'Leverage']
            else:
                sections = ['SCR Calculation', 'MCR Calculation', 'Own Funds', 'Risk Margin']
        elif request.report_type == 'executive':
            sections = ['Executive Summary', 'Key Metrics', 'Performance Analysis', 'Recommendations']
        elif request.report_type == 'risk':
            sections = ['Risk Overview', 'Credit Risk', 'Market Risk', 'Operational Risk', 'Mitigation Strategies']
        else:  # compliance
            sections = ['Regulatory Requirements', 'Current Status', 'Gaps Analysis', 'Action Plan']
        
        return {
            'report_id': report_id,
            'type': request.report_type,
            'sector': request.sector,
            'period': request.period,
            'status': 'generation_started',
            'sections': sections,
            'estimated_completion': '2 minutes',
            'download_url': f'/api/copilot/reports/{report_id}/download'
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/dashboard")
async def generate_dashboard(metrics: List[str], sector: Optional[str] = "mixed"):
    """
    Génère automatiquement une configuration de dashboard
    basée sur les métriques demandées
    """
    try:
        # Créer la requête pour le service IA
        query = f"Crée un dashboard avec {', '.join(metrics)}"
        context = {'sector': sector}
        
        result = await ai_service.process_query(query, context)
        
        if result['response']['type'] == 'dashboard_config':
            return {
                'status': 'success',
                'config': result['response'],
                'message': 'Dashboard configuré avec succès'
            }
        else:
            raise HTTPException(
                status_code=400,
                detail="Impossible de générer la configuration du dashboard"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/suggestions")
async def get_suggestions(sector: Optional[str] = "mixed", intent: Optional[str] = None):
    """
    Retourne des suggestions de requêtes basées sur le contexte
    """
    # Mapping des suggestions par secteur
    suggestions_map = {
        'banking': [
            {
                'category': 'Ratios Réglementaires',
                'queries': [
                    'Calcule mon ratio CET1',
                    'Quelle est ma position LCR ?',
                    'Analyse mon NSFR'
                ]
            },
            {
                'category': 'Rapports',
                'queries': [
                    'Génère le rapport COREP',
                    'Prépare le stress test BCE',
                    'Crée un rapport Bâle III'
                ]
            },
            {
                'category': 'Analyses',
                'queries': [
                    'Analyse l\'évolution de mes NPL',
                    'Compare mes ratios avec les seuils',
                    'Détecte les anomalies de liquidité'
                ]
            }
        ],
        'insurance': [
            {
                'category': 'Solvency II',
                'queries': [
                    'Calcule mon ratio SCR',
                    'Vérifie ma conformité MCR',
                    'Analyse mes fonds propres'
                ]
            },
            {
                'category': 'Ratios Techniques',
                'queries': [
                    'Quel est mon ratio combiné ?',
                    'Analyse le loss ratio',
                    'Évolution de l\'expense ratio'
                ]
            },
            {
                'category': 'Rapports',
                'queries': [
                    'Génère le QRT trimestriel',
                    'Prépare le rapport SFCR',
                    'Crée le RSR annuel'
                ]
            }
        ],
        'mixed': [
            {
                'category': 'Performance',
                'queries': [
                    'Analyse mes KPIs principaux',
                    'Compare T3 vs T4',
                    'Montre l\'évolution des revenus'
                ]
            },
            {
                'category': 'Dashboards',
                'queries': [
                    'Crée un dashboard exécutif',
                    'Configure un tableau de bord risques',
                    'Affiche mes métriques clés'
                ]
            },
            {
                'category': 'Intelligence',
                'queries': [
                    'Détecte les anomalies',
                    'Prédis les tendances',
                    'Analyse les corrélations'
                ]
            }
        ]
    }
    
    return {
        'sector': sector,
        'suggestions': suggestions_map.get(sector, suggestions_map['mixed'])
    }

@router.get("/capabilities")
async def get_capabilities():
    """
    Retourne les capacités du Co-Pilot IA
    """
    return {
        'intents': [
            {
                'type': 'calculate_ratio',
                'description': 'Calcul de ratios financiers et réglementaires',
                'examples': ['Calcule mon CET1', 'Quel est mon ratio SCR ?']
            },
            {
                'type': 'generate_report',
                'description': 'Génération automatique de rapports',
                'examples': ['Génère un rapport Bâle III', 'Prépare le QRT']
            },
            {
                'type': 'analyze_trend',
                'description': 'Analyse de tendances et évolutions',
                'examples': ['Analyse l\'évolution sur 12 mois', 'Montre la tendance']
            },
            {
                'type': 'explain_metric',
                'description': 'Explication de métriques et concepts',
                'examples': ['Explique le ratio CET1', 'Qu\'est-ce que Solvency II ?']
            },
            {
                'type': 'create_dashboard',
                'description': 'Création automatique de dashboards',
                'examples': ['Crée un dashboard banking', 'Configure un tableau de bord']
            },
            {
                'type': 'detect_anomaly',
                'description': 'Détection d\'anomalies et alertes',
                'examples': ['Détecte les anomalies', 'Y a-t-il des alertes ?']
            }
        ],
        'sectors': ['banking', 'insurance', 'mixed'],
        'languages': ['français', 'english', 'deutsch', 'español', 'italiano', 'português'],
        'report_types': ['regulatory', 'executive', 'risk', 'compliance'],
        'metrics': {
            'banking': ['CET1', 'LCR', 'NSFR', 'NPL', 'ROE', 'CAR'],
            'insurance': ['SCR', 'MCR', 'Combined Ratio', 'Loss Ratio', 'Expense Ratio']
        }
    }

@router.get("/reports/{report_id}/status")
async def get_report_status(report_id: str):
    """
    Vérifie le statut de génération d'un rapport
    """
    # Simulation - en production, vérifier dans la DB
    return {
        'report_id': report_id,
        'status': 'completed',
        'progress': 100,
        'download_ready': True,
        'expires_at': '2024-12-31T23:59:59'
    }

# Fonction helper pour le streaming
async def stream_response(result: Dict):
    """Génère une réponse en streaming"""
    response_json = json.dumps(result)
    chunk_size = 50
    
    for i in range(0, len(response_json), chunk_size):
        chunk = response_json[i:i + chunk_size]
        yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        await asyncio.sleep(0.05)
    
    yield f"data: {json.dumps({'complete': True})}\n\n"