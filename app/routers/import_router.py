"""
Router FastAPI pour l'import et le traitement des fichiers
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import Optional, List
import shutil
import os
from pathlib import Path
import uuid
from datetime import datetime

from app.services.file_processor import FileProcessor

router = APIRouter(
    prefix="/api/import",
    tags=["import"],
    responses={404: {"description": "Not found"}},
)

# Dossier temporaire pour les uploads
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Instance du processeur de fichiers
file_processor = FileProcessor()

@router.post("/upload")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Upload et traite un fichier de données financières
    
    Formats supportés:
    - Excel (.xlsx, .xls)
    - CSV (.csv)
    - JSON (.json)
    - XML (.xml)
    - PDF (.pdf) - à venir
    """
    try:
        # Validation du type de fichier
        allowed_extensions = ['.xlsx', '.xls', '.csv', '.json', '.xml', '.pdf']
        file_extension = Path(file.filename).suffix.lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Type de fichier non supporté. Extensions acceptées: {', '.join(allowed_extensions)}"
            )
        
        # Génération d'un nom unique pour le fichier
        file_id = str(uuid.uuid4())
        file_path = UPLOAD_DIR / f"{file_id}{file_extension}"
        
        # Sauvegarde du fichier
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Traitement immédiat du fichier
        result = file_processor.process_file(str(file_path), file.content_type)
        
        # Nettoyage du fichier temporaire en arrière-plan
        background_tasks.add_task(cleanup_file, file_path)
        
        # Retour du résultat
        if result['status'] == 'success':
            return JSONResponse(
                status_code=200,
                content={
                    "status": "success",
                    "file_id": file_id,
                    "filename": file.filename,
                    "sector": result['sector'],
                    "suggested_kpis": result['suggested_kpis'],
                    "quality_report": result['quality_report'],
                    "schema": result['schema'][:10],  # Limiter à 10 colonnes pour la réponse
                    "timestamp": result['timestamp']
                }
            )
        else:
            raise HTTPException(
                status_code=422,
                detail=f"Erreur lors du traitement du fichier: {result['error']}"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur serveur: {str(e)}"
        )

@router.get("/status/{file_id}")
async def get_import_status(file_id: str):
    """
    Récupère le statut d'un import en cours
    """
    # TODO: Implémenter le suivi des imports asynchrones
    return {
        "file_id": file_id,
        "status": "completed",
        "progress": 100,
        "message": "Import terminé"
    }

@router.get("/templates")
async def get_import_templates():
    """
    Retourne la liste des templates d'import disponibles
    """
    templates = [
        {
            "id": "banking_basel3",
            "name": "Banking - Bâle III Template",
            "description": "Template pour les ratios réglementaires bancaires",
            "sector": "banking",
            "columns": [
                "date", "cet1_ratio", "tier1_ratio", "total_capital_ratio",
                "lcr", "nsfr", "leverage_ratio", "npl_ratio"
            ]
        },
        {
            "id": "insurance_solvency2",
            "name": "Insurance - Solvency II Template",
            "description": "Template pour les métriques Solvency II",
            "sector": "insurance",
            "columns": [
                "date", "scr", "mcr", "own_funds", "scr_ratio", "mcr_ratio",
                "combined_ratio", "loss_ratio", "expense_ratio"
            ]
        },
        {
            "id": "mixed_financial",
            "name": "Mixed Financial Data",
            "description": "Template pour données mixtes banque/assurance",
            "sector": "mixed",
            "columns": [
                "date", "entity", "sector", "revenue", "costs", "profit",
                "assets", "liabilities", "equity"
            ]
        }
    ]
    
    return templates

@router.post("/validate")
async def validate_file_structure(file: UploadFile = File(...)):
    """
    Valide la structure d'un fichier avant l'import complet
    """
    try:
        # Lecture des premières lignes seulement pour validation
        file_extension = Path(file.filename).suffix.lower()
        
        # Sauvegarde temporaire
        temp_path = UPLOAD_DIR / f"temp_{uuid.uuid4()}{file_extension}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Validation rapide
        if file_extension in ['.xlsx', '.xls']:
            import pandas as pd
            df = pd.read_excel(temp_path, nrows=10)
        elif file_extension == '.csv':
            import pandas as pd
            df = pd.read_csv(temp_path, nrows=10)
        else:
            os.remove(temp_path)
            return {"valid": True, "message": "Type de fichier accepté"}
        
        # Nettoyage
        os.remove(temp_path)
        
        return {
            "valid": True,
            "columns": df.columns.tolist(),
            "rows_sample": len(df),
            "message": "Structure valide"
        }
        
    except Exception as e:
        return {
            "valid": False,
            "message": f"Erreur de validation: {str(e)}"
        }

@router.get("/connectors")
async def get_available_connectors():
    """
    Liste les connecteurs API disponibles
    """
    connectors = [
        {
            "id": "temenos_t24",
            "name": "Temenos T24",
            "type": "Banking Core System",
            "status": "active",
            "endpoints": ["accounts", "transactions", "customers", "loans"]
        },
        {
            "id": "sap_s4hana",
            "name": "SAP S/4HANA",
            "type": "ERP System",
            "status": "active",
            "endpoints": ["finance", "controlling", "treasury"]
        },
        {
            "id": "guidewire",
            "name": "Guidewire",
            "type": "Insurance Platform",
            "status": "inactive",
            "endpoints": ["policies", "claims", "billing"]
        },
        {
            "id": "bloomberg_api",
            "name": "Bloomberg API",
            "type": "Market Data",
            "status": "active",
            "endpoints": ["securities", "reference_data", "historical_data"]
        },
        {
            "id": "ecb_sdw",
            "name": "ECB Statistical Data Warehouse",
            "type": "Regulatory Data",
            "status": "active",
            "endpoints": ["statistics", "exchange_rates", "interest_rates"]
        }
    ]
    
    return connectors

def cleanup_file(file_path: Path):
    """
    Supprime un fichier temporaire
    """
    try:
        if file_path.exists():
            os.remove(file_path)
    except Exception:
        pass  # Ignorer les erreurs de suppression