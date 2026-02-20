from app.database import get_clickhouse_client

def get_coverage_by_province():
    """Calculate 4Ps coverage by province"""
    client = get_clickhouse_client()

    query = """
        SELECT
            province_name,
            COUNT(*) as total_households,
            SUM(poor) as total_poor,
            SUM(CASE WHEN poor = 1 AND received_pppp = 1 THEN 1 ELSE 0 END) as poor_with_pppp,
            ROUND(SUM(CASE WHEN poor = 1 AND received_pppp = 1 THEN 1 ELSE 0 END) / SUM(poor), 3) as coverage_rate,
            SUM(CASE WHEN poor = 1 AND received_pppp = 0 THEN 1 ELSE 0 END) as unmet_need
        FROM poverty_data
        GROUP BY province_name
        ORDER BY coverage_rate ASC
    """

    result = client.query(query)
    rows = result.result_rows

    return [
        {
            "location": row[0],
            "province_name": row[0],
            "city_name": None,
            "total_households": row[1],
            "total_poor": row[2],
            "poor_with_pppp": row[3],
            "coverage_rate": float(row[4]),
            "unmet_need": row[5]
        }
        for row in rows
    ]

def get_efficiency_by_province():
    """Calculate targeting efficiency by province"""
    client = get_clickhouse_client()

    query = """
        SELECT
            province_name,
            SUM(received_pppp) as total_recipients,
            SUM(CASE WHEN poor = 1 AND received_pppp = 1 THEN 1 ELSE 0 END) as poor_recipients,
            SUM(CASE WHEN poor = 0 AND received_pppp = 1 THEN 1 ELSE 0 END) as nonpoor_recipients,
            ROUND(SUM(CASE WHEN poor = 1 AND received_pppp = 1 THEN 1 ELSE 0 END) / SUM(received_pppp), 3) as targeting_accuracy,
            ROUND(SUM(CASE WHEN poor = 0 AND received_pppp = 1 THEN 1 ELSE 0 END) / SUM(received_pppp), 3) as leakage_rate
        FROM poverty_data
        WHERE received_pppp = 1
        GROUP BY province_name
        ORDER BY leakage_rate DESC
    """

    result = client.query(query)
    rows = result.result_rows

    return [
        {
            "location": row[0],
            "total_recipients": row[1],
            "poor_recipients": row[2],
            "nonpoor_recipients": row[3],
            "targeting_accuracy": float(row[4]),
            "leakage_rate": float(row[5])
        }
        for row in rows
    ]
