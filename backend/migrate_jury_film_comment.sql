CREATE TABLE IF NOT EXISTS `jury_film_comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jury_id` int NOT NULL,
  `film_id` int NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jfc_film` (`film_id`),
  KEY `idx_jfc_jury` (`jury_id`),
  CONSTRAINT `fk_jfc2_jury` FOREIGN KEY (`jury_id`) REFERENCES `jury` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jfc2_film` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
