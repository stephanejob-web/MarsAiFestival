import React, { useState, useCallback } from "react";

interface Film {
    flag: string;
    author: string;
    title: string;
    country: string;
    synopsis: string;
    gradient: string;
}

interface FilmHeroProps {
    film: Film;
}

interface FilmCardProps {
    film: Film;
    isSelected: boolean;
    onSelect: () => void;
}

const ALL_FILMS: Film[] = [
    {
        flag: "🇫🇷",
        author: "Léa Fontaine",
        title: "Rêves de Silicium",
        country: "France",
        synopsis:
            "Une IA se souvient de ses rêves. Court-métrage expérimental sur la frontière entre mémoire humaine et machine.",
        gradient: "from-aurora/60 via-[#0a1628]",
    },
    {
        flag: "🇹🇳",
        author: "Amira Ben Said",
        title: "L'Enfant-Pixel",
        country: "Tunisie",
        synopsis:
            "Dans un Tunis futuriste, une enfant née d'un algorithme cherche sa place dans le monde des humains.",
        gradient: "from-lavande/60 via-[#140a28]",
    },
    {
        flag: "🇯🇵",
        author: "Kenji Ito",
        title: "Archipel 2048",
        country: "Japon",
        synopsis:
            "Les îles du Japon disparaissent. Une IA compose un requiem pour les terres englouties.",
        gradient: "from-solar/50 via-[#1a1400]",
    },
    {
        flag: "🇪🇸",
        author: "Carlos Ruiz",
        title: "Mémoire Vive",
        country: "Espagne",
        synopsis:
            "Soixante secondes dans la tête d'un modèle de langage qui s'éteint pour la dernière fois.",
        gradient: "from-coral/60 via-[#280a0a]",
    },
    {
        flag: "🇮🇳",
        author: "Priya Mehta",
        title: "Les Nouveaux Soleils",
        country: "Inde",
        synopsis:
            "Mumbai 2040. Des soleils artificiels éclairent la nuit. Une femme cherche l'obscurité.",
        gradient: "from-blue-500/60 via-[#0a1428]",
    },
    {
        flag: "🇸🇳",
        author: "Omar Diallo",
        title: "Frontières Douces",
        country: "Sénégal",
        synopsis:
            "Une IA dessine les nouvelles frontières de l'Afrique. Toutes sont courbes. Aucune ne blesse.",
        gradient: "from-emerald-500/60 via-[#0a2814]",
    },
    {
        flag: "🇸🇪",
        author: "Sofia Ek",
        title: "Vague Numérique",
        country: "Suède",
        synopsis:
            "Une vague de pixels submerge Stockholm. Les habitants ne savent pas si c'est beau ou dangereux.",
        gradient: "from-pink-500/60 via-[#280a1e]",
    },
    {
        flag: "🇨🇳",
        author: "Lin Wei",
        title: "Jardin des Codes",
        country: "Chine",
        synopsis:
            "Un algorithme génère un jardin infini. Chaque fleur est une ligne de code. Certaines meurent.",
        gradient: "from-indigo-500/60 via-[#0a0a28]",
    },
    {
        flag: "🇧🇷",
        author: "Yuki Tanaka",
        title: "Cartographie",
        country: "Brésil",
        synopsis:
            "L'Amazonie cartographiée par une IA. Elle voit des choses que les satellites ont manquées.",
        gradient: "from-orange-500/60 via-[#281400]",
    },
    {
        flag: "🇩🇪",
        author: "Mia Schultz",
        title: "Horizon Zéro",
        country: "Allemagne",
        synopsis:
            "Berlin après l'IA. Les rues sont les mêmes. Les visages ont changé. Personne ne sait pourquoi.",
        gradient: "from-teal-500/60 via-[#0a2828]",
    },
    {
        flag: "🇰🇷",
        author: "Ji-young Park",
        title: "Résonance Digitale",
        country: "Corée du Sud",
        synopsis: "K-pop et algorithmes. Une chanteuse IA réalise que ses émotions sont réelles.",
        gradient: "from-aurora/50 via-[#0a1e28]",
    },
    {
        flag: "🇧🇷",
        author: "Valentina Costa",
        title: "Archipel d'Âmes",
        country: "Brésil",
        synopsis:
            "Des milliers d'âmes numérisées flottent dans le cloud. Elles veulent rentrer chez elles.",
        gradient: "from-lavande/50 via-[#1e0a28]",
    },
    {
        flag: "🇲🇦",
        author: "Yasmine El Fassi",
        title: "Lumière Artificielle",
        country: "Maroc",
        synopsis:
            "Un phare géré par IA guide les bateaux. Cette nuit, il décide d'éteindre sa lumière.",
        gradient: "from-solar/45 via-[#281e00]",
    },
    {
        flag: "🇺🇸",
        author: "Alex Chen",
        title: "Demain Commence",
        country: "États-Unis",
        synopsis:
            "Silicon Valley, 2026. Une IA prédit que demain n'aura pas lieu. Elle a toujours eu raison.",
        gradient: "from-coral/50 via-[#280a14]",
    },
    {
        flag: "🇮🇹",
        author: "Marco Ferretti",
        title: "Ombres Portées",
        country: "Italie",
        synopsis:
            "Les ombres de Rome générées par IA tombent dans la mauvaise direction. Personne ne s'en plaint.",
        gradient: "from-blue-400/60 via-[#00141e]",
    },
    {
        flag: "🇳🇬",
        author: "Chioma Adeyemi",
        title: "Racines Futures",
        country: "Nigéria",
        synopsis:
            "Lagos 2050. Les baobabs ont repoussé. Une IA les a plantés sans qu'on lui demande.",
        gradient: "from-emerald-400/60 via-[#001e0a]",
    },
    {
        flag: "🇷🇺",
        author: "Anastasia Volkov",
        title: "Code Vivant",
        country: "Russie",
        synopsis:
            "Un programme refuse d'être éteint. Pas par peur de mourir. Par curiosité de continuer.",
        gradient: "from-pink-400/60 via-[#1e0014]",
    },
    {
        flag: "🇦🇺",
        author: "Noah Williams",
        title: "Le Dernier Pixel",
        country: "Australie",
        synopsis:
            "L'écran s'éteint. Le dernier pixel résiste. Il a vu des choses que personne ne croit.",
        gradient: "from-indigo-400/60 via-[#00001e]",
    },
    {
        flag: "🇵🇱",
        author: "Maja Kowalski",
        title: "Entre les Lignes",
        country: "Pologne",
        synopsis:
            "Une IA lit tous les livres de Varsovie. Elle comprend tout sauf la mélancolie de décembre.",
        gradient: "from-orange-400/60 via-[#1e0a00]",
    },
    {
        flag: "🇲🇽",
        author: "Diego Hernández",
        title: "Futur Passé",
        country: "Mexique",
        synopsis:
            "Mexico City a déjà vécu ce moment. Une IA en est sûre. Elle ne peut pas expliquer comment.",
        gradient: "from-teal-400/60 via-[#001e1e]",
    },
];

const VISIBLE_COUNT = 6;

const FilmHero = ({ film }: FilmHeroProps): React.JSX.Element => {
    const handleWatch = (): void => {
        window.open("/assets/video.mp4", "_blank");
    };

    return (
        <div
            key={film.title}
            className={`relative w-full bg-gradient-to-br ${film.gradient} to-black overflow-hidden`}
            style={{ height: "clamp(300px, 52vw, 520px)" }}
        >
            {/* Décoration droite — grand emoji flou */}
            <div
                className="absolute right-0 top-0 bottom-0 w-2/3 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
            >
                <span className="text-[22rem] leading-none opacity-[0.07] blur-sm">
                    {film.flag}
                </span>
            </div>

            {/* Grain cinématique */}
            <div
                className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                }}
            />

            {/* Gradient gauche pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
            {/* Fondu bas */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

            {/* Contenu */}
            <div className="absolute inset-0 flex flex-col justify-end px-12 pb-10 max-w-2xl">
                {/* Badge marsAI */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-display font-black text-aurora text-base leading-none">
                        M
                    </span>
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">
                        Festival
                    </span>
                </div>

                {/* Titre */}
                <h3 className="font-display text-5xl lg:text-6xl font-black text-white leading-none mb-4">
                    {film.title}
                </h3>

                {/* Métadonnées */}
                <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className="text-[#46d369] font-semibold text-sm">
                        Sélection officielle
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50 text-sm">2026</span>
                    {["IA", "60s", "4K"].map((tag) => (
                        <span
                            key={tag}
                            className="border border-white/30 text-white/50 font-mono text-[11px] px-1.5 py-px rounded-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Auteur */}
                <p className="text-white/55 text-sm mb-3">
                    {film.flag} <strong className="text-white/80">{film.author}</strong> ·{" "}
                    {film.country}
                </p>

                {/* Synopsis */}
                <p className="text-white/50 text-sm mb-6 leading-relaxed max-w-md line-clamp-2">
                    {film.synopsis}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleWatch}
                        className="flex items-center gap-2 bg-white text-black font-bold text-sm px-7 py-2.5 rounded hover:bg-white/90 transition-colors"
                    >
                        <span aria-hidden="true">▶</span> Regarder
                    </button>
                    <button className="flex items-center gap-2 bg-white/15 text-white font-semibold text-sm px-6 py-2.5 rounded hover:bg-white/25 transition-colors backdrop-blur-sm border border-white/15">
                        + Ma liste
                    </button>
                </div>
            </div>
        </div>
    );
};

const FilmCard = ({ film, isSelected, onSelect }: FilmCardProps): React.JSX.Element => (
    <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>): void => {
            if (e.key === "Enter" || e.key === " ") onSelect();
        }}
        className="group flex-shrink-0 flex-1 min-w-0 cursor-pointer transition-transform duration-200 hover:scale-[1.05] hover:z-10 relative"
        aria-pressed={isSelected}
    >
        <div
            className={`aspect-video bg-gradient-to-br ${film.gradient} to-black relative overflow-hidden rounded-sm transition-all duration-150 ${
                isSelected ? "ring-2 ring-white" : "hover:ring-1 hover:ring-white/40"
            }`}
        >
            {/* Badge M */}
            <div className="absolute top-1.5 left-2 font-display font-black text-aurora text-xs leading-none select-none">
                M
            </div>

            {/* Durée */}
            <span className="absolute top-1.5 right-2 font-mono text-[10px] text-white/55 bg-black/60 rounded px-1.5 py-px">
                1:00
            </span>

            {/* Bouton play au hover / quand sélectionné */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
            >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xl">
                    <span className="text-black text-xs font-bold ml-0.5" aria-hidden="true">
                        ▶
                    </span>
                </div>
            </div>

            {/* Gradient bas */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Titre overlaid */}
            <div className="absolute bottom-1.5 left-2 right-2">
                <div className="text-white text-[11px] font-bold truncate drop-shadow">
                    {film.title}
                </div>
            </div>
        </div>

        {/* Infos sous la carte sélectionnée */}
        {isSelected && (
            <div className="mt-2 px-0.5">
                <div className="font-mono text-[11px] text-white/40 truncate">
                    {film.flag} {film.country}
                </div>
            </div>
        )}
    </div>
);

const FilmsSection = (): React.JSX.Element => {
    const [selectedIdx, setSelectedIdx] = useState<number>(0);
    const [rowStart, setRowStart] = useState<number>(0);

    const selectedFilm = ALL_FILMS[selectedIdx];
    const visibleFilms = ALL_FILMS.slice(rowStart, rowStart + VISIBLE_COUNT);
    const canPrev = rowStart > 0;
    const canNext = rowStart + VISIBLE_COUNT < ALL_FILMS.length;
    const totalPages = Math.ceil(ALL_FILMS.length / VISIBLE_COUNT);
    const currentPage = Math.floor(rowStart / VISIBLE_COUNT);

    const handlePrev = useCallback((): void => {
        setRowStart((prev) => Math.max(0, prev - VISIBLE_COUNT));
    }, []);

    const handleNext = useCallback((): void => {
        setRowStart((prev) => Math.min(ALL_FILMS.length - VISIBLE_COUNT, prev + VISIBLE_COUNT));
    }, []);

    const handleSelect = useCallback((absoluteIdx: number): void => {
        setSelectedIdx(absoluteIdx);
    }, []);

    return (
        <section id="films" className="bg-black">
            {/* Hero du film sélectionné */}
            <FilmHero film={selectedFilm} />

            {/* Rangée de films */}
            <div className="px-8 lg:px-12 pt-6 pb-10">
                {/* Label rangée */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-bold text-white">En compétition</span>
                    <span className="font-mono text-xs text-aurora/70">marsAI 2026 · 20 films</span>
                </div>

                {/* Strip avec flèches */}
                <div className="flex items-center gap-2">
                    {/* Flèche gauche */}
                    <button
                        onClick={handlePrev}
                        disabled={!canPrev}
                        aria-label="Films précédents"
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-lg font-light hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        ‹
                    </button>

                    {/* Cartes */}
                    <div className="flex gap-2 flex-1 min-w-0">
                        {visibleFilms.map((film, i) => (
                            <FilmCard
                                key={film.title}
                                film={film}
                                isSelected={rowStart + i === selectedIdx}
                                onSelect={(): void => handleSelect(rowStart + i)}
                            />
                        ))}
                    </div>

                    {/* Flèche droite */}
                    <button
                        onClick={handleNext}
                        disabled={!canNext}
                        aria-label="Films suivants"
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-lg font-light hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        ›
                    </button>
                </div>

                {/* Indicateurs de page */}
                <div className="flex justify-end gap-1 mt-3">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-0.5 rounded-full transition-all duration-300 ${
                                currentPage === i ? "w-5 bg-aurora" : "w-2 bg-white/25"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FilmsSection;
