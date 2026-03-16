import os

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from app.sandbox import SandboxValidationError, execute_in_sandbox, validate_code

app = FastAPI(title="Python Runner", version="0.1.0")

MAX_CODE_SIZE = int(os.getenv("RUNNER_MAX_CODE_SIZE", "5000"))
TIMEOUT_SECONDS = int(os.getenv("RUNNER_TIMEOUT_SECONDS", "4"))
MEMORY_MB = int(os.getenv("RUNNER_MEMORY_MB", "128"))


class ExecuteIn(BaseModel):
    code: str = Field(min_length=1, max_length=20000)


class ExecuteOut(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    timed_out: bool


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/execute", response_model=ExecuteOut)
def execute(payload: ExecuteIn):
    try:
        validate_code(payload.code, MAX_CODE_SIZE)
    except SandboxValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    result = execute_in_sandbox(payload.code, TIMEOUT_SECONDS, MEMORY_MB)
    return ExecuteOut(**result.__dict__)

