/* ================================================================
   FICHIER — login-jury.js
   Connexion jury / admin : basculement de rôle, inscription,
   connexion, navigation vers l'espace correspondant.
   ================================================================ */

/* ── BASCULEMENT DE RÔLE ────────────────────────────────────── */
function switchRole(role, btn) {
  const parent = btn.closest('.role-switch');
  parent.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ── BASCULEMENT ONGLETS (Connexion / Inscription) ──────────── */
function switchTab(tab, btn) {
  document.querySelectorAll('#tab-login, #tab-register').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('form-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('form-register').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('error-msg').classList.remove('show');
  const success = document.getElementById('success-msg');
  if (success) success.style.display = 'none';
}

/* ── GESTION DU LOGIN ──────────────────────────────────────── */
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (!email) return;

  // Maquette : rediriger directement vers l'espace
  goToSpace();
}

/* ── GESTION DE L'INSCRIPTION ──────────────────────────────── */
function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pwd = document.getElementById('reg-password').value;
  const pwd2 = document.getElementById('reg-password-confirm').value;

  if (!name || !email) return;

  if (pwd !== pwd2) {
    showToast('Les mots de passe ne correspondent pas.', 'err');
    return;
  }
  if (pwd.length < 8) {
    showToast('Le mot de passe doit contenir au moins 8 caractères.', 'err');
    return;
  }

  // Maquette : afficher le message de succès et basculer vers l'onglet login
  const success = document.getElementById('success-msg');
  if (success) success.style.display = 'block';
  showToast('✓ Compte créé pour ' + name, 'ok');

  // Basculer vers l'onglet connexion
  setTimeout(() => {
    switchTab('login', document.getElementById('tab-login'));
    document.getElementById('email').value = email;
  }, 1500);
}

/* ── NAVIGATION VERS L'ESPACE ──────────────────────────────── */
function goToSpace() {
  const activeRole = document.querySelector('#form-login .role-btn.active');
  const isAdmin = activeRole && activeRole.textContent.includes('Admin');
  window.location.href = isAdmin ? 'admin-panel.html' : 'admin-jury.html';
}

/* ── TOAST ──────────────────────────────────────────────────── */
function showToast(msg, type = 'ok') {
  // Simple toast via alert pour la maquette (pas de composant toast sur cette page)
  let toast = document.getElementById('login-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'login-toast';
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:10px 18px;border-radius:10px;font-size:0.82rem;font-weight:500;border:1px solid;backdrop-filter:blur(12px);opacity:0;transform:translateY(8px);transition:all 0.25s;pointer-events:none;z-index:100;font-family:var(--font-body);';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  const styles = {
    ok:   { bg: 'rgba(78,255,206,0.1)',  bc: 'rgba(78,255,206,0.3)',  c: '#4EFFCE' },
    err:  { bg: 'rgba(255,107,107,0.1)', bc: 'rgba(255,107,107,0.25)', c: '#FF6B6B' },
    warn: { bg: 'rgba(245,230,66,0.08)', bc: 'rgba(245,230,66,0.25)', c: '#F5E642' },
  };
  const s = styles[type] || styles.ok;
  toast.style.background = s.bg;
  toast.style.borderColor = s.bc;
  toast.style.color = s.c;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(8px)'; }, 3000);
}
