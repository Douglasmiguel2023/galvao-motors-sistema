-- Add multiple photos per vehicle. Existing vehicles keep photoUrl as their
-- single photo; the app falls back to photoUrl when photos is empty.
ALTER TABLE "Vehicle" ADD COLUMN "photos" TEXT[] NOT NULL DEFAULT '{}';
