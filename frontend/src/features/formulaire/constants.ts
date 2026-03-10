import type { StepDefinition, CountryOption, SelectOption, FormDepotData } from "./types";

export const STEPS: StepDefinition[] = [
    { number: 1, title: "Profil réalisateur", sub: "Identité & contact", icon: "👤" },
    { number: 2, title: "Le Film", sub: "Titre FR/EN, synopsis, vidéo", icon: "🎬" },
    { number: 3, title: "Déclaration IA", sub: "Type de prod. & outils", icon: "🤖" },
    { number: 4, title: "Confirmation", sub: "Récap & RGPD", icon: "✅" },
];

export const COUNTRIES: CountryOption[] = [
    { value: "FR", label: "🇫🇷 France" },
    { value: "BE", label: "🇧🇪 Belgique" },
    { value: "CH", label: "🇨🇭 Suisse" },
    { value: "CA", label: "🇨🇦 Canada" },
    { value: "MA", label: "🇲🇦 Maroc" },
    { value: "TN", label: "🇹🇳 Tunisie" },
    { value: "DZ", label: "🇩🇿 Algérie" },
    { value: "SN", label: "🇸🇳 Sénégal" },
    { value: "JP", label: "🇯🇵 Japon" },
    { value: "US", label: "🇺🇸 États-Unis" },
    { value: "GB", label: "🇬🇧 Royaume-Uni" },
    { value: "DE", label: "🇩🇪 Allemagne" },
    { value: "ES", label: "🇪🇸 Espagne" },
    { value: "IT", label: "🇮🇹 Italie" },
    { value: "BR", label: "🇧🇷 Brésil" },
    { value: "IN", label: "🇮🇳 Inde" },
    { value: "CN", label: "🇨🇳 Chine" },
    { value: "AU", label: "🇦🇺 Australie" },
    { value: "other", label: "🌍 Autre pays" },
];

export const LANGUAGES: SelectOption[] = [
    { value: "fr", label: "🇫🇷 Français" },
    { value: "en", label: "🇬🇧 Anglais" },
    { value: "es", label: "🇪🇸 Espagnol" },
    { value: "ar", label: "🌍 Arabe" },
    { value: "de", label: "🇩🇪 Allemand" },
    { value: "it", label: "🇮🇹 Italien" },
    { value: "pt", label: "🇧🇷 Portugais" },
    { value: "zh", label: "🇨🇳 Mandarin" },
    { value: "ja", label: "🇯🇵 Japonais" },
    { value: "sans", label: "🔇 Sans dialogue (film muet)" },
    { value: "autre", label: "Autre langue" },
];

export const DISCOVERY_OPTIONS: SelectOption[] = [
    { value: "rs", label: "Réseaux sociaux" },
    { value: "presse", label: "Presse / Média" },
    { value: "bouche", label: "Bouche à oreille" },
    { value: "ecole", label: "École / Université" },
    { value: "partenaire", label: "Partenaire / Festival" },
    { value: "newsletter", label: "Newsletter" },
    { value: "autre", label: "Autre" },
];

export const VIDEO_MIN_DURATION = 58;
export const VIDEO_MAX_DURATION = 62;
export const VIDEO_ACCEPTED_TYPES = ["video/mp4", "video/quicktime"];
export const VIDEO_ACCEPTED_EXTENSIONS = ["mp4", "mov"];
export const SUBTITLE_ACCEPTED = ".srt,.vtt";

export const TITLE_MAX_LENGTH = 100;
export const SYNOPSIS_MAX_LENGTH = 300;
export const INTENTION_MAX_LENGTH = 1000;
export const OUTILS_MAX_LENGTH = 1000;

export const INITIAL_FORM_DATA: FormDepotData = {
    civilite: "M",
    prenom: "",
    nom: "",
    dob: "",
    metier: "",
    email: "",
    tel: "",
    mobile: "",
    rue: "",
    cp: "",
    ville: "",
    pays: "",
    youtube: "",
    instagram: "",
    linkedin: "",
    facebook: "",
    xtwitter: "",
    discovery: "",
    newsletter: false,
    titre: "",
    titreEn: "",
    langue: "",
    tags: "",
    synopsis: "",
    synopsisEn: "",
    intention: "",
    outils: "",
    iaClass: "full",
    iaImg: "",
    iaSon: "",
    iaScenario: "",
    iaPost: "",
};

export const RGPD_ITEMS = [
    {
        title: "Cession de droits de diffusion",
        description:
            "J'accorde à marsAI et à ses partenaires (La Plateforme, Mobile Film Festival) le droit de diffuser, projeter et archiver mon film dans le cadre du festival et de sa plateforme en ligne, pour une durée de 5 ans.",
    },
    {
        title: "Conformité RGPD",
        description:
            "J'accepte que mes données personnelles (nom, email, pays) soient conservées 3 ans après le festival conformément au RGPD, puis supprimées ou anonymisées. Je peux exercer mes droits d'accès et de suppression à tout moment.",
    },
    {
        title: "Originalité de l'œuvre",
        description:
            "Je certifie être l'auteur ou co-auteur de ce film, que celui-ci n'a pas été soumis à un autre festival concurrent, et que l'usage des outils IA déclarés est exact et complet.",
    },
];
