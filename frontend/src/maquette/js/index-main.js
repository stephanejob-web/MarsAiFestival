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

  document.getElementById('days').textContent = String(d).padStart(2, '0');
  document.getElementById('hours').textContent = String(h).padStart(2, '0');
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

// Vidéo sur chaque vignette film — lazy : uniquement quand visible
const thumbVideoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const thumb = entry.target;
    const mediaHost = thumb.querySelector('.film-thumb-bg') || thumb;
    if (entry.isIntersecting) {
      if (!mediaHost.querySelector('.film-thumb-video')) {
        const video = document.createElement('video');
        video.className = 'film-thumb-video';
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.preload = 'none';
        video.setAttribute('aria-hidden', 'true');
        const source = document.createElement('source');
        source.src = '../assets/video.mp4';
        source.type = 'video/mp4';
        video.appendChild(source);
        mediaHost.prepend(video);
        video.play().catch(() => { });
      } else {
        mediaHost.querySelector('.film-thumb-video').play().catch(() => { });
      }
    } else {
      const v = mediaHost.querySelector('.film-thumb-video');
      if (v) v.pause();
    }
  });
}, { rootMargin: '100px' });

document.querySelectorAll('.film-thumb').forEach(thumb => thumbVideoObserver.observe(thumb));

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
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const dur = 1800; // ms
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / dur, 1);
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const val = Math.round(ease * target);
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
  const panel = document.getElementById('nav-panel');
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
  const panel = document.getElementById('nav-panel');
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
  { id: 'concours', el: null },
  { id: 'programme', el: null },
  { id: 'films', el: null },
  { id: 'jury', el: null },
  { id: 'palmares', el: null },
  { id: 'presse', el: null },
];
navSections.forEach(s => { s.el = document.getElementById(s.id); });

const heroEl = document.querySelector('.hero');
const nav = document.querySelector('nav');
const heroVideo = document.getElementById('hero-video');
let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;

    // fond de nav — classe scrolled pour le glassmorphism
    nav.classList.toggle('nav-scrolled', y > 60);

    // Vidéo hero : opacity 1→0 sur 70% de la hauteur hero
    if (heroVideo) {
      const heroHeight = heroEl.offsetHeight;
      heroVideo.style.opacity = Math.max(0, 1 - (y / (heroHeight * 0.7)));
    }

    // scrollspy — section active = celle dont le top est la plus proche au-dessus du centre écran
    const mid = y + window.innerHeight * 0.35;
    let active = null;
    navSections.forEach(s => {
      if (s.el && s.el.offsetTop <= mid) active = s.id;
    });
    document.querySelectorAll('.nav-item').forEach(a => {
      a.classList.toggle('nav-active', a.dataset.section === active);
    });

    scrollTicking = false;
  });
}, { passive: true });

  // ─── JURY SECTION ──────────────────────────────────────
  const defaultJury = [
    { id:1,  name:"Marie Lefebvre", label:"Présidente · Réalisatrice",  labelEN:"President · Director",      badge:"Présidence du Jury", badgeEN:"Jury President", quote:"Figure incontournable du cinéma d'auteur, trois fois primée au Festival de Cannes. Elle préside le jury marsAI 2026 avec l'ambition d'élever la création IA au rang d'art majeur.", quoteEN:"A towering figure of auteur cinema, three-time award winner at Cannes. She chairs the marsAI 2026 jury with the ambition of elevating AI creation to the rank of major art.", avatar:"https://i.pravatar.cc/400?img=47", featured:true },
    { id:2,  name:"Pierre Dubois",  label:"Directeur artistique",       labelEN:"Art Director",               badge:"Membre du Jury",     badgeEN:"Jury Member",    quote:"Directeur artistique visionnaire, il a collaboré avec les plus grands studios européens. Son regard esthétique unique apporte une dimension singulière aux délibérations.", quoteEN:"A visionary art director who has collaborated with the leading European studios. His unique aesthetic sensibility brings a singular dimension to the jury's deliberations.", avatar:"https://i.pravatar.cc/400?img=12"  },
    { id:3,  name:"Kenji Ito",      label:"Artiste numérique",          labelEN:"Digital Artist",             badge:"Membre du Jury",     badgeEN:"Jury Member",    quote:"Pionnier de l'art génératif au Japon, ses œuvres mêlent tradition et technologie. Il explore les frontières entre créativité humaine et intelligence artificielle.", quoteEN:"A pioneer of generative art in Japan, his work blends tradition and technology. He explores the boundaries between human creativity and artificial intelligence.", avatar:"https://i.pravatar.cc/400?img=68"  },
    { id:4,  name:"Sofia Eriksson", label:"Critique de cinéma",         labelEN:"Film Critic",                badge:"Membre du Jury",     badgeEN:"Jury Member",    quote:"Critique influente basée à Stockholm, elle écrit pour les plus grands magazines cinématographiques. Spécialiste des nouvelles formes narratives numériques.", quoteEN:"An influential critic based in Stockholm, she writes for the world's leading film magazines. A specialist in new forms of digital storytelling.", avatar:"https://i.pravatar.cc/400?img=44"  },
    { id:7,  name:"Amara Touré",    label:"Productrice",                labelEN:"Producer",                   badge:"Membre du Jury",     badgeEN:"Jury Member",    quote:"Productrice primée originaire de Dakar, elle défend un cinéma engagé et innovant. Elle a produit plusieurs courts-métrages sélectionnés dans des festivals internationaux.", quoteEN:"Award-winning producer from Dakar, she champions committed and innovative cinema. She has produced several short films selected at major international festivals.", avatar:"https://i.pravatar.cc/400?img=32"  },
    { id:10, name:"Carlos Ruiz",    label:"Chef opérateur",             labelEN:"Cinematographer",            badge:"Membre du Jury",     badgeEN:"Jury Member",    quote:"Chef opérateur de renom basé à Madrid, il a signé la photographie de nombreux films récompensés. Son expertise technique enrichit l'évaluation des œuvres.", quoteEN:"A renowned cinematographer based in Madrid, he has shot the photography of many award-winning films. His technical expertise enriches the evaluation of entries.", avatar:"https://i.pravatar.cc/400?img=18"  },
  ];

function renderJury() {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const isEN = lang === 'en';

  // Priorité aux données éditées depuis le panneau admin
  const savedData = localStorage.getItem('marsai_jury_data');
  const jurySource = savedData ? JSON.parse(savedData) : defaultJury;
  const visible = jurySource.filter(j => j.visible !== false);

  const featuredWrap = document.getElementById('jury-featured-wrap');
  const grid = document.getElementById('jury-grid');

  if (!visible.length) {
    featuredWrap.innerHTML = '';
    grid.innerHTML = `<p style="color:var(--mist);grid-column:1/-1;text-align:center;font-size:0.9rem;">${isEN ? 'The jury is being formed.' : 'Le jury est en cours de constitution.'}</p>`;
    return;
  }

  // Tous les membres en cards verticales uniformes
  featuredWrap.innerHTML = '';

  grid.innerHTML = visible.map(j => {
    const badge = (isEN ? (j.badgeEN || j.badge) : j.badge) || (isEN ? 'Jury Member' : 'Membre du Jury');
    const label = (isEN ? (j.labelEN || j.label) : j.label) || '';
    const quote = (isEN ? (j.quoteEN || j.quote) : j.quote) || '';
    return `
      <div class="jury-card">
        <div class="jury-card-photo-wrap">
          <img class="jury-card-photo" src="${j.avatar}" alt="${j.name}">
        </div>
        <div class="jury-card-info">
          <div class="jury-card-badge">${badge}</div>
          <div class="jury-card-name">${j.name}</div>
          <div class="jury-card-role">${label}</div>
          ${quote ? `<p class="jury-card-quote">${quote}</p>` : ''}
        </div>
      </div>`;
  }).join('');
}
renderJury();
window.renderJury = renderJury;

// ─── SPONSORS ───────────────────────────────────────────
const defaultSponsors = [
  { id: 1, name: "TechVision AI", tier: "principal", logo: "", url: "#", visible: true },
  { id: 2, name: "Studio Lumière", tier: "partenaire", logo: "", url: "#", visible: true },
  { id: 3, name: "CinéLab", tier: "partenaire", logo: "", url: "#", visible: true },
  { id: 4, name: "DigitalCreators Hub", tier: "partenaire", logo: "", url: "#", visible: true },
  { id: 5, name: "Région PACA", tier: "institutionnel", logo: "", url: "#", visible: true },
  { id: 6, name: "Ville de Marseille", tier: "institutionnel", logo: "", url: "#", visible: true },
  { id: 7, name: "Ministère de la Culture", tier: "institutionnel", logo: "", url: "#", visible: true },
];

function renderSponsors() {
  const saved = localStorage.getItem('marsai_sponsors_data');
  const data = saved ? JSON.parse(saved) : defaultSponsors;
  const visible = data.filter(s => s.visible !== false);

  const section = document.getElementById('sponsors-section');
  if (!visible.length) { section.style.display = 'none'; return; }
  section.style.display = '';

  const byTier = {
    principal: visible.filter(s => s.tier === 'principal'),
    partenaire: visible.filter(s => s.tier === 'partenaire'),
    institutionnel: visible.filter(s => s.tier === 'institutionnel'),
  };
  const isEN = document.documentElement.lang === 'en';
  const tierLabels = {
    principal:     isEN ? 'Main Sponsor'            : 'Sponsor Principal',
    partenaire:    isEN ? 'Partners'                : 'Partenaires',
    institutionnel:isEN ? 'Institutional Supporters': 'Soutiens Institutionnels',
  };

  let html = '';
  ['principal', 'partenaire', 'institutionnel'].forEach(tier => {
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
window.renderSponsors = renderSponsors;

  // Carousel films — boucle infinie fluide + drag
  document.querySelectorAll('.films-carousel').forEach(el => {
    // Retirer fade-in des cartes carousel (elles sont visibles directement)
    el.querySelectorAll('.film-card').forEach(card => {
      card.classList.remove('fade-in');
      card.style.opacity = '1';
      card.style.transform = 'none';
    });

    // Dupliquer les cartes pour boucle infinie sans saut
    const cards = Array.from(el.children);
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.style.opacity = '1';
      clone.style.transform = 'none';
      el.appendChild(clone);
    });

    const speed = el.classList.contains('films-row-1') ? 0.6 : -0.6;
    let paused = false, isDragging = false, startX = 0, scrollStart = 0;
    let halfScroll = 0;

    // Attendre un frame pour que le layout soit calculé après le clonage
    requestAnimationFrame(() => {
      halfScroll = el.scrollWidth / 2;
      // Rangée 2 : démarrer à la fin pour scroll inverse
      if (speed < 0) el.scrollLeft = halfScroll;
      // Lancer l'auto-scroll
      requestAnimationFrame(step);
    });

    // Auto-scroll fluide avec boucle
    function step() {
      if (!paused && !isDragging) {
        el.scrollLeft += speed;
      }
      // Boucle infinie sans saut
      if (halfScroll > 0) {
        if (el.scrollLeft >= halfScroll) {
          el.scrollLeft -= halfScroll;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += halfScroll;
        }
      }
      requestAnimationFrame(step);
    }

    // Pause au survol
    el.addEventListener('mouseenter', () => paused = true);
    el.addEventListener('mouseleave', () => { if (!isDragging) paused = false; });

    // Drag to scroll
    el.addEventListener('mousedown', (e) => {
      isDragging = true;
      paused = true;
      startX = e.pageX;
      scrollStart = el.scrollLeft;
      el.classList.add('is-dragging');
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      el.scrollLeft = scrollStart - (e.pageX - startX);
    });
    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      paused = false;
      el.classList.remove('is-dragging');
    });

    // Touch support
    el.addEventListener('touchstart', (e) => {
      paused = true;
      startX = e.touches[0].pageX;
      scrollStart = el.scrollLeft;
    }, { passive: true });
    el.addEventListener('touchmove', (e) => {
      el.scrollLeft = scrollStart - (e.touches[0].pageX - startX);
    }, { passive: true });
    el.addEventListener('touchend', () => { paused = false; });
  });

/* ================================================================
   Feux d'artifice — canvas animé déclenché au scroll sur la section gala
   ================================================================ */
(function () {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;
  let active = false;

  function resize() {
    const section = canvas.parentElement;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Couleurs feu d'artifice
  const colors = ['#FF6B6B', '#C084FC', '#4EFFCE', '#F5E642', '#FF9F43', '#54A0FF', '#FF6B9D'];

  function randomColor() { return colors[Math.floor(Math.random() * colors.length)]; }

  // Particule
  function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.008;
    this.size = Math.random() * 2.5 + 1;
  }

  // Explosion
  function explode(x, y) {
    const color = randomColor();
    const count = 40 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  // Lancer un feu aléatoire
  function launchRandom() {
    if (!active) return;
    const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
    explode(x, y);
    // Prochain feu entre 300ms et 900ms
    setTimeout(launchRandom, 300 + Math.random() * 600);
  }

  function animate() {
    if (!active && particles.length === 0) { animId = null; return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gravité
      p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(animate);
  }

  // Observer : activer quand la section est visible
  const section = document.querySelector('.gala');
  if (section) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !active) {
          active = true;
          resize();
          launchRandom();
          if (!animId) animate();
        } else if (!e.isIntersecting) {
          active = false;
        }
      });
    }, { threshold: 0.15 });
    obs.observe(section);
  }
})();

// Globe 3D — chargé seulement quand visible (Three.js ~500KB évité au démarrage)
(function () {
  const globeCanvas = document.getElementById('globe-canvas');
  if (!globeCanvas) return;
  let loaded = false;
  const globeObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loaded) {
      loaded = true;
      globeObs.disconnect();
      import('../js/index-globe.js').catch(() => {});
    }
  }, { rootMargin: '300px' });
  globeObs.observe(globeCanvas);
})();

