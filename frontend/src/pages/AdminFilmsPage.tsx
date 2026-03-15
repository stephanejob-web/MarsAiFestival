import React, { useState } from "react";
import useAdminFilms from "../features/admin/hooks/useAdminFilms";

const CARD_ACCENTS = [
    "#4effce",
    "#c084fc",
    "#ff6b6b",
    "#f5e642",
    "#60a5fa",
    "#f472b6",
    "#34d399",
    "#fb923c",
];

const AVATAR_GRADIENTS = [
    "from-aurora to-lavande text-deep-sky",
    "from-coral to-lavande text-white",
    "from-solar to-aurora text-deep-sky",
    "from-lavande to-coral text-white",
    "from-aurora to-solar text-deep-sky",
    "from-coral to-solar text-white",
];

type FilterMode = "all" | "unassigned" | "assigned";

const AdminFilmsPage = (): React.JSX.Element => {
    const {
        films,
        juryMembers,
        assignments,
        isLoading,
        error,
        isDistributing,
        toggleAssignment,
        autoDistribute,
    } = useAdminFilms();

    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<FilterMode>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activatedVideos, setActivatedVideos] = useState<Set<number>>(new Set());

    const PAGE_SIZE = 8;

    const activateVideo = (filmId: number): void => {
        setActivatedVideos((prev) => new Set(prev).add(filmId));
    };

    const assignedFilmIds = new Set(assignments.map((a) => a.film_id));
    const unassignedCount = films.filter((f) => !assignedFilmIds.has(f.id)).length;
    const assignedCount = films.filter((f) => assignedFilmIds.has(f.id)).length;
    const activeJuryCount = juryMembers.length;
    const perJury = activeJuryCount > 0 ? Math.round(unassignedCount / activeJuryCount) : 0;

    const filteredFilms = films.filter((f) => {
        const q = search.toLowerCase();
        const matchesSearch =
            f.original_title.toLowerCase().includes(q) ||
            `${f.first_name} ${f.last_name}`.toLowerCase().includes(q) ||
            f.country.toLowerCase().includes(q) ||
            f.dossier_num.toLowerCase().includes(q);
        if (!matchesSearch) return false;
        if (filter === "unassigned") return !assignedFilmIds.has(f.id);
        if (filter === "assigned") return assignedFilmIds.has(f.id);
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredFilms.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const pageFilms = filteredFilms.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const goToPage = (p: number): void => {
        setCurrentPage(Math.max(1, Math.min(p, totalPages)));
        setActivatedVideos(new Set());
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* Topbar */}
            <div className="flex h-[50px] min-h-[50px] items-center gap-3 border-b border-white/[0.06] bg-surface px-5">
                <span className="font-display text-[0.88rem] font-extrabold text-white-soft">
                    Assignation des films
                </span>
                <div className="h-[18px] w-px bg-white/[0.08]" />
                <span className="text-[0.75rem] text-mist">
                    {films.length} films · {activeJuryCount} jurés actifs ·{" "}
                    {assignments.length} assignations
                </span>
                <div className="ml-auto">
                    <span className="rounded-md border border-aurora/20 bg-aurora/[0.07] px-2.5 py-1 font-mono text-[0.7rem] text-mist">
                        🎬 Films
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {error && (
                    <div className="mb-5 rounded-xl border border-coral/20 bg-coral/10 px-4 py-3 text-[0.82rem] text-coral">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-[0.82rem] text-mist">
                        Chargement…
                    </div>
                ) : (
                    <>
                        {/* Auto-distribute banner */}
                        <button
                            type="button"
                            onClick={() => void autoDistribute()}
                            disabled={isDistributing}
                            className="relative mb-5 flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-[14px] border-[1.5px] border-aurora/25 bg-gradient-to-r from-aurora/[0.05] to-aurora/[0.10] px-6 py-[18px] text-left transition-all duration-[220ms] hover:-translate-y-px hover:border-aurora/45 hover:shadow-[0_0_0_1px_rgba(78,255,206,0.08),0_6px_24px_rgba(78,255,206,0.10)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <div className="flex flex-1 items-center gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-aurora/20 bg-aurora/10 text-aurora">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <circle cx="3.5" cy="10" r="2" stroke="currentColor" strokeWidth="1.6" />
                                        <circle cx="16.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.6" />
                                        <circle cx="16.5" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.6" />
                                        <path d="M5.5 10C7 10 8 4.5 14.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                        <path d="M5.5 10C7 10 8 15.5 14.5 15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-display text-[0.95rem] font-extrabold tracking-[-0.01em] text-aurora">
                                        {isDistributing ? "Distribution en cours…" : "Répartir équitablement"}
                                    </div>
                                    <div className="mt-0.5 text-[0.73rem] leading-snug text-mist">
                                        Distribuer automatiquement les{" "}
                                        <span className="text-white-soft">{unassignedCount}</span>{" "}
                                        films non assignés entre les jurés actifs
                                    </div>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                                <div className="flex items-center rounded-full border border-aurora/18 bg-aurora/[0.08] px-3 py-[5px] font-mono text-[0.72rem] font-bold text-aurora">
                                    <span>{activeJuryCount} jurés</span>
                                    <span className="mx-1 opacity-40">·</span>
                                    <span>~{perJury} films/juré</span>
                                </div>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-aurora/50">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </button>

                        {/* Search */}
                        <div className="relative mb-3.5">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.85rem] opacity-40">
                                🔍
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                placeholder="Rechercher par titre, réalisateur ou pays…"
                                className="w-full rounded-[10px] border border-white/[0.09] bg-white/[0.04] py-2 pl-9 pr-4 font-body text-[0.85rem] text-white-soft outline-none placeholder:text-mist focus:border-aurora/40"
                            />
                        </div>

                        {/* Filter tabs */}
                        <div className="mb-3.5 flex items-center gap-4">
                            <div className="flex gap-1 rounded-[10px] border border-white/[0.08] bg-white/[0.04] p-[3px]">
                                {(
                                    [
                                        { id: "all", label: "Tous" },
                                        { id: "unassigned", label: "Non assignés", count: unassignedCount },
                                        { id: "assigned", label: "Assignés", count: assignedCount },
                                    ] as { id: FilterMode; label: string; count?: number }[]
                                ).map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => { setFilter(tab.id); setCurrentPage(1); }}
                                        className={`flex items-center gap-1.5 rounded-[8px] px-[13px] py-[7px] text-[0.78rem] font-semibold transition-all duration-150 ${
                                            filter === tab.id
                                                ? "bg-aurora/10 text-aurora shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
                                                : "text-mist hover:bg-white/[0.05] hover:text-white-soft"
                                        }`}
                                    >
                                        {tab.label}
                                        {tab.count !== undefined && (
                                            <span className="text-[0.7rem] opacity-60">{tab.count}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <span className="font-mono text-[0.78rem] text-mist">
                                {filteredFilms.length} film{filteredFilms.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {/* Cards grid */}
                        {filteredFilms.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="mb-4 text-5xl">🎉</div>
                                <div className="font-display text-[1.1rem] font-extrabold text-white-soft">
                                    Tous les films sont assignés !
                                </div>
                                <div className="mt-2 text-[0.8rem] text-mist">
                                    Retrouvez-les dans l'onglet "Assignés".
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(420px,1fr))] gap-5">
                                {pageFilms.map((film) => {
                                    const accent = CARD_ACCENTS[film.id % CARD_ACCENTS.length];
                                    const isAssigned = assignedFilmIds.has(film.id);
                                    const nJury = assignments.filter((a) => a.film_id === film.id).length;
                                    const filmAssignmentIds = new Set(
                                        assignments
                                            .filter((a) => a.film_id === film.id)
                                            .map((a) => a.jury_id),
                                    );

                                    return (
                                        <div
                                            key={film.id}
                                            className={`overflow-hidden rounded-[14px] border transition-all duration-[180ms] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.35)] ${
                                                isAssigned
                                                    ? "border-aurora/35 bg-surface-2 shadow-[0_0_0_1px_rgba(78,255,206,0.15),0_4px_18px_rgba(0,0,0,0.25)]"
                                                    : "border-white/[0.06] bg-surface-2"
                                            }`}
                                        >
                                            {/* Accent bar */}
                                            <div className="h-[3px] w-full" style={{ background: accent, opacity: 0.7 }} />

                                            {/* Video */}
                                            {film.video_url && activatedVideos.has(film.id) ? (
                                                <div className="bg-black">
                                                    <video
                                                        src={film.video_url}
                                                        controls
                                                        autoPlay
                                                        preload="auto"
                                                        className="aspect-video w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="group/thumb relative flex aspect-video w-full items-center justify-center overflow-hidden"
                                                    style={{ background: `${accent}11` }}
                                                >
                                                    <span
                                                        className="select-none font-mono text-[3.5rem] font-black opacity-[0.07]"
                                                        style={{ color: accent }}
                                                    >
                                                        {String(film.id).padStart(3, "0")}
                                                    </span>
                                                    <div className="absolute right-2 top-2 text-[1.1rem]">
                                                        {countryFlag(film.country)}
                                                    </div>
                                                    {film.video_url && (
                                                        <button
                                                            type="button"
                                                            onClick={() => activateVideo(film.id)}
                                                            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-150 group-hover/thumb:opacity-100"
                                                        >
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                                    <path d="M6 4l9 5-9 5V4z" fill="#0A0F2E" />
                                                                </svg>
                                                            </div>
                                                        </button>
                                                    )}
                                                    {!film.video_url && (
                                                        <div className="absolute bottom-2 left-2 rounded-md bg-black/50 px-1.5 py-0.5 font-mono text-[0.62rem] font-bold text-white/40 backdrop-blur-sm">
                                                            Pas de vidéo
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Body */}
                                            <div className="p-3.5">
                                                <div className="mb-0.5 text-[0.88rem] font-bold leading-snug text-white-soft">
                                                    {film.original_title}
                                                </div>
                                                <div className="text-[0.72rem] text-mist">
                                                    {film.first_name} {film.last_name} · {film.country}
                                                </div>

                                                {/* Jury avatars — clic direct pour assigner */}
                                                <div className="mt-3">
                                                    <div className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-mist opacity-60">
                                                        Jury
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        {juryMembers.map((j, idx) => {
                                                            const jAssigned = filmAssignmentIds.has(j.id);
                                                            const initials = `${j.first_name[0]}${j.last_name[0]}`.toUpperCase();
                                                            const grad = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];

                                                            return (
                                                                <button
                                                                    key={j.id}
                                                                    type="button"
                                                                    onClick={() => void toggleAssignment(j.id, film.id)}
                                                                    className={`flex cursor-pointer flex-col items-center gap-1.5 transition-all duration-150 ${
                                                                        jAssigned ? "opacity-100" : "opacity-30 hover:opacity-70"
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[0.85rem] font-extrabold ${grad} ${
                                                                            jAssigned
                                                                                ? "shadow-[0_0_0_3px_#4effce,0_0_14px_rgba(78,255,206,0.45)]"
                                                                                : "shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
                                                                        }`}
                                                                    >
                                                                        {j.profil_picture ? (
                                                                            <img
                                                                                src={j.profil_picture}
                                                                                alt=""
                                                                                className="h-full w-full rounded-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            initials
                                                                        )}
                                                                        {jAssigned && (
                                                                            <span className="absolute -right-[4px] -top-[4px] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-aurora text-[0.55rem] font-black text-deep-sky">
                                                                                ✓
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <div className={`text-[0.65rem] font-semibold leading-tight ${jAssigned ? "text-white-soft" : "text-mist"}`}>
                                                                            {j.first_name}
                                                                        </div>
                                                                        <div className={`text-[0.65rem] leading-tight ${jAssigned ? "text-white-soft" : "text-mist"}`}>
                                                                            {j.last_name}
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="font-mono text-[0.68rem]">
                                                        {nJury > 0 ? (
                                                            <span className="text-aurora">
                                                                {nJury} juré{nJury > 1 ? "s" : ""} assigné{nJury > 1 ? "s" : ""}
                                                            </span>
                                                        ) : (
                                                            <span className="text-mist">Non assigné</span>
                                                        )}
                                                    </span>
                                                    <span
                                                        className="rounded-full border px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide"
                                                        style={{
                                                            borderColor: `${accent}30`,
                                                            color: accent,
                                                            background: `${accent}10`,
                                                        }}
                                                    >
                                                        {film.dossier_num}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => goToPage(safePage - 1)}
                                    disabled={safePage === 1}
                                    className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[0.78rem] text-mist transition-all hover:bg-white/[0.08] hover:text-white-soft disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    ← Préc.
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                                    .reduce<(number | "…")[]>((acc, p, i, arr) => {
                                        if (i > 0 && typeof arr[i - 1] === "number" && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, i) =>
                                        p === "…" ? (
                                            <span key={`dots-${i}`} className="px-1 text-[0.75rem] text-mist opacity-40">
                                                ···
                                            </span>
                                        ) : (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => goToPage(p as number)}
                                                className={`h-8 w-8 rounded-lg text-[0.78rem] font-semibold transition-all ${
                                                    p === safePage
                                                        ? "bg-aurora/15 text-aurora shadow-[0_0_0_1px_rgba(78,255,206,0.3)]"
                                                        : "text-mist hover:bg-white/[0.06] hover:text-white-soft"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ),
                                    )}

                                <button
                                    type="button"
                                    onClick={() => goToPage(safePage + 1)}
                                    disabled={safePage === totalPages}
                                    className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[0.78rem] text-mist transition-all hover:bg-white/[0.08] hover:text-white-soft disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    Suiv. →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const FLAG_MAP: Record<string, string> = {
    France: "🇫🇷",
    "États-Unis": "🇺🇸",
    "United States": "🇺🇸",
    Japan: "🇯🇵",
    Japon: "🇯🇵",
    Germany: "🇩🇪",
    Allemagne: "🇩🇪",
    Italy: "🇮🇹",
    Italie: "🇮🇹",
    Spain: "🇪🇸",
    Espagne: "🇪🇸",
    UK: "🇬🇧",
    "United Kingdom": "🇬🇧",
    Canada: "🇨🇦",
    Brazil: "🇧🇷",
    Brésil: "🇧🇷",
    China: "🇨🇳",
    Chine: "🇨🇳",
    India: "🇮🇳",
    Inde: "🇮🇳",
    Morocco: "🇲🇦",
    Maroc: "🇲🇦",
    Senegal: "🇸🇳",
    Sénégal: "🇸🇳",
    Mexico: "🇲🇽",
    Mexique: "🇲🇽",
    Argentina: "🇦🇷",
    Argentine: "🇦🇷",
    Portugal: "🇵🇹",
    Netherlands: "🇳🇱",
    Belgium: "🇧🇪",
    Belgique: "🇧🇪",
    Switzerland: "🇨🇭",
    Suisse: "🇨🇭",
    Sweden: "🇸🇪",
    Suède: "🇸🇪",
    Norway: "🇳🇴",
    Norvège: "🇳🇴",
    Denmark: "🇩🇰",
    Danemark: "🇩🇰",
    Finland: "🇫🇮",
    Finlande: "🇫🇮",
    Poland: "🇵🇱",
    Pologne: "🇵🇱",
    Russia: "🇷🇺",
    Russie: "🇷🇺",
    Ukraine: "🇺🇦",
    "South Korea": "🇰🇷",
    "Corée du Sud": "🇰🇷",
    Iran: "🇮🇷",
    Turkey: "🇹🇷",
    Turquie: "🇹🇷",
    Egypt: "🇪🇬",
    Égypte: "🇪🇬",
    Nigeria: "🇳🇬",
    "South Africa": "🇿🇦",
    "Afrique du Sud": "🇿🇦",
    Australia: "🇦🇺",
    Australie: "🇦🇺",
};

const countryFlag = (country: string): string => FLAG_MAP[country] ?? "🌐";

export default AdminFilmsPage;
