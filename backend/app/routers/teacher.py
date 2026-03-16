import csv
from io import StringIO

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.deps import require_roles
from app.db.session import get_db
from app.models import Activity, CodeVersion, Course, Submission, User
from app.schemas import (
    ActivityCreateIn,
    ActivityOut,
    CourseCreateIn,
    CourseOut,
    SubmissionReviewOut,
    VersionOut,
)
from app.utils import write_audit

router = APIRouter(prefix="/teacher", tags=["teacher"])


@router.post("/courses", response_model=CourseOut)
def create_course(
    payload: CourseCreateIn,
    db: Session = Depends(get_db),
    teacher=Depends(require_roles("profesor", "admin")),
):
    exists = db.query(Course).filter(Course.name == payload.name).first()
    if exists:
        raise HTTPException(status_code=409, detail="El curso ya existe")
    course = Course(name=payload.name, grade=payload.grade, created_by=teacher.id)
    db.add(course)
    db.commit()
    db.refresh(course)
    write_audit(db, teacher.id, "create_course", "course", str(course.id))
    return course


@router.get("/courses", response_model=list[CourseOut])
def list_courses(
    db: Session = Depends(get_db),
    teacher=Depends(require_roles("profesor", "admin")),
):
    return db.query(Course).order_by(Course.name).all()


@router.post("/activities", response_model=ActivityOut)
def create_activity(
    payload: ActivityCreateIn,
    db: Session = Depends(get_db),
    teacher=Depends(require_roles("profesor", "admin")),
):
    course = db.query(Course).filter(Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Curso no encontrado")

    activity = Activity(created_by=teacher.id, **payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    write_audit(db, teacher.id, "create_activity", "activity", str(activity.id))
    return activity


@router.get("/activities", response_model=list[ActivityOut])
def list_activities(
    course_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    teacher=Depends(require_roles("profesor", "admin")),
):
    query = db.query(Activity)
    if course_id:
        query = query.filter(Activity.course_id == course_id)
    return query.order_by(desc(Activity.created_at)).all()


@router.get("/submissions")
def list_submissions(
    course_id: int | None = Query(default=None),
    activity_id: int | None = Query(default=None),
    student_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    teacher=Depends(require_roles("profesor", "admin")),
):
    query = (
        db.query(Submission, User, Activity)
        .join(User, User.id == Submission.student_id)
        .join(Activity, Activity.id == Submission.activity_id)
    )
    if course_id:
        query = query.filter(Activity.course_id == course_id)
    if activity_id:
        query = query.filter(Submission.activity_id == activity_id)
    if student_id:
        query = query.filter(Submission.student_id == student_id)

    rows = query.order_by(desc(Submission.submitted_at), desc(Submission.last_saved_at)).all()
    return [
        SubmissionReviewOut(submission=submission, student=student, activity=activity).model_dump()
        for submission, student, activity in rows
    ]


@router.get("/submissions/export")
def export_submissions_csv(
    course_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    teacher=Depends(require_roles("profesor", "admin")),
):
    query = (
        db.query(Submission, User, Activity)
        .join(User, User.id == Submission.student_id)
        .join(Activity, Activity.id == Submission.activity_id)
    )
    if course_id:
        query = query.filter(Activity.course_id == course_id)

    rows = query.all()

    buffer = StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["submission_id", "student", "activity", "submitted", "submitted_at", "run_count"])
    for submission, student, activity in rows:
        writer.writerow(
            [
                submission.id,
                student.username,
                activity.title,
                submission.is_submitted,
                submission.submitted_at,
                submission.run_count,
            ]
        )

    buffer.seek(0)
    write_audit(db, teacher.id, "export_submissions", "course", str(course_id or "all"))
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=submissions.csv"},
    )


@router.get("/submissions/{submission_id}/versions", response_model=list[VersionOut])
def submission_versions(
    submission_id: int,
    db: Session = Depends(get_db),
    teacher=Depends(require_roles("profesor", "admin")),
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    return (
        db.query(CodeVersion)
        .filter(CodeVersion.submission_id == submission_id)
        .order_by(desc(CodeVersion.created_at))
        .limit(100)
        .all()
    )

