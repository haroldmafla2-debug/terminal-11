import ast
import os
import resource
import subprocess
import tempfile
from dataclasses import dataclass

DENY_IMPORTS = {
    "os",
    "sys",
    "subprocess",
    "socket",
    "ctypes",
    "multiprocessing",
    "pathlib",
    "shutil",
    "signal",
    "inspect",
    "builtins",
    "importlib",
}


@dataclass
class SandboxResult:
    stdout: str
    stderr: str
    exit_code: int
    timed_out: bool


class SandboxValidationError(Exception):
    pass


def validate_code(code: str, max_size: int):
    if len(code.encode("utf-8")) > max_size:
        raise SandboxValidationError("El codigo excede el tamano maximo")

    try:
        tree = ast.parse(code)
    except SyntaxError as exc:
        raise SandboxValidationError(f"Error de sintaxis: {exc}")

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                name = alias.name.split(".")[0]
                if name in DENY_IMPORTS:
                    raise SandboxValidationError(f"Import no permitido: {name}")
        if isinstance(node, ast.ImportFrom) and node.module:
            root = node.module.split(".")[0]
            if root in DENY_IMPORTS:
                raise SandboxValidationError(f"Import no permitido: {root}")


def _limit_process(memory_mb: int, cpu_seconds: int):
    memory_bytes = memory_mb * 1024 * 1024
    resource.setrlimit(resource.RLIMIT_CPU, (cpu_seconds, cpu_seconds))
    resource.setrlimit(resource.RLIMIT_AS, (memory_bytes, memory_bytes))
    resource.setrlimit(resource.RLIMIT_FSIZE, (1024 * 1024, 1024 * 1024))
    resource.setrlimit(resource.RLIMIT_NOFILE, (32, 32))
    resource.setrlimit(resource.RLIMIT_NPROC, (16, 16))


def execute_in_sandbox(code: str, timeout_seconds: int, memory_mb: int) -> SandboxResult:
    with tempfile.TemporaryDirectory(prefix="runner-") as tmpdir:
        script_path = os.path.join(tmpdir, "main.py")
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(code)

        try:
            proc = subprocess.run(
                ["python", "-I", "-S", script_path],
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                cwd=tmpdir,
                preexec_fn=lambda: _limit_process(memory_mb, timeout_seconds),
            )
            return SandboxResult(
                stdout=proc.stdout[:10000],
                stderr=proc.stderr[:10000],
                exit_code=proc.returncode,
                timed_out=False,
            )
        except subprocess.TimeoutExpired as exc:
            return SandboxResult(
                stdout=(exc.stdout or "")[:10000],
                stderr=((exc.stderr or "") + "\nTiempo excedido")[:10000],
                exit_code=124,
                timed_out=True,
            )

