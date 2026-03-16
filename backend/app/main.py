from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import settings
from app.core.rate_limit import limiter
from app.db.base import Base
from app.db.session import engine
from app.routers import admin, auth, health, student, teacher
from seed import run_seed

app = FastAPI(title="Edu Python Platform API", version="0.1.0")
app.state.limiter = limiter


def _rate_limit_handler(request, exc):
    return JSONResponse(status_code=429, content={"detail": "Demasiadas solicitudes"})


app.add_exception_handler(RateLimitExceeded, _rate_limit_handler)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(teacher.router)
app.include_router(student.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    run_seed()

