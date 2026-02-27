/* ================================================================
   FICHIER — formulaire-depot.js
   Formulaire de depot : navigation multi-etapes, upload video,
   validation des champs, soumission et redirection.
   Dependances : DOM charge.
   ================================================================ */

    /* ── ETAT GLOBAL ── */
    let currentStep = 1;
    let maxUnlocked = 1;
    let videoValid = false;
    let uploadPct = 0;
    let uploadInterval = null;

    /* Initialisation — limiter la date de naissance a 18 ans avant aujourd'hui */
    (function initDobMax() {
      const dob = document.getElementById('f-dob');
      if (!dob) return;
      const d = new Date();
      d.setFullYear(d.getFullYear() - 18);
      dob.max = d.toISOString().split('T')[0];
    })();
    /* ── COMPTEUR DE CARACTERES ── */
    function countChars(el, counterId, max) {
      const n = el.value.length;
      const cc = document.getElementById(counterId);
      cc.textContent = n + ' / ' + max;
      cc.className = 'char-counter' + (n > max * 0.9 ? (n >= max ? ' over' : ' warn') : '');
    }

    /* ── NAVIGATION ENTRE LES ETAPES ── */
    function goStep(n) {
      maxUnlocked = Math.max(maxUnlocked, n);
      showStep(n);
    }

    function nextStep(from) {
      if (from < 4) {
        maxUnlocked = Math.max(maxUnlocked, from + 1);
        showStep(from + 1);
        if (from + 1 === 4) fillRecap();
      }
    }

    function prevStep(from) {
      if (from > 1) showStep(from - 1);
    }

    function showStep(n) {
      document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('step-' + n).classList.add('active');
      currentStep = n;
      updateStepsNav();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateStepsNav() {
      for (let i = 1; i <= 4; i++) {
        const item = document.querySelector('[data-step="' + i + '"]');
        const circle = document.getElementById('snc-' + i);
        item.className = 'step-nav-item';
        circle.className = 'sni-circle';
        if (i < currentStep) {
          item.classList.add('done');
          circle.classList.add('done');
          circle.textContent = '✓';
        } else if (i === currentStep) {
          item.classList.add('active');
          circle.classList.add('active');
          circle.textContent = i;
        } else if (i <= maxUnlocked) {
          circle.classList.add('pending');
          circle.textContent = i;
        } else {
          item.classList.add('locked');
          circle.classList.add('pending');
          circle.textContent = i;
        }
      }
    }

    /* ── AUTO-SIMULATION VIDEO (maquette) ── */
    function autoSimulateVideo() {
      const fakeFile = { name: 'mon-film-marsai-2026.mp4', size: 187 * 1024 * 1024 };
      document.getElementById('upload-zone').style.display = 'none';
      document.getElementById('preview-name').textContent = fakeFile.name;
      document.getElementById('preview-size').textContent = (fakeFile.size / 1024 / 1024).toFixed(1) + ' Mo';
      document.getElementById('preview-ext').textContent = 'MP4';
      document.getElementById('file-card').style.display = 'block';
      document.getElementById('up-bar').style.width = '0%';
      document.getElementById('up-pct').textContent = '0%';
      document.getElementById('up-msg').textContent = 'Upload en cours…';

      let pct = 0;
      const iv = setInterval(() => {
        pct += Math.random() * 10 + 4;
        if (pct >= 100) {
          pct = 100;
          clearInterval(iv);
          document.getElementById('up-bar').style.width = '100%';
          document.getElementById('up-pct').textContent = '100%';
          document.getElementById('up-msg').textContent = 'Analyse de la durée…';
          setTimeout(() => {
            showDurationResult(59.8);
            videoValid = true;
            document.getElementById('err-video').classList.remove('show');
          }, 700);
          return;
        }
        document.getElementById('up-bar').style.width = pct + '%';
        document.getElementById('up-pct').textContent = Math.round(pct) + '%';
        document.getElementById('up-msg').textContent = 'Upload en cours…';
      }, 100);
    }

    /* ── UPLOAD — entree clavier/clic ── */
    function handleVideo(input) {
      const file = input.files[0];
      if (!file) return;
      processVideoFile(file);
    }

    /* ── TRAITEMENT DU FICHIER VIDEO (drag ou clic) ── */
    function processVideoFile(file) {
      // Masquer la zone de depot
      document.getElementById('upload-zone').style.display = 'none';

      // Remplir la file card
      const sizeMo = file.size / 1024 / 1024;
      document.getElementById('preview-name').textContent = file.name;
      document.getElementById('preview-size').textContent = sizeMo.toFixed(1) + ' Mo';
      document.getElementById('preview-ext').textContent = file.name.split('.').pop().toUpperCase();
      document.getElementById('preview-size-warn').style.display = sizeMo > 300 ? 'inline' : 'none';
      document.getElementById('up-bar').style.width = '0%';
      document.getElementById('up-pct').textContent = '0%';
      document.getElementById('up-msg').textContent = 'Upload en cours…';
      document.getElementById('file-card').style.display = 'block';

      // Generer une vignette depuis le flux video
      generateThumbnail(file);

      // Simulation de la progression
      let pct = 0;
      uploadInterval = setInterval(() => {
        pct += Math.random() * 8 + 2;
        if (pct >= 100) {
          pct = 100;
          clearInterval(uploadInterval);
          document.getElementById('up-bar').style.width = '100%';
          document.getElementById('up-pct').textContent = '100%';
          document.getElementById('up-msg').textContent = 'Analyse de la durée…';
          setTimeout(() => {
            showDurationResult(59.8);
            videoValid = true;
            document.getElementById('err-video').classList.remove('show');
          }, 700);
          return;
        }
        document.getElementById('up-bar').style.width = pct + '%';
        document.getElementById('up-pct').textContent = Math.round(pct) + '%';
        document.getElementById('up-msg').textContent = 'Upload en cours…';
      }, 120);
    }

    /* ── VIGNETTE CANVAS DEPUIS LA VIDEO ── */
    function generateThumbnail(file) {
      const url = URL.createObjectURL(file);
      const vid  = document.createElement('video');
      vid.src     = url;
      vid.muted   = true;
      vid.preload = 'metadata';
      vid.addEventListener('loadedmetadata', () => { vid.currentTime = Math.min(1, vid.duration * 0.1); });
      vid.addEventListener('seeked', () => {
        const canvas = document.getElementById('video-thumb');
        canvas.width  = 256;
        canvas.height = 144;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(vid, 0, 0, 256, 144);
        document.getElementById('thumb-placeholder').style.display = 'none';
        URL.revokeObjectURL(url);
      });
      vid.load();
    }

    /* ── REINITIALISATION DE L'UPLOAD ── */
    function resetVideoUpload(e) {
      e.stopPropagation();
      document.getElementById('video-input').value = '';
      document.getElementById('upload-zone').style.display = 'flex';
      document.getElementById('file-card').style.display = 'none';
      _uzState('uz-state-default');
      document.getElementById('dur-result').classList.remove('show');
      document.getElementById('up-bar').style.width = '0%';
      document.getElementById('up-pct').textContent = '0%';
      document.getElementById('up-msg').textContent = 'Upload en cours…';
      const canvas = document.getElementById('video-thumb');
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      document.getElementById('thumb-placeholder').style.display = 'flex';
      if (uploadInterval) clearInterval(uploadInterval);
      videoValid = false;
    }

    function showDurationResult(sec) {
      const el = document.getElementById('dur-result');
      const val = document.getElementById('dur-value');
      const lbl = document.getElementById('dur-label');
      const ico = document.getElementById('dur-icon');
      const m = Math.floor(sec / 60);
      const s = (sec % 60).toFixed(1);
      const display = `${m}:${String(Math.floor(sec % 60)).padStart(2,'0')}.${(sec % 1).toFixed(1).slice(2)}`;

      el.classList.add('show');
      if (sec >= 58 && sec <= 62) {
        el.className = 'duration-result show ok';
        val.className = 'dur-value ok';
        ico.textContent = '✓';
        val.textContent = display;
        lbl.textContent = 'Durée valide — 60 secondes pile ✓';
      } else if (sec < 58) {
        el.className = 'duration-result show warn';
        val.className = 'dur-value warn';
        ico.textContent = '⚠';
        val.textContent = display;
        lbl.textContent = 'Film trop court — durée exacte requise : 60 secondes';
        videoValid = false;
      } else {
        el.className = 'duration-result show err';
        val.className = 'dur-value err';
        ico.textContent = '✗';
        val.textContent = display;
        lbl.textContent = 'Film trop long — durée exacte requise : 60 secondes';
        videoValid = false;
      }
    }

    /* ── DRAG & DROP — gestion des etats visuels ── */
    let _dragDepth = 0; // compteur pour ignorer les dragLeave sur enfants

    function _uzState(id) {
      ['uz-state-default','uz-state-drag','uz-state-error'].forEach(s => {
        document.getElementById(s).style.display = s === id ? 'block' : 'none';
      });
    }

    function onDragEnter(e) {
      e.preventDefault();
      _dragDepth++;
      if (_dragDepth === 1) {
        document.getElementById('upload-zone').classList.add('dragover');
        _uzState('uz-state-drag');
      }
    }

    function onDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }

    function onDragLeave(e) {
      _dragDepth--;
      if (_dragDepth <= 0) {
        _dragDepth = 0;
        document.getElementById('upload-zone').classList.remove('dragover');
        _uzState('uz-state-default');
      }
    }

    function onDrop(e) {
      e.preventDefault();
      _dragDepth = 0;
      const zone = document.getElementById('upload-zone');
      zone.classList.remove('dragover');

      const file = e.dataTransfer.files[0];
      if (!file) return;

      // Validation du format
      const ext = file.name.split('.').pop().toLowerCase();
      const okTypes = ['video/mp4','video/quicktime'];
      const okExts  = ['mp4','mov'];
      if (!okTypes.includes(file.type) && !okExts.includes(ext)) {
        // Format refuse — feedback visuel 2s
        zone.classList.add('format-err');
        _uzState('uz-state-error');
        setTimeout(() => {
          zone.classList.remove('format-err');
          _uzState('uz-state-default');
        }, 2200);
        return;
      }

      processVideoFile(file);
    }

    /* ── SOUS-TITRES ── */
    function handleSubtitle(input, statusId) {
      const file = input.files[0];
      if (!file) return;
      const el = document.getElementById(statusId);
      el.textContent = '✓ ' + file.name;
      el.className = 'sub-status added';
    }

    /* ── RGPD — basculement des cases a cocher ── */
    function toggleRgpd(id) {
      const item = document.getElementById(id);
      item.classList.toggle('checked');
      document.getElementById('rgpd-warn').classList.remove('show');
    }

    /* ── VALIDATION DE L'AGE (>= 18 ans) ── */
    function validateAge(input) {
      const dob = new Date(input.value);
      if (!input.value) return;
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      const errEl = document.getElementById('err-dob');
      if (age < 18) {
        input.classList.add('err');
        errEl.classList.add('show');
      } else {
        input.classList.remove('err');
        input.classList.add('valid');
        errEl.classList.remove('show');
      }
    }

    /* ── RECAPITULATIF — remplissage automatique ── */
    function fillRecap() {
      const prenom  = document.getElementById('f-prenom').value.trim()  || 'Marie';
      const nom     = document.getElementById('f-nom').value.trim()      || 'Dupont';
      const dob     = document.getElementById('f-dob').value;
      const email   = document.getElementById('f-email').value.trim()    || 'marie.dupont@example.com';
      const mobile  = document.getElementById('f-mobile').value.trim()   || '—';
      const pays    = document.getElementById('f-pays');
      const ville   = document.getElementById('f-ville').value.trim()    || '';
      const titre   = document.getElementById('f-titre').value.trim()    || 'Mon film marsAI';
      const titreEn = document.getElementById('f-titre-en').value.trim() || '—';
      const civEl   = document.querySelector('input[name="civilite"]:checked');
      const civ     = civEl ? civEl.value + ' ' : '';
      const iaEl    = document.querySelector('input[name="ia-class"]:checked');
      const iaClass = iaEl ? (iaEl.value === 'full' ? '🤖 100% IA — Génération intégrale' : '🎬 Production hybride (IA + Humain)') : '—';

      document.getElementById('rc-nom').textContent    = civ + prenom + ' ' + nom;
      document.getElementById('rc-dob').textContent    = dob ? new Date(dob).toLocaleDateString('fr-FR') : '—';
      document.getElementById('rc-email').textContent  = email;
      document.getElementById('rc-mobile').textContent = mobile;
      const paysText = pays.options[pays.selectedIndex]?.text;
      const paysVal  = (paysText && pays.value) ? paysText.replace(/^.{1,2}\s/, '') : 'France';
      document.getElementById('rc-pays').textContent   = (ville ? ville + ', ' : '') + paysVal;
      document.getElementById('rc-titre').textContent  = titre;
      document.getElementById('rc-titre-en').textContent = titreEn;
      document.getElementById('rc-dur').textContent    = videoValid ? '✓ 0:59.8 — Durée valide' : '⚠ Non vérifié';
      document.getElementById('rc-ia-class').textContent = iaClass;

      const otherTool = document.getElementById('img-other').value.trim();
      document.getElementById('rc-tools').textContent = otherTool || 'Non renseigné';

      const subFr = document.getElementById('sub-fr').files[0];
      const subEn = document.getElementById('sub-en').files[0];
      const subs = [];
      if (subFr) subs.push('FR');
      if (subEn) subs.push('EN');
      document.getElementById('rc-subs').textContent = subs.length ? subs.join(', ') : 'Aucun';
    }

    /* ── SOUMISSION DU FORMULAIRE ── */
    function submitForm() {
      ['rgpd-1','rgpd-2','rgpd-3'].forEach(id => document.getElementById(id).classList.add('checked'));

      const btn = document.getElementById('btn-submit');
      btn.disabled = true;
      btn.innerHTML = '⏳ Vérification de votre email…';

      const num    = 'MAI-2026-' + String(Math.floor(Math.random() * 90000) + 10000);
      const email  = document.getElementById('f-email').value.trim()   || 'marie.dupont@example.com';
      const prenom = document.getElementById('f-prenom').value.trim()  || 'Marie';
      const titre  = document.getElementById('f-titre').value.trim()   || 'Mon film marsAI';

      // Sauvegarder pour recuperation apres verification OTP
      sessionStorage.setItem('depot_data', JSON.stringify({ num, email, prenom, titre }));

      setTimeout(() => {
        window.location.href = 'verification-email.html?from=depot&email=' + encodeURIComponent(email);
      }, 1200);
    }

    /* ── RETOUR APRES VERIFICATION OTP ── */
    function showSuccessAfterVerif() {
      const saved = JSON.parse(sessionStorage.getItem('depot_data') || '{}');
      const num    = saved.num    || 'MAI-2026-12345';
      const email  = saved.email  || 'marie.dupont@example.com';
      const prenom = saved.prenom || 'Marie';
      const titre  = saved.titre  || 'Mon film marsAI';
      window._formData = { num, email, prenom, titre };
      document.getElementById('dossier-num').textContent   = num;
      document.getElementById('confirm-email').textContent = email;
      document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('success-screen').classList.add('show');
      document.querySelector('.form-sidebar').style.display = 'none';
      runYouTubeValidation();
    }

    /* ── SIMULATION DE LA VALIDATION YOUTUBE ── */
    function runYouTubeValidation() {
      const steps = [
        { id: 'ytc-upload',    label: 'Upload vidéo',                     icon: '✓', delay: 1200 },
        { id: 'ytc-copyright', label: 'Vérification copyright Content ID', icon: '✓', delay: 2400 },
        { id: 'ytc-policy',    label: 'Analyse contenu (politique YouTube)', icon: '✓', delay: 3600 },
        { id: 'ytc-confirm',   label: 'Confirmation et indexation',        icon: '✓', delay: 4800 },
      ];

      // Animation de la barre de progression
      let pct = 0;
      const iv = setInterval(() => {
        pct = Math.min(pct + 1.8, 95);
        document.getElementById('yt-bar').style.width = pct + '%';
        document.getElementById('yt-pct').textContent = Math.round(pct) + '%';
      }, 80);

      // Activation des etapes une par une
      steps.forEach((step, i) => {
        // Passer l'etape en "running"
        setTimeout(() => {
          const el = document.getElementById(step.id);
          el.querySelector('.yt-check-icon').textContent = '⏳';
          el.querySelector('.yt-check-icon').style.opacity = '1';
          el.querySelector('.yt-check-label').style.opacity = '1';
          el.classList.add('running');
          document.getElementById('yt-step-label').textContent = step.label + '…';
        }, step.delay - 600);

        // Valider l'etape
        setTimeout(() => {
          const el = document.getElementById(step.id);
          el.classList.remove('running');
          el.classList.add('done');
          el.querySelector('.yt-check-icon').textContent = '✓';
        }, step.delay);
      });

      // Fin — en attente du clic maquette (pas de resultat automatique)
      setTimeout(() => {
        clearInterval(iv);
        document.getElementById('yt-bar').style.width = '100%';
        document.getElementById('yt-pct').textContent = '100%';
        document.getElementById('yt-step-label').textContent = 'Analyse terminée — en attente de confirmation YouTube';
        document.getElementById('yt-status-badge').textContent = '⏳ Résultat…';
      }, 5200);
    }

    /* ── SIMULATION DU RESULTAT YOUTUBE (boutons maquette) ── */
    const ytRejectReasons = {
      copyright: {
        badge: '⚠ Violation copyright',
        reason: 'Violation de droits d\'auteur détectée par Content ID',
        detail: 'Violation détectée : Droits d\'auteur — musique ou image protégée identifiée par Content ID YouTube',
      },
      content: {
        badge: '✗ Contenu interdit',
        reason: 'Contenu non conforme à la politique YouTube',
        detail: 'Violation détectée : Contenu inapproprié — nudité, discours haineux ou violence excessive',
      },
    };

    function simulateYouTube(result) {
      const d = window._formData || { num: 'MAI-2026-12345', email: 'marie@exemple.com', prenom: 'Marie', titre: 'Mon film' };
      document.getElementById('yt-pending').style.display = 'none';

      if (result === 'approved') {
        document.getElementById('yt-status-badge').textContent = '✓ Approuvé';
        document.getElementById('yt-approved').style.display = 'block';
        document.getElementById('yt-rejected').style.display = 'none';
      } else {
        const r = ytRejectReasons[result];
        document.getElementById('yt-status-badge').style.background = 'rgba(255,107,107,0.1)';
        document.getElementById('yt-status-badge').style.borderColor = 'rgba(255,107,107,0.25)';
        document.getElementById('yt-status-badge').style.color = 'var(--coral)';
        document.getElementById('yt-status-badge').textContent = r.badge;
        document.getElementById('yt-reject-reason').textContent  = r.reason;
        document.getElementById('yt-reject-detail').textContent  = r.detail;
        document.getElementById('yt-reject-email').textContent   = d.email;
        document.getElementById('yt-reject-prenom').textContent  = d.prenom;
        document.getElementById('yt-reject-titre').textContent   = d.titre;
        document.getElementById('yt-reject-dossier').textContent  = d.num;
        document.getElementById('yt-reject-dossier2').textContent = d.num;
        document.getElementById('yt-approved').style.display = 'none';
        document.getElementById('yt-rejected').style.display = 'block';
        // Re-afficher le bloc pending (juste le badge a change)
        document.getElementById('yt-pending').style.display = 'block';
      }
    }

    /* ── INITIALISATION ── */
    updateStepsNav();
