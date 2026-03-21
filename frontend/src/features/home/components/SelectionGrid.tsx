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
    ia_class: string;
    realisator_name: string | null;
    realisator_country: string | null;
}

const PAGE_SIZE = 20;

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

const FilmCard = ({ film }: { film: Film }): React.JSX.Element => (
    <div className="bg-surface border border-white/8 rounded-xl overflow-hidden hover:border-aurora/30 transition-colors group">
        {/* Poster */}
        <div className="aspect-video bg-surface-2 relative overflow-hidden">
            {film.poster_img ? (
                <img
                    src={
                        film.poster_img.startsWith("/")
                            ? `${API_BASE_URL}${film.poster_img}`
                            : film.poster_img
                    }
                    alt={film.original_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-3xl font-black text-aurora/20">
                        {film.original_title.slice(0, 2).toUpperCase()}
                    </span>
                </div>
            )}
            <div className="absolute top-2 right-2">
                <span className="font-mono text-[10px] bg-aurora/20 text-aurora border border-aurora/30 rounded px-1.5 py-0.5 uppercase">
                    {film.ia_class}
                </span>
            </div>
        </div>
        {/* Info */}
        <div className="p-3">
            <div className="font-semibold text-white-soft text-sm leading-tight mb-1 line-clamp-2">
                {film.original_title}
            </div>
            {film.english_title && film.english_title !== film.original_title && (
                <div className="text-mist text-xs italic mb-1 line-clamp-1">
                    {film.english_title}
                </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-mist">
                <span>{flag(film.realisator_country)}</span>
                {film.realisator_name && <span className="truncate">{film.realisator_name}</span>}
            </div>
        </div>
    </div>
);

const SelectionGrid = (): React.JSX.Element => {
    const { t } = useTranslation();
    const [films, setFilms] = useState<Film[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

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
        <section id="selection" className="py-24 px-6 relative">
            <div
                className="absolute inset-0 bg-gradient-to-b from-aurora/3 to-transparent pointer-events-none"
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
                    <p className="text-mist max-w-xl mx-auto">
                        {t("selection.subtitle", {
                            defaultValue:
                                "Découvrez les films sélectionnés pour marsAI 2026 par notre comité de sélection.",
                        })}
                    </p>
                    {total > 0 && (
                        <div className="mt-3 font-mono text-xs text-aurora/70">
                            {total} film{total > 1 ? "s" : ""} sélectionné{total > 1 ? "s" : ""}
                        </div>
                    )}
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-surface border border-white/5 rounded-xl aspect-video"
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && films.length === 0 && (
                    <div className="text-center py-20 text-mist">
                        <div className="text-5xl mb-4">🎬</div>
                        <p>La sélection sera annoncée prochainement.</p>
                    </div>
                )}

                {/* Grid */}
                {!loading && films.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {films.map((film) => (
                            <FilmCard key={film.id} film={film} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg border border-white/10 text-mist text-sm hover:border-aurora/40 hover:text-aurora transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ←
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                                    page === i + 1
                                        ? "bg-aurora text-[#0a0f2e]"
                                        : "border border-white/10 text-mist hover:border-aurora/40 hover:text-aurora"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-lg border border-white/10 text-mist text-sm hover:border-aurora/40 hover:text-aurora transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SelectionGrid;
