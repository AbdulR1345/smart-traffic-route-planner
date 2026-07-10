-- Tirukkovilur main junctions as nodes
INSERT INTO nodes (name, location) VALUES 
('Tirukkovilur Bus Stand', ST_SetSRID(ST_MakePoint(79.2089, 11.9654), 4326)),
('Tirukkovilur Railway Station', ST_SetSRID(ST_MakePoint(79.2150, 11.9700), 4326)),
('Ulundurpet Road Junction', ST_SetSRID(ST_MakePoint(79.2200, 11.9600), 4326)),
('Vizhukkam', ST_SetSRID(ST_MakePoint(79.1900, 11.9500), 4326)),
('Veeracholapuram', ST_SetSRID(ST_MakePoint(79.2500, 11.9800), 4326));

-- Connect them with roads. Distance is approximate for now
INSERT INTO roads (name, source_node, target_node, distance_meters, road_quality, safety_score, geometry) VALUES 
('Bus Stand to Railway Station Rd', 1, 2, 1200, 7, 8, ST_SetSRID(ST_MakeLine(ST_MakePoint(79.2089, 11.9654), ST_MakePoint(79.2150, 11.9700)), 4326)),
('Bus Stand to Ulundurpet Rd', 1, 3, 2000, 8, 9, ST_SetSRID(ST_MakeLine(ST_MakePoint(79.2089, 11.9654), ST_MakePoint(79.2200, 11.9600)), 4326)),
('Bus Stand to Vizhukkam Rd', 1, 4, 3500, 6, 6, ST_SetSRID(ST_MakeLine(ST_MakePoint(79.2089, 11.9654), ST_MakePoint(79.1900, 11.9500)), 4326)),
('Railway Station to Veeracholapuram', 2, 5, 4000, 7, 7, ST_SetSRID(ST_MakeLine(ST_MakePoint(79.2150, 11.9700), ST_MakePoint(79.2500, 11.9800)), 4326));