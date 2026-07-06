import firebase_admin
from firebase_admin import credentials, firestore, storage

from app.config import settings

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(
    cred,
    {
        "projectId": settings.firebase_project_id,
        "storageBucket": settings.firebase_storage_bucket,
    },
)

db = firestore.client()
bucket = storage.bucket()
