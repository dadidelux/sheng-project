import clickhouse_connect
from app.config import settings

def get_clickhouse_client():
    """Get ClickHouse client connection"""
    return clickhouse_connect.get_client(
        host=settings.clickhouse_host,
        port=settings.clickhouse_port,
        username=settings.clickhouse_user,
        password=settings.clickhouse_password,
        database=settings.clickhouse_db
    )
