from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models import Location, ReportType


class ReportOut(BaseModel):
    id: str
    user_id: str
    type: ReportType
    description: str
    location: Location
    image_urls: list[str]
    created_at: datetime

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "5f2c1e3a-1234-4a5b-9c6d-abcdef123456",
                "user_id": "user_001",
                "type": "ACCIDENT",
                "description": "Two-car collision blocking the right lane.",
                "location": {
                    "latitude": 28.6139,
                    "longitude": 77.2090,
                    "address": "Connaught Place, New Delhi",
                },
                "image_urls": [
                    "https://storage.googleapis.com/your-bucket/reports/abc123.jpg"
                ],
                "created_at": "2026-07-05T10:15:30.123456+00:00",
            }
        }
    )


class ReportCreateOut(BaseModel):
    message: str
    report_id: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "message": "Report submitted successfully",
                "report_id": "5f2c1e3a-1234-4a5b-9c6d-abcdef123456",
            }
        }
    )


class ErrorOut(BaseModel):
    detail: str

    model_config = ConfigDict(
        json_schema_extra={"example": {"detail": "Report not found"}}
    )


class ValidationErrorOut(BaseModel):
    status: str
    errors: list[dict]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "validation_error",
                "errors": [
                    {
                        "loc": ["body", "latitude"],
                        "msg": "Input should be greater than or equal to -90",
                        "type": "greater_than_equal",
                    }
                ],
            }
        }
    )


class ServerErrorOut(BaseModel):
    status: str
    message: str
    error: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "error",
                "message": "Internal server error",
                "error": "503 Service Unavailable: Firestore is temporarily unreachable",
            }
        }
    )


class HealthOut(BaseModel):
    status: str

    model_config = ConfigDict(json_schema_extra={"example": {"status": "ok"}})


class FirestoreHealthOut(BaseModel):
    status: str
    firestore: bool

    model_config = ConfigDict(
        json_schema_extra={"example": {"status": "connected", "firestore": True}}
    )


class FirestoreHealthErrorOut(BaseModel):
    status: str
    firestore: bool
    error: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "failed",
                "firestore": False,
                "error": "503 Service Unavailable: Firestore is temporarily unreachable",
            }
        }
    )
