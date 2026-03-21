import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../../constants/api";

interface Award {
    id: number;
    name: string;
    description: string | null;
    cash_prize: string | null;
    display_rank: number;
    film_id: number | null;
    original_title: string | null;
    english_title: string | null;
    language: string | null;
    synopsis: string | null;
    poster_img: string | null;
    ia_class: string | null;
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

const RANK_STYLES: Record<number, { accent: string; glow: string; icon: string }> = {
    1: { accent: "border-solar/50 hover:border-solar", glow: "from-solar/8", icon: "🏆" },
    2: { accent: "border-lavande/50 hover:border-lavande", glow: "from-lavande/8", icon: "🎖️" },
    3: { accent: "border-aurora/50 hover:border-aurora", glow: "from-aurora/8", icon: "✨" },
    4: { accent: "border-coral/40 hover:border-coral", glow: "from-coral/5", icon: "🎬" },
    5: { accent: "border-white/20 hover:border-white/40", glow: "from-white/3", icon: "🌟" },
};

const getStyle = (rank: number) =>
    RANK_STYLES[rank] ?? {
        accent: "border-white/15 hover:border-white/30",
        glow: "from-white/3",
        icon: "🎗️",
    };

const AwardCard = ({ award }: { award: Award }): React.JSX.Element => {
    const style = getStyle(award.display_rank);
    const isGrandPrix = award.display_rank === 1;

    return (
        <div
            className={`relative bg-surface border rounded-2xl overflow-hidden transition-colors ${style.accent} ${isGrandPrix ? "lg:col-span-2" : ""}`}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${style.glow} to-transparent pointer-events-none`}
                aria-hidden="true"
            />
            <div className="relative flex flex-col md:flex-row gap-0">
                {/* Poster */}
                {award.poster_img && (
                    <div
                        className={`flex-shrink-0 ${isGrandPrix ? "md:w-72" : "md:w-48"} bg-surface-2`}
                    >
                        <img
                            src={
                                award.poster_img.startsWith("/")
                                    ? `${API_BASE_URL}${award.poster_img}`
                                    : award.poster_img
                            }
                            alt={award.original_title ?? ""}
                            className={`w-full ${isGrandPrix ? "h-56 md:h-full" : "h-40 md:h-full"} object-cover`}
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Info */}
                <div className="flex flex-col justify-center p-6 flex-1">
                    {/* Prix */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{style.icon}</span>
                        <span className="font-mono text-xs uppercase tracking-widest text-mist">
                            {award.name}
                        </span>
                        {award.cash_prize && (
                            <span className="ml-auto font-mono text-xs text-solar bg-solar/10 border border-solar/20 rounded px-2 py-0.5">
                                {award.cash_prize}
                            </span>
                        )}
                    </div>

                    {/* Film */}
                    {award.original_title ? (
                        <>
                            <h3
                                className={`font-display font-black text-white-soft leading-tight mb-1 ${isGrandPrix ? "text-3xl" : "text-xl"}`}
                            >
                                {award.original_title}
                            </h3>
                            {award.english_title &&
                                award.english_title !== award.original_title && (
                                    <p className="text-mist text-sm italic mb-2">
                                        {award.english_title}
                                    </p>
                                )}
                            <div className="flex items-center gap-2 text-sm text-mist mb-3">
                                <span>{flag(award.realisator_country)}</span>
                                {award.realisator_name && <span>{award.realisator_name}</span>}
                                {award.language && (
                                    <>
                                        <span className="text-white/20">·</span>
                                        <span>{award.language}</span>
                                    </>
                                )}
                            </div>
                            {isGrandPrix && award.synopsis && (
                                <p className="text-sm text-mist leading-relaxed line-clamp-3">
                                    {award.synopsis}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-mist italic text-sm">Lauréat à annoncer</p>
                    )}

                    {award.description && !isGrandPrix && (
                        <p className="text-xs text-mist/70 mt-2 leading-relaxed">
                            {award.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const PalmaresSection = (): React.JSX.Element => {
    const { t } = useTranslation();
    const [awards, setAwards] = useState<Award[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/public/awards`)
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setAwards(json.data ?? []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <section id="palmares" className="py-24 px-6 relative">
            <div
                className="absolute inset-0 bg-gradient-to-b from-solar/3 to-transparent pointer-events-none"
                aria-hidden="true"
            />
            <div className="relative max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 font-mono text-xs text-solar mb-4 uppercase tracking-widest">
                        <span
                            className="w-2 h-2 rounded-full bg-solar inline-block"
                            aria-hidden="true"
                        />
                        {t("palmares.overline", { defaultValue: "Phase 3 · Le Palmarès" })}
                    </div>
                    <h2 className="font-display text-4xl lg:text-6xl font-black text-white-soft mb-4">
                        {t("palmares.title", { defaultValue: "Les Lauréats" })}
                        <br />
                        <span className="text-solar">marsAI 2026</span>
                    </h2>
                    <p className="text-mist max-w-xl mx-auto">
                        {t("palmares.subtitle", {
                            defaultValue:
                                "Découvrez les films primés lors de la cérémonie de clôture du festival marsAI 2026.",
                        })}
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-surface border border-white/5 rounded-2xl h-48"
                            />
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!loading && awards.length === 0 && (
                    <div className="text-center py-20 text-mist">
                        <div className="text-6xl mb-4">🏆</div>
                        <p className="text-lg font-semibold text-white-soft mb-2">
                            Le palmarès sera révélé lors de la cérémonie.
                        </p>
                        <p className="text-sm">Restez connectés !</p>
                    </div>
                )}

                {/* Awards */}
                {!loading && awards.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {awards.map((award) => (
                            <AwardCard key={award.id} award={award} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PalmaresSection;
