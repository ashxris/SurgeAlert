# SurgeAlert Backend

Simple FastAPI backend for the SurgeAlert hackathon MVP. Lets users report traffic
jams and accidents, upload images, and view recent reports.

## Setup

This backend authenticates to Firebase using **Application Default
Credentials (ADC)** — no service account JSON file is required for local
development.

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install) if you
   don't already have it, then authenticate:

   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

   This stores local credentials that `firebase-admin` picks up automatically
   via `credentials.ApplicationDefault()`. Make sure the authenticated
   account has access to the Firebase project (Firestore + Storage) you're
   targeting.

3. Copy `.env.example` to `.env` and fill in your values:

   ```bash
   cp .env.example .env
   ```

   - `FIREBASE_PROJECT_ID`: your Firebase/GCP project ID.
   - `FIREBASE_STORAGE_BUCKET`: your Firebase Storage bucket name.

4. Run the server:

   ```bash
   uvicorn app.main:app --reload
   ```

5. Open http://127.0.0.1:8000/docs for the interactive API docs.

> In deployed environments (Cloud Run, GKE, Compute Engine, etc.) ADC is
> picked up automatically from the environment's attached service account —
> no extra configuration is needed.

## Firestore Collections

- `users` — id, name, email, created_at
- `reports` — id, user_id, type, description, location, image_urls, created_at

## API Endpoints

### `POST /reports`

Creates a new report (multipart/form-data).

Fields: `user_id`, `type` (`TRAFFIC` | `ACCIDENT`), `description`, `latitude`,
`longitude`, `address`, `images` (files, optional, multiple).

If `type` is `TRAFFIC`, `notify_nearest_police()` is called.
If `type` is `ACCIDENT`, both `notify_nearest_police()` and
`notify_nearest_hospital()` are called.

Response:

```json
{ "message": "Report submitted successfully", "report_id": "..." }
```

### `GET /reports`

Returns all reports, newest first. Optional query param `type` filters by
report type. `latitude`/`longitude` are accepted but not used for filtering.

### `GET /reports/{report_id}`

Returns full details for a single report.

## Notification Placeholders

`notify_nearest_police()` and `notify_nearest_hospital()` in `service.py` only
log a message and return `True`. No real dispatch integration is implemented.
