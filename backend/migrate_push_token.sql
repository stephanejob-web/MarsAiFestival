-- Ajout du champ push_token pour les notifications mobiles
ALTER TABLE `jury`
  ADD COLUMN `push_token` VARCHAR(255) DEFAULT NULL COMMENT 'Expo Push Token pour les notifications mobiles';
