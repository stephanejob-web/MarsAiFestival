-- ─────────────────────────────────────────────────────────────────────────────
-- seed-assignments.sql
-- Assigne 15 films à Stephane Job (jury_id=2) pour les tests
-- Admin = id 1, Stephane = id 2
-- ─────────────────────────────────────────────────────────────────────────────

INSERT IGNORE INTO jury_film_assignment (jury_id, film_id, assigned_by) VALUES
  (2,  1, 1),
  (2,  2, 1),
  (2,  3, 1),
  (2,  4, 1),
  (2,  5, 1),
  (2,  6, 1),
  (2,  7, 1),
  (2,  8, 1),
  (2,  9, 1),
  (2, 10, 1),
  (2, 11, 1),
  (2, 12, 1),
  (2, 13, 1),
  (2, 14, 1),
  (2, 15, 1);

SELECT
  jfa.id,
  CONCAT(j.first_name, ' ', j.last_name) AS juré,
  f.original_title AS film,
  f.dossier_num
FROM jury_film_assignment jfa
JOIN jury j ON j.id = jfa.jury_id
JOIN film f  ON f.id  = jfa.film_id
WHERE jfa.jury_id = 2
ORDER BY jfa.id;
