from pathlib import Path
from typing import Literal, Annotated, Any
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict



ENV_FILE_CANDIDATES = (
  Path(__file__).resolve().parents[2] / ".env",
  Path(__file__).resolve().parents[1] / ".env",
)

DEFAULT_ENV_FILE = next((path for path in ENV_FILE_CANDIDATES if path.exists()), ENV_FILE_CANDIDATES[0])


class Settings(BaseSettings):
  model_config = SettingsConfigDict(
    env_file=DEFAULT_ENV_FILE,
    env_ignore_empty=True,
    extra="ignore",
  )

  # server section
  UVICORN_TIMEOUT_KEEP_ALIVE: int = 120
  UVICORN_TIMEOUT_GRACEFUL_SHUTDOWN: int = 120
  LOG_LEVEL: Literal["critical", "error", "warning", "info", "debug", "trace"] = "info"


  # app section
  TITLE: str = "Startup Simulator API"
  API_V1_STR: str = "/api/v1"
  DOCS_URL: str = "/docs"
  OPENAPI_URL: str = "/openapi.json"
  SERVER_PORT: int = 8000
  ENABLE_DOCS: bool = True
  ENABLE_OPENAPI: bool = True
  ENABLE_CORS: bool = True
  CORS_ORIGINS: list[str] | str = ["*"]
  FRONTEND_HOST: str = "http://localhost:5173"
  ENVIRONMENT: Literal["local", "staging", "production"] = "local"

  @property
  def all_cors_origins(self) -> list[str]:
    """Get all allowed CORS origins."""
    return self.CORS_ORIGINS if self.ENABLE_CORS else []

  @field_validator("CORS_ORIGINS", mode="before")
  @classmethod
  def coerce_cors_origins(cls, value: Any) -> list[str]:
    """Allow JSON array, comma-separated string, or list for CORS origins."""
    if isinstance(value, list):
      return value
    if isinstance(value, str):
      raw = value.strip()
      if raw.startswith("["):
        try:
          import json
          loaded = json.loads(raw)
          if isinstance(loaded, list):
            return [str(item).strip() for item in loaded if str(item).strip()]
        except Exception:
          pass
      return [part.strip() for part in raw.split(",") if part.strip()]
    return ["*"]


settings = Settings()