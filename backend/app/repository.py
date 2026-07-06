import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import UploadFile
from google.cloud.firestore_v1 import Query

from app.firebase import bucket, db

REPORTS_COLLECTION = "reports"
NOTIFICATIONS_COLLECTION = "notifications"


def upload_images(images: list[UploadFile]) -> list[str]:
    urls = []
    for image in images:
        blob_name = f"reports/{uuid.uuid4()}_{image.filename}"
        blob = bucket.blob(blob_name)
        blob.upload_from_file(image.file, content_type=image.content_type)
        urls.append(blob.public_url)
    return urls


def create_report(report_data: dict[str, Any]) -> str:
    report_id = str(uuid.uuid4())
    report_data["id"] = report_id
    report_data["created_at"] = datetime.now(timezone.utc)
    db.collection(REPORTS_COLLECTION).document(report_id).set(report_data)
    return report_id


def get_reports(report_type: str | None = None) -> list[dict[str, Any]]:
    query = db.collection(REPORTS_COLLECTION).order_by(
        "created_at", direction=Query.DESCENDING
    )
    reports = [doc.to_dict() for doc in query.stream()]
    if report_type:
        reports = [r for r in reports if r.get("type") == report_type]
    return reports


def get_report_by_id(report_id: str) -> dict[str, Any] | None:
    doc = db.collection(REPORTS_COLLECTION).document(report_id).get()
    return doc.to_dict() if doc.exists else None


def create_notification(notification_data: dict[str, Any]) -> str:
    notification_id = str(uuid.uuid4())
    notification_data["created_at"] = datetime.now(timezone.utc)
    db.collection(NOTIFICATIONS_COLLECTION).document(notification_id).set(notification_data)
    return notification_id
