/* ================================================================
   FICHIER — index-main.js
   Page d'accueil : compte à rebours, révélation au scroll,
   compteurs animés, lecteur cinéma, menu hamburger, scrollspy,
   switch langue FR/EN, rendu jury et sponsors depuis localStorage.
   Dépendances : GSAP (global), DOM chargé.
   ================================================================ */
  // Countdown live — clôture des dépôts : 30 septembre 2026
  const deadline = new Date('2026-09-30T23:59:59');

  function updateCountdown() {
    const now = new Date();
    const diff = deadline - now;
    if (diff <= 0) return;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent    = String(d).padStart(2, '0');
    document.getElementById('hours').textContent   = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Scroll reveal — fade-in isolés + dividers
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-in, .divider').forEach(el => observer.observe(el));

  // Scroll reveal — cascade par section
  // Quand une section entre dans le viewport, tous ses .reveal enfants
  // apparaissent en cascade grâce aux data-delay CSS
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('section, .cta-section').forEach(sec => {
    if (sec.querySelectorAll('.reveal').length > 0) {
      sectionObserver.observe(sec);
    }
  });

  // ── Manifeste scroll reveal ────────────────────────────
  const mObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        mObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.m-fade').forEach((el, i) => {
    const delay = el.style.transitionDelay || '0s';
    el.style.transitionDelay = delay;
    mObserver.observe(el);
  });

  // ── Compteurs animés ───────────────────────────────────
  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const dur     = 1800; // ms
    const start   = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val  = Math.round(ease * target);
      el.textContent = target >= 1000
        ? val.toLocaleString('fr-FR') + suffix
        : val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const cObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        cObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter-num[data-target]').forEach(el => cObserver.observe(el));

  // Filter chips interactivity
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // ── Hamburger menu ─────────────────────────────────────
  function toggleMenu() {
    const burger = document.getElementById('nav-burger');
    const panel  = document.getElementById('nav-panel');
    burger.classList.toggle('open');
    panel.classList.toggle('open');
    document.body.style.overflow = panel.classList.contains('open') ? 'hidden' : '';
  }
  function closeMenu() {
    document.getElementById('nav-burger').classList.remove('open');
    document.getElementById('nav-panel').classList.remove('open');
    document.body.style.overflow = '';
  }
  // Fermer au clic en dehors
  document.addEventListener('click', (e) => {
    const panel  = document.getElementById('nav-panel');
    const burger = document.getElementById('nav-burger');
    if (panel.classList.contains('open') && !panel.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });

  // Toggle FR / EN
  let lang = 'fr';
  function setLang(newLang) {
    lang = newLang;
    document.getElementById('btn-fr').classList.toggle('active', lang === 'fr');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.querySelectorAll('[data-fr]').forEach(el => {
      el.textContent = lang === 'en' ? el.dataset.en : el.dataset.fr;
    });
  }

  // Nav scroll effect + scrollspy
  const navSections = [
    { id: 'concours',  el: null },
    { id: 'programme', el: null },
    { id: 'films',     el: null },
    { id: 'jury',      el: null },
    { id: 'palmares',  el: null },
    { id: 'presse',    el: null },
  ];
  navSections.forEach(s => { s.el = document.getElementById(s.id); });

  const heroEl = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const y   = window.scrollY;

    // fond de nav — classe scrolled pour le glassmorphism
    nav.classList.toggle('nav-scrolled', y > 60);

    // Sphere fade: opacity 1→0 over 70% of hero height
    const heroHeight = heroEl.offsetHeight;
    const sphereOpacity = Math.max(0, 1 - (y / (heroHeight * 0.7)));
    document.getElementById('webgl-canvas').style.opacity = sphereOpacity;
    // Restart Three.js loop when sphere becomes visible again
    if (sphereOpacity > 0 && window._restartSphereAnim) window._restartSphereAnim();

    // scrollspy — section active = celle dont le top est la plus proche au-dessus du centre écran
    const mid = y + window.innerHeight * 0.35;
    let active = null;
    navSections.forEach(s => {
      if (s.el && s.el.offsetTop <= mid) active = s.id;
    });
    document.querySelectorAll('.nav-item').forEach(a => {
      a.classList.toggle('nav-active', a.dataset.section === active);
    });
  });

  // ─── JURY SECTION ──────────────────────────────────────
  const defaultJury = [
    { id:1,  name:"Marie Lefebvre", label:"Présidente · Réalisatrice",  quote:"Figure incontournable du cinéma d'auteur, trois fois primée au Festival de Cannes. Elle préside le jury marsAI 2026 avec l'ambition d'élever la création IA au rang d'art majeur.", avatar:"https://i.pravatar.cc/400?img=47", featured:true },
    { id:2,  name:"Pierre Dubois",  label:"Directeur artistique",       avatar:"https://i.pravatar.cc/400?img=12"  },
    { id:3,  name:"Kenji Ito",      label:"Artiste numérique",          avatar:"https://i.pravatar.cc/400?img=68"  },
    { id:4,  name:"Sofia Eriksson", label:"Critique de cinéma",         avatar:"https://i.pravatar.cc/400?img=44"  },
    { id:7,  name:"Amara Touré",    label:"Productrice",                avatar:"https://i.pravatar.cc/400?img=32"  },
    { id:8,  name:"Elena Petrov",   label:"Compositrice",               avatar:"https://i.pravatar.cc/400?img=29"  },
    { id:9,  name:"Yuki Nakamura",  label:"Réalisatrice",               avatar:"https://i.pravatar.cc/400?img=56"  },
    { id:10, name:"Carlos Ruiz",    label:"Chef opérateur",             avatar:"https://i.pravatar.cc/400?img=18"  },
    { id:11, name:"Priya Mehta",    label:"Scénariste",                 avatar:"https://i.pravatar.cc/400?img=36"  },
    { id:12, name:"Omar Diallo",    label:"Directeur photo",            avatar:"https://i.pravatar.cc/400?img=11"  },
  ];

  function renderJury() {
    // Priorité aux données éditées depuis le panneau admin
    const savedData = localStorage.getItem('marsai_jury_data');
    const jurySource = savedData ? JSON.parse(savedData) : defaultJury;
    const visible = jurySource.filter(j => j.visible !== false);

    const featuredWrap = document.getElementById('jury-featured-wrap');
    const grid         = document.getElementById('jury-grid');

    if (!visible.length) {
      featuredWrap.innerHTML = '';
      grid.innerHTML = '<p style="color:var(--mist);grid-column:1/-1;text-align:center;font-size:0.9rem;">Le jury est en cours de constitution.</p>';
      return;
    }

    // Premier membre visible = vedette
    const president = visible[0];
    const members   = visible.slice(1);

    featuredWrap.innerHTML = `
      <div class="jury-featured">
        <img class="jury-featured-photo" src="${president.avatar}" alt="${president.name}">
        <div class="jury-featured-body">
          <div class="jury-featured-badge">✦ Présidence du jury</div>
          <div class="jury-featured-name">${president.name}</div>
          <div class="jury-featured-role">${president.label}</div>
          ${president.quote ? `<p class="jury-featured-quote">${president.quote}</p>` : ''}
        </div>
      </div>`;

    grid.innerHTML = members.map(j => `
      <div class="jury-card">
        <div class="jury-card-photo-wrap">
          <img class="jury-card-photo" src="${j.avatar}" alt="${j.name}">
        </div>
        <div class="jury-card-info">
          <div class="jury-card-name">${j.name}</div>
          <div class="jury-card-role">${j.label}</div>
        </div>
      </div>`).join('');
  }
  renderJury();

  // ─── SPONSORS ───────────────────────────────────────────
  const defaultSponsors = [
    { id:1, name:"TechVision AI",           tier:"principal",      logo:"", url:"#", visible:true },
    { id:2, name:"Studio Lumière",           tier:"partenaire",     logo:"", url:"#", visible:true },
    { id:3, name:"CinéLab",                 tier:"partenaire",     logo:"", url:"#", visible:true },
    { id:4, name:"DigitalCreators Hub",     tier:"partenaire",     logo:"", url:"#", visible:true },
    { id:5, name:"Région PACA",             tier:"institutionnel", logo:"", url:"#", visible:true },
    { id:6, name:"Ville de Marseille",      tier:"institutionnel", logo:"", url:"#", visible:true },
    { id:7, name:"Ministère de la Culture", tier:"institutionnel", logo:"", url:"#", visible:true },
  ];

  function renderSponsors() {
    const saved = localStorage.getItem('marsai_sponsors_data');
    const data  = saved ? JSON.parse(saved) : defaultSponsors;
    const visible = data.filter(s => s.visible !== false);

    const section = document.getElementById('sponsors-section');
    if (!visible.length) { section.style.display = 'none'; return; }
    section.style.display = '';

    const byTier = {
      principal:      visible.filter(s => s.tier === 'principal'),
      partenaire:     visible.filter(s => s.tier === 'partenaire'),
      institutionnel: visible.filter(s => s.tier === 'institutionnel'),
    };
    const tierLabels = {
      principal:      'Sponsor Principal',
      partenaire:     'Partenaires',
      institutionnel: 'Soutiens Institutionnels',
    };

    let html = '';
    ['principal','partenaire','institutionnel'].forEach(tier => {
      const items = byTier[tier];
      if (!items.length) return;
      html += `<div class="sponsors-tier-block">
        <div class="sponsors-tier-label">${tierLabels[tier]}</div>
        <div class="sponsors-row">
          ${items.map(s => `
            <a class="sponsor-card tier-${s.tier}"
              href="${s.url || '#'}"
              ${s.url && s.url !== '#' ? 'target="_blank" rel="noopener"' : ''}>
              ${s.logo
                ? `<img class="sponsor-logo-img" src="${s.logo}" alt="${s.name}">`
                : `<div class="sponsor-name-text">${s.name}</div>`}
            </a>`).join('')}
        </div>
      </div>`;
    });
    document.getElementById('sponsors-display').innerHTML = html;
  }
  renderSponsors();
