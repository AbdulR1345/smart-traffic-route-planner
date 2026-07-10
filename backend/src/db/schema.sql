-- Enable PostGIS for geo queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Intersections = nodes in your graph
CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    location GEOMETRY(Point, 4326), -- lat, lng format
    created_at TIMESTAMP DEFAULT NOW()
);

-- Roads = edges in your graph
CREATE TABLE roads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    source_node INT REFERENCES nodes(id),
    target_node INT REFERENCES nodes(id),
    distance_meters INT,            -- weight for A*
    road_quality INT DEFAULT 5,     -- 1=worst, 10=best, custom weight
    safety_score INT DEFAULT 5,     -- 1=unsafe, 10=safe, custom weight
    geometry GEOMETRY(LineString, 4326), -- actual road shape
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast geo queries
CREATE INDEX idx_nodes_location ON nodes USING GIST(location);
CREATE INDEX idx_roads_geometry ON roads USING GIST(geometry);