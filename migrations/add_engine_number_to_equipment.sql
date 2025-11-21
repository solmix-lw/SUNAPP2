-- Adds the engine_number column to the equipment table and removes deprecated plant_number
ALTER TABLE equipment
ADD COLUMN IF NOT EXISTS engine_number text;

ALTER TABLE equipment
DROP COLUMN IF EXISTS plant_number;

