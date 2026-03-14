-- ================================================================
-- script.sql — MarsAI Festival 2026
-- ================================================================
-- Prérequis : MySQL 8+
--
-- Usage :
--   mysql -u root -p < script.sql
--
-- Ce script :
--   1. Crée la base de données et l'utilisateur MySQL
--   2. Crée toutes les tables (schéma complet)
--   3. Insère le compte administrateur par défaut
--   4. Insère 10 réalisateurs et 10 films de test avec vidéos S3
--
-- Accès administrateur :
--   Email    : admin@gmail.com
--   Mot de passe : azerty
--
-- Peut être rejoué à tout moment (DROP + CREATE).
-- ================================================================

CREATE DATABASE IF NOT EXISTS MarsAi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE MarsAi;

-- ----------------------------------------------------------------
-- Utilisateur MySQL (adaptez le mot de passe si besoin)
-- ----------------------------------------------------------------
CREATE USER IF NOT EXISTS 'Bruno'@'localhost' IDENTIFIED BY 'MarsAIMDPtemp';
GRANT ALL PRIVILEGES ON MarsAi.* TO 'Bruno'@'localhost';
FLUSH PRIVILEGES;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ================================================================
-- SUPPRESSION DES TABLES (ordre inverse des FK)
-- ================================================================
DROP TABLE IF EXISTS jury_film_assignment;
DROP TABLE IF EXISTS jury_film_commentary;
DROP TABLE IF EXISTS commentary;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS sponsor_award_film;
DROP TABLE IF EXISTS award;
DROP TABLE IF EXISTS film_gallery;
DROP TABLE IF EXISTS gallery;
DROP TABLE IF EXISTS collaborator_film;
DROP TABLE IF EXISTS collaborator;
DROP TABLE IF EXISTS film;
DROP TABLE IF EXISTS realisator;
DROP TABLE IF EXISTS sponsor;
DROP TABLE IF EXISTS cms_content;
DROP TABLE IF EXISTS jury;

-- ================================================================
-- TABLES
-- ================================================================

-- ----------------------------------------------------------------
-- realisator : réalisateur qui soumet un dossier
-- ----------------------------------------------------------------
CREATE TABLE realisator (
  id                  INT NOT NULL AUTO_INCREMENT,
  gender              VARCHAR(10) NOT NULL,               -- 'M' | 'Mme'
  first_name          VARCHAR(255) NOT NULL,
  last_name           VARCHAR(255) NOT NULL,
  birth_date          DATE NOT NULL,
  email               VARCHAR(255) NOT NULL,
  profession          VARCHAR(255) DEFAULT NULL,
  phone               VARCHAR(50) DEFAULT NULL,
  mobile_phone        VARCHAR(50) NOT NULL,
  street              VARCHAR(255) NOT NULL,
  postal_code         VARCHAR(20) NOT NULL,
  city                VARCHAR(255) NOT NULL,
  country             VARCHAR(255) NOT NULL,
  youtube             VARCHAR(500) DEFAULT NULL,
  instagram           VARCHAR(500) DEFAULT NULL,
  linkedin            VARCHAR(500) DEFAULT NULL,
  facebook            VARCHAR(500) DEFAULT NULL,
  xtwitter            VARCHAR(500) DEFAULT NULL,
  how_did_you_know_us VARCHAR(255) DEFAULT NULL,
  newsletter          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_realisator_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- film : dossier de candidature
-- ----------------------------------------------------------------
CREATE TABLE film (
  id                  INT NOT NULL AUTO_INCREMENT,
  realisator_id       INT NOT NULL,
  dossier_num         VARCHAR(20) NOT NULL,               -- ex : MAI-2026-12345
  original_title      VARCHAR(255) NOT NULL,
  english_title       VARCHAR(255) DEFAULT NULL,
  language            VARCHAR(100) NOT NULL,
  tags                VARCHAR(255) DEFAULT NULL,
  original_synopsis   TEXT DEFAULT NULL,
  english_synopsis    TEXT DEFAULT NULL,
  video_url           TEXT DEFAULT NULL,                  -- S3 URL
  subtitle_fr_url     TEXT DEFAULT NULL,                  -- S3 URL (.srt / .vtt)
  subtitle_en_url     TEXT DEFAULT NULL,                  -- S3 URL (.srt / .vtt)
  poster_img          VARCHAR(500) DEFAULT NULL,
  duration            INT DEFAULT NULL,                   -- secondes
  creative_workflow   TEXT DEFAULT NULL,
  tech_stack          TEXT DEFAULT NULL,
  ia_class            ENUM('full', 'hybrid') NOT NULL,
  ia_image            BOOLEAN NOT NULL DEFAULT FALSE,
  ia_son              BOOLEAN NOT NULL DEFAULT FALSE,
  ia_scenario         BOOLEAN NOT NULL DEFAULT FALSE,
  ia_post             BOOLEAN NOT NULL DEFAULT FALSE,
  statut              ENUM(
                        'to_review',
                        'valide',
                        'arevoir',
                        'refuse',
                        'in_discussion',
                        'asked_to_modify'
                      ) NOT NULL DEFAULT 'to_review',
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_film_dossier_num (dossier_num),
  CONSTRAINT fk_film_realisator FOREIGN KEY (realisator_id)
    REFERENCES realisator(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- collaborator : co-auteurs d'un film
-- ----------------------------------------------------------------
CREATE TABLE collaborator (
  id          INT NOT NULL AUTO_INCREMENT,
  gender      VARCHAR(10) DEFAULT NULL,
  first_name  VARCHAR(255) NOT NULL,
  last_name   VARCHAR(255) NOT NULL,
  email       VARCHAR(255) DEFAULT NULL,
  profession  VARCHAR(255) DEFAULT NULL,
  role        VARCHAR(255) DEFAULT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE collaborator_film (
  id              INT NOT NULL AUTO_INCREMENT,
  film_id         INT NOT NULL,
  collaborator_id INT NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_collabfilm_film
    FOREIGN KEY (film_id) REFERENCES film(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_collabfilm_collaborator
    FOREIGN KEY (collaborator_id) REFERENCES collaborator(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- gallery : images associées à un film (S3 URL)
-- ----------------------------------------------------------------
CREATE TABLE gallery (
  id         INT NOT NULL AUTO_INCREMENT,
  img        VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE film_gallery (
  id         INT NOT NULL AUTO_INCREMENT,
  film_id    INT NOT NULL,
  gallery_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_filmgallery_film
    FOREIGN KEY (film_id) REFERENCES film(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_filmgallery_gallery
    FOREIGN KEY (gallery_id) REFERENCES gallery(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- sponsor
-- ----------------------------------------------------------------
CREATE TABLE sponsor (
  id                  INT NOT NULL AUTO_INCREMENT,
  name                VARCHAR(255) NOT NULL,
  partnership_statut  ENUM('main', 'lead', 'partner', 'supporter', 'premium') DEFAULT NULL,
  sponsored_award     VARCHAR(255) DEFAULT NULL,
  sponsor_link        VARCHAR(500) DEFAULT NULL,
  sponsor_logo        VARCHAR(500) DEFAULT NULL,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- award : prix du festival (laureat = FK → film, NULL avant délibération)
-- ----------------------------------------------------------------
CREATE TABLE award (
  id          INT NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  cash_prize  VARCHAR(255) DEFAULT NULL,
  laureat     INT DEFAULT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_award_laureat
    FOREIGN KEY (laureat) REFERENCES film(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sponsor_award_film (
  id         INT NOT NULL AUTO_INCREMENT,
  sponsor_id INT NOT NULL,
  award_id   INT NOT NULL,
  film_id    INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_saf_sponsor
    FOREIGN KEY (sponsor_id) REFERENCES sponsor(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_saf_award
    FOREIGN KEY (award_id)   REFERENCES award(id)   ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_saf_film
    FOREIGN KEY (film_id)    REFERENCES film(id)    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- cms_content : contenu éditorial + dates des phases (1 seule ligne)
-- ----------------------------------------------------------------
CREATE TABLE cms_content (
  id                       INT NOT NULL AUTO_INCREMENT,
  header_logo              VARCHAR(500) DEFAULT NULL,
  hero_video_path          VARCHAR(500) DEFAULT NULL,
  hero_label               VARCHAR(255) DEFAULT NULL,
  hero_title               VARCHAR(255) DEFAULT NULL,
  hero_description         TEXT DEFAULT NULL,
  hero_content             TEXT DEFAULT NULL,
  jury_section_label       VARCHAR(255) DEFAULT NULL,
  jury_section_title       VARCHAR(255) DEFAULT NULL,
  jury_section_description TEXT DEFAULT NULL,
  jury_section_content     TEXT DEFAULT NULL,
  phase_top50_open_date    DATE DEFAULT NULL,
  phase_top50_close_date   DATE DEFAULT NULL,
  phase_award_open_date    DATE DEFAULT NULL,
  phase_award_close_date   DATE DEFAULT NULL,
  header_logo_toggle       BOOLEAN NOT NULL DEFAULT TRUE,
  hero_video_toggle        BOOLEAN NOT NULL DEFAULT TRUE,
  is_jury_list_toggle      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- jury : jurés et administrateurs
--   role     : 'jury' | 'admin'
--   is_active : désactivation sans suppression du compte
-- ----------------------------------------------------------------
CREATE TABLE jury (
  id               INT NOT NULL AUTO_INCREMENT,
  first_name       VARCHAR(255) NOT NULL,
  last_name        VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  role             ENUM('jury', 'admin') NOT NULL DEFAULT 'jury',
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  google_id        VARCHAR(255) DEFAULT NULL,
  profil_picture   VARCHAR(500) DEFAULT NULL,
  jury_description TEXT DEFAULT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_jury_email (email),
  UNIQUE KEY uq_jury_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- commentary : texte libre d'un juré sur un film
-- ----------------------------------------------------------------
CREATE TABLE commentary (
  id         INT NOT NULL AUTO_INCREMENT,
  commentary TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- jury_film_commentary : vote + commentaire d'un juré sur un film
--   commentary_id nullable : vote sans commentaire autorisé
--   UNIQUE(jury_id, film_id) : un seul vote par juré par film
-- ----------------------------------------------------------------
CREATE TABLE jury_film_commentary (
  id            INT NOT NULL AUTO_INCREMENT,
  jury_id       INT NOT NULL,
  film_id       INT NOT NULL,
  commentary_id INT DEFAULT NULL,
  decision      ENUM('valide', 'arevoir', 'refuse', 'in_discussion') DEFAULT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_jury_film (jury_id, film_id),
  CONSTRAINT fk_jfc_jury
    FOREIGN KEY (jury_id)       REFERENCES jury(id)       ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_jfc_film
    FOREIGN KEY (film_id)       REFERENCES film(id)       ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_jfc_commentary
    FOREIGN KEY (commentary_id) REFERENCES commentary(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- jury_film_assignment : l'admin attribue des films aux jurés
--   Séparé de jury_film_commentary (attribution ≠ vote)
--   assigned_by : FK → jury(id) — l'admin qui a fait l'attribution
-- ----------------------------------------------------------------
CREATE TABLE jury_film_assignment (
  id          INT NOT NULL AUTO_INCREMENT,
  jury_id     INT NOT NULL,
  film_id     INT NOT NULL,
  assigned_by INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_assignment (jury_id, film_id),
  CONSTRAINT fk_assign_jury
    FOREIGN KEY (jury_id)     REFERENCES jury(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_assign_film
    FOREIGN KEY (film_id)     REFERENCES film(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_assign_by
    FOREIGN KEY (assigned_by) REFERENCES jury(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- ticket : signalements créés par les jurés, traités par l'admin
-- ----------------------------------------------------------------
CREATE TABLE ticket (
  id           INT NOT NULL AUTO_INCREMENT,
  jury_id      INT NOT NULL,
  film_id      INT NOT NULL,
  type         ENUM('content','technical','rights','other') NOT NULL DEFAULT 'other',
  description  TEXT NOT NULL,
  status       ENUM('open','in_progress','resolved','rejected') NOT NULL DEFAULT 'open',
  admin_note   TEXT DEFAULT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_ticket_jury
    FOREIGN KEY (jury_id) REFERENCES jury(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ticket_film
    FOREIGN KEY (film_id) REFERENCES film(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ================================================================
-- DONNÉES INITIALES
-- ================================================================

-- ----------------------------------------------------------------
-- Compte administrateur par défaut
--   Email        : admin@gmail.com
--   Mot de passe : azerty   (bcrypt 12 rounds)
-- ----------------------------------------------------------------
INSERT INTO jury (first_name, last_name, email, password_hash, role, is_active)
VALUES (
  'Admin',
  'marsAI',
  'admin@gmail.com',
  '$2b$12$cgguIR7ieg3UDlxTvKC.0.YiUZ0k8/cbN/zR4BuB7YzimiOZB4W56',
  'admin',
  TRUE
);

-- ================================================================
-- DONNÉES DE TEST — 10 réalisateurs + 10 films
-- ================================================================
-- Les vidéos S3 sont uploadées via : node backend/scripts/seed-s3.js
-- Structure S3 : grp1/MAI-2026-XXXXX/video-test.mp4
-- ================================================================

INSERT INTO realisator (gender, first_name, last_name, birth_date, email, profession, mobile_phone, street, postal_code, city, country, instagram, newsletter) VALUES
('M',   'Lucas',   'Bernard',  '1992-03-14', 'lucas.bernard@email.com',    'Réalisateur',         '+33612345601', '12 rue des Arts',       '75010',    'Paris',     'France',    '@lucasbernard',    TRUE),
('Mme', 'Sofia',   'Morales',  '1988-07-22', 'sofia.morales@email.com',    'Artiste numérique',   '+34612345602', 'Calle Mayor 5',         '28001',    'Madrid',    'Espagne',   '@sofiamorales',    FALSE),
('M',   'Kenji',   'Tanaka',   '1995-11-05', 'kenji.tanaka@email.com',     'Motion designer',     '+81312345603', '3-12 Shibuya',          '150-0002', 'Tokyo',     'Japon',     '@kenjitanaka',     TRUE),
('Mme', 'Amira',   'Okafor',   '1990-04-18', 'amira.okafor@email.com',     'Cinéaste',            '+2348012345604','15 Broad Street',       '100001',   'Lagos',     'Nigeria',   '@amiraokafor',     TRUE),
('M',   'Ethan',   'Novak',    '1993-09-30', 'ethan.novak@email.com',      'Développeur créatif', '+42012345605', 'Václavské náměstí 1',   '110 00',   'Prague',    'Tchéquie',  '@ethannovak',      FALSE),
('Mme', 'Camille', 'Rousseau', '1986-02-11', 'camille.rousseau@email.com', 'Réalisatrice',        '+33712345606', '8 avenue Montaigne',    '75008',    'Paris',     'France',    '@camillerousseau', TRUE),
('M',   'Diego',   'Herrera',  '1997-06-25', 'diego.herrera@email.com',    'Animateur 3D',        '+52112345607', 'Av. Reforma 200',       '06600',    'Mexico',    'Mexique',   '@diegoherrera',    TRUE),
('Mme', 'Priya',   'Sharma',   '1991-12-03', 'priya.sharma@email.com',     'Photographe',         '+91912345608', '42 MG Road',            '560001',   'Bangalore', 'Inde',      '@priyasharma',     FALSE),
('M',   'Noah',    'Fischer',  '1994-08-17', 'noah.fischer@email.com',     'Scénariste',          '+49112345609', 'Unter den Linden 10',   '10117',    'Berlin',    'Allemagne', '@noahfischer',     TRUE),
('Mme', 'Léa',     'Fontaine', '1989-05-09', 'lea.fontaine@email.com',     'Monteuse',            '+33512345610', '3 place Bellecour',     '69002',    'Lyon',      'France',    '@leafontaine',     TRUE);

INSERT INTO film (realisator_id, dossier_num, original_title, english_title, language, tags, original_synopsis, english_synopsis, video_url, duration, creative_workflow, tech_stack, ia_class, ia_image, ia_son, ia_scenario, ia_post, statut)
SELECT
  r.id,
  f.dossier_num,
  f.original_title,
  f.english_title,
  f.language,
  f.tags,
  f.original_synopsis,
  f.english_synopsis,
  f.video_url,
  f.duration,
  f.creative_workflow,
  f.tech_stack,
  f.ia_class,
  f.ia_image,
  f.ia_son,
  f.ia_scenario,
  f.ia_post,
  f.statut
FROM (
  SELECT 'lucas.bernard@email.com'    AS email, 'MAI-2026-10001' AS dossier_num, 'Fragments d\'IA'        AS original_title, 'AI Fragments'          AS english_title, 'Français'  AS language, 'Expérimental, SF'   AS tags, 'Un homme découvre que ses souvenirs ont été partiellement remplacés par des hallucinations générées par IA.'             AS original_synopsis, 'A man discovers his memories have been partially replaced by AI-generated hallucinations.'                     AS english_synopsis, 'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10001/video-test.mp4' AS video_url, 342 AS duration, 'Exploration des limites entre réel et virtuel via Stable Diffusion.'  AS creative_workflow, 'Stable Diffusion, Runway Gen-2, DaVinci Resolve'  AS tech_stack, 'hybrid' AS ia_class, TRUE  AS ia_image, FALSE AS ia_son, TRUE  AS ia_scenario, TRUE  AS ia_post, 'to_review'        AS statut
  UNION ALL
  SELECT 'sofia.morales@email.com',    'MAI-2026-10002', 'La Última Señal',       'The Last Signal',      'Espagnol', 'Thriller, Drame',   'Une scientifique reçoit un signal radio provenant d\'une version alternative d\'elle-même.',                      'A scientist receives a radio signal from an alternative version of herself.',                             'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10002/video-test.mp4', 518, 'Génération des décors futuristes avec Midjourney v6.',                 'Midjourney v6, Udio, Adobe Premiere',             'hybrid', FALSE, TRUE,  FALSE, TRUE,  'valide'
  UNION ALL
  SELECT 'kenji.tanaka@email.com',     'MAI-2026-10003', 'デジタルの夢',           'Digital Dream',        'Japonais', 'Animation, Poésie', 'Un artiste numérique plonge dans un monde où chaque pensée prend vie sous forme d\'animation.',                  'A digital artist dives into a world where every thought comes to life as animation.',                    'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10003/video-test.mp4', 275, 'Animation frame par frame augmentée par IA pour les transitions.',    'Sora, After Effects, Udio',                       'full',   TRUE,  TRUE,  TRUE,  TRUE,  'arevoir'
  UNION ALL
  SELECT 'amira.okafor@email.com',     'MAI-2026-10004', 'Mémoire Collective',    'Collective Memory',    'Français', 'Documentaire, IA',  'Exploration de la mémoire collective africaine à travers des archives reconstituées par intelligence artificielle.', 'Exploration of African collective memory through archives reconstituted by artificial intelligence.',    'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10004/video-test.mp4', 623, 'Reconstruction d\'archives historiques via IA générative.',           'Sora, Stable Diffusion, ElevenLabs',              'hybrid', TRUE,  TRUE,  FALSE, TRUE,  'to_review'
  UNION ALL
  SELECT 'ethan.novak@email.com',      'MAI-2026-10005', 'Synthetik',             'Synthetik',            'Anglais',  'SF, Action',        'Dans un Prague post-apocalyptique, un androïde cherche à comprendre ce qu\'est l\'empathie humaine.',               'In a post-apocalyptic Prague, an android tries to understand what human empathy is.',                    'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10005/video-test.mp4', 487, 'Décors entièrement générés, seuls les acteurs sont réels.',           'Runway Gen-3, ElevenLabs, Udio',                  'hybrid', TRUE,  TRUE,  TRUE,  FALSE, 'in_discussion'
  UNION ALL
  SELECT 'camille.rousseau@email.com', 'MAI-2026-10006', 'L\'Algorithme du Cœur', 'Heart Algorithm',      'Français', 'Romance, Drame',    'Une pianiste tombe amoureuse d\'une composition générée par IA sans savoir qu\'elle n\'a pas d\'auteur humain.',   'A pianist falls in love with an AI-generated composition without knowing it has no human author.',       'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10006/video-test.mp4', 391, 'Musique entièrement composée par Suno AI, arrangements humains.',     'Suno AI, Midjourney, Final Cut Pro',              'hybrid', FALSE, TRUE,  TRUE,  FALSE, 'valide'
  UNION ALL
  SELECT 'diego.herrera@email.com',    'MAI-2026-10007', 'Espejo Roto',           'Broken Mirror',        'Espagnol', 'Horreur, Psycho',   'Un homme retrouve d\'anciennes vidéos de famille dont il n\'a aucun souvenir et qui semblent appartenir à une autre vie.', 'A man finds old family videos he has no memory of, seemingly belonging to another life.',              'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10007/video-test.mp4', 556, 'Effets visuels de distorsion temporelle via IA.',                     'Runway Gen-3, Stable Diffusion XL, DaVinci',     'full',   TRUE,  FALSE, TRUE,  TRUE,  'refuse'
  UNION ALL
  SELECT 'priya.sharma@email.com',     'MAI-2026-10008', 'The Dreaming Machine',  'The Dreaming Machine', 'Anglais',  'SF, Philosophie',   'Une IA développe la capacité de rêver et commence à produire des films de façon autonome.',                         'An AI develops the ability to dream and begins producing films autonomously.',                            'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10008/video-test.mp4', 448, '100% généré par IA — zéro intervention humaine dans les visuels.',   'Sora, ElevenLabs, Claude, Udio',                  'full',   TRUE,  TRUE,  TRUE,  TRUE,  'to_review'
  UNION ALL
  SELECT 'noah.fischer@email.com',     'MAI-2026-10009', 'Stille Wasser',         'Still Waters',         'Allemand', 'Drame, Nature',     'Un garde forestier découvre que la forêt qu\'il protège communique à travers des patterns biologiques IA.',         'A forest ranger discovers the forest he protects communicates through AI biological patterns.',          'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10009/video-test.mp4', 312, 'Sons naturels re-synthétisés, images augmentées par IA.',             'Stable Audio, Midjourney, Premiere Pro',          'hybrid', TRUE,  TRUE,  FALSE, FALSE, 'asked_to_modify'
  UNION ALL
  SELECT 'lea.fontaine@email.com',     'MAI-2026-10010', 'Résonance',             'Resonance',            'Français', 'Expérimental, Art', 'Un voyage sensoriel au cœur de la synesthésie : sons qui deviennent images, couleurs qui deviennent musique.',      'A sensory journey into synesthesia: sounds become images, colors become music.',                         'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10010/video-test.mp4', 198, 'Conversion son → image via IA en temps réel, installation interactive.','Stable Diffusion, Suno AI, TouchDesigner',       'full',   TRUE,  TRUE,  FALSE, TRUE,  'to_review'
) AS f
JOIN realisator r ON r.email = f.email;
