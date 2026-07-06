from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app import service
from app.models import ReportType
from app.schemas import (
    ErrorOut,
    ReportCreateOut,
    ReportOut,
    ServerErrorOut,
    ValidationErrorOut,
)

router = APIRouter(tags=["Reports"])


@router.post(
    "/reports",
    response_model=ReportCreateOut,
    status_code=201,
    summary="Submit a traffic or accident report",
    responses={
        400: {"model": ValidationErrorOut, "description": "Invalid request data"},
        500: {"model": ServerErrorOut, "description": "Internal server error"},
    },
)
async def create_report(
    user_id: str = Form(..., min_length=1, description="ID of the reporting user"),
    type: ReportType = Form(..., description="Type of report"),
    description: str = Form(..., min_length=1, description="Description of the incident"),
    latitude: float = Form(..., ge=-90, le=90, description="Latitude of the incident"),
    longitude: float = Form(..., ge=-180, le=180, description="Longitude of the incident"),
    address: str = Form(..., min_length=1, description="Human-readable address"),
    images: list[UploadFile] = File(default=[], description="Optional photo/video evidence"),
) -> ReportCreateOut:
    report_id = service.submit_report(
        user_id=user_id,
        report_type=type,
        description=description,
        latitude=latitude,
        longitude=longitude,
        address=address,
        images=images,
    )
    return ReportCreateOut(message="Report submitted successfully", report_id=report_id)


@router.get(
    "/reports",
    response_model=list[ReportOut],
    status_code=200,
    summary="List reports, newest first",
    responses={500: {"model": ServerErrorOut, "description": "Internal server error"}},
)
async def list_reports(
    type: ReportType | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
) -> list[dict]:
    return service.list_reports(report_type=type.value if type else None)


@router.get(
    "/reports/{report_id}",
    response_model=ReportOut,
    status_code=200,
    summary="Get a single report by ID",
    responses={
        404: {"model": ErrorOut, "description": "Report not found"},
        500: {"model": ServerErrorOut, "description": "Internal server error"},
    },
)
async def get_report(report_id: str) -> dict:
    report = service.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
