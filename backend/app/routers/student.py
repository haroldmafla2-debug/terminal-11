from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.clients.runner import execute_python
from app.core.config import settings
from app.core.deps import require_roles
from app.core.rate_limit import limiter
from app.db.session import get_db
from app.models import Activity, CodeVersion, Enrollment, Submission, VersionEvent
from app.schemas import ActivityOut, RunCodeIn, RunCodeOut, SaveCodeIn, SubmissionOut, VersionOut
from app.utils import write_audit

router = APIRouter(prefix="/student", tags=["student"])


def _get_submission(db: Session, activity_id: int, student_id: int) -> Submission:
    submission = (
        db.query(Submission)
        .filter(Submission.activity_id == activity_id, Submission.student_id == student_id)
        .first()
    )
    if submission:
        return submission

    submission = Submission(activity_id=activity_id, student_id=student_id)
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/activities", response_model=list[ActivityOut])
def list_my_activities(
    db: Session = Depends(get_db),
    student=Depends(require_roles("estudiante")),
):
    course_ids = db.query(Enrollment.course_id).filter(Enrollment.student_id == student.id).all()
    ids = [cid[0] for cid in course_ids]
    if not ids:
        return []
    return db.query(Activity).filter(Activity.course_id.in_(ids)).order_by(desc(Activity.created_at)).all()


@router.get("/activities/{activity_id}/submission", response_model=SubmissionOut)
def get_submission(
    activity_id: int,
    db: Session = Depends(get_db),
    student=Depends(require_roles("estudiante")),
):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    submission = _get_submission(db, activity_id, student.id)
    return submission


@router.post("/activities/{activity_id}/save", response_model=SubmissionOut)
def save_submission(
    activity_id: int,
    payload: SaveCodeIn,
    db: Session = Depends(get_db),
    student=Depends(require_roles("estudiante")),
):
    submission = _get_submission(db, activity_id, student.id)
    if submission.editing_locked:
        raise HTTPException(status_code=400, detail="La entrega esta bloqueada")
    if len(payload.code) > settings.max_code_size:
        raise HTTPException(status_code=400, detail="Codigo excede limite")

    submission.code = payload.code
    submission.last_saved_at = datetime.now(timezone.utc)
    db.add(
        CodeVersion(
            submission_id=submission.id,
            event_type=VersionEvent.AUTOSAVE,
            code=payload.code,
            output=submission.latest_output or "",
        )
    )
    db.commit()
    db.refresh(submission)
    write_audit(db, student.id, "save_submission", "submission", str(submission.id))
    return submission


@router.post("/activities/{activity_id}/run", response_model=RunCodeOut)
@limiter.limit("20/minute")
async def run_submission(
    activity_id: int,
    request: Request,
    payload: RunCodeIn,
    db: Session = Depends(get_db),
    student=Depends(require_roles("estudiante")),
):
    submission = _get_submission(db, activity_id, student.id)
    if submission.editing_locked:
        raise HTTPException(status_code=400, detail="La entrega esta bloqueada")
    if len(payload.code) > settings.max_code_size:
        raise HTTPException(status_code=400, detail="Codigo excede limite")

    result = await execute_python(payload.code)
    submission.code = payload.code
    submission.latest_output = f"{result['stdout']}\n{result['stderr']}".strip()
    submission.last_run_at = datetime.now(timezone.utc)
    submission.run_count += 1

    db.add(
        CodeVersion(
            submission_id=submission.id,
            event_type=VersionEvent.RUN,
            code=payload.code,
            output=submission.latest_output,
        )
    )
    db.commit()
    write_audit(db, student.id, "run_code", "submission", str(submission.id), {"exit_code": result["exit_code"]})
    return RunCodeOut(**result)


@router.post("/activities/{activity_id}/submit", response_model=SubmissionOut)
def submit_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    student=Depends(require_roles("estudiante")),
):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    submission = _get_submission(db, activity_id, student.id)
    submission.is_submitted = True
    submission.submitted_at = datetime.now(timezone.utc)
    if activity.lock_after_submit:
        submission.editing_locked = True
    db.add(
        CodeVersion(
            submission_id=submission.id,
            event_type=VersionEvent.SUBMIT,
            code=submission.code,
            output=submission.latest_output,
        )
    )
    db.commit()
    db.refresh(submission)
    write_audit(db, student.id, "submit_activity", "submission", str(submission.id))
    return submission


@router.get("/activities/{activity_id}/versions", response_model=list[VersionOut])
def get_versions(
    activity_id: int,
    db: Session = Depends(get_db),
    student=Depends(require_roles("estudiante")),
):
    submission = _get_submission(db, activity_id, student.id)
    return (
        db.query(CodeVersion)
        .filter(CodeVersion.submission_id == submission.id)
        .order_by(desc(CodeVersion.created_at))
        .limit(100)
        .all()
    )

