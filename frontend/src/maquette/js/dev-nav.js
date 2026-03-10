/* ================================================================
   dev-nav.js — Toggle du panneau de navigation maquette
   Mémorise l'état ouvert/fermé dans localStorage.
   ================================================================ */
(function () {
  var nav = document.getElementById('dev-nav');
  if (!nav) return;

  // Restaure l'état précédent
  if (localStorage.getItem('devNavOpen') === '1') {
    nav.classList.add('open');
  }

  window.devNavToggle = function () {
    var isOpen = nav.classList.toggle('open');
    localStorage.setItem('devNavOpen', isOpen ? '1' : '0');
  };
})();
