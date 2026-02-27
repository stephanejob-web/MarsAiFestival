/* ================================================================
   FICHIER — login-jury.js
   Connexion jury / admin : basculement de rôle, envoi du lien
   de connexion, navigation vers l'espace correspondant.
   ================================================================ */

/* ── BASCULEMENT DE RÔLE ────────────────────────────────────── */
function switchRole(role, btn) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ── GESTION DU LOGIN ──────────────────────────────────────── */
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (!email) return;

  document.getElementById('error-msg').classList.remove('show');
  document.getElementById('sent-email-display').textContent = email;
  document.getElementById('form-state').style.display = 'none';
  document.getElementById('sent-state').style.display = 'block';
}

/* ── NAVIGATION VERS L'ESPACE ──────────────────────────────── */
function goToSpace() {
  const activeRole = document.querySelector('.role-btn.active');
  const isAdmin = activeRole && activeRole.textContent.includes('Admin');
  window.location.href = isAdmin ? 'admin-panel.html' : 'admin-jury.html';
}
