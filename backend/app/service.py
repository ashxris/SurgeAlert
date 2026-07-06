import logging
from typing import Any

from fastapi import UploadFile

from app import places, repository
from app.models import ReportType

logger = logging.getLogger("surgealert")


def _notify_nearest(report: dict[str, Any], recipient_type: str) -> bool:
    location = report["location"]
    try:
        place = places.find_nearest_place(
            location["latitude"], location["longitude"], recipient_type
        )
    except Exception:
        logger.exception(
            f"Google Places lookup failed for {recipient_type}, report {report['id']}"
        )
        return False

    if not place:
        logger.warning(
            f"No {recipient_type} found near ({location['latitude']}, {location['longitude']}) "
            f"for report {report['id']}"
        )
        return False

    try:
        repository.create_notification(
            {
                "report_id": report["id"],
                "recipient_type": recipient_type,
                "recipient_name": place["name"],
                "recipient_address": place["address"],
                "place_id": place["place_id"],
                "latitude": place["latitude"],
                "longitude": place["longitude"],
                "status": "pending",
            }
        )
    except Exception:
        logger.exception(
            f"Failed to save {recipient_type} notification for report {report['id']}"
        )
        return False

    return True


def notify_nearest_police(report: dict[str, Any]) -> bool:
    return _notify_nearest(report, "police")


def notify_nearest_hospital(report: dict[str, Any]) -> bool:
    return _notify_nearest(report, "hospital")


def submit_report(
    user_id: str,
    report_type: ReportType,
    description: str,
    latitude: float,
    longitude: float,
    address: str,
    images: list[UploadFile],
) -> str:
    image_urls = upload_report_images(images)

    report_data = {
        "user_id": user_id,
        "type": report_type.value,
        "description": description,
        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "address": address,
        },
        "image_urls": image_urls,
    }
    report_id = repository.create_report(report_data)
    report_data["id"] = report_id

    if report_type == ReportType.TRAFFIC:
        notify_nearest_police(report_data)
    elif report_type == ReportType.ACCIDENT:
        notify_nearest_police(report_data)
        notify_nearest_hospital(report_data)

    return report_id


def upload_report_images(images: list[UploadFile]) -> list[str]:
    if not images:
        return []
    return repository.upload_images(images)


def list_reports(report_type: str | None = None) -> list[dict[str, Any]]:
    return repository.get_reports(report_type)


def get_report(report_id: str) -> dict[str, Any] | None:
    return repository.get_report_by_id(report_id)
