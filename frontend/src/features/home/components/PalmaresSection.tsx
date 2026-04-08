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
    video_url: string | null;
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
const flag = (c: string | null) => (c ? (FLAG[c] ?? "🌍") : "🌍");

/* ── Rank config ───────────────────────────────────────────── */
const RANK: Record<number, { color: string; border: string; glow: string; label: string }> = {
    1: {
        color: "text-solar",
        border: "border-solar/40",
        glow: "rgba(245,230,66,0.12)",
        label: "① Grand Prix",
    },
    2: {
        color: "text-lavande",
        border: "border-lavande/40",
        glow: "rgba(192,132,252,0.10)",
        label: "② Prix du Jury",
    },
    3: {
        color: "text-aurora",
        border: "border-aurora/40",
        glow: "rgba(78,255,206,0.10)",
        label: "③ Prix Spécial",
    },
    4: {
        color: "text-coral",
        border: "border-coral/30",
        glow: "rgba(255,107,107,0.08)",
        label: "④ Prix du Mobile",
    },
    5: {
        color: "text-mist",
        border: "border-white/20",
        glow: "rgba(136,146,176,0.06)",
        label: "⑤ Mention",
    },
};
const getRank = (r: number) =>
    RANK[r] ?? {
        color: "text-mist",
        border: "border-white/15",
        glow: "rgba(255,255,255,0.04)",
        label: `Prix ${r}`,
    };

/* ── SVG Play ──────────────────────────────────────────────── */
const PlayIcon = (): React.JSX.Element => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
        <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
);

/* ── Video Modal ───────────────────────────────────────────── */
const VideoModal = ({
    award,
    onClose,
}: {
    award: Award;
    onClose: () => void;
}): React.JSX.Element => {
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        const load = async (): Promise<void> => {
            if (!award.film_id) {
                setLoading(false);
                return;
            }
            try {
                const r = await fetch(`${API_BASE_URL}/api/public/films/${award.film_id}/video`);
                const j = await r.json();
                if (j.success) setSignedUrl(j.url as string);
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, [award.film_id]);

    const rank = getRank(award.display_rank);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: "rgba(5,7,20,0.96)", backdropFilter: "blur(16px)" }}
            onClick={onClose}
        >
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white/40 hover:text-white transition-colors flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
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

                {/* Player */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)]">
                    {loading && (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-aurora/30 border-t-aurora animate-spin" />
                        </div>
                    )}
                    {!loading && signedUrl && (
                        <video
                            src={signedUrl}
                            controls
                            autoPlay
                            poster={award.poster_img ?? undefined}
                            className="w-full h-full"
                        />
                    )}
                    {!loading && !signedUrl && (
                        <div className="w-full h-full flex items-center justify-center text-mist/40 text-sm">
                            Vidéo indisponible
                        </div>
                    )}
                </div>

                {/* Infos sous le player */}
                <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                        <div
                            className={`font-mono text-xs uppercase tracking-widest mb-1 ${rank.color}`}
                        >
                            {rank.label}
                        </div>
                        <h3 className="font-display font-black text-white-soft text-xl leading-tight">
                            {award.original_title}
                        </h3>
                        {award.english_title && award.english_title !== award.original_title && (
                            <p className="text-mist/50 text-sm italic mt-0.5">
                                {award.english_title}
                            </p>
                        )}
                        {award.realisator_name && (
                            <p className="text-mist text-sm mt-1.5">
                                {flag(award.realisator_country)} {award.realisator_name}
                            </p>
                        )}
                    </div>
                    {award.cash_prize && (
                        <span className="font-mono text-sm text-solar bg-solar/10 border border-solar/25 rounded-lg px-3 py-1.5 shrink-0">
                            {award.cash_prize}
                        </span>
                    )}
                </div>
                {award.synopsis && (
                    <p className="text-mist/50 text-sm mt-3 leading-relaxed line-clamp-3">
                        {award.synopsis}
                    </p>
                )}
            </div>
        </div>
    );
};

/* ── Grand Prix card — hero ────────────────────────────────── */
const GrandPrixCard = ({
    award,
    onPlay,
}: {
    award: Award;
    onPlay: () => void;
}): React.JSX.Element => (
    <div
        className="relative rounded-2xl overflow-hidden border border-solar/30 group cursor-pointer"
        style={{ boxShadow: "0 0 60px rgba(245,230,66,0.08)", background: "#0f1535" }}
        onClick={onPlay}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-solar/5 to-transparent pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row">
            {/* Poster portrait */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
                {award.poster_img ? (
                    <img
                        src={
                            award.poster_img.startsWith("/")
                                ? `${API_BASE_URL}${award.poster_img}`
                                : award.poster_img
                        }
                        alt={award.original_title ?? ""}
                        className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        style={{ maxHeight: "420px" }}
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="w-full h-64 lg:h-full bg-gradient-to-br from-surface-2 to-deep-sky flex items-center justify-center"
                        style={{ minHeight: "280px" }}
                    >
                        <span
                            className="font-display font-black text-solar/10"
                            style={{ fontSize: "6rem" }}
                        >
                            {(award.original_title ?? "??").slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-8 lg:p-12 flex-1">
                <div className="font-mono text-xs text-solar/60 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-6 h-px bg-solar/40" />① Grand Prix marsAI 2026
                </div>

                {award.original_title ? (
                    <>
                        <h3
                            className="font-display font-black text-white-soft leading-tight mb-2"
                            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                        >
                            {award.original_title}
                        </h3>
                        {award.english_title && award.english_title !== award.original_title && (
                            <p className="text-mist/60 text-base italic mb-4">
                                {award.english_title}
                            </p>
                        )}
                        <div className="flex items-center gap-3 text-mist mb-6">
                            <span className="text-lg">{flag(award.realisator_country)}</span>
                            {award.realisator_name && (
                                <span className="font-semibold">{award.realisator_name}</span>
                            )}
                            {award.ia_class && (
                                <>
                                    <span className="text-white/15">·</span>
                                    <span className="font-mono text-xs border border-aurora/25 text-aurora rounded px-2 py-0.5 uppercase">
                                        {award.ia_class}
                                    </span>
                                </>
                            )}
                        </div>
                        {award.synopsis && (
                            <p className="text-mist/70 text-sm leading-relaxed mb-6 line-clamp-3">
                                {award.synopsis}
                            </p>
                        )}
                    </>
                ) : (
                    <p className="text-mist/50 italic text-lg mb-6">Lauréat à annoncer</p>
                )}

                <div className="flex items-center gap-4">
                    {award.video_url && (
                        <button
                            className="inline-flex items-center gap-2.5 bg-solar text-deep-sky font-bold px-6 py-3 rounded-xl hover:bg-solar/90 transition-all duration-200"
                            style={{ boxShadow: "0 0 30px rgba(245,230,66,0.25)" }}
                        >
                            <PlayIcon />
                            Voir le film
                        </button>
                    )}
                    {award.cash_prize && (
                        <span className="font-mono text-sm text-solar bg-solar/10 border border-solar/25 rounded-lg px-3 py-2">
                            {award.cash_prize}
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

/* ── Prix secondaire card ──────────────────────────────────── */
const PrixCard = ({ award, onPlay }: { award: Award; onPlay: () => void }): React.JSX.Element => {
    const rank = getRank(award.display_rank);
    return (
        <div
            className={`relative bg-surface border rounded-2xl overflow-hidden transition-all duration-300 group ${award.video_url ? "cursor-pointer hover:scale-[1.01]" : ""} ${rank.border}`}
            style={{ boxShadow: `0 4px 32px ${rank.glow}` }}
            onClick={award.video_url ? onPlay : undefined}
        >
            <div className="flex gap-0">
                {/* Poster portrait compact */}
                {award.poster_img ? (
                    <div className="w-28 flex-shrink-0">
                        <img
                            src={
                                award.poster_img.startsWith("/")
                                    ? `${API_BASE_URL}${award.poster_img}`
                                    : award.poster_img
                            }
                            alt={award.original_title ?? ""}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            style={{ minHeight: "140px", maxHeight: "180px" }}
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div
                        className="w-28 flex-shrink-0 flex items-center justify-center bg-surface-2"
                        style={{ minHeight: "140px" }}
                    >
                        <span
                            className={`font-display font-black text-2xl opacity-20 ${rank.color}`}
                        >
                            {(award.original_title ?? "??").slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Content */}
                <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
                    <div>
                        <div
                            className={`font-mono text-[10px] uppercase tracking-[0.18em] mb-2 ${rank.color}`}
                        >
                            {rank.label}
                        </div>
                        {award.original_title ? (
                            <>
                                <h3 className="font-display font-bold text-white-soft text-base leading-tight mb-1 line-clamp-2">
                                    {award.original_title}
                                </h3>
                                {award.english_title &&
                                    award.english_title !== award.original_title && (
                                        <p className="text-mist/50 text-xs italic mb-2 line-clamp-1">
                                            {award.english_title}
                                        </p>
                                    )}
                                <div className="flex items-center gap-1.5 text-sm text-mist">
                                    <span>{flag(award.realisator_country)}</span>
                                    {award.realisator_name && (
                                        <span className="truncate text-xs">
                                            {award.realisator_name}
                                        </span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-mist/40 italic text-sm">Lauréat à annoncer</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        {award.cash_prize && (
                            <span className={`font-mono text-xs ${rank.color} opacity-70`}>
                                {award.cash_prize}
                            </span>
                        )}
                        {award.video_url && (
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                }}
                            >
                                <PlayIcon />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Main ──────────────────────────────────────────────────── */
const PalmaresSection = (): React.JSX.Element => {
    const { t } = useTranslation();
    const [awards, setAwards] = useState<Award[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeAward, setActiveAward] = useState<Award | null>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/public/awards`)
            .then((r) => r.json())
            .then((j) => {
                if (j.success) setAwards(j.data ?? []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const grandPrix = awards.find((a) => a.display_rank === 1);
    const others = awards.filter((a) => a.display_rank !== 1);

    return (
        <>
            {activeAward && <VideoModal award={activeAward} onClose={() => setActiveAward(null)} />}

            <section id="palmares" className="py-24 px-6 relative overflow-hidden">
                {/* Ambient glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse, rgba(245,230,66,0.05) 0%, transparent 65%)",
                    }}
                    aria-hidden="true"
                />

                <div className="relative max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 font-mono text-xs text-solar mb-4 uppercase tracking-widest">
                            <span
                                className="w-2 h-2 rounded-full bg-solar animate-pulse"
                                aria-hidden="true"
                            />
                            {t("palmares.overline", { defaultValue: "Phase 3 · Le Palmarès" })}
                        </div>
                        <h2
                            className="font-display font-black text-white-soft mb-4"
                            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.05 }}
                        >
                            {t("palmares.title", { defaultValue: "Les Lauréats" })}
                            <br />
                            <span className="text-solar">marsAI 2026</span>
                        </h2>
                        <p className="text-mist max-w-xl mx-auto">
                            {t("palmares.subtitle", {
                                defaultValue:
                                    "Découvrez les films primés lors de la cérémonie de clôture.",
                            })}
                        </p>
                    </div>

                    {/* Skeleton */}
                    {loading && (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-72 bg-surface border border-white/5 rounded-2xl" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="h-40 bg-surface border border-white/5 rounded-2xl"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && awards.length === 0 && (
                        <div className="text-center py-24 border border-white/6 rounded-2xl">
                            <div className="font-mono text-xs text-solar/40 uppercase tracking-widest mb-3">
                                Palmarès
                            </div>
                            <p className="text-white-soft font-display font-bold text-xl mb-2">
                                Le palmarès sera révélé lors de la cérémonie.
                            </p>
                            <p className="text-mist text-sm">Restez connectés !</p>
                        </div>
                    )}

                    {/* Content */}
                    {!loading && awards.length > 0 && (
                        <div className="space-y-6">
                            {/* ① Grand Prix — hero */}
                            {grandPrix && (
                                <GrandPrixCard
                                    award={grandPrix}
                                    onPlay={() => setActiveAward(grandPrix)}
                                />
                            )}

                            {/* ②③④⑤ — grille 2 colonnes */}
                            {others.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {others.map((award) => (
                                        <PrixCard
                                            key={award.id}
                                            award={award}
                                            onPlay={() => setActiveAward(award)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default PalmaresSection;
