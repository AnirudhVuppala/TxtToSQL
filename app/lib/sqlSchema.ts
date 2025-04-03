

export const SQL_SCHEMA = `

table provider(rowid INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL)
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(18, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 (sample data (1,AWS,Amazon Web Services))
);
CREATE TABLE Service (
    serviceid INTEGER NOT NULL PRIMARY KEY,
    provider TEXT NOT NULL,
    service TEXT,
    category TEXT,
    virtual BOOLEAN
    (sample data (1,AWS,ATHENA_WORKGROUP,ANALYTICS,false))
);
CREATE TABLE Category (
    categoryid INTEGER NOT NULL PRIMARY KEY,
    provider TEXT,
    service TEXT,
    category TEXT,
    virtual BOOLEAN,
    name TEXT,
    description TEXT
    (sample data(1,(NULL),(NULL),ANALYTICS,(NULL),ANALYTICS,Analytics))
);

CREATE TABLE asset_hub (
    asset_key TEXT NOT NULL PRIMARY KEY,
    parent_asset_key TEXT NULL,
    display_name TEXT,
    domain TEXT NOT NULL,
    region TEXT NULL,
    service TEXT NOT NULL,
    provider TEXT,
    removed BOOLEAN
    (sample data(asset_001,(NULL),Data Storage 1,Storage,us-east-1,S3,AWS,false))
);
CREATE TABLE Compare (
    uid UUID NOT NULL PRIMARY KEY,
    num1 UUID,
    num2 UUID,
    status TEXT,
    playbook UUID,
    date TIMESTAMP WITHOUT TIME ZONE,
    added INTEGER,
    changed INTEGER,
    removed INTEGER,
    name TEXT,
    system BOOLEAN,
    num1_data TIMESTAMP WITHOUT TIME ZONE,
    num2_data TIMESTAMP WITHOUT TIME ZONE,
    user_id UUID,
    expire TIMESTAMP WITH TIME ZONE
    (sample data (111e8400-e29b-41d4-a716-446655440000,222e4567-e89b-12d3-a456-426614174000,222e4567-e89b-12d3-a456-426614174001,Pending,333e8400-e29b-41d4-a716-446655440001,2024-03-28 08:30:00,3,1,2,Analysis1,false,2024-03-28 08:30:00,2024-03-28 09:45:00,444e8400-e29b-41d4-a716-446655440002,2025-01-15 23:59:59+00))
);
CREATE TABLE change_hub (
    change_id BIGINT NOT NULL PRIMARY KEY,
    asset_key TEXT NOT NULL,
    type CHAR(20),
    changes JSON,
    compare_uid UUID,
    date TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (asset_key) REFERENCES asset_hub(asset_key)
    (sample data (1,asset_001,Update,{"field": "status", "old": "Inactive", "new": "Active"},550e8400-e29b-41d4-a716-446655440000,2024-03-28 12:00:00+00))
); 
`
