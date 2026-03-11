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
        gradient: "from-aurora/50 via-[#0a1628]",
    },
    {
        flag: "🇹🇳",
        author: "Amira Ben Said",
        title: "L'Enfant-Pixel",
        country: "Tunisie",
        gradient: "from-lavande/50 via-[#140a28]",
    },
    {
        flag: "🇯🇵",
        author: "Kenji Ito",
        title: "Archipel 2048",
        country: "Japon",
        gradient: "from-solar/40 via-[#1a1400]",
    },
    {
        flag: "🇪🇸",
        author: "Carlos Ruiz",
        title: "Mémoire Vive",
        country: "Espagne",
        gradient: "from-coral/50 via-[#280a0a]",
    },
    {
        flag: "🇮🇳",
        author: "Priya Mehta",
        title: "Les Nouveaux Soleils",
        country: "Inde",
        gradient: "from-blue-500/50 via-[#0a1428]",
    },
    {
        flag: "🇸🇳",
        author: "Omar Diallo",
        title: "Frontières Douces",
        country: "Sénégal",
        gradient: "from-emerald-500/50 via-[#0a2814]",
    },
    {
        flag: "🇸🇪",
        author: "Sofia Ek",
        title: "Vague Numérique",
        country: "Suède",
        gradient: "from-pink-500/50 via-[#280a1e]",
    },
    {
        flag: "🇨🇳",
        author: "Lin Wei",
        title: "Jardin des Codes",
        country: "Chine",
        gradient: "from-indigo-500/50 via-[#0a0a28]",
    },
    {
        flag: "🇧🇷",
        author: "Yuki Tanaka",
        title: "Cartographie",
        country: "Brésil",
        gradient: "from-orange-500/50 via-[#281400]",
    },
    {
        flag: "🇩🇪",
        author: "Mia Schultz",
        title: "Horizon Zéro",
        country: "Allemagne",
        gradient: "from-teal-500/50 via-[#0a2828]",
    },
];

const FILMS_ROW2: Film[] = [
    {
        flag: "🇰🇷",
        author: "Ji-young Park",
        title: "Résonance Digitale",
        country: "Corée du Sud",
        gradient: "from-aurora/40 via-[#0a1e28]",
    },
    {
        flag: "🇧🇷",
        author: "Valentina Costa",
        title: "Archipel d'Âmes",
        country: "Brésil",
        gradient: "from-lavande/40 via-[#1e0a28]",
    },
    {
        flag: "🇲🇦",
        author: "Yasmine El Fassi",
        title: "Lumière Artificielle",
        country: "Maroc",
        gradient: "from-solar/35 via-[#281e00]",
    },
    {
        flag: "🇺🇸",
        author: "Alex Chen",
        title: "Demain Commence",
        country: "États-Unis",
        gradient: "from-coral/40 via-[#280a14]",
    },
    {
        flag: "🇮🇹",
        author: "Marco Ferretti",
        title: "Ombres Portées",
        country: "Italie",
        gradient: "from-blue-400/50 via-[#00141e]",
    },
    {
        flag: "🇳🇬",
        author: "Chioma Adeyemi",
        title: "Racines Futures",
        country: "Nigéria",
        gradient: "from-emerald-400/50 via-[#001e0a]",
    },
    {
        flag: "🇷🇺",
        author: "Anastasia Volkov",
        title: "Code Vivant",
        country: "Russie",
        gradient: "from-pink-400/50 via-[#1e0014]",
    },
    {
        flag: "🇦🇺",
        author: "Noah Williams",
        title: "Le Dernier Pixel",
        country: "Australie",
        gradient: "from-indigo-400/50 via-[#00001e]",
    },
    {
        flag: "🇵🇱",
        author: "Maja Kowalski",
        title: "Entre les Lignes",
        country: "Pologne",
        gradient: "from-orange-400/50 via-[#1e0a00]",
    },
    {
        flag: "🇲🇽",
        author: "Diego Hernández",
        title: "Futur Passé",
        country: "Mexique",
        gradient: "from-teal-400/50 via-[#001e1e]",
    },
];

const FilmCard = ({ film }: FilmCardProps): React.JSX.Element => (
    <div className="group flex-shrink-0 w-56 cursor-pointer relative transition-transform duration-200 hover:scale-[1.08] hover:z-20">
        {/* Thumbnail 16:9 */}
        <div
            className={`aspect-video bg-gradient-to-br ${film.gradient} to-black relative overflow-hidden rounded-sm`}
        >
            {/* Grain texture overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

            {/* Badge marsAI — style Netflix "N" */}
            <div className="absolute top-2 left-2 font-display text-xs font-black text-aurora leading-none select-none">
                M
            </div>

            {/* Durée */}
            <span className="absolute top-2 right-2 font-mono text-[10px] text-white/60 bg-black/60 rounded px-1.5 py-0.5">
                1:00
            </span>

            {/* Gradient bas pour le texte */}
            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Bouton play — visible au hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-2xl">
                    <span className="text-black font-bold text-sm ml-0.5" aria-hidden="true">
                        ▶
                    </span>
                </div>
            </div>

            {/* Titre + auteur overlaid en bas */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
                <div className="font-bold text-[13px] text-white leading-tight truncate drop-shadow-lg">
                    {film.title}
                </div>
                <div className="text-[11px] text-white/50 mt-0.5 truncate">
                    {film.flag} {film.author}
                </div>
            </div>
        </div>

        {/* Barre pays — Netflix-style sous la carte */}
        <div className="px-0.5 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-aurora/80">{film.country}</span>
                <span className="font-mono text-[11px] text-white/30">IA · 2026</span>
            </div>
        </div>
    </div>
);

interface CarouselRowProps {
    label: string;
    films: Film[];
    direction: "left" | "right";
}

const CarouselRow = ({ label, films, direction }: CarouselRowProps): React.JSX.Element => (
    <div className="mb-10">
        {/* Label de rangée style Netflix */}
        <div className="max-w-full px-12 mb-3 flex items-center gap-3">
            <span className="text-sm font-semibold text-white">{label}</span>
            <span className="text-xs font-mono text-aurora hover:underline cursor-pointer transition-colors">
                Tout voir &rsaquo;
            </span>
        </div>

        {/* Carousel avec fondus */}
        <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <div
                className={`flex gap-2 w-max px-12 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
            >
                {films.map((film, i) => (
                    <FilmCard key={`${direction}-${i}`} film={film} />
                ))}
            </div>
        </div>
    </div>
);

const FilmsSection = (): React.JSX.Element => {
    const row1Doubled = [...FILMS_ROW1, ...FILMS_ROW1];
    const row2Doubled = [...FILMS_ROW2, ...FILMS_ROW2];

    return (
        <section id="films" className="py-16 bg-black">
            {/* Header style Netflix */}
            <div className="px-12 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-display font-black text-2xl text-aurora">M</span>
                    <div className="h-5 w-px bg-white/20" />
                    <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                        Sélection Officielle
                    </span>
                </div>
                <h2 className="font-display text-3xl lg:text-4xl font-black text-white mb-1">
                    En compétition
                </h2>
                <p className="text-white/40 text-sm font-mono">
                    50 films · 120+ pays · marsAI 2026
                </p>
            </div>

            <CarouselRow label="Bientôt sur marsAI" films={row1Doubled} direction="left" />
            <CarouselRow label="Sélection internationale" films={row2Doubled} direction="right" />
        </section>
    );
};

export default FilmsSection;
