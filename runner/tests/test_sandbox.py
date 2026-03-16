from app.sandbox import SandboxValidationError, validate_code


def test_blocks_dangerous_import():
    try:
        validate_code("import os\nprint('x')", 5000)
        assert False
    except SandboxValidationError:
        assert True


def test_accepts_basic_code():
    validate_code("print('hola')", 5000)

