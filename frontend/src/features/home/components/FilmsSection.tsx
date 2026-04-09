import React, { useState, useRef, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../../../constants/api";

interface Film {
    id: number;
    original_title: string;
    english_title: string | null;
    language: string;
    synopsis: string | null;
    poster_img: string | null;
    video_url: string | null;
    ia_class: string;
    realisator_name: string | null;
    realisator_country: string | null;
}

const FLAG: Record<string, string> = {
    France: "🇫🇷",
    "United States": "🇺🇸",
    Japan: "🇯🇵",
    Brazil: "🇧🇷",
    Germany: "🇩🇪",
    Spain: "🇪🇸",
    Italy: "🇮🇹",
    "United Kingdom": "🇬🇧",
    Canada: "🇨🇦",
};

const flag = (country: string | null): string => (country ? (FLAG[country] ?? "🌍") : "🌍");

const GRADIENTS = [
    "from-[#0f1535] to-[#1a0a2e]",
    "from-[#0a1f2e] to-[#0f1535]",
    "from-[#1a0f2e] to-[#0a1a1f]",
    "from-[#0f2010] to-[#0a1535]",
    "from-[#2e0f1a] to-[#0f0a2e]",
];

const VISIBLE_COUNT = 6;

// ── Film Hero ─────────────────────────────────────────────────────────────────

const FilmHero = ({ film }: { film: Film }): React.JSX.Element => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loadingUrl, setLoadingUrl] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setSignedUrl(null);
        setLoadingUrl(true);

        const load = async (): Promise<void> => {
            try {
                const r = await fetch(`${API_BASE_URL}/api/public/films/${film.id}/video`);
                const json = await r.json();
                if (!cancelled && json.success) setSignedUrl(json.url as string);
            } catch {
                // silently fail
            } finally {
                if (!cancelled) setLoadingUrl(false);
            }
        };

        void load();
        return () => {
            cancelled = true;
        };
    }, [film.id]);

    useEffect(() => {
        if (!signedUrl) return;
        videoRef.current?.load();
        videoRef.current?.play().catch(() => {});
    }, [signedUrl]);

    const posterSrc = film.poster_img
        ? film.poster_img.startsWith("/")
            ? `${API_BASE_URL}${film.poster_img}`
            : film.poster_img
        : undefined;

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height: "clamp(300px, 52vw, 520px)" }}
        >
            {/* Poster fallback background */}
            {posterSrc ? (
                <img
                    src={posterSrc}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-sm scale-105 opacity-40"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f2e] to-[#0f1535]" />
            )}

            {/* Video S3 */}
            {signedUrl && (
                <video
                    ref={videoRef}
                    key={signedUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                >
                    <source src={signedUrl} type="video/mp4" />
                </video>
            )}

            {/* Loading spinner */}
            {loadingUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-aurora/30 border-t-aurora animate-spin" />
                </div>
            )}

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end px-12 pb-10 max-w-2xl [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-display font-black text-aurora text-base leading-none">
                        M
                    </span>
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">
                        Festival
                    </span>
                </div>

                <h3 className="font-display text-5xl lg:text-6xl font-black text-white leading-none mb-4">
                    {film.original_title}
                </h3>

                <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className="text-[#46d369] font-semibold text-sm">
                        Sélection officielle
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50 text-sm">2026</span>
                    <span className="border border-white/30 text-white/50 font-mono text-[11px] px-1.5 py-px rounded-sm">
                        {film.ia_class}
                    </span>
                </div>

                {film.realisator_name && (
                    <p className="text-white/55 text-sm mb-3">
                        {flag(film.realisator_country)}{" "}
                        <strong className="text-white/80">{film.realisator_name}</strong>
                        {film.realisator_country ? ` · ${film.realisator_country}` : ""}
                    </p>
                )}

                {film.synopsis && (
                    <p className="text-white/50 text-sm mb-6 leading-relaxed max-w-md line-clamp-2">
                        {film.synopsis}
                    </p>
                )}
            </div>
        </div>
    );
};

// ── Film Card ─────────────────────────────────────────────────────────────────

const FilmCard = ({
    film,
    index,
    isSelected,
    onSelect,
}: {
    film: Film;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
}): React.JSX.Element => {
    const gradient = GRADIENTS[index % GRADIENTS.length];
    const posterSrc = film.poster_img
        ? film.poster_img.startsWith("/")
            ? `${API_BASE_URL}${film.poster_img}`
            : film.poster_img
        : null;

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect();
            }}
            className="group flex-shrink-0 flex-1 min-w-0 cursor-pointer transition-transform duration-200 hover:scale-[1.05] hover:z-10 relative"
            aria-pressed={isSelected}
        >
            <div
                className={`aspect-video relative overflow-hidden rounded-sm transition-all duration-150 ${
                    isSelected ? "ring-2 ring-white" : "hover:ring-1 hover:ring-white/40"
                }`}
            >
                {/* Poster or gradient */}
                {posterSrc ? (
                    <img
                        src={posterSrc}
                        alt={film.original_title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                    >
                        <span
                            className="font-display font-black text-white/[0.07] select-none"
                            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
                        >
                            {film.original_title.slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Badge M */}
                <div className="absolute top-1.5 left-2 font-display font-black text-aurora text-xs leading-none select-none z-10">
                    M
                </div>

                {/* Badge IA */}
                <span className="absolute top-1.5 right-2 font-mono text-[10px] text-aurora/80 bg-black/60 rounded px-1.5 py-px z-10 border border-aurora/20">
                    {film.ia_class}
                </span>

                {/* Play button */}
                <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 z-10 ${
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
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent z-10" />

                {/* Titre */}
                <div className="absolute bottom-1.5 left-2 right-2 z-10">
                    <div className="text-white text-[11px] font-bold truncate drop-shadow">
                        {film.original_title}
                    </div>
                </div>
            </div>

            {isSelected && (
                <div className="mt-2 px-0.5">
                    <div className="font-mono text-[11px] text-white/40 truncate">
                        {flag(film.realisator_country)} {film.realisator_country ?? ""}
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────

const FilmsSection = (): React.JSX.Element => {
    const [films, setFilms] = useState<Film[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [rowStart, setRowStart] = useState(0);

    const fetchFilms = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/public/films?statut=selectionne&limit=50`);
            const json = await res.json();
            if (json.success) setFilms(json.films ?? []);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchFilms();
    }, [fetchFilms]);

    if (loading) {
        return (
            <section
                id="films"
                className="bg-black"
                style={{ height: "clamp(300px, 52vw, 520px)" }}
            >
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-aurora/30 border-t-aurora animate-spin" />
                </div>
            </section>
        );
    }

    if (films.length === 0) {
        return (
            <section id="films" className="bg-black py-24 flex items-center justify-center">
                <div className="text-center border border-white/6 rounded-2xl px-12 py-16">
                    <div className="font-mono text-xs text-aurora/40 uppercase tracking-widest mb-3">
                        Sélection officielle
                    </div>
                    <p className="text-mist">La sélection sera annoncée prochainement.</p>
                </div>
            </section>
        );
    }

    const selectedFilm = films[selectedIdx];
    const canPrev = rowStart > 0;
    const canNext = rowStart + VISIBLE_COUNT < films.length;
    const totalPages = Math.ceil(films.length / VISIBLE_COUNT);
    const currentPage = Math.floor(rowStart / VISIBLE_COUNT);

    return (
        <section id="films" className="bg-black">
            {/* Hero vidéo S3 du film sélectionné */}
            <FilmHero film={selectedFilm} />

            {/* Carousel */}
            <div className="pt-6 pb-10">
                <div className="flex items-center gap-3 mb-4 px-12">
                    <span className="text-sm font-bold text-white">En compétition</span>
                    <span className="font-mono text-xs text-aurora/70">
                        marsAI 2026 · {films.length} films
                    </span>
                </div>

                <div className="relative group/row">
                    {/* Bouton gauche */}
                    <button
                        onClick={() => setRowStart((p) => Math.max(0, p - VISIBLE_COUNT))}
                        disabled={!canPrev}
                        aria-label="Films précédents"
                        className="absolute left-0 top-0 bottom-0 z-20 w-14 flex items-center justify-center bg-gradient-to-r from-black/90 via-black/50 to-transparent opacity-0 group-hover/row:opacity-100 disabled:!opacity-0 transition-opacity duration-200 focus-visible:outline-none"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-9 h-9 text-white drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    {/* Piste */}
                    <div className="overflow-hidden px-12">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                width: `${(films.length / VISIBLE_COUNT) * 100}%`,
                                transform: `translateX(-${(rowStart / films.length) * 100}%)`,
                            }}
                        >
                            {films.map((film, i) => (
                                <div
                                    key={film.id}
                                    className="flex-shrink-0 px-1"
                                    style={{ width: `${100 / films.length}%` }}
                                >
                                    <FilmCard
                                        film={film}
                                        index={i}
                                        isSelected={i === selectedIdx}
                                        onSelect={() => setSelectedIdx(i)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bouton droit */}
                    <button
                        onClick={() =>
                            setRowStart((p) =>
                                Math.min(films.length - VISIBLE_COUNT, p + VISIBLE_COUNT),
                            )
                        }
                        disabled={!canNext}
                        aria-label="Films suivants"
                        className="absolute right-0 top-0 bottom-0 z-20 w-14 flex items-center justify-center bg-gradient-to-l from-black/90 via-black/50 to-transparent opacity-0 group-hover/row:opacity-100 disabled:!opacity-0 transition-opacity duration-200 focus-visible:outline-none"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-9 h-9 text-white drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                {/* Indicateurs de page */}
                <div className="flex justify-end gap-1 mt-3 px-12">
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
