from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Edu Python Platform"
    database_url: str = "postgresql+psycopg://edu_user:edu_pass@localhost:5432/edu_platform"
    redis_url: str = "redis://localhost:6379/0"
    runner_url: str = "http://localhost:9000"
    jwt_secret: str = "change_me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 480
    cookie_secure: bool = False
    cors_origins: str = "http://localhost:3000"
    max_code_size: int = 5000
    max_executions_per_minute: int = 20


settings = Settings()

