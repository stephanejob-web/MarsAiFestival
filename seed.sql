-- ================================================================
-- seed.sql — MarsAI Festival 2026 — Données de test
-- ================================================================
-- Usage : mysql -u root -p MarsAi < seed.sql
--
-- Crée 10 réalisateurs avec 10 films et des statuts variés.
-- Les video_url pointent vers le bucket S3 — exécuter seed-s3.js
-- APRÈS ce script pour uploader les vidéos correspondantes.
-- ================================================================

USE MarsAi;

-- ----------------------------------------------------------------
-- Réalisateurs
-- ----------------------------------------------------------------
INSERT INTO realisator (gender, first_name, last_name, birth_date, email, profession, mobile_phone, street, postal_code, city, country, instagram, newsletter) VALUES
('M',   'Lucas',    'Bernard',   '1992-03-14', 'lucas.bernard@email.com',    'Réalisateur',         '+33612345601', '12 rue des Arts',        '75010', 'Paris',       'France',    '@lucasbernard',   TRUE),
('Mme', 'Sofia',    'Morales',   '1988-07-22', 'sofia.morales@email.com',    'Artiste numérique',   '+34612345602', 'Calle Mayor 5',          '28001', 'Madrid',      'Espagne',   '@sofiamorales',   FALSE),
('M',   'Kenji',    'Tanaka',    '1995-11-05', 'kenji.tanaka@email.com',     'Motion designer',     '+81312345603', '3-12 Shibuya',           '150-0002', 'Tokyo',    'Japon',     '@kenjitanaka',    TRUE),
('Mme', 'Amira',    'Okafor',    '1990-04-18', 'amira.okafor@email.com',     'Cinéaste',            '+2348012345604','15 Broad Street',        '100001', 'Lagos',     'Nigeria',   '@amiraokafor',    TRUE),
('M',   'Ethan',    'Novak',     '1993-09-30', 'ethan.novak@email.com',      'Développeur créatif', '+42012345605', 'Václavské náměstí 1',    '110 00', 'Prague',    'Tchéquie',  '@ethannovak',     FALSE),
('Mme', 'Camille',  'Rousseau',  '1986-02-11', 'camille.rousseau@email.com', 'Réalisatrice',        '+33712345606', '8 avenue Montaigne',     '75008', 'Paris',       'France',    '@camillerousseau',TRUE),
('M',   'Diego',    'Herrera',   '1997-06-25', 'diego.herrera@email.com',    'Animateur 3D',        '+52112345607', 'Av. Reforma 200',        '06600', 'Mexico',      'Mexique',   '@diegoherrera',   TRUE),
('Mme', 'Priya',    'Sharma',    '1991-12-03', 'priya.sharma@email.com',     'Photographe',         '+91912345608', '42 MG Road',             '560001', 'Bangalore', 'Inde',      '@priyasharma',    FALSE),
('M',   'Noah',     'Fischer',   '1994-08-17', 'noah.fischer@email.com',     'Scénariste',          '+49112345609', 'Unter den Linden 10',    '10117', 'Berlin',      'Allemagne', '@noahfischer',    TRUE),
('Mme', 'Léa',      'Fontaine',  '1989-05-09', 'lea.fontaine@email.com',     'Monteuse',            '+33512345610', '3 place Bellecour',      '69002', 'Lyon',        'France',    '@leafontaine',    TRUE);

-- ----------------------------------------------------------------
-- Films (liés aux réalisateurs ci-dessus, dans l'ordre)
-- Les video_url correspondent aux fichiers uploadés par seed-s3.js
-- ----------------------------------------------------------------
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
  SELECT 'lucas.bernard@email.com'    AS email, 'MAI-2026-10001' AS dossier_num, 'Fragments d\'IA'          AS original_title, 'AI Fragments'       AS english_title, 'Français'  AS language, 'Expérimental, SF'   AS tags, 'Un homme découvre que ses souvenirs ont été partiellement remplacés par des hallucinations générées par IA.'   AS original_synopsis, 'A man discovers his memories have been partially replaced by AI-generated hallucinations.'         AS english_synopsis, 'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10001/video-test.mp4' AS video_url, 342 AS duration, 'Exploration des limites entre réel et virtuel via Stable Diffusion.'  AS creative_workflow, 'Stable Diffusion, Runway Gen-2, DaVinci Resolve' AS tech_stack, 'hybrid' AS ia_class, TRUE AS ia_image, FALSE AS ia_son, TRUE AS ia_scenario, TRUE AS ia_post, 'to_review' AS statut
  UNION ALL
  SELECT 'sofia.morales@email.com',    'MAI-2026-10002', 'La Última Señal',             'The Last Signal',   'Espagnol', 'Thriller, Drame',   'Une scientifique reçoit un signal radio provenant d\'une version alternative d\'elle-même.',              'A scientist receives a radio signal from an alternative version of herself.',                       'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10002/video-test.mp4', 518, 'Génération des décors futuristes avec Midjourney v6.',                 'Midjourney v6, Udio, Adobe Premiere',           'hybrid', FALSE, TRUE,  FALSE, TRUE,  'valide'
  UNION ALL
  SELECT 'kenji.tanaka@email.com',     'MAI-2026-10003', 'デジタルの夢',                 'Digital Dream',     'Japonais', 'Animation, Poésie', 'Un artiste numérique plonge dans un monde où chaque pensée prend vie sous forme d\'animation.'            , 'A digital artist dives into a world where every thought comes to life as animation.',              'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10003/video-test.mp4', 275, 'Animation frame par frame augmentée par IA pour les transitions.',    'Sora, After Effects, Udio',                     'full',   TRUE,  TRUE,  TRUE,  TRUE,  'arevoir'
  UNION ALL
  SELECT 'amira.okafor@email.com',     'MAI-2026-10004', 'Mémoire Collective',          'Collective Memory', 'Français', 'Documentaire, IA',  'Exploration de la mémoire collective africaine à travers des archives reconstituées par intelligence artificielle.', 'Exploration of African collective memory through archives reconstituted by artificial intelligence.', 'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10004/video-test.mp4', 623, 'Reconstruction d\'archives historiques via IA générative.',           'Sora, Stable Diffusion, ElevenLabs',            'hybrid', TRUE,  TRUE,  FALSE, TRUE,  'to_review'
  UNION ALL
  SELECT 'ethan.novak@email.com',      'MAI-2026-10005', 'Synthetik',                   'Synthetik',         'Anglais',  'SF, Action',        'Dans un Prague post-apocalyptique, un androïde cherche à comprendre ce qu\'est l\'empathie humaine.',       'In a post-apocalyptic Prague, an android tries to understand what human empathy is.',               'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10005/video-test.mp4', 487, 'Décors entièrement générés, seuls les acteurs sont réels.',           'Runway Gen-3, ElevenLabs, Udio',                'hybrid', TRUE,  TRUE,  TRUE,  FALSE, 'in_discussion'
  UNION ALL
  SELECT 'camille.rousseau@email.com', 'MAI-2026-10006', 'L\'Algorithme du Cœur',       'Heart Algorithm',   'Français', 'Romance, Drame',    'Une pianiste tombe amoureuse d\'une composition générée par IA sans savoir qu\'elle n\'a pas d\'auteur humain.', 'A pianist falls in love with an AI-generated composition without knowing it has no human author.',   'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10006/video-test.mp4', 391, 'Musique entièrement composée par Suno AI, arrangements humains.',     'Suno AI, Midjourney, Final Cut Pro',            'hybrid', FALSE, TRUE,  TRUE,  FALSE, 'valide'
  UNION ALL
  SELECT 'diego.herrera@email.com',    'MAI-2026-10007', 'Espejo Roto',                 'Broken Mirror',     'Espagnol', 'Horreur, Psycho',   'Un homme retrouve d\'anciennes vidéos de famille dont il n\'a aucun souvenir et qui semblent appartenir à une autre vie.', 'A man finds old family videos he has no memory of, seemingly belonging to another life.',           'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10007/video-test.mp4', 556, 'Effets visuels de distorsion temporelle via IA.',                     'Runway Gen-3, Stable Diffusion XL, Resolve',   'full',   TRUE,  FALSE, TRUE,  TRUE,  'refuse'
  UNION ALL
  SELECT 'priya.sharma@email.com',     'MAI-2026-10008', 'The Dreaming Machine',        'The Dreaming Machine','Anglais', 'SF, Philosophie',   'Une IA développe la capacité de rêver et commence à produire des films de façon autonome.',                'An AI develops the ability to dream and begins producing films autonomously.',                      'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10008/video-test.mp4', 448, '100% généré par IA — zéro intervention humaine dans les visuels.',   'Sora, ElevenLabs, Claude, Udio',                'full',   TRUE,  TRUE,  TRUE,  TRUE,  'to_review'
  UNION ALL
  SELECT 'noah.fischer@email.com',     'MAI-2026-10009', 'Stille Wasser',               'Still Waters',      'Allemand', 'Drame, Nature',     'Un garde forestier découvre que la forêt qu\'il protège communique à travers des patterns biologiques IA.', 'A forest ranger discovers the forest he protects communicates through AI biological patterns.',      'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10009/video-test.mp4', 312, 'Sons naturels re-synthétisés, images augmentées par IA.',             'Stable Audio, Midjourney, Premiere Pro',         'hybrid', TRUE,  TRUE,  FALSE, FALSE, 'asked_to_modify'
  UNION ALL
  SELECT 'lea.fontaine@email.com',     'MAI-2026-10010', 'Résonance',                   'Resonance',         'Français', 'Expérimental, Art', 'Un voyage sensoriel au cœur de la synesthésie : sons qui deviennent images, couleurs qui deviennent musique.', 'A sensory journey into synesthesia: sounds become images, colors become music.',                    'https://s3.fr-par.scw.cloud/tln/grp1/MAI-2026-10010/video-test.mp4', 198, 'Conversion son → image via IA en temps réel, installation interactive.','Stable Diffusion, Suno AI, TouchDesigner',      'full',   TRUE,  TRUE,  FALSE, TRUE,  'to_review'
) AS f
JOIN realisator r ON r.email = f.email;
