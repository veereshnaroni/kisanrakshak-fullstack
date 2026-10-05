-- ==========================================================
-- KisanRakshak Karnataka - Disaster Resilient Agriculture DB
-- MySQL 8.0 DDL Schema & Initial Seeds
-- ==========================================================

CREATE DATABASE IF NOT EXISTS kisanrakshak CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kisanrakshak;

-- 1. Roles
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT IGNORE INTO roles (id, name) VALUES (1, 'ROLE_FARMER'), (2, 'ROLE_ADMIN');

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(150),
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluk VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- 3. Farmer Profiles
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    kisan_id VARCHAR(50) UNIQUE,
    aadhaar_linked BOOLEAN DEFAULT FALSE,
    total_acreage DECIMAL(6,2) DEFAULT 0.0,
    emergency_contact VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Farms
CREATE TABLE IF NOT EXISTS farms (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluk VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    survey_number VARCHAR(100),
    area_acres DECIMAL(6,2) NOT NULL,
    soil_type ENUM('Black Soil', 'Red Sandy Loam', 'Clayey', 'Alluvial', 'Laterite') NOT NULL,
    irrigation_type ENUM('Borewell', 'Canal', 'Rainfed', 'Drip Irrigation', 'Tank') NOT NULL,
    water_source VARCHAR(255),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    risk_score INT DEFAULT 0,
    risk_category ENUM('LOW', 'MODERATE', 'HIGH', 'SEVERE') DEFAULT 'LOW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Crops
CREATE TABLE IF NOT EXISTS crops (
    id VARCHAR(36) PRIMARY KEY,
    farm_id VARCHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    variety VARCHAR(150),
    area_acres DECIMAL(6,2) NOT NULL,
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE,
    growth_stage ENUM('Germination', 'Vegetative', 'Flowering', 'Pod Formation', 'Maturity / Ready to Harvest') NOT NULL,
    irrigation_method VARCHAR(100),
    crop_condition ENUM('Excellent', 'Good', 'Moderate', 'At Risk') DEFAULT 'Good',
    vulnerabilities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Seed Stocks
CREATE TABLE IF NOT EXISTS seed_stocks (
    id VARCHAR(36) PRIMARY KEY,
    farm_id VARCHAR(36) NOT NULL,
    seed_type VARCHAR(100) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    quantity_kg DECIMAL(8,2) NOT NULL,
    season ENUM('Kharif', 'Rabi', 'Summer') NOT NULL,
    storage_location VARCHAR(255) NOT NULL,
    storage_condition ENUM('Safe & Dry', 'Needs Check', 'Exposed') DEFAULT 'Safe & Dry',
    dry_storage BOOLEAN DEFAULT TRUE,
    elevated_platform BOOLEAN DEFAULT TRUE,
    waterproof_cover BOOLEAN DEFAULT TRUE,
    rodent_proof BOOLEAN DEFAULT TRUE,
    well_ventilated BOOLEAN DEFAULT TRUE,
    last_checked_date DATE,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Water Resources
CREATE TABLE IF NOT EXISTS water_resources (
    id VARCHAR(36) PRIMARY KEY,
    farm_id VARCHAR(36) NOT NULL,
    source_type ENUM('Borewell', 'Open Well', 'Farm Pond (Krishi Honda)', 'Canal', 'Rainwater Storage Tank') NOT NULL,
    source_name VARCHAR(150) NOT NULL,
    capacity_liters BIGINT NOT NULL,
    current_availability_percent INT DEFAULT 100,
    irrigated_area_acres DECIMAL(6,2),
    depth_feet INT,
    status ENUM('Abundant', 'Adequate', 'Critical Low', 'Dry') DEFAULT 'Adequate',
    recharge_structure_working BOOLEAN DEFAULT TRUE,
    last_checked_date DATE,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Livestock
CREATE TABLE IF NOT EXISTS livestock (
    id VARCHAR(36) PRIMARY KEY,
    farm_id VARCHAR(36) NOT NULL,
    animal_type ENUM('Cattle (Cow/Ox)', 'Buffalo', 'Goat', 'Sheep', 'Poultry', 'Other') NOT NULL,
    breed VARCHAR(100),
    count_head INT NOT NULL,
    shelter_type ENUM('Pukka Shed', 'Thatched Roof', 'Open Enclosure') NOT NULL,
    feed_stock_days INT DEFAULT 0,
    water_availability_liters_daily INT DEFAULT 0,
    safety_status ENUM('SAFE', 'AT RISK', 'EVACUATED') DEFAULT 'SAFE',
    vaccinated BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Farm Assets
CREATE TABLE IF NOT EXISTS farm_assets (
    id VARCHAR(36) PRIMARY KEY,
    farm_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category ENUM('Tractor', 'Submersible Pump', 'Sprayer Equipment', 'Solar Panel / Pump', 'Harvester', 'Fertilizer Stock', 'Tool Set') NOT NULL,
    quantity INT DEFAULT 1,
    storage_location VARCHAR(255),
    estimated_value_inr DECIMAL(12,2),
    protection_status ENUM('SAFE', 'AT RISK', 'PROTECTED') DEFAULT 'SAFE',
    secured_against_flood BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Storage Units
CREATE TABLE IF NOT EXISTS storage_units (
    id VARCHAR(36) PRIMARY KEY,
    farm_id VARCHAR(36) NOT NULL,
    unit_name VARCHAR(150) NOT NULL,
    storage_type VARCHAR(100) NOT NULL,
    elevation_cm INT DEFAULT 0,
    is_waterproof_roof BOOLEAN DEFAULT TRUE,
    is_pest_protected BOOLEAN DEFAULT TRUE,
    is_ventilated BOOLEAN DEFAULT TRUE,
    readiness_percentage INT DEFAULT 100,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Disaster Alerts
CREATE TABLE IF NOT EXISTS disaster_alerts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    disaster_type ENUM('HEAVY_RAIN', 'FLOOD', 'DROUGHT', 'HEATWAVE', 'HAILSTORM', 'CYCLONIC_WINDS', 'PEST_SWARM') NOT NULL,
    severity ENUM('WATCH', 'WARNING', 'EMERGENCY') NOT NULL,
    districts JSON NOT NULL,
    taluks JSON NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    description TEXT,
    farm_impact TEXT,
    affected_resources JSON,
    recommended_actions JSON,
    created_by VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- 12. Loss Reports
CREATE TABLE IF NOT EXISTS loss_reports (
    id VARCHAR(36) PRIMARY KEY,
    farmer_id VARCHAR(36) NOT NULL,
    farmer_name VARCHAR(150) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluk VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    farm_name VARCHAR(200),
    disaster_type VARCHAR(100) NOT NULL,
    affected_resource VARCHAR(100) NOT NULL,
    resource_details TEXT,
    damage_description TEXT,
    estimated_loss_inr DECIMAL(12,2) NOT NULL,
    affected_acreage_or_units VARCHAR(100),
    photos_json JSON,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'SUPPORT_PROCESSING', 'COMPLETED') DEFAULT 'SUBMITTED',
    official_remarks TEXT,
    compensation_sanctioned_inr DECIMAL(12,2) DEFAULT 0.0,
    FOREIGN KEY (farmer_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    admin_name VARCHAR(150) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
) ENGINE=InnoDB;

-- Seed Demo Users & Farms
INSERT IGNORE INTO users (id, name, mobile, email, password_hash, role_id, district, taluk, village)
VALUES
('usr-farmer-1', 'Ramesh Kumar', '9845012345', 'ramesh@kisanrakshak.in', '$2a$10$wK1eO7P7vV89dF0mC5p91e779aG2fJ2p2nQ8uC7e2h7k8m1n2o3p', 1, 'Kalaburagi', 'Kalaburagi', 'Sultanpur Village'),
('usr-admin-1', 'Dr. Siddharamaiah M.', '9448099887', 'admin@karnataka.gov.in', '$2a$10$wK1eO7P7vV89dF0mC5p91e779aG2fJ2p2nQ8uC7e2h7k8m1n2o3p', 2, 'Kalaburagi', 'Kalaburagi', 'District Agriculture Complex');

INSERT IGNORE INTO farms (id, user_id, name, district, taluk, village, survey_number, area_acres, soil_type, irrigation_type, water_source, latitude, longitude, risk_score, risk_category)
VALUES
('farm-1', 'usr-farmer-1', 'Shri Lakshmi Organic Farm', 'Kalaburagi', 'Kalaburagi', 'Sultanpur Village', 'Sy. No. 142/2B', 5.2, 'Black Soil', 'Borewell', 'Deep Borewell (450 ft) + Krishi Honda', 17.3297, 76.8343, 38, 'MODERATE');

INSERT IGNORE INTO crops (id, farm_id, name, variety, area_acres, sowing_date, expected_harvest_date, growth_stage, irrigation_method, crop_condition)
VALUES
('crop-1', 'farm-1', 'Tur (Pigeon Pea / ತೊಗರಿ)', 'GRG-811 (UAS Raichur)', 3.5, '2026-06-28', '2026-11-20', 'Flowering', 'Drip & Rainfed', 'Good'),
('crop-2', 'farm-1', 'Jowar (Sorghum / ಜೋಳ)', 'M 35-1 (Maldandi)', 1.7, '2026-07-10', '2026-10-30', 'Pod Formation', 'Protective Irrigation', 'Excellent');
