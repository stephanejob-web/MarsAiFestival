import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
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

const PAGE_SIZE = 10;

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

/* ── SVG Play icon ───────────────────────────────────────── */
const PlayIcon = (): React.JSX.Element => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
        <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
);

/* ── Modal player ─────────────────────────────────────────── */
const VideoModal = ({ film, onClose }: { film: Film; onClose: () => void }): React.JSX.Element => {
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loadingUrl, setLoadingUrl] = useState(true);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        setLoadingUrl(true);
        fetch(`${API_BASE_URL}/api/public/films/${film.id}/video`)
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setSignedUrl(json.url);
            })
            .catch(() => {})
            .finally(() => setLoadingUrl(false));
    }, [film.id]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: "rgba(5,7,20,0.95)", backdropFilter: "blur(12px)" }}
            onClick={onClose}
        >
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white/50 hover:text-white transition-colors flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
                    aria-label="Fermer"
                >
                    <span>Fermer</span>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Video player */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                    {loadingUrl && (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-aurora/30 border-t-aurora animate-spin" />
                        </div>
                    )}
                    {!loadingUrl && signedUrl && (
                        <video src={signedUrl} controls autoPlay className="w-full h-full" />
                    )}
                    {!loadingUrl && !signedUrl && (
                        <div className="w-full h-full flex items-center justify-center text-mist/50 text-sm">
                            Vidéo indisponible
                        </div>
                    )}
                </div>

                {/* Film info below player */}
                <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-display font-bold text-white-soft text-lg leading-tight">
                            {film.original_title}
                        </h3>
                        {film.english_title && film.english_title !== film.original_title && (
                            <p className="text-mist/60 text-sm italic mt-0.5">
                                {film.english_title}
                            </p>
                        )}
                        {film.realisator_name && (
                            <p className="text-mist text-sm mt-1">
                                {flag(film.realisator_country)} {film.realisator_name}
                            </p>
                        )}
                    </div>
                    <span className="font-mono text-[10px] border border-aurora/30 text-aurora rounded px-2 py-1 uppercase shrink-0 mt-1">
                        {film.ia_class}
                    </span>
                </div>

                {film.synopsis && (
                    <p className="text-mist/60 text-sm mt-3 leading-relaxed line-clamp-3">
                        {film.synopsis}
                    </p>
                )}
            </div>
        </div>
    );
};

/* ── Film card — format portrait ──────────────────────────── */
const FilmCard = ({
    film,
    index,
    onClick,
}: {
    film: Film;
    index: number;
    onClick: () => void;
}): React.JSX.Element => {
    const initials = film.original_title.slice(0, 2).toUpperCase();
    const gradients = [
        "from-[#0f1535] to-[#1a0a2e]",
        "from-[#0a1f2e] to-[#0f1535]",
        "from-[#1a0f2e] to-[#0a1a1f]",
        "from-[#0f2010] to-[#0a1535]",
        "from-[#2e0f1a] to-[#0f0a2e]",
    ];
    const gradient = gradients[index % gradients.length];

    return (
        <div
            className="relative aspect-[2/3] group cursor-pointer overflow-hidden rounded-xl"
            onClick={onClick}
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
        >
            {/* Poster */}
            {film.poster_img ? (
                <img
                    src={
                        film.poster_img.startsWith("/")
                            ? `${API_BASE_URL}${film.poster_img}`
                            : film.poster_img
                    }
                    alt={film.original_title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                />
            ) : (
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                    <span
                        className="font-display font-black text-white/[0.07] select-none"
                        style={{ fontSize: "clamp(4rem, 12vw, 7rem)" }}
                    >
                        {initials}
                    </span>
                </div>
            )}

            {/* Gradient overlay — toujours visible en bas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

            {/* Gradient overlay — au hover, plus sombre pour lisibilité */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

            {/* Badge IA — en haut à droite */}
            <div className="absolute top-2.5 right-2.5">
                <span
                    className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(78,255,206,0.25)",
                        color: "#4effce",
                    }}
                >
                    {film.ia_class}
                </span>
            </div>

            {/* Play button — centré, visible au hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-110"
                    style={{
                        background: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        boxShadow: "0 0 30px rgba(78,255,206,0.2)",
                    }}
                >
                    <PlayIcon />
                </div>
            </div>

            {/* Info — bas de la carte */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="font-display font-bold text-white text-sm leading-tight line-clamp-2 mb-1">
                    {film.original_title}
                </div>
                {film.english_title && film.english_title !== film.original_title && (
                    <div className="text-white/40 text-xs italic line-clamp-1 mb-1.5 font-body">
                        {film.english_title}
                    </div>
                )}
                <div className="flex items-center gap-1.5">
                    <span className="text-sm leading-none">{flag(film.realisator_country)}</span>
                    {film.realisator_name && (
                        <span className="text-white/50 text-xs truncate font-body">
                            {film.realisator_name}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Main component ───────────────────────────────────────── */
const SelectionGrid = (): React.JSX.Element => {
    const { t } = useTranslation();
    const [films, setFilms] = useState<Film[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [activeFilm, setActiveFilm] = useState<Film | null>(null);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    const fetchFilms = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/public/films?statut=selectionne&page=${p}&limit=${PAGE_SIZE}`,
            );
            const json = await res.json();
            if (json.success) {
                setFilms(json.films ?? []);
                setTotal(json.total ?? 0);
            }
        } catch {
            /* silently fail */
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchFilms(page);
    }, [fetchFilms, page]);

    return (
        <>
            {activeFilm && <VideoModal film={activeFilm} onClose={() => setActiveFilm(null)} />}

            <section id="selection" className="py-24 px-6 relative overflow-hidden">
                {/* Subtle aurora glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse, rgba(78,255,206,0.04) 0%, transparent 70%)",
                    }}
                    aria-hidden="true"
                />

                <div className="relative max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 font-mono text-xs text-aurora mb-4 uppercase tracking-widest">
                            <span
                                className="w-2 h-2 rounded-full bg-aurora inline-block animate-pulse"
                                aria-hidden="true"
                            />
                            {t("selection.overline", {
                                defaultValue: "Phase 1 · Sélection Officielle",
                            })}
                        </div>
                        <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                            {t("selection.title", { defaultValue: "Les 50 Films Sélectionnés" })}
                        </h2>
                        <p className="text-mist max-w-xl mx-auto text-base">
                            {t("selection.subtitle", {
                                defaultValue:
                                    "Découvrez les œuvres sélectionnées pour marsAI 2026 par notre comité.",
                            })}
                        </p>
                        {total > 0 && (
                            <div className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-aurora/60 border border-aurora/15 rounded-full px-3 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-aurora/60" />
                                {total} film{total > 1 ? "s" : ""} sélectionné{total > 1 ? "s" : ""}
                            </div>
                        )}
                    </div>

                    {/* Skeleton */}
                    {loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="aspect-[2/3] bg-surface rounded-xl" />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && films.length === 0 && (
                        <div className="text-center py-24 border border-white/6 rounded-2xl">
                            <div className="font-mono text-xs text-aurora/40 uppercase tracking-widest mb-3">
                                Sélection officielle
                            </div>
                            <p className="text-mist">La sélection sera annoncée prochainement.</p>
                        </div>
                    )}

                    {/* Grid portrait */}
                    {!loading && films.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                            {films.map((film, i) => (
                                <FilmCard
                                    key={film.id}
                                    film={film}
                                    index={i}
                                    onClick={() => setActiveFilm(film)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-5 py-2 rounded-lg border border-white/10 text-mist text-sm hover:border-aurora/40 hover:text-aurora transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                                ←
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                        page === i + 1
                                            ? "bg-aurora text-deep-sky shadow-[0_0_20px_rgba(78,255,206,0.3)]"
                                            : "border border-white/10 text-mist hover:border-aurora/40 hover:text-aurora"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-5 py-2 rounded-lg border border-white/10 text-mist text-sm hover:border-aurora/40 hover:text-aurora transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                                →
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default SelectionGrid;
