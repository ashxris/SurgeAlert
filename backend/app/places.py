from math import atan2, cos, radians, sin, sqrt

import requests

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
SEARCH_RADIUS_METERS = 5000


def _haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    earth_radius = 6371000
    phi1, phi2 = radians(lat1), radians(lat2)
    dphi = radians(lat2 - lat1)
    dlambda = radians(lon2 - lon1)
    a = sin(dphi / 2) ** 2 + cos(phi1) * cos(phi2) * sin(dlambda / 2) ** 2
    return 2 * earth_radius * atan2(sqrt(a), sqrt(1 - a))


def _element_coords(element: dict) -> tuple[float | None, float | None]:
    if "lat" in element and "lon" in element:
        return element["lat"], element["lon"]
    center = element.get("center") or {}
    return center.get("lat"), center.get("lon")


def _format_address(tags: dict) -> str:
    parts = [
        tags.get("addr:housenumber"),
        tags.get("addr:street"),
        tags.get("addr:city"),
    ]
    address = ", ".join(part for part in parts if part)
    return address or "Address not available"


def find_nearest_place(latitude: float, longitude: float, place_type: str) -> dict | None:
    query = f"""
    [out:json];
    (
      node["amenity"="{place_type}"](around:{SEARCH_RADIUS_METERS},{latitude},{longitude});
      way["amenity"="{place_type}"](around:{SEARCH_RADIUS_METERS},{latitude},{longitude});
      relation["amenity"="{place_type}"](around:{SEARCH_RADIUS_METERS},{latitude},{longitude});
    );
    out center;
    """
    response = requests.post(
        OVERPASS_URL,
        data={"data": query},
        headers={
            "Accept": "application/json",
            "User-Agent": "SurgeAlert-Hackathon/1.0",
        },
        timeout=15,
    )
    response.raise_for_status()
    elements = response.json().get("elements") or []
    if not elements:
        return None

    def distance(element: dict) -> float:
        lat, lon = _element_coords(element)
        if lat is None or lon is None:
            return float("inf")
        return _haversine_meters(latitude, longitude, lat, lon)

    nearest = min(elements, key=distance)
    lat, lon = _element_coords(nearest)
    tags = nearest.get("tags", {})

    return {
        "place_id": f"{nearest['type']}/{nearest['id']}",
        "name": tags.get("name") or f"Nearest {place_type}",
        "address": _format_address(tags),
        "latitude": lat,
        "longitude": lon,
    }
