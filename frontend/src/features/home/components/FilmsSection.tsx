import React from "react";

interface Film {
    flag: string;
    author: string;
    title: string;
    country: string;
    gradient: string;
}

interface FilmCardProps {
    film: Film;
}

const FILMS_ROW1: Film[] = [
    {
        flag: "🇫🇷",
        author: "Léa Fontaine",
        title: "Rêves de Silicium",
        country: "France",
        gradient: "from-aurora/40 via-surface-2",
    },
    {
        flag: "🇹🇳",
        author: "Amira Ben Said",
        title: "L'Enfant-Pixel",
        country: "Tunisie",
        gradient: "from-lavande/40 via-surface-2",
    },
    {
        flag: "🇯🇵",
        author: "Kenji Ito",
        title: "Archipel 2048",
        country: "Japon",
        gradient: "from-solar/30 via-surface-2",
    },
    {
        flag: "🇪🇸",
        author: "Carlos Ruiz",
        title: "Mémoire Vive",
        country: "Espagne",
        gradient: "from-coral/40 via-surface-2",
    },
    {
        flag: "🇮🇳",
        author: "Priya Mehta",
        title: "Les Nouveaux Soleils",
        country: "Inde",
        gradient: "from-blue-500/40 via-surface-2",
    },
    {
        flag: "🇸🇳",
        author: "Omar Diallo",
        title: "Frontières Douces",
        country: "Sénégal",
        gradient: "from-emerald-500/40 via-surface-2",
    },
    {
        flag: "🇸🇪",
        author: "Sofia Ek",
        title: "Vague Numérique",
        country: "Suède",
        gradient: "from-pink-500/40 via-surface-2",
    },
    {
        flag: "🇨🇳",
        author: "Lin Wei",
        title: "Jardin des Codes",
        country: "Chine",
        gradient: "from-indigo-500/40 via-surface-2",
    },
    {
        flag: "🇧🇷",
        author: "Yuki Tanaka",
        title: "Cartographie",
        country: "Brésil",
        gradient: "from-orange-500/40 via-surface-2",
    },
    {
        flag: "🇩🇪",
        author: "Mia Schultz",
        title: "Horizon Zéro",
        country: "Allemagne",
        gradient: "from-teal-500/40 via-surface-2",
    },
];

const FILMS_ROW2: Film[] = [
    {
        flag: "🇰🇷",
        author: "Ji-young Park",
        title: "Résonance Digitale",
        country: "Corée du Sud",
        gradient: "from-aurora/35 via-surface-2",
    },
    {
        flag: "🇧🇷",
        author: "Valentina Costa",
        title: "Archipel d'Âmes",
        country: "Brésil",
        gradient: "from-lavande/35 via-surface-2",
    },
    {
        flag: "🇲🇦",
        author: "Yasmine El Fassi",
        title: "Lumière Artificielle",
        country: "Maroc",
        gradient: "from-solar/25 via-surface-2",
    },
    {
        flag: "🇺🇸",
        author: "Alex Chen",
        title: "Demain Commence",
        country: "États-Unis",
        gradient: "from-coral/35 via-surface-2",
    },
    {
        flag: "🇮🇹",
        author: "Marco Ferretti",
        title: "Ombres Portées",
        country: "Italie",
        gradient: "from-blue-400/40 via-surface-2",
    },
    {
        flag: "🇳🇬",
        author: "Chioma Adeyemi",
        title: "Racines Futures",
        country: "Nigéria",
        gradient: "from-emerald-400/40 via-surface-2",
    },
    {
        flag: "🇷🇺",
        author: "Anastasia Volkov",
        title: "Code Vivant",
        country: "Russie",
        gradient: "from-pink-400/40 via-surface-2",
    },
    {
        flag: "🇦🇺",
        author: "Noah Williams",
        title: "Le Dernier Pixel",
        country: "Australie",
        gradient: "from-indigo-400/40 via-surface-2",
    },
    {
        flag: "🇵🇱",
        author: "Maja Kowalski",
        title: "Entre les Lignes",
        country: "Pologne",
        gradient: "from-orange-400/40 via-surface-2",
    },
    {
        flag: "🇲🇽",
        author: "Diego Hernández",
        title: "Futur Passé",
        country: "Mexique",
        gradient: "from-teal-400/40 via-surface-2",
    },
];

const FilmCard = ({ film }: FilmCardProps): React.JSX.Element => (
    <div className="group flex-shrink-0 w-52 bg-surface-2 border border-white/8 rounded-2xl overflow-hidden hover:border-aurora/40 hover:scale-[1.03] transition-all duration-300 cursor-pointer">
        {/* Thumbnail */}
        <div
            className={`h-32 bg-gradient-to-br ${film.gradient} to-surface relative overflow-hidden`}
        >
            {/* Bottom shadow pour lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-2/90 via-transparent to-transparent" />

            {/* Drapeau en haut à gauche */}
            <span className="absolute top-2.5 left-3 text-xl drop-shadow-lg">{film.flag}</span>

            {/* Bouton play centré */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/25 flex items-center justify-center backdrop-blur-sm group-hover:bg-aurora/20 group-hover:border-aurora/50 transition-all duration-300">
                    <span className="text-white text-sm ml-0.5" aria-hidden="true">
                        ▶
                    </span>
                </div>
            </div>

            {/* Durée en bas à droite */}
            <span className="absolute bottom-2.5 right-3 font-mono text-xs bg-black/70 text-white rounded-md px-2 py-0.5 backdrop-blur-sm tracking-wide">
                1:00
            </span>
        </div>

        {/* Infos */}
        <div className="px-4 py-3">
            <div className="font-bold text-sm text-white-soft leading-snug mb-1 truncate">
                {film.title}
            </div>
            <div className="text-xs text-mist truncate">{film.author}</div>
            <div className="mt-3 pt-2.5 border-t border-white/8 flex items-center justify-between">
                <span className="font-mono text-xs text-aurora/70">{film.country}</span>
                <span className="font-mono text-xs text-mist/50">60s</span>
            </div>
        </div>
    </div>
);

const CarouselRow = ({
    films,
    direction,
}: {
    films: Film[];
    direction: "left" | "right";
}): React.JSX.Element => (
    <div className="relative overflow-hidden">
        {/* Fondu gauche */}
        <div className="absolute left-0 top-0 h-full w-28 bg-gradient-to-r from-deep-sky to-transparent z-10 pointer-events-none" />
        {/* Fondu droit */}
        <div className="absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-deep-sky to-transparent z-10 pointer-events-none" />

        <div
            className={`flex gap-4 w-max ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        >
            {films.map((film, i) => (
                <FilmCard key={`${direction}-${i}`} film={film} />
            ))}
        </div>
    </div>
);

const FilmsSection = (): React.JSX.Element => {
    const row1Doubled = [...FILMS_ROW1, ...FILMS_ROW1];
    const row2Doubled = [...FILMS_ROW2, ...FILMS_ROW2];

    return (
        <section id="films" className="py-24 overflow-hidden">
            {/* Header */}
            <div className="max-w-6xl mx-auto px-6 mb-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                            Sélection Officielle marsAI 2026
                        </div>
                        <h2 className="font-display text-4xl lg:text-5xl font-black">
                            <span className="text-aurora">50</span>
                            <span className="text-white-soft"> Films</span>
                        </h2>
                        <p className="text-mist mt-2 text-base">Imaginez des futurs souhaitables</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="font-mono text-xs border border-white/10 text-mist rounded-full px-3 py-1.5">
                            120+ pays
                        </span>
                        <span className="font-mono text-xs border border-aurora/30 text-aurora rounded-full px-3 py-1.5">
                            60s · IA générative
                        </span>
                    </div>
                </div>
            </div>

            {/* Rangée 1 — défile vers la gauche */}
            <div className="mb-4">
                <CarouselRow films={row1Doubled} direction="left" />
            </div>

            {/* Rangée 2 — défile vers la droite */}
            <CarouselRow films={row2Doubled} direction="right" />
        </section>
    );
};

export default FilmsSection;
