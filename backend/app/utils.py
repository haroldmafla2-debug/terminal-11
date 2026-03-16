from sqlalchemy.orm import Session

from app.models import AuditLog


def write_audit(db: Session, user_id: int | None, action: str, entity: str, entity_id: str, metadata: dict | None = None):
    log = AuditLog(
        user_id=user_id,
        action=action,
        entity=entity,
        entity_id=entity_id,
        metadata=metadata or {},
    )
    db.add(log)
    db.commit()

