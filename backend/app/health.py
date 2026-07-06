from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.firebase import db
from app.schemas import FirestoreHealthErrorOut, FirestoreHealthOut, HealthOut

router = APIRouter(tags=["Health"])

HEALTH_CHECK_COLLECTION = "health_check"


@router.get(
    "/health",
    response_model=HealthOut,
    status_code=200,
    summary="Basic liveness check",
)
async def health() -> dict:
    return {"status": "ok"}


@router.get(
    "/health/firestore",
    response_model=FirestoreHealthOut,
    status_code=200,
    summary="Firestore connectivity check",
    responses={
        500: {
            "model": FirestoreHealthErrorOut,
            "description": "Firestore connection failed",
        }
    },
)
async def health_firestore():
    try:
        doc_ref = db.collection(HEALTH_CHECK_COLLECTION).document("ping")
        doc_ref.set({"ping": "pong"})
        doc_ref.get()
        doc_ref.delete()
        return {"status": "connected", "firestore": True}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "failed", "firestore": False, "error": str(e)},
        )
