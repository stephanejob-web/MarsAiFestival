-- ================================================================
-- script.sql — MarsAI Festival — Schéma corrigé v2
-- Charset : utf8mb4  |  Engine : InnoDB  |  Convention : snake_case
-- ================================================================

CREATE DATABASE IF NOT EXISTS MarsAi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE MarsAi;

CREATE USER IF NOT EXISTS 'Bruno'@'localhost' IDENTIFIED BY 'MarsAIMDPtemp';
GRANT ALL PRIVILEGES ON MarsAi.* TO 'Bruno'@'localhost';
FLUSH PRIVILEGES;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------
-- Table: realisator
-- Corrections :
--   - social_media / socialmedia_realisator supprimés → 5 colonnes
--     directes (youtube, instagram, linkedin, facebook, xtwitter)
--   - nationality supprimé (non collecté, pays = résidence)
--   - VARCHAR(50) pour phone / postal_code (taille cohérente)
--   - email UNIQUE
-- ----------------------------------------------------------------
CREATE TABLE realisator (
  id                  INT NOT NULL AUTO_INCREMENT,
  gender              VARCHAR(10) NOT NULL,               -- 'M' | 'Mme'
  first_name          VARCHAR(255) NOT NULL,
  last_name           VARCHAR(255) NOT NULL,
  birth_date          DATE NOT NULL,
  email               VARCHAR(255) NOT NULL,
  profession          VARCHAR(255) DEFAULT NULL,
  phone               VARCHAR(50) DEFAULT NULL,           -- optionnel
  mobile_phone        VARCHAR(50) NOT NULL,
  street              VARCHAR(255) NOT NULL,
  postal_code         VARCHAR(20) NOT NULL,
  city                VARCHAR(255) NOT NULL,
  country             VARCHAR(255) NOT NULL,
  -- Réseaux sociaux (5 champs fixes — formulaire Step 1)
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
-- Table: film
-- Corrections :
--   - dossier_num ajouté (généré côté backend : MAI-2026-XXXXX)
--   - subtitle_fr_url / subtitle_en_url ajoutés (S3)
--   - ia_class, ia_image, ia_son, ia_scenario, ia_post ajoutés (Step 3)
--   - tags ajouté (Step 2)
--   - original_synopsis / english_synopsis → TEXT
--   - creative_workflow / tech_stack → TEXT
--   - video_url → TEXT (longueur URL S3 variable)
--   - statut enum corrigé : valeurs cohérentes avec le JuryPanel
-- ----------------------------------------------------------------
CREATE TABLE film (
  id                  INT NOT NULL AUTO_INCREMENT,
  realisator_id       INT NOT NULL,
  dossier_num         VARCHAR(20) NOT NULL,               -- ex : MAI-2026-12345
  original_title      VARCHAR(255) NOT NULL,
  english_title       VARCHAR(255) DEFAULT NULL,
  language            VARCHAR(100) NOT NULL,
  tags                VARCHAR(255) DEFAULT NULL,          -- ex : SF, Drame, ...
  original_synopsis   TEXT DEFAULT NULL,
  english_synopsis    TEXT DEFAULT NULL,
  video_url           TEXT DEFAULT NULL,                  -- S3 URL
  subtitle_fr_url     TEXT DEFAULT NULL,                  -- S3 URL (.srt / .vtt)
  subtitle_en_url     TEXT DEFAULT NULL,                  -- S3 URL (.srt / .vtt)
  poster_img          VARCHAR(500) DEFAULT NULL,
  duration            INT DEFAULT NULL,                   -- secondes
  creative_workflow   TEXT DEFAULT NULL,                  -- note d'intention (Step 2)
  tech_stack          TEXT DEFAULT NULL,                  -- outils IA utilisés (Step 2)
  -- Classification IA (Step 3)
  ia_class            ENUM('full', 'hybrid') NOT NULL,
  ia_image            BOOLEAN NOT NULL DEFAULT FALSE,
  ia_son              BOOLEAN NOT NULL DEFAULT FALSE,
  ia_scenario         BOOLEAN NOT NULL DEFAULT FALSE,
  ia_post             BOOLEAN NOT NULL DEFAULT FALSE,
  -- Statut de sélection
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
-- Table: collaborator + collaborator_film
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
-- Table: gallery + film_gallery
-- Correction : img → VARCHAR(500) (URL S3)
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
-- Table: sponsor
-- Correction : sponsor_link / sponsor_logo → VARCHAR(500)
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
-- Table: award
-- Correction : laureat INT → FK vers film(id), NULL avant délibération
-- ----------------------------------------------------------------
CREATE TABLE award (
  id          INT NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  cash_prize  VARCHAR(255) DEFAULT NULL,
  laureat     INT DEFAULT NULL,                           -- FK → film(id)
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_award_laureat
    FOREIGN KEY (laureat) REFERENCES film(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: sponsor_award_film
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
-- Table: cms_content
-- Correction : champs longs → TEXT
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
-- Table: jury
-- Corrections :
--   - password_hash ajouté (authentification)
--   - role ajouté : 'jury' | 'admin' (pas de table admin séparée)
--   - jury_description → TEXT
--   - profil_picture → VARCHAR(500)
--   - email UNIQUE
-- ----------------------------------------------------------------
CREATE TABLE jury (
  id               INT NOT NULL AUTO_INCREMENT,
  first_name       VARCHAR(255) NOT NULL,
  last_name        VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  role             ENUM('jury', 'admin') NOT NULL DEFAULT 'jury',
  google_id        VARCHAR(255) DEFAULT NULL,
  profil_picture   VARCHAR(500) DEFAULT NULL,
  jury_description TEXT DEFAULT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_jury_email (email),
  UNIQUE KEY uq_jury_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Si la table existe déjà (migration) :
-- ALTER TABLE jury ADD COLUMN google_id VARCHAR(255) DEFAULT NULL UNIQUE;

-- ----------------------------------------------------------------
-- Table: commentary
-- Correction : commentary → TEXT
-- ----------------------------------------------------------------
CREATE TABLE commentary (
  id         INT NOT NULL AUTO_INCREMENT,
  commentary TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- Table: jury_film_commentary
-- Corrections :
--   - decision ajouté (vote du juré : valide / arevoir / refuse / in_discussion)
--   - UNIQUE(jury_id, film_id) : un vote par juré par film
-- ----------------------------------------------------------------
CREATE TABLE jury_film_commentary (
  id            INT NOT NULL AUTO_INCREMENT,
  jury_id       INT NOT NULL,
  film_id       INT NOT NULL,
  commentary_id INT NOT NULL,
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
    FOREIGN KEY (commentary_id) REFERENCES commentary(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- Table: ticket
-- Signalements créés par les jurés, traités par l'admin.
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
  CONSTRAINT fk_ticket_jury FOREIGN KEY (jury_id) REFERENCES jury(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ticket_film FOREIGN KEY (film_id) REFERENCES film(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- Patch: jury.is_active — désactivation de compte sans suppression
-- ----------------------------------------------------------------
ALTER TABLE jury ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- ----------------------------------------------------------------
-- Patch: jury_film_commentary.commentary_id → nullable
-- Permet d'enregistrer un vote sans commentaire obligatoire.
-- ----------------------------------------------------------------
ALTER TABLE jury_film_commentary MODIFY commentary_id INT DEFAULT NULL;

-- ----------------------------------------------------------------
-- Table: jury_film_assignment
-- L'admin attribue des films à des jurés avant évaluation.
-- Séparé de jury_film_commentary pour découpler attribution et vote.
-- ----------------------------------------------------------------
CREATE TABLE jury_film_assignment (
  id          INT NOT NULL AUTO_INCREMENT,
  jury_id     INT NOT NULL,
  film_id     INT NOT NULL,
  assigned_by INT NOT NULL,                              -- FK → jury(id) : l'admin qui assigne
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_assignment (jury_id, film_id),          -- un film assigné une seule fois par juré
  CONSTRAINT fk_assign_jury
    FOREIGN KEY (jury_id)     REFERENCES jury(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_assign_film
    FOREIGN KEY (film_id)     REFERENCES film(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_assign_by
    FOREIGN KEY (assigned_by) REFERENCES jury(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- Données initiales : compte administrateur par défaut
-- Mot de passe : azerty (bcrypt 12 rounds)
-- ----------------------------------------------------------------
INSERT INTO jury (first_name, last_name, email, password_hash, role, is_active)
VALUES ('Admin', 'marsAI', 'admin@gmail.com', '$2b$12$cgguIR7ieg3UDlxTvKC.0.YiUZ0k8/cbN/zR4BuB7YzimiOZB4W56', 'admin', TRUE);

SET FOREIGN_KEY_CHECKS = 1;
