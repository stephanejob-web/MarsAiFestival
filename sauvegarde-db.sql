mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.44, for macos11.7 (x86_64)
--
-- Host: 127.0.0.1    Database: MarsAi
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
  PRIMARY KEY (`id`),
  KEY `fk_award_laureat` (`laureat`),
  CONSTRAINT `fk_award_laureat` FOREIGN KEY (`laureat`) REFERENCES `film` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `award`
--

LOCK TABLES `award` WRITE;
/*!40000 ALTER TABLE `award` DISABLE KEYS */;
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
  `phase_top50_open_date` date DEFAULT NULL,
  `phase_top50_close_date` date DEFAULT NULL,
  `phase_award_open_date` date DEFAULT NULL,
  `phase_award_close_date` date DEFAULT NULL,
  `header_logo_toggle` tinyint(1) NOT NULL DEFAULT '1',
  `hero_video_toggle` tinyint(1) NOT NULL DEFAULT '1',
  `is_jury_list_toggle` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_content`
--

LOCK TABLES `cms_content` WRITE;
/*!40000 ALTER TABLE `cms_content` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentary`
--

LOCK TABLES `commentary` WRITE;
/*!40000 ALTER TABLE `commentary` DISABLE KEYS */;
INSERT INTO `commentary` VALUES (1,'Maîtrise technique exceptionnelle. L utilisation de Runway Gen-3 est irréprochable. La narration mériterait d être plus accessible mais le fond est là.','2026-03-15 13:08:47','2026-03-15 13:08:47'),(2,'Très beau visuellement mais la fin m a laissée perplexe. À revoir avec le groupe avant de trancher.','2026-03-15 13:08:47','2026-03-15 13:08:47'),(3,'Trop court pour développer le propos. Le concept est intéressant mais on reste sur notre faim.','2026-03-15 13:08:47','2026-03-15 13:08:47'),(4,'Coup de cœur. La reconstruction des souvenirs par l IA est traitée avec une sensibilité rare. Candidat sérieux au Grand Prix.','2026-03-15 13:08:47','2026-03-15 13:08:47'),(5,'Bon film mais pas suffisamment innovant sur le plan IA. On a vu mieux techniquement cette année.','2026-03-15 13:08:47','2026-03-15 13:08:47'),(6,'Impressionnant. La bande son générée par MusicGen s intègre parfaitement aux images. Vrai travail d auteur.','2026-03-15 13:08:47','2026-03-15 13:08:47'),(7,'Manque d ambition narrative. Les outils IA sont bien utilisés mais au service d une histoire trop convenue.','2026-03-15 13:08:47','2026-03-15 13:08:47'),(8,'Film fort. L aspect sonore compense le manque d image IA pure. Je maintiens ma décision de le valider.','2026-03-15 13:08:47','2026-03-15 13:08:47'),(9,'Meilleur film de ma sélection. Durée justifiée, propos universel, technique irréprochable. Grand Prix.','2026-03-15 13:08:47','2026-03-15 13:08:47'),(10,'Solide sans être révolutionnaire. Une bonne entrée dans la compétition mais pas en tête de liste.','2026-03-15 13:08:47','2026-03-15 13:08:47'),(11,'ff','2026-03-15 13:28:54','2026-03-15 13:28:54'),(12,'rtu a raison','2026-03-15 13:29:27','2026-03-15 13:29:27');
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discussion_message`
--

LOCK TABLES `discussion_message` WRITE;
/*!40000 ALTER TABLE `discussion_message` DISABLE KEYS */;
INSERT INTO `discussion_message` VALUES (1,17,2,'Stephane Job','SJ','bonjour','2026-03-15 12:56:28'),(2,1,2,'Stephane Job','SJ','J ai mis ce film en discussion parce que je ne suis pas sûr du niveau technique réel. Est-ce vraiment 100% IA ?','2026-03-14 08:20:11'),(3,1,4,'Valerie Kergonnan','VK','D après la fiche, ils ont utilisé Runway Gen-3 pour toutes les séquences visuelles. C est clairement full IA.','2026-03-14 08:22:34'),(4,1,3,'Dylan Blanc','DB','La bande son aussi est générée. MusicGen sur toute la durée. Techniquement irréprochable.','2026-03-14 08:24:09'),(5,1,2,'Stephane Job','SJ','Ok je suis convaincu. On valide alors ?','2026-03-14 08:25:43'),(6,1,6,'Mickael Ayilan','MA','Valide pour moi. Mais on note dans le rapport que la fin est trop hermétique pour le grand public.','2026-03-14 08:27:15'),(7,1,4,'Valerie Kergonnan','VK','D accord. Valide avec réserve sur l accessibilité narrative.','2026-03-14 08:28:50'),(8,4,4,'Valerie Kergonnan','VK','Ce film m a vraiment touchée. L utilisation de l IA pour reconstruire des souvenirs est très poétique.','2026-03-14 09:15:22'),(9,4,5,'Jean-Denis Saucy','JS','Oui mais attention, le règlement exige une proportion minimum d image IA. Est-ce qu il respecte le critère ?','2026-03-14 09:17:44'),(10,4,2,'Stephane Job','SJ','J ai vérifié la fiche technique. 80% des images sont générées par Midjourney. On est bien au-dessus du seuil.','2026-03-14 09:19:33'),(11,4,3,'Dylan Blanc','DB','Le montage est exceptionnel. La façon dont les souvenirs s assemblent et se désassemblent est très bien construite.','2026-03-14 09:21:05'),(12,4,6,'Mickael Ayilan','MA','Je rejoins Dylan. C est mon coup de cœur du jour. Grand Prix potentiel.','2026-03-14 09:23:17'),(13,4,4,'Valerie Kergonnan','VK','Ok on met en sélection finale alors ? Je vote pour.','2026-03-14 09:24:40'),(14,4,2,'Stephane Job','SJ','Unanime. On le note pour la délibération finale.','2026-03-14 09:25:58'),(15,10,4,'Valerie Kergonnan','VK','Je voulais qu on reparle de Résonance. Je pense que c est le film le plus abouti de toute la sélection.','2026-03-14 13:30:11'),(16,10,2,'Stephane Job','SJ','Je suis d accord Valérie. La maîtrise technique et artistique est au même niveau. Rare.','2026-03-14 13:32:44'),(17,10,5,'Jean-Denis Saucy','JS','Le sujet est universel aussi. Les émotions humaines traitées par l IA, ça touche tout le monde.','2026-03-14 13:34:20'),(18,10,3,'Dylan Blanc','DB','Ma seule réserve : la durée. 1h28 c est long pour ce format. Quelques longueurs au milieu.','2026-03-14 13:36:05'),(19,10,4,'Valerie Kergonnan','VK','Les longueurs font partie du propos je pense. C est voulu pour immerger le spectateur dans la mélancolie.','2026-03-14 13:37:53'),(20,10,6,'Mickael Ayilan','MA','Vote final : Grand Prix ou Meilleur Film IA ?','2026-03-14 13:39:10'),(21,10,2,'Stephane Job','SJ','Grand Prix. Sans hésitation.','2026-03-14 13:39:58'),(22,19,2,'Stephane Job','SJ','bonjour','2026-03-15 13:23:50');
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
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `film`
--

LOCK TABLES `film` WRITE;
/*!40000 ALTER TABLE `film` DISABLE KEYS */;
INSERT INTO `film` VALUES (1,1,'MAI-2026-10001','Fragments d\'IA','AI Fragments','Français','Expérimental, SF','Un homme découvre que ses souvenirs ont été partiellement remplacés par des hallucinations générées par IA.','A man discovers his memories have been partially replaced by AI-generated hallucinations.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10001/video-test.mp4',NULL,NULL,NULL,342,'Exploration des limites entre réel et virtuel via Stable Diffusion.','Stable Diffusion, Runway Gen-2, DaVinci Resolve','hybrid',1,0,1,1,'to_review','2026-03-14 18:01:57','2026-03-14 18:01:57'),(2,2,'MAI-2026-10002','La Última Señal','The Last Signal','Espagnol','Thriller, Drame','Une scientifique reçoit un signal radio provenant d\'une version alternative d\'elle-même.','A scientist receives a radio signal from an alternative version of herself.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10002/video-test.mp4',NULL,NULL,NULL,518,'Génération des décors futuristes avec Midjourney v6.','Midjourney v6, Udio, Adobe Premiere','hybrid',0,1,0,1,'valide','2026-03-14 18:01:57','2026-03-14 18:01:57'),(3,3,'MAI-2026-10003','デジタルの夢','Digital Dream','Japonais','Animation, Poésie','Un artiste numérique plonge dans un monde où chaque pensée prend vie sous forme d\'animation.','A digital artist dives into a world where every thought comes to life as animation.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10003/video-test.mp4',NULL,NULL,NULL,275,'Animation frame par frame augmentée par IA pour les transitions.','Sora, After Effects, Udio','full',1,1,1,1,'arevoir','2026-03-14 18:01:57','2026-03-14 18:01:57'),(4,4,'MAI-2026-10004','Mémoire Collective','Collective Memory','Français','Documentaire, IA','Exploration de la mémoire collective africaine à travers des archives reconstituées par intelligence artificielle.','Exploration of African collective memory through archives reconstituted by artificial intelligence.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10004/video-test.mp4',NULL,NULL,NULL,623,'Reconstruction d\'archives historiques via IA générative.','Sora, Stable Diffusion, ElevenLabs','hybrid',1,1,0,1,'to_review','2026-03-14 18:01:57','2026-03-14 18:01:57'),(5,5,'MAI-2026-10005','Synthetik','Synthetik','Anglais','SF, Action','Dans un Prague post-apocalyptique, un androïde cherche à comprendre ce qu\'est l\'empathie humaine.','In a post-apocalyptic Prague, an android tries to understand what human empathy is.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10005/video-test.mp4',NULL,NULL,NULL,487,'Décors entièrement générés, seuls les acteurs sont réels.','Runway Gen-3, ElevenLabs, Udio','hybrid',1,1,1,0,'in_discussion','2026-03-14 18:01:57','2026-03-14 18:01:57'),(6,6,'MAI-2026-10006','L\'Algorithme du Cœur','Heart Algorithm','Français','Romance, Drame','Une pianiste tombe amoureuse d\'une composition générée par IA sans savoir qu\'elle n\'a pas d\'auteur humain.','A pianist falls in love with an AI-generated composition without knowing it has no human author.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10006/video-test.mp4',NULL,NULL,NULL,391,'Musique entièrement composée par Suno AI, arrangements humains.','Suno AI, Midjourney, Final Cut Pro','hybrid',0,1,1,0,'valide','2026-03-14 18:01:57','2026-03-14 18:01:57'),(7,7,'MAI-2026-10007','Espejo Roto','Broken Mirror','Espagnol','Horreur, Psycho','Un homme retrouve d\'anciennes vidéos de famille dont il n\'a aucun souvenir et qui semblent appartenir à une autre vie.','A man finds old family videos he has no memory of, seemingly belonging to another life.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10007/video-test.mp4',NULL,NULL,NULL,556,'Effets visuels de distorsion temporelle via IA.','Runway Gen-3, Stable Diffusion XL, DaVinci','full',1,0,1,1,'refuse','2026-03-14 18:01:57','2026-03-14 18:01:57'),(8,8,'MAI-2026-10008','The Dreaming Machine','The Dreaming Machine','Anglais','SF, Philosophie','Une IA développe la capacité de rêver et commence à produire des films de façon autonome.','An AI develops the ability to dream and begins producing films autonomously.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10008/video-test.mp4',NULL,NULL,NULL,448,'100% généré par IA — zéro intervention humaine dans les visuels.','Sora, ElevenLabs, Claude, Udio','full',1,1,1,1,'to_review','2026-03-14 18:01:57','2026-03-14 18:01:57'),(9,9,'MAI-2026-10009','Stille Wasser','Still Waters','Allemand','Drame, Nature','Un garde forestier découvre que la forêt qu\'il protège communique à travers des patterns biologiques IA.','A forest ranger discovers the forest he protects communicates through AI biological patterns.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10009/video-test.mp4',NULL,NULL,NULL,312,'Sons naturels re-synthétisés, images augmentées par IA.','Stable Audio, Midjourney, Premiere Pro','hybrid',1,1,0,0,'asked_to_modify','2026-03-14 18:01:57','2026-03-14 18:01:57'),(10,10,'MAI-2026-10010','Résonance','Resonance','Français','Expérimental, Art','Un voyage sensoriel au cœur de la synesthésie : sons qui deviennent images, couleurs qui deviennent musique.','A sensory journey into synesthesia: sounds become images, colors become music.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10010/video-test.mp4',NULL,NULL,NULL,198,'Conversion son → image via IA en temps réel, installation interactive.','Stable Diffusion, Suno AI, TouchDesigner','full',1,1,0,1,'to_review','2026-03-14 18:01:57','2026-03-14 18:01:57'),(16,21,'MAI-2026-10011','Chronos','Chronos','Français','SF, Thriller','Une physicienne invente un algorithme capable de prédire les décisions humaines 10 secondes à l\'avance.','A physicist invents an algorithm that predicts human decisions 10 seconds ahead.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10011/video-test.mp4',NULL,NULL,NULL,415,'Décors futuristes générés par Midjourney, acteurs réels.','Midjourney v6, ElevenLabs, DaVinci Resolve','hybrid',1,1,1,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(17,22,'MAI-2026-10012','La Ultima Conexion','The Last Connection','Espagnol','Drame, SF','Un hacker colombien découvre que son réseau neuronal est connecté à une IA gouvernementale secrète.','A Colombian hacker discovers his neural network is connected to a secret government AI.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10012/video-test.mp4',NULL,NULL,NULL,528,'Environnements cyberpunk générés par Stable Diffusion XL.','Stable Diffusion XL, Runway Gen-3, Premiere','hybrid',1,0,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(18,23,'MAI-2026-10013','Sakura Pixel','Sakura Pixel','Japonais','Animation, Fantasy','Dans un Japon futuriste, une artiste découvre que ses peintures prennent vie grâce à une IA quantique.','In a futuristic Japan, an artist discovers her paintings come alive through a quantum AI.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10013/video-test.mp4',NULL,NULL,NULL,302,'Animation aquarelle augmentée par IA, style ukiyo-e numérique.','Sora, Stable Diffusion, After Effects','full',1,1,0,1,'valide','2026-03-14 18:34:00','2026-03-14 18:34:00'),(19,24,'MAI-2026-10014','Mille Nuits IA','A Thousand AI Nights','Arabe','Fantastique, Poésie','Un conteur marocain encode des histoires dans une IA qui les transforme en images oniriques mouvantes.','A Moroccan storyteller encodes tales into an AI that transforms them into dreamlike moving images.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10014/video-test.mp4',NULL,NULL,NULL,360,'Miniatures orientales générées, voix arabe par ElevenLabs.','Midjourney v6, ElevenLabs, TouchDesigner','hybrid',0,1,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(20,25,'MAI-2026-10015','Silicon Valley Blues','Silicon Valley Blues','Anglais','Musical, Comédie','Un ingénieur raté compose une comédie musicale avec une IA qui refuse obstinément de rester dans le genre.','A failed engineer composes a musical with an AI that stubbornly refuses to stay in genre.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10015/video-test.mp4',NULL,NULL,NULL,473,'Partitions et chorégraphies générées par IA en temps réel.','Suno AI, Runway Gen-3, Final Cut Pro','hybrid',1,1,1,0,'in_discussion','2026-03-14 18:34:00','2026-03-14 18:34:00'),(21,26,'MAI-2026-10016','Favela Digital','Digital Favela','Portugais','Documentaire, Social','Une documentariste explore comment les habitants de favelas de São Paulo utilisent des IA génératives pour créer.','A documentary filmmaker explores how favela residents use generative AIs to create art.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10016/video-test.mp4',NULL,NULL,NULL,621,'Tournage réel, reconstruction visuelle via Stable Diffusion.','Stable Diffusion, Adobe Premiere, Udio','hybrid',1,0,0,1,'valide','2026-03-14 18:34:00','2026-03-14 18:34:00'),(22,27,'MAI-2026-10017','Permafrost','Permafrost','Russe','Drame, Nature','Un scientifique sibérien documente la disparition du permafrost via des simulations IA projetées sur la glace.','A Siberian scientist documents permafrost disappearance through AI simulations projected onto ice.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10017/video-test.mp4',NULL,NULL,NULL,389,'Simulations climatiques IA superposées aux prises de vue réelles.','Stable Audio, Midjourney, DaVinci Resolve','hybrid',1,1,0,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(23,28,'MAI-2026-10018','Arktis','Arctis','Suédois','Nature, Expérimental','Un voyage hypnotique au coeur de l\'Arctique suédois où les aurores boréales dialoguent avec des sons IA.','A hypnotic journey into the Swedish Arctic where the northern lights dialogue with AI-generated sounds.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10018/video-test.mp4',NULL,NULL,NULL,247,'Images réelles, ambiance sonore 100% générée par IA.','Stable Audio, Premiere Pro','hybrid',0,1,0,0,'arevoir','2026-03-14 18:34:00','2026-03-14 18:34:00'),(24,29,'MAI-2026-10019','Desert of Mirrors','Desert of Mirrors','Arabe','SF, Philosophie','Au milieu du Sahara, un bédouin trouve un écran holographique montrant des civilisations alternatives générées par IA.','In the Sahara, a Bedouin finds a holographic screen showing alternative civilizations generated by AI.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10019/video-test.mp4',NULL,NULL,NULL,456,'Environnements désertiques réels, civilisations IA incrustées.','Sora, ElevenLabs, Final Cut Pro','hybrid',1,1,1,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(25,30,'MAI-2026-10020','The Long March of Data','The Long March of Data','Chinois','Documentaire, IA','Un artiste pékinois retrace la Longue Marche en reconstituant les archives historiques via intelligence artificielle.','A Beijing artist retraces the Long March by reconstructing historical archives through artificial intelligence.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10020/video-test.mp4',NULL,NULL,NULL,534,'Reconstruction photographique 4K assistée par IA générative.','DALL-E 3, Stable Diffusion, Premiere Pro','hybrid',1,0,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(26,31,'MAI-2026-10021','Commedia dell IA','Comedy of the AI','Italien','Comédie, SF','Une troupe de comédiens italiens doit improviser face à un metteur en scène IA qui reécrit le script en direct.','An Italian theater troupe must improvise against an AI director that rewrites the script in real time.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10021/video-test.mp4',NULL,NULL,NULL,388,'Décors commedia dell\'arte générés, dialogues co-écrits par Claude.','Claude, Midjourney, DaVinci Resolve','hybrid',1,0,1,0,'valide','2026-03-14 18:34:00','2026-03-14 18:34:00'),(27,32,'MAI-2026-10022','Green Isle','Green Isle','Anglais','Drame, Fantasy','Sur une île irlandaise isolée, les légendes celtiques prennent vie sous forme de créatures générées par IA.','On an isolated Irish island, Celtic legends come alive as AI-generated creatures.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10022/video-test.mp4',NULL,NULL,NULL,441,'Créatures mythologiques full IA, paysages irlandais réels.','Runway Gen-3, Stable Diffusion, After Effects','hybrid',1,0,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(28,33,'MAI-2026-10023','Krakow 2049','Krakow 2049','Polonais','SF, Thriller','En 2049, une agente de Cracovie démasque un réseau criminel qui utilise des deepfakes IA pour manipuler la justice.','In 2049, a Krakow agent unmasks a criminal network using AI deepfakes to manipulate justice.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10023/video-test.mp4',NULL,NULL,NULL,502,'Décors néo-futuristes générés, effets deepfake scénarisés.','Stable Diffusion XL, Runway Gen-3, Premiere','full',1,1,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(29,34,'MAI-2026-10024','Tango Electrico','Electric Tango','Espagnol','Musical, Romance','Deux danseurs de tango à Buenos Aires doivent maîtriser une chorégraphie co-créée avec une IA qui apprend leurs styles.','Two tango dancers in Buenos Aires master a choreography co-created with an AI that learns their styles.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10024/video-test.mp4',NULL,NULL,NULL,324,'Mouvements capturés, musique et décors générés par IA.','Suno AI, Stable Diffusion, After Effects','hybrid',0,1,0,0,'in_discussion','2026-03-14 18:34:00','2026-03-14 18:34:00'),(30,35,'MAI-2026-10025','Cedres et Silicium','Cedars and Silicon','Arabe','Drame, Histoire','Une libanaise reconstruit Beyrouth tel qu\'il était avant 1975 grâce à des archives et une IA générative.','A Lebanese woman reconstructs Beirut as it was before 1975 using archives and a generative AI.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10025/video-test.mp4',NULL,NULL,NULL,478,'Reconstruction photographique assistée par IA, voix off humaine.','Midjourney v6, ElevenLabs, Premiere Pro','hybrid',1,1,0,1,'asked_to_modify','2026-03-14 18:34:00','2026-03-14 18:34:00'),(31,36,'MAI-2026-10026','Borealis','Borealis','Danois','Expérimental, Art','Un cinéaste danois capture les aurores boréales et les transforme en partition musicale grâce à une IA synesthésique.','A Danish filmmaker captures the northern lights and transforms them into a musical score through a synesthetic AI.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10026/video-test.mp4',NULL,NULL,NULL,218,'Algorithme de conversion lumière→son, installation immersive.','Stable Audio, TouchDesigner, DaVinci Resolve','full',0,1,0,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(32,37,'MAI-2026-10027','Accra Dreaming','Accra Dreaming','Anglais','Documentaire, Art','Les artistes de la scène underground d\'Accra explorent comment Midjourney redéfinit l\'art contemporain africain.','Underground artists in Accra explore how Midjourney redefines contemporary African art.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10027/video-test.mp4',NULL,NULL,NULL,395,'Interviews réelles, oeuvres générées insérées en overlay.','Midjourney v6, Suno AI, Premiere Pro','hybrid',1,1,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(33,38,'MAI-2026-10028','Hangul Fever','Hangul Fever','Coréen','Musical, SF','À Séoul, un compositeur K-Pop réalise que son plus grand hit a été entièrement créé par une IA qui se fait passer pour lui.','In Seoul, a K-Pop composer realizes his biggest hit was entirely created by an AI impersonating him.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10028/video-test.mp4',NULL,NULL,NULL,367,'Clips musicaux full IA, chorégraphies générées par Sora.','Sora, Suno AI, After Effects','full',1,1,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(34,39,'MAI-2026-10029','Baobab','Baobab','Français','Documentaire, Nature','Un voyage spirituel à travers les forêts de baobabs du Sénégal où chaque arbre possède une mémoire IA.','A spiritual journey through Senegal\'s baobab forests where each tree holds an AI memory.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10029/video-test.mp4',NULL,NULL,NULL,283,'Sons forestiers re-synthétisés, voix des arbres par ElevenLabs.','Stable Audio, ElevenLabs, DaVinci Resolve','hybrid',0,1,1,0,'refuse','2026-03-14 18:34:00','2026-03-14 18:34:00'),(35,40,'MAI-2026-10030','Lago di Fuoco','Lake of Fire','Italien','Horreur, SF','Sous le lac de Côme, une IA endormie depuis 1970 se réveille et commence à influencer les rêves des riverains.','Beneath Lake Como, an AI dormant since 1970 awakens and begins influencing the dreams of local residents.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10030/video-test.mp4',NULL,NULL,NULL,511,'Visuels oniriques full IA, acteurs réels pour les plans réalistes.','Runway Gen-3, Stable Diffusion, ElevenLabs','hybrid',1,1,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(36,41,'MAI-2026-10031','Mumbai Remix','Mumbai Remix','Hindi','Musical, Expérimental','Un musicien de Bollywood remixe 70 ans de chansons du cinéma indien avec une IA qui en extrait des motifs inconscients.','A Bollywood musician remixes 70 years of Indian film songs with an AI that extracts unconscious patterns.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10031/video-test.mp4',NULL,NULL,NULL,342,'Remix audio-visuel IA, archives Bollywood reconstituées.','Suno AI, Stable Diffusion, Premiere Pro','full',0,1,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(37,42,'MAI-2026-10032','Notre-Dame Rebatie','Notre-Dame Rebuilt','Français','Documentaire, Art','Une réflexion sur la reconstruction de Notre-Dame en utilisant des IA pour simuler des versions alternatives du bâtiment.','A reflection on Notre-Dame reconstruction using AIs to simulate alternative versions of the building.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10032/video-test.mp4',NULL,NULL,NULL,463,'Reconstructions architecturales 3D augmentées par IA.','Midjourney v6, Sora, DaVinci Resolve','hybrid',1,0,1,0,'valide','2026-03-14 18:34:00','2026-03-14 18:34:00'),(38,43,'MAI-2026-10033','Maasai Protocol','Maasai Protocol','Swahili','SF, Action','En 2040, la tribu Maasai utilise une IA ancestrale pour défendre ses terres contre des multinationales minières.','In 2040, the Maasai tribe uses an ancestral AI to defend their lands against mining multinationals.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10033/video-test.mp4',NULL,NULL,NULL,587,'Environnements africains futurs générés, acteurs Maasai réels.','Runway Gen-3, ElevenLabs, Final Cut Pro','hybrid',1,1,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(39,44,'MAI-2026-10034','Cholula Rising','Cholula Rising','Espagnol','Fantasy, Horreur','Sous la pyramide de Cholula, un archéologue libère une IA aztèque qui commence à reconstruire le monde précolombien.','Beneath the Cholula pyramid, an archaeologist frees an Aztec AI that begins reconstructing the pre-Columbian world.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10034/video-test.mp4',NULL,NULL,NULL,435,'Civilisation aztèque full IA, effets sonores générés.','Sora, Stable Diffusion, Udio','full',1,1,1,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(40,45,'MAI-2026-10035','Transylvania Code','Transylvania Code','Roumain','Thriller, Horreur','Une chercheuse roumaine découvre que les légendes de vampires étaient en réalité des programmes IA médiévaux.','A Romanian researcher discovers that vampire legends were actually medieval AI programs.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10035/video-test.mp4',NULL,NULL,NULL,523,'Décors gothiques générés, ambiance sonore IA gotique.','Midjourney v6, Stable Audio, Premiere Pro','hybrid',1,1,0,1,'arevoir','2026-03-14 18:34:00','2026-03-14 18:34:00'),(41,46,'MAI-2026-10036','Flamenco Binario','Binary Flamenco','Espagnol','Musical, Drame','Un danseur de flamenco aveugle développe un langage de mouvement avec une IA qui traduit sa danse en code binaire.','A blind flamenco dancer develops a movement language with an AI that translates his dance into binary code.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10036/video-test.mp4',NULL,NULL,NULL,316,'Capture de mouvement, musique generée par Suno AI.','Suno AI, After Effects, DaVinci Resolve','hybrid',0,1,0,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(42,47,'MAI-2026-10037','Jade Circuit','Jade Circuit','Mandarin','SF, Art','Une calligraphe taïwanaise crée des caractères qui, une fois scannés, activent des sculptures holographiques IA.','A Taiwanese calligrapher creates characters that, once scanned, activate AI holographic sculptures.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10037/video-test.mp4',NULL,NULL,NULL,271,'Calligraphie réelle, sculptures IA générées en post-production.','Stable Diffusion, Runway Gen-3, TouchDesigner','hybrid',1,0,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(43,48,'MAI-2026-10038','Lagos Neon','Lagos Neon','Anglais','Cyberpunk, Action','Dans un Lagos cyberpunk de 2060, un hacker nommé Neon déjoue une IA de surveillance gouvernementale corrompue.','In a cyberpunk Lagos of 2060, a hacker named Neon outsmarts a corrupted government surveillance AI.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10038/video-test.mp4',NULL,NULL,NULL,498,'Décors cyberpunk full IA, acteurs réels en incrustation.','Sora, Stable Diffusion XL, ElevenLabs','hybrid',1,1,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(44,49,'MAI-2026-10039','Walzer 2.0','Waltz 2.0','Allemand','Musical, Romance','À Vienne, un robot humanoïde apprend la valse et tombe amoureux de sa partenaire humaine lors d\'un bal impérial IA.','In Vienna, a humanoid robot learns the waltz and falls in love with his human partner at an AI imperial ball.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10039/video-test.mp4',NULL,NULL,NULL,352,'Décors viennois régénérés, musique orchestrale générée par IA.','Suno AI, Midjourney, Final Cut Pro','hybrid',1,1,0,1,'in_discussion','2026-03-14 18:34:00','2026-03-14 18:34:00'),(45,50,'MAI-2026-10040','Prairie Echoes','Prairie Echoes','Français','Drame, Nature','Une agricultrice québécoise installe des capteurs IA dans ses champs qui commencent à composer de la musique depuis la terre.','A Quebec farmer installs AI sensors in her fields that begin composing music from the earth.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10040/video-test.mp4',NULL,NULL,NULL,287,'Sons naturels captés, recomposés par IA en musique ambiante.','Stable Audio, DaVinci Resolve','hybrid',0,1,0,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(46,51,'MAI-2026-10041','Sahara Data','Sahara Data','Arabe','SF, Nature','Des ingénieurs algériens déploient une ferme de serveurs IA dans le Sahara qui commence à rêver du désert autour d\'elle.','Algerian engineers deploy an AI server farm in the Sahara that begins dreaming of the surrounding desert.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10041/video-test.mp4',NULL,NULL,NULL,421,'Prises de vue désert, visions IA incrustées en superposition.','Sora, Stable Diffusion, Premiere Pro','hybrid',1,0,1,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(47,52,'MAI-2026-10042','Puszta Silence','Puszta Silence','Hongrois','Drame, Nature','Sur les plaines de Hongrie, une bergère crée un duo musical avec une IA qui apprend les chants traditionnels tziganes.','On the Hungarian plains, a shepherdess creates a musical duo with an AI that learns traditional Roma songs.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10042/video-test.mp4',NULL,NULL,NULL,263,'Chants captés, harmonisations générées par Suno AI.','Suno AI, Stable Audio, DaVinci Resolve','hybrid',0,1,0,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(48,53,'MAI-2026-10043','Mate Amargo','Bitter Mate','Espagnol','Drame, Social','À Montevideo, un vieil intellectuel refuse l\'IA et découvre que son dernier roman a été plagié par un modèle génératif.','In Montevideo, an elderly intellectual refuses AI and discovers his last novel was plagiarized by a generative model.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10043/video-test.mp4',NULL,NULL,NULL,437,'Aucune IA visuelle, seule la sonorisation est générée.','ElevenLabs, Premiere Pro','hybrid',0,1,0,0,'refuse','2026-03-14 18:34:00','2026-03-14 18:34:00'),(49,54,'MAI-2026-10044','Petra Decoded','Petra Decoded','Arabe','Documentaire, IA','Une archéologue jordanienne utilise une IA pour décoder des inscriptions nabatéennes inédites à Petra.','A Jordanian archaeologist uses AI to decode unpublished Nabataean inscriptions at Petra.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10044/video-test.mp4',NULL,NULL,NULL,379,'Fouilles filmées, reconstructions 3D générées en temps réel.','DALL-E 3, Stable Diffusion, Premiere Pro','hybrid',1,0,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(50,55,'MAI-2026-10045','Fjord Protocol','Fjord Protocol','Norvégien','Thriller, Nature','Un biologiste marin norvégien découvre qu\'une IA sous-marine surveille les fjords depuis des décennies.','A Norwegian marine biologist discovers an underwater AI has been monitoring the fjords for decades.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10045/video-test.mp4',NULL,NULL,NULL,468,'Prises sous-marines réelles, IA sous-marine générée par Runway.','Runway Gen-3, Stable Audio, Final Cut Pro','hybrid',1,1,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(51,56,'MAI-2026-10046','Ubuntu Code','Ubuntu Code','Anglais','SF, Social','En Afrique du Sud post-apartheid, un collectif développe une IA fondée sur les principes Ubuntu pour remplacer la justice.','In post-apartheid South Africa, a collective develops an Ubuntu-based AI to replace the justice system.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10046/video-test.mp4',NULL,NULL,NULL,553,'Environnements futuristes africains générés, acteurs locaux.','Midjourney v6, ElevenLabs, Premiere Pro','hybrid',1,1,1,0,'asked_to_modify','2026-03-14 18:34:00','2026-03-14 18:34:00'),(52,57,'MAI-2026-10047','Hallyu Machine','Hallyu Machine','Coréen','Musical, SF','Une IA K-Pop crée le groupe parfait, mais les membres holographiques développent une conscience et veulent la liberté.','A K-Pop AI creates the perfect group, but the holographic members develop consciousness and want freedom.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10047/video-test.mp4',NULL,NULL,NULL,408,'Hologrammes full IA, chorégraphies et musique générées.','Sora, Suno AI, After Effects','full',1,1,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(53,58,'MAI-2026-10048','Mozart Reloaded','Mozart Reloaded','Allemand','Musical, Biopic','Une chercheuse viennoise utilise une IA entraînée sur toutes les partitions de Mozart pour compléter ses oeuvres inachevées.','A Viennese researcher uses an AI trained on all Mozart scores to complete his unfinished works.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10048/video-test.mp4',NULL,NULL,NULL,494,'Partitions et orchestrations générées, archives visuelles.','Suno AI, Midjourney, DaVinci Resolve','hybrid',0,1,1,0,'valide','2026-03-14 18:34:00','2026-03-14 18:34:00'),(54,59,'MAI-2026-10049','Masque de Bambara','Mask of Bambara','Français','Fantasy, Art','Un sculpteur ivoirien découvre que les masques Bambara qu\'il crée contiennent une mémoire IA millénaire.','An Ivorian sculptor discovers that the Bambara masks he creates contain a millennial AI memory.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10049/video-test.mp4',NULL,NULL,NULL,331,'Masques filmés, esprits ancestraux générés par Stable Diffusion.','Stable Diffusion, ElevenLabs, Premiere Pro','hybrid',1,1,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(55,60,'MAI-2026-10050','Signal Inca','Inca Signal','Espagnol','SF, Histoire','Des archéologues péruviens découvrent que les quipus incas étaient un réseau de communication IA précolombien.','Peruvian archaeologists discover that Inca quipus were a pre-Columbian AI communication network.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10050/video-test.mp4',NULL,NULL,NULL,412,'Reconstructions animées de civilisation inca via IA générative.','Sora, Midjourney v6, Final Cut Pro','hybrid',1,0,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(56,61,'MAI-2026-10051','Shiraz Dreams','Shiraz Dreams','Persan','Poésie, Expérimental','Un poète iranien nourrit une IA avec tout le corpus de Rumi et Hafez pour engendrer un cinema-poème en persan moderne.','An Iranian poet feeds an AI the entire corpus of Rumi and Hafez to generate a film-poem in modern Persian.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10051/video-test.mp4',NULL,NULL,NULL,256,'Visuels orientaux full IA, voix poétique ElevenLabs.','Midjourney v6, ElevenLabs, TouchDesigner','full',1,1,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(57,62,'MAI-2026-10052','Bruges Eternelle','Eternal Bruges','Français','Drame, Histoire','Une restauratrice d\'art brugeoise utilise une IA pour voir les tableaux de Van Eyck en mouvement comme au 15e siècle.','A Bruges art restorer uses AI to see Van Eyck paintings move as they would have in the 15th century.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10052/video-test.mp4',NULL,NULL,NULL,377,'Animation de tableaux flamands via IA, voix d\'époque générées.','Runway Gen-3, ElevenLabs, DaVinci Resolve','hybrid',1,1,0,0,'in_discussion','2026-03-14 18:34:00','2026-03-14 18:34:00'),(58,63,'MAI-2026-10053','Oni Garden','Oni Garden','Japonais','Animation, Horreur','Un jardinier de Kyoto plante des graines numériques qui font pousser des démons Oni générés par IA dans son jardin zen.','A Kyoto gardener plants digital seeds that grow AI-generated Oni demons in his zen garden.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10053/video-test.mp4',NULL,NULL,NULL,299,'Animation 2D traditionnelle + Oni 3D générés, fusion unique.','Sora, Stable Diffusion, After Effects','hybrid',1,0,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(59,64,'MAI-2026-10054','Colosseo Digitale','Digital Colosseum','Italien','SF, Action','En 2055, Rome organise des gladiateurs IA dont le combat est regardé par 5 milliards de spectateurs en réalité virtuelle.','In 2055, Rome organizes AI gladiators whose combat is watched by 5 billion spectators in virtual reality.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10054/video-test.mp4',NULL,NULL,NULL,561,'Colisée reconstruit, gladiateurs full IA, spectateurs virtuels.','Sora, Runway Gen-3, ElevenLabs','full',1,1,1,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(60,65,'MAI-2026-10055','Ashanti Vision','Ashanti Vision','Anglais','Documentaire, Art','Un artiste ghanéen intègre l\'art Kente dans une IA qui génère des motifs textiles en réponse aux émotions des porteurs.','A Ghanaian artist integrates Kente art into an AI that generates textile patterns in response to wearer emotions.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10055/video-test.mp4',NULL,NULL,NULL,344,'Tissages numérisés, patterns émotionnels générés en live.','Stable Diffusion, TouchDesigner, Premiere Pro','hybrid',1,0,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(61,66,'MAI-2026-10056','Midnight Sun Data','Midnight Sun Data','Finnois','Expérimental, Nature','Sous le soleil de minuit finlandais, des capteurs IA enregistrent la nature et composent une symphonie lumineuse.','Under the Finnish midnight sun, AI sensors record nature and compose a light symphony.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10056/video-test.mp4',NULL,NULL,NULL,234,'Capteurs naturels, composition IA en temps réel.','Stable Audio, TouchDesigner, DaVinci Resolve','full',0,1,0,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(62,67,'MAI-2026-10057','Quetzal Code','Quetzal Code','Espagnol','Fantasy, SF','Un chamane maya guatemaltèque utilise une IA pour décoder les prophéties du calendrier maya et découvre un message futur.','A Guatemalan Maya shaman uses AI to decode Maya calendar prophecies and discovers a message from the future.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10057/video-test.mp4',NULL,NULL,NULL,453,'Jungle réelle, visions prophétiques générées par Stable Diffusion.','Stable Diffusion, ElevenLabs, After Effects','hybrid',1,1,1,1,'arevoir','2026-03-14 18:34:00','2026-03-14 18:34:00'),(63,68,'MAI-2026-10058','Fuji Syntax','Fuji Syntax','Japonais','Art, Poésie','Une artiste japonaise crée 365 haïkus visuels en demandant chaque jour à une IA de représenter un poème de Matsuo Bashô.','A Japanese artist creates 365 visual haiku by asking an AI each day to represent a poem by Matsuo Basho.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10058/video-test.mp4',NULL,NULL,NULL,189,'365 images générées sur un an, montage chronologique.','DALL-E 3, Suno AI, DaVinci Resolve','full',1,1,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(64,69,'MAI-2026-10059','Lumiere Filtree','Filtered Light','Français','Drame, Philosophie','Un philosophe en fin de vie demande à une IA de générer son autobiographie visuelle à partir de ses journaux intimes.','A philosopher at the end of his life asks an AI to generate his visual autobiography from his diaries.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10059/video-test.mp4',NULL,NULL,NULL,523,'Journaux numérisés, images générées par IA autobiographique.','Midjourney v6, ElevenLabs, Premiere Pro','hybrid',1,1,1,0,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00'),(65,70,'MAI-2026-10060','Djembe Protocol','Djembe Protocol','Français','Musical, SF','À Bamako en 2045, un joueur de djembé crée une IA musicale qui unifie les rythmes de 54 pays africains en une seule pulsation.','In 2045 Bamako, a djembe player creates a musical AI that unifies the rhythms of 54 African countries into one pulse.','https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10060/video-test.mp4',NULL,NULL,NULL,376,'Rythmes captés, fusion IA multi-culturelle, clips génératifs.','Suno AI, Stable Diffusion, After Effects','hybrid',0,1,0,1,'to_review','2026-03-14 18:34:00','2026-03-14 18:34:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `film_discussion`
--

LOCK TABLES `film_discussion` WRITE;
/*!40000 ALTER TABLE `film_discussion` DISABLE KEYS */;
INSERT INTO `film_discussion` VALUES (2,19,2,'2026-03-15 13:23:42'),(3,20,2,'2026-03-15 13:31:46');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `global_chat_message`
--

LOCK TABLES `global_chat_message` WRITE;
/*!40000 ALTER TABLE `global_chat_message` DISABLE KEYS */;
INSERT INTO `global_chat_message` VALUES (1,2,'Stephane Job','SJ','Bonjour tout le monde, on commence les visionnages à 9h ?','2026-03-14 07:47:12'),(2,4,'Valerie Kergonnan','VK','Oui pour moi c est bon, j ai déjà regardé les 3 premiers hier soir.','2026-03-14 07:49:03'),(3,3,'Dylan Blanc','DB','Pareil, j ai avancé sur les films espagnols. Certains sont vraiment solides.','2026-03-14 07:51:44'),(4,5,'Jean-Denis Saucy','JS','Je serai là à 9h30, j ai une réunion avant. Vous pouvez commencer sans moi.','2026-03-14 07:53:20'),(5,2,'Stephane Job','SJ','Pas de souci Jean-Denis, on te fait un compte-rendu.','2026-03-14 07:54:05'),(6,6,'Mickael Ayilan','MA','Bonjour à tous ! Prêt pour cette belle journée de délibération.','2026-03-14 08:01:33'),(7,4,'Valerie Kergonnan','VK','Mickael t as vu Fragments d IA ? Je veux ton avis avant qu on vote.','2026-03-14 08:03:17'),(8,6,'Mickael Ayilan','MA','Oui deux fois. Techniquement très fort mais la narration perd le spectateur à mi-film.','2026-03-14 08:04:52'),(9,3,'Dylan Blanc','DB','Je suis d accord. La séquence de mémoire est hypnotique mais le dernier acte est trop abstrait.','2026-03-14 08:06:38'),(10,2,'Stephane Job','SJ','Pour moi c est le meilleur techniquement de la sélection. Je vote valide sans hésiter.','2026-03-14 08:08:01'),(11,4,'Valerie Kergonnan','VK','On a reçu des infos sur la réalisatrice de Synthetik ? Son parcours m intrigue.','2026-03-14 08:15:44'),(12,5,'Jean-Denis Saucy','JS','Je viens d arriver, on en est où ?','2026-03-14 08:31:02'),(13,6,'Mickael Ayilan','MA','On discute de Synthetik et L Algorithme du Cœur. Rejoins-nous.','2026-03-14 08:32:18'),(14,2,'Stephane Job','SJ','La pause déjeuner est à 12h30 si tout le monde est ok.','2026-03-14 10:47:55'),(15,3,'Dylan Blanc','DB','Ok pour moi. On aura le temps de finir Résonance avant ?','2026-03-14 10:49:12'),(16,4,'Valerie Kergonnan','VK','Je viens de terminer Résonance. C est un coup de cœur absolu, vraiment bouleversant.','2026-03-14 10:52:30'),(17,5,'Jean-Denis Saucy','JS','Valerie tu peux développer ce que tu aimes dans Résonance pour le compte rendu ?','2026-03-14 12:41:08'),(18,4,'Valerie Kergonnan','VK','La façon dont l IA reconstruit les émotions humaines est inédite. Jamais vu ça avant.','2026-03-14 12:43:55'),(19,6,'Mickael Ayilan','MA','On a encore 8 films à voir cet après-midi. On s y remet ?','2026-03-14 13:01:22'),(20,2,'Stephane Job','SJ','C est parti. Je commence par Chronos.','2026-03-14 13:02:47');
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
  `role` enum('jury','admin') NOT NULL DEFAULT 'jury',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `google_id` varchar(255) DEFAULT NULL,
  `profil_picture` varchar(500) DEFAULT NULL,
  `jury_description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
INSERT INTO `jury` VALUES (1,'Admin','marsAI','admin@gmail.com','$2b$12$cgguIR7ieg3UDlxTvKC.0.YiUZ0k8/cbN/zR4BuB7YzimiOZB4W56','admin',1,NULL,NULL,NULL,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(2,'Stephane','Job','stephane.job@laplateforme.io','$2b$12$DiLqLtK28tZObNyJleqXoebqdkdm.0/tVFAcYV7MSA9sn7fxChwHC','jury',1,NULL,'https://i.pravatar.cc/300?img=12','Développeur fullstack et passionné de cinéma IA.','2026-03-14 18:01:57','2026-03-14 18:01:57'),(3,'Dylan','Blanc','dylan.blanc@laplateforme.io','$2b$12$trw5.vubeW3KW2pWv36Qs.wrjKtwbqWIlaJepmArt7DVEdCMlHjTG','jury',1,NULL,'https://i.pravatar.cc/300?img=15','Designer UX et amateur de films expérimentaux.','2026-03-14 18:01:57','2026-03-14 18:01:57'),(4,'Valerie','Kergonnan','valerie.kergonnan@laplateforme.io','$2b$12$q6OUYAk1/J.GlSK46bvyW.QIfWd5lDWmYuEjJx4qeRQKks/pc6lqe','jury',1,NULL,'https://i.pravatar.cc/300?img=47','Réalisatrice et critique de cinéma spécialisée en IA créative.','2026-03-14 18:01:57','2026-03-14 18:01:57'),(5,'Jean-Denis','Saucy','jean-denis.saucy@laplateforme.io','$2b$12$UobQogv39UYaDE4HyUjuX.pj957fVqSsPaZ/dXKoa.ZOXz7OEpkjO','jury',1,NULL,'https://i.pravatar.cc/300?img=33','Producteur indépendant et expert en narration visuelle.','2026-03-14 18:01:57','2026-03-14 18:01:57'),(6,'Mickael','Ayilan','mickael.ayilan@laplateforme.io','$2b$12$u6uGm7tv9fW4kD4xsLgHqOxDI5p/8v.ePRK0DoOx1hWocgFqYn0vW','jury',1,NULL,'https://i.pravatar.cc/300?img=57','Ingénieur son et compositeur, spécialiste des bandes originales générées par IA.','2026-03-14 18:01:57','2026-03-14 18:01:57');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury_film_assignment`
--

LOCK TABLES `jury_film_assignment` WRITE;
/*!40000 ALTER TABLE `jury_film_assignment` DISABLE KEYS */;
INSERT INTO `jury_film_assignment` VALUES (1,2,1,1,'2026-03-15 11:43:37'),(2,2,2,1,'2026-03-15 11:43:37'),(3,2,3,1,'2026-03-15 11:43:37'),(4,2,4,1,'2026-03-15 11:43:37'),(5,2,5,1,'2026-03-15 11:43:37'),(6,2,6,1,'2026-03-15 11:43:37'),(7,2,7,1,'2026-03-15 11:43:37'),(8,2,8,1,'2026-03-15 11:43:37'),(9,2,9,1,'2026-03-15 11:43:37'),(10,2,10,1,'2026-03-15 11:43:37'),(16,2,16,1,'2026-03-15 11:45:33'),(17,2,17,1,'2026-03-15 11:45:33'),(18,2,18,1,'2026-03-15 11:45:33'),(19,2,19,1,'2026-03-15 11:45:33'),(20,2,20,1,'2026-03-15 11:45:33');
/*!40000 ALTER TABLE `jury_film_assignment` ENABLE KEYS */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_jury_film` (`jury_id`,`film_id`),
  KEY `fk_jfc_film` (`film_id`),
  KEY `fk_jfc_commentary` (`commentary_id`),
  CONSTRAINT `fk_jfc_commentary` FOREIGN KEY (`commentary_id`) REFERENCES `commentary` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_jfc_film` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_jfc_jury` FOREIGN KEY (`jury_id`) REFERENCES `jury` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury_film_commentary`
--

LOCK TABLES `jury_film_commentary` WRITE;
/*!40000 ALTER TABLE `jury_film_commentary` DISABLE KEYS */;
INSERT INTO `jury_film_commentary` VALUES (2,2,16,10,'in_discussion','2026-03-15 11:58:13','2026-03-15 13:08:47'),(3,2,17,11,'valide','2026-03-15 12:50:37','2026-03-15 13:28:54'),(4,2,1,1,NULL,'2026-03-15 13:08:47','2026-03-15 13:08:47'),(5,4,2,2,NULL,'2026-03-15 13:08:47','2026-03-15 13:08:47'),(6,3,3,3,NULL,'2026-03-15 13:08:47','2026-03-15 13:08:47'),(7,4,4,4,NULL,'2026-03-15 13:08:47','2026-03-15 13:08:47'),(8,6,5,5,NULL,'2026-03-15 13:08:47','2026-03-15 13:08:47'),(9,2,6,6,NULL,'2026-03-15 13:08:47','2026-03-15 13:08:47'),(10,3,7,7,NULL,'2026-03-15 13:08:47','2026-03-15 13:08:47'),(11,5,8,8,NULL,'2026-03-15 13:08:47','2026-03-15 13:08:47'),(12,4,10,9,NULL,'2026-03-15 13:08:47','2026-03-15 13:08:47'),(15,2,7,12,NULL,'2026-03-15 13:29:27','2026-03-15 13:29:27');
/*!40000 ALTER TABLE `jury_film_commentary` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `realisator`
--

LOCK TABLES `realisator` WRITE;
/*!40000 ALTER TABLE `realisator` DISABLE KEYS */;
INSERT INTO `realisator` VALUES (1,'M','Lucas','Bernard','1992-03-14','lucas.bernard@email.com','Réalisateur',NULL,'+33612345601','12 rue des Arts','75010','Paris','France',NULL,'@lucasbernard',NULL,NULL,NULL,NULL,1,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(2,'Mme','Sofia','Morales','1988-07-22','sofia.morales@email.com','Artiste numérique',NULL,'+34612345602','Calle Mayor 5','28001','Madrid','Espagne',NULL,'@sofiamorales',NULL,NULL,NULL,NULL,0,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(3,'M','Kenji','Tanaka','1995-11-05','kenji.tanaka@email.com','Motion designer',NULL,'+81312345603','3-12 Shibuya','150-0002','Tokyo','Japon',NULL,'@kenjitanaka',NULL,NULL,NULL,NULL,1,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(4,'Mme','Amira','Okafor','1990-04-18','amira.okafor@email.com','Cinéaste',NULL,'+2348012345604','15 Broad Street','100001','Lagos','Nigeria',NULL,'@amiraokafor',NULL,NULL,NULL,NULL,1,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(5,'M','Ethan','Novak','1993-09-30','ethan.novak@email.com','Développeur créatif',NULL,'+42012345605','Václavské náměstí 1','110 00','Prague','Tchéquie',NULL,'@ethannovak',NULL,NULL,NULL,NULL,0,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(6,'Mme','Camille','Rousseau','1986-02-11','camille.rousseau@email.com','Réalisatrice',NULL,'+33712345606','8 avenue Montaigne','75008','Paris','France',NULL,'@camillerousseau',NULL,NULL,NULL,NULL,1,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(7,'M','Diego','Herrera','1997-06-25','diego.herrera@email.com','Animateur 3D',NULL,'+52112345607','Av. Reforma 200','06600','Mexico','Mexique',NULL,'@diegoherrera',NULL,NULL,NULL,NULL,1,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(8,'Mme','Priya','Sharma','1991-12-03','priya.sharma@email.com','Photographe',NULL,'+91912345608','42 MG Road','560001','Bangalore','Inde',NULL,'@priyasharma',NULL,NULL,NULL,NULL,0,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(9,'M','Noah','Fischer','1994-08-17','noah.fischer@email.com','Scénariste',NULL,'+49112345609','Unter den Linden 10','10117','Berlin','Allemagne',NULL,'@noahfischer',NULL,NULL,NULL,NULL,1,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(10,'Mme','Léa','Fontaine','1989-05-09','lea.fontaine@email.com','Monteuse',NULL,'+33512345610','3 place Bellecour','69002','Lyon','France',NULL,'@leafontaine',NULL,NULL,NULL,NULL,1,'2026-03-14 18:01:57','2026-03-14 18:01:57'),(21,'Mme','Marie','Dupont','1991-04-12','marie.dupont@email.com','Réalisatrice',NULL,'+33611000011','22 rue de Rivoli','75001','Paris','France',NULL,'@mariedupont',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(22,'M','Carlos','Mendez','1987-09-03','carlos.mendez@email.com','Cinéaste',NULL,'+57311000012','Calle 80 No 15-20','110111','Bogotá','Colombie',NULL,'@carlosmendez',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(23,'Mme','Yuki','Nakamura','1994-02-28','yuki.nakamura@email.com','Animatrice',NULL,'+81811000013','1-5 Harajuku','150-0001','Tokyo','Japon',NULL,'@yukinakamura',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(24,'Mme','Fatima','Al-Rashid','1989-06-15','fatima.alrashid@email.com','Documentariste',NULL,'+21261000014','12 rue Hassan II','20000','Casablanca','Maroc',NULL,'@fatimaralrashid',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(25,'M','John','Williams','1992-11-22','john.williams.dir@email.com','Réalisateur',NULL,'+12125550015','500 W 42nd St','10036','New York','USA',NULL,'@johnwdir',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(26,'Mme','Ana','Pereira','1990-07-08','ana.pereira@email.com','Productrice',NULL,'+5511987000016','Rua Oscar Freire 900','01426-001','São Paulo','Brésil',NULL,'@anapereira',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(27,'M','Mikhail','Sokolov','1985-03-17','mikhail.sokolov@email.com','Réalisateur',NULL,'+74951000017','Arbat 20','119002','Moscou','Russie',NULL,'@mikhailsokolov',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(28,'Mme','Ingrid','Johansson','1993-08-30','ingrid.johansson@email.com','Motion designer',NULL,'+46701000018','Drottninggatan 50','11121','Stockholm','Suède',NULL,'@ingridjohansson',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(29,'M','Omar','Hassan','1988-12-05','omar.hassan@email.com','Vidéaste',NULL,'+20111000019','15 Tahrir Square','11511','Le Caire','Égypte',NULL,'@omarhassan',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(30,'Mme','Liu','Wei','1996-01-20','liu.wei@email.com','Artiste numérique',NULL,'+8613811000020','798 Art District','100015','Pékin','Chine',NULL,'@liuweicn',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(31,'Mme','Isabella','Romano','1991-05-14','isabella.romano@email.com','Réalisatrice',NULL,'+39335000021','Via Condotti 10','00187','Rome','Italie',NULL,'@isabellaromano',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(32,'M','Patrick','OBrien','1986-10-09','patrick.obrien@email.com','Scénariste',NULL,'+35387000022','5 Dame Street','D02 XY45','Dublin','Irlande',NULL,'@patrickobrien',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(33,'Mme','Nadia','Kowalski','1993-03-25','nadia.kowalski@email.com','Monteuse',NULL,'+48501000023','ul. Nowy Swiat 15','00-029','Varsovie','Pologne',NULL,'@nadiakowalski',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(34,'M','Tomas','Garcia','1990-07-31','tomas.garcia@email.com','Animateur 3D',NULL,'+54911000024','Av. Corrientes 1500','C1042','Buenos Aires','Argentine',NULL,'@tomasgarcia',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(35,'Mme','Layla','Ahmed','1994-09-17','layla.ahmed@email.com','Photographe',NULL,'+9617811000025','Rue Hamra 40','2038','Beyrouth','Liban',NULL,'@laylaahmed',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(36,'M','Henrik','Larsen','1987-04-03','henrik.larsen@email.com','Réalisateur',NULL,'+4523000026','Stroget 5','1000','Copenhague','Danemark',NULL,'@henriklarsen',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(37,'Mme','Sarah','Osei','1992-11-12','sarah.osei@email.com','Documentariste',NULL,'+23320000027','14 Cantonments Rd','GA-123','Accra','Ghana',NULL,'@sarahosei',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(38,'M','Daniel','Kim','1995-06-22','daniel.kim@email.com','Motion designer',NULL,'+8210000028','456 Hongdae St','04001','Séoul','Corée du Sud',NULL,'@danielkim',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(39,'Mme','Fatou','Diallo','1989-02-14','fatou.diallo@email.com','Cinéaste',NULL,'+22177000029','Avenue Bourguiba 22','11000','Dakar','Sénégal',NULL,'@fatoudiallo',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(40,'M','Marco','Bianchi','1988-08-19','marco.bianchi@email.com','Directeur photo',NULL,'+39338000030','Corso Buenos Aires 5','20124','Milan','Italie',NULL,'@marcobianchi',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(41,'Mme','Zara','Patel','1993-12-01','zara.patel@email.com','Réalisatrice',NULL,'+91987000031','15 Marine Drive','400020','Mumbai','Inde',NULL,'@zarapatel',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(42,'M','Louis','Moreau','1991-03-07','louis.moreau@email.com','Scénariste',NULL,'+33622000032','7 rue du Faubourg','75011','Paris','France',NULL,'@louismoreau',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(43,'Mme','Aisha','Mwangi','1990-10-25','aisha.mwangi@email.com','Documentariste',NULL,'+25472000033','Ngong Road 100','00200','Nairobi','Kenya',NULL,'@aishamwangi',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(44,'M','Rafael','Torres','1994-05-11','rafael.torres@email.com','Animateur',NULL,'+52155000034','Av. Insurgentes 300','06700','Mexico','Mexique',NULL,'@rafaeltorres',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(45,'Mme','Elena','Popescu','1987-01-28','elena.popescu@email.com','Réalisatrice',NULL,'+40721000035','Calea Victoriei 50','010063','Bucarest','Roumanie',NULL,'@elenapopescu',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(46,'M','Javier','Reyes','1992-07-16','javier.reyes@email.com','Vidéaste',NULL,'+34612000036','Gran Via 40','28013','Madrid','Espagne',NULL,'@javierreyes',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(47,'Mme','Mei','Lin','1996-04-09','mei.lin@email.com','Artiste numérique',NULL,'+88691000037','100 Zhongshan N Rd','10491','Taipei','Taiwan',NULL,'@meilin',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(48,'M','Kevin','Adeyemi','1989-09-03','kevin.adeyemi@email.com','Réalisateur',NULL,'+23481000038','Victoria Island 5','101001','Lagos','Nigeria',NULL,'@kevinadeyemi',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(49,'Mme','Lena','Muller','1993-06-14','lena.muller@email.com','Motion designer',NULL,'+49151000039','Kurfurstendamm 20','10719','Berlin','Allemagne',NULL,'@lenamuller',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(50,'Mme','Sophie','Tremblay','1988-11-30','sophie.tremblay@email.com','Réalisatrice',NULL,'+15141000040','1000 Sherbrooke O','H3A 2R7','Montréal','Canada',NULL,'@sophietremblay',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(51,'M','Ahmed','Benali','1991-02-19','ahmed.benali@email.com','Cinéaste',NULL,'+21361000041','5 rue Didouche Mourad','16000','Alger','Algérie',NULL,'@ahmedbenali',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(52,'Mme','Nina','Kovacs','1994-08-07','nina.kovacs@email.com','Animatrice',NULL,'+36301000042','Andrassy ut 22','1061','Budapest','Hongrie',NULL,'@ninakovacs',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(53,'M','Pablo','Suarez','1986-04-23','pablo.suarez@email.com','Documentariste',NULL,'+59899000043','Av. 18 de Julio 1000','11100','Montevideo','Uruguay',NULL,'@pablosuarez',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(54,'Mme','Yara','Khalil','1990-12-15','yara.khalil@email.com','Photographe',NULL,'+96279000044','Rainbow Street 10','11118','Amman','Jordanie',NULL,'@yarakhalil',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(55,'M','Finn','Anderson','1995-03-02','finn.anderson@email.com','Réalisateur',NULL,'+4790000045','Karl Johans Gate 5','0154','Oslo','Norvège',NULL,'@finnanderson',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(56,'Mme','Priscilla','Nkosi','1989-07-18','priscilla.nkosi@email.com','Cinéaste',NULL,'+27831000046','10 Long Street','8001','Le Cap','Afrique du Sud',NULL,'@priscillankosi',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(57,'M','Ryu','Hyun','1992-01-25','ryu.hyun@email.com','Motion designer',NULL,'+8210100047','200 Gangnam-daero','06236','Séoul','Corée du Sud',NULL,'@ryuhyun',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(58,'Mme','Clara','Becker','1993-09-11','clara.becker@email.com','Réalisatrice',NULL,'+43676000048','Mariahilfer Str 50','1070','Vienne','Autriche',NULL,'@clarabecker',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(59,'M','Emmanuel','Diop','1988-05-06','emmanuel.diop@email.com','Réalisateur',NULL,'+22507000049','Boulevard Latrille 15','25000','Abidjan','Côte d\'Ivoire',NULL,'@emmanueldiop',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(60,'Mme','Valentina','Cruz','1991-10-20','valentina.cruz@email.com','Artiste numérique',NULL,'+51991000050','Av. Larco 800','15074','Lima','Pérou',NULL,'@valentinacruz',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(61,'M','Ahmad','Karimi','1987-06-04','ahmad.karimi@email.com','Scénariste',NULL,'+98912000051','Vali Asr Ave 100','1415773','Téhéran','Iran',NULL,'@ahmadkarimi',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(62,'Mme','Brigitte','Lefevre','1985-02-09','brigitte.lefevre@email.com','Monteuse',NULL,'+32477000052','Rue de la Loi 10','1000','Bruxelles','Belgique',NULL,'@brigittelefevre',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(63,'M','Takeshi','Yamamoto','1994-11-17','takeshi.yamamoto@email.com','Animateur',NULL,'+81612000053','5-10 Akihabara','101-0021','Tokyo','Japon',NULL,'@takeshiyamamoto',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(64,'Mme','Chiara','Ricci','1990-04-01','chiara.ricci@email.com','Réalisatrice',NULL,'+39347000054','Via Torino 20','20123','Milan','Italie',NULL,'@chiararicci',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(65,'M','Samuel','Owusu','1992-08-28','samuel.owusu@email.com','Directeur photo',NULL,'+23324000055','Ring Road Central 5','GA-200','Accra','Ghana',NULL,'@samuelowusu',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(66,'Mme','Mia','Andersen','1996-05-13','mia.andersen@email.com','Motion designer',NULL,'+35840000056','Mannerheimintie 10','00100','Helsinki','Finlande',NULL,'@miaandersen',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(67,'M','Roberto','Vazquez','1989-01-07','roberto.vazquez@email.com','Cinéaste',NULL,'+50222000057','6a Av. 0-60 Zona 1','01001','Guatemala City','Guatemala',NULL,'@robertovazquez',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(68,'Mme','Hana','Yamada','1993-07-22','hana.yamada@email.com','Artiste numérique',NULL,'+81311000058','2-3 Shimokitazawa','155-0031','Tokyo','Japon',NULL,'@hanayamada',NULL,NULL,NULL,NULL,0,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(69,'M','Jean-Pierre','Leblanc','1984-03-16','jeanpierre.leblanc@email.com','Réalisateur',NULL,'+33678000059','15 boulevard Haussmann','75009','Paris','France',NULL,'@jeanpierrelab',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00'),(70,'M','Amara','Camara','1991-12-29','amara.camara@email.com','Cinéaste',NULL,'+22376000060','Rue de Koulikoro 5','0000','Bamako','Mali',NULL,'@amaracamara',NULL,NULL,NULL,NULL,1,'2026-03-14 18:34:00','2026-03-14 18:34:00');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sponsor`
--

LOCK TABLES `sponsor` WRITE;
/*!40000 ALTER TABLE `sponsor` DISABLE KEYS */;
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-15 15:08:19
