from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    firebase_project_id: str = "heliosai-surgealert"
    firebase_storage_bucket: str = "your-project-id.appspot.com"

    class Config:
        env_file = ".env"


settings = Settings()
