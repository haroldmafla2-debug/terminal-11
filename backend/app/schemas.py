from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from app.models import ActivityStatus, Role, VersionEvent


class TokenOut(BaseModel):
    ok: bool


class UserOut(BaseModel):
    id: int
    username: str
    full_name: str
    role: Role
    last_login_at: datetime | None

    model_config = {"from_attributes": True}


class LoginIn(BaseModel):
    username: str
    password: str


class CourseCreateIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    grade: str = Field(min_length=2, max_length=20)


class CourseOut(BaseModel):
    id: int
    name: str
    grade: str

    model_config = {"from_attributes": True}


class EnrollmentIn(BaseModel):
    course_id: int
    student_id: int


class ActivityCreateIn(BaseModel):
    course_id: int
    title: str = Field(min_length=3, max_length=150)
    description: str = Field(min_length=3)
    due_date: datetime | None = None
    status: ActivityStatus = ActivityStatus.PUBLISHED
    lock_after_submit: bool = True
    exam_mode: bool = False
    exam_minutes: int | None = None
    disable_copy_paste: bool = False
    fullscreen_required: bool = False


class ActivityOut(BaseModel):
    id: int
    course_id: int
    title: str
    description: str
    due_date: datetime | None
    status: ActivityStatus
    lock_after_submit: bool
    exam_mode: bool
    exam_minutes: int | None
    disable_copy_paste: bool
    fullscreen_required: bool

    model_config = {"from_attributes": True}


class SaveCodeIn(BaseModel):
    code: str = Field(max_length=20000)


class RunCodeIn(BaseModel):
    code: str = Field(max_length=20000)


class RunCodeOut(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    timed_out: bool


class SubmissionOut(BaseModel):
    id: int
    activity_id: int
    student_id: int
    code: str
    latest_output: str
    started_at: datetime
    last_saved_at: datetime | None
    last_run_at: datetime | None
    run_count: int
    is_submitted: bool
    submitted_at: datetime | None
    editing_locked: bool

    model_config = {"from_attributes": True}


class SubmissionReviewOut(BaseModel):
    submission: SubmissionOut
    student: UserOut
    activity: ActivityOut


class VersionOut(BaseModel):
    id: int
    event_type: VersionEvent
    code: str
    output: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AuditOut(BaseModel):
    id: int
    action: str
    entity: str
    entity_id: str
    created_at: datetime

    model_config = {"from_attributes": True}


class UserCreateIn(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    full_name: str = Field(min_length=3, max_length=120)
    password: str = Field(min_length=8, max_length=120)
    role: Literal["admin", "profesor", "estudiante"]

