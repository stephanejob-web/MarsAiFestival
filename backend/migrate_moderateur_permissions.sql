ALTER TABLE jury ADD COLUMN permissions JSON DEFAULT NULL;

-- Initialise les permissions des modérateurs existants avec can_access_admin = true
UPDATE jury
SET permissions = '{"can_access_admin":true,"can_disable_accounts":false,"can_ban_users":false,"can_send_messages":false}'
WHERE role = 'moderateur' AND permissions IS NULL;
