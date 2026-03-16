from app.core.security import create_access_token, decode_access_token, hash_password, verify_password


def test_password_hash_roundtrip():
    hashed = hash_password("Secret123*")
    assert verify_password("Secret123*", hashed)


def test_jwt_roundtrip():
    token = create_access_token("1", "estudiante")
    payload = decode_access_token(token)
    assert payload["sub"] == "1"
    assert payload["role"] == "estudiante"

