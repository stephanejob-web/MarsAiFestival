-- Migration: add 'moderateur' to jury.role ENUM
-- Run once on the live database:
--   docker exec -it <mysql_container> mysql -u root -p marsai < migrate_role_moderateur.sql

ALTER TABLE jury
MODIFY COLUMN role ENUM('jury', 'admin', 'moderateur') NOT NULL DEFAULT 'jury';
