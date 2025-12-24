from app.config import settings
import uvicorn


def start_uvicorn():

  uvicorn.run(
    "app.main:app",
    port=settings.SERVER_PORT,
    timeout_keep_alive=settings.UVICORN_TIMEOUT_KEEP_ALIVE,
    timeout_graceful_shutdown=settings.UVICORN_TIMEOUT_GRACEFUL_SHUTDOWN,
    log_level=settings.LOG_LEVEL
  )

if __name__ == "__main__":
  start_uvicorn()