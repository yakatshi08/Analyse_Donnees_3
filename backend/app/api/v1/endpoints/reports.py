"""
Report generation endpoints with regulatory compliance
Conformément aux prompts 34-35 du cahier des charges
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import asyncio

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.schemas import (
    ReportRequest, ReportResponse,
    ComplianceReport, AuditTrail
)
from app.services.report_service import ReportService
from app.services.blockchain_service import BlockchainService

router = APIRouter()

@router.post("/generate", response_model=ReportResponse)
async def generate_report(
    report_request: ReportRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Génération de rapports réglementaires
    Prompt 34: COREP/FINREP, IFRS 9, Bâle III
    """
    report_service = ReportService(db)
    
    # Validation du type de rapport
    valid_types = ["corep", "finrep", "basel3", "ifrs9", "lcr", "nsfr", "custom"]
    if report_request.report_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Type de rapport invalide. Types valides: {valid_types}"
        )
    
    # Générer le rapport
    report = await report_service.generate_regulatory_report(
        report_type=report_request.report_type,
        dataset_ids=report_request.dataset_ids,
        period_start=report_request.period_start,
        period_end=report_request.period_end,
        parameters=report_request.parameters,
        user_id=current_user.id
    )
    
    # Audit blockchain si demandé
    if report_request.blockchain_audit:
        blockchain_service = BlockchainService()
        blockchain_hash = await blockchain_service.record_report_generation(
            report_id=report["id"],
            report_type=report_request.report_type,
            user_id=current_user.id
        )
        report["blockchain_hash"] = blockchain_hash
    
    return ReportResponse(
        report_id=report["id"],
        report_type=report["type"],
        status="completed",
        generation_time=report["generation_time"],
        validation_status=report["validation"],
        download_url=f"/api/v1/reports/{report['id']}/download",
        blockchain_hash=report.get("blockchain_hash")
    )

@router.get("/templates", response_model=List[Dict])
async def list_report_templates(
    category: Optional[str] = None,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Liste des templates de rapports disponibles"""
    report_service = ReportService(db)
    
    templates = await report_service.get_available_templates(
        category=category,
        user_role=current_user.role
    )
    
    return templates

@router.get("/compliance-dashboard", response_model=ComplianceReport)
async def get_compliance_dashboard(
    reporting_date: datetime = Query(default=datetime.now()),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Dashboard de conformité réglementaire
    Prompt 35: Dashboard de conformité avec métriques
    """
    report_service = ReportService(db)
    
    compliance_data = await report_service.generate_compliance_dashboard(
        reporting_date=reporting_date,
        user_id=current_user.id
    )
    
    return ComplianceReport(
        reporting_date=reporting_date,
        corep_status=compliance_data["corep"],
        finrep_status=compliance_data["finrep"],
        basel3_metrics=compliance_data["basel3"],
        ifrs9_compliance=compliance_data["ifrs9"],
        regulatory_breaches=compliance_data["breaches"],
        upcoming_deadlines=compliance_data["deadlines"],
        action_items=compliance_data["actions"]
    )

@router.get("/{report_id}/download")
async def download_report(
    report_id: str,
    format: str = Query("pdf", description="Format: pdf, excel, csv"),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Téléchargement d'un rapport généré"""
    report_service = ReportService(db)
    
    # Vérifier les permissions
    report = await report_service.get_report(report_id, current_user.id)
    if not report:
        raise HTTPException(
            status_code=404,
            detail="Rapport non trouvé"
        )
    
    # Générer le fichier
    file_path = await report_service.export_report(
        report_id=report_id,
        format=format
    )
    
    return FileResponse(
        path=file_path,
        filename=f"{report['type']}_{report['period']}.{format}",
        media_type=f"application/{format}"
    )

@router.get("/audit-trail", response_model=List[AuditTrail])
async def get_audit_trail(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    report_type: Optional[str] = None,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Historique d'audit des rapports
    Prompt 35: Traçabilité complète avec blockchain
    """
    if current_user.role not in ["admin", "compliance", "audit"]:
        raise HTTPException(
            status_code=403,
            detail="Accès non autorisé à l'audit trail"
        )
    
    report_service = ReportService(db)
    blockchain_service = BlockchainService()
    
    # Récupérer l'historique
    audit_logs = await report_service.get_audit_trail(
        start_date=start_date,
        end_date=end_date,
        report_type=report_type
    )
    
    # Vérifier l'intégrité blockchain
    for log in audit_logs:
        if log.get("blockchain_hash"):
            log["blockchain_verified"] = await blockchain_service.verify_hash(
                log["blockchain_hash"]
            )
    
    return audit_logs

@router.post("/schedule")
async def schedule_report(
    schedule_config: Dict,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Planification de rapports récurrents"""
    report_service = ReportService(db)
    
    scheduled_report = await report_service.schedule_report(
        config=schedule_config,
        user_id=current_user.id
    )
    
    return {
        "schedule_id": scheduled_report["id"],
        "report_type": scheduled_report["type"],
        "frequency": scheduled_report["frequency"],
        "next_run": scheduled_report["next_run"],
        "recipients": scheduled_report["recipients"]
    }

@router.post("/validate/{report_id}")
async def validate_report(
    report_id: str,
    validation_level: str = Query("full", description="basic, full, regulatory"),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Validation d'un rapport selon les normes réglementaires"""
    report_service = ReportService(db)
    
    validation_result = await report_service.validate_report(
        report_id=report_id,
        validation_level=validation_level,
        validator_id=current_user.id
    )
    
    return {
        "report_id": report_id,
        "validation_status": validation_result["status"],
        "validation_errors": validation_result["errors"],
        "warnings": validation_result["warnings"],
        "regulatory_compliance": validation_result["compliance"],
        "validator": current_user.email,
        "timestamp": datetime.now()
    }

@router.get("/regulatory-calendar")
async def get_regulatory_calendar(
    year: int = Query(default=datetime.now().year),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Calendrier des échéances réglementaires"""
    report_service = ReportService(db)
    
    calendar = await report_service.get_regulatory_calendar(
        year=year,
        entity_type=current_user.metadata.get("entity_type", "bank")
    )
    
    return {
        "year": year,
        "deadlines": calendar["deadlines"],
        "upcoming_30_days": calendar["upcoming"],
        "overdue": calendar["overdue"],
        "completed": calendar["completed"]
    }

@router.post("/executive-summary")
async def generate_executive_summary(
    dataset_ids: List[str],
    period: str = Query("monthly", description="daily, weekly, monthly, quarterly"),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Génération de résumé exécutif
    Prompt 19: Dashboards exécutifs
    """
    report_service = ReportService(db)
    
    summary = await report_service.generate_executive_summary(
        dataset_ids=dataset_ids,
        period=period,
        user_id=current_user.id
    )
    
    return {
        "summary": summary["text"],
        "key_metrics": summary["metrics"],
        "trends": summary["trends"],
        "alerts": summary["alerts"],
        "recommendations": summary["recommendations"],
        "visualizations": summary["charts"]
    }