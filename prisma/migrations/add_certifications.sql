-- Add certifications column to Profile table
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "certifications" JSONB;
