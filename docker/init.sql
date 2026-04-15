-- MySQL dump 10.13  Distrib 8.0.44, for macos11.7 (x86_64)
--
-- Host: 127.0.0.1    Database: marsai
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `award`
--

DROP TABLE IF EXISTS `award`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `award` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `cash_prize` varchar(255) DEFAULT NULL,
  `laureat` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `display_rank` int NOT NULL DEFAULT '0',
  `reveal_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_award_laureat` (`laureat`),
  CONSTRAINT `fk_award_laureat` FOREIGN KEY (`laureat`) REFERENCES `film` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `award`
--

LOCK TABLES `award` WRITE;
/*!40000 ALTER TABLE `award` DISABLE KEYS */;
INSERT INTO `award` VALUES (1,'Grand Prix marsAI','Récompense le film le plus abouti artistiquement et techniquement.','5 000 €',3,'2026-03-21 13:19:52','2026-03-21 16:59:30',1,NULL),(2,'Prix du Jury','Coup de cœur des membres du jury international.','2 000 €',41,'2026-03-21 13:19:52','2026-03-21 16:59:30',2,NULL),(3,'Prix de l\'Innovation IA','Film ayant fait l\'usage le plus créatif de l\'intelligence artificielle.','1 500 €',44,'2026-03-21 13:19:52','2026-03-21 16:59:30',3,NULL),(4,'Prix du Mobile','Meilleur film tourné et monté intégralement sur smartphone.','1 000 €',57,'2026-03-21 13:19:52','2026-03-21 16:59:30',4,NULL),(5,'Mention Spéciale','Distinction honorifique décernée par le jury.',NULL,59,'2026-03-21 13:19:52','2026-03-21 16:59:30',5,NULL);
/*!40000 ALTER TABLE `award` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_content`
--

DROP TABLE IF EXISTS `cms_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `header_logo` varchar(500) DEFAULT NULL,
  `hero_video_path` varchar(500) DEFAULT NULL,
  `hero_label` varchar(255) DEFAULT NULL,
  `hero_title` varchar(255) DEFAULT NULL,
  `hero_description` text,
  `hero_content` text,
  `jury_section_label` varchar(255) DEFAULT NULL,
  `jury_section_title` varchar(255) DEFAULT NULL,
  `jury_section_description` text,
  `jury_section_content` text,
  `phase_top50_open_date` datetime DEFAULT NULL,
  `phase_top50_close_date` datetime DEFAULT NULL,
  `phase_award_open_date` datetime DEFAULT NULL,
  `phase_award_close_date` datetime DEFAULT NULL,
  `header_logo_toggle` tinyint(1) NOT NULL DEFAULT '1',
  `hero_video_toggle` tinyint(1) NOT NULL DEFAULT '1',
  `is_jury_list_toggle` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `submission_open_date` datetime DEFAULT NULL,
  `submission_close_date` datetime DEFAULT NULL,
  `ceremony_date` datetime DEFAULT NULL,
  `hero_tag1` varchar(100) DEFAULT NULL,
  `hero_tag2` varchar(100) DEFAULT NULL,
  `hero_tag3` varchar(100) DEFAULT NULL,
  `hero_tag4` varchar(100) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_instagram` varchar(255) DEFAULT NULL,
  `contact_website` varchar(500) DEFAULT NULL,
  `contact_description` text,
  `finalist_count` int NOT NULL DEFAULT '5',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_content`
--

LOCK TABLES `cms_content` WRITE;
/*!40000 ALTER TABLE `cms_content` DISABLE KEYS */;
INSERT INTO `cms_content` VALUES (1,NULL,'/uploads/hero/hero_1774097497036.mp4','marsAI 2027','Le premier festival mondial du cinéma généré par intelligence artificielle.','Voici ce qu\'une IA peut créer. Imaginez ce que vous allez faire.','Soumettre un film',NULL,NULL,NULL,NULL,'2026-03-22 00:00:00','2026-04-12 00:00:00','2026-04-17 00:00:00','2026-05-02 00:00:00',1,1,0,'2026-03-21 12:36:46','2026-03-23 08:38:43','2026-02-21 00:00:00','2026-03-18 00:00:00','2026-05-07 00:00:00','60s chrono','120+ pays','100% gratuit','Prix Marseille','contact@marsai.fr','@marsai.festival','https://marsai.fr','Marseille accueille la première édition de marsAI, festival international dédié aux films créés par ou avec l\'intelligence artificielle.',5);
/*!40000 ALTER TABLE `cms_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collaborator`
--

DROP TABLE IF EXISTS `collaborator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collaborator` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gender` varchar(10) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaborator`
--

LOCK TABLES `collaborator` WRITE;
/*!40000 ALTER TABLE `collaborator` DISABLE KEYS */;
/*!40000 ALTER TABLE `collaborator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collaborator_film`
--

DROP TABLE IF EXISTS `collaborator_film`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collaborator_film` (
  `id` int NOT NULL AUTO_INCREMENT,
  `film_id` int NOT NULL,
  `collaborator_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_collabfilm_film` (`film_id`),
  KEY `fk_collabfilm_collaborator` (`collaborator_id`),
  CONSTRAINT `fk_collabfilm_collaborator` FOREIGN KEY (`collaborator_id`) REFERENCES `collaborator` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_collabfilm_film` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaborator_film`
--

LOCK TABLES `collaborator_film` WRITE;
/*!40000 ALTER TABLE `collaborator_film` DISABLE KEYS */;
/*!40000 ALTER TABLE `collaborator_film` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commentary`
--

DROP TABLE IF EXISTS `commentary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commentary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `commentary` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentary`
--

LOCK TABLES `commentary` WRITE;
/*!40000 ALTER TABLE `commentary` DISABLE KEYS */;
/*!40000 ALTER TABLE `commentary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discussion_message`
--

DROP TABLE IF EXISTS `discussion_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discussion_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `film_id` int NOT NULL,
  `jury_id` int NOT NULL,
  `jury_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jury_initials` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `jury_id` (`jury_id`),
  KEY `idx_film` (`film_id`),
  CONSTRAINT `discussion_message_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE,
  CONSTRAINT `discussion_message_ibfk_2` FOREIGN KEY (`jury_id`) REFERENCES `jury` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discussion_message`
--

LOCK TABLES `discussion_message` WRITE;
/*!40000 ALTER TABLE `discussion_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `discussion_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `film`
--

DROP TABLE IF EXISTS `film`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `film` (
  `id` int NOT NULL AUTO_INCREMENT,
  `realisator_id` int NOT NULL,
  `dossier_num` varchar(20) NOT NULL,
  `original_title` varchar(255) NOT NULL,
  `english_title` varchar(255) DEFAULT NULL,
  `language` varchar(100) NOT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `original_synopsis` text,
  `english_synopsis` text,
  `video_url` text,
  `subtitle_fr_url` text,
  `subtitle_en_url` text,
  `poster_img` varchar(500) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `creative_workflow` text,
  `tech_stack` text,
  `ia_class` enum('full','hybrid') NOT NULL,
  `ia_image` tinyint(1) NOT NULL DEFAULT '0',
  `ia_son` tinyint(1) NOT NULL DEFAULT '0',
  `ia_scenario` tinyint(1) NOT NULL DEFAULT '0',
  `ia_post` tinyint(1) NOT NULL DEFAULT '0',
  `statut` enum('to_review','valide','arevoir','refuse','in_discussion','asked_to_modify','soumis','selectionne','finaliste') NOT NULL DEFAULT 'to_review',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_film_dossier_num` (`dossier_num`),
  KEY `fk_film_realisator` (`realisator_id`),
  CONSTRAINT `fk_film_realisator` FOREIGN KEY (`realisator_id`) REFERENCES `realisator` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `film`
--

LOCK TABLES `film` WRITE;
/*!40000 ALTER TABLE `film` DISABLE KEYS */;
/*!40000 ALTER TABLE `film` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `film_discussion`
--

DROP TABLE IF EXISTS `film_discussion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `film_discussion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `film_id` int NOT NULL,
  `added_by` int NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `film_id` (`film_id`),
  KEY `added_by` (`added_by`),
  CONSTRAINT `film_discussion_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE,
  CONSTRAINT `film_discussion_ibfk_2` FOREIGN KEY (`added_by`) REFERENCES `jury` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `film_discussion`
--

LOCK TABLES `film_discussion` WRITE;
/*!40000 ALTER TABLE `film_discussion` DISABLE KEYS */;
/*!40000 ALTER TABLE `film_discussion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `film_gallery`
--

DROP TABLE IF EXISTS `film_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `film_gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `film_id` int NOT NULL,
  `gallery_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_filmgallery_film` (`film_id`),
  KEY `fk_filmgallery_gallery` (`gallery_id`),
  CONSTRAINT `fk_filmgallery_film` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_filmgallery_gallery` FOREIGN KEY (`gallery_id`) REFERENCES `gallery` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `film_gallery`
--

LOCK TABLES `film_gallery` WRITE;
/*!40000 ALTER TABLE `film_gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `film_gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `global_chat_message`
--

DROP TABLE IF EXISTS `global_chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `global_chat_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jury_id` int DEFAULT NULL,
  `jury_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jury_initials` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `jury_id` (`jury_id`),
  KEY `idx_sent_at` (`sent_at`),
  CONSTRAINT `global_chat_message_ibfk_1` FOREIGN KEY (`jury_id`) REFERENCES `jury` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `global_chat_message`
--

LOCK TABLES `global_chat_message` WRITE;
/*!40000 ALTER TABLE `global_chat_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `global_chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jury`
--

DROP TABLE IF EXISTS `jury`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jury` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('jury','admin','moderateur') NOT NULL DEFAULT 'jury',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_banned` tinyint(1) NOT NULL DEFAULT '0',
  `google_id` varchar(255) DEFAULT NULL,
  `profil_picture` varchar(500) DEFAULT NULL,
  `jury_description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `session_token` varchar(36) DEFAULT NULL,
  `permissions` json DEFAULT NULL,
  `push_token` varchar(255) DEFAULT NULL,
  `device_name` varchar(100) DEFAULT NULL,
  `device_os` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_jury_email` (`email`),
  UNIQUE KEY `uq_jury_google_id` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury`
--

LOCK TABLES `jury` WRITE;
/*!40000 ALTER TABLE `jury` DISABLE KEYS */;
INSERT INTO `jury` VALUES (1,'Admin','marsAI','admin@gmail.com','$2b$12$cgguIR7ieg3UDlxTvKC.0.YiUZ0k8/cbN/zR4BuB7YzimiOZB4W56','admin',1,0,NULL,NULL,NULL,'2026-03-14 18:01:57','2026-03-23 12:31:48','96f8d013-1039-44a4-9ea3-4424147f37d8',NULL,NULL),(2,'Stephane','Job','stephane.job@laplateforme.io','$2b$12$DiLqLtK28tZObNyJleqXoebqdkdm.0/tVFAcYV7MSA9sn7fxChwHC','moderateur',1,0,NULL,'http://localhost:5500/uploads/avatars/1773914434300.jpeg','Développeur fullstack et passionné de cinéma IA.','2026-03-14 18:01:57','2026-03-23 12:24:49','50a87608-d18d-4fd4-8698-61e2edf2389e','{\"can_ban_users\": true, \"can_access_admin\": true, \"can_send_messages\": true, \"can_disable_accounts\": true}',NULL),(3,'Dylan','Blanc','dylan.blanc@laplateforme.io','$2b$12$trw5.vubeW3KW2pWv36Qs.wrjKtwbqWIlaJepmArt7DVEdCMlHjTG','moderateur',1,0,NULL,'/uploads/avatars/1774255515499.jpg','Designer UX et amateur de films expérimentaux.','2026-03-14 18:01:57','2026-03-23 12:28:38','9097fc50-9f26-4657-a06a-8e5ae27af42c','{\"can_ban_users\": false, \"can_access_admin\": false, \"can_manage_users\": false, \"can_send_messages\": false, \"can_disable_accounts\": false}',NULL),(4,'Valerie','Kergonnan','valerie.kergonnan@laplateforme.io','$2b$12$q6OUYAk1/J.GlSK46bvyW.QIfWd5lDWmYuEjJx4qeRQKks/pc6lqe','jury',1,0,NULL,'http://localhost:5500/uploads/avatars/1773928767272.jpg','Réalisatrice et critique de cinéma spécialisée en IA créative.','2026-03-14 18:01:57','2026-03-23 08:45:55',NULL,NULL,NULL),(5,'Jean-Denis','Saucy','jean-denis.saucy@laplateforme.io','$2b$12$UobQogv39UYaDE4HyUjuX.pj957fVqSsPaZ/dXKoa.ZOXz7OEpkjO','moderateur',1,0,NULL,'https://i.pravatar.cc/300?img=33','Producteur indépendant et expert en narration visuelle.','2026-03-14 18:01:57','2026-03-23 12:26:12','5e33bdc5-6c5c-4c3d-b448-4f3084eef8bb','{\"can_ban_users\": true, \"can_access_admin\": true, \"can_send_messages\": true, \"can_disable_accounts\": true}',NULL),(6,'Mickael','Ayilan','mickael.ayilan@laplateforme.io','$2b$12$u6uGm7tv9fW4kD4xsLgHqOxDI5p/8v.ePRK0DoOx1hWocgFqYn0vW','jury',1,0,NULL,'https://i.pravatar.cc/300?img=57','Ingénieur son et compositeur, spécialiste des bandes originales générées par IA.','2026-03-14 18:01:57','2026-03-23 12:11:59','24abcb79-5425-4593-ba93-90d5cba743b9',NULL,NULL);
/*!40000 ALTER TABLE `jury` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jury_film_assignment`
--

DROP TABLE IF EXISTS `jury_film_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jury_film_assignment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jury_id` int NOT NULL,
  `film_id` int NOT NULL,
  `assigned_by` int NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_assignment` (`jury_id`,`film_id`),
  KEY `fk_assign_film` (`film_id`),
  KEY `fk_assign_by` (`assigned_by`),
  CONSTRAINT `fk_assign_by` FOREIGN KEY (`assigned_by`) REFERENCES `jury` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_assign_film` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_assign_jury` FOREIGN KEY (`jury_id`) REFERENCES `jury` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1280 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury_film_assignment`
--

LOCK TABLES `jury_film_assignment` WRITE;
/*!40000 ALTER TABLE `jury_film_assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `jury_film_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jury_film_comment`
--

DROP TABLE IF EXISTS `jury_film_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jury_film_comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jury_id` int NOT NULL,
  `film_id` int NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jfc_film` (`film_id`),
  KEY `idx_jfc_jury` (`jury_id`),
  CONSTRAINT `fk_jfc2_film` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jfc2_jury` FOREIGN KEY (`jury_id`) REFERENCES `jury` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury_film_comment`
--

LOCK TABLES `jury_film_comment` WRITE;
/*!40000 ALTER TABLE `jury_film_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `jury_film_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jury_film_commentary`
--

DROP TABLE IF EXISTS `jury_film_commentary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jury_film_commentary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jury_id` int NOT NULL,
  `film_id` int NOT NULL,
  `commentary_id` int DEFAULT NULL,
  `decision` enum('valide','arevoir','refuse','in_discussion') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `message` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_jury_film` (`jury_id`,`film_id`),
  KEY `fk_jfc_film` (`film_id`),
  KEY `fk_jfc_commentary` (`commentary_id`),
  CONSTRAINT `fk_jfc_commentary` FOREIGN KEY (`commentary_id`) REFERENCES `commentary` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_jfc_film` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_jfc_jury` FOREIGN KEY (`jury_id`) REFERENCES `jury` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury_film_commentary`
--

LOCK TABLES `jury_film_commentary` WRITE;
/*!40000 ALTER TABLE `jury_film_commentary` DISABLE KEYS */;
/*!40000 ALTER TABLE `jury_film_commentary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jury_showcase`
--

DROP TABLE IF EXISTS `jury_showcase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jury_showcase` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `display_role` varchar(255) NOT NULL,
  `badge` varchar(100) NOT NULL DEFAULT 'Membre du Jury',
  `quote` text,
  `photo_url` varchar(500) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury_showcase`
--

LOCK TABLES `jury_showcase` WRITE;
/*!40000 ALTER TABLE `jury_showcase` DISABLE KEYS */;
INSERT INTO `jury_showcase` VALUES (2,'David Fincher','Réalisateur & Producteur','Membre du Jury',NULL,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',0,1,1),(3,'Cédric Jimenez','Réalisateur & Scénariste','Membre du Jury',NULL,'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',0,2,1),(4,'Valérie Donzelli','Réalisatrice & Actrice','Membre du Jury','La création sans frontières est la promesse de l\'IA — c\'est ce que nous voulons voir dans les films de cette édition.','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',0,3,1),(5,'Yann ','Directeur Scientifique Meta AI','Expert IA','L\'intelligence artificielle n\'est pas une menace pour le cinéma — c\'est son prochain chapitre.','https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',1,4,1),(7,'Luc Julia','Co-inventeur de Siri, DG Renault','Expert IA','L\'IA n\'existe pas seule — elle n\'existe qu\'au service de l\'humain et de sa créativité.','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',0,6,0),(8,'Alice Diop','Réalisatrice & Documentariste','Membre du Jury','Le court-métrage IA ouvre des possibilités narratives inédites — j\'ai hâte de les explorer avec vous.','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',0,7,0);
/*!40000 ALTER TABLE `jury_showcase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programme_event`
--

DROP TABLE IF EXISTS `programme_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programme_event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `day` tinyint NOT NULL,
  `event_date` date DEFAULT NULL,
  `time` varchar(5) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `type` enum('opening','projection','masterclass','pause','gala','default') NOT NULL DEFAULT 'default',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programme_event`
--

LOCK TABLES `programme_event` WRITE;
/*!40000 ALTER TABLE `programme_event` DISABLE KEYS */;
INSERT INTO `programme_event` VALUES
-- Mardi 5 mai 2026
(1,1,'2026-05-05','08:30','Accueil & accréditations','Ouverture des portes. Retrait des badges, café d\'accueil et découverte du village IA — stands des partenaires et démos en libre accès.','default',0),
(2,1,'2026-05-05','09:30','Ouverture officielle','Allocution de Leïla Mansouri, présidente du jury, et présentation de la première édition du festival. Avec la participation de la Ville de Marseille et de La Plateforme.','opening',1),
(3,1,'2026-05-05','10:30','Masterclass — Workflow IA : de l\'idée au montage final','Sofia Esposito (directrice artistique, Runway) et David Kühn (réalisateur primé à Sundance) partagent leur pipeline complet : écriture de prompt, génération d\'images, sound design et montage en 60 secondes.','masterclass',2),
(4,1,'2026-05-05','12:15','Pause déjeuner',NULL,'pause',3),
(5,1,'2026-05-05','13:30','Projections — Sélection officielle · Bloc 1 sur 4','Première séance de la compétition internationale. 5 films issus de 5 pays différents. Séance suivie d\'une discussion de 20 min avec les créateurs présents.','projection',4),
(6,1,'2026-05-05','15:00','Table ronde — L\'IA menace-t-elle la créativité humaine ?','Avec Karim Benali (producteur, Paris), Yuki Tanaka (réalisatrice, Tokyo), Marc Devaux (scénariste, Montréal) et Amara Diallo (chercheuse en IA créative, CNRS). Modération : Élise Morin.','masterclass',5),
(7,1,'2026-05-05','16:30','Projections — Sélection officielle · Bloc 2 sur 4','Cinq nouveaux films en compétition. Programme : courts-métrages sélectionnés parmi 3 200 candidatures reçues de 120 pays.','projection',6),
(8,1,'2026-05-05','18:00','Village IA — Démonstrations & rencontres','Stands ouverts au public : Runway, Kling, ElevenLabs, Sora, Adobe Firefly et des studios indépendants. Créez votre propre séquence IA en live avec les équipes techniques.','default',7),
(9,1,'2026-05-05','20:00','Soirée d\'ouverture — DJ set génératif','Performance audiovisuelle pilotée par IA. Visuels génératifs en temps réel synchronisés sur la musique. Entrée libre, cocktail offert aux accrédités.','gala',8),
-- Mercredi 6 mai 2026
(10,2,'2026-05-06','09:00','Projections — Sélection officielle · Bloc 3 sur 4','Troisième séance de compétition. Films sélectionnés avec une attention particulière aux œuvres explorant la mémoire, l\'identité et le temps.','projection',0),
(11,2,'2026-05-06','10:30','Atelier live — Prompt to Screen en 60 minutes','Défi en direct : partant d\'un thème imposé, les participants créent un court-métrage IA de 60 secondes sur scène avec les outils du festival. Guidé par Tom Herschel (IA director, Berlin).','masterclass',1),
(12,2,'2026-05-06','12:15','Pause déjeuner',NULL,'pause',2),
(13,2,'2026-05-06','13:30','Projections — Sélection officielle · Bloc 4 sur 4','Dernière séance de compétition avant délibération. Clôture de la sélection internationale avec les 5 films finalistes les plus attendus.','projection',3),
(14,2,'2026-05-06','15:00','Délibération du jury','Séance à huis clos — le jury international délibère. En parallèle, le vote du public est ouvert en ligne jusqu\'à 17h30. Les résultats seront annoncés lors de la cérémonie.','default',4),
(15,2,'2026-05-06','15:30','Masterclass — Monétiser sa création IA : du festival aux plateformes','Ana Ramos (Sundance Institute Lab) et Pierre-Antoine Gilles (Netflix France) présentent les nouvelles opportunités pour les créateurs IA : distribution, droits, revenus et stratégie de carrière.','masterclass',5),
(16,2,'2026-05-06','17:30','Clôture du vote public','Fermeture officielle du vote en ligne. Dépouillement en direct sur les écrans du festival.','opening',6),
(17,2,'2026-05-06','19:00','Cérémonie des prix','Remise des récompenses en présence du jury international, des réalisateurs finalistes et des partenaires. Prix du jury, Prix du public, Prix de la meilleure direction artistique et Grand Prix Mars.AI.','gala',7),
(18,2,'2026-05-06','20:30','Soirée de clôture — Performance IA live','Performance scénique mêlant danse, musique et visuels génératifs. Installation créée en temps réel par un collectif d\'artistes IA. Cocktail final pour tous les participants.','gala',8);
/*!40000 ALTER TABLE `programme_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `realisator`
--

DROP TABLE IF EXISTS `realisator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `realisator` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gender` varchar(10) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `mobile_phone` varchar(50) NOT NULL,
  `street` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `youtube` varchar(500) DEFAULT NULL,
  `instagram` varchar(500) DEFAULT NULL,
  `linkedin` varchar(500) DEFAULT NULL,
  `facebook` varchar(500) DEFAULT NULL,
  `xtwitter` varchar(500) DEFAULT NULL,
  `how_did_you_know_us` varchar(255) DEFAULT NULL,
  `newsletter` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_realisator_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `realisator`
--

LOCK TABLES `realisator` WRITE;
/*!40000 ALTER TABLE `realisator` DISABLE KEYS */;
/*!40000 ALTER TABLE `realisator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sponsor`
--

DROP TABLE IF EXISTS `sponsor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sponsor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `partnership_statut` enum('main','lead','partner','supporter','premium') DEFAULT NULL,
  `sponsored_award` varchar(255) DEFAULT NULL,
  `sponsor_link` varchar(500) DEFAULT NULL,
  `sponsor_logo` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sponsor`
--

LOCK TABLES `sponsor` WRITE;
/*!40000 ALTER TABLE `sponsor` DISABLE KEYS */;
INSERT INTO `sponsor` VALUES (1,'La Plateforme_','main','Grand Prix marsAI','https://www.la-plateforme.fr','https://www.google.com/s2/favicons?domain=laplateforme.io&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17'),(2,'Mobile Film Festival','lead','Prix du Mobile','https://mobilefilmfestival.com','https://www.google.com/s2/favicons?domain=mobilefilmfestival.com&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17'),(3,'Mistral AI','lead','Prix de l\'Innovation IA','https://mistral.ai','https://www.google.com/s2/favicons?domain=mistral.ai&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17'),(4,'Ville de Marseille','premium',NULL,'https://www.marseille.fr','https://www.google.com/s2/favicons?domain=marseille.fr&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17'),(5,'ARTE','premium','Prix du Documentaire','https://www.arte.tv','https://www.google.com/s2/favicons?domain=arte.tv&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17'),(6,'CNC – Centre National du Cinéma','partner',NULL,'https://www.cnc.fr','https://www.google.com/s2/favicons?domain=cnc.fr&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17'),(7,'Aix-Marseille Université','partner','Prix Académique','https://www.univ-amu.fr','https://www.google.com/s2/favicons?domain=univ-amu.fr&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17'),(8,'France Télévisions','partner',NULL,'https://www.france.tv','https://www.google.com/s2/favicons?domain=france.tv&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17'),(9,'Région Sud','supporter',NULL,'https://www.maregionsud.fr','https://www.google.com/s2/favicons?domain=maregionsud.fr&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17'),(10,'Dailymotion','supporter',NULL,'https://www.dailymotion.com','https://www.google.com/s2/favicons?domain=dailymotion.com&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17'),(11,'Canson','supporter',NULL,'https://www.canson.com','https://www.google.com/s2/favicons?domain=canson.com&sz=256','2026-03-21 12:57:39','2026-03-21 16:08:17');
/*!40000 ALTER TABLE `sponsor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sponsor_award_film`
--

DROP TABLE IF EXISTS `sponsor_award_film`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sponsor_award_film` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sponsor_id` int NOT NULL,
  `award_id` int NOT NULL,
  `film_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_saf_sponsor` (`sponsor_id`),
  KEY `fk_saf_award` (`award_id`),
  KEY `fk_saf_film` (`film_id`),
  CONSTRAINT `fk_saf_award` FOREIGN KEY (`award_id`) REFERENCES `award` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_saf_film` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_saf_sponsor` FOREIGN KEY (`sponsor_id`) REFERENCES `sponsor` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sponsor_award_film`
--

LOCK TABLES `sponsor_award_film` WRITE;
/*!40000 ALTER TABLE `sponsor_award_film` DISABLE KEYS */;
/*!40000 ALTER TABLE `sponsor_award_film` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jury_id` int NOT NULL,
  `film_id` int NOT NULL,
  `type` enum('content','technical','rights','other') NOT NULL DEFAULT 'other',
  `description` text NOT NULL,
  `status` enum('open','in_progress','resolved','rejected') NOT NULL DEFAULT 'open',
  `admin_note` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_ticket_jury` (`jury_id`),
  KEY `fk_ticket_film` (`film_id`),
  CONSTRAINT `fk_ticket_film` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ticket_jury` FOREIGN KEY (`jury_id`) REFERENCES `jury` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vote_tags`
--

DROP TABLE IF EXISTS `vote_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vote_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('refuser','valide','a_revoir','a_discuter') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'refuser',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `message_template` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vote_tags`
--

LOCK TABLES `vote_tags` WRITE;
/*!40000 ALTER TABLE `vote_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `vote_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'marsai'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-23 13:34:34
