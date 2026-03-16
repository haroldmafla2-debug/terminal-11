from datetime import datetime, timezone

from app.core.security import hash_password
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import Course, Enrollment, Role, User


def run_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Seed ya aplicado")
            return

        admin = User(
            username="admin",
            full_name="Administrador",
            password_hash=hash_password("Admin123*"),
            role=Role.ADMIN,
            last_login_at=datetime.now(timezone.utc),
        )
        teacher = User(
            username="profesor1",
            full_name="Profesor Demo",
            password_hash=hash_password("Profesor123*"),
            role=Role.TEACHER,
        )
        student = User(
            username="estudiante1",
            full_name="Estudiante Demo",
            password_hash=hash_password("Estudiante123*"),
            role=Role.STUDENT,
        )
        db.add_all([admin, teacher, student])
        db.commit()
        db.refresh(teacher)
        db.refresh(student)

        course = Course(name="601-A", grade="601", created_by=teacher.id)
        db.add(course)
        db.commit()
        db.refresh(course)

        db.add(Enrollment(course_id=course.id, student_id=student.id))
        db.commit()
        print("Seed aplicado")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
