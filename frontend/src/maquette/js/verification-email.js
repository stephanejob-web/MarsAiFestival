/* ================================================================
   FICHIER — verification-email.js
   Vérification email par code OTP à 6 chiffres.
   Gestion des étapes, envoi, vérification, minuteur de renvoi.
   Dépendances : DOM chargé.
   ================================================================ */

    /* ─── STATE ─── */
    let userEmail = '';
    let resendInterval = null;
    const DIGITS = ['d1','d2','d3','d4','d5','d6'];

    /* ─── STEPS UI ─── */
    function setStep(n) {
      for (let i = 1; i <= 3; i++) {
        const sc = document.getElementById('sc-' + i);
        const sl = document.getElementById('sl-' + i);
        sc.className = 'step-circle ' + (i < n ? 'done' : i === n ? 'active' : 'pending');
        sc.textContent = i < n ? '✓' : i;
        sl.className = 'step-label ' + (i === n ? 'active-label' : 'dim');
      }
      for (let i = 1; i <= 2; i++) {
        document.getElementById('conn-' + i).className = 'step-connector' + (i < n ? ' done' : '');
      }
    }

    /* ─── SHOW VIEW ─── */
    function showView(n) {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-' + n).classList.add('active');
      setStep(n);
    }

    /* ─── EMAIL LIVE VALIDATION ─── */
    const emailInput = document.getElementById('email-input');
    const fieldMsg   = document.getElementById('field-msg');

    emailInput.addEventListener('input', () => {
      const val = emailInput.value.trim();
      emailInput.classList.remove('error', 'valid');
      fieldMsg.className = 'field-msg';
      fieldMsg.textContent = '';
      if (val.length > 4) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          emailInput.classList.add('valid');
          fieldMsg.className = 'field-msg ok';
          fieldMsg.textContent = '✓ Adresse valide';
        } else {
          fieldMsg.className = 'field-msg err';
          fieldMsg.textContent = 'Format invalide (ex: vous@domaine.com)';
        }
      }
    });
    emailInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendCode(); });

    /* ─── SEND CODE ─── */
    function sendCode() {
      const email = emailInput.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.classList.add('error');
        emailInput.classList.remove('valid');
        fieldMsg.className = 'field-msg err';
        fieldMsg.textContent = 'Veuillez entrer une adresse email valide.';
        emailInput.focus();
        return;
      }
      userEmail = email;
      const btn = document.getElementById('btn-send');
      btn.classList.add('loading');
      btn.disabled = true;

      setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        document.getElementById('display-email').textContent = email;
        showView(2);
        initOTP();
        startResendTimer();
      }, 1600);
    }

    /* ─── OTP SETUP ─── */
    function initOTP() {
      DIGITS.forEach((id, i) => {
        const el = document.getElementById(id);
        el.value = '';
        el.className = 'otp-digit';

        // Clone to remove old listeners
        const fresh = el.cloneNode(true);
        el.parentNode.replaceChild(fresh, el);
        const fe = document.getElementById(id);

        fe.addEventListener('keydown', e => {
          if (e.key === 'Backspace') {
            if (fe.value) {
              fe.value = '';
              fe.classList.remove('filled');
              checkOTP();
            } else if (i > 0) {
              const prev = document.getElementById(DIGITS[i - 1]);
              prev.value = '';
              prev.classList.remove('filled');
              prev.focus();
              checkOTP();
            }
            e.preventDefault();
            return;
          }
          if (e.key === 'ArrowLeft' && i > 0) { document.getElementById(DIGITS[i-1]).focus(); return; }
          if (e.key === 'ArrowRight' && i < 5) { document.getElementById(DIGITS[i+1]).focus(); return; }
        });

        fe.addEventListener('input', e => {
          const raw = fe.value.replace(/\D/g, '');
          if (!raw) { fe.value = ''; fe.classList.remove('filled'); checkOTP(); return; }
          fe.value = raw[raw.length - 1];
          fe.classList.add('filled');
          clearErrors();
          if (i < 5) document.getElementById(DIGITS[i + 1]).focus();
          checkOTP();
        });

        fe.addEventListener('paste', e => {
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
          text.split('').forEach((ch, j) => {
            const d = document.getElementById(DIGITS[j]);
            if (d) { d.value = ch; d.classList.add('filled'); }
          });
          const focus = Math.min(text.length, 5);
          document.getElementById(DIGITS[focus]).focus();
          clearErrors();
          checkOTP();
        });
      });

      setTimeout(() => document.getElementById('d1').focus(), 80);
    }

    function checkOTP() {
      const code = DIGITS.map(id => document.getElementById(id).value).join('');
      document.getElementById('btn-verify').disabled = code.length < 6;
    }

    function clearErrors() {
      DIGITS.forEach(id => document.getElementById(id).classList.remove('error-state'));
      const msg = document.getElementById('otp-error');
      msg.classList.remove('show');
    }

    /* ─── VERIFY ─── */
    function verifyCode() {
      const code = DIGITS.map(id => document.getElementById(id).value).join('');
      const btn = document.getElementById('btn-verify');
      btn.classList.add('loading');
      btn.disabled = true;

      setTimeout(() => {
        btn.classList.remove('loading');

        if (code === '123456') {
          if (fromDepot) { goToSubmission(); return; }
          showView(3);
        } else {
          // Shake + error state
          DIGITS.forEach(id => {
            const el = document.getElementById(id);
            el.classList.add('error-state', 'shake');
            setTimeout(() => { el.classList.remove('shake'); el.value = ''; el.classList.remove('filled', 'error-state'); }, 500);
          });
          document.getElementById('otp-error').classList.add('show');
          setTimeout(() => document.getElementById('d1').focus(), 520);
          btn.disabled = true;
        }
      }, 1100);
    }

    /* ─── RESEND ─── */
    function startResendTimer() {
      let s = 30;
      const timerEl = document.getElementById('resend-timer');
      const resendBtn = document.getElementById('btn-resend');
      resendBtn.disabled = true;
      timerEl.style.display = 'inline';

      if (resendInterval) clearInterval(resendInterval);
      resendInterval = setInterval(() => {
        s--;
        timerEl.textContent = `0:${String(s).padStart(2,'0')}`;
        if (s <= 0) {
          clearInterval(resendInterval);
          timerEl.style.display = 'none';
          resendBtn.disabled = false;
        }
      }, 1000);
    }

    function resendCode() {
      startResendTimer();
      DIGITS.forEach(id => { const el = document.getElementById(id); el.value = ''; el.classList.remove('filled','error-state'); });
      clearErrors();
      document.getElementById('btn-verify').disabled = true;
      setTimeout(() => document.getElementById('d1').focus(), 50);
    }

    function goBack() {
      if (resendInterval) clearInterval(resendInterval);
      if (fromDepot) {
        window.location.href = 'formulaire-depot.html';
      } else {
        showView(1);
        setTimeout(() => emailInput.focus(), 80);
      }
    }

    function goToSubmission() {
      window.location.href = fromDepot ? 'confirmation-depot.html' : 'formulaire-depot.html';
    }

    /* ─── INIT ─── */
    const _urlParams = new URLSearchParams(window.location.search);
    const fromDepot  = _urlParams.get('from') === 'depot';
    const preEmail   = _urlParams.get('email');

    if (fromDepot && preEmail) {
      // Adapter les labels des étapes au contexte dépôt
      document.getElementById('sl-1').textContent = 'Formulaire';
      document.getElementById('sl-2').textContent = 'Vérification';
      document.getElementById('sl-3').textContent = 'Confirmation';

      // Marquer step 1 comme terminé et aller directement au code OTP
      userEmail = decodeURIComponent(preEmail);
      emailInput.value = userEmail;
      document.getElementById('display-email').textContent = userEmail;
      setTimeout(() => {
        showView(2);
        // Marquer step 1 visuellement comme "fait"
        document.getElementById('sc-1').className = 'step-circle done';
        document.getElementById('sc-1').textContent = '✓';
        document.getElementById('sl-1').className = 'step-label dim';
        initOTP();
        startResendTimer();
      }, 300);
    } else {
      setStep(1);
      setTimeout(() => {
        emailInput.focus();
        emailInput.classList.add('valid');
      }, 200);
    }
