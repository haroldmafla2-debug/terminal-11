from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import require_roles
from app.core.security import hash_password
from app.db.session import get_db
from app.models import Enrollment, Role, User
from app.schemas import EnrollmentIn, UserCreateIn, UserOut
from app.utils import write_audit

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/users", response_model=UserOut)
def create_user(
    payload: UserCreateIn,
    db: Session = Depends(get_db),
    admin=Depends(require_roles("admin")),
):
    exists = db.query(User).filter(User.username == payload.username).first()
    if exists:
        raise HTTPException(status_code=409, detail="Usuario ya existe")

    user = User(
        username=payload.username,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        role=Role(payload.role),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    write_audit(db, admin.id, "create_user", "user", str(user.id), {"role": user.role.value})
    return user


@router.post("/enrollments")
def enroll_student(
    payload: EnrollmentIn,
    db: Session = Depends(get_db),
    admin=Depends(require_roles("admin", "profesor")),
):
    student = db.query(User).filter(User.id == payload.student_id).first()
    if not student or student.role != Role.STUDENT:
        raise HTTPException(status_code=400, detail="El usuario no es estudiante")

    exists = (
        db.query(Enrollment)
        .filter(Enrollment.course_id == payload.course_id, Enrollment.student_id == payload.student_id)
        .first()
    )
    if exists:
        return {"ok": True, "message": "Ya estaba inscrito"}

    enrollment = Enrollment(course_id=payload.course_id, student_id=payload.student_id)
    db.add(enrollment)
    db.commit()
    write_audit(db, admin.id, "enroll_student", "course", str(payload.course_id), {"student_id": payload.student_id})
    return {"ok": True}

