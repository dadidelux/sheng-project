CREATE DATABASE IF NOT EXISTS poverty_db;

USE poverty_db;

CREATE TABLE IF NOT EXISTS poverty_data (
    -- Primary Key
    hh_id String,

    -- Geographic
    region_name String,
    province_name String,
    city_name String,
    barangay_name String,
    psgc_province UInt64,
    psgc_municipality UInt64,
    psgc_barangay UInt64,
    district String,
    urb_rur UInt8,
    purok_sitio String,

    -- Demographics
    no_of_indiv UInt8,
    no_of_families UInt8,
    no_sleeping_rooms UInt8,
    l_stay UInt16,

    -- Housing
    house_type UInt8,
    roof_mat UInt8,
    out_wall UInt8,
    toilet_facilities UInt8,
    has_electricity UInt8,
    water_supply UInt8,

    -- Assets
    radio UInt8,
    television UInt8,
    ref UInt8,
    motorcycle UInt8,
    phone UInt8,
    pc UInt8,

    -- Program Participation
    received_pppp UInt8,
    received_philhealth UInt8,
    received_scholarship UInt8,
    received_livelihood UInt8,

    -- Target Variables
    poverty_status String,
    poverty_status2 UInt8,
    poor UInt8

) ENGINE = MergeTree()
ORDER BY (province_name, city_name, barangay_name, hh_id)
PARTITION BY province_name;

-- Predictions table
CREATE TABLE IF NOT EXISTS poverty_predictions (
    prediction_id UUID DEFAULT generateUUIDv4(),
    prediction_date DateTime DEFAULT now(),

    -- Input features
    province_name String,
    urb_rur UInt8,
    no_of_indiv UInt8,
    no_sleeping_rooms UInt8,
    house_type UInt8,
    has_electricity UInt8,
    television UInt8,
    ref UInt8,
    motorcycle UInt8,

    -- Prediction output
    predicted_poverty_status UInt8,
    prediction_probability Float32,

    -- Metadata
    model_version String

) ENGINE = MergeTree()
ORDER BY (prediction_date, prediction_id)
PARTITION BY toYYYYMM(prediction_date);
