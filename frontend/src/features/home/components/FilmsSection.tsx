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
        country: "🇫🇷 France",
        gradient: "from-aurora/30",
    },
    {
        flag: "🇹🇳",
        author: "Amira Ben Said",
        title: "L'Enfant-Pixel",
        country: "🇹🇳 Tunisie",
        gradient: "from-lavande/30",
    },
    {
        flag: "🇯🇵",
        author: "Kenji Ito",
        title: "Archipel 2048",
        country: "🇯🇵 Japon",
        gradient: "from-solar/20",
    },
    {
        flag: "🇪🇸",
        author: "Carlos Ruiz",
        title: "Mémoire Vive",
        country: "🇪🇸 Espagne",
        gradient: "from-coral/30",
    },
    {
        flag: "🇮🇳",
        author: "Priya Mehta",
        title: "Les Nouveaux Soleils",
        country: "🇮🇳 Inde",
        gradient: "from-blue-500/30",
    },
    {
        flag: "🇸🇳",
        author: "Omar Diallo",
        title: "Frontières Douces",
        country: "🇸🇳 Sénégal",
        gradient: "from-emerald-500/30",
    },
    {
        flag: "🇸🇪",
        author: "Sofia Ek",
        title: "Vague Numérique",
        country: "🇸🇪 Suède",
        gradient: "from-pink-500/30",
    },
    {
        flag: "🇨🇳",
        author: "Lin Wei",
        title: "Jardin des Codes",
        country: "🇨🇳 Chine",
        gradient: "from-indigo-500/30",
    },
    {
        flag: "🇧🇷",
        author: "Yuki Tanaka",
        title: "Cartographie",
        country: "🇧🇷 Brésil",
        gradient: "from-orange-500/30",
    },
    {
        flag: "🇩🇪",
        author: "Mia Schultz",
        title: "Horizon Zéro",
        country: "🇩🇪 Allemagne",
        gradient: "from-teal-500/30",
    },
];

const FILMS_ROW2: Film[] = [
    {
        flag: "🇰🇷",
        author: "Ji-young Park",
        title: "Résonance Digitale",
        country: "🇰🇷 Corée du Sud",
        gradient: "from-aurora/25",
    },
    {
        flag: "🇧🇷",
        author: "Valentina Costa",
        title: "Archipel d'Âmes",
        country: "🇧🇷 Brésil",
        gradient: "from-lavande/25",
    },
    {
        flag: "🇲🇦",
        author: "Yasmine El Fassi",
        title: "Lumière Artificielle",
        country: "🇲🇦 Maroc",
        gradient: "from-solar/20",
    },
    {
        flag: "🇺🇸",
        author: "Alex Chen",
        title: "Demain Commence",
        country: "🇺🇸 États-Unis",
        gradient: "from-coral/25",
    },
    {
        flag: "🇮🇹",
        author: "Marco Ferretti",
        title: "Ombres Portées",
        country: "🇮🇹 Italie",
        gradient: "from-blue-400/30",
    },
    {
        flag: "🇳🇬",
        author: "Chioma Adeyemi",
        title: "Racines Futures",
        country: "🇳🇬 Nigéria",
        gradient: "from-emerald-400/30",
    },
    {
        flag: "🇷🇺",
        author: "Anastasia Volkov",
        title: "Code Vivant",
        country: "🇷🇺 Russie",
        gradient: "from-pink-400/30",
    },
    {
        flag: "🇦🇺",
        author: "Noah Williams",
        title: "Le Dernier Pixel",
        country: "🇦🇺 Australie",
        gradient: "from-indigo-400/30",
    },
    {
        flag: "🇵🇱",
        author: "Maja Kowalski",
        title: "Entre les Lignes",
        country: "🇵🇱 Pologne",
        gradient: "from-orange-400/30",
    },
    {
        flag: "🇲🇽",
        author: "Diego Hernández",
        title: "Futur Passé",
        country: "🇲🇽 Mexique",
        gradient: "from-teal-400/30",
    },
];

const FilmCard = ({ film }: FilmCardProps): React.JSX.Element => (
    <div className="flex-shrink-0 w-44 bg-surface-2 border border-white/5 rounded-xl overflow-hidden">
        <div className={`h-24 bg-gradient-to-br ${film.gradient} to-surface relative`}>
            <div
                className="absolute inset-0 flex items-center justify-center text-2xl opacity-50"
                aria-hidden="true"
            >
                ▶
            </div>
            <span className="absolute bottom-2 right-2 font-mono text-xs bg-black/60 text-white rounded px-1.5 py-0.5">
                1:00
            </span>
        </div>
        <div className="p-3">
            <div className="text-xs text-mist mb-1">
                {film.flag} {film.author}
            </div>
            <div className="text-xs font-bold text-white-soft mb-2 leading-snug">{film.title}</div>
            <span className="text-xs bg-surface border border-white/10 text-mist rounded px-2 py-0.5">
                {film.country}
            </span>
        </div>
    </div>
);

const FilmsSection = (): React.JSX.Element => {
    const row1Doubled = [...FILMS_ROW1, ...FILMS_ROW1];
    const row2Doubled = [...FILMS_ROW2, ...FILMS_ROW2];

    return (
        <section id="films" className="py-24 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 mb-10">
                <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                    Sélection Officielle marsAI 2026
                </div>
                <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft">
                    50 Films · Imaginez des futurs souhaitables
                </h2>
            </div>

            {/* Row 1 — scroll left */}
            <div className="overflow-hidden mb-4">
                <div className="flex gap-3 w-max animate-marquee-left">
                    {row1Doubled.map((film, i) => (
                        <FilmCard key={`r1-${i}`} film={film} />
                    ))}
                </div>
            </div>

            {/* Row 2 — scroll right */}
            <div className="overflow-hidden">
                <div className="flex gap-3 w-max animate-marquee-right">
                    {row2Doubled.map((film, i) => (
                        <FilmCard key={`r2-${i}`} film={film} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FilmsSection;
