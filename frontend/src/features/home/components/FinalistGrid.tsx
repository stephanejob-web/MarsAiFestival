import React, { useState, useEffect } from "react";
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

const FinalistGrid = (): React.JSX.Element => {
    const { t } = useTranslation();
    const [films, setFilms] = useState<Film[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Film | null>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/public/films?statut=finaliste&limit=50`)
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setFilms(json.films ?? []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <section id="finalistes" className="py-24 px-6 relative">
            <div
                className="absolute inset-0 bg-gradient-to-b from-lavande/3 to-transparent pointer-events-none"
                aria-hidden="true"
            />
            <div className="relative max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 font-mono text-xs text-lavande mb-4 uppercase tracking-widest">
                        <span
                            className="w-2 h-2 rounded-full bg-lavande inline-block animate-pulse"
                            aria-hidden="true"
                        />
                        {t("finalist.overline", { defaultValue: "Phase 2 · Les Finalistes" })}
                    </div>
                    <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                        {t("finalist.title", { defaultValue: "En Compétition Finale" })}
                    </h2>
                    <p className="text-mist max-w-xl mx-auto">
                        {t("finalist.subtitle", {
                            defaultValue:
                                "Ces films ont été retenus par le jury pour la sélection finale. Le palmarès sera révélé lors de la cérémonie.",
                        })}
                    </p>
                    {films.length > 0 && (
                        <div className="mt-3 font-mono text-xs text-lavande/70">
                            {films.length} finaliste{films.length > 1 ? "s" : ""}
                        </div>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-surface border border-white/5 rounded-2xl h-72"
                            />
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!loading && films.length === 0 && (
                    <div className="text-center py-20 text-mist">
                        <div className="text-5xl mb-4">🎬</div>
                        <p>Les finalistes seront annoncés prochainement.</p>
                    </div>
                )}

                {/* Grid */}
                {!loading && films.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {films.map((film, i) => (
                            <button
                                key={film.id}
                                onClick={() => setSelected(selected?.id === film.id ? null : film)}
                                className="text-left bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-lavande/40 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavande"
                            >
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
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-lavande/10 to-transparent">
                                            <span className="font-display text-5xl font-black text-lavande/20">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 font-mono text-xs bg-lavande/20 text-lavande border border-lavande/30 rounded px-2 py-0.5">
                                        #{String(i + 1).padStart(2, "0")}
                                    </div>
                                    <div className="absolute top-2 right-2 font-mono text-xs bg-aurora/20 text-aurora border border-aurora/30 rounded px-1.5 py-0.5 uppercase">
                                        {film.ia_class}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-display text-lg font-black text-white-soft mb-1 leading-tight">
                                        {film.original_title}
                                    </h3>
                                    {film.english_title &&
                                        film.english_title !== film.original_title && (
                                            <p className="text-mist text-xs italic mb-2">
                                                {film.english_title}
                                            </p>
                                        )}
                                    <div className="flex items-center gap-1.5 text-xs text-mist mb-3">
                                        <span>{flag(film.realisator_country)}</span>
                                        {film.realisator_name && (
                                            <span>{film.realisator_name}</span>
                                        )}
                                        <span className="text-white/20">·</span>
                                        <span>{film.language}</span>
                                    </div>
                                    {selected?.id === film.id && film.synopsis && (
                                        <p className="text-sm text-mist leading-relaxed border-t border-white/10 pt-3 mt-1">
                                            {film.synopsis}
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FinalistGrid;
