/* ================================================================
   FICHIER — admin-panel.js
   Panneau d'administration : données mock, CRUD films/jurés,
   tableaux, filtres, modales, vues et statistiques.
   Dépendances : DOM chargé.
   ================================================================ */

  /* ── DONNÉES MAQUETTE ── */
  const films = [
    { id:1,  title:"Rêves de Silicium",   author:"Léa Fontaine",   country:"France",
      juryDec:{ 1:'valide', 2:'aRevoir', 3:'valide', 4:null },
      comments:{ 1:"Narration percutante, maîtrise formelle remarquable.", 2:"Fin un peu abrupte, à retravailler.", 3:"Très forte proposition artistique." } },
    { id:2,  title:"L'Enfant-Pixel",      author:"Amira Ben Said", country:"Tunisie",
      juryDec:{ 1:'valide', 2:'valide', 3:'valide', 4:null },
      comments:{ 1:"Direction visuelle exceptionnelle.", 2:"Très forte.", 3:"Bravo." } },
    { id:3,  title:"Archipel 2048",       author:"Kenji Ito",      country:"Japon",
      juryDec:{ 1:'aRevoir', 2:'valide', 3:null, 4:'aRevoir' },
      comments:{ 1:"Réflexion intéressante, manque de rythme.", 2:"Belle esthétique." } },
    { id:4,  title:"Mémoire Vive",        author:"Carlos Ruiz",    country:"Espagne",
      juryDec:{ 1:null, 2:null, 3:null, 4:null }, comments:{} },
    { id:5,  title:"Nouveaux Soleils",    author:"Priya Mehta",    country:"Inde",
      juryDec:{ 1:'valide', 2:'valide', 3:'valide', 4:'valide' },
      comments:{ 1:"Chef-d'œuvre, unanime.", 2:"Absolument.", 3:"Sublime.", 4:"Coup de cœur." } },
    { id:6,  title:"Frontières Douces",   author:"Omar Diallo",    country:"Sénégal",
      juryDec:{ 1:'refuse', 2:'aRevoir', 3:null, 4:'refuse' },
      comments:{ 1:"Trop sonore, peu de visuel.", 4:"Ne correspond pas au cahier des charges." } },
    { id:7,  title:"Vague Numérique",     author:"Sofia Ek",       country:"Suède",
      juryDec:{ 1:'valide', 2:null, 3:'valide', 4:'aRevoir' },
      comments:{ 1:"Travail visuel très soigné.", 3:"Bonne proposition." } },
    { id:8,  title:"Jardin des Codes",    author:"Lin Wei",        country:"Chine",
      juryDec:{ 1:'valide', 2:null, 3:'aRevoir', 4:'valide' },
      comments:{ 1:"Poésie numérique rare.", 4:"Beau." } },
    { id:9,  title:"Signal Perdu",        author:"Aya Tanaka",     country:"Japon",
      juryDec:{ 1:null, 2:null, 3:null, 4:null }, comments:{} },
    { id:10, title:"Horizon Zéro",        author:"Mia Schultz",    country:"Allemagne",
      juryDec:{ 1:'valide', 2:'valide', 3:'valide', 4:'valide' },
      comments:{ 1:"Incontournable.", 2:"Unanime.", 3:"Parfait.", 4:"À sélectionner absolument." } },
    { id:11, title:"Corps Électrique",        author:"Nadia Okonkwo",      country:"Nigeria" },
    { id:12, title:"Le Miroir Bruité",        author:"Thomas Vidal",       country:"France" },
    { id:13, title:"Synthèse Éternelle",      author:"Park Ji-won",        country:"Corée du Sud" },
    { id:14, title:"Désert de Données",       author:"Yasmine Alaoui",     country:"Maroc" },
    { id:15, title:"Pulse",                   author:"Elena Petrov",       country:"Russie" },
    { id:16, title:"La Dernière Fréquence",   author:"Marco Ferretti",     country:"Italie" },
    { id:17, title:"Matière Grise",           author:"Chidi Osei",         country:"Ghana" },
    { id:18, title:"Lumière Froide",          author:"Ingrid Larsen",      country:"Norvège" },
    { id:19, title:"Algorithme du Cœur",      author:"Fatima Zahra",       country:"Algérie" },
    { id:20, title:"Neurones d'Acier",        author:"Viktor Novak",       country:"Tchéquie" },
    { id:21, title:"L'Œil Augmenté",          author:"Rania Hassan",       country:"Égypte" },
    { id:22, title:"Boucle Infinie",          author:"Diego Castillo",     country:"Mexique" },
    { id:23, title:"Écho d'Humanité",         author:"Yuki Nakamura",      country:"Japon" },
    { id:24, title:"Partition Invisible",     author:"Selin Yıldız",       country:"Turquie" },
    { id:25, title:"Terra Incognita",         author:"Ana Rodrigues",      country:"Portugal" },
    { id:26, title:"Conscience Liquide",      author:"Samuel Oduya",       country:"Kenya" },
    { id:27, title:"Émergence",               author:"Claire Morin",       country:"France" },
    { id:28, title:"Le Temps Fracturé",       author:"Hana Kim",           country:"Corée du Sud" },
    { id:29, title:"Biomécanique",            author:"Rafael Santos",      country:"Brésil" },
    { id:30, title:"Flux",                    author:"Amara Touré",        country:"Mali" },
    { id:31, title:"Phosphène",              author:"Giulia Romano",       country:"Italie" },
    { id:32, title:"L'Arbre Numérique",       author:"Mehdi Karimi",       country:"Iran" },
    { id:33, title:"Strates",                 author:"Olga Sorokina",      country:"Ukraine" },
    { id:34, title:"Hyperréel",               author:"James Okafor",       country:"Nigeria" },
    { id:35, title:"Protocole Zéro",          author:"Sven Eriksson",      country:"Suède" },
    { id:36, title:"Mutation Douce",          author:"Layla Al-Rashid",    country:"Irak" },
    { id:37, title:"Zéro Latence",            author:"Chen Mingzhi",       country:"Chine" },
    { id:38, title:"Le Chant des Machines",   author:"Idrissa Coulibaly",  country:"Burkina Faso" },
    { id:39, title:"Fractale",                author:"Nina Kovač",         country:"Croatie" },
    { id:40, title:"Résonance",               author:"Pablo Herrera",      country:"Colombie" },
    { id:41, title:"Interface",               author:"Mele Tupou",         country:"Tonga" },
    { id:42, title:"Continuum",               author:"Aiko Suzuki",        country:"Japon" },
    { id:43, title:"L'Ère du Vide",           author:"Camille Perret",     country:"Belgique" },
    { id:44, title:"Données Sensibles",       author:"Kofi Mensah",        country:"Ghana" },
    { id:45, title:"Synthétique",             author:"Lucía Fernández",    country:"Argentine" },
    { id:46, title:"Grille",                  author:"Dmitri Volkov",      country:"Russie" },
    { id:47, title:"Post-Humain",             author:"Leila Nasser",       country:"Liban" },
    { id:48, title:"Code Source",             author:"Étienne Blanchard",  country:"Canada" },
    { id:49, title:"Éveil",                   author:"Sunita Rao",         country:"Inde" },
    { id:50, title:"La Mémoire des Pixels",   author:"Zara Ahmed",         country:"Pakistan" },
  ];

  let users = [
    { id:1,  name:"Marie Lefebvre",  email:"m.lefebvre@marsai.fr",  role:"jury",       active:true,  token:"MLF-7A2K-X9P", assigned:[1,2,3,5],        cls:"ua-1", label:"Présidente · Réalisatrice", avatar:"https://i.pravatar.cc/150?img=47" },
    { id:2,  name:"Pierre Dubois",   email:"p.dubois@marsai.fr",    role:"jury",       active:true,  token:"PDB-3R8M-Q1T", assigned:[1,4,6,7],        cls:"ua-2", label:"Directeur artistique",      avatar:"https://i.pravatar.cc/150?img=12" },
    { id:3,  name:"Kenji Ito",       email:"k.ito@marsai.jp",       role:"jury",       active:true,  token:"KIT-9S4N-W2V", assigned:[2,3,8,9],        cls:"ua-3", label:"Artiste numérique",         avatar:"https://i.pravatar.cc/150?img=68" },
    { id:4,  name:"Sofia Eriksson",  email:"s.eriksson@marsai.se",  role:"jury",       active:true,  token:"SEK-5H1B-R4C", assigned:[5,6,7,10],       cls:"ua-4", label:"Critique de cinéma",        avatar:"https://i.pravatar.cc/150?img=44" },
    { id:5,  name:"Camille Moreau",  email:"c.moreau@marsai.fr",    role:"moderateur", active:true,  token:"CMR-2J6D-L8Z", assigned:[],               cls:"ua-5", label:"Modératrice",               avatar:"https://i.pravatar.cc/150?img=25" },
    { id:6,  name:"Thomas Leroy",    email:"t.leroy@marsai.fr",     role:"moderateur", active:false, token:"TLR-8K3F-P7Y", assigned:[],               cls:"ua-6", label:"Modérateur",                avatar:"https://i.pravatar.cc/150?img=15" },
    { id:7,  name:"Amara Touré",     email:"a.toure@marsai.ml",     role:"jury",       active:true,  token:"ATR-4L9G-H3N", assigned:[1,3,5,7,9,11,13],cls:"ua-1", label:"Productrice",               avatar:"https://i.pravatar.cc/150?img=32" },
    { id:8,  name:"Elena Petrov",    email:"e.petrov@marsai.ru",    role:"jury",       active:true,  token:"EPV-7K2R-J6M", assigned:[2,4],            cls:"ua-2", label:"Compositrice",              avatar:"https://i.pravatar.cc/150?img=29" },
    { id:9,  name:"Yuki Nakamura",   email:"y.nakamura@marsai.jp",  role:"jury",       active:true,  token:"YNK-1P8T-V5B", assigned:[3,6,9],          cls:"ua-3", label:"Réalisatrice",              avatar:"https://i.pravatar.cc/150?img=56" },
    { id:10, name:"Carlos Ruiz",     email:"c.ruiz@marsai.es",      role:"jury",       active:true,  token:"CRZ-9D3C-W7Q", assigned:[],               cls:"ua-4", label:"Chef opérateur",            avatar:"https://i.pravatar.cc/150?img=18" },
    { id:11, name:"Priya Mehta",     email:"p.mehta@marsai.in",     role:"jury",       active:true,  token:"PMT-6A1N-X2V", assigned:[4,8],            cls:"ua-1", label:"Scénariste",                avatar:"https://i.pravatar.cc/150?img=36" },
    { id:12, name:"Omar Diallo",     email:"o.diallo@marsai.sn",    role:"jury",       active:true,  token:"ODL-3S7F-L9Z", assigned:[],               cls:"ua-2", label:"Directeur photo",           avatar:"https://i.pravatar.cc/150?img=11" },
  ];

  let newUserRole = 'jury';
  let currentAssignUserId = null;
  let tempAssigned = [];

  /* ── RENDU TABLE UTILISATEURS ── */
  function renderUsers() {
    const tbody = document.getElementById('user-tbody');
    tbody.innerHTML = users.map(u => {
      const rolePill = u.role === 'jury'
        ? `<span class="role-pill rp-jury">⚖️ Jury</span>`
        : `<span class="role-pill rp-modo">🛡️ Modérateur</span>`;
      const assignTxt = u.role === 'jury'
        ? `<span class="assign-count ${u.assigned.length===0?'none':''}" onclick="openAssign(${u.id})">${u.assigned.length} film${u.assigned.length!==1?'s':''} ✎</span>`
        : `<span style="color:var(--mist);font-size:0.75rem;">—</span>`;
      const tokenDisplay = u.active
        ? `<div class="token-col"><span class="token-val">${u.token}</span><button class="btn-icon" title="Copier le lien" onclick="showToast('Lien copié : https://jury.marsai.fr/access/${u.token}', 'ok')">📋</button><button class="btn-icon" title="Renvoyer par email" onclick="showToast('Email renvoyé à ${u.email}', 'ok')">📧</button></div>`
        : `<span style="color:var(--mist);font-size:0.72rem;opacity:0.5;">—</span>`;
      const statusHtml = `
        <div class="status-toggle" onclick="toggleUser(${u.id})">
          <div class="toggle-track ${u.active?'on':''}">
            <div class="toggle-thumb"></div>
          </div>
          <span class="toggle-label">${u.active?'Actif':'Désactivé'}</span>
        </div>`;
      return `<tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${u.avatar}" alt="${u.name}" style="width:32px;height:32px;border-radius:8px;object-fit:cover;flex-shrink:0;${!u.active?'opacity:0.4;filter:grayscale(1);':''}">
            <div>
              <div class="u-name" style="${!u.active?'opacity:0.45;':''}">${u.name}</div>
              <div class="u-email">${u.email}</div>
            </div>
          </div>
        </td>
        <td>${rolePill}</td>
        <td>${assignTxt}</td>
        <td>${tokenDisplay}</td>
        <td>${statusHtml}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn-icon" title="Modifier" onclick="showToast('Modification de ${u.name}', 'warn')">✎</button>
            <button class="btn-icon danger" title="Supprimer" onclick="deleteUser(${u.id})">✕</button>
          </div>
        </td>
      </tr>`;
    }).join('');
    document.getElementById('count-users').textContent = users.filter(u=>u.active).length;
  }

  function toggleUser(id) {
    const u = users.find(x=>x.id===id);
    if (!u) return;
    u.active = !u.active;
    showToast(u.active ? `✓ ${u.name} réactivé` : `🔒 ${u.name} désactivé`, u.active ? 'ok' : 'warn');
    renderUsers();
  }

  function deleteUser(id) {
    const u = users.find(x=>x.id===id);
    if (!u) return;
    if (!confirm(`Supprimer le compte de ${u.name} ?`)) return;
    users = users.filter(x=>x.id!==id);
    showToast(`Compte de ${u.name} supprimé`, 'err');
    renderUsers();
  }

  /* ── MODAL CRÉER ── */
  function openModal(name) { document.getElementById('modal-'+name).classList.add('open'); }
  function closeModal(name) { document.getElementById('modal-'+name).classList.remove('open'); }

  function selectRole(role) {
    newUserRole = role;
    document.getElementById('opt-jury').classList.toggle('selected', role === 'jury');
    document.getElementById('opt-modo').classList.toggle('selected', role === 'moderateur');
  }

  function createUser() {
    const name  = document.getElementById('new-name').value.trim();
    const email = document.getElementById('new-email').value.trim();
    if (!name || !email) { showToast('Nom et email requis', 'err'); return; }
    const initials = name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    const token = initials + '-' + Math.random().toString(36).slice(2,6).toUpperCase() + '-' + Math.random().toString(36).slice(2,5).toUpperCase();
    const clsList = ['ua-1','ua-2','ua-3','ua-4','ua-5','ua-6'];
    const newUser = {
      id: Date.now(), name, email, role: newUserRole,
      active: true, token, assigned: [],
      cls: clsList[users.length % clsList.length]
    };
    users.push(newUser);
    closeModal('create');
    document.getElementById('new-name').value = '';
    document.getElementById('new-email').value = '';
    showToast(`✓ Compte créé · Lien envoyé à ${email}`, 'ok');
    renderUsers();
  }

  /* ── ASSIGNATION DIRECTE (clic avatar) ── */
  function toggleFilmJury(filmId, userId) {
    const u = users.find(x => x.id === userId);
    const f = films.find(x => x.id === filmId);
    if (!u || !f) return;
    const idx = u.assigned.indexOf(filmId);
    if (idx > -1) {
      u.assigned.splice(idx, 1);
      showToast(`${u.name.split(' ')[0]} retiré de "${f.title}"`, 'warn');
    } else {
      u.assigned.push(filmId);
      showToast(`✓ ${u.name.split(' ')[0]} assigné à "${f.title}"`, 'ok');
    }
    renderAssignView();
    renderUsers();
  }

  /* ── VUE ASSIGNATION (médiathèque) ── */
  const FILMS_PER_PAGE = 6;
  let currentPage = 1;
  let currentFilmTab = 'pending';

  function switchFilmTab(tab) {
    currentFilmTab = tab;
    currentPage = 1;
    filmSearchQuery = '';
    filmCountryFilters = [];
    updateCountryBtn();
    const searchEl = document.getElementById('film-search');
    if (searchEl) searchEl.value = '';
    document.getElementById('tab-pending').classList.toggle('active', tab === 'pending');
    document.getElementById('tab-assigned').classList.toggle('active', tab === 'assigned');
    renderAssignView();
    // Remonter en haut de la grille
    document.getElementById('assign-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderAssignView(page) {
    if (page !== undefined) currentPage = page;
    const grid = document.getElementById('assign-grid');
    const juryUsers = users.filter(u => u.role === 'jury' && u.active);

    // Filtrer par recherche + pays
    const filteredFilms = films.filter(f => {
      const matchSearch = !filmSearchQuery || (f.title + f.author + f.country).toLowerCase().includes(filmSearchQuery);
      const matchCountry = !filmCountryFilters.length || filmCountryFilters.includes(f.country);
      return matchSearch && matchCountry;
    });

    // Rafraîchir les pills pays
    renderCountryFilters();

    // Séparer films selon l'onglet
    const pending  = filteredFilms.filter(f => !juryUsers.some(u => u.assigned.includes(f.id)));
    const assigned = filteredFilms.filter(f =>  juryUsers.some(u => u.assigned.includes(f.id)));

    // Mettre à jour les compteurs des onglets
    document.getElementById('count-pending').textContent  = pending.length;
    document.getElementById('count-assigned').textContent = assigned.length;
    document.getElementById('count-assign').textContent   = pending.length;

    const filmList = currentFilmTab === 'pending' ? pending : assigned;
    const totalPages = Math.ceil(filmList.length / FILMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
    const pageFilms = filmList.slice((currentPage - 1) * FILMS_PER_PAGE, currentPage * FILMS_PER_PAGE);

    // État vide
    const emptyEl = document.getElementById('assign-empty');
    if (filmList.length === 0) {
      grid.innerHTML = '';
      emptyEl.querySelector
        ? null : null;
      emptyEl.innerHTML = filmSearchQuery
        ? `<div style="font-size:2rem;margin-bottom:12px;">🔍</div><div style="font-family:var(--font-display);font-size:1rem;font-weight:800;color:var(--white-soft);margin-bottom:6px;">Aucun résultat pour "${filmSearchQuery}"</div><div style="font-size:0.78rem;color:var(--mist);">Essayez un autre titre, réalisateur ou pays.</div>`
        : `<div style="font-size:3rem;margin-bottom:16px;">🎉</div><div style="font-family:var(--font-display);font-size:1.1rem;font-weight:800;color:var(--white-soft);margin-bottom:8px;">Tous les films sont assignés !</div><div style="font-size:0.8rem;color:var(--mist);">Retrouvez-les dans l'onglet "Assignés".</div>`;
      emptyEl.style.display = 'block';
      document.getElementById('pagination').innerHTML = '';
      return;
    }
    emptyEl.style.display = 'none';

    grid.innerHTML = pageFilms.map(f => {
      const assignedJury = juryUsers.filter(u => u.assigned.includes(f.id));
      const nAssigned = assignedJury.length;
      const isAssigned = nAssigned > 0;
      const nComments = f.comments ? Object.keys(f.comments).length : 0;

      const assignedBadge = isAssigned
        ? `<div class="assigned-badge ab-ok">✓ ${nAssigned} juré${nAssigned > 1 ? 's' : ''}</div>`
        : `<div class="assigned-badge ab-none">Non assigné</div>`;

      const avatars = juryUsers.map(u => {
        const assigned = u.assigned.includes(f.id);
        const total = u.assigned.length;
        const badgeCls = total <= 5 ? 'alb-green' : total <= 10 ? 'alb-orange' : 'alb-red';
        const shadow = assigned
          ? '0 0 0 2.5px var(--aurora),0 0 10px rgba(78,255,206,0.3)'
          : '0 0 0 2px rgba(255,255,255,0.12)';
        const opacity = assigned ? '1' : '0.3';
        return `<div class="av-load-wrap" onclick="toggleFilmJury(${f.id}, ${u.id})" title="${u.name} — ${total} film${total !== 1 ? 's' : ''} assignés">
          <img src="${u.avatar}" alt="${u.name}"
            style="box-shadow:${shadow};opacity:${opacity};"
            onmouseover="this.style.opacity='1'"
            onmouseout="this.style.opacity='${opacity}'">
          <span class="av-load-badge ${badgeCls}">${total}</span>
        </div>`;
      }).join('');
      const juryRow = `<div style="display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap;">${avatars}</div>`;

      return `<div class="film-card">
        <div class="film-thumb" onclick="playFilm(${f.id})">
          <video src="assets/video.mp4" muted preload="none" id="vid-${f.id}"></video>
          <div class="film-thumb-overlay">
            <div class="play-btn">▶</div>
          </div>
          <div class="film-num-badge">#${String(f.id).padStart(2,'0')}</div>
          ${assignedBadge}
        </div>
        <div class="film-body">
          <div class="film-title">${f.title}</div>
          <div class="film-meta">${f.author} · ${flags[f.country] || ''} ${f.country}</div>
          ${juryRow}
          ${nComments > 0
            ? `<button class="film-comments-btn" onclick="openCommentsModal(${f.id})">💬 ${nComments} commentaire${nComments > 1 ? 's' : ''}</button>`
            : `<button class="film-comments-btn no-comments" disabled>💬 Aucun commentaire</button>`}
        </div>
      </div>`;
    }).join('');

    // Pagination
    const pag = document.getElementById('pagination');
    if (!pag) return;
    if (totalPages <= 1) { pag.innerHTML = ''; return; }
    let html = `<button class="page-btn" onclick="renderAssignView(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="renderAssignView(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="renderAssignView(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
    html += `<span style="font-size:0.7rem;color:var(--mist);margin-left:6px;">${(currentPage-1)*FILMS_PER_PAGE+1}–${Math.min(currentPage*FILMS_PER_PAGE, filmList.length)} / ${filmList.length} films</span>`;
    pag.innerHTML = html;
  }

  function playFilm(filmId) {
    const vid = document.getElementById('vid-' + filmId);
    if (!vid) return;
    if (vid.paused) {
      document.querySelectorAll('.film-thumb video').forEach(v => { if (v !== vid) v.pause(); });
      vid.play();
      vid.closest('.film-thumb').querySelector('.film-thumb-overlay').style.opacity = '0';
    } else {
      vid.pause();
      vid.closest('.film-thumb').querySelector('.film-thumb-overlay').style.opacity = '1';
    }
  }

  /* ── VUES ── */
  const views = ['users','assign','phases','site'];
  const titles = {
    users:  ['Gestion des utilisateurs',  'Jurys et modérateurs — accès par token permanent'],
    assign: ['Films soumis',              'Visionnez et assignez chaque film au jury'],
    phases: ['Phases & Dates',            'Définissez les dates des sessions jury'],
    site:   ['Administration du site',    'Vidéo hero, informations et calendrier public'],
  };

  function showView(name, el) {
    views.forEach(v => document.getElementById('view-'+v).style.display = 'none');
    document.getElementById('view-'+name).style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    if (el) el.classList.add('active');
    document.getElementById('topbar-title').textContent = titles[name][0];
    document.getElementById('topbar-info').textContent  = titles[name][1];
    if (name === 'assign') renderAssignView();
    if (name === 'site')   { renderJuryAdmin(); renderSponsorsAdmin(); }
  }

  /* ── DRAPEAUX PAYS ── */
  const flags = {
    'France':'🇫🇷','Tunisie':'🇹🇳','Japon':'🇯🇵','Espagne':'🇪🇸','Inde':'🇮🇳',
    'Sénégal':'🇸🇳','Suède':'🇸🇪','Chine':'🇨🇳','Allemagne':'🇩🇪','Nigeria':'🇳🇬',
    'Corée du Sud':'🇰🇷','Maroc':'🇲🇦','Russie':'🇷🇺','Italie':'🇮🇹','Ghana':'🇬🇭',
    'Norvège':'🇳🇴','Algérie':'🇩🇿','Tchéquie':'🇨🇿','Égypte':'🇪🇬','Mexique':'🇲🇽',
    'Turquie':'🇹🇷','Portugal':'🇵🇹','Kenya':'🇰🇪','Belgique':'🇧🇪','Brésil':'🇧🇷',
    'Mali':'🇲🇱','Iran':'🇮🇷','Ukraine':'🇺🇦','Burkina Faso':'🇧🇫','Croatie':'🇭🇷',
    'Colombie':'🇨🇴','Tonga':'🇹🇴','Liban':'🇱🇧','Canada':'🇨🇦','Pakistan':'🇵🇰','Argentine':'🇦🇷',
  };

  /* ── RECHERCHE & FILTRE FILMS ── */
  let filmSearchQuery = '';
  let filmCountryFilters = []; // multi-sélection

  function filterFilms(query) {
    filmSearchQuery = query.toLowerCase().trim();
    currentPage = 1;
    renderAssignView();
  }

  function toggleCountryDropdown() {
    const dd = document.getElementById('country-dropdown');
    const btn = document.getElementById('country-btn');
    const isOpen = dd.style.display !== 'none';
    if (isOpen) {
      dd.style.display = 'none';
      btn.classList.remove('open');
    } else {
      dd.style.display = 'block';
      btn.classList.add('open');
      renderCountryDropdown('');
      const si = document.getElementById('country-search');
      si.value = '';
      setTimeout(() => si.focus(), 50);
    }
  }

  function renderCountryDropdown(query) {
    const q = (query || '').toLowerCase().trim();
    const countries = [...new Set(films.map(f => f.country))].sort();
    const filtered = q ? countries.filter(c => c.toLowerCase().includes(q)) : countries;
    const list = document.getElementById('country-list');
    if (!filtered.length) {
      list.innerHTML = '<div style="padding:12px;text-align:center;font-size:0.78rem;color:var(--mist);">Aucun pays trouvé</div>';
      return;
    }
    list.innerHTML = filtered.map(c => {
      const checked = filmCountryFilters.includes(c);
      return `<div class="country-check-item ${checked ? 'checked' : ''}" onclick="toggleCountry('${c}')">
        <span class="ccheck ${checked ? 'on' : ''}">✓</span>
        <span>${flags[c] || ''} ${c}</span>
      </div>`;
    }).join('');
  }

  function toggleCountry(country) {
    const idx = filmCountryFilters.indexOf(country);
    if (idx === -1) filmCountryFilters.push(country);
    else filmCountryFilters.splice(idx, 1);
    updateCountryBtn();
    renderCountryDropdown(document.getElementById('country-search').value);
    currentPage = 1;
    renderAssignView();
  }

  function resetCountryFilter() {
    filmCountryFilters = [];
    updateCountryBtn();
    currentPage = 1;
    renderAssignView();
  }

  function updateCountryBtn() {
    const btn = document.getElementById('country-btn');
    const label = document.getElementById('country-btn-label');
    const icon = document.getElementById('country-btn-icon');
    const resetBtn = document.getElementById('country-reset-btn');
    const n = filmCountryFilters.length;
    if (n === 0) {
      label.textContent = 'Tous les pays';
      icon.textContent = '🌍';
      btn.classList.remove('has-filter');
      resetBtn.style.display = 'none';
    } else if (n === 1) {
      label.textContent = filmCountryFilters[0];
      icon.textContent = flags[filmCountryFilters[0]] || '🌍';
      btn.classList.add('has-filter');
      resetBtn.style.display = 'flex';
    } else {
      label.textContent = `${n} pays`;
      icon.textContent = '🌍';
      btn.classList.add('has-filter');
      resetBtn.style.display = 'flex';
    }
  }

  function renderCountryFilters() { /* remplacé par dropdown */ }

  /* ── RECHERCHE UTILISATEURS ── */
  function filterUsers(query) {
    const q = query.toLowerCase().trim();
    const rows = document.querySelectorAll('#user-tbody tr');
    let visible = 0;
    rows.forEach(row => {
      const match = !q || row.textContent.toLowerCase().includes(q);
      row.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    let empty = document.getElementById('user-search-empty');
    if (!empty) {
      empty = document.createElement('div');
      empty.id = 'user-search-empty';
      empty.style.cssText = 'text-align:center;padding:24px;font-size:0.8rem;color:var(--mist);display:none;';
      empty.textContent = 'Aucun utilisateur trouvé.';
      document.querySelector('.user-table-wrap').after(empty);
    }
    empty.style.display = visible === 0 && q ? 'block' : 'none';
  }

  /* ── ADMINISTRATION SITE ── */
  function toggleSiteSection(id, header) {
    const body = document.getElementById(id);
    const chevron = header.querySelector('.site-chevron');
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'block';
    chevron.classList.toggle('open', !isOpen);
  }

  /* ── JURY EDITOR ── */
  const defaultJuryData = [
    { id:1,  name:"Marie Lefebvre", label:"Présidente · Réalisatrice", avatar:"https://i.pravatar.cc/400?img=47", visible:true,  quote:"Figure incontournable du cinéma d'auteur, trois fois primée au Festival de Cannes. Elle préside le jury marsAI 2026 avec l'ambition d'élever la création IA au rang d'art majeur." },
    { id:2,  name:"Pierre Dubois",  label:"Directeur artistique",      avatar:"https://i.pravatar.cc/400?img=12", visible:true  },
    { id:3,  name:"Kenji Ito",      label:"Artiste numérique",         avatar:"https://i.pravatar.cc/400?img=68", visible:true  },
    { id:4,  name:"Sofia Eriksson", label:"Critique de cinéma",        avatar:"https://i.pravatar.cc/400?img=44", visible:true  },
    { id:7,  name:"Amara Touré",    label:"Productrice",               avatar:"https://i.pravatar.cc/400?img=32", visible:true  },
    { id:8,  name:"Elena Petrov",   label:"Compositrice",              avatar:"https://i.pravatar.cc/400?img=29", visible:true  },
    { id:9,  name:"Yuki Nakamura",  label:"Réalisatrice",              avatar:"https://i.pravatar.cc/400?img=56", visible:true  },
    { id:10, name:"Carlos Ruiz",    label:"Chef opérateur",            avatar:"https://i.pravatar.cc/400?img=18", visible:true  },
    { id:11, name:"Priya Mehta",    label:"Scénariste",                avatar:"https://i.pravatar.cc/400?img=36", visible:true  },
    { id:12, name:"Omar Diallo",    label:"Directeur photo",           avatar:"https://i.pravatar.cc/400?img=11", visible:true  },
  ];

  let juryAdminData = [];

  function loadJuryAdminData() {
    const saved = localStorage.getItem('marsai_jury_data');
    juryAdminData = saved ? JSON.parse(saved) : defaultJuryData.map(j => ({ ...j }));
  }

  function renderJuryAdmin() {
    loadJuryAdminData();
    const list = document.getElementById('jury-admin-list');
    if (!list) return;
    list.innerHTML = juryAdminData.map((j, idx) => `
      <div class="jury-admin-row" id="jar-${j.id}">
        <img class="jury-admin-photo" src="${j.avatar}" alt="${j.name}"
          onclick="editJuryPhoto(${j.id})" title="Cliquer pour changer la photo">
        <span class="jury-admin-star">${idx === 0 ? '⭐' : ''}</span>
        <div class="jury-admin-fields">
          <input class="jury-admin-input" id="jname-${j.id}" value="${j.name}" placeholder="Nom complet">
          <input class="jury-admin-input small" id="jlabel-${j.id}" value="${j.label}" placeholder="Rôle · Titre">
        </div>
        <div class="cal-toggle ${j.visible ? 'on' : ''}" id="jvis-${j.id}"
          onclick="this.classList.toggle('on')" title="Visible sur la page d'accueil"></div>
        <button class="jury-admin-del" onclick="deleteJuryMember(${j.id})" title="Supprimer">🗑️</button>
      </div>`).join('');
  }

  // Alias pour la compatibilité avec showView
  function renderJuryVisibility() { renderJuryAdmin(); }

  function addJuryMember() {
    // Sauvegarder les modifications en cours avant d'ajouter
    collectJuryEdits();
    const newId = Date.now();
    const imgs = [3,5,6,7,8,9,10,13,14,15,16,17,19,20,21,22,23,24,26,27,28,30,31,33,34,35,37,38,39,40,41,42,43,45,46,48,49,50,51,52,53,54,55,57,58,59,60,61,62,63,64,65,66,67,69,70];
    const rnd = imgs[Math.floor(Math.random() * imgs.length)];
    juryAdminData.push({ id: newId, name: '', label: '', avatar: `https://i.pravatar.cc/400?img=${rnd}`, visible: true });
    renderJuryAdmin();
    setTimeout(() => document.getElementById('jname-' + newId)?.focus(), 40);
  }

  function deleteJuryMember(id) {
    if (juryAdminData.length <= 1) { showToast('Le jury doit avoir au moins un membre.', 'err'); return; }
    juryAdminData = juryAdminData.filter(j => j.id !== id);
    renderJuryAdmin();
  }

  function editJuryPhoto(id) {
    const member = juryAdminData.find(j => j.id === id);
    if (!member) return;
    const url = window.prompt('URL de la photo (format portrait recommandé) :', member.avatar);
    if (url !== null && url.trim()) {
      member.avatar = url.trim();
      renderJuryAdmin();
    }
  }

  function collectJuryEdits() {
    juryAdminData = juryAdminData.map(j => ({
      ...j,
      name:    document.getElementById('jname-' + j.id)?.value.trim()  || j.name,
      label:   document.getElementById('jlabel-' + j.id)?.value.trim() || j.label,
      visible: document.getElementById('jvis-' + j.id)?.classList.contains('on') ?? j.visible,
    }));
  }

  function saveJuryAdmin() {
    collectJuryEdits();
    localStorage.setItem('marsai_jury_data', JSON.stringify(juryAdminData));
    showToast('✓ Jury mis à jour sur la page d\'accueil', 'ok');
    renderJuryAdmin(); // rafraîchir pour afficher ⭐ correctement
  }

  /* ── SPONSORS EDITOR ── */
  const defaultSponsorsData = [
    { id:1, name:"TechVision AI",           tier:"principal",      logo:"", url:"#", visible:true },
    { id:2, name:"Studio Lumière",           tier:"partenaire",     logo:"", url:"#", visible:true },
    { id:3, name:"CinéLab",                 tier:"partenaire",     logo:"", url:"#", visible:true },
    { id:4, name:"DigitalCreators Hub",     tier:"partenaire",     logo:"", url:"#", visible:true },
    { id:5, name:"Région PACA",             tier:"institutionnel", logo:"", url:"#", visible:true },
    { id:6, name:"Ville de Marseille",      tier:"institutionnel", logo:"", url:"#", visible:true },
    { id:7, name:"Ministère de la Culture", tier:"institutionnel", logo:"", url:"#", visible:true },
  ];

  let sponsorsAdminData = [];

  function loadSponsorsData() {
    const saved = localStorage.getItem('marsai_sponsors_data');
    sponsorsAdminData = saved ? JSON.parse(saved) : defaultSponsorsData.map(s => ({ ...s }));
  }

  function renderSponsorsAdmin() {
    loadSponsorsData();
    const list = document.getElementById('sponsors-admin-list');
    if (!list) return;
    const tierLabels = { principal:'Principal', partenaire:'Partenaire', institutionnel:'Institutionnel' };
    list.innerHTML = sponsorsAdminData.map(s => `
      <div class="sponsor-admin-row" id="sar-${s.id}">
        <div class="sponsor-admin-preview" onclick="editSponsorLogo(${s.id})" title="Cliquer pour changer le logo">
          ${s.logo ? `<img src="${s.logo}" alt="${s.name}">` : '<span>Logo</span>'}
        </div>
        <div class="sponsor-admin-fields">
          <div class="sponsor-admin-top">
            <input class="jury-admin-input" id="sname-${s.id}" value="${s.name}" placeholder="Nom du sponsor" style="flex:1;">
            <select class="sponsor-admin-select" id="stier-${s.id}">
              <option value="principal"      ${s.tier==='principal'      ? 'selected':''}>Principal</option>
              <option value="partenaire"     ${s.tier==='partenaire'     ? 'selected':''}>Partenaire</option>
              <option value="institutionnel" ${s.tier==='institutionnel' ? 'selected':''}>Institutionnel</option>
            </select>
          </div>
          <input class="jury-admin-input small" id="surl-${s.id}" value="${s.url === '#' ? '' : s.url}" placeholder="https://site-du-sponsor.fr">
        </div>
        <div class="cal-toggle ${s.visible ? 'on' : ''}" id="svis-${s.id}"
          onclick="this.classList.toggle('on')" title="Visible sur la page d'accueil"></div>
        <button class="jury-admin-del" onclick="deleteSponsor(${s.id})" title="Supprimer">🗑️</button>
      </div>`).join('');
  }

  function addSponsor() {
    collectSponsorEdits();
    const newId = Date.now();
    sponsorsAdminData.push({ id: newId, name:'', tier:'partenaire', logo:'', url:'', visible:true });
    renderSponsorsAdmin();
    setTimeout(() => document.getElementById('sname-' + newId)?.focus(), 40);
  }

  function deleteSponsor(id) {
    sponsorsAdminData = sponsorsAdminData.filter(s => s.id !== id);
    renderSponsorsAdmin();
  }

  function editSponsorLogo(id) {
    const s = sponsorsAdminData.find(x => x.id === id);
    if (!s) return;
    const url = window.prompt('URL du logo (PNG/SVG transparent recommandé) :', s.logo);
    if (url !== null) {
      s.logo = url.trim();
      renderSponsorsAdmin();
    }
  }

  function collectSponsorEdits() {
    sponsorsAdminData = sponsorsAdminData.map(s => ({
      ...s,
      name:    document.getElementById('sname-'+ s.id)?.value.trim()  || s.name,
      tier:    document.getElementById('stier-'+ s.id)?.value         || s.tier,
      url:     document.getElementById('surl-' + s.id)?.value.trim()  || '#',
      visible: document.getElementById('svis-' + s.id)?.classList.contains('on') ?? s.visible,
    }));
  }

  function saveSponsorsAdmin() {
    collectSponsorEdits();
    localStorage.setItem('marsai_sponsors_data', JSON.stringify(sponsorsAdminData));
    showToast('✓ Sponsors mis à jour sur la page d\'accueil', 'ok');
    renderSponsorsAdmin();
  }

  function handleHeroVideo(input) {
    const file = input.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const preview = document.querySelector('.video-preview video');
    const label   = document.querySelector('.video-preview-label');
    preview.src = url;
    label.textContent = '⏳ Nouvelle vidéo — ' + file.name;
    showToast('Vidéo chargée — cliquez sur Enregistrer', 'warn');
  }

  /* ── TOAST ── */
  function showToast(msg, type='ok') {
    const t = document.getElementById('toast');
    t.textContent = msg; t.className = `toast ${type} show`;
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  /* ── FERMETURE DROPDOWN PAYS AU CLIC EXTÉRIEUR ── */
  document.addEventListener('click', function(e) {
    const wrap = document.getElementById('country-filter-wrap');
    const dd = document.getElementById('country-dropdown');
    if (wrap && dd && !wrap.contains(e.target)) {
      dd.style.display = 'none';
      document.getElementById('country-btn').classList.remove('open');
    }
  });

  /* ── DRAWER ASSIGNATION ── */
  let drawerFilmId = null;
  let drawerSearchQuery = '';

  function openDrawer(filmId) {
    const f = films.find(x => x.id === filmId);
    if (!f) return;
    drawerFilmId = filmId;
    drawerSearchQuery = '';
    document.getElementById('drawer-title').textContent = f.title;
    document.getElementById('drawer-sub').textContent   = `${f.author} · ${flags[f.country] || ''} ${f.country}`;
    document.getElementById('drawer-search').value = '';
    const vid = document.getElementById('drawer-video');
    vid.pause(); vid.currentTime = 0; vid.load();
    renderDrawerJury('');
    document.getElementById('film-drawer').classList.add('open');
    document.getElementById('drawer-overlay').classList.add('open');
  }

  function closeDrawer() {
    document.getElementById('film-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('open');
    document.getElementById('drawer-video').pause();
  }

  function filterDrawerJury(query) {
    drawerSearchQuery = query.toLowerCase().trim();
    renderDrawerJury(drawerSearchQuery);
  }

  function renderDrawerJury(query) {
    const juryUsers = users.filter(u => u.role === 'jury' && u.active);
    const filtered = query
      ? juryUsers.filter(u => (u.name + ' ' + u.label).toLowerCase().includes(query))
      : juryUsers;
    const nAssigned = juryUsers.filter(u => u.assigned.includes(drawerFilmId)).length;
    document.getElementById('drawer-count').textContent = `${nAssigned} / ${juryUsers.length}`;
    const list = document.getElementById('drawer-jury-list');
    if (!filtered.length) {
      list.innerHTML = '<div style="text-align:center;padding:20px;font-size:0.8rem;color:var(--mist);">Aucun résultat</div>';
      return;
    }
    // Trier : assignés en premier
    const sorted = [...filtered].sort((a, b) => {
      const aA = a.assigned.includes(drawerFilmId) ? 0 : 1;
      const bA = b.assigned.includes(drawerFilmId) ? 0 : 1;
      return aA - bA;
    });
    list.innerHTML = sorted.map(u => {
      const assigned = u.assigned.includes(drawerFilmId);
      return `<div class="dj-item ${assigned ? 'assigned' : ''}" onclick="toggleDrawerJury(${u.id})">
        <img class="dj-avatar" src="${u.avatar}" alt="${u.name}">
        <div class="dj-info">
          <div class="dj-name">${u.name}</div>
          <div class="dj-role">${u.label}</div>
        </div>
        <div class="dj-check">${assigned ? '✓' : ''}</div>
      </div>`;
    }).join('');
  }

  function toggleDrawerJury(userId) {
    const u = users.find(x => x.id === userId);
    const f = films.find(x => x.id === drawerFilmId);
    if (!u || !f) return;
    const idx = u.assigned.indexOf(drawerFilmId);
    if (idx > -1) {
      u.assigned.splice(idx, 1);
      showToast(`${u.name.split(' ')[0]} retiré de "${f.title}"`, 'warn');
    } else {
      u.assigned.push(drawerFilmId);
      showToast(`✓ ${u.name.split(' ')[0]} assigné à "${f.title}"`, 'ok');
    }
    renderDrawerJury(drawerSearchQuery);
    renderAssignView();
    renderUsers();
  }

  /* ── MODALE COMMENTAIRES ── */
  const decLabelAdmin  = { valide:'Validé', aRevoir:'À revoir', refuse:'Refusé' };
  const decClsAdmin    = { valide:'mcd-valide', aRevoir:'mcd-aRevoir', refuse:'mcd-refuse' };

  function openCommentsModal(filmId) {
    const f = films.find(x => x.id === filmId);
    if (!f) return;
    const juryUsers = users.filter(u => u.role === 'jury' && u.active);

    document.getElementById('mc-film-title').textContent = f.title;
    document.getElementById('mc-film-sub').textContent   = `${f.author} · ${flags[f.country] || ''} ${f.country}`;

    const comments = f.comments || {};
    const body = document.getElementById('mc-body');
    const entries = juryUsers.filter(u => comments[u.id]);

    if (!entries.length) {
      body.innerHTML = '<div class="mc-empty">Aucun commentaire pour ce film.</div>';
    } else {
      body.innerHTML = entries.map(u => {
        const dec = f.juryDec?.[u.id];
        const decHtml = dec
          ? `<span class="mc-dec ${decClsAdmin[dec]}">${decLabelAdmin[dec]}</span>`
          : '';
        return `<div class="mc-item">
          <img class="mc-avatar" src="${u.avatar}" alt="${u.name}">
          <div class="mc-content">
            <div class="mc-name-row">
              <span class="mc-name">${u.name}</span>
              ${decHtml}
            </div>
            <div class="mc-text">"${comments[u.id]}"</div>
          </div>
        </div>`;
      }).join('');
    }

    document.getElementById('modal-comments').classList.add('open');
  }

  function closeCommentsModal() {
    document.getElementById('modal-comments').classList.remove('open');
  }

  /* ── INIT ── */
  renderUsers();
