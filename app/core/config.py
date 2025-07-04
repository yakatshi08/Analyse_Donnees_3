from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "FinTech Analytics"
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/fintech_db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    # WebSocket
    WS_MESSAGE_QUEUE: str = "redis://localhost:6379/1"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()