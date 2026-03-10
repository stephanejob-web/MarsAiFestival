/* ================================================================
   MANIFESTE CAROUSEL — Vertical YouTube Thumbnails + Scanner horizontal
   Défilement vertical de cartes YouTube à gauche de la grille.
   Clic → ouvre YouTube dans un nouvel onglet.
   Scanner horizontal révèle une couche ASCII au passage.
   Particules violettes émanant du faisceau.
   IIFE autonome, 0 dépendance externe.

   OPTIMISATIONS :
   - 0 vidéo locale, 0 décodage vidéo → GPU quasi nul
   - Thumbnails = images loading="lazy" (~20Ko chacune)
   - 40 particules max, 30fps, canvas demi-résolution
   - ASCII refresh : 1s
   ================================================================ */
;(function () {
  'use strict';

  /* ----------------------------------------------------------------
     Données YouTube — 6 courts-métrages IA
     ---------------------------------------------------------------- */
  var YOUTUBE = [
    { id: 'yplb0yBEiRo', title: 'Air Head — Shy Kids',       tool: 'Sora'   },
    { id: '-Nb-M1GAOX8', title: 'The Hardest Part — Washed Out', tool: 'Sora' },
    { id: 'f75eoFyo9ns', title: 'Worldweight — August Kamp',  tool: 'Sora'   },
    { id: 'zpAeygE4d1A', title: 'Total Pixel Space',          tool: 'Runway' },
    { id: 'o6GlL7Q-nD8', title: 'EDEN — Sci-Fi Short',       tool: 'Sora'   },
    { id: 'UWXbJah6RGs', title: 'Sora Showcase',              tool: 'Sora'   }
  ];

  /* ----------------------------------------------------------------
     Configuration
     ---------------------------------------------------------------- */
  var CARD_COUNT    = YOUTUBE.length;
  var CARD_GAP      = 20;
  var SCROLL_SPEED  = 60;      // px/s vers le bas
  var SCANNER_H     = 8;       // épaisseur du scanner (px)
  var PARTICLE_MAX  = 40;
  var FADE_ZONE     = 50;

  /* Détection mode mobile (horizontal) */
  function isMobile() { return window.innerWidth <= 480; }

  /* ----------------------------------------------------------------
     Générateur de code ASCII (thème IA/vidéo)
     ---------------------------------------------------------------- */
  var _codeSnippets = [
    '// compiled preview • scanner demo',
    '/* generated for visual effect */',
    'const SCAN_WIDTH = 8;',
    'const MAX_PARTICLES = 2500;',
    'const TRANSITION = 0.05;',
    'function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }',
    'function lerp(a, b, t) { return a + (b - a) * t; }',
    'class Particle { constructor(x, y, vx, vy) {',
    '  this.x = x; this.y = y;',
    '  this.vx = vx; this.vy = vy;',
    '} step(dt) { this.x += this.vx * dt; this.y += this.vy * dt; } }',
    'const scanner = { y: Math.floor(window.innerHeight / 2) };',
    'function drawParticle(ctx, p) { ctx.globalAlpha = clamp(p.a, 0, 1);',
    '  ctx.drawImage(gradient, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2); }',
    'ctx.globalCompositeOperation = "lighter";',
    'if (state.intensity > 1) { scanner.glow += 0.01; }',
    'const neer = { y: Math.floor(window.innerHeight / 2) };'
  ];
  var _codeFlow = _codeSnippets.join(' ');
  while (_codeFlow.length < 8000) {
    _codeFlow += ' ' + _codeSnippets[Math.floor(Math.random() * _codeSnippets.length)];
  }

  function generateCode(cols, rows) {
    var out = '';
    var offset = Math.floor(Math.random() * 200);
    for (var r = 0; r < rows; r++) {
      var line = _codeFlow.substr(offset + r * cols, cols);
      if (line.length < cols) line += ' '.repeat(cols - line.length);
      out += line + (r < rows - 1 ? '\n' : '');
    }
    return out;
  }

  function calcCodeDims(w, h) {
    return { cols: Math.floor(w / 6), rows: Math.floor(h / 12) };
  }


  /* ----------------------------------------------------------------
     Création d'une carte YouTube (lien <a> cliquable)
     ---------------------------------------------------------------- */
  function createCard(data) {
    // wrapper = lien cliquable
    var wrapper = document.createElement('a');
    wrapper.className = 'ev-card-wrapper';
    wrapper.href = 'https://www.youtube.com/watch?v=' + data.id;
    wrapper.target = '_blank';
    wrapper.rel = 'noopener noreferrer';

    // couche normale (thumbnail)
    var normal = document.createElement('div');
    normal.className = 'ev-card ev-card-normal';
    var img = document.createElement('img');
    img.src = 'https://img.youtube.com/vi/' + data.id + '/hqdefault.jpg';
    img.alt = data.title;
    img.loading = 'lazy';
    img.draggable = false;
    normal.appendChild(img);

    // overlay titre + badge
    var overlay = document.createElement('div');
    overlay.className = 'ev-card-overlay';
    var title = document.createElement('span');
    title.className = 'ev-card-title';
    title.textContent = data.title;
    var badge = document.createElement('span');
    badge.className = 'ev-card-badge';
    badge.textContent = data.tool;
    overlay.appendChild(title);
    overlay.appendChild(badge);
    normal.appendChild(overlay);

    // icône play
    var play = document.createElement('div');
    play.className = 'ev-card-play';
    normal.appendChild(play);

    // couche ASCII
    var ascii = document.createElement('div');
    ascii.className = 'ev-card ev-card-ascii';
    var content = document.createElement('div');
    content.className = 'ascii-content';
    // dimensions approximatives — sera recalculé si besoin
    var dims = calcCodeDims(380, 200);
    content.textContent = generateCode(dims.cols, dims.rows);
    ascii.appendChild(content);

    wrapper.appendChild(normal);
    wrapper.appendChild(ascii);

    // cache les refs DOM sur le wrapper
    wrapper._normal = normal;
    wrapper._ascii = ascii;

    return wrapper;
  }


  /* ----------------------------------------------------------------
     CardStream — Défilement VERTICAL automatique
     ---------------------------------------------------------------- */
  function CardStream(viewport) {
    this.viewport  = viewport;
    this.cardLine  = viewport.querySelector('.card-line');
    this.position  = 0;
    this.velocity  = SCROLL_SPEED;
    this.running   = false;
    this.dragging  = false;
    this.lastTime  = 0;
    this.lastMouseY = 0;
    this.mouseVel   = 0;
    this.containerH = 0;
    this.lineH      = 0;
    this.wrappers   = [];
    this.cardH      = 0;

    this._populate();
    this._calcDims();
    this._bindDrag();
  }

  /* remplir la ligne de cartes (doublées pour boucle infinie) */
  CardStream.prototype._populate = function () {
    this.cardLine.innerHTML = '';
    // doubler les cartes pour la boucle infinie
    for (var i = 0; i < CARD_COUNT * 2; i++) {
      var card = createCard(YOUTUBE[i % CARD_COUNT]);
      this.cardLine.appendChild(card);
    }
    this.wrappers = Array.from(this.cardLine.querySelectorAll('.ev-card-wrapper'));
  };

  CardStream.prototype._calcDims = function () {
    this.horizontal = isMobile();
    if (this.horizontal) {
      this.containerW = this.viewport.offsetWidth || 360;
      if (this.wrappers.length > 0) {
        this.cardW = this.wrappers[0].offsetWidth || 140;
      } else {
        this.cardW = 140;
      }
      this.lineH = (this.cardW + CARD_GAP) * CARD_COUNT;
    } else {
      this.containerH = this.viewport.offsetHeight || 560;
      if (this.wrappers.length > 0) {
        this.cardH = this.wrappers[0].offsetHeight || 200;
      } else {
        this.cardH = 200;
      }
      this.lineH = (this.cardH + CARD_GAP) * CARD_COUNT;
    }
    this.position = -this.lineH;
  };

  /* démarrer l'animation */
  CardStream.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    // recalculer les dimensions au démarrage (le layout est prêt)
    this._calcDims();
    this.lastTime = performance.now();
    this._loop();
  };

  CardStream.prototype.stop = function () {
    this.running = false;
  };

  CardStream.prototype._loop = function () {
    if (!this.running) return;
    var self = this;
    var now  = performance.now();
    var dt   = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (!this.dragging) {
      // décélération après drag
      if (this.velocity > SCROLL_SPEED) {
        this.velocity *= 0.96;
        if (this.velocity < SCROLL_SPEED) this.velocity = SCROLL_SPEED;
      }
      // défilement vers le bas (les cartes descendent)
      this.position += this.velocity * dt;
      this._wrap();
    }

    if (this.horizontal) {
      this.cardLine.style.transform = 'translateX(' + this.position + 'px)';
    } else {
      this.cardLine.style.transform = 'translateY(' + this.position + 'px)';
    }
    this._updateClipping();

    requestAnimationFrame(function () { self._loop(); });
  };

  /* boucle infinie verticale (défilement vers le bas) */
  CardStream.prototype._wrap = function () {
    if (this.lineH <= 0) return;
    // les cartes descendent : position augmente → quand trop positif, on recule
    if (this.position >= 0) {
      this.position -= this.lineH;
    } else if (this.position < -this.lineH * 2) {
      this.position += this.lineH;
    }
  };

  /* clipping scanner HORIZONTAL — détection croisement sur axe Y */
  CardStream.prototype._updateClipping = function () {
    var scannerY = this.containerH * 0.35;
    var scanTop = scannerY - SCANNER_H / 2;
    var scanBottom = scannerY + SCANNER_H / 2;
    var vpRect = this.viewport.getBoundingClientRect();

    for (var i = 0; i < this.wrappers.length; i++) {
      var wrap = this.wrappers[i];
      var rect = wrap.getBoundingClientRect();
      var cardTop    = rect.top - vpRect.top;
      var cardBottom = rect.bottom - vpRect.top;
      var cardH      = rect.height;

      var normal = wrap._normal;
      var ascii  = wrap._ascii;

      if (cardTop < scanBottom && cardBottom > scanTop) {
        // la carte croise le scanner
        var intersectTop    = Math.max(scanTop - cardTop, 0);
        var intersectBottom = Math.min(scanBottom - cardTop, cardH);
        var pctTop    = (intersectTop / cardH) * 100;
        var pctBottom = (intersectBottom / cardH) * 100;
        // normal : masquer la partie au-dessus du scanner
        normal.style.clipPath = 'inset(' + pctTop + '% 0 0 0)';
        // ascii : révéler la partie au-dessus du scanner
        ascii.style.clipPath = 'inset(0 0 ' + (100 - pctBottom) + '% 0)';
      } else if (cardBottom <= scanTop) {
        // carte entièrement au-dessus du scanner → tout ASCII
        normal.style.clipPath = 'inset(100% 0 0 0)';
        ascii.style.clipPath = 'none';
      } else {
        // carte entièrement en-dessous du scanner → tout normal
        normal.style.clipPath = 'none';
        ascii.style.clipPath = 'inset(0 0 100% 0)';
      }
    }
  };

  /* drag souris + tactile (vertical desktop / horizontal mobile) */
  CardStream.prototype._bindDrag = function () {
    var self = this;
    var line = this.cardLine;

    function getCoord(e) {
      return self.horizontal ? (e.clientX || e.touches[0].clientX) : (e.clientY || e.touches[0].clientY);
    }

    function startDrag(coord) {
      self.dragging = true;
      self.lastMouseY = coord;
      self.mouseVel = 0;
      line.classList.add('dragging');
    }
    function onDrag(coord) {
      if (!self.dragging) return;
      var d = coord - self.lastMouseY;
      self.position += d;
      self.mouseVel = d * 60;
      self.lastMouseY = coord;
      var axis = self.horizontal ? 'translateX' : 'translateY';
      line.style.transform = axis + '(' + self.position + 'px)';
      self._updateClipping();
    }
    function endDrag() {
      if (!self.dragging) return;
      self.dragging = false;
      line.classList.remove('dragging');
      if (Math.abs(self.mouseVel) > 30) {
        self.velocity = Math.abs(self.mouseVel);
      } else {
        self.velocity = SCROLL_SPEED;
      }
    }

    // souris
    line.addEventListener('mousedown', function (e) {
      e.preventDefault();
      startDrag(self.horizontal ? e.clientX : e.clientY);
    });
    document.addEventListener('mousemove', function (e) {
      onDrag(self.horizontal ? e.clientX : e.clientY);
    });
    document.addEventListener('mouseup', endDrag);

    // tactile
    line.addEventListener('touchstart', function (e) {
      startDrag(self.horizontal ? e.touches[0].clientX : e.touches[0].clientY);
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (self.dragging) onDrag(self.horizontal ? e.touches[0].clientX : e.touches[0].clientY);
    }, { passive: true });
    document.addEventListener('touchend', endDrag);

    // molette
    line.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = self.horizontal ? e.deltaX : e.deltaY;
      self.position += (delta > 0 ? -30 : 30);
      self._wrap();
      var axis = self.horizontal ? 'translateX' : 'translateY';
      line.style.transform = axis + '(' + self.position + 'px)';
      self._updateClipping();
    }, { passive: false });

    // resize — recalculer les dimensions et le mode
    window.addEventListener('resize', function () {
      self._calcDims();
    });
  };

  /* rafraîchir le contenu ASCII périodiquement */
  CardStream.prototype.startAsciiRefresh = function () {
    var self = this;
    var contents = this.cardLine.querySelectorAll('.ascii-content');
    this._asciiContents = contents;
    this._asciiTimer = setInterval(function () {
      var idx = Math.floor(Math.random() * self._asciiContents.length);
      var w = self.wrappers[0] ? self.wrappers[0].offsetWidth : 380;
      var h = self.wrappers[0] ? self.wrappers[0].offsetHeight : 200;
      var dims = calcCodeDims(w, h);
      self._asciiContents[idx].textContent = generateCode(dims.cols, dims.rows);
    }, 1000);
  };

  CardStream.prototype.stopAsciiRefresh = function () {
    if (this._asciiTimer) {
      clearInterval(this._asciiTimer);
      this._asciiTimer = null;
    }
  };


  /* ----------------------------------------------------------------
     ScannerParticles — Canvas 2D (optimisé, horizontal)
     40 particules, 30fps, canvas demi-résolution.
     Particules émanent horizontalement depuis le faisceau.
     ---------------------------------------------------------------- */
  function ScannerParticles(canvas, getBeamY) {
    this.canvas   = canvas;
    this.ctx      = canvas.getContext('2d');
    this.getBeamY = getBeamY;
    this.running  = false;
    this.rafId    = null;

    this.w = 0;
    this.h = 0;
    this.particles = [];
    this.beamH     = 3;

    this._createGradient();
  }

  /* gradient radial pré-rendu (cache) */
  ScannerParticles.prototype._createGradient = function () {
    var c = document.createElement('canvas');
    c.width = 16; c.height = 16;
    var ctx = c.getContext('2d');
    var half = 8;
    var g = ctx.createRadialGradient(half, half, 0, half, half, half);
    g.addColorStop(0,   'rgba(255, 255, 255, 1)');
    g.addColorStop(0.3, 'rgba(196, 181, 253, 0.8)');
    g.addColorStop(0.7, 'rgba(139, 92, 246, 0.4)');
    g.addColorStop(1,   'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();
    this._gradCache = c;
  };

  /* particule émanant HORIZONTALEMENT depuis le beam */
  ScannerParticles.prototype._makeParticle = function () {
    var by = this.getBeamY();
    return {
      x: Math.random() * this.w,
      y: by + (Math.random() - 0.5) * this.beamH,
      vx: (Math.random() - 0.5) * 0.3,
      vy: 0.2 + Math.random() * 0.8,
      radius: 0.4 + Math.random() * 0.6,
      alpha: 0.6 + Math.random() * 0.4,
      origAlpha: 0,
      life: 1,
      decay: 0.005 + Math.random() * 0.02,
      twinkleSpd: 0.02 + Math.random() * 0.06,
      twinkleAmt: 0.1 + Math.random() * 0.15,
      time: 0
    };
  };

  ScannerParticles.prototype._resize = function () {
    var rect = this.canvas.parentElement.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width  = Math.round(this.w * 0.5);
    this.canvas.height = Math.round(this.h * 0.5);
  };

  ScannerParticles.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this._resize();
    this.particles = [];
    for (var i = 0; i < PARTICLE_MAX; i++) {
      var p = this._makeParticle();
      p.origAlpha = p.alpha;
      this.particles.push(p);
    }
    this._loop();
  };

  ScannerParticles.prototype.stop = function () {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  };

  ScannerParticles.prototype._loop = function () {
    if (!this.running) return;
    var self = this;
    var now = performance.now();
    // throttle à ~30fps
    if (now - (self._lastFrame || 0) >= 33) {
      self._lastFrame = now;
      this._render();
    }
    this.rafId = requestAnimationFrame(function () { self._loop(); });
  };

  ScannerParticles.prototype._render = function () {
    var ctx = this.ctx;
    var w = this.w, h = this.h;
    var cw = this.canvas.width, ch = this.canvas.height;
    var scale = 0.5;
    var by = this.getBeamY() * scale;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, cw, ch);

    // glow horizontal
    var lh = this.beamH;
    ctx.globalCompositeOperation = 'lighter';
    var g = ctx.createLinearGradient(0, by - lh * 3, 0, by + lh * 3);
    g.addColorStop(0, 'rgba(139, 92, 246, 0)');
    g.addColorStop(0.5, 'rgba(196, 181, 253, 0.5)');
    g.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = g;
    ctx.fillRect(0, by - lh * 3, cw, lh * 6);

    // particules
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.time++;
      p.alpha = p.origAlpha * p.life +
                Math.sin(p.time * p.twinkleSpd) * p.twinkleAmt;
      p.life -= p.decay;

      // respawn si mort ou hors écran
      if (p.y > h + 10 || p.life <= 0) {
        var np = this._makeParticle();
        np.origAlpha = np.alpha;
        this.particles[i] = np;
        continue;
      }

      // fondu horizontal aux bords
      var fadeAlpha = 1;
      if (p.x < FADE_ZONE) fadeAlpha = p.x / FADE_ZONE;
      else if (p.x > w - FADE_ZONE) fadeAlpha = (w - p.x) / FADE_ZONE;
      if (fadeAlpha < 0) fadeAlpha = 0;
      if (fadeAlpha > 1) fadeAlpha = 1;

      var a = p.alpha * fadeAlpha;
      if (a <= 0) continue;
      ctx.globalAlpha = a;
      var px = p.x * scale;
      var py = p.y * scale;
      var pr = p.radius;
      ctx.drawImage(this._gradCache, px - pr, py - pr, pr * 2, pr * 2);
    }
  };


  /* ----------------------------------------------------------------
     INITIALISATION — IntersectionObserver
     ---------------------------------------------------------------- */
  function init() {
    var viewport = document.querySelector('.carousel-viewport');
    if (!viewport) return;

    var stream = new CardStream(viewport);

    var scannerCanvas = viewport.querySelector('.scanner-canvas');
    var fx = new ScannerParticles(scannerCanvas, function () {
      return viewport.offsetHeight * 0.35;
    });

    var section = document.querySelector('.manifeste-section');
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          stream.start();
          stream.startAsciiRefresh();
          fx.start();
        } else {
          stream.stop();
          stream.stopAsciiRefresh();
          fx.stop();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(section);

    window.addEventListener('resize', function () {
      if (fx.running) fx._resize();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
