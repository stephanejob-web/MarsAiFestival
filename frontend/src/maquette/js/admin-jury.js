/* ================================================================
   FICHIER — admin-jury.js
   Interface jury : liste des films, lecteur vidéo, système de
   décision (accepter/refuser), délibération et statistiques.
   Dépendances : DOM chargé.
   ================================================================ */

/* ── DONNÉES (maquette) ── */
// decisions: null = pas encore évalué, 'valide', 'aRevoir', 'refuse'
const films = [
  { id:1,  title:"Rêves de Silicium",  author:"Léa Fontaine",   country:"France",    type:"img",
    myDecision: 'valide',
    juryDec: { ML:'valide', PD:'aRevoir', KI:'valide',   SE: null },
    comments: { ML:'Narration percutante, maîtrise formelle remarquable.', PD:'Fin un peu abrupte, à retravailler.', KI:'Très forte proposition artistique.' },
    tools:"Runway ML · Sora · MusicGen", iasc:"ChatGPT-4o · Claude", iaimg:"Runway ML Gen-3 · Sora", iapost:"MusicGen · ElevenLabs",
    note:"J'ai travaillé avec Runway ML pour générer des séquences oniriques, puis dirigé les mouvements de caméra image par image.", dur:"00:59.8", bg:"#0d1b3e" },
  { id:2,  title:"L'Enfant-Pixel",     author:"Amira Ben Said", country:"Tunisie",   type:"hyb",
    myDecision: 'valide',
    juryDec: { ML:'valide', PD:'valide', KI:'valide', SE: null },
    comments: { ML:'Direction visuelle exceptionnelle.', PD:'Très forte.', KI:'Bravo.' },
    tools:"Pika Labs · Udio", iasc:"GPT-4o", iaimg:"Pika Labs 1.5", iapost:"Udio · Premiere Pro",
    note:"Un film sur la frontière entre l'enfance et l'IA générative.", dur:"01:02.1", bg:"#0a2e1a" },
  { id:3,  title:"Archipel 2048",      author:"Kenji Ito",      country:"Japon",     type:"img",
    myDecision: 'aRevoir',
    juryDec: { ML:'aRevoir', PD:'valide', KI: null, SE:'aRevoir' },
    comments: { ML:'Réflexion intéressante, manque de rythme.', PD:'Belle esthétique.' },
    tools:"Stable Diffusion · Kling", iasc:"Claude 3.5", iaimg:"Stable Diffusion XL · Kling", iapost:"Adobe Firefly",
    note:"Réflexion sur les îles artificielles et la montée des eaux.", dur:"01:00.0", bg:"#2e0a0a" },
  { id:4,  title:"Mémoire Vive",       author:"Carlos Ruiz",    country:"Espagne",   type:"hyb",
    myDecision: null,
    juryDec: { ML: null, PD: null, KI: null, SE: null },
    comments: {},
    tools:"Midjourney · ElevenLabs", iasc:"Gemini", iaimg:"Midjourney V6", iapost:"ElevenLabs · Runway",
    note:"La mémoire d'un être humain transposée dans une machine.", dur:"01:28.0", bg:"#2e1a0a" },
  { id:5,  title:"Nouveaux Soleils",   author:"Priya Mehta",    country:"Inde",      type:"img",
    myDecision: null,
    juryDec: { ML:'valide', PD:'valide', KI:'valide', SE:'valide' },
    comments: { ML:'Chef-d\'œuvre.', PD:'Unanime.', KI:'Sublime.' },
    tools:"Sora · MusicGen", iasc:"Claude", iaimg:"Sora Turbo", iapost:"MusicGen · DaVinci",
    note:"Une aube nouvelle pour l'humanité guidée par l'IA.", dur:"01:00.0", bg:"#1a2e0a" },
  { id:6,  title:"Frontières Douces",  author:"Omar Diallo",    country:"Sénégal",   type:"son",
    myDecision: null,
    juryDec: { ML:'refuse', PD:'aRevoir', KI: null, SE:'refuse' },
    comments: { ML:'Trop sonore, peu de visuel.', SE:'Ne correspond pas au cahier des charges.' },
    tools:"ElevenLabs · Suno", iasc:"Mistral", iaimg:"Aucun", iapost:"Suno AI · ElevenLabs",
    note:"Un voyage sonore entre deux cultures.", dur:"01:30.0", bg:"#2e0a2e" },
  { id:7,  title:"Vague Numérique",    author:"Sofia Ek",       country:"Suède",     type:"hyb",
    myDecision: null,
    juryDec: { ML:'valide', PD: null, KI:'valide', SE:'aRevoir' },
    comments: { ML:'Travail visuel très soigné.', KI:'Bonne proposition.' },
    tools:"Runway · Suno", iasc:"GPT-4", iaimg:"Runway ML", iapost:"Suno AI",
    note:"Le numérique comme vague déferlante sur nos sociétés.", dur:"00:58.5", bg:"#0a2e2e" },
  { id:8,  title:"Jardin des Codes",   author:"Lin Wei",        country:"Chine",     type:"img",
    myDecision: null,
    juryDec: { ML:'valide', PD: null, KI:'aRevoir', SE:'valide' },
    comments: { ML:'Poésie numérique rare.', SE:'Beau.' },
    tools:"Kling · Firefly", iasc:"Qwen", iaimg:"Kling AI", iapost:"Adobe Firefly",
    note:"Un jardin zen généré entièrement par IA.", dur:"01:00.0", bg:"#1a2e2e" },
  { id:9,  title:"Signal Perdu",       author:"Aya Tanaka",     country:"Japon",     type:"hyb",
    myDecision: null,
    juryDec: { ML: null, PD: null, KI: null, SE: null },
    comments: {},
    tools:"Pika · Udio", iasc:"GPT-4o", iaimg:"Pika Labs", iapost:"Udio",
    note:"Un signal dans le bruit numérique.", dur:"01:00.0", bg:"#1a0a3e" },
  { id:10, title:"Horizon Zéro",       author:"Mia Schultz",    country:"Allemagne", type:"img",
    myDecision: null,
    juryDec: { ML:'valide', PD:'valide', KI:'valide', SE:'valide' },
    comments: { ML:'Incontournable.', PD:'Unanime.', KI:'Parfait.' },
    tools:"Sora · Adobe Firefly", iasc:"Claude", iaimg:"Sora", iapost:"Adobe Firefly",
    note:"L'horizon comme métaphore du futur possible.", dur:"01:00.0", bg:"#0a1a0a" },
];

const decLabel = { valide:'Validé', aRevoir:'À revoir', refuse:'Refusé' };
const decPillCls = { valide:'vd-valide', aRevoir:'vd-arevoir', refuse:'vd-refuse' };
const decDotCls  = { valide:'s-select',  aRevoir:'s-pending',  refuse:'s-reject'  };
const decFiCls   = { valide:'fd-valide', aRevoir:'fd-arevoir', refuse:'fd-refuse' };
const decBadge   = { valide:'fdb-valide',aRevoir:'fdb-arevoir',refuse:'fdb-refuse' };

/* ── LISTE FILMS ── */
let activeFilm = 1;
let playInterval = null, isPlaying = false, progress = 42;

function renderList(filterFn) {
  const el = document.getElementById('film-list-scroll');
  const list = (filterFn ? films.filter(filterFn) : films);
  el.innerHTML = list.map(f => {
    const dec = f.myDecision;
    const dotCls = dec ? decDotCls[dec] : 's-pending';
    const fiCls  = dec ? decFiCls[dec]  : 'fd-none';
    const fiTxt  = dec ? decLabel[dec]   : '—';
    return `<div class="film-item ${f.id===activeFilm?'selected':''}" onclick="loadFilm(${f.id})">
      <div class="fi-thumb" style="background:${f.bg};">🎬<div class="fi-status-dot ${dotCls}"></div></div>
      <div class="fi-info">
        <div class="fi-title">${f.title}</div>
        <div class="fi-sub">${f.author} · ${f.country}</div>
      </div>
      <span class="fi-dec ${fiCls}">${fiTxt}</span>
    </div>`;
  }).join('');
}

function loadFilm(id) {
  activeFilm = id;
  const f = films.find(x=>x.id===id);
  document.getElementById('d-title').textContent  = f.title;
  document.getElementById('d-author').textContent = `${f.author} · ${f.country} · 2026`;
  document.getElementById('d-tools').textContent  = f.tools;
  document.getElementById('d-dur').textContent    = f.dur;
  document.getElementById('d-ia-sc').textContent  = f.iasc;
  document.getElementById('d-ia-img').textContent = f.iaimg;
  document.getElementById('d-ia-post').textContent= f.iapost;
  document.getElementById('d-note').textContent   = `"${f.note}"`;
  document.getElementById('player-film-name').textContent = f.title;
  // Badge décision courante
  const badge = document.getElementById('d-decision-badge');
  if (f.myDecision) {
    badge.textContent  = decLabel[f.myDecision];
    badge.className    = `film-decision-badge ${decBadge[f.myDecision]}`;
  } else {
    badge.textContent  = '— Non évalué';
    badge.className    = 'film-decision-badge fdb-none';
  }
  // Boutons actifs
  ['valide','arevoir','refuse'].forEach(k => {
    document.getElementById('btn-'+k).classList.remove('active');
  });
  if (f.myDecision) {
    const map = { valide:'valide', aRevoir:'arevoir', refuse:'refuse' };
    document.getElementById('btn-'+map[f.myDecision])?.classList.add('active');
  }
  document.getElementById('comment-input').value = f.comments?.['ML'] || '';
  renderVotes(f);
  renderComments(f);
  stopPlayer(); progress = 0;
  document.getElementById('pbar').style.width = '0%';
  document.getElementById('ptime').textContent = '0:00 / 1:00';
  renderList();
}

/* ── PLAYER ── */
function togglePlay(el) {
  isPlaying = !isPlaying; el.textContent = isPlaying ? '⏸' : '▶'; el.style.paddingLeft = isPlaying ? '0' : '4px';
  const b2 = document.querySelector('.cbtn.play-btn');
  if (b2) { b2.textContent = isPlaying ? '⏸' : '▶'; b2.style.paddingLeft = isPlaying ? '0' : '2px'; }
  if (isPlaying) startProgress(); else stopPlayer();
}
function togglePlay2(el) {
  isPlaying = !isPlaying; el.textContent = isPlaying ? '⏸' : '▶'; el.style.paddingLeft = isPlaying ? '0' : '2px';
  const bb = document.querySelector('.play-center');
  if (bb) { bb.textContent = isPlaying ? '⏸' : '▶'; bb.style.paddingLeft = isPlaying ? '0' : '4px'; }
  if (isPlaying) startProgress(); else stopPlayer();
}
function startProgress() {
  if (playInterval) clearInterval(playInterval);
  playInterval = setInterval(() => {
    progress = Math.min(100, progress + 0.4);
    document.getElementById('pbar').style.width = progress + '%';
    const s = Math.round(progress * 0.6);
    document.getElementById('ptime').textContent = `0:${String(s).padStart(2,'0')} / 1:00`;
    if (progress >= 100) { isPlaying = false; clearInterval(playInterval); }
  }, 150);
}
function stopPlayer() { if (playInterval) clearInterval(playInterval); isPlaying = false; }

/* ── MODALS DÉCISION ── */
function openModalARevoir() {
  const f = films.find(x => x.id === activeFilm);
  if (!f) return;
  document.getElementById('arevoir-chip').textContent = '🎬 ' + f.title;
  document.getElementById('arevoir-message').value = f.comments?.['ML'] || '';
  document.getElementById('arevoir-message').classList.remove('error');
  document.getElementById('arevoir-hint').classList.remove('show');
  document.getElementById('modal-arevoir').classList.add('open');
  setTimeout(() => document.getElementById('arevoir-message').focus(), 180);
}

function openModalRefuse() {
  const f = films.find(x => x.id === activeFilm);
  if (!f) return;
  document.getElementById('refuse-chip').textContent = '🎬 ' + f.title;
  const defaultMsg =
    `Madame, Monsieur,\n\n` +
    `Nous avons visionné votre film « ${f.title} » dans le cadre de la sélection marsAI 2026.\n\n` +
    `Après délibération, nous avons le regret de vous informer que votre œuvre n'a pas été retenue pour la sélection officielle cette année.\n\n` +
    `Nous vous remercions de l'intérêt que vous portez au festival et vous encourageons à soumettre vos prochains travaux lors des éditions futures.\n\n` +
    `Cordialement,\nL'équipe marsAI 2026`;
  document.getElementById('refuse-message').value = defaultMsg;
  document.getElementById('modal-refuse').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function closeModalOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}

function confirmARevoir() {
  const msg = document.getElementById('arevoir-message').value.trim();
  if (!msg) {
    document.getElementById('arevoir-message').classList.add('error');
    document.getElementById('arevoir-hint').classList.add('show');
    return;
  }
  const f = films.find(x => x.id === activeFilm);
  if (f) f.comments['ML'] = msg;
  closeModal('modal-arevoir');
  decide('aRevoir');
}

function confirmRefuse() {
  closeModal('modal-refuse');
  decide('refuse');
}

/* ── DÉCISION ── */
function decide(type) {
  const f = films.find(x=>x.id===activeFilm);
  if (!f) return;
  f.myDecision = type;
  // Sauvegarder le commentaire en même temps que la décision
  const comment = document.getElementById('comment-input').value.trim();
  if (comment) f.comments['ML'] = comment;
  // Feedback toast selon type
  const toasts = {
    valide:   ['✓ Validé : ' + f.title, 'ok'],
    aRevoir:  ['↩ À revoir — Email candidat envoyé : ' + f.title, 'warn'],
    refuse:   ['✕ Refusé — Email candidat envoyé : ' + f.title, 'err'],
  };
  showToast(...toasts[type]);
  loadFilm(activeFilm);
  updateCounts();
  if (type !== 'aRevoir') {
    setTimeout(() => {
      const idx = films.findIndex(x=>x.id===activeFilm);
      if (films[idx+1]) loadFilm(films[idx+1].id);
    }, 800);
  }
}

function updateCounts() {
  const evaluated = films.filter(f => f.myDecision !== null).length;
  const pending   = films.length - evaluated;
  document.getElementById('nav-pending').textContent  = pending;
  document.getElementById('nav-selected').textContent = evaluated;
}

/* ── PUBLIER COMMENTAIRE ── */
function postComment() {
  const f = films.find(x=>x.id===activeFilm);
  if (!f) return;
  const comment = document.getElementById('comment-input').value.trim();
  if (!comment) { showToast('Écrivez un commentaire avant de publier.', 'err'); return; }
  f.comments['ML'] = comment;
  f.juryDec['ML'] = f.juryDec['ML'] || null; // ne change pas la décision
  renderVotes(f);
  renderComments(f);
  showToast('💬 Commentaire publié', 'ok');
}

/* ── RENDU COMMENTAIRES ── */
function renderComments(f) {
  const el = document.getElementById('comments-thread');
  if (!el) return;
  const withComments = jurors.filter(j => f.comments?.[j.key]);
  if (!withComments.length) {
    el.innerHTML = '<div class="ct-empty">Aucun commentaire pour ce film.</div>';
    return;
  }
  el.innerHTML = withComments.map(j => {
    const dec = f.juryDec[j.key];
    const isMine = j.key === 'ML';
    const pillHtml = dec
      ? `<span class="vote-dec ${decPillCls[dec]}">${decLabel[dec]}</span>`
      : '';
    return `<div class="ct-item ${isMine ? 'ct-mine' : ''}">
      <div class="vote-avatar ${j.cls}">${j.initials}</div>
      <div class="ct-body">
        <div class="ct-header">
          <span class="ct-name">${j.name}</span>
          ${isMine ? '<span style="font-size:0.68rem;color:var(--aurora);font-weight:600;">Moi</span>' : `<span class="ct-role">${j.role}</span>`}
          ${pillHtml}
        </div>
        <div class="ct-text">"${f.comments[j.key]}"</div>
      </div>
    </div>`;
  }).join('');
}

/* ── VOTES JURY ── */
const jurors = [
  { key:'ML', initials:'ML', name:'Marie Lefebvre', role:'Présidente · Réalisatrice', cls:'va-1' },
  { key:'PD', initials:'PD', name:'Pierre Dubois',  role:'Directeur artistique',      cls:'va-2' },
  { key:'KI', initials:'KI', name:'Kenji Ito',      role:'Artiste numérique',         cls:'va-3' },
  { key:'SE', initials:'SE', name:'Sofia Eriksson', role:'Critique de cinéma',        cls:'va-4' },
];

function renderVotes(f) {
  const el = document.getElementById('votes-list');
  if (!el) return;
  el.innerHTML = jurors.map(j => {
    const dec     = f.juryDec[j.key];
    const comment = f.comments?.[j.key] || '';
    const pending = dec === null || dec === undefined;
    const pillCls = pending ? 'vd-none' : decPillCls[dec];
    const pillTxt = pending ? 'En attente' : decLabel[dec];
    return `<div>
      <div class="vote-row" style="${pending?'opacity:0.45;border-style:dashed;':''}">
        <div class="vote-avatar ${j.cls}">${j.initials}</div>
        <div style="flex:1;">
          <div class="vote-name">${j.name}</div>
          <div class="vote-role">${pending ? 'Pas encore évalué' : j.role}</div>
        </div>
        <span class="vote-dec ${pillCls}">${pillTxt}</span>
      </div>
      ${!pending && comment ? `<div class="vote-comment">"${comment}"</div>` : ''}
    </div>`;
  }).join('');
}

/* ── TABS ── */
function setTab(el, label) {
  document.querySelectorAll('.ltab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  if (label === 'À évaluer') renderList(f => f.myDecision === null);
  else if (label === 'Évalués') renderList(f => f.myDecision !== null);
  else renderList();
}

/* ── VUES ── */
function switchView(view, navEl) {
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  if (view === 'eval') {
    document.getElementById('view-eval').style.display = 'flex';
    document.getElementById('view-delib').classList.remove('active');
    document.getElementById('topbar-title').textContent = 'Films assignés';
    document.getElementById('topbar-info').textContent  = 'Films assignés par l\'administrateur — évaluation individuelle';
    document.getElementById('phase-badge').textContent  = 'Phase 1 · Top 50 · 12/12/26';
    document.getElementById('phase-badge').className    = 'phase-badge phase-1';
  } else {
    document.getElementById('view-eval').style.display = 'none';
    document.getElementById('view-delib').classList.add('active');
    document.getElementById('topbar-title').textContent = 'Délibération';
    document.getElementById('topbar-info').textContent  = 'Récapitulatif des décisions du jury';
    document.getElementById('phase-badge').textContent  = 'Phase 1 · Top 50 · 12/12/26';
    document.getElementById('phase-badge').className    = 'phase-badge phase-1';
    renderDelib();
  }
}

/* ── DÉLIBÉRATION ── */
function renderDelib() {
  const table = document.getElementById('delib-table');
  const pill = (dec) => {
    if (!dec) return `<span style="color:rgba(136,146,176,0.35);font-size:0.72rem;">—</span>`;
    const cls = { valide:'sp-valide', aRevoir:'sp-arevoir', refuse:'sp-refuse' }[dec];
    const txt = decLabel[dec];
    return `<span class="status-pill ${cls}">${txt}</span>`;
  };
  const tbody = films.map((f, i) => {
    const overall = f.juryDec;
    const vals = Object.values(overall).filter(d=>d==='valide').length;
    const tot  = Object.values(overall).filter(d=>d!==null).length;
    const sp = tot === 0 ? 'sp-none' :
               vals >= 3 ? 'sp-valide' :
               Object.values(overall).filter(d=>d==='refuse').length >= 2 ? 'sp-refuse' : 'sp-arevoir';
    const spTxt = { 'sp-valide':'Validé','sp-arevoir':'À revoir','sp-refuse':'Refusé','sp-none':'En attente' }[sp];
    const rk = i < 3 ? 'gold' : '';
    return `<tr onclick="switchView('eval');loadFilm(${f.id})">
      <td><span class="rank ${rk}">${i+1}</span></td>
      <td><strong>${f.title}</strong></td>
      <td style="color:var(--mist);font-size:0.78rem;">${f.author}</td>
      <td>${pill(overall.ML)}</td>
      <td>${pill(overall.PD)}</td>
      <td>${pill(overall.KI)}</td>
      <td>${pill(overall.SE)}</td>
      <td><span class="status-pill ${sp}">${spTxt}</span></td>
    </tr>`;
  }).join('');
  table.innerHTML = `
    <thead><tr>
      <th>#</th><th>Film</th><th>Réalisateur</th>
      <th>ML</th><th>PD</th><th>KI</th><th>SE</th>
      <th>Décision</th>
    </tr></thead>
    <tbody>${tbody}</tbody>`;
}

function setPhaseTab(el, phase) {
  document.querySelectorAll('.ptab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  const badge = document.getElementById('phase-badge');
  if (phase === 1) {
    badge.textContent = 'Phase 1 · Top 50 · 12/12/26';
    badge.className   = 'phase-badge phase-1';
  } else {
    badge.textContent = 'Phase 2 · Top 5 · Finale';
    badge.className   = 'phase-badge phase-2';
    // En phase 2 on ne montre que 5 films (les plus validés)
    const t = document.getElementById('delib-table');
    if (t && t.tBodies[0]) {
      const rows = Array.from(t.tBodies[0].rows);
      rows.forEach((r, i) => r.style.display = i < 5 ? '' : 'none');
    }
  }
}

/* ── TOAST ── */
function showToast(msg, type='ok') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── INIT ── */
renderList();
updateCounts();
renderVotes(films[0]);
renderComments(films[0]);
document.getElementById('comment-input').value = films[0].comments?.['ML'] || '';
