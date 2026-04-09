-- Ajout des champs device pour les notifications push
ALTER TABLE `jury`
  ADD COLUMN `device_name` VARCHAR(100) DEFAULT NULL COMMENT 'Nom du téléphone',
  ADD COLUMN `device_os` VARCHAR(50) DEFAULT NULL COMMENT 'OS et version (ex: iOS 17.2)';
