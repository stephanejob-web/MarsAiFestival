-- Agrandissement de device_os pour éviter l'erreur "Data too long"
ALTER TABLE `jury`
  MODIFY COLUMN `device_os` VARCHAR(100) DEFAULT NULL COMMENT 'OS et version (ex: iOS 17.2)';
