from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # ClickHouse
    clickhouse_host: str = "localhost"
    clickhouse_port: int = 8123
    clickhouse_user: str = "admin"
    clickhouse_password: str = "admin123"
    clickhouse_db: str = "poverty_db"

    # API
    api_cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()
