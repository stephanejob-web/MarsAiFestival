CREATE DATABASE IF NOT EXISTS MarsAi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE MarsAi;

CREATE USER IF NOT EXISTS 'Bruno'@'localhost' IDENTIFIED BY 'MarsAIMDPtemp';

GRANT ALL PRIVILEGES ON MarsAi.* TO 'Bruno'@'localhost';
FLUSH PRIVILEGES;

-- --------------------------------------------------
CREATE TABLE phases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    open_date DATE, -- Modifié en DATE selon vos instructions
    closure_date DATE -- Modifié en DATE selon vos instructions
);

CREATE TABLE cms_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    header_logo VARCHAR(255),
    hero_video_path VARCHAR(255),
    hero_first_paragraph TEXT, -- TEXT est souvent plus adapté pour les paragraphes
    hero_second_paragraph TEXT,
    hero_tags_content VARCHAR(255),
    jury_picture VARCHAR(255),
    jury_fullname VARCHAR(255),
    jury_description TEXT
);

CREATE TABLE sponsors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sponsor_name VARCHAR(255),
    partnership_statut VARCHAR(255),
    sponsored_award VARCHAR(255),
    sponsor_logo VARCHAR(255),
    sponsor_link VARCHAR(255)
);

CREATE TABLE jury (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    profil_picture VARCHAR(255)
);

CREATE TABLE realisator (
    id INT PRIMARY KEY AUTO_INCREMENT,
    gender VARCHAR(50),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    birth_date DATE,
    email VARCHAR(255),
    profession VARCHAR(255),
    phone VARCHAR(50),
    mobile_phone VARCHAR(50),
    nationality VARCHAR(100),
    street VARCHAR(255),
    postal_code VARCHAR(20),
    city VARCHAR(100),
    country VARCHAR(100),
    how_did_you_know_us VARCHAR(255),
    newsletter BOOLEAN
);

CREATE TABLE collaborator (
    id INT PRIMARY KEY AUTO_INCREMENT,
    gender VARCHAR(50),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    profession VARCHAR(255),
    role VARCHAR(100)
);

CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    film_tags VARCHAR(255),
    report_tags VARCHAR(255)
);


CREATE TABLE jury_prize (
    id INT PRIMARY KEY AUTO_INCREMENT,
    award_name VARCHAR(255),
    description TEXT,
    sponsor_id INT,
    crash_prize INT,
    laureat VARCHAR(255),
    FOREIGN KEY (sponsor_id) REFERENCES sponsors(id)
);

CREATE TABLE social_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    realisator_id INT,
    platform VARCHAR(100),
    url VARCHAR(255),
    FOREIGN KEY (realisator_id) REFERENCES realisator(id)
);

CREATE TABLE film (
    id INT PRIMARY KEY AUTO_INCREMENT,
    realisator_id INT,
    original_title VARCHAR(255),
    english_title VARCHAR(255),
    language VARCHAR(100),
    original_synopsis TEXT,
    english_synopsis TEXT,
    video_url VARCHAR(255),
    subtitles_id INT,
    duration INT,
    tech_stack VARCHAR(255),
    creative_workflow VARCHAR(255),
    poster_img VARCHAR(255),
    film_media VARCHAR(255),
    statut VARCHAR(100),
    FOREIGN KEY (realisator_id) REFERENCES realisator(id)
);


CREATE TABLE film_gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    film_id INT,
    path_1 VARCHAR(255),
    path_2 VARCHAR(255),
    path_3 VARCHAR(255),
    FOREIGN KEY (film_id) REFERENCES film(id)
);

CREATE TABLE film_subtitles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    film_id INT,
    language VARCHAR(100),
    path VARCHAR(255),
    FOREIGN KEY (film_id) REFERENCES film(id)
);

CREATE TABLE film_collaborator (
    id INT PRIMARY KEY AUTO_INCREMENT,
    film_id INT,
    collaborator_id INT,
    role VARCHAR(100),
    FOREIGN KEY (film_id) REFERENCES film(id),
    FOREIGN KEY (collaborator_id) REFERENCES collaborator(id)
);

CREATE TABLE film_jury (
    id INT PRIMARY KEY AUTO_INCREMENT,
    film_id INT,
    jury_id INT,
    assignation VARCHAR(255),
    commentary TEXT,
    to_review VARCHAR(255),
    FOREIGN KEY (film_id) REFERENCES film(id),
    FOREIGN KEY (jury_id) REFERENCES jury(id)
);

CREATE TABLE film_reported (
    id INT PRIMARY KEY AUTO_INCREMENT,
    film_id INT,
    jury_id INT,
    report_tags VARCHAR(255),
    commentary TEXT,
    FOREIGN KEY (film_id) REFERENCES film(id),
    FOREIGN KEY (jury_id) REFERENCES jury(id)
);

CREATE TABLE film_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    film_id INT,
    tags_id INT,
    FOREIGN KEY (film_id) REFERENCES film(id),
    FOREIGN KEY (tags_id) REFERENCES tags(id)
);