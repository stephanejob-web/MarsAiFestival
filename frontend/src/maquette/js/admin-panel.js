/* ================================================================
   FICHIER — admin-panel.js
   Panneau d'administration : données mock, CRUD films/jurés,
   tableaux, filtres, modales, vues et statistiques.
   Dépendances : DOM chargé.
   ================================================================ */

/* ── DONNÉES MAQUETTE ── */
const films = [
  {
    id: 1,
    title: "Rêves de Silicium",
    author: "Léa Fontaine",
    country: "France",
    juryDec: { 1: "valide", 2: "aRevoir", 3: "valide", 4: null },
    comments: {
      1: "Narration percutante, maîtrise formelle remarquable.",
      2: "Fin un peu abrupte, à retravailler.",
      3: "Très forte proposition artistique.",
    },
  },
  {
    id: 2,
    title: "L'Enfant-Pixel",
    author: "Amira Ben Said",
    country: "Tunisie",
    juryDec: { 1: "valide", 2: "valide", 3: "valide", 4: null },
    comments: {
      1: "Direction visuelle exceptionnelle.",
      2: "Très forte.",
      3: "Bravo.",
    },
  },
  {
    id: 3,
    title: "Archipel 2048",
    author: "Kenji Ito",
    country: "Japon",
    juryDec: { 1: "aRevoir", 2: "valide", 3: null, 4: "aRevoir" },
    comments: {
      1: "Réflexion intéressante, manque de rythme.",
      2: "Belle esthétique.",
    },
  },
  {
    id: 4,
    title: "Mémoire Vive",
    author: "Carlos Ruiz",
    country: "Espagne",
    juryDec: { 1: null, 2: null, 3: null, 4: null },
    comments: {},
  },
  {
    id: 5,
    title: "Nouveaux Soleils",
    author: "Priya Mehta",
    country: "Inde",
    juryDec: { 1: "valide", 2: "valide", 3: "valide", 4: "valide" },
    comments: {
      1: "Chef-d'œuvre, unanime.",
      2: "Absolument.",
      3: "Sublime.",
      4: "Coup de cœur.",
    },
  },
  {
    id: 6,
    title: "Frontières Douces",
    author: "Omar Diallo",
    country: "Sénégal",
    juryDec: { 1: "refuse", 2: "aRevoir", 3: null, 4: "refuse" },
    comments: {
      1: "Trop sonore, peu de visuel.",
      4: "Ne correspond pas au cahier des charges.",
    },
  },
  {
    id: 7,
    title: "Vague Numérique",
    author: "Sofia Ek",
    country: "Suède",
    juryDec: { 1: "valide", 2: null, 3: "valide", 4: "aRevoir" },
    comments: { 1: "Travail visuel très soigné.", 3: "Bonne proposition." },
  },
  {
    id: 8,
    title: "Jardin des Codes",
    author: "Lin Wei",
    country: "Chine",
    juryDec: { 1: "valide", 2: null, 3: "aRevoir", 4: "valide" },
    comments: { 1: "Poésie numérique rare.", 4: "Beau." },
  },
  {
    id: 9,
    title: "Signal Perdu",
    author: "Aya Tanaka",
    country: "Japon",
    juryDec: { 1: null, 2: null, 3: null, 4: null },
    comments: {},
  },
  {
    id: 10,
    title: "Horizon Zéro",
    author: "Mia Schultz",
    country: "Allemagne",
    juryDec: { 1: "valide", 2: "valide", 3: "valide", 4: "valide" },
    comments: {
      1: "Incontournable.",
      2: "Unanime.",
      3: "Parfait.",
      4: "À sélectionner absolument.",
    },
  },
  {
    id: 11,
    title: "Corps Électrique",
    author: "Nadia Okonkwo",
    country: "Nigeria",
  },
  {
    id: 12,
    title: "Le Miroir Bruité",
    author: "Thomas Vidal",
    country: "France",
  },
  {
    id: 13,
    title: "Synthèse Éternelle",
    author: "Park Ji-won",
    country: "Corée du Sud",
  },
  {
    id: 14,
    title: "Désert de Données",
    author: "Yasmine Alaoui",
    country: "Maroc",
  },
  { id: 15, title: "Pulse", author: "Elena Petrov", country: "Russie" },
  {
    id: 16,
    title: "La Dernière Fréquence",
    author: "Marco Ferretti",
    country: "Italie",
  },
  { id: 17, title: "Matière Grise", author: "Chidi Osei", country: "Ghana" },
  {
    id: 18,
    title: "Lumière Froide",
    author: "Ingrid Larsen",
    country: "Norvège",
  },
  {
    id: 19,
    title: "Algorithme du Cœur",
    author: "Fatima Zahra",
    country: "Algérie",
  },
  {
    id: 20,
    title: "Neurones d'Acier",
    author: "Viktor Novak",
    country: "Tchéquie",
  },
  {
    id: 21,
    title: "L'Œil Augmenté",
    author: "Rania Hassan",
    country: "Égypte",
  },
  {
    id: 22,
    title: "Boucle Infinie",
    author: "Diego Castillo",
    country: "Mexique",
  },
  {
    id: 23,
    title: "Écho d'Humanité",
    author: "Yuki Nakamura",
    country: "Japon",
  },
  {
    id: 24,
    title: "Partition Invisible",
    author: "Selin Yıldız",
    country: "Turquie",
  },
  {
    id: 25,
    title: "Terra Incognita",
    author: "Ana Rodrigues",
    country: "Portugal",
  },
  {
    id: 26,
    title: "Conscience Liquide",
    author: "Samuel Oduya",
    country: "Kenya",
  },
  { id: 27, title: "Émergence", author: "Claire Morin", country: "France" },
  {
    id: 28,
    title: "Le Temps Fracturé",
    author: "Hana Kim",
    country: "Corée du Sud",
  },
  { id: 29, title: "Biomécanique", author: "Rafael Santos", country: "Brésil" },
  { id: 30, title: "Flux", author: "Amara Touré", country: "Mali" },
  { id: 31, title: "Phosphène", author: "Giulia Romano", country: "Italie" },
  {
    id: 32,
    title: "L'Arbre Numérique",
    author: "Mehdi Karimi",
    country: "Iran",
  },
  { id: 33, title: "Strates", author: "Olga Sorokina", country: "Ukraine" },
  { id: 34, title: "Hyperréel", author: "James Okafor", country: "Nigeria" },
  {
    id: 35,
    title: "Protocole Zéro",
    author: "Sven Eriksson",
    country: "Suède",
  },
  {
    id: 36,
    title: "Mutation Douce",
    author: "Layla Al-Rashid",
    country: "Irak",
  },
  { id: 37, title: "Zéro Latence", author: "Chen Mingzhi", country: "Chine" },
  {
    id: 38,
    title: "Le Chant des Machines",
    author: "Idrissa Coulibaly",
    country: "Burkina Faso",
  },
  { id: 39, title: "Fractale", author: "Nina Kovač", country: "Croatie" },
  { id: 40, title: "Résonance", author: "Pablo Herrera", country: "Colombie" },
  { id: 41, title: "Interface", author: "Mele Tupou", country: "Tonga" },
  { id: 42, title: "Continuum", author: "Aiko Suzuki", country: "Japon" },
  {
    id: 43,
    title: "L'Ère du Vide",
    author: "Camille Perret",
    country: "Belgique",
  },
  {
    id: 44,
    title: "Données Sensibles",
    author: "Kofi Mensah",
    country: "Ghana",
  },
  {
    id: 45,
    title: "Synthétique",
    author: "Lucía Fernández",
    country: "Argentine",
  },
  { id: 46, title: "Grille", author: "Dmitri Volkov", country: "Russie" },
  { id: 47, title: "Post-Humain", author: "Leila Nasser", country: "Liban" },
  {
    id: 48,
    title: "Code Source",
    author: "Étienne Blanchard",
    country: "Canada",
  },
  { id: 49, title: "Éveil", author: "Sunita Rao", country: "Inde" },
  {
    id: 50,
    title: "La Mémoire des Pixels",
    author: "Zara Ahmed",
    country: "Pakistan",
  },
];

/* ── GÉNÉRATION DES 450 FILMS RESTANTS (51–500) ── */
(function () {
  const titles = [
    "Soleil Binaire",
    "Ombre Numérique",
    "Éclat Artificiel",
    "Mémoire Quantique",
    "Flux Vital",
    "Signal d'Aube",
    "Conscience Augmentée",
    "Territoire Virtuel",
    "Silence Algorithmique",
    "Lumière Codée",
    "Rêve Mécanique",
    "Corps Numérique",
    "Voix Synthétique",
    "Regard Artificiel",
    "Temps Fractal",
    "Monde Parallèle",
    "Âme Pixelisée",
    "Identité Simulée",
    "Horizon Numérique",
    "Portail Quantique",
    "Écho des Machines",
    "Pulsion Électrique",
    "Mémoire Effacée",
    "Données Perdues",
    "Réseau Vivant",
    "Interface Humaine",
    "Protocole Émotionnel",
    "Simulation Parfaite",
    "Glitch Poétique",
    "Bruit Blanc",
    "Cartographie du Futur",
    "Spectre Numérique",
    "Onde de Choc",
    "Réalité Altérée",
    "Nœud Temporel",
    "Dimension Zéro",
    "Lumière Artificielle",
    "Territoire Inconnu",
    "Signal Fantôme",
    "Pixel Vivant",
    "Cerveau Augmenté",
    "Système Nerveux",
    "Circuit Émotionnel",
    "Fréquence Vitale",
    "Onde Cérébrale",
    "Transmission Directe",
    "Connexion Totale",
    "Fusion Numérique",
    "Évolution Forcée",
    "Mutation Digitale",
    "Chaos Ordonné",
    "Harmonie Binaire",
    "Symphonie Numérique",
    "Composition Artificielle",
    "Rythme Codé",
    "Danse des Algorithmes",
    "Mouvement Synthétique",
    "Geste Mécanique",
    "Corps Augmenté",
    "Peau Numérique",
    "Regard Profond",
    "Vision Augmentée",
    "Œil Artificiel",
    "Perspective Codée",
    "Angle Mort",
    "Surface Miroir",
    "Reflet Numérique",
    "Image Fantôme",
    "Portrait Synthétique",
    "Visage Augmenté",
    "Identité Fragmentée",
    "Moi Numérique",
    "Conscience Divisée",
    "Dualité Digitale",
    "Multiplicité",
    "Archipel Numérique",
    "Île Virtuelle",
    "Territoire Flottant",
    "Espace Intermédiaire",
    "Zone Grise",
    "Frontière Perméable",
    "Limite Effacée",
    "Bord du Réel",
    "Seuil Numérique",
    "Passage Secret",
    "Porte Quantique",
    "Clé Algorithmique",
    "Code Source Vif",
    "Programme Émotionnel",
    "Script Poétique",
    "Langage Nouveau",
    "Mot Binaire",
    "Phrase Codée",
    "Texte Augmenté",
    "Récit Numérique",
  ];
  const firstNames = [
    "Amara",
    "Lucas",
    "Mei",
    "Rafael",
    "Yuki",
    "Sofia",
    "Ibrahim",
    "Elena",
    "Kofi",
    "Priya",
    "Diego",
    "Nadia",
    "Sven",
    "Leila",
    "Thomas",
    "Aiko",
    "Carlos",
    "Fatima",
    "James",
    "Olga",
    "Hana",
    "Viktor",
    "Giulia",
    "Samuel",
    "Claire",
    "Omar",
    "Rania",
    "Pavel",
    "Sunita",
    "Layla",
    "Chidi",
    "Nina",
    "Pablo",
    "Aya",
    "Marco",
    "Ingrid",
    "Étienne",
    "Mele",
    "Yasmine",
    "Chen",
    "Dmitri",
    "Ana",
    "Selin",
    "Idrissa",
    "Lin",
    "Camille",
    "Rafael",
    "Zara",
    "Mehdi",
    "Park",
  ];
  const lastNames = [
    "Touré",
    "Schmidt",
    "Zhang",
    "Fernández",
    "Nakamura",
    "Eriksson",
    "Diallo",
    "Petrov",
    "Mensah",
    "Mehta",
    "Castillo",
    "Hassan",
    "Lindqvist",
    "Nasser",
    "Vidal",
    "Suzuki",
    "Ruiz",
    "Zahra",
    "Okafor",
    "Sorokina",
    "Kim",
    "Novak",
    "Romano",
    "Oduya",
    "Morin",
    "Diallo",
    "Al-Rashid",
    "Novák",
    "Rao",
    "Al-Rashid",
    "Osei",
    "Kovač",
    "Herrera",
    "Tanaka",
    "Ferretti",
    "Larsen",
    "Blanchard",
    "Tupou",
    "Alaoui",
    "Mingzhi",
    "Volkov",
    "Rodrigues",
    "Yıldız",
    "Coulibaly",
    "Wei",
    "Perret",
    "Santos",
    "Ahmed",
    "Karimi",
    "Ji-won",
  ];
  const countries = [
    "France",
    "Japon",
    "Brésil",
    "Allemagne",
    "Espagne",
    "Italie",
    "Canada",
    "Mexique",
    "Corée du Sud",
    "Inde",
    "Sénégal",
    "Maroc",
    "Algérie",
    "Tunisie",
    "Égypte",
    "Nigeria",
    "Ghana",
    "Kenya",
    "Mali",
    "Burkina Faso",
    "Chine",
    "Russie",
    "Ukraine",
    "Pologne",
    "Suède",
    "Norvège",
    "Danemark",
    "Portugal",
    "Argentine",
    "Colombie",
    "Pérou",
    "Chili",
    "Turquie",
    "Iran",
    "Liban",
    "Irak",
    "Pakistan",
    "Bangladesh",
    "Thaïlande",
    "Vietnam",
    "Philippines",
    "Indonésie",
    "Australie",
    "Nouvelle-Zélande",
    "Afrique du Sud",
    "Éthiopie",
    "Tanzanie",
    "Mozambique",
    "Angola",
    "Tonga",
  ];

  for (let i = 51; i <= 500; i++) {
    const ti = (i - 51) % titles.length;
    const fi = (i * 7) % firstNames.length;
    const li = (i * 13) % lastNames.length;
    const ci = (i * 3) % countries.length;
    films.push({
      id: i,
      title:
        titles[ti] +
        (Math.floor((i - 51) / titles.length) > 0
          ? " " + (Math.floor((i - 51) / titles.length) + 1)
          : ""),
      author: firstNames[fi] + " " + lastNames[li],
      country: countries[ci],
      juryDec: {},
      comments: {},
    });
  }
})();

let users = [
  {
    id: 1,
    name: "Marie Lefebvre",
    email: "m.lefebvre@marsai.fr",
    role: "jury",
    active: true,
    token: "MLF-7A2K-X9P",
    assigned: [],
    cls: "ua-1",
    label: "Présidente · Réalisatrice",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 2,
    name: "Pierre Dubois",
    email: "p.dubois@marsai.fr",
    role: "jury",
    active: true,
    token: "PDB-3R8M-Q1T",
    assigned: [],
    cls: "ua-2",
    label: "Directeur artistique",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 3,
    name: "Kenji Ito",
    email: "k.ito@marsai.jp",
    role: "jury",
    active: true,
    token: "KIT-9S4N-W2V",
    assigned: [],
    cls: "ua-3",
    label: "Artiste numérique",
    avatar: "https://i.pravatar.cc/150?img=68",
  },
  {
    id: 4,
    name: "Sofia Eriksson",
    email: "s.eriksson@marsai.se",
    role: "jury",
    active: true,
    token: "SEK-5H1B-R4C",
    assigned: [],
    cls: "ua-4",
    label: "Critique de cinéma",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
  {
    id: 5,
    name: "Camille Moreau",
    email: "c.moreau@marsai.fr",
    role: "moderateur",
    active: true,
    token: "CMR-2J6D-L8Z",
    assigned: [],
    cls: "ua-5",
    label: "Modératrice",
    avatar: "https://i.pravatar.cc/150?img=25",
  },
  {
    id: 6,
    name: "Thomas Leroy",
    email: "t.leroy@marsai.fr",
    role: "moderateur",
    active: false,
    token: "TLR-8K3F-P7Y",
    assigned: [],
    cls: "ua-6",
    label: "Modérateur",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: 7,
    name: "Amara Touré",
    email: "a.toure@marsai.ml",
    role: "jury",
    active: true,
    token: "ATR-4L9G-H3N",
    assigned: [],
    cls: "ua-1",
    label: "Productrice",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 10,
    name: "Carlos Ruiz",
    email: "c.ruiz@marsai.es",
    role: "jury",
    active: true,
    token: "CRZ-9D3C-W7Q",
    assigned: [],
    cls: "ua-4",
    label: "Chef opérateur",
    avatar: "https://i.pravatar.cc/150?img=18",
  },
];

let newUserRole = "jury";
let currentAssignUserId = null;
let tempAssigned = [];

/* ── RENDU TABLE UTILISATEURS ── */
function getInitials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0].toUpperCase())
    .join("-");
}

function renderUsers() {
  const tbody = document.getElementById("user-tbody");
  const juryUsers = users.filter((u) => u.role === "jury");
  const maxAssigned = juryUsers.length
    ? Math.max(...juryUsers.map((u) => u.assigned.length), 1)
    : 1;
  tbody.innerHTML = users
    .map((u) => {
      const initials = getInitials(u.name);
      const rolePill = `<select class="role-select ${u.role === 'jury' ? 'rs-jury' : 'rs-modo'}" onchange="changeRole(${u.id}, this.value)">
        <option value="jury" ${u.role === 'jury' ? 'selected' : ''}>⚖️ Jury</option>
        <option value="moderateur" ${u.role === 'moderateur' ? 'selected' : ''}>🛡️ Modérateur</option>
      </select>`;
      const pct = u.role === "jury" ? Math.round((u.assigned.length / maxAssigned) * 100) : 0;
      const assignTxt =
        u.role === "jury"
          ? `<div class="assign-count ${u.assigned.length === 0 ? "none" : ""}" onclick="openAssign(${u.id})">
               <span>${u.assigned.length} film${u.assigned.length !== 1 ? "s" : ""} ✎</span>
               <div class="assign-bar-track"><div class="assign-bar-fill" style="width:${pct}%"></div></div>
             </div>`
          : `<span style="color:var(--mist);font-size:0.75rem;">—</span>`;
      const tokenDisplay = u.active
        ? `<div class="token-col"><span class="token-val">${u.token}</span><button class="btn-icon" title="Copier le lien" onclick="showToast('Lien copié : https://jury.marsai.fr/access/${u.token}', 'ok')">📋</button><button class="btn-icon" title="Renvoyer par email" onclick="showToast('Email renvoyé à ${u.email}', 'ok')">📧</button></div>`
        : `<span style="color:var(--mist);font-size:0.72rem;opacity:0.5;">—</span>`;
      const mobileAssign =
        u.role === "jury"
          ? `<div class="mobile-assign ${u.assigned.length === 0 ? "none" : ""}" onclick="openAssign(${u.id})">🎞️ <span>${u.assigned.length}</span></div>`
          : ``;
      const statusHtml = u.invited
        ? `<div class="status-wrap" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:0.72rem;font-weight:600;color:var(--solar);background:rgba(245,200,66,0.1);border:1px solid rgba(245,200,66,0.25);border-radius:6px;padding:3px 8px;white-space:nowrap;">✉ En attente</span>
            <button class="btn-icon" title="Renvoyer l'invitation" onclick="showToast('✉ Invitation renvoyée à ${u.email}', 'ok')" style="font-size:0.8rem;">↺</button>
          </div>`
        : `<div class="status-wrap" style="display:flex;align-items:center;gap:10px;">
            <div class="status-toggle" onclick="toggleUser(${u.id})">
              <div class="toggle-track ${u.active ? "on" : ""}">
                <div class="toggle-thumb"></div>
              </div>
              <span class="toggle-label">${u.active ? "Actif" : "Désactivé"}</span>
            </div>
            ${mobileAssign}
          </div>`;
      return `<tr>
        <td>
          <div class="u-cell" style="display:flex;align-items:center;gap:10px;">
            <img src="${u.avatar}" alt="${u.name}" class="u-avatar-img" onclick="this.closest('.u-cell').classList.toggle('u-expanded')" style="width:32px;height:32px;border-radius:8px;object-fit:cover;flex-shrink:0;cursor:pointer;${!u.active ? "opacity:0.4;filter:grayscale(1);" : ""}">
            <div>
              <div class="u-name" style="${!u.active ? "opacity:0.45;" : ""}">${u.name}</div>
              <div class="u-initials" style="${!u.active ? "opacity:0.45;" : ""}">${initials}</div>
              <div class="u-email">${u.email}</div>
            </div>
          </div>
        </td>
        <td>${rolePill}</td>
        <td>${assignTxt}</td>
        <td>${tokenDisplay}</td>
        <td>${statusHtml}</td>
      </tr>`;
    })
    .join("");
  document.getElementById("count-users").textContent = users.filter(
    (u) => u.active,
  ).length;
}

function toggleUser(id) {
  const u = users.find((x) => x.id === id);
  if (!u) return;
  u.active = !u.active;
  showToast(
    u.active ? `✓ ${u.name} réactivé` : `🔒 ${u.name} désactivé`,
    u.active ? "ok" : "warn",
  );
  renderUsers();
}

function changeRole(id, newRole) {
  const u = users.find((x) => x.id === id);
  if (!u || u.role === newRole) return;
  const prev = u.role;
  u.role = newRole;
  const label = newRole === "jury" ? "Jury ⚖️" : "Modérateur 🛡️";
  showToast(`✓ ${u.name} → ${label}`, "ok");
  renderUsers();
}

function deleteUser(id) {
  const u = users.find((x) => x.id === id);
  if (!u) return;
  if (!confirm(`Supprimer le compte de ${u.name} ?`)) return;
  users = users.filter((x) => x.id !== id);
  showToast(`Compte de ${u.name} supprimé`, "err");
  renderUsers();
}

/* ── MODAL CRÉER ── */
function openModal(name) {
  document.getElementById("modal-" + name).classList.add("open");
  if (name === "create") {
    const emailInput = document.getElementById("new-email");
    if (emailInput && !emailInput.value) {
      emailInput.value = "jury.test@marsai.fr";
    }
  }
}
function closeModal(name) {
  document.getElementById("modal-" + name).classList.remove("open");
}

function selectRole(role) {
  newUserRole = role;
  document
    .getElementById("opt-jury")
    .classList.toggle("selected", role === "jury");
  document
    .getElementById("opt-modo")
    .classList.toggle("selected", role === "moderateur");
}

function createUser() {
  const email = document.getElementById("new-email").value.trim();
  if (!email) {
    showToast("Adresse email requise", "err");
    return;
  }
  if (users.find((u) => u.email === email)) {
    showToast("Cette adresse est déjà utilisée", "err");
    return;
  }
  const token =
    "INV-" +
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 5).toUpperCase();
  const clsList = ["ua-1", "ua-2", "ua-3", "ua-4", "ua-5", "ua-6"];
  const newUser = {
    id: Date.now(),
    name: "Invitation en attente",
    email,
    role: newUserRole,
    active: false,
    invited: true,
    token,
    assigned: [],
    cls: clsList[users.length % clsList.length],
    avatar: `https://i.pravatar.cc/80?u=${email}`,
  };
  users.push(newUser);
  document.getElementById("new-email").value = "";
  const inviteUrl = `invite.html?token=${token}&email=${encodeURIComponent(email)}&role=${newUserRole}`;

  // Afficher la confirmation avec lien cliquable
  const modal = document.querySelector("#modal-create .modal");
  modal.innerHTML = `
    <div class="modal-header">
      <div class="modal-title">✉ Invitation envoyée</div>
      <button class="modal-close" onclick="closeModal('create');resetInviteModal()">✕</button>
    </div>

    <div style="text-align:center;padding:8px 0 20px;">
      <div style="width:52px;height:52px;background:rgba(78,255,206,0.08);border:1px solid rgba(78,255,206,0.22);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin:0 auto 14px;">✉</div>
      <div style="font-size:0.95rem;font-weight:700;color:var(--white-soft);margin-bottom:6px;">Invitation envoyée à</div>
      <div style="font-size:0.85rem;color:var(--aurora);font-weight:600;">${email}</div>
    </div>

    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px;margin-bottom:18px;">
      <div style="font-size:0.68rem;color:var(--mist);font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:10px;">Aperçu de la page d'invitation</div>
      <a href="${inviteUrl}" target="_blank" style="
        display:flex;align-items:center;justify-content:center;gap:8px;
        width:100%;padding:11px;border-radius:8px;
        background:linear-gradient(135deg,rgba(78,255,206,0.12),rgba(192,132,252,0.12));
        border:1px solid rgba(78,255,206,0.25);
        font-family:var(--font-body);font-size:0.88rem;font-weight:700;
        color:var(--aurora);text-decoration:none;
        transition:all 0.2s;
      " onmouseover="this.style.background='linear-gradient(135deg,rgba(78,255,206,0.2),rgba(192,132,252,0.2))'"
         onmouseout="this.style.background='linear-gradient(135deg,rgba(78,255,206,0.12),rgba(192,132,252,0.12))'">
        👁 Voir la page d'invitation →
      </a>
    </div>

    <div class="modal-actions">
      <button class="btn-confirm" onclick="navigator.clipboard.writeText(window.location.origin.replace(/\\/$/,'')+'/views/${inviteUrl}');showToast('Lien copié ✓','ok')">📋 Copier le lien</button>
      <button class="btn-cancel" onclick="closeModal('create');resetInviteModal()">Fermer</button>
    </div>`;

  renderUsers();
}

function resetInviteModal() {
  const modal = document.querySelector("#modal-create .modal");
  modal.innerHTML = `
    <div class="modal-header">
      <div class="modal-title">Inviter un membre</div>
      <button class="modal-close" onclick="closeModal('create')">✕</button>
    </div>
    <div class="form-field">
      <label>Adresse email</label>
      <input type="email" id="new-email" placeholder="sophie.martin@email.com"/>
    </div>
    <div class="form-field">
      <label>Rôle</label>
      <div class="role-picker">
        <div class="role-opt selected" id="opt-jury" onclick="selectRole('jury')">
          <span class="ro-icon">⚖️</span><span class="ro-label">Jury</span>
        </div>
        <div class="role-opt modo" id="opt-modo" onclick="selectRole('moderateur')">
          <span class="ro-icon">🛡️</span><span class="ro-label">Modérateur</span>
        </div>
      </div>
    </div>
    <div class="modal-info">
      Un <strong>lien d'invitation sécurisé</strong> sera envoyé à cette adresse.<br/>
      Le membre choisit son nom et son mode de connexion à la création.
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal('create')">Annuler</button>
      <button class="btn-confirm" onclick="createUser()">Envoyer l'invitation →</button>
    </div>`;
  newUserRole = "jury";
  document.getElementById("opt-jury")?.classList.add("selected");
  document.getElementById("opt-modo")?.classList.remove("selected");
}

/* ── ASSIGNATION DIRECTE (clic avatar — assigne ou désassigne) ── */
function toggleFilmJury(filmId, userId) {
  const u = users.find((x) => x.id === userId);
  const f = films.find((x) => x.id === filmId);
  if (!u || !f) return;
  const idx = u.assigned.indexOf(filmId);
  if (idx > -1) {
    u.assigned.splice(idx, 1);
    showToast(`${u.name.split(" ")[0]} retiré de "${f.title}"`, "warn");
  } else {
    u.assigned.push(filmId);
    showToast(`✓ ${u.name.split(" ")[0]} assigné à "${f.title}"`, "ok");
  }
  renderAssignView();
  renderUsers();
}

/* ── VUE ASSIGNATION (médiathèque) ── */
const FILMS_PER_PAGE = 20;
let currentPage = 1;
let currentViewMode = "grid";

function setViewMode(mode) {
  currentViewMode = mode;
  document
    .getElementById("vmt-list")
    .classList.toggle("active", mode === "list");
  document
    .getElementById("vmt-grid")
    .classList.toggle("active", mode === "grid");
  renderAssignView();
}


function renderAssignView(page) {
  if (page !== undefined) currentPage = page;
  const grid = document.getElementById("assign-grid");
  const juryUsers = users.filter((u) => u.role === "jury" && u.active);

  // Filtrer par recherche + pays
  const filteredFilms = films.filter((f) => {
    const matchSearch =
      !filmSearchQuery ||
      (f.title + f.author + f.country).toLowerCase().includes(filmSearchQuery);
    const matchCountry =
      !filmCountryFilters.length || filmCountryFilters.includes(f.country);
    return matchSearch && matchCountry;
  });

  // Rafraîchir les pills pays
  renderCountryFilters();

  // Stats assignation
  const nonAssigned = filteredFilms.filter(
    (f) => !juryUsers.some((u) => u.assigned.includes(f.id)),
  );
  const assignedFilms = filteredFilms.filter(
    (f) => juryUsers.some((u) => u.assigned.includes(f.id)),
  );

  // Appliquer le filtre assignation
  const filmList = filmAssignFilter === "unassigned" ? nonAssigned
                 : filmAssignFilter === "assigned"   ? assignedFilms
                 : filteredFilms;

  // Mise à jour des compteurs sur les boutons filtre
  const btnUCount = document.getElementById("afilter-unassigned-count");
  const btnACount = document.getElementById("afilter-assigned-count");
  if (btnUCount) btnUCount.textContent = `(${nonAssigned.length})`;
  if (btnACount) btnACount.textContent = `(${assignedFilms.length})`;

  // Compteur nav + info bar
  document.getElementById("count-assign").textContent = nonAssigned.length || "✓";
  const infoEl = document.getElementById("films-total-info");
  if (infoEl) {
    infoEl.textContent = `${filteredFilms.length} film${filteredFilms.length > 1 ? "s" : ""} · ${assignedFilms.length} assigné${assignedFilms.length > 1 ? "s" : ""} · ${nonAssigned.length} en attente`;
  }
  const totalPages = Math.ceil(filmList.length / FILMS_PER_PAGE);
  if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
  const pageFilms = filmList.slice(
    (currentPage - 1) * FILMS_PER_PAGE,
    currentPage * FILMS_PER_PAGE,
  );

  // État vide
  const emptyEl = document.getElementById("assign-empty");
  const listWrap = document.getElementById("film-list-wrap");
  const cardsWrap = document.getElementById("assign-cards");
  if (filmList.length === 0) {
    grid.innerHTML = "";
    if (cardsWrap) cardsWrap.innerHTML = "";
    if (listWrap) listWrap.style.display = "none";
    if (cardsWrap) cardsWrap.style.display = "none";
    emptyEl.innerHTML = filmSearchQuery
      ? `<div style="font-size:2rem;margin-bottom:12px;">🔍</div><div style="font-family:var(--font-display);font-size:1rem;font-weight:800;color:var(--white-soft);margin-bottom:6px;">Aucun résultat pour "${filmSearchQuery}"</div><div style="font-size:0.78rem;color:var(--mist);">Essayez un autre titre, réalisateur ou pays.</div>`
      : filmAssignFilter === "assigned"
      ? `<div style="font-size:2rem;margin-bottom:12px;">📋</div><div style="font-family:var(--font-display);font-size:1rem;font-weight:800;color:var(--white-soft);margin-bottom:6px;">Aucun film assigné pour l'instant</div><div style="font-size:0.78rem;color:var(--mist);">Utilisez "Répartir équitablement" ou assignez manuellement.</div>`
      : filmAssignFilter === "unassigned"
      ? `<div style="font-size:3rem;margin-bottom:16px;">🎉</div><div style="font-family:var(--font-display);font-size:1.1rem;font-weight:800;color:var(--white-soft);margin-bottom:8px;">Tous les films sont assignés !</div><div style="font-size:0.8rem;color:var(--mist);">Retrouvez-les dans l'onglet "Assignés".</div>`
      : `<div style="font-size:3rem;margin-bottom:16px;">🎉</div><div style="font-family:var(--font-display);font-size:1.1rem;font-weight:800;color:var(--white-soft);margin-bottom:8px;">Tous les films sont assignés !</div><div style="font-size:0.8rem;color:var(--mist);">Retrouvez-les dans l'onglet "Assignés".</div>`;
    emptyEl.style.display = "block";
    document.getElementById("pagination").innerHTML = "";
    return;
  }
  emptyEl.style.display = "none";

  // Palettes pour la vue grille
  const cardPalettes = [
    {
      accent: "#4effce",
      bg: "linear-gradient(135deg,#032e22 0%,#050f1a 60%,#031e16 100%)",
    },
    {
      accent: "#c084fc",
      bg: "linear-gradient(135deg,#1e0a38 0%,#050818 60%,#150830 100%)",
    },
    {
      accent: "#ff6b6b",
      bg: "linear-gradient(135deg,#2e0a0a 0%,#080510 60%,#1e0606 100%)",
    },
    {
      accent: "#f5e642",
      bg: "linear-gradient(135deg,#2a2200 0%,#080810 60%,#1c1800 100%)",
    },
    {
      accent: "#60a5fa",
      bg: "linear-gradient(135deg,#071e38 0%,#050818 60%,#040e22 100%)",
    },
    {
      accent: "#f472b6",
      bg: "linear-gradient(135deg,#2e0a1c 0%,#080510 60%,#1e0612 100%)",
    },
    {
      accent: "#34d399",
      bg: "linear-gradient(135deg,#022e1e 0%,#050f1a 60%,#021e14 100%)",
    },
    {
      accent: "#fb923c",
      bg: "linear-gradient(135deg,#2e1400 0%,#0a0608 60%,#1e0e00 100%)",
    },
  ];

  if (currentViewMode === "list") {
    if (listWrap) listWrap.style.display = "";
    if (cardsWrap) cardsWrap.style.display = "none";

    grid.innerHTML = pageFilms
      .map((f) => {
        const assignedJury = juryUsers.filter((u) => u.assigned.includes(f.id));
        const isAssigned = assignedJury.length > 0;
        const nComments = f.comments ? Object.keys(f.comments).length : 0;
        const avatarStack = isAssigned
          ? `<div class="av-stack">${assignedJury
              .slice(0, 4)
              .map(
                (u) =>
                  `<img src="${u.avatar}" alt="${u.name}" title="${u.name}">`,
              )
              .join(
                "",
              )}${assignedJury.length > 4 ? `<div class="av-extra">+${assignedJury.length - 4}</div>` : ""}</div>`
          : `<span class="fl-not-assigned">Non assigné</span>`;
        const commentBtn =
          nComments > 0
            ? `<button class="fl-comment-btn" onclick="event.stopPropagation();openCommentsModal(${f.id})">💬 ${nComments}</button>`
            : "";
        return `<tr class="fl-row" onclick="openDrawer(${f.id})">
          <td class="fl-td-num">#${String(f.id).padStart(3, "0")}</td>
          <td class="fl-td-film"><div class="fl-title">${f.title}</div><div class="fl-author">${f.author}</div></td>
          <td class="fl-td-country">${flags[f.country] || "🌐"} ${f.country}</td>
          <td class="fl-td-jury">${avatarStack}${commentBtn}</td>
          <td class="fl-td-action">
            <button class="btn-fl-assign ${isAssigned ? "is-assigned" : ""}" onclick="event.stopPropagation();openDrawer(${f.id})">${isAssigned ? "Modifier" : "Assigner"} →</button>
          </td>
        </tr>`;
      })
      .join("");
  } else {
    if (listWrap) listWrap.style.display = "none";
    if (cardsWrap) cardsWrap.style.display = "grid";

    cardsWrap.innerHTML = pageFilms
      .map((f) => {
        const assignedJury = juryUsers.filter((u) => u.assigned.includes(f.id));
        const nAssigned = assignedJury.length;
        const isAssigned = nAssigned > 0;
        const nComments = f.comments ? Object.keys(f.comments).length : 0;
        const pal = cardPalettes[f.id % cardPalettes.length];
        // Grille avatars jury (clic = assigner/désassigner)
        const avatars = juryUsers.map((u) => {
            const assigned = u.assigned.includes(f.id);
            const total = u.assigned.length;
            const badgeCls = total === 0 ? "alb-empty"
              : total <= 5 ? "alb-green"
              : total <= 10 ? "alb-orange"
              : "alb-red";
            const badgeTxt = total === 0 ? "—" : total;
            const shadow = assigned
              ? "0 0 0 2.5px #4effce,0 0 12px rgba(78,255,206,0.5)"
              : "0 0 0 2px rgba(255,255,255,0.12)";
            const opacity = assigned ? "1" : "0.35";
            const initials = u.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
            const tooltip = `${u.name} — ${total === 0 ? "aucun film assigné" : total + " film" + (total > 1 ? "s" : "") + " assigné" + (total > 1 ? "s" : "")}`;
            const checkMark = assigned ? `<span class="av-assigned-check">✓</span>` : "";
            return `<div class="av-load-wrap ${assigned ? "is-assigned" : ""}" onclick="toggleFilmJury(${f.id}, ${u.id})" title="${tooltip}">
              ${checkMark}
              <img src="${u.avatar}" alt="${u.name}" style="box-shadow:${shadow};opacity:${opacity};" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='${opacity}'">
              <span class="av-load-badge ${badgeCls}">${badgeTxt}</span>
              <span class="av-load-name">${initials}</span>
            </div>`;
          }).join("");
        return `<div class="film-card${isAssigned ? " fc-jury-assigned" : ""}" style="--card-accent-color:${pal.accent}22;">
          <div class="film-card-accent" style="background:${pal.accent};opacity:0.7;"></div>
          <div class="film-thumb" onclick="playFilm(${f.id})" style="background:${pal.bg};">
            <video src="../assets/video.mp4" muted preload="none" id="vid-${f.id}"></video>
            <div class="film-num-bg">${String(f.id).padStart(3, "0")}</div>
            <div class="film-thumb-overlay">
              <div class="film-thumb-flag">${flags[f.country] || "🌐"}</div>
              <div class="play-btn">▶</div>
            </div>
            <div class="film-num-badge">#${String(f.id).padStart(3, "0")}</div>
          </div>
          <div class="film-body">
            <div class="film-title">${f.title}</div>
            <div class="film-meta">${f.author} · ${flags[f.country] || ""} ${f.country}</div>
            <div class="fc-avatars-row">${avatars}</div>
            ${
              nComments > 0
                ? `<button class="film-comments-btn" onclick="openCommentsModal(${f.id})">💬 ${nComments} commentaire${nComments > 1 ? "s" : ""}</button>`
                : `<button class="film-comments-btn no-comments" disabled>💬 Aucun commentaire</button>`
            }
          </div>
        </div>`;
      })
      .join("");
  }

  // Pagination
  const pag = document.getElementById("pagination");
  if (!pag) return;
  if (totalPages <= 1) {
    pag.innerHTML = "";
    return;
  }

  // Calcul des pages à afficher avec ellipses
  const delta = 2;
  const rangeSet = new Set();
  rangeSet.add(1);
  rangeSet.add(totalPages);
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  )
    rangeSet.add(i);
  const rangeArr = [...rangeSet].sort((a, b) => a - b);
  const pages = [];
  let prev = null;
  for (const p of rangeArr) {
    if (prev !== null && p - prev > 1) pages.push("…");
    pages.push(p);
    prev = p;
  }

  // Rendu
  let row = `<div class="pag-row">`;
  row += `<button class="page-btn page-nav" onclick="renderAssignView(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>← Préc.</button>`;
  for (const p of pages) {
    if (p === "…") {
      row += `<span class="page-dots">···</span>`;
    } else {
      row += `<button class="page-btn ${p === currentPage ? "active" : ""}" onclick="renderAssignView(${p})">${p}</button>`;
    }
  }
  row += `<button class="page-btn page-nav" onclick="renderAssignView(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>Suiv. →</button>`;
  row += `</div>`;

  const from = (currentPage - 1) * FILMS_PER_PAGE + 1;
  const to = Math.min(currentPage * FILMS_PER_PAGE, filmList.length);
  row += `<div class="pag-info">${from}–${to} sur ${filmList.length} films &nbsp;·&nbsp; page ${currentPage} / ${totalPages}</div>`;

  pag.innerHTML = row;
}

function playFilm(filmId) {
  openVideoModal(filmId);
}

/* ── VUES ── */
const views = [
  "users",
  "assign",
  "phases",
  "selection",
  "moderation",
  "awards",
  "site",
];
const titles = {
  users: [
    "Gestion des utilisateurs",
    "Jurys et modérateurs — accès par login/mot de passe ou Gmail",
  ],
  assign: ["Films soumis", "Visionnez et assignez chaque film au jury"],
  phases: ["Phases & Dates", "Définissez les dates des sessions jury"],
  selection: [
    "Sélection & Votes",
    "Votes, commentaires et signalements jury — tout en un seul endroit",
  ],
  moderation: ["Tickets", "Signalements créés par le jury"],
  awards: [
    "Awards & Sponsors",
    "Gérez les prix du festival et leurs sponsors associés",
  ],
  site: [
    "Administration du site",
    "Vidéo hero, informations et calendrier public",
  ],
};

function showView(name, el) {
  views.forEach(
    (v) => (document.getElementById("view-" + v).style.display = "none"),
  );
  document.getElementById("view-" + name).style.display = "block";
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  if (el) el.classList.add("active");
  document.getElementById("topbar-title").textContent = titles[name][0];
  document.getElementById("topbar-info").textContent = titles[name][1];
  if (name === "assign") renderAssignView();
  if (name === "site") {
    renderJuryAdmin();
    renderSponsorsAdmin();
  }
  if (name === "users") {
    renderVoteChart();
  }
  if (name === "selection") { renderPhasesStatus(); renderSelection(); }
  if (name === "moderation") renderKanban();
}

/* ── DRAPEAUX PAYS ── */
const flags = {
  France: "🇫🇷",
  Tunisie: "🇹🇳",
  Japon: "🇯🇵",
  Espagne: "🇪🇸",
  Inde: "🇮🇳",
  Sénégal: "🇸🇳",
  Suède: "🇸🇪",
  Chine: "🇨🇳",
  Allemagne: "🇩🇪",
  Nigeria: "🇳🇬",
  "Corée du Sud": "🇰🇷",
  Maroc: "🇲🇦",
  Russie: "🇷🇺",
  Italie: "🇮🇹",
  Ghana: "🇬🇭",
  Norvège: "🇳🇴",
  Algérie: "🇩🇿",
  Tchéquie: "🇨🇿",
  Égypte: "🇪🇬",
  Mexique: "🇲🇽",
  Turquie: "🇹🇷",
  Portugal: "🇵🇹",
  Kenya: "🇰🇪",
  Belgique: "🇧🇪",
  Brésil: "🇧🇷",
  Mali: "🇲🇱",
  Iran: "🇮🇷",
  Ukraine: "🇺🇦",
  "Burkina Faso": "🇧🇫",
  Croatie: "🇭🇷",
  Colombie: "🇨🇴",
  Tonga: "🇹🇴",
  Liban: "🇱🇧",
  Canada: "🇨🇦",
  Pakistan: "🇵🇰",
  Argentine: "🇦🇷",
};

/* ── RECHERCHE & FILTRE FILMS ── */
let filmSearchQuery = "";
let filmCountryFilters = []; // multi-sélection
let filmAssignFilter = "all"; // "all" | "unassigned" | "assigned"

function setAssignFilter(val) {
  filmAssignFilter = val;
  ["all", "unassigned", "assigned"].forEach((v) => {
    const btn = document.getElementById("afilter-" + v);
    if (btn) btn.classList.toggle("active", v === val);
  });
  currentPage = 1;
  renderAssignView();
}

function filterFilms(query) {
  filmSearchQuery = query.toLowerCase().trim();
  currentPage = 1;
  renderAssignView();
}

function toggleCountryDropdown() {
  const dd = document.getElementById("country-dropdown");
  const btn = document.getElementById("country-btn");
  const isOpen = dd.style.display !== "none";
  if (isOpen) {
    dd.style.display = "none";
    btn.classList.remove("open");
  } else {
    dd.style.display = "block";
    btn.classList.add("open");
    renderCountryDropdown("");
    const si = document.getElementById("country-search");
    si.value = "";
    setTimeout(() => si.focus(), 50);
  }
}

function renderCountryDropdown(query) {
  const q = (query || "").toLowerCase().trim();
  const countries = [...new Set(films.map((f) => f.country))].sort();
  const filtered = q
    ? countries.filter((c) => c.toLowerCase().includes(q))
    : countries;
  const list = document.getElementById("country-list");
  if (!filtered.length) {
    list.innerHTML =
      '<div style="padding:12px;text-align:center;font-size:0.78rem;color:var(--mist);">Aucun pays trouvé</div>';
    return;
  }
  list.innerHTML = filtered
    .map((c) => {
      const checked = filmCountryFilters.includes(c);
      return `<div class="country-check-item ${checked ? "checked" : ""}" onclick="toggleCountry('${c}')">
        <span class="ccheck ${checked ? "on" : ""}">✓</span>
        <span>${flags[c] || ""} ${c}</span>
      </div>`;
    })
    .join("");
}

function toggleCountry(country) {
  const idx = filmCountryFilters.indexOf(country);
  if (idx === -1) filmCountryFilters.push(country);
  else filmCountryFilters.splice(idx, 1);
  updateCountryBtn();
  renderCountryDropdown(document.getElementById("country-search").value);
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
  const btn = document.getElementById("country-btn");
  const label = document.getElementById("country-btn-label");
  const icon = document.getElementById("country-btn-icon");
  const resetBtn = document.getElementById("country-reset-btn");
  const n = filmCountryFilters.length;
  if (n === 0) {
    label.textContent = "Tous les pays";
    icon.textContent = "🌍";
    btn.classList.remove("has-filter");
    resetBtn.style.display = "none";
  } else if (n === 1) {
    label.textContent = filmCountryFilters[0];
    icon.textContent = flags[filmCountryFilters[0]] || "🌍";
    btn.classList.add("has-filter");
    resetBtn.style.display = "flex";
  } else {
    label.textContent = `${n} pays`;
    icon.textContent = "🌍";
    btn.classList.add("has-filter");
    resetBtn.style.display = "flex";
  }
}

function renderCountryFilters() {
  /* remplacé par dropdown */
}

/* ── RECHERCHE UTILISATEURS ── */
function filterUsers(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll("#user-tbody tr");
  let visible = 0;
  rows.forEach((row) => {
    const match = !q || row.textContent.toLowerCase().includes(q);
    row.style.display = match ? "" : "none";
    if (match) visible++;
  });
  let empty = document.getElementById("user-search-empty");
  if (!empty) {
    empty = document.createElement("div");
    empty.id = "user-search-empty";
    empty.style.cssText =
      "text-align:center;padding:24px;font-size:0.8rem;color:var(--mist);display:none;";
    empty.textContent = "Aucun utilisateur trouvé.";
    document.querySelector(".user-table-wrap").after(empty);
  }
  empty.style.display = visible === 0 && q ? "block" : "none";
}

/* ── ADMINISTRATION SITE ── */
function toggleSiteSection(id, header) {
  const body = document.getElementById(id);
  const chevron = header.querySelector(".site-chevron");
  const isOpen = body.style.display !== "none";
  body.style.display = isOpen ? "none" : "block";
  chevron.classList.toggle("open", !isOpen);
}

/* ── JURY EDITOR ── */
const defaultJuryData = [
  {
    id: 1,
    name: "Marie Lefebvre",
    label: "Présidente · Réalisatrice",
    avatar: "https://i.pravatar.cc/400?img=47",
    visible: true,
    quote:
      "Figure incontournable du cinéma d'auteur, trois fois primée au Festival de Cannes. Elle préside le jury marsAI 2026 avec l'ambition d'élever la création IA au rang d'art majeur.",
  },
  {
    id: 2,
    name: "Pierre Dubois",
    label: "Directeur artistique",
    avatar: "https://i.pravatar.cc/400?img=12",
    visible: true,
  },
  {
    id: 3,
    name: "Kenji Ito",
    label: "Artiste numérique",
    avatar: "https://i.pravatar.cc/400?img=68",
    visible: true,
  },
  {
    id: 4,
    name: "Sofia Eriksson",
    label: "Critique de cinéma",
    avatar: "https://i.pravatar.cc/400?img=44",
    visible: true,
  },
  {
    id: 7,
    name: "Amara Touré",
    label: "Productrice",
    avatar: "https://i.pravatar.cc/400?img=32",
    visible: true,
  },
  {
    id: 8,
    name: "Elena Petrov",
    label: "Compositrice",
    avatar: "https://i.pravatar.cc/400?img=29",
    visible: true,
  },
  {
    id: 9,
    name: "Yuki Nakamura",
    label: "Réalisatrice",
    avatar: "https://i.pravatar.cc/400?img=56",
    visible: true,
  },
  {
    id: 10,
    name: "Carlos Ruiz",
    label: "Chef opérateur",
    avatar: "https://i.pravatar.cc/400?img=18",
    visible: true,
  },
  {
    id: 11,
    name: "Priya Mehta",
    label: "Scénariste",
    avatar: "https://i.pravatar.cc/400?img=36",
    visible: true,
  },
  {
    id: 12,
    name: "Omar Diallo",
    label: "Directeur photo",
    avatar: "https://i.pravatar.cc/400?img=11",
    visible: true,
  },
];

let juryAdminData = [];

function loadJuryAdminData() {
  const saved = localStorage.getItem("marsai_jury_data");
  juryAdminData = saved
    ? JSON.parse(saved)
    : defaultJuryData.map((j) => ({ ...j }));
}

function renderJuryAdmin() {
  loadJuryAdminData();
  const list = document.getElementById("jury-admin-list");
  if (!list) return;
  list.innerHTML = juryAdminData
    .map(
      (j, idx) => `
      <div class="jury-admin-row" id="jar-${j.id}">
        <img class="jury-admin-photo" src="${j.avatar}" alt="${j.name}"
          onclick="editJuryPhoto(${j.id})" title="Cliquer pour changer la photo">
        <span class="jury-admin-star">${idx === 0 ? "⭐" : ""}</span>
        <div class="jury-admin-fields">
          <input class="jury-admin-input" id="jname-${j.id}" value="${j.name}" placeholder="Nom complet">
          <input class="jury-admin-input small" id="jlabel-${j.id}" value="${j.label}" placeholder="Rôle · Titre">
        </div>
        <div class="cal-toggle ${j.visible ? "on" : ""}" id="jvis-${j.id}"
          onclick="this.classList.toggle('on')" title="Visible sur la page d'accueil"></div>
        <button class="jury-admin-del" onclick="deleteJuryMember(${j.id})" title="Supprimer">🗑️</button>
      </div>`,
    )
    .join("");
}

// Alias pour la compatibilité avec showView
function renderJuryVisibility() {
  renderJuryAdmin();
}

function addJuryMember() {
  // Sauvegarder les modifications en cours avant d'ajouter
  collectJuryEdits();
  const newId = Date.now();
  const imgs = [
    3, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 26, 27,
    28, 30, 31, 33, 34, 35, 37, 38, 39, 40, 41, 42, 43, 45, 46, 48, 49, 50, 51,
    52, 53, 54, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 69, 70,
  ];
  const rnd = imgs[Math.floor(Math.random() * imgs.length)];
  juryAdminData.push({
    id: newId,
    name: "",
    label: "",
    avatar: `https://i.pravatar.cc/400?img=${rnd}`,
    visible: true,
  });
  renderJuryAdmin();
  setTimeout(() => document.getElementById("jname-" + newId)?.focus(), 40);
}

function deleteJuryMember(id) {
  if (juryAdminData.length <= 1) {
    showToast("Le jury doit avoir au moins un membre.", "err");
    return;
  }
  juryAdminData = juryAdminData.filter((j) => j.id !== id);
  renderJuryAdmin();
}

function editJuryPhoto(id) {
  const member = juryAdminData.find((j) => j.id === id);
  if (!member) return;
  const url = window.prompt(
    "URL de la photo (format portrait recommandé) :",
    member.avatar,
  );
  if (url !== null && url.trim()) {
    member.avatar = url.trim();
    renderJuryAdmin();
  }
}

function collectJuryEdits() {
  juryAdminData = juryAdminData.map((j) => ({
    ...j,
    name: document.getElementById("jname-" + j.id)?.value.trim() || j.name,
    label: document.getElementById("jlabel-" + j.id)?.value.trim() || j.label,
    visible:
      document.getElementById("jvis-" + j.id)?.classList.contains("on") ??
      j.visible,
  }));
}

function saveJuryAdmin() {
  collectJuryEdits();
  localStorage.setItem("marsai_jury_data", JSON.stringify(juryAdminData));
  showToast("✓ Jury mis à jour sur la page d'accueil", "ok");
  renderJuryAdmin(); // rafraîchir pour afficher ⭐ correctement
}

/* ── SPONSORS EDITOR ── */
const defaultSponsorsData = [
  {
    id: 1,
    name: "TechVision AI",
    tier: "principal",
    logo: "",
    url: "#",
    visible: true,
  },
  {
    id: 2,
    name: "Studio Lumière",
    tier: "partenaire",
    logo: "",
    url: "#",
    visible: true,
  },
  {
    id: 3,
    name: "CinéLab",
    tier: "partenaire",
    logo: "",
    url: "#",
    visible: true,
  },
  {
    id: 4,
    name: "DigitalCreators Hub",
    tier: "partenaire",
    logo: "",
    url: "#",
    visible: true,
  },
  {
    id: 5,
    name: "Région PACA",
    tier: "institutionnel",
    logo: "",
    url: "#",
    visible: true,
  },
  {
    id: 6,
    name: "Ville de Marseille",
    tier: "institutionnel",
    logo: "",
    url: "#",
    visible: true,
  },
  {
    id: 7,
    name: "Ministère de la Culture",
    tier: "institutionnel",
    logo: "",
    url: "#",
    visible: true,
  },
];

let sponsorsAdminData = [];

function loadSponsorsData() {
  const saved = localStorage.getItem("marsai_sponsors_data");
  sponsorsAdminData = saved
    ? JSON.parse(saved)
    : defaultSponsorsData.map((s) => ({ ...s }));
}

function renderSponsorsAdmin() {
  loadSponsorsData();
  const list = document.getElementById("sponsors-admin-list");
  if (!list) return;
  const tierLabels = {
    principal: "Principal",
    partenaire: "Partenaire",
    institutionnel: "Institutionnel",
  };
  list.innerHTML = sponsorsAdminData
    .map(
      (s) => `
      <div class="sponsor-admin-row" id="sar-${s.id}">
        <div class="sponsor-admin-preview" onclick="editSponsorLogo(${s.id})" title="Cliquer pour changer le logo">
          ${s.logo ? `<img src="${s.logo}" alt="${s.name}">` : "<span>Logo</span>"}
        </div>
        <div class="sponsor-admin-fields">
          <div class="sponsor-admin-top">
            <input class="jury-admin-input" id="sname-${s.id}" value="${s.name}" placeholder="Nom du sponsor" style="flex:1;">
            <select class="sponsor-admin-select" id="stier-${s.id}">
              <option value="principal"      ${s.tier === "principal" ? "selected" : ""}>Principal</option>
              <option value="partenaire"     ${s.tier === "partenaire" ? "selected" : ""}>Partenaire</option>
              <option value="institutionnel" ${s.tier === "institutionnel" ? "selected" : ""}>Institutionnel</option>
            </select>
          </div>
          <input class="jury-admin-input small" id="surl-${s.id}" value="${s.url === "#" ? "" : s.url}" placeholder="https://site-du-sponsor.fr">
        </div>
        <div class="cal-toggle ${s.visible ? "on" : ""}" id="svis-${s.id}"
          onclick="this.classList.toggle('on')" title="Visible sur la page d'accueil"></div>
        <button class="jury-admin-del" onclick="deleteSponsor(${s.id})" title="Supprimer">🗑️</button>
      </div>`,
    )
    .join("");
}

function addSponsor() {
  collectSponsorEdits();
  const newId = Date.now();
  sponsorsAdminData.push({
    id: newId,
    name: "",
    tier: "partenaire",
    logo: "",
    url: "",
    visible: true,
  });
  renderSponsorsAdmin();
  setTimeout(() => document.getElementById("sname-" + newId)?.focus(), 40);
}

function deleteSponsor(id) {
  sponsorsAdminData = sponsorsAdminData.filter((s) => s.id !== id);
  renderSponsorsAdmin();
}

function editSponsorLogo(id) {
  const s = sponsorsAdminData.find((x) => x.id === id);
  if (!s) return;
  const url = window.prompt(
    "URL du logo (PNG/SVG transparent recommandé) :",
    s.logo,
  );
  if (url !== null) {
    s.logo = url.trim();
    renderSponsorsAdmin();
  }
}

function collectSponsorEdits() {
  sponsorsAdminData = sponsorsAdminData.map((s) => ({
    ...s,
    name: document.getElementById("sname-" + s.id)?.value.trim() || s.name,
    tier: document.getElementById("stier-" + s.id)?.value || s.tier,
    url: document.getElementById("surl-" + s.id)?.value.trim() || "#",
    visible:
      document.getElementById("svis-" + s.id)?.classList.contains("on") ??
      s.visible,
  }));
}

function saveSponsorsAdmin() {
  collectSponsorEdits();
  localStorage.setItem(
    "marsai_sponsors_data",
    JSON.stringify(sponsorsAdminData),
  );
  showToast("✓ Sponsors mis à jour sur la page d'accueil", "ok");
  renderSponsorsAdmin();
}

function handleHeroVideo(input) {
  const file = input.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const preview = document.getElementById("sa-hero-video-preview");
  if (preview) {
    preview.src = url;
    preview.play().catch(() => {});
  }
  const badge = document.getElementById("sa-video-badge");
  if (badge) badge.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" fill="rgba(245,230,66,0.2)" stroke="#f5e642" stroke-width="1"/></svg> ${file.name} · En attente`;
  showToast("Vidéo chargée — cliquez sur Enregistrer", "warn");
}

function saPreviewFullscreen() {
  const vid = document.getElementById("sa-hero-video-preview");
  if (!vid) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    const stage = vid.closest(".sa-hero-stage");
    (stage.requestFullscreen || stage.webkitRequestFullscreen || stage.mozRequestFullScreen).call(stage);
  }
}

/* ── TOAST ── */
function showToast(msg, type = "ok") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove("show"), 3000);
}

/* ── FERMETURE DROPDOWN PAYS AU CLIC EXTÉRIEUR ── */
document.addEventListener("click", function (e) {
  const wrap = document.getElementById("country-filter-wrap");
  const dd = document.getElementById("country-dropdown");
  if (wrap && dd && !wrap.contains(e.target)) {
    dd.style.display = "none";
    document.getElementById("country-btn").classList.remove("open");
  }
});

/* ── DRAWER ASSIGNATION ── */
let drawerFilmId = null;
let drawerSearchQuery = "";

function openDrawer(filmId) {
  const f = films.find((x) => x.id === filmId);
  if (!f) return;
  drawerFilmId = filmId;
  drawerSearchQuery = "";
  document.getElementById("drawer-title").textContent = f.title;
  document.getElementById("drawer-sub").textContent =
    `${f.author} · ${flags[f.country] || ""} ${f.country}`;
  document.getElementById("drawer-search").value = "";
  const vid = document.getElementById("drawer-video");
  vid.pause();
  vid.currentTime = 0;
  vid.load();
  renderDrawerJury("");
  document.getElementById("film-drawer").classList.add("open");
  document.getElementById("drawer-overlay").classList.add("open");
}

function closeDrawer() {
  document.getElementById("film-drawer").classList.remove("open");
  document.getElementById("drawer-overlay").classList.remove("open");
  document.getElementById("drawer-video").pause();
}

function filterDrawerJury(query) {
  drawerSearchQuery = query.toLowerCase().trim();
  renderDrawerJury(drawerSearchQuery);
}

function renderDrawerJury(query) {
  const juryUsers = users.filter((u) => u.role === "jury" && u.active);
  const filtered = query
    ? juryUsers.filter((u) =>
        (u.name + " " + u.label).toLowerCase().includes(query),
      )
    : juryUsers;
  const nAssigned = juryUsers.filter((u) =>
    u.assigned.includes(drawerFilmId),
  ).length;
  document.getElementById("drawer-count").textContent =
    `${nAssigned} / ${juryUsers.length}`;
  const list = document.getElementById("drawer-jury-list");
  if (!filtered.length) {
    list.innerHTML =
      '<div style="text-align:center;padding:20px;font-size:0.8rem;color:var(--mist);">Aucun résultat</div>';
    return;
  }
  // Trier : assignés en premier
  const sorted = [...filtered].sort((a, b) => {
    const aA = a.assigned.includes(drawerFilmId) ? 0 : 1;
    const bA = b.assigned.includes(drawerFilmId) ? 0 : 1;
    return aA - bA;
  });
  list.innerHTML = sorted
    .map((u) => {
      const assigned = u.assigned.includes(drawerFilmId);
      return `<div class="dj-item ${assigned ? "assigned" : ""}" onclick="toggleDrawerJury(${u.id})">
        <img class="dj-avatar" src="${u.avatar}" alt="${u.name}">
        <div class="dj-info">
          <div class="dj-name">${u.name}</div>
          <div class="dj-role">${u.label}</div>
        </div>
        <div class="dj-check">${assigned ? "✓" : ""}</div>
      </div>`;
    })
    .join("");
}

function toggleDrawerJury(userId) {
  const u = users.find((x) => x.id === userId);
  const f = films.find((x) => x.id === drawerFilmId);
  if (!u || !f) return;
  const idx = u.assigned.indexOf(drawerFilmId);
  if (idx > -1) {
    u.assigned.splice(idx, 1);
    showToast(`${u.name.split(" ")[0]} retiré de "${f.title}"`, "warn");
  } else {
    u.assigned.push(drawerFilmId);
    showToast(`✓ ${u.name.split(" ")[0]} assigné à "${f.title}"`, "ok");
  }
  renderDrawerJury(drawerSearchQuery);
  renderAssignView();
  renderUsers();
}

/* ── MODALE COMMENTAIRES ── */
const decLabelAdmin = {
  valide: "Validé",
  aRevoir: "À revoir",
  refuse: "Refusé",
};
const decClsAdmin = {
  valide: "mcd-valide",
  aRevoir: "mcd-aRevoir",
  refuse: "mcd-refuse",
};

function openCommentsModal(filmId) {
  const f = films.find((x) => x.id === filmId);
  if (!f) return;
  const juryUsers = users.filter((u) => u.role === "jury" && u.active);

  document.getElementById("mc-film-title").textContent = f.title;
  document.getElementById("mc-film-sub").textContent =
    `${f.author} · ${flags[f.country] || ""} ${f.country}`;

  const comments = f.comments || {};
  const body = document.getElementById("mc-body");
  const entries = juryUsers.filter((u) => comments[u.id]);

  if (!entries.length) {
    body.innerHTML =
      '<div class="mc-empty">Aucun commentaire pour ce film.</div>';
  } else {
    body.innerHTML = entries
      .map((u) => {
        const dec = f.juryDec?.[u.id];
        const decHtml = dec
          ? `<span class="mc-dec ${decClsAdmin[dec]}">${decLabelAdmin[dec]}</span>`
          : "";
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
      })
      .join("");
  }

  document.getElementById("modal-comments").classList.add("open");
}

function closeCommentsModal() {
  document.getElementById("modal-comments").classList.remove("open");
}

/* ── RÉPARTITION ÉQUITABLE ── */
let repartirPlan = [];

function openRepartirModal() {
  const juryUsers = users.filter((u) => u.role === "jury" && u.active);
  if (juryUsers.length === 0) {
    showToast("Aucun jury actif pour la répartition", "err");
    return;
  }

  const unassigned = films.filter(
    (f) => !juryUsers.some((u) => u.assigned.includes(f.id)),
  );
  if (unassigned.length === 0) {
    showToast("Tous les films sont déjà assignés", "warn");
    return;
  }

  // Répartition round-robin équitable
  repartirPlan = juryUsers.map((u) => ({ userId: u.id, newFilmIds: [] }));
  unassigned.forEach((f, i) => {
    repartirPlan[i % juryUsers.length].newFilmIds.push(f.id);
  });

  // Rendu aperçu
  const maxTotal = Math.max(...repartirPlan.map((p) => {
    const u = users.find((x) => x.id === p.userId);
    return u.assigned.length + p.newFilmIds.length;
  }), 1);

  const preview = document.getElementById("repartir-preview");
  preview.innerHTML = repartirPlan
    .map((plan) => {
      const u = users.find((x) => x.id === plan.userId);
      const current = u.assigned.length;
      const added = plan.newFilmIds.length;
      const total = current + added;
      const barPct = Math.round((total / maxTotal) * 100);
      return `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;">
        <img src="${u.avatar}" alt="${u.name}" style="width:38px;height:38px;border-radius:10px;object-fit:cover;flex-shrink:0;box-shadow:0 0 0 2px #4effce,0 0 10px rgba(78,255,206,0.25);">
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
            <span style="font-size:0.82rem;font-weight:700;color:var(--white-soft);">${u.name}</span>
            <span style="font-family:var(--font-mono);font-size:0.82rem;font-weight:800;color:#4effce;">${total} films</span>
          </div>
          <div style="height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden;">
            <div style="height:100%;width:${barPct}%;background:linear-gradient(90deg,#4effce,#a8ffec);border-radius:2px;transition:width 0.4s ease;"></div>
          </div>
          <div style="font-size:0.68rem;color:var(--mist);margin-top:4px;">${current > 0 ? `${current} déjà assigné${current>1?"s":""} · ` : ""}+${added} nouveau${added>1?"x":""}</div>
        </div>
      </div>`;
    })
    .join("");

  document.getElementById("repartir-sub").textContent =
    `${unassigned.length} film${unassigned.length > 1 ? "s" : ""} à répartir entre ${juryUsers.length} jurés`;

  const perJury = Math.floor(unassigned.length / juryUsers.length);
  const extra = unassigned.length % juryUsers.length;
  document.getElementById("repartir-summary").innerHTML =
    `⚡ ${unassigned.length} films répartis — environ <strong>${perJury}${extra > 0 ? "–" + (perJury + 1) : ""} films</strong> par juré`;

  document.getElementById("modal-repartir").classList.add("open");
}

function applyRepartition() {
  if (!repartirPlan.length) return;
  let total = 0;
  repartirPlan.forEach((plan) => {
    const u = users.find((x) => x.id === plan.userId);
    if (!u) return;
    plan.newFilmIds.forEach((fid) => {
      if (!u.assigned.includes(fid)) {
        u.assigned.push(fid);
        total++;
      }
    });
  });
  closeModal("repartir");
  repartirPlan = [];
  renderAssignView();
  renderUsers();
  showToast(
    `✓ ${total} film${total > 1 ? "s" : ""} répartis équitablement`,
    "ok",
  );
}

/* ── GRAPHIQUE PARTICIPATION (anneaux avatar) ── */
function renderVoteChart() {
  const container = document.getElementById("vote-chart-bars");
  if (!container) return;

  const juryUsers = users.filter((u) => u.role === "jury" && u.active);
  const evaluatedFilms = films.filter(
    (f) => f.juryDec && Object.keys(f.juryDec).length > 0,
  );

  const rows = juryUsers.map((u) => {
    const myFilms = evaluatedFilms.filter((f) => String(u.id) in f.juryDec);
    const voted = myFilms.filter((f) => f.juryDec[u.id] !== null).length;
    const total = myFilms.length;
    return {
      u,
      voted,
      total,
      pct: total > 0 ? Math.round((voted / total) * 100) : 0,
    };
  });

  // SVG ring helper
  const R = 44,
    STROKE = 5,
    CX = 50,
    CY = 50;
  const circ = 2 * Math.PI * R;

  function ring(pct) {
    const done = (pct / 100) * circ;
    const left = circ - done;
    // couleur : vert si ≥80%, orange si ≥50%, rouge sinon
    const color = pct >= 80 ? "#4EFFCE" : pct >= 50 ? "#F5E642" : "#FF6B6B";
    const glowId = `glow-${Math.random().toString(36).slice(2, 7)}`;
    return `<svg viewBox="0 0 100 100" class="vcr-ring" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="${glowId}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="clip-${glowId}"><circle cx="${CX}" cy="${CY}" r="${R - STROKE / 2}"/></clipPath>
      </defs>
      <!-- fond anneau -->
      <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${STROKE}"/>
      <!-- arc progression -->
      <circle cx="${CX}" cy="${CY}" r="${R}" fill="none"
        stroke="${color}" stroke-width="${STROKE}"
        stroke-dasharray="${done} ${left}"
        stroke-dashoffset="${circ / 4}"
        stroke-linecap="round"
        filter="url(#${glowId})"/>
    </svg>`;
  }

  container.innerHTML = `<div class="vcr-grid">${rows
    .map((r) => {
      const statusColor =
        r.pct >= 80
          ? "var(--aurora)"
          : r.pct >= 50
            ? "var(--solar)"
            : "var(--coral)";
      const statusLabel =
        r.total === 0
          ? "—"
          : r.pct === 100
            ? "✓ Complet"
            : r.voted === 0
              ? "Pas commencé"
              : `${r.pct}%`;

      return `<div class="vcr-card">
      <div class="vcr-ring-wrap">
        ${ring(r.pct)}
        <img class="vcr-face" src="${r.u.avatar}" alt="${r.u.name}">
        <div class="vcr-pct" style="color:${statusColor};">${r.total > 0 ? r.pct + "%" : "—"}</div>
      </div>
      <div class="vcr-card-name">${r.u.name}</div>
      <div class="vcr-card-label" style="color:var(--mist);">${r.u.label || ""}</div>
      <div class="vcr-card-stat" style="color:${statusColor};">${statusLabel}</div>
      <div class="vcr-card-count">${r.voted} / ${r.total} films</div>
    </div>`;
    })
    .join("")}</div>`;
}

/* ── GRAPHIQUE RÉPARTITION JURY ── */
let chartAnimProgress = 0;
let chartAnimId = null;
let chartBarRects = []; // pour le hover

function renderJuryChart() {
  const canvas = document.getElementById("jury-chart");
  if (!canvas) return;
  const wrap = canvas.parentElement;
  const ctx = canvas.getContext("2d");

  const juryUsers = users.filter((u) => u.role === "jury" && u.active);
  if (!juryUsers.length) {
    canvas.style.display = "none";
    return;
  }
  canvas.style.display = "block";

  // Tri par nombre de films (décroissant)
  const sorted = [...juryUsers].sort(
    (a, b) => b.assigned.length - a.assigned.length,
  );
  const maxVal = Math.max(...sorted.map((u) => u.assigned.length), 1);

  // Dimensions
  const dpr = window.devicePixelRatio || 1;
  const labelW = 150;
  const barH = 28;
  const gap = 10;
  const rightPad = 48;
  const totalH = sorted.length * (barH + gap) + 10;
  const rectW = wrap.clientWidth;

  canvas.width = rectW * dpr;
  canvas.height = totalH * dpr;
  canvas.style.height = totalH + "px";
  ctx.scale(dpr, dpr);

  const barAreaW = rectW - labelW - rightPad;
  chartBarRects = [];

  ctx.clearRect(0, 0, rectW, totalH);

  // Style helpers
  const colors = {
    ok: { bar: "#4EFFCE", glow: "rgba(78,255,206,0.18)", text: "#4EFFCE" },
    warn: { bar: "#F5E642", glow: "rgba(245,230,66,0.15)", text: "#F5E642" },
    danger: { bar: "#FF6B6B", glow: "rgba(255,107,107,0.15)", text: "#FF6B6B" },
  };
  function getLevel(n) {
    return n <= 10 ? "ok" : n <= 15 ? "warn" : "danger";
  }

  sorted.forEach((u, i) => {
    const y = i * (barH + gap) + 5;
    const n = u.assigned.length;
    const lvl = getLevel(n);
    const col = colors[lvl];

    // First name + first letter of last name
    const parts = u.name.split(" ");
    const short =
      parts.length > 1
        ? parts[0] +
          " " +
          parts
            .slice(1)
            .map((p) => p[0] + ".")
            .join(" ")
        : parts[0];

    // Label
    ctx.font = "600 12px Inter, sans-serif";
    ctx.fillStyle = "#8892B0";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.fillText(short, labelW - 14, y + barH / 2);

    // Background track
    ctx.beginPath();
    const trackR = 6;
    ctx.roundRect(labelW, y, barAreaW, barH, trackR);
    ctx.fillStyle = "rgba(255,255,255,0.025)";
    ctx.fill();

    // Gridlines at intervals of 5
    for (let g = 5; g <= maxVal; g += 5) {
      const gx = labelW + (g / maxVal) * barAreaW;
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx, y + barH);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Animated bar
    const rawW = (n / maxVal) * barAreaW;
    const animW = rawW * chartAnimProgress;

    if (animW > 2) {
      // Gradient bar
      const grad = ctx.createLinearGradient(labelW, 0, labelW + animW, 0);
      if (lvl === "ok") {
        grad.addColorStop(0, "rgba(78,255,206,0.15)");
        grad.addColorStop(1, "rgba(78,255,206,0.45)");
      } else if (lvl === "warn") {
        grad.addColorStop(0, "rgba(245,230,66,0.12)");
        grad.addColorStop(1, "rgba(245,230,66,0.4)");
      } else {
        grad.addColorStop(0, "rgba(255,107,107,0.15)");
        grad.addColorStop(1, "rgba(255,107,107,0.5)");
      }

      ctx.beginPath();
      ctx.roundRect(labelW, y, animW, barH, trackR);
      ctx.fillStyle = grad;
      ctx.fill();

      // Glow edge
      ctx.beginPath();
      ctx.roundRect(labelW + animW - 3, y + 2, 3, barH - 4, 2);
      ctx.fillStyle = col.bar;
      ctx.fill();

      // Subtle top border
      ctx.beginPath();
      ctx.roundRect(labelW, y, animW, barH, trackR);
      ctx.strokeStyle = col.glow;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Count badge
    if (chartAnimProgress > 0.3) {
      const countX = labelW + animW + 10;
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillStyle = col.text;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = Math.min(1, (chartAnimProgress - 0.3) / 0.3);
      ctx.fillText(String(n), countX, y + barH / 2);
      ctx.globalAlpha = 1;
    }

    // Store bar hit area
    chartBarRects.push({
      x: labelW,
      y,
      w: barAreaW,
      h: barH,
      user: u,
      count: n,
      level: lvl,
    });
  });

  // Footer stats
  const footer = document.getElementById("chart-footer");
  if (footer) {
    const totalFilms = films.length;
    const assigned = films.filter((f) =>
      sorted.some((u) => u.assigned.includes(f.id)),
    ).length;
    const avg = sorted.length
      ? (
          sorted.reduce((s, u) => s + u.assigned.length, 0) / sorted.length
        ).toFixed(1)
      : 0;
    footer.innerHTML = `
        <span class="cf-stat aurora">📊 <strong>${assigned}</strong> / ${totalFilms} films assignés</span>
        <span class="cf-stat solar">👤 <strong>${sorted.length}</strong> jurés actifs</span>
        <span class="cf-stat lavande">⚖️ Moyenne : <strong>${avg}</strong> films / juré</span>`;
  }
}

// ── Chart Animation ──
function animateChart() {
  if (chartAnimId) cancelAnimationFrame(chartAnimId);
  chartAnimProgress = 0;
  const start = performance.now();
  const dur = 800;
  function tick(now) {
    const t = Math.min(1, (now - start) / dur);
    // Ease out cubic
    chartAnimProgress = 1 - Math.pow(1 - t, 3);
    renderJuryChart();
    if (t < 1) chartAnimId = requestAnimationFrame(tick);
  }
  chartAnimId = requestAnimationFrame(tick);
}

// ── Chart Hover ──
(function setupChartHover() {
  const canvas = document.getElementById("jury-chart");
  const tooltip = document.getElementById("chart-tooltip");
  if (!canvas || !tooltip) return;

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let hit = null;
    for (const bar of chartBarRects) {
      if (
        mx >= bar.x &&
        mx <= bar.x + bar.w &&
        my >= bar.y &&
        my <= bar.y + bar.h
      ) {
        hit = bar;
        break;
      }
    }
    if (hit) {
      const pct =
        films.length > 0 ? ((hit.count / films.length) * 100).toFixed(1) : 0;
      const loadLabel =
        hit.level === "ok"
          ? "✅ Charge normale"
          : hit.level === "warn"
            ? "⚠️ Charge élevée"
            : "🔴 Surchargé";
      tooltip.innerHTML = `
          <div class="ct-name">${hit.user.name}</div>
          <div class="ct-count" style="color:${hit.level === "ok" ? "var(--aurora)" : hit.level === "warn" ? "var(--solar)" : "var(--coral)"}">
            ${hit.count} film${hit.count > 1 ? "s" : ""} assigné${hit.count > 1 ? "s" : ""} · ${pct}%
          </div>
          <div style="font-size:0.68rem;color:var(--mist);margin-top:2px;">${loadLabel}</div>`;
      const tx = Math.min(e.clientX - rect.left + 12, canvas.clientWidth - 200);
      const ty = e.clientY - rect.top - 70;
      tooltip.style.left = tx + "px";
      tooltip.style.top = ty + "px";
      tooltip.classList.add("visible");
      canvas.style.cursor = "pointer";
    } else {
      tooltip.classList.remove("visible");
      canvas.style.cursor = "default";
    }
  });

  canvas.addEventListener("mouseleave", () => {
    tooltip.classList.remove("visible");
    canvas.style.cursor = "default";
  });
})();

/* ── PHASES CONFIG ── */
const phasesConfig = {
  p1: { open: "2026-12-12", close: "2026-12-19", saved: false },
  p2: { open: "2026-12-22", close: "2026-12-28", saved: false },
};

function getPhaseStatus(open, close) {
  const today = new Date().toISOString().slice(0, 10);
  if (today < open) return "upcoming";
  if (today >= open && today <= close) return "active";
  return "closed";
}
function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}
function daysLeft(d) {
  const today = new Date().toISOString().slice(0, 10);
  return Math.ceil((new Date(d) - new Date(today)) / 86400000);
}

function savePhase(n) {
  const sel50 = getAdmSelCount();
  const sel5  = getFinalCount();
  if (n === 1 && sel50 < 50) {
    showToast(`🔒 Sélectionnez les ${50 - sel50} film${50 - sel50 > 1 ? "s" : ""} manquant${50 - sel50 > 1 ? "s" : ""} dans Sélection & Votes avant de confirmer la Phase 1`, "warn");
    return;
  }
  if (n === 2 && sel50 < 50) {
    showToast("🔒 La Phase 1 doit être complète (50 films) avant de configurer la Phase 2", "warn");
    return;
  }
  if (n === 2 && sel5 < 5) {
    showToast(`🔒 Désignez les ${5 - sel5} finaliste${5 - sel5 > 1 ? "s" : ""} manquant${5 - sel5 > 1 ? "s" : ""} dans Sélection & Votes avant de confirmer la Phase 2`, "warn");
    return;
  }
  const key = "p" + n;
  phasesConfig[key].open = document.getElementById(`p${n}-open`).value;
  phasesConfig[key].close = document.getElementById(`p${n}-close`).value;
  if (!phasesConfig[key].open || !phasesConfig[key].close) {
    showToast("Veuillez renseigner les deux dates", "err");
    return;
  }
  if (phasesConfig[key].open >= phasesConfig[key].close) {
    showToast("La date de clôture doit être après l'ouverture", "err");
    return;
  }
  phasesConfig[key].saved = true;
  const label = n === 1 ? "Phase 1 · Présélection Top 50" : "Phase 2 · Finale Top 5";
  showToast(`✓ ${label} sauvegardée`, "ok");
  renderPhasesStatus();
}

function renderPhasesStatus() {
  const sel50 = getAdmSelCount();
  const sel5  = getFinalCount();
  const p1Done = sel50 >= 50;
  const p2Done = sel5 >= 5;

  const fmt = fmtDate;
  const statusCfg = {
    active:   { label: "● Actif",    bg: "rgba(78,255,206,0.12)",  color: "var(--aurora)",  border: "rgba(78,255,206,0.3)" },
    upcoming: { label: "◷ À venir",  bg: "rgba(245,200,66,0.1)",   color: "var(--solar)",   border: "rgba(245,200,66,0.25)" },
    closed:   { label: "✓ Terminé",  bg: "rgba(255,255,255,0.05)", color: "var(--mist)",    border: "rgba(255,255,255,0.1)" },
  };

  ["1", "2"].forEach((n) => {
    const cfg = phasesConfig["p" + n];
    if (!cfg.saved) return;
    const st = getPhaseStatus(cfg.open, cfg.close);
    const s = statusCfg[st];
    const badge = document.getElementById(`p${n}-status-badge`);
    if (badge) {
      badge.style.display = "block";
      badge.style.background = s.bg;
      badge.style.color = s.color;
      badge.style.border = `1px solid ${s.border}`;
      badge.textContent = `${s.label} · ${fmtDate(cfg.open)} → ${fmtDate(cfg.close)}`;
    }
  });

  // ── Barre de progression Phase 1 (50 films) ──
  const p1Bar = document.getElementById("p1-progress-fill");
  const p1Counter = document.getElementById("p1-progress-counter");
  const p1Msg = document.getElementById("p1-progress-msg");
  if (p1Bar) p1Bar.style.width = Math.min((sel50 / 50) * 100, 100) + "%";
  if (p1Counter) {
    p1Counter.innerHTML = `<span style="font-weight:800;color:${p1Done ? "var(--aurora)" : "var(--snow)"};">${sel50}</span><span style="color:var(--mist);"> / 50</span>`;
  }
  if (p1Msg) {
    p1Msg.textContent = p1Done ? "✓ Sélection complète" : `Il manque ${50 - sel50} film${50 - sel50 > 1 ? "s" : ""}`;
    p1Msg.style.color = p1Done ? "var(--aurora)" : "var(--solar)";
  }

  // ── Barre de progression Phase 2 (5 finalistes) ──
  const p2Bar = document.getElementById("p2-progress-fill");
  const p2Counter = document.getElementById("p2-progress-counter");
  const p2Msg = document.getElementById("p2-progress-msg");
  if (p2Bar) p2Bar.style.width = Math.min((sel5 / 5) * 100, 100) + "%";
  if (p2Counter) {
    p2Counter.innerHTML = `<span style="font-weight:800;color:${p2Done ? "var(--lavande)" : "var(--snow)"};">${sel5}</span><span style="color:var(--mist);"> / 5</span>`;
  }
  if (p2Msg) {
    p2Msg.textContent = p2Done ? "✓ Finalistes confirmés" : `Il manque ${5 - sel5} finaliste${5 - sel5 > 1 ? "s" : ""}`;
    p2Msg.style.color = p2Done ? "var(--lavande)" : "var(--solar)";
  }

  // ── Bouton Phase 1 : grisé si < 50 films ──
  const p1Btn = document.getElementById("p1-save-btn");
  const p1LockMsg = document.getElementById("p1-lock-msg");
  if (p1Btn) {
    if (p1Done) {
      p1Btn.disabled = false;
      p1Btn.style.opacity = "1";
      p1Btn.style.cursor  = "pointer";
      p1Btn.textContent   = "Confirmer la Phase 1 →";
      if (p1LockMsg) p1LockMsg.style.display = "none";
    } else {
      p1Btn.disabled = true;
      p1Btn.style.opacity = "0.35";
      p1Btn.style.cursor  = "not-allowed";
      p1Btn.textContent   = "🔒 Confirmer la Phase 1";
      if (p1LockMsg) { p1LockMsg.style.display = "block"; p1LockMsg.textContent = `Sélectionnez ${50 - sel50} film${50 - sel50 > 1 ? "s" : ""} supplémentaire${50 - sel50 > 1 ? "s" : ""} dans Sélection & Votes`; }
    }
  }

  // ── Bouton Phase 2 : grisé si < 50 films ou < 5 finalistes ──
  const lockMsg = document.getElementById("p2-lock-msg");
  const saveBtn = document.getElementById("p2-save-btn");
  const p2Ready = p1Done && p2Done;
  if (saveBtn) {
    if (p2Ready) {
      saveBtn.disabled = false;
      saveBtn.style.opacity = "1";
      saveBtn.style.cursor  = "pointer";
      saveBtn.textContent   = "Confirmer la Phase 2 →";
    } else {
      saveBtn.disabled = true;
      saveBtn.style.opacity = "0.35";
      saveBtn.style.cursor  = "not-allowed";
      saveBtn.textContent   = "🔒 Confirmer la Phase 2";
    }
  }
  if (lockMsg) {
    if (!p1Done) {
      lockMsg.style.display   = "block";
      lockMsg.textContent     = `🔒 Sélectionnez d'abord les ${50 - sel50} film${50 - sel50 > 1 ? "s" : ""} manquant${50 - sel50 > 1 ? "s" : ""} en Phase 1`;
    } else if (!p2Done) {
      lockMsg.style.display   = "block";
      lockMsg.textContent     = `🔒 Désignez ${5 - sel5} finaliste${5 - sel5 > 1 ? "s" : ""} manquant${5 - sel5 > 1 ? "s" : ""} dans Sélection & Votes → Top 5`;
    } else {
      lockMsg.style.display   = "none";
    }
  }

  // Phase 2 info text
  const p2Info = document.getElementById("p2-info-text");
  if (p2Info) {
    p2Info.textContent = p1Done
      ? `🏆 Désignez 5 finalistes parmi vos ${sel50} films sélectionnés`
      : `🔒 Disponible après la sélection des 50 films`;
    document.getElementById("p2-info").style.color = p1Done ? "var(--lavande)" : "var(--mist)";
  }

  // Timeline visuelle
  const activeBadge = document.getElementById("phase-active-badge");
  const p1St = phasesConfig.p1.saved ? getPhaseStatus(phasesConfig.p1.open, phasesConfig.p1.close) : null;
  const p2St = phasesConfig.p2.saved ? getPhaseStatus(phasesConfig.p2.open, phasesConfig.p2.close) : null;

  // Badge phase active (header)
  if (activeBadge) {
    if (p1St === "active") {
      activeBadge.textContent = "● Phase 1 active — Présélection Top 50";
      activeBadge.style.cssText = "font-size:0.75rem;font-weight:700;padding:6px 18px;border-radius:999px;background:rgba(78,255,206,0.12);color:var(--aurora);border:1px solid rgba(78,255,206,0.3);white-space:nowrap;";
    } else if (p2St === "active") {
      activeBadge.textContent = "● Phase 2 active — Finale Top 5";
      activeBadge.style.cssText = "font-size:0.75rem;font-weight:700;padding:6px 18px;border-radius:999px;background:rgba(192,132,252,0.12);color:var(--lavande);border:1px solid rgba(192,132,252,0.3);white-space:nowrap;";
    } else {
      activeBadge.textContent = "Aucune phase active";
      activeBadge.style.cssText = "font-size:0.75rem;font-weight:700;padding:6px 18px;border-radius:999px;background:rgba(255,255,255,0.06);color:var(--mist);border:1px solid rgba(255,255,255,0.1);white-space:nowrap;";
    }
  }

  // Nœuds timeline
  const node1 = document.getElementById("tl-node-1");
  const node2 = document.getElementById("tl-node-2");
  const label2 = document.getElementById("tl-label-2");
  const line1 = document.getElementById("tl-line-fill");
  const line2 = document.getElementById("tl-line-fill-2");

  if (node1) {
    node1.classList.remove("tl-node-active");
    if (p1St === "active") {
      node1.style.background = "rgba(78,255,206,0.2)";
      node1.style.borderColor = "var(--aurora)";
      node1.style.boxShadow = "0 0 16px rgba(78,255,206,0.3)";
      node1.classList.add("tl-node-active");
    } else if (p1St === "closed") {
      node1.style.background = "rgba(78,255,206,0.08)";
      node1.style.borderColor = "rgba(78,255,206,0.3)";
      node1.style.boxShadow = "none";
    }
    if (line1) line1.style.width = (p1St === "closed" || p1St === "active") ? "100%" : "0%";
  }

  if (node2 && label2) {
    const p2Ready = sel50 >= 50;
    node2.style.opacity = p2Ready ? "1" : "0.4";
    label2.style.opacity = p2Ready ? "1" : "0.4";
    node2.classList.remove("tl-node-active");
    if (p2St === "active") {
      node2.style.background = "rgba(192,132,252,0.2)";
      node2.style.borderColor = "var(--lavande)";
      node2.style.boxShadow = "0 0 16px rgba(192,132,252,0.3)";
      node2.classList.add("tl-node-active");
    }
    if (line2) line2.style.width = (p2St === "active" || p2St === "closed") ? "100%" : "0%";
  }

  // Dates dans la timeline
  const tlDate1 = document.getElementById("tl-date-1");
  const tlDate2 = document.getElementById("tl-date-2");
  if (tlDate1 && phasesConfig.p1.saved) tlDate1.textContent = `${fmtDate(phasesConfig.p1.open)} → ${fmtDate(phasesConfig.p1.close)}`;
  if (tlDate2 && phasesConfig.p2.saved) tlDate2.textContent = `${fmtDate(phasesConfig.p2.open)} → ${fmtDate(phasesConfig.p2.close)}`;
}

/* ── INIT ── */
renderUsers();
animateChart();
const brmCount = document.getElementById("brm-count");
if (brmCount) brmCount.textContent = films.length;

/* ══════════════════════════════════════════
   SÉLECTION & MODÉRATION — Vue unifiée
   ══════════════════════════════════════════ */
let selFilter = "tous";
let selSort = "score";
// ── Phase 1 : admin seul sélectionne les 50 films ──
// ── Phase 2 : admin + jury votent collectivement pour le Top 5 ──
const FINALIST_THRESHOLD = Math.ceil(5 / 2); // 3 — majorité (admin + 4 jurés)

const adminSelected = new Set(); // Top 50 — admin seul (Set<filmId>)
const finalistVotes = {};        // Top 5  — collectif (filmId → Set<voterId>)

function isInTop50(filmId) { return adminSelected.has(filmId); }
function isInTop5(filmId)  { return (finalistVotes[filmId]?.size || 0) >= FINALIST_THRESHOLD; }
function getAdmSelCount()  { return adminSelected.size; }
function getFinalCount()   { return films.filter(f => isInTop5(f.id)).length; }

function saveVotes() {
  const fv = {};
  for (const [id, s] of Object.entries(finalistVotes)) fv[id] = Array.from(s);
  localStorage.setItem("marsai_adminSelected", JSON.stringify([...adminSelected]));
  localStorage.setItem("marsai_finalistVotes", JSON.stringify(fv));
}
function loadVotes() {
  try {
    const sel = JSON.parse(localStorage.getItem("marsai_adminSelected") || "[]");
    sel.forEach(id => adminSelected.add(id));
    const fv = JSON.parse(localStorage.getItem("marsai_finalistVotes") || "{}");
    for (const [id, a] of Object.entries(fv)) finalistVotes[id] = new Set(a);
  } catch(e) {}
}
loadVotes();

// Tickets data (previously in Modération view)
const filmTickets = {
  1: [
    {
      id: "TK-001",
      type: "🎵 Droits musicaux",
      reporter: "Jury — Marie L.",
      desc: "Musique de fond potentiellement sous copyright.",
      status: "attente",
      date: "2026-11-18",
    },
  ],
  3: [
    {
      id: "TK-003",
      type: "▶ YouTube rejeté",
      reporter: "Système",
      desc: "Vidéo non accessible, lien YouTube invalide.",
      status: "attente",
      date: "2026-11-21",
    },
  ],
  4: [
    {
      id: "TK-004",
      type: "📋 Lisibilité",
      reporter: "Jury — Thomas R.",
      desc: "Sous-titres illisibles sur fond clair.",
      status: "en_cours",
      date: "2026-11-22",
    },
  ],
  6: [
    {
      id: "TK-002",
      type: "🎵 Droits musicaux",
      reporter: "Admin",
      desc: "Vérification droits en cours.",
      status: "en_cours",
      date: "2026-11-20",
    },
  ],
  7: [
    {
      id: "TK-005",
      type: "↩ Révision demandée",
      reporter: "Jury — Marie L.",
      desc: "Fin du film tronquée, demande de resubmission.",
      status: "attente",
      date: "2026-11-23",
    },
  ],
};

function getFilmConsensus(f) {
  if (!f.juryDec)
    return {
      type: "attente",
      label: "⏳ En attente",
      cls: "sel-attente",
      score: 0,
      valide: 0,
      refuse: 0,
      aRevoir: 0,
      pending: 0,
    };
  const decs = Object.values(f.juryDec);
  const valide = decs.filter((d) => d === "valide").length;
  const refuse = decs.filter((d) => d === "refuse").length;
  const aRevoir = decs.filter((d) => d === "aRevoir").length;
  const pending = decs.filter((d) => d === null || d === undefined).length;
  const total = decs.length;
  const voted = total - pending;

  if (voted === 0)
    return {
      type: "attente",
      label: "⏳ En attente",
      cls: "sel-attente",
      score: 0,
      valide,
      refuse,
      aRevoir,
      pending,
    };

  const score = (valide * 2 + aRevoir * 0.5 - refuse * 1.5) / voted;

  if (valide === voted)
    return {
      type: "unanime",
      label: "✅ Unanime",
      cls: "sel-unanime",
      score,
      valide,
      refuse,
      aRevoir,
      pending,
    };
  if (valide > voted / 2)
    return {
      type: "unanime",
      label: "✅ Majorité",
      cls: "sel-unanime",
      score,
      valide,
      refuse,
      aRevoir,
      pending,
    };
  if (refuse > voted / 2)
    return {
      type: "rejete",
      label: "❌ Rejeté",
      cls: "sel-rejete",
      score,
      valide,
      refuse,
      aRevoir,
      pending,
    };
  return {
    type: "partage",
    label: "⚠️ Partagé",
    cls: "sel-partage",
    score,
    valide,
    refuse,
    aRevoir,
    pending,
  };
}

function filterSelection(filter, btn) {
  selFilter = filter;
  document
    .querySelectorAll(".sel-filter")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderSelection();
}

function sortSelection(sort, btn) {
  selSort = sort;
  document
    .querySelectorAll(".sel-sort")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderSelection();
}

function selActTicket(tkId, action) {
  const t = ticketsData.find((x) => x.id === tkId);
  if (!t) return;
  t.status = "resolu";
  if (action === "revision")
    showToast(`↩ Révision demandée au réalisateur de "${t.film}"`, "warn");
  else if (action === "refuse")
    showToast(`✕ Film "${t.film}" refusé · Réalisateur notifié`, "err");
  else showToast(`↓ ${tkId} classé — film conservé`, "ok");
  renderSelection();
}

function adminDecide(filmId, decision) {
  if (decision === "valide") {
    if (adminSelected.has(filmId)) {
      adminSelected.delete(filmId);
      delete finalistVotes[filmId]; // Si film quitte Top 50, retirer des finalistes
      showToast(`Film #${filmId} retiré de la sélection`, "err");
    } else {
      adminSelected.add(filmId);
      showToast(`✓ Film #${filmId} ajouté au Top 50`, "ok");
    }
  }
  saveVotes();
  renderSelection();
  renderPhasesStatus();
}

function toggleFinalist(filmId) {
  if (!isInTop50(filmId)) {
    showToast("⚠️ Ce film n'est pas dans le Top 50", "warn");
    return;
  }
  const ADMIN_ID = 0;
  if (!finalistVotes[filmId]) finalistVotes[filmId] = new Set();
  if (finalistVotes[filmId].has(ADMIN_ID)) {
    finalistVotes[filmId].delete(ADMIN_ID);
    showToast(`Film #${filmId} — vote Top 5 retiré`, "err");
  } else {
    const myVotes = films.filter(f => finalistVotes[f.id]?.has(ADMIN_ID)).length;
    if (myVotes >= 5) { showToast("⚠️ Vous avez déjà voté pour 5 finalistes", "warn"); return; }
    finalistVotes[filmId].add(ADMIN_ID);
    showToast(`🏆 Film #${filmId} — vote Top 5 enregistré`, "ok");
  }
  saveVotes();
  renderSelection();
  renderPhasesStatus();
}

function toggleSelDetail(filmId) {
  const row = document.getElementById("sel-detail-" + filmId);
  if (row)
    row.style.display = row.style.display === "none" ? "table-row" : "none";
}

function renderSelection() {
  const searchQ = (document.getElementById("sel-search")?.value || "")
    .toLowerCase()
    .trim();
  const evaluated = films.filter(
    (f) => f.juryDec && Object.keys(f.juryDec).length > 0,
  );
  const enriched = evaluated.map((f) => ({
    ...f,
    consensus: getFilmConsensus(f),
    tickets: ticketsData.filter(
      (t) => t.filmId === f.id && t.status !== "resolu",
    ),
  }));

  const unanimes = enriched.filter((f) => f.consensus.type === "unanime");
  const partages = enriched.filter((f) => f.consensus.type === "partage");
  const rejetes = enriched.filter((f) => f.consensus.type === "rejete");
  const attente = enriched.filter((f) => f.consensus.type === "attente");
  const totalTickets = enriched.reduce((s, f) => s + f.tickets.length, 0);

  document.getElementById("sel-unanime").textContent = unanimes.length;
  document.getElementById("sel-partage").textContent = partages.length;
  document.getElementById("sel-rejete").textContent = rejetes.length;
  document.getElementById("sel-attente").textContent = attente.length;
  document.getElementById("sel-tickets").textContent = totalTickets;
  document.getElementById("count-selection").textContent = enriched.length;

  document.getElementById("selfil-tous").textContent =
    `Tous (${enriched.length})`;
  document.getElementById("selfil-unanime").textContent =
    `✅ Unanimes (${unanimes.length})`;
  document.getElementById("selfil-partage").textContent =
    `⚠️ Partagés (${partages.length})`;
  document.getElementById("selfil-rejete").textContent =
    `❌ Rejetés (${rejetes.length})`;
  document.getElementById("selfil-attente").textContent =
    `⏳ En attente (${attente.length})`;

  // Filtre signalements : count + badge nav
  const openTkCount = ticketsData.filter((t) => t.status !== "resolu").length;
  const sigCount = document.getElementById("selfil-signale-count");
  if (sigCount)
    sigCount.textContent = openTkCount > 0 ? `(${openTkCount})` : "";
  const navTk = document.getElementById("nav-count-tickets");
  if (navTk) {
    navTk.textContent = openTkCount;
    navTk.style.display = openTkCount > 0 ? "" : "none";
  }

  // Compteurs onglets
  const admSelCount = getAdmSelCount();
  const finalCount  = getFinalCount();
  const selCountEl  = document.getElementById("selfil-selectionne-count");
  const finCountEl  = document.getElementById("selfil-finaliste-count");
  if (selCountEl) selCountEl.textContent = admSelCount > 0 ? `(${admSelCount}/50)` : "";
  if (finCountEl) finCountEl.textContent = finalCount  > 0 ? `(${finalCount}/5)`   : "";

  // ── Banner phase active ──
  const p1      = phasesConfig.p1;
  const p2      = phasesConfig.p2;
  const p1St    = p1.saved ? getPhaseStatus(p1.open, p1.close) : null;
  const p2St    = p2.saved ? getPhaseStatus(p2.open, p2.close) : null;

  const banner       = document.getElementById("sel-phase-banner");
  const bannerIcon   = document.getElementById("sel-phase-icon");
  const bannerLabel  = document.getElementById("sel-phase-label");
  const bannerStatus = document.getElementById("sel-phase-status");
  const bannerFill   = document.getElementById("sel-phase-fill");
  const bannerCount  = document.getElementById("sel-phase-count");
  const bannerCLabel = document.getElementById("sel-phase-count-label");
  const bannerDL     = document.getElementById("sel-phase-deadline");
  const bannerDLDate = document.getElementById("sel-phase-deadline-date");
  const bannerDLRem  = document.getElementById("sel-phase-deadline-remaining");

  let activePhaseSt = null; // 'p1' | 'p2' | null

  if (p2St === "active") {
    activePhaseSt = "p2";
  } else if (p1St === "active") {
    activePhaseSt = "p1";
  } else if (p2St === "upcoming" || p1St === "upcoming") {
    activePhaseSt = p1St === "upcoming" ? "p1_upcoming" : "p2_upcoming";
  }

  if (banner) {
    if (activePhaseSt === "p2") {
      // Phase 2 active → affiche les 5 finalistes
      banner.style.background = "rgba(192,132,252,0.06)";
      banner.style.border     = "1px solid rgba(192,132,252,0.2)";
      bannerIcon.textContent  = "🏆";
      bannerIcon.style.background = "rgba(192,132,252,0.12)";
      bannerLabel.textContent = "Phase 2 active — Affichage : 5 Finalistes";
      bannerLabel.style.color = "var(--lavande)";
      bannerStatus.textContent = "● En cours";
      bannerStatus.style.cssText = "font-size:0.65rem;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(192,132,252,0.12);color:var(--lavande);border:1px solid rgba(192,132,252,0.3);";
      bannerFill.style.width = `${Math.min((finalCount/5)*100,100)}%`;
      bannerFill.style.background = "linear-gradient(90deg,var(--lavande),#e0c3ff)";
      bannerCount.textContent  = finalCount;
      bannerCount.style.color  = "var(--lavande)";
      bannerCLabel.textContent = "/ 5 finalistes";
      if (bannerDL) { bannerDL.style.display = "block"; bannerDLDate.textContent = fmtDate(p2.close); const d = daysLeft(p2.close); bannerDLRem.textContent = d > 0 ? `J-${d}` : "Terminé"; bannerDLRem.style.color = d <= 2 ? "var(--coral)" : d <= 5 ? "var(--solar)" : "var(--aurora)"; }
      // Basculer vers l'onglet Top 5 si on est sur "tous"
      if (selFilter === "tous") { selFilter = "finaliste"; document.querySelectorAll(".sel-filter").forEach(b => b.classList.remove("active")); document.getElementById("selfil-finaliste")?.classList.add("active"); }

    } else if (activePhaseSt === "p1") {
      // Phase 1 active → affiche les 50 films
      banner.style.background = "rgba(78,255,206,0.05)";
      banner.style.border     = "1px solid rgba(78,255,206,0.18)";
      bannerIcon.textContent  = "★";
      bannerIcon.style.background = "rgba(78,255,206,0.1)";
      bannerLabel.textContent = "Phase 1 active — Affichage : 50 films sélectionnés";
      bannerLabel.style.color = "var(--aurora)";
      bannerStatus.textContent = "● En cours";
      bannerStatus.style.cssText = "font-size:0.65rem;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(78,255,206,0.12);color:var(--aurora);border:1px solid rgba(78,255,206,0.3);";
      bannerFill.style.width = `${Math.min((admSelCount/50)*100,100)}%`;
      bannerFill.style.background = "linear-gradient(90deg,var(--aurora),#a8ffec)";
      bannerCount.textContent  = admSelCount;
      bannerCount.style.color  = "var(--aurora)";
      bannerCLabel.textContent = "/ 50 sélectionnés";
      if (bannerDL) { bannerDL.style.display = "block"; bannerDLDate.textContent = fmtDate(p1.close); const d = daysLeft(p1.close); bannerDLRem.textContent = d > 0 ? `J-${d}` : "Terminé"; bannerDLRem.style.color = d <= 2 ? "var(--coral)" : d <= 5 ? "var(--solar)" : "var(--aurora)"; }
      // Basculer vers l'onglet Top 50 si on est sur "tous"
      if (selFilter === "tous") { selFilter = "selectionne"; document.querySelectorAll(".sel-filter").forEach(b => b.classList.remove("active")); document.getElementById("selfil-selectionne")?.classList.add("active"); }

    } else {
      // Aucune phase active — affiche la progression de sélection en cours
      const pct = Math.min((admSelCount / 50) * 100, 100);
      banner.style.background = "rgba(78,255,206,0.04)";
      banner.style.border     = "1px solid rgba(78,255,206,0.12)";
      bannerIcon.textContent  = "★";
      bannerIcon.style.background = "rgba(78,255,206,0.08)";
      const nextLabel = p1St === "upcoming" ? `Phase 1 à partir du ${fmtDate(p1.open)}` : p2St === "upcoming" ? `Phase 2 à partir du ${fmtDate(p2.open)}` : "Sélection en cours";
      bannerLabel.textContent = nextLabel;
      bannerLabel.style.color = "var(--aurora)";
      bannerStatus.textContent = admSelCount >= 50 ? "✓ Quota atteint" : p1St === "upcoming" || p2St === "upcoming" ? "◷ À venir" : `${admSelCount} / 50`;
      bannerStatus.style.cssText = "font-size:0.65rem;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(78,255,206,0.1);color:var(--aurora);border:1px solid rgba(78,255,206,0.25);";
      bannerFill.style.width = `${pct}%`;
      bannerFill.style.background = "linear-gradient(90deg,var(--aurora),#a8ffec)";
      bannerCount.textContent = admSelCount;
      bannerCount.style.color = "var(--aurora)";
      bannerCLabel.textContent = "/ 50 sélectionnés";
      if (bannerDL) bannerDL.style.display = "none";
    }
  }

  // ── Onglet TOP 50 ──
  if (selFilter === "selectionne") {
    const admSelected = films.filter((f) => isInTop50(f.id));
    const tbody = document.getElementById("selection-tbody");
    if (admSelected.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:48px;color:var(--mist);font-size:0.85rem;">Aucun film dans le Top 50.<br><span style="font-size:0.75rem;opacity:0.6;">Cliquez sur "Sélectionner ✓" dans la liste pour constituer votre sélection.</span></td></tr>`;
    } else {
      const juryUsers = users.filter((u) => u.role === "jury");
      tbody.innerHTML = admSelected.map((f, idx) => {
        const c = getFilmConsensus(f);
        const isFinal = isInTop5(f.id);
        const voteLabel = c.type === "unanime"
          ? `<span style="color:var(--aurora);font-weight:700;">✅ Unanime</span>`
          : c.type === "partage"
            ? `<span style="color:var(--solar);font-weight:700;">⚠️ Partagé</span>`
            : `<span style="color:var(--mist);">—</span>`;
        const juryAv = Object.entries(f.juryDec || {}).map(([uid, dec]) => {
          const u = juryUsers.find((x) => x.id === parseInt(uid));
          if (!u) return "";
          const bc = dec === "valide" ? "var(--aurora)" : dec === "refuse" ? "var(--coral)" : dec === "aRevoir" ? "var(--solar)" : "rgba(255,255,255,0.15)";
          const ic = dec === "valide" ? "✓" : dec === "refuse" ? "✕" : dec === "aRevoir" ? "↩" : "?";
          return `<div title="${u.name}" style="position:relative;display:inline-block;"><img src="${u.avatar}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:2px solid ${bc};opacity:${dec ? 1 : 0.4};"><span style="position:absolute;bottom:-3px;right:-3px;width:11px;height:11px;border-radius:50%;font-size:0.42rem;font-weight:900;display:flex;align-items:center;justify-content:center;background:${bc};color:var(--deep-sky);">${ic}</span></div>`;
        }).join("");
        const currentFinalCount = getFinalCount();
        const finVoteCnt  = finalistVotes[f.id]?.size || 0;
        const adminVoted  = finalistVotes[f.id]?.has(0);
        const finalBtn = isFinal
          ? `<button onclick="event.stopPropagation();toggleFinalist(${f.id})" title="Retirer mon vote" style="padding:5px 12px;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;border:1px solid rgba(192,132,252,0.5);background:rgba(192,132,252,0.15);color:var(--lavande);display:flex;align-items:center;gap:5px;white-space:nowrap;">🏆 Top 5 (${finVoteCnt}/${FINALIST_THRESHOLD}) <span style="opacity:0.6;font-size:0.65rem;">✕</span></button>`
          : adminVoted
            ? `<button onclick="event.stopPropagation();toggleFinalist(${f.id})" style="padding:5px 12px;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;border:1px solid rgba(192,132,252,0.3);background:rgba(192,132,252,0.08);color:var(--lavande);white-space:nowrap;">✓ Voté (${finVoteCnt}/${FINALIST_THRESHOLD})</button>`
            : `<button onclick="event.stopPropagation();toggleFinalist(${f.id})" title="Voter pour le Top 5" style="padding:5px 12px;border-radius:6px;font-size:0.72rem;font-weight:600;cursor:pointer;border:1px solid rgba(192,132,252,0.3);background:rgba(192,132,252,0.07);color:var(--lavande);white-space:nowrap;transition:all 0.15s;" onmouseover="this.style.background='rgba(192,132,252,0.18)'" onmouseout="this.style.background='rgba(192,132,252,0.07)'">→ Top 5 (${finVoteCnt}/${FINALIST_THRESHOLD})</button>`;
        return `<tr style="background:${isFinal ? "rgba(192,132,252,0.05)" : "rgba(78,255,206,0.03)"};" onmouseover="this.style.background='${isFinal ? "rgba(192,132,252,0.09)" : "rgba(78,255,206,0.06)"}'" onmouseout="this.style.background='${isFinal ? "rgba(192,132,252,0.05)" : "rgba(78,255,206,0.03)"}'">
          <td style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;color:var(--solar);">${String(idx + 1).padStart(2, "0")}</td>
          <td><div style="font-weight:700;font-size:0.88rem;">${f.title}${isFinal ? ' <span style="font-size:0.65rem;color:var(--lavande);vertical-align:middle;">🏆</span>' : ""}</div><div style="font-size:0.72rem;color:var(--mist);">${f.author} · ${flags[f.country] || ""} ${f.country || ""}</div></td>
          <td>${voteLabel}</td>
          <td><div style="display:flex;align-items:center;gap:3px;">${juryAv}</div></td>
          <td>${finalBtn}</td>
          <td style="white-space:nowrap;">
            <button onclick="event.stopPropagation();openVideoModal(${f.id})" style="padding:4px 10px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;border:1px solid rgba(78,255,206,0.25);background:rgba(78,255,206,0.06);color:var(--aurora);">▶ Voir</button>
            <button onclick="event.stopPropagation();openDirectorEmail(${f.id},'selection')" style="margin-left:4px;padding:4px 10px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;border:1px solid rgba(192,132,252,0.25);background:rgba(192,132,252,0.06);color:var(--lavande);" title="Envoyer un email au réalisateur">📧</button>
          </td>
          <td><button onclick="event.stopPropagation();adminDecide(${f.id},'valide')" style="padding:4px 10px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;border:1px solid rgba(255,107,107,0.2);background:rgba(255,107,107,0.04);color:var(--coral);">✕</button></td>
        </tr>`;
      }).join("");
    }
    return;
  }

  // ── Onglet TOP 5 FINALE ──
  if (selFilter === "finaliste") {
    const finalists = films.filter((f) => isInTop5(f.id));
    const tbody = document.getElementById("selection-tbody");
    if (finalists.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:48px;color:var(--mist);font-size:0.85rem;">Aucun finaliste désigné.<br><span style="font-size:0.75rem;opacity:0.6;">Allez dans <strong style="color:var(--solar);">★ Top 50</strong> et cliquez sur <strong style="color:var(--lavande);">→ Top 5</strong> pour désigner vos 5 finalistes.</span></td></tr>`;
    } else {
      const juryUsers = users.filter((u) => u.role === "jury");
      // Barre 5 finalistes en haut du tableau
      const bar5pct = Math.min((finalists.length / 5) * 100, 100);
      const bar5 = `<tr><td colspan="8" style="padding:0;border-bottom:none;">
        <div style="padding:12px 16px;background:rgba(192,132,252,0.05);border-bottom:1px solid rgba(192,132,252,0.1);display:flex;align-items:center;gap:16px;">
          <span style="font-size:0.72rem;font-weight:700;color:var(--lavande);white-space:nowrap;">🏆 Finalistes</span>
          <div style="flex:1;height:5px;background:rgba(192,132,252,0.1);border-radius:999px;overflow:hidden;"><div style="height:100%;width:${bar5pct}%;background:linear-gradient(90deg,var(--lavande),#e0c3ff);border-radius:999px;transition:width 0.4s;"></div></div>
          <span style="font-family:var(--font-mono);font-size:0.78rem;font-weight:800;color:${finalists.length >= 5 ? "var(--lavande)" : "var(--snow)"};">${finalists.length}<span style="color:var(--mist);font-weight:400;"> / 5</span></span>
          ${finalists.length >= 5 ? '<span style="font-size:0.72rem;color:var(--lavande);font-weight:700;">✓ Finale constituée</span>' : '<span style="font-size:0.72rem;color:var(--solar);">Il manque ' + (5 - finalists.length) + ' finaliste' + (5 - finalists.length > 1 ? "s" : "") + '</span>'}
        </div>
      </td></tr>`;
      tbody.innerHTML = bar5 + finalists.map((f, idx) => {
        const c = getFilmConsensus(f);
        const voteLabel = c.type === "unanime"
          ? `<span style="color:var(--aurora);font-weight:700;">✅ Unanime</span>`
          : c.type === "partage"
            ? `<span style="color:var(--solar);font-weight:700;">⚠️ Partagé</span>`
            : `<span style="color:var(--mist);">—</span>`;
        const juryAv = Object.entries(f.juryDec || {}).map(([uid, dec]) => {
          const u = juryUsers.find((x) => x.id === parseInt(uid));
          if (!u) return "";
          const bc = dec === "valide" ? "var(--aurora)" : dec === "refuse" ? "var(--coral)" : dec === "aRevoir" ? "var(--solar)" : "rgba(255,255,255,0.15)";
          const ic = dec === "valide" ? "✓" : dec === "refuse" ? "✕" : dec === "aRevoir" ? "↩" : "?";
          return `<div title="${u.name}" style="position:relative;display:inline-block;"><img src="${u.avatar}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:2px solid ${bc};"><span style="position:absolute;bottom:-3px;right:-3px;width:11px;height:11px;border-radius:50%;font-size:0.42rem;font-weight:900;display:flex;align-items:center;justify-content:center;background:${bc};color:var(--deep-sky);">${ic}</span></div>`;
        }).join("");
        const medal = ["🥇","🥈","🥉","④","⑤"][idx] || (idx+1);
        return `<tr style="background:rgba(192,132,252,0.06);" onmouseover="this.style.background='rgba(192,132,252,0.1)'" onmouseout="this.style.background='rgba(192,132,252,0.06)'">
          <td style="font-family:var(--font-mono);font-size:1.1rem;text-align:center;">${medal}</td>
          <td><div style="font-weight:700;font-size:0.9rem;">${f.title}</div><div style="font-size:0.72rem;color:var(--mist);">${f.author} · ${flags[f.country] || ""} ${f.country || ""}</div></td>
          <td>${voteLabel}</td>
          <td><div style="display:flex;align-items:center;gap:3px;">${juryAv}</div></td>
          <td><button onclick="event.stopPropagation();openDirectorEmail(${f.id},'finaliste')" style="padding:4px 12px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;border:1px solid rgba(192,132,252,0.3);background:rgba(192,132,252,0.08);color:var(--lavande);" title="Notifier le réalisateur de sa sélection en finale">📧 Notifier</button></td>
          <td><button onclick="event.stopPropagation();openVideoModal(${f.id})" style="padding:4px 10px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;border:1px solid rgba(78,255,206,0.25);background:rgba(78,255,206,0.06);color:var(--aurora);">▶ Voir</button></td>
          <td><button onclick="event.stopPropagation();toggleFinalist(${f.id})" style="padding:4px 10px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;border:1px solid rgba(255,107,107,0.2);background:rgba(255,107,107,0.04);color:var(--coral);">✕ Retirer</button></td>
        </tr>`;
      }).join("");
    }
    return;
  }

  let filtered = enriched;
  if (selFilter === "signale")
    filtered = filtered.filter((f) => f.tickets && f.tickets.length > 0);
  else if (selFilter !== "tous" && selFilter !== "finaliste" && selFilter !== "selectionne")
    filtered = filtered.filter((f) => f.consensus.type === selFilter);
  if (searchQ)
    filtered = filtered.filter((f) =>
      (f.title + f.author + f.country).toLowerCase().includes(searchQ),
    );

  if (selSort === "score")
    filtered.sort((a, b) => b.consensus.score - a.consensus.score);
  else if (selSort === "title")
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  else if (selSort === "comments")
    filtered.sort(
      (a, b) =>
        Object.keys(b.comments || {}).length +
        b.tickets.length -
        (Object.keys(a.comments || {}).length + a.tickets.length),
    );

  const tbody = document.getElementById("selection-tbody");
  const juryUsers = users.filter((u) => u.role === "jury");

  tbody.innerHTML = filtered
    .map((f) => {
      const c = f.consensus;
      const nComm = f.comments ? Object.keys(f.comments).length : 0;
      const nTk = f.tickets.length;
      const adm = isInTop50(f.id) ? "valide" : null;
      const tv = c.valide + c.refuse + c.aRevoir;

      const pV = tv > 0 ? Math.round((c.valide / tv) * 100) : 0;
      const pR = tv > 0 ? Math.round((c.aRevoir / tv) * 100) : 0;
      const pX = tv > 0 ? 100 - pV - pR : 0;
      const voteBar =
        tv > 0
          ? `<div style="display:flex;align-items:center;gap:8px;min-width:180px;">
          <div style="flex:1;height:6px;border-radius:3px;background:rgba(255,255,255,0.06);overflow:hidden;display:flex;">
            <div style="width:${pV}%;background:var(--aurora);"></div>
            <div style="width:${pR}%;background:var(--solar);"></div>
            <div style="width:${pX}%;background:var(--coral);"></div>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--mist);white-space:nowrap;">${c.valide}✓ ${c.aRevoir}↩ ${c.refuse}✕</span>
        </div>`
          : `<span style="font-size:0.72rem;color:var(--mist);opacity:0.5;">Aucun vote</span>`;

      const badgeMap = {
        "sel-unanime":
          "background:rgba(78,255,206,0.1);border:1px solid rgba(78,255,206,0.3);color:var(--aurora);",
        "sel-partage":
          "background:rgba(245,230,66,0.1);border:1px solid rgba(245,230,66,0.3);color:var(--solar);",
        "sel-rejete":
          "background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.3);color:var(--coral);",
        "sel-attente":
          "background:rgba(192,132,252,0.1);border:1px solid rgba(192,132,252,0.3);color:var(--lavande);",
      };

      const juryAv = Object.entries(f.juryDec || {})
        .map(([uid, dec]) => {
          const u = juryUsers.find((x) => x.id === parseInt(uid));
          if (!u) return "";
          const bc =
            dec === "valide"
              ? "var(--aurora)"
              : dec === "refuse"
                ? "var(--coral)"
                : dec === "aRevoir"
                  ? "var(--solar)"
                  : "rgba(255,255,255,0.15)";
          const ic =
            dec === "valide"
              ? "✓"
              : dec === "refuse"
                ? "✕"
                : dec === "aRevoir"
                  ? "↩"
                  : "?";
          return `<div title="${u.name}: ${dec || "Pas voté"}" style="position:relative;display:inline-block;">
        <img src="${u.avatar}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:2px solid ${bc};opacity:${dec ? 1 : 0.4};">
        <span style="position:absolute;bottom:-3px;right:-3px;width:12px;height:12px;border-radius:50%;font-size:0.45rem;font-weight:900;display:flex;align-items:center;justify-content:center;background:${bc};color:var(--deep-sky);">${ic}</span>
      </div>`;
        })
        .join("");

      const emailType = adm === "valide" ? "selection" : "info";
      const isSelected = adm === "valide";
      const admBtns = `<div style="display:flex;flex-direction:column;gap:5px;align-items:stretch;min-width:130px;">
        <button onclick="event.stopPropagation();adminDecide(${f.id},'valide')" style="
          display:flex;align-items:center;gap:7px;
          padding:7px 12px;border-radius:8px;font-size:0.72rem;font-weight:800;
          cursor:pointer;transition:all .18s;font-family:var(--font-display);
          border:1.5px solid ${isSelected ? "rgba(78,255,206,0.7)" : "rgba(78,255,206,0.2)"};
          background:${isSelected ? "rgba(78,255,206,0.18)" : "rgba(78,255,206,0.05)"};
          color:var(--aurora);
          box-shadow:${isSelected ? "0 0 14px rgba(78,255,206,0.18),inset 0 0 8px rgba(78,255,206,0.06)" : "none"};"
          onmouseover="if(!${isSelected})this.style.background='rgba(78,255,206,0.12)'"
          onmouseout="if(!${isSelected})this.style.background='rgba(78,255,206,0.05)'">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0">
            ${isSelected
              ? '<path d="M2 6l3 3 5-5" stroke="#4effce" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
              : '<circle cx="6" cy="6" r="4.5" stroke="#4effce" stroke-width="1.4"/><path d="M6 4v4M4 6h4" stroke="#4effce" stroke-width="1.4" stroke-linecap="round"/>'}
          </svg>
          ${isSelected ? "Sélectionné" : "Sélectionner"}
        </button>
        <button onclick="event.stopPropagation();openVideoModal(${f.id})" style="
          display:flex;align-items:center;gap:7px;
          padding:7px 12px;border-radius:8px;font-size:0.72rem;font-weight:700;
          cursor:pointer;transition:all .18s;font-family:var(--font-display);
          border:1.5px solid rgba(96,165,250,0.22);
          background:rgba(96,165,250,0.06);color:#60a5fa;"
          onmouseover="this.style.background='rgba(96,165,250,0.14)';this.style.borderColor='rgba(96,165,250,0.45)'"
          onmouseout="this.style.background='rgba(96,165,250,0.06)';this.style.borderColor='rgba(96,165,250,0.22)'">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0">
            <polygon points="3,2 10,6 3,10" fill="#60a5fa"/>
          </svg>
          Voir le film
        </button>
        <button onclick="event.stopPropagation();openDirectorEmail(${f.id},'${emailType}')" style="
          display:flex;align-items:center;gap:7px;
          padding:7px 12px;border-radius:8px;font-size:0.72rem;font-weight:700;
          cursor:pointer;transition:all .18s;font-family:var(--font-display);
          border:1.5px solid rgba(192,132,252,0.22);
          background:rgba(192,132,252,0.06);color:var(--lavande);"
          onmouseover="this.style.background='rgba(192,132,252,0.14)';this.style.borderColor='rgba(192,132,252,0.45)'"
          onmouseout="this.style.background='rgba(192,132,252,0.06)';this.style.borderColor='rgba(192,132,252,0.22)'">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0">
            <rect x="1" y="2.5" width="10" height="7" rx="1.5" stroke="#c084fc" stroke-width="1.3"/>
            <path d="M1 4l5 3.5L11 4" stroke="#c084fc" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          Email réalisateur
        </button>
      </div>`;

      const commEntries = Object.entries(f.comments || {});
      const gridCols = nTk > 0 ? "1fr 1fr 1fr" : "1fr 1fr";

      const detailRow = `<tr id="sel-detail-${f.id}" style="display:none;">
      <td colspan="7" style="padding:16px 20px;background:rgba(255,255,255,0.015);border-top:1px solid rgba(255,255,255,0.04);">
        <div class="sel-detail-grid" style="display:grid;grid-template-columns:${gridCols};gap:16px;">
          <div class="sel-detail-comments">
            <div style="font-size:0.68rem;font-weight:700;color:var(--mist);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">💬 Commentaires (${commEntries.length})</div>
            ${
              commEntries.length > 0
                ? commEntries
                    .map(([uid, txt]) => {
                      const u = juryUsers.find((x) => x.id === parseInt(uid));
                      const dec = f.juryDec?.[uid];
                      const dc =
                        dec === "valide"
                          ? "var(--aurora)"
                          : dec === "refuse"
                            ? "var(--coral)"
                            : "var(--solar)";
                      const dl =
                        dec === "valide"
                          ? "✓ Validé"
                          : dec === "refuse"
                            ? "✕ Refusé"
                            : "↩ À revoir";
                      return `<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;padding:10px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.04);border-radius:8px;">
                ${u?.avatar ? `<img src="${u.avatar}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${dc};">` : ""}
                <div style="flex:1;min-width:0;">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
                    <span style="font-weight:700;font-size:0.78rem;">${u ? u.name : "Juré #" + uid}</span>
                    <span style="font-size:0.62rem;padding:1px 6px;border-radius:4px;background:${dc}22;color:${dc};font-weight:600;">${dec ? dl : ""}</span>
                  </div>
                  <div style="font-size:0.78rem;color:rgba(240,244,255,0.7);line-height:1.5;">« ${txt} »</div>
                </div>
              </div>`;
                    })
                    .join("")
                : '<div style="font-size:0.78rem;color:var(--mist);opacity:0.5;padding:8px;">Aucun commentaire</div>'
            }
          </div>
          <div class="vote-indiv-container">
            <div class="vote-indiv-title" style="font-size:0.68rem;font-weight:700;color:var(--mist);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;"><span class="vote-indiv-icon">⚖️</span> <span class="vote-indiv-text">Votes individuels</span></div>
            <div class="vote-indiv-list">
            ${Object.entries(f.juryDec || {})
              .map(([uid, dec]) => {
                const u = juryUsers.find((x) => x.id === parseInt(uid));
                if (!u) return "";
                const dc =
                  dec === "valide"
                    ? "var(--aurora)"
                    : dec === "refuse"
                      ? "var(--coral)"
                      : dec === "aRevoir"
                        ? "var(--solar)"
                        : "var(--mist)";
                const dt =
                  dec === "valide"
                    ? "✓ Validé"
                    : dec === "refuse"
                      ? "✕ Refusé"
                      : dec === "aRevoir"
                        ? "↩ À revoir"
                        : "⏳ Pas voté";
                const viIcon = dt.charAt(0);
                const viLabel = dt.substring(2);
                return `<div class="vote-indiv-item" style="display:flex;align-items:center;gap:8px;padding:6px 8px;margin-bottom:4px;background:rgba(255,255,255,0.02);border-radius:6px;">
                <img src="${u.avatar}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;flex-shrink:0;">
                <span class="vote-indiv-name" style="font-size:0.78rem;font-weight:600;flex:1;">${u.name}</span>
                <span class="vote-indiv-status" style="font-size:0.68rem;font-weight:700;color:${dc};"><span class="vi-icon">${viIcon}</span> <span class="vi-text">${viLabel}</span></span>
              </div>`;
              })
              .join("")}
            </div>
          </div>
          ${
            nTk > 0
              ? `<div class="sel-detail-tickets">
            <div style="font-size:0.68rem;font-weight:700;color:var(--solar);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">🚩 Signalements jury (${nTk})</div>
            ${f.tickets
              .map((t) => {
                const tm = tkTypeMeta(t.typeKey);
                const age = tkAge(t.date);
                const urg = tkUrgency(t.date);
                return `<div style="padding:12px;margin-bottom:8px;background:rgba(245,230,66,0.03);border:1px solid rgba(245,230,66,0.1);border-radius:10px;${urg ? `border-left:3px solid ${urg.dot};` : ""}">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                  <span style="font-size:0.7rem;font-weight:700;padding:2px 8px;border-radius:5px;background:${tm.bg};border:1px solid ${tm.border};color:${tm.color};">${t.type}</span>
                  <span style="font-size:0.65rem;color:var(--mist);">${t.reporter}</span>
                  <span style="font-size:0.62rem;color:${urg ? urg.dot : "rgba(136,146,176,0.5)"};margin-left:auto;">${age}${urg ? " ●" : ""}</span>
                </div>
                <div style="font-size:0.75rem;color:rgba(240,244,255,0.7);line-height:1.5;margin-bottom:10px;font-style:italic;">"${t.desc}"</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button onclick="event.stopPropagation();selActTicket('${t.id}','dismiss')" style="padding:4px 10px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:var(--mist);font-family:var(--font-body);">↓ Classer</button>
                  <button onclick="event.stopPropagation();openEmailModal('${t.id}','revision')" style="padding:4px 10px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;background:rgba(192,132,252,0.08);border:1px solid rgba(192,132,252,0.22);color:var(--lavande);font-family:var(--font-body);">↩ Demander révision</button>
                  <button onclick="event.stopPropagation();openEmailModal('${t.id}','refuse')" style="padding:4px 10px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;background:rgba(255,107,107,0.08);border:1px solid rgba(255,107,107,0.22);color:var(--coral);font-family:var(--font-body);">✕ Refuser le film</button>
                </div>
              </div>`;
              })
              .join("")}
          </div>`
              : ""
          }
        </div>
      </td>
    </tr>`;

      const isRefused  = adm === "refuse";
      const rowBg      = isSelected ? "rgba(78,255,206,0.04)" : isRefused ? "rgba(255,107,107,0.03)" : "";
      const rowOpacity = isSelected ? "0.45" : "1";
      const selBadge   = isSelected
        ? `<span style="display:inline-flex;align-items:center;gap:3px;font-size:0.62rem;font-weight:700;padding:2px 7px;border-radius:999px;background:rgba(78,255,206,0.1);color:var(--aurora);border:1px solid rgba(78,255,206,0.25);white-space:nowrap;">✓ Top 50</span>`
        : "";
      const infoBadges = `<div style="display:flex;align-items:center;gap:5px;">
      ${selBadge}
      ${nComm > 0 ? `<span style="font-size:0.75rem;color:var(--lavande);" title="${nComm} commentaire(s)">💬${nComm}</span>` : ""}
      ${nTk > 0 ? `<span style="font-size:0.75rem;color:var(--solar);" title="${nTk} signalement(s)">🚩${nTk}</span>` : ""}
      ${!isSelected && nComm === 0 && nTk === 0 ? '<span style="font-size:0.72rem;color:var(--mist);opacity:0.4;">—</span>' : ""}
    </div>`;

      return `<tr onclick="toggleSelDetail(${f.id})" style="cursor:pointer;transition:background .15s;background:${rowBg};opacity:${isSelected ? "0.28" : "1"};" onmouseover="this.style.opacity='1';this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.opacity='${isSelected ? "0.28" : "1"}';this.style.background='${rowBg}'">
      <td style="font-family:var(--font-mono);font-size:0.72rem;color:var(--mist);">#${String(f.id).padStart(3, "0")}</td>
      <td>
        <div style="font-weight:700;font-size:0.88rem;">${f.title}</div>
        <div style="font-size:0.72rem;color:var(--mist);">${f.author} · ${flags[f.country] || ""} ${f.country}</div>
      </td>
      <td>${voteBar}</td>
      <td><span style="padding:4px 12px;border-radius:6px;font-size:0.72rem;font-weight:700;${badgeMap[c.cls] || ""}">${c.label}</span></td>
      <td style="min-width:80px;"><div style="display:flex;align-items:center;gap:-4px;">${juryAv}</div></td>
      <td>${infoBadges}</td>
      <td>${admBtns}</td>
    </tr>${detailRow}`;
    })
    .join("");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--mist);font-size:0.85rem;">Aucun film ne correspond à ce filtre.</td></tr>`;
  }
}

function exportSelectionCSV() {
  const evaluated = films.filter(
    (f) => f.juryDec && Object.keys(f.juryDec).length > 0,
  );
  const rows = [
    [
      "#",
      "Titre",
      "Réalisateur",
      "Pays",
      "Validé",
      "À revoir",
      "Refusé",
      "Consensus",
      "Décision Admin",
    ],
  ];
  evaluated.forEach((f) => {
    const c = getFilmConsensus(f);
    const adm = isInTop50(f.id) ? "top50" : "";
    rows.push([
      f.id,
      f.title,
      f.author,
      f.country,
      c.valide,
      c.aRevoir,
      c.refuse,
      c.label,
      adm,
    ]);
  });
  const csv = rows.map((r) => r.join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "selection-marsai-2026.csv";
  a.click();
  showToast("📤 Export CSV téléchargé", "ok");
}

/* ════════════════════════════════════════════
   KANBAN TICKETS — données & fonctions
   ════════════════════════════════════════════ */

const ticketsData = [
  {
    id: "TK-001",
    filmId: 1,
    film: "Rêves de Silicium",
    author: "Léa Fontaine",
    type: "🎵 Droits musicaux",
    typeKey: "droits",
    reporter: "Jury — Marie L.",
    desc: "Musique de fond potentiellement sous copyright. Le passage entre 1:20 et 2:45 semble utiliser une œuvre protégée.",
    status: "attente",
    date: "2026-11-18",
    adminNote: "",
  },
  {
    id: "TK-002",
    filmId: 6,
    film: "Fragments d'Horizon",
    author: "Karim Mansouri",
    type: "🎵 Droits musicaux",
    typeKey: "droits",
    reporter: "Admin",
    desc: "Vérification droits en cours avec l'auteur de la bande-son.",
    status: "en_cours",
    date: "2026-11-20",
    adminNote: "Contacté auteur le 20/11.",
  },
  {
    id: "TK-003",
    filmId: 3,
    film: "Mémoire Vive",
    author: "Sofia Peres",
    type: "▶ YouTube rejeté",
    typeKey: "youtube",
    reporter: "Système",
    desc: "Vidéo non accessible, lien YouTube invalide. Film non importé automatiquement.",
    status: "attente",
    date: "2026-11-21",
    adminNote: "",
  },
  {
    id: "TK-004",
    filmId: 4,
    film: "L'Algorithme du Futur",
    author: "Alex Nguyen",
    type: "📋 Lisibilité",
    typeKey: "lisibilite",
    reporter: "Jury — Thomas R.",
    desc: "Sous-titres illisibles sur fond clair aux minutes 5 à 8. Police trop fine.",
    status: "en_cours",
    date: "2026-11-22",
    adminNote: "",
  },
  {
    id: "TK-005",
    filmId: 7,
    film: "Neurones Bleus",
    author: "Marie Dupont",
    type: "↩ Révision demandée",
    typeKey: "revision",
    reporter: "Jury — Marie L.",
    desc: "La fin du film semble tronquée. La dernière séquence s'arrête abruptement à 12:45.",
    status: "attente",
    date: "2026-11-23",
    adminNote: "",
  },
  {
    id: "TK-006",
    filmId: 8,
    film: "Signal Perdu",
    author: "Hiro Tanaka",
    type: "🎵 Droits musicaux",
    typeKey: "droits",
    reporter: "Jury — Jules V.",
    desc: "Droits vérifiés et conformes.",
    status: "resolu",
    date: "2026-11-10",
    adminNote: "Licence Creative Commons confirmée.",
  },
  {
    id: "TK-007",
    filmId: 9,
    film: "Synthèse",
    author: "Emma Bernard",
    type: "📋 Lisibilité",
    typeKey: "lisibilite",
    reporter: "Jury — Thomas R.",
    desc: "Sous-titres corrigés par le réalisateur.",
    status: "resolu",
    date: "2026-11-12",
    adminNote: "",
  },
  {
    id: "TK-008",
    filmId: 10,
    film: "L'Éveil",
    author: "Pablo Ruiz",
    type: "▶ YouTube rejeté",
    typeKey: "youtube",
    reporter: "Système",
    desc: "Lien YouTube mis à jour et fonctionnel.",
    status: "resolu",
    date: "2026-11-15",
    adminNote: "",
  },
];

// Date de référence pour le calcul de l'âge (contexte festival déc. 2026)
const TK_REF_DATE = new Date("2026-12-01");

let activeTkId = null;
let tkFilter = "tous";
let resolvedCollapsed = true;

function tkAge(dateStr) {
  const diff = Math.floor((TK_REF_DATE - new Date(dateStr)) / 86400000);
  if (diff === 0) return "aujourd'hui";
  if (diff === 1) return "hier";
  if (diff < 7) return `il y a ${diff} j`;
  if (diff < 30) return `il y a ${Math.floor(diff / 7)} sem.`;
  return `il y a ${Math.floor(diff / 30)} mois`;
}

function tkUrgency(dateStr) {
  const diff = Math.floor((TK_REF_DATE - new Date(dateStr)) / 86400000);
  if (diff >= 10)
    return {
      dot: "var(--coral)",
      title: "Urgent — en attente depuis plus de 10 jours",
    };
  if (diff >= 5)
    return { dot: "var(--solar)", title: "À traiter prochainement" };
  return null;
}

function tkTypeMeta(typeKey) {
  const map = {
    droits: {
      color: "var(--solar)",
      bg: "rgba(245,230,66,0.1)",
      border: "rgba(245,230,66,0.25)",
    },
    youtube: {
      color: "var(--coral)",
      bg: "rgba(255,107,107,0.1)",
      border: "rgba(255,107,107,0.25)",
    },
    lisibilite: {
      color: "var(--mist)",
      bg: "rgba(255,255,255,0.06)",
      border: "rgba(255,255,255,0.12)",
    },
    revision: {
      color: "var(--lavande)",
      bg: "rgba(192,132,252,0.1)",
      border: "rgba(192,132,252,0.25)",
    },
    contenu: {
      color: "var(--coral)",
      bg: "rgba(255,107,107,0.1)",
      border: "rgba(255,107,107,0.25)",
    },
  };
  return (
    map[typeKey] || {
      color: "var(--mist)",
      bg: "rgba(255,255,255,0.05)",
      border: "rgba(255,255,255,0.1)",
    }
  );
}

function setTkFilter(key, btn) {
  tkFilter = key;
  document
    .querySelectorAll(".tk-filter-btn")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderKanban();
}

function toggleResolvedCol() {
  resolvedCollapsed = !resolvedCollapsed;
  renderKanban();
}

function renderKanban() {
  const board = document.getElementById("kanban-board");
  if (!board) return;

  // Filtres par type
  const typeFilters = [
    { key: "tous", label: "Tous" },
    { key: "droits", label: "🎵 Droits" },
    { key: "youtube", label: "▶ YouTube" },
    { key: "lisibilite", label: "📋 Lisibilité" },
    { key: "revision", label: "↩ Révision" },
  ];
  const filtersHtml = `<div class="tk-filters">${typeFilters
    .map((f) => {
      const count =
        f.key === "tous"
          ? ticketsData.filter((t) => t.status !== "resolu").length
          : ticketsData.filter(
              (t) => t.typeKey === f.key && t.status !== "resolu",
            ).length;
      return `<button class="tk-filter-btn${tkFilter === f.key ? " active" : ""}" onclick="setTkFilter('${f.key}', this)">${f.label}<span class="tk-filter-count">${count}</span></button>`;
    })
    .join("")}</div>`;

  const filtered = (t) => tkFilter === "tous" || t.typeKey === tkFilter;

  const cols = [
    {
      key: "attente",
      label: "En attente",
      color: "var(--solar)",
      cntBg: "rgba(245,230,66,0.12)",
      cntBorder: "rgba(245,230,66,0.3)",
      collapsible: false,
    },
    {
      key: "en_cours",
      label: "En cours",
      color: "var(--aurora)",
      cntBg: "rgba(78,255,206,0.1)",
      cntBorder: "rgba(78,255,206,0.25)",
      collapsible: false,
    },
    {
      key: "resolu",
      label: "Résolus",
      color: "var(--lavande)",
      cntBg: "rgba(192,132,252,0.1)",
      cntBorder: "rgba(192,132,252,0.25)",
      collapsible: true,
    },
  ];

  const colsHtml = cols
    .map((col) => {
      const allCards = ticketsData.filter((t) => t.status === col.key);
      const cards = allCards.filter(filtered);
      const isCollapsed = col.collapsible && resolvedCollapsed;
      const chevron = col.collapsible
        ? `<button class="kanban-col-toggle" onclick="toggleResolvedCol()" title="${isCollapsed ? "Afficher" : "Masquer"}">${isCollapsed ? "▶" : "▼"}</button>`
        : "";
      const cardsHtml = isCollapsed
        ? ""
        : cards.length
          ? cards.map((t) => renderTkCard(t, col.key)).join("")
          : '<div class="kanban-empty">Aucun ticket</div>';
      return `
      <div class="kanban-col${isCollapsed ? " collapsed" : ""}">
        <div class="kanban-col-header" ${col.collapsible ? `onclick="toggleResolvedCol()" style="cursor:pointer;"` : ""}>
          <span class="kanban-col-title" style="color:${col.color};">${col.label}</span>
          <span class="kanban-col-count" style="background:${col.cntBg};border:1px solid ${col.cntBorder};color:${col.color};">${allCards.length}</span>
          ${chevron}
        </div>
        ${isCollapsed ? "" : `<div class="kanban-cards">${cardsHtml}</div>`}
      </div>`;
    })
    .join("");

  board.innerHTML = filtersHtml + `<div class="kanban-cols">${colsHtml}</div>`;

  // stats counters
  const el = (id) => document.getElementById(id);
  if (el("tk-count-attente"))
    el("tk-count-attente").textContent = ticketsData.filter(
      (t) => t.status === "attente",
    ).length;
  if (el("tk-count-encours"))
    el("tk-count-encours").textContent = ticketsData.filter(
      (t) => t.status === "en_cours",
    ).length;
  if (el("tk-count-resolu"))
    el("tk-count-resolu").textContent = ticketsData.filter(
      (t) => t.status === "resolu",
    ).length;
  if (el("tk-count-total"))
    el("tk-count-total").textContent = ticketsData.length;
  if (el("nav-count-tickets"))
    el("nav-count-tickets").textContent = ticketsData.filter(
      (t) => t.status !== "resolu",
    ).length;
}

function renderTkCard(t, colKey) {
  const m = tkTypeMeta(t.typeKey);
  const age = tkAge(t.date);
  const urg = colKey !== "resolu" ? tkUrgency(t.date) : null;
  const urgDot = urg
    ? `<span class="tc-urg" style="background:${urg.dot};" title="${urg.title}"></span>`
    : "";
  const badge = `<span class="tc-badge" style="background:${m.bg};border:1px solid ${m.border};color:${m.color};">${t.type}</span>`;
  let action = "";
  if (colKey === "attente")
    action = `<button class="tc-action tc-action-take" onclick="event.stopPropagation();treatTicket('${t.id}')">→ Prendre en charge</button>`;
  else if (colKey === "en_cours")
    action = `<button class="tc-action tc-action-resolve" onclick="event.stopPropagation();resolveTicket('${t.id}')">✓ Résoudre</button>`;

  return `
    <div class="ticket-card" onclick="openTkModal('${t.id}')">
      <div class="tc-top">
        <span class="tc-id">${t.id} ${urgDot}</span>
        <span class="tc-date">${age}</span>
      </div>
      <div class="tc-film">${t.film}</div>
      <div class="tc-author">${t.author}</div>
      ${badge}
      <div class="tc-reporter">Signalé par ${t.reporter}</div>
      ${action}
    </div>`;
}

function treatTicket(id) {
  const t = ticketsData.find((x) => x.id === id);
  if (!t) return;
  t.status = "en_cours";
  renderKanban();
  showToast(`🔄 ${id} pris en charge`, "ok");
}

function resolveTicket(id) {
  const t = ticketsData.find((x) => x.id === id);
  if (!t) return;
  t.status = "resolu";
  renderKanban();
  closeTkModal();
  showToast(`✓ ${id} résolu`, "ok");
}

function openTkModal(id) {
  const t = ticketsData.find((x) => x.id === id);
  if (!t) return;
  activeTkId = id;

  const m = tkTypeMeta(t.typeKey);
  const age = tkAge(t.date);
  const el = (i) => document.getElementById(i);

  el("tkm-id").textContent = t.id;
  el("tkm-film").textContent = t.film;
  el("tkm-author").textContent = `${t.author} · ${age}`;
  el("tkm-reporter").textContent = t.reporter;
  el("tkm-desc").textContent = t.desc;
  el("tkm-note").value = t.adminNote;

  const badge = el("tkm-type-badge");
  badge.textContent = t.type;
  badge.style.background = m.bg;
  badge.style.border = `1px solid ${m.border}`;
  badge.style.color = m.color;

  // Bouton "Voir le film"
  el("tkm-btn-film").onclick = () => {
    closeTkModal();
    showView("assign", document.querySelector('.nav-item[onclick*="assign"]'));
    setTimeout(() => openDrawer(t.filmId), 300);
  };

  // Boutons d'action selon statut
  const btnTake = el("tkm-btn-take");
  const btnResolve = el("tkm-btn-resolve");
  const btnRevision = el("tkm-btn-revision");
  const btnRefuse = el("tkm-btn-refuse");
  const actionsWrap = el("tkm-actions");

  const hide = (b) => {
    b.style.display = "none";
  };
  const show = (b) => {
    b.style.display = "";
  };
  [btnTake, btnResolve, btnRevision, btnRefuse].forEach(show);

  if (t.status === "resolu") {
    actionsWrap.style.display = "none";
  } else {
    actionsWrap.style.display = "";
    if (t.status === "attente") {
      hide(btnResolve);
      btnTake.onclick = () => {
        saveTkNote(id);
        treatTicket(id);
        closeTkModal();
      };
      btnRevision.onclick = () => {
        saveTkNote(id);
        askRevision(id);
      };
      btnRefuse.onclick = () => {
        saveTkNote(id);
        refuseFromTicket(id);
      };
    } else {
      hide(btnTake);
      btnResolve.onclick = () => {
        saveTkNote(id);
        resolveTicket(id);
      };
      btnRevision.onclick = () => {
        saveTkNote(id);
        askRevision(id);
      };
      btnRefuse.onclick = () => {
        saveTkNote(id);
        refuseFromTicket(id);
      };
    }
  }

  el("tk-modal-overlay").classList.add("open");
}

function saveTkNote(id) {
  const t = ticketsData.find((x) => x.id === id);
  if (t) t.adminNote = document.getElementById("tkm-note").value;
}

function closeTkModal(e) {
  if (e && e.target !== document.getElementById("tk-modal-overlay")) return;
  document.getElementById("tk-modal-overlay").classList.remove("open");
  activeTkId = null;
}

function askRevision(id) {
  const t = ticketsData.find((x) => x.id === id);
  if (!t) return;
  saveTkNote(id);
  t.status = "resolu";
  renderKanban();
  closeTkModal();
  showToast(`↩ Révision demandée au réalisateur de "${t.film}"`, "warn");
}

function refuseFromTicket(id) {
  const t = ticketsData.find((x) => x.id === id);
  if (!t) return;
  saveTkNote(id);
  t.status = "resolu";
  renderKanban();
  closeTkModal();
  showToast(`✕ Film "${t.film}" refusé · Réalisateur notifié`, "err");
}

/* ── VIDEO MODAL ── */
function openVideoModal(filmId) {
  const f = films.find((x) => x.id === filmId);
  if (!f) return;
  document.getElementById("vid-modal-title").textContent = f.title;
  document.getElementById("vid-modal-sub").textContent =
    (f.author || "") + (f.country ? " · " + f.country : "");
  const vid = document.getElementById("vid-modal-video");
  vid.currentTime = 0;
  document.getElementById("vid-modal-overlay").classList.add("open");
  vid.play().catch(() => {});
}

function toggleVideoFullscreen() {
  const vid = document.getElementById("vid-modal-video");
  if (!document.fullscreenElement) {
    (vid.requestFullscreen || vid.webkitRequestFullscreen || vid.mozRequestFullScreen).call(vid);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen).call(document);
  }
}

function closeVideoModal(e) {
  if (e && e.target !== document.getElementById("vid-modal-overlay")) return;
  document.getElementById("vid-modal-video").pause();
  document.getElementById("vid-modal-overlay").classList.remove("open");
}

/* ── EMAIL MODAL ── */
let pendingEmailAction = null;

const emailTemplates = {
  droits: {
    revision: {
      subject: "marsAI 2026 — Problème de droits musicaux · Révision requise",
      body: (film, author) =>
        `Bonjour ${author},\n\nNous avons bien visionné votre film "${film}" soumis au festival marsAI 2026.\n\nMalheureusement, nous avons identifié un problème concernant les droits musicaux dans votre œuvre. Une ou plusieurs pistes musicales utilisées ne semblent pas disposer des autorisations nécessaires pour une diffusion publique et festivalière.\n\nAfin de poursuivre la sélection de votre film, nous vous demandons de :\n• Remplacer la ou les pistes musicales concernées par des compositions libres de droits ou dont vous détenez les droits, ou\n• Nous fournir une preuve des licences ou autorisations correspondantes.\n\nVous disposez de 7 jours pour soumettre une version révisée via votre espace personnel.\n\nNous restons disponibles pour toute question.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
    refuse: {
      subject: "marsAI 2026 — Décision de sélection · Film non retenu",
      body: (film, author) =>
        `Bonjour ${author},\n\nNous vous remercions de votre participation au festival marsAI 2026 et de la confiance accordée à notre manifestation.\n\nAprès examen de votre film "${film}", nous sommes dans l'impossibilité de le retenir en sélection. En raison d'un problème non résolu concernant les droits musicaux, le film ne peut être diffusé dans le cadre du festival sans risque d'infraction aux droits d'auteur.\n\nNous espérons avoir l'occasion de découvrir vos prochaines créations.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
  },
  qualite: {
    revision: {
      subject:
        "marsAI 2026 — Qualité technique insuffisante · Révision requise",
      body: (film, author) =>
        `Bonjour ${author},\n\nMerci pour votre soumission au festival marsAI 2026.\n\nAprès visionnage de votre film "${film}", notre équipe a relevé des problèmes de lisibilité ou de qualité technique qui nous empêchent de le projeter dans les conditions attendues par le festival.\n\nIl peut s'agir de :\n• Une résolution vidéo insuffisante (minimum requis : 1080p)\n• Des sous-titres illisibles ou absents\n• Un son saturé, distordu ou inaudible\n• Des artefacts de compression importants\n\nNous vous invitons à soumettre une version corrigée dans un délai de 7 jours via votre espace personnel.\n\nN'hésitez pas à nous contacter si vous avez besoin de précisions techniques.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
    refuse: {
      subject: "marsAI 2026 — Décision de sélection · Film non retenu",
      body: (film, author) =>
        `Bonjour ${author},\n\nNous vous remercions d'avoir soumis votre film "${film}" au festival marsAI 2026.\n\nMalgré l'intérêt porté à votre projet, la qualité technique du fichier reçu ne correspond pas aux standards de diffusion requis par le festival. Cette décision a été prise après examen attentif de votre œuvre.\n\nNous espérons vous voir participer à de prochaines éditions.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
  },
  youtube: {
    revision: {
      subject: "marsAI 2026 — Rejet YouTube · Action requise",
      body: (film, author) =>
        `Bonjour ${author},\n\nVotre film "${film}" a été rejeté par la plateforme YouTube lors du processus d'upload automatique lié à notre diffusion en ligne.\n\nLes raisons possibles sont :\n• Contenu soumis à des réclamations ContentID (droits musicaux, visuels)\n• Métadonnées manquantes ou incorrectes\n• Format de fichier non conforme aux exigences de YouTube\n\nPour remédier à cette situation, merci de :\n• Vérifier les droits sur l'ensemble des éléments de votre film\n• Nous soumettre une version modifiée dans un délai de 5 jours\n\nSans retour de votre part, votre film ne pourra pas bénéficier d'une diffusion en ligne dans le cadre du festival.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
    refuse: {
      subject: "marsAI 2026 — Décision de sélection · Film non retenu",
      body: (film, author) =>
        `Bonjour ${author},\n\nNous vous remercions pour votre participation au festival marsAI 2026.\n\nVotre film "${film}" n'a malheureusement pas pu être retenu en sélection. Le rejet de votre film par la plateforme de diffusion YouTube, combiné à des contraintes non résolues relatives aux droits, ne nous permet pas de garantir une diffusion conforme aux exigences du festival.\n\nNous espérons avoir l'occasion de recevoir votre travail lors d'une prochaine édition.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
  },
  contenu: {
    revision: {
      subject: "marsAI 2026 — Contenu sensible signalé · Révision requise",
      body: (film, author) =>
        `Bonjour ${author},\n\nAprès visionnage de votre film "${film}", notre comité de sélection a identifié des séquences dont le contenu pourrait ne pas être compatible avec les conditions de diffusion du festival marsAI 2026 (public tout âge, diffusion publique et en ligne).\n\nNous vous demandons de revoir les séquences concernées et de nous soumettre une version modifiée dans un délai de 7 jours.\n\nSi vous estimez que ces éléments sont essentiels à votre démarche artistique, merci de nous adresser une note d'intention détaillée afin que nous puissions statuer en comité.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
    refuse: {
      subject: "marsAI 2026 — Décision de sélection · Film non retenu",
      body: (film, author) =>
        `Bonjour ${author},\n\nNous vous remercions pour votre soumission au festival marsAI 2026.\n\nAprès examen de votre film "${film}", nous ne sommes pas en mesure de le retenir en sélection. Le contenu de votre œuvre ne répond pas aux critères de diffusion publique du festival.\n\nNous espérons que vous comprendrez cette décision et vous souhaitons bonne continuation dans vos projets créatifs.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
  },
  autre: {
    revision: {
      subject: "marsAI 2026 — Signalement · Révision requise",
      body: (film, author) =>
        `Bonjour ${author},\n\nNous avons bien reçu et visionné votre film "${film}" soumis au festival marsAI 2026.\n\nSuite à l'examen de votre œuvre, notre équipe souhaite vous inviter à apporter certaines modifications avant de procéder à la sélection définitive.\n\nMerci de nous contacter ou de soumettre une version révisée dans un délai de 7 jours via votre espace personnel.\n\nNous restons disponibles pour échanger et vous accompagner.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
    refuse: {
      subject: "marsAI 2026 — Décision de sélection · Film non retenu",
      body: (film, author) =>
        `Bonjour ${author},\n\nNous vous remercions pour votre participation au festival marsAI 2026 et la confiance que vous nous accordez.\n\nAprès délibération du comité de sélection, votre film "${film}" n'a malheureusement pas été retenu pour cette édition.\n\nCette décision n'est en aucun cas un jugement définitif sur la qualité de votre travail. Nous espérons vous voir participer aux prochaines éditions du festival.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
  },
};

function openEmailModal(tkId, action) {
  const t = ticketsData.find((x) => x.id === tkId);
  if (!t) return;
  pendingEmailAction = { tkId, action };

  const f = films.find((x) => x.id === t.filmId);
  const directorEmail = f
    ? f.author
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ".") + "@exemple.fr"
    : "realisateur@exemple.fr";

  const tplGroup = emailTemplates[t.typeKey] || emailTemplates.autre;
  const tpl = tplGroup[action] || emailTemplates.autre[action];
  const bodyText = tpl.body(t.film, t.author);

  document.getElementById("em-ticket-info").textContent =
    `${t.id} · ${t.type} · ${t.film}`;
  document.getElementById("em-to").textContent = directorEmail;
  document.getElementById("em-subject").value = tpl.subject;
  document.getElementById("em-body").value = bodyText;
  document.getElementById("email-modal-overlay").classList.add("open");
}

function closeEmailModal(e) {
  if (e && e.target !== document.getElementById("email-modal-overlay")) return;
  document.getElementById("email-modal-overlay").classList.remove("open");
  pendingEmailAction = null;
}

function sendEmailAction() {
  if (!pendingEmailAction) return;
  // Email direct réalisateur (sans ticket)
  if (pendingEmailAction.filmId !== undefined) {
    const f = films.find(x => x.id === pendingEmailAction.filmId);
    closeEmailModal();
    showToast(`📧 Email envoyé à ${f ? f.author : 'le réalisateur'}`, 'ok');
    pendingEmailAction = null;
    return;
  }
  const { tkId, action } = pendingEmailAction;
  closeEmailModal();
  selActTicket(tkId, action);
}

/* ── Email direct au réalisateur (sans ticket) ── */
function openDirectorEmail(filmId, type) {
  const f = films.find(x => x.id === filmId);
  if (!f) return;
  pendingEmailAction = { filmId, type };

  const email = f.author
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '.') + '@exemple.fr';

  const tpls = {
    selection: {
      subject: 'marsAI 2026 — Félicitations ! Votre film est sélectionné Top 50',
      body: `Bonjour ${f.author},\n\nNous avons le plaisir de vous informer que votre film "${f.title}" a été sélectionné dans le Top 50 du festival marsAI 2026.\n\nVotre œuvre sera soumise à l'évaluation du jury dans les prochaines semaines. Vous recevrez une notification dès que la délibération sera terminée.\n\nMerci de votre confiance et bonne continuation.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
    finaliste: {
      subject: 'marsAI 2026 — Votre film est finaliste 🏆',
      body: `Bonjour ${f.author},\n\nFélicitations !\n\nNous avons l'honneur de vous annoncer que votre film "${f.title}" a été sélectionné parmi les 5 finalistes du festival marsAI 2026.\n\nVous êtes officiellement invité(e) à la cérémonie de remise des prix qui se tiendra à Marseille. Des informations pratiques vous seront communiquées prochainement (lieu exact, date, accréditations).\n\nEncore toutes nos félicitations pour votre travail remarquable.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
    revision: {
      subject: 'marsAI 2026 — Votre candidature · Révision souhaitée',
      body: `Bonjour ${f.author},\n\nNous avons bien visionné votre film "${f.title}" soumis au festival marsAI 2026.\n\nSuite à l'examen de votre œuvre par notre comité, nous souhaiterions que vous apportiez certaines modifications avant la sélection définitive.\n\n[Précisez ici les modifications souhaitées]\n\nMerci de soumettre une version révisée dans un délai de 7 jours via votre espace personnel.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
    refuse: {
      subject: 'marsAI 2026 — Décision de sélection · Film non retenu',
      body: `Bonjour ${f.author},\n\nNous vous remercions pour votre participation au festival marsAI 2026 et la confiance que vous nous accordez.\n\nAprès délibération du comité de sélection, votre film "${f.title}" n'a malheureusement pas été retenu pour cette édition.\n\nCette décision n'est en aucun cas un jugement définitif sur la qualité de votre travail. Nous espérons vous voir participer aux prochaines éditions du festival.\n\nCordialement,\nL'équipe marsAI 2026`,
    },
    info: {
      subject: `marsAI 2026 — Information concernant votre film`,
      body: `Bonjour ${f.author},\n\n`,
    },
  };

  const tpl = tpls[type] || tpls.info;
  document.getElementById('em-ticket-info').textContent = `${f.title} · ${f.author}`;
  document.getElementById('em-to').textContent = email;
  document.getElementById('em-subject').value = tpl.subject;
  document.getElementById('em-body').value = tpl.body;
  document.getElementById('email-modal-overlay').classList.add('open');
}

/* ════════════════════════════════════════════
   MESSAGES JURY
   ════════════════════════════════════════════ */

const chatContacts = [
  {
    id: "all",
    name: "Tout le jury",
    sub: "8 membres actifs",
    avatar: null,
    online: true,
    unread: 0,
  },
  {
    id: 1,
    name: "Marie Lefebvre",
    sub: "Présidente · Réalisatrice",
    avatar: "https://i.pravatar.cc/150?img=47",
    online: true,
    unread: 2,
  },
  {
    id: 2,
    name: "Pierre Dubois",
    sub: "Directeur artistique",
    avatar: "https://i.pravatar.cc/150?img=12",
    online: true,
    unread: 0,
  },
  {
    id: 3,
    name: "Kenji Ito",
    sub: "Artiste numérique",
    avatar: "https://i.pravatar.cc/150?img=68",
    online: false,
    unread: 0,
  },
  {
    id: 4,
    name: "Sofia Eriksson",
    sub: "Critique de cinéma",
    avatar: "https://i.pravatar.cc/150?img=44",
    online: true,
    unread: 1,
  },
  {
    id: 7,
    name: "Amara Touré",
    sub: "Productrice",
    avatar: "https://i.pravatar.cc/150?img=32",
    online: false,
    unread: 0,
  },
  {
    id: 8,
    name: "Elena Petrov",
    sub: "Compositrice",
    avatar: "https://i.pravatar.cc/150?img=29",
    online: true,
    unread: 0,
  },
  {
    id: 9,
    name: "Yuki Nakamura",
    sub: "Réalisatrice",
    avatar: "https://i.pravatar.cc/150?img=56",
    online: false,
    unread: 0,
  },
  {
    id: 10,
    name: "Carlos Ruiz",
    sub: "Chef opérateur",
    avatar: "https://i.pravatar.cc/150?img=18",
    online: true,
    unread: 0,
  },
];

const chatHistory = {
  all: [
    {
      from: "admin",
      text: "Bonjour à tous, rappel : les évaluations de la phase 1 sont à finaliser avant le 12/12/26.",
      time: "09:00",
    },
    {
      from: 1,
      name: "Marie L.",
      avatar: "https://i.pravatar.cc/150?img=47",
      text: "Bien reçu ! J'ai encore 3 films à visionner.",
      time: "09:14",
    },
    {
      from: 4,
      name: "Sofia E.",
      avatar: "https://i.pravatar.cc/150?img=44",
      text: "Pareil, je les termine ce soir.",
      time: "09:22",
    },
    {
      from: 2,
      name: "Pierre D.",
      avatar: "https://i.pravatar.cc/150?img=12",
      text: 'J\'ai une question sur le film "Frontières Douces" — peut-on en discuter ?',
      time: "10:05",
    },
  ],
  1: [
    {
      from: 1,
      name: "Marie L.",
      avatar: "https://i.pravatar.cc/150?img=47",
      text: "Bonjour, j'ai terminé mes évaluations. Quid du film n°7 ?",
      time: "11:30",
    },
    {
      from: "admin",
      text: "Bonjour Marie, le film n°7 est en délibération. On en discute ce jeudi.",
      time: "11:45",
    },
    {
      from: 1,
      name: "Marie L.",
      avatar: "https://i.pravatar.cc/150?img=47",
      text: 'Parfait, merci. Je l\'ai mis en "À discuter" de mon côté.',
      time: "11:47",
    },
  ],
  4: [
    {
      from: 4,
      name: "Sofia E.",
      avatar: "https://i.pravatar.cc/150?img=44",
      text: 'Bonsoir, j\'ai un souci technique : je ne vois pas le film "Signal Perdu" dans ma liste.',
      time: "18:10",
    },
  ],
};

/* ════════════════════════════════════════════
   SIDEBAR CHAT JURY
   ════════════════════════════════════════════ */

let scOpen = false;
let scContact = "all";

function toggleSidebarChat() {
  scOpen = !scOpen;
  document.getElementById("sc-panel").classList.toggle("open", scOpen);
  document.getElementById("sc-toggle-btn").classList.toggle("open", scOpen);
  if (scOpen) {
    renderSCContacts();
    renderSCMessages(scContact);
  }
}

function updateSCBadge() {
  const total = chatContacts
    .filter((c) => c.id !== "all")
    .reduce((s, c) => s + c.unread, 0);
  const b = document.getElementById("sc-badge");
  if (b) {
    b.textContent = total;
    b.style.display = total > 0 ? "" : "none";
  }
}

function renderSCContacts() {
  const row = document.getElementById("sc-contacts-row");
  if (!row) return;
  row.innerHTML = chatContacts
    .map((c) => {
      const isActive = c.id === scContact;
      const avHtml =
        c.id === "all"
          ? `<div class="sc-av sc-av-all">📢</div>`
          : `<div class="sc-av">
           <img src="${c.avatar}" alt="${c.name}">
           ${c.online ? '<div class="sc-dot"></div>' : ""}
           ${c.unread > 0 ? `<div class="sc-cb-unread">${c.unread}</div>` : ""}
         </div>`;
      const label = c.id === "all" ? "Tous" : c.name.split(" ")[0];
      return `<div class="sc-cb ${isActive ? "active" : ""}" onclick="selectSCContact(${JSON.stringify(c.id)})">
      ${avHtml}
      <div class="sc-lbl">${label}</div>
    </div>`;
    })
    .join("");
}

function selectSCContact(id) {
  scContact = id;
  const c = chatContacts.find((x) => x.id === id);
  if (c) c.unread = 0;
  renderSCContacts();
  renderSCMessages(id);
}

function renderSCMessages(contactId) {
  const msgs = chatHistory[contactId] || [];
  const el = document.getElementById("sc-messages");
  if (!el) return;
  el.innerHTML = msgs.length
    ? msgs
        .map((m) => {
          const isMe = m.from === "admin";
          const who = isMe ? "Vous" : m.name || "?";
          return `<div class="sc-msg ${isMe ? "sc-msg-me" : ""}">
          <div class="sc-bubble">${m.text.replace(/</g, "&lt;")}</div>
          <div class="sc-meta">${who} · ${m.time}</div>
        </div>`;
        })
        .join("")
    : `<div style="text-align:center;color:var(--mist);font-size:0.68rem;padding:16px 0;opacity:0.6;">Aucun message</div>`;
  el.scrollTop = el.scrollHeight;
}

function sendSidebarMsg() {
  const inp = document.getElementById("sc-input");
  const text = inp.value.trim();
  if (!text) return;
  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");
  if (!chatHistory[scContact]) chatHistory[scContact] = [];
  chatHistory[scContact].push({ from: "admin", text, time });
  inp.value = "";
  renderSCMessages(scContact);
}

// Init badge au chargement
updateSCBadge();

// ── Responsive mobile panel ─────────────────────────────────────
const AP_MOBILE_BP = 768;
function apIsMobile() {
  return window.innerWidth <= AP_MOBILE_BP;
}

function injectMobilePanelUI() {
  const topbar = document.querySelector(".topbar");
  if (topbar && !document.getElementById("ap-burger")) {
    const btn = document.createElement("button");
    btn.id = "ap-burger";
    btn.className = "ap-mobile-btn";
    btn.type = "button";
    btn.innerHTML = "☰";
    btn.setAttribute("aria-label", "Menu");
    btn.onclick = function () {
      document.body.classList.toggle("panel-sidebar-open");
    };
    topbar.insertBefore(btn, topbar.firstChild);
  }
  if (!document.getElementById("ap-mobile-overlay")) {
    const ov = document.createElement("div");
    ov.id = "ap-mobile-overlay";
    ov.onclick = function () {
      document.body.classList.remove("panel-sidebar-open");
    };
    document.body.appendChild(ov);
  }
}

function applyPanelResponsive() {
  if (apIsMobile()) {
    injectMobilePanelUI();
    document.getElementById("ap-burger").style.display = "flex";
    document.body.classList.remove("sidebar-collapsed");
  } else {
    const b = document.getElementById("ap-burger");
    if (b) b.style.display = "none";
    document.body.classList.remove("panel-sidebar-open");
  }
}
applyPanelResponsive();
window.addEventListener("resize", applyPanelResponsive);

// Toggle sidebar gauche — desktop collapse / mobile drawer
function toggleSidebar() {
  if (apIsMobile()) {
    document.body.classList.toggle("panel-sidebar-open");
  } else {
    document.body.classList.toggle("sidebar-collapsed");
  }
}

// ── Mobile Chat FAB : ouvre la sidebar + le panneau chat ──
function openMobileChat() {
  // 1. Ouvrir la sidebar mobile
  document.body.classList.add("panel-sidebar-open");
  // 2. Ouvrir le panneau chat (si pas déjà ouvert)
  if (!scOpen) {
    toggleSidebarChat();
  }
  // 3. Scroll la sidebar pour afficher le chat
  const scWrap = document.getElementById("sc-wrap");
  if (scWrap) scWrap.scrollIntoView({ behavior: "smooth", block: "end" });
}

// Init phases status (after adminDecisions is declared)
renderPhasesStatus();
