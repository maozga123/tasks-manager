from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, model_validator


# ─── Enums ───────────────────────────────────────────────────────────────────

class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Status(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


# ─── Schemas ─────────────────────────────────────────────────────────────────

class TaskBase(BaseModel):
    """Fields shared between create and response."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Short description of the cleaning task",
        examples=["Deep Clean Kitchen"],
    )
    room: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Room or area to be cleaned",
        examples=["Kitchen"],
    )
    priority: Priority = Field(
        default=Priority.medium,
        description="Task urgency level",
    )
    status: Status = Field(
        default=Status.pending,
        description="Current task status",
    )
    last_cleaned: Optional[datetime] = Field(
        default=None,
        description="ISO 8601 timestamp of the last time this task was completed",
    )
    frequency_days: int = Field(
        default=7,
        ge=1,
        le=365,
        description="How often (in days) this task should recur",
        examples=[7, 14, 30],
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "title": "Deep Clean Kitchen",
                    "room": "Kitchen",
                    "priority": "high",
                    "status": "pending",
                    "last_cleaned": None,
                    "frequency_days": 14,
                }
            ]
        }
    }


class TaskCreate(TaskBase):
    """Request body for POST /tasks."""
    pass


class TaskUpdate(BaseModel):
    """Request body for PATCH /tasks/{id} — all fields optional."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    room: Optional[str] = Field(None, min_length=1, max_length=100)
    priority: Optional[Priority] = None
    status: Optional[Status] = None
    last_cleaned: Optional[datetime] = None
    frequency_days: Optional[int] = Field(None, ge=1, le=365)

    @model_validator(mode="after")
    def at_least_one_field(self) -> TaskUpdate:
        if not any(
            v is not None
            for v in [
                self.title,
                self.room,
                self.priority,
                self.status,
                self.last_cleaned,
                self.frequency_days,
            ]
        ):
            raise ValueError("At least one field must be provided for an update")
        return self

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"status": "completed", "last_cleaned": "2026-03-15T19:00:00Z"}
            ]
        }
    }


class TaskResponse(TaskBase):
    """Full task returned from the API (includes server-generated fields)."""

    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
