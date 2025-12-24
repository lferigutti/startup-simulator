import uuid
from datetime import datetime, UTC
from typing import List

from sqlalchemy import String, Text, DateTime, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.models.enum import Role, WorkflowState


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


class SessionModel(Base):
    """
    Stores user simulation sessions.
    Maps to the Session Pydantic model in app/models/session.py
    """
    __tablename__ = "sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
    current_phase: Mapped[str] = mapped_column(String(30), default=WorkflowState.SCENARIOS.value)
    
    # Role profile (stored as JSON once generated)
    role_profile: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # Relationships
    scenario_responses: Mapped[List["ScenarioResponseModel"]] = relationship(
        "ScenarioResponseModel", 
        back_populates="session",
        cascade="all, delete-orphan"
    )
    conversation_messages: Mapped[List["ConversationMessageModel"]] = relationship(
        "ConversationMessageModel",
        back_populates="session",
        cascade="all, delete-orphan"
    )


class ScenarioResponseModel(Base):
    """
    Stores user decisions for each scenario.
    Maps to ScenarioResponse in MVP design doc section 2.4
    """
    __tablename__ = "scenario_responses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("sessions.id"), nullable=False)
    scenario_id: Mapped[str] = mapped_column(String(50), nullable=False)
    choice_id: Mapped[str] = mapped_column(String(50), nullable=False)
    traits: Mapped[list] = mapped_column(JSON, default=list)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(UTC))

    # Relationship
    session: Mapped["SessionModel"] = relationship("SessionModel", back_populates="scenario_responses")


class ConversationMessageModel(Base):
    """
    Stores role voice conversation messages.
    Maps to ConversationMessage in MVP design doc section 2.7
    """
    __tablename__ = "conversation_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("sessions.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(10), nullable=False)  # "user" or "assistant"
    content: Mapped[str] = mapped_column(Text, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(UTC))
    turn_number: Mapped[int] = mapped_column(default=0)

    # Relationship
    session: Mapped["SessionModel"] = relationship("SessionModel", back_populates="conversation_messages")
