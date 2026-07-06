from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class ReportType(str, Enum):
    TRAFFIC = "TRAFFIC"
    ACCIDENT = "ACCIDENT"


class Location(BaseModel):
    latitude: float
    longitude: float
    address: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "latitude": 28.6139,
                "longitude": 77.2090,
                "address": "Connaught Place, New Delhi",
            }
        }
    )


class Report(BaseModel):
    id: str
    user_id: str
    type: ReportType
    description: str
    location: Location
    image_urls: list[str] = []
    created_at: datetime


class User(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime
