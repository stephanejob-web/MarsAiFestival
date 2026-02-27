/* ================================================================
   FICHIER — confirmation-depot.js
   Lecture des données sessionStorage pour afficher le numéro
   de dossier et l'email du déposant.
   ================================================================ */

const saved = JSON.parse(sessionStorage.getItem('depot_data') || '{}');
if (saved.num)   document.getElementById('dossier-num').textContent   = saved.num;
if (saved.email) document.getElementById('confirm-email').textContent = saved.email;
