from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from app.config import settings


DATABASE_DIR = Path(__file__).resolve().parents[2] / "data"
DATABASE_DIR.mkdir(exist_ok=True)
DATABASE_URL = f"sqlite:///{DATABASE_DIR}/simulator.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=settings.LOG_LEVEL == "debug",
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency injection for database sessions.
    Use with FastAPI's Depends().
    
    Example:
        @router.post("/sessions/create")
        def create_session(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
