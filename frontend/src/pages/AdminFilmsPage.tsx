import React, { useState, useEffect } from "react";
import useAdminFilms from "../features/admin/hooks/useAdminFilms";
import { apiFetch } from "../services/api";
import FilmDetailDrawer from "../features/admin/components/FilmDetailDrawer";

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

interface PresignedVideoProps {
    filmId: number;
}

const PresignedVideo = ({ filmId }: PresignedVideoProps): React.JSX.Element => {
    const [src, setSrc] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        apiFetch<{ success: boolean; url: string }>(`/api/films/${filmId}/video-url`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => {
                if (res.success) setSrc(res.url);
                else setError(true);
            })
            .catch(() => setError(true));
    }, [filmId]);

    if (error)
        return (
            <div className="flex aspect-video w-full items-center justify-center bg-black text-[0.78rem] text-coral">
                Vidéo inaccessible
            </div>
        );
    if (!src)
        return (
            <div className="flex aspect-video w-full items-center justify-center bg-black text-[0.78rem] text-mist">
                Chargement…
            </div>
        );
    return (
        <video
            src={src}
            controls
            autoPlay
            preload="auto"
            className="aspect-video w-full object-cover"
        />
    );
};

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
        lastDistribution,
        toggleAssignment,
        autoDistribute,
        undoDistribution,
        clearDistribution,
        unassignAll,
        deleteFilm,
        selectFilm,
    } = useAdminFilms();
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [confirmUnassignAll, setConfirmUnassignAll] = useState(false);
    const [detailFilmId, setDetailFilmId] = useState<number | null>(null);

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
                    {films.length} films · {activeJuryCount} jurés actifs · {assignments.length}{" "}
                    assignations
                </span>
                <div className="ml-auto flex items-center gap-2">
                    {confirmUnassignAll ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[0.73rem] text-mist">Confirmer ?</span>
                            <button
                                type="button"
                                onClick={() => {
                                    void unassignAll();
                                    setConfirmUnassignAll(false);
                                }}
                                className="rounded-lg border border-coral/40 bg-coral/15 px-3 py-1 text-[0.73rem] font-bold text-coral transition-all hover:bg-coral/25"
                            >
                                Oui, tout désassigner
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmUnassignAll(false)}
                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[0.73rem] text-mist transition-all hover:bg-white/10"
                            >
                                Annuler
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirmUnassignAll(true)}
                            disabled={assignments.length === 0}
                            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[0.73rem] font-semibold text-mist transition-all hover:border-coral/30 hover:bg-coral/[0.07] hover:text-coral disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <circle
                                    cx="6"
                                    cy="4"
                                    r="2.2"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                />
                                <path
                                    d="M1.5 10.5c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M9 1l2.5 2.5M11.5 1L9 3.5"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                    strokeLinecap="round"
                                />
                            </svg>
                            Tout désassigner ({assignments.length})
                        </button>
                    )}
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
                                        <circle
                                            cx="3.5"
                                            cy="10"
                                            r="2"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                        />
                                        <circle
                                            cx="16.5"
                                            cy="4.5"
                                            r="2"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                        />
                                        <circle
                                            cx="16.5"
                                            cy="15.5"
                                            r="2"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                        />
                                        <path
                                            d="M5.5 10C7 10 8 4.5 14.5 4.5"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M5.5 10C7 10 8 15.5 14.5 15.5"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-display text-[0.95rem] font-extrabold tracking-[-0.01em] text-aurora">
                                        {isDistributing
                                            ? "Distribution en cours…"
                                            : "Répartir équitablement"}
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
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="text-aurora/50"
                                >
                                    <path
                                        d="M3 8h10M9 4l4 4-4 4"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </button>

                        {/* Distribution result banner */}
                        {lastDistribution !== null && (
                            <div className="mb-5 flex items-center gap-3 rounded-[12px] border border-aurora/30 bg-aurora/[0.08] px-4 py-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-aurora/20 text-[0.85rem] text-aurora">
                                    ✓
                                </span>
                                <span className="flex-1 text-[0.82rem] text-white-soft">
                                    {lastDistribution.assigned > 0 ? (
                                        <>
                                            <span className="font-bold text-aurora">
                                                {lastDistribution.assigned} film
                                                {lastDistribution.assigned > 1 ? "s" : ""}
                                            </span>{" "}
                                            réparti
                                            {lastDistribution.assigned > 1 ? "s" : ""} équitablement
                                            entre les jurés.
                                        </>
                                    ) : (
                                        "Tous les films sont déjà assignés."
                                    )}
                                </span>
                                <div className="flex shrink-0 items-center gap-2">
                                    {lastDistribution.assigned > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => void undoDistribution()}
                                            className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-1.5 text-[0.75rem] font-semibold text-coral transition-all hover:border-coral/50 hover:bg-coral/20"
                                        >
                                            ↩ Annuler la répartition
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={clearDistribution}
                                        className="flex h-6 w-6 items-center justify-center rounded-full text-mist transition-all hover:bg-white/10 hover:text-white-soft"
                                        title="Fermer"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Search */}
                        <div className="relative mb-3.5">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.85rem] opacity-40">
                                🔍
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
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
                                        {
                                            id: "unassigned",
                                            label: "Non assignés",
                                            count: unassignedCount,
                                        },
                                        { id: "assigned", label: "Assignés", count: assignedCount },
                                    ] as { id: FilterMode; label: string; count?: number }[]
                                ).map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => {
                                            setFilter(tab.id);
                                            setCurrentPage(1);
                                        }}
                                        className={`flex items-center gap-1.5 rounded-[8px] px-[13px] py-[7px] text-[0.78rem] font-semibold transition-all duration-150 ${
                                            filter === tab.id
                                                ? "bg-aurora/10 text-aurora shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
                                                : "text-mist hover:bg-white/[0.05] hover:text-white-soft"
                                        }`}
                                    >
                                        {tab.label}
                                        {tab.count !== undefined && (
                                            <span className="text-[0.7rem] opacity-60">
                                                {tab.count}
                                            </span>
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
                                    const isSelected =
                                        film.statut === "selectionne" ||
                                        film.statut === "finaliste";
                                    const nJury = assignments.filter(
                                        (a) => a.film_id === film.id,
                                    ).length;
                                    const filmAssignmentIds = new Set(
                                        assignments
                                            .filter((a) => a.film_id === film.id)
                                            .map((a) => a.jury_id),
                                    );

                                    return (
                                        <div
                                            key={film.id}
                                            className={`overflow-hidden rounded-[14px] border transition-all duration-[180ms] hover:-translate-y-[2px] ${
                                                isSelected
                                                    ? "border-aurora/60 bg-surface-2 opacity-85 shadow-[0_0_0_1px_rgba(78,255,206,0.25),0_0_24px_rgba(78,255,206,0.12),0_4px_18px_rgba(0,0,0,0.25)]"
                                                    : isAssigned
                                                      ? "border-aurora/35 bg-surface-2 shadow-[0_0_0_1px_rgba(78,255,206,0.15),0_4px_18px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.35)]"
                                                      : "border-white/[0.06] bg-surface-2 hover:shadow-[0_8px_28px_rgba(0,0,0,0.35)]"
                                            }`}
                                        >
                                            {/* Accent bar — aurora when selected */}
                                            <div
                                                className="h-[3px] w-full"
                                                style={{
                                                    background: isSelected ? "#4effce" : accent,
                                                    opacity: isSelected ? 1 : 0.7,
                                                }}
                                            />

                                            {/* Video */}
                                            {film.video_url && activatedVideos.has(film.id) ? (
                                                <div className="bg-black">
                                                    <PresignedVideo filmId={film.id} />
                                                </div>
                                            ) : (
                                                <div
                                                    className="group/thumb relative flex aspect-video w-full items-center justify-center overflow-hidden"
                                                    style={{
                                                        background: isSelected
                                                            ? "rgba(78,255,206,0.06)"
                                                            : `${accent}11`,
                                                    }}
                                                >
                                                    {/* Selected badge */}
                                                    {isSelected && (
                                                        <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full border border-aurora/40 bg-aurora/15 px-2.5 py-1 backdrop-blur-sm">
                                                            <span className="text-[0.65rem] text-aurora">
                                                                ★
                                                            </span>
                                                            <span className="font-display text-[0.65rem] font-extrabold tracking-wide text-aurora">
                                                                {film.statut === "finaliste"
                                                                    ? "Finaliste"
                                                                    : "Sélectionné"}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="absolute right-2 top-2 text-[1.1rem]">
                                                        {countryFlag(film.country)}
                                                    </div>
                                                    {film.video_url && (
                                                        <button
                                                            type="button"
                                                            onClick={() => activateVideo(film.id)}
                                                            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100"
                                                        >
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                                                                <svg
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 18 18"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M6 4l9 5-9 5V4z"
                                                                        fill="#0A0F2E"
                                                                    />
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
                                            <div
                                                className={`p-3.5 ${isSelected ? "bg-aurora/[0.03]" : ""}`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setDetailFilmId(film.id)}
                                                    className={`group/title mb-0.5 flex w-full items-start gap-1.5 text-left text-[0.88rem] font-bold leading-snug ${isSelected ? "text-aurora" : "text-white-soft"}`}
                                                >
                                                    <span className="group-hover/title:underline">
                                                        {film.original_title}
                                                    </span>
                                                    <span className="mt-0.5 shrink-0 rounded border border-white/[0.12] bg-white/[0.06] px-1 py-[1px] font-mono text-[0.52rem] font-normal text-mist">
                                                        détails
                                                    </span>
                                                </button>
                                                <div className="text-[0.72rem] text-mist">
                                                    {film.first_name} {film.last_name} ·{" "}
                                                    {film.country}
                                                </div>
                                                <div className="mt-0.5 font-mono text-[0.75rem] font-bold text-mist opacity-60">
                                                    #{film.id}
                                                </div>

                                                {/* Jury avatars — clic direct pour assigner */}
                                                <div className="mt-3">
                                                    <div className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-mist opacity-60">
                                                        Jury
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        {juryMembers.map((j, idx) => {
                                                            const jAssigned = filmAssignmentIds.has(
                                                                j.id,
                                                            );
                                                            const initials =
                                                                `${j.first_name[0]}${j.last_name[0]}`.toUpperCase();
                                                            const grad =
                                                                AVATAR_GRADIENTS[
                                                                    idx % AVATAR_GRADIENTS.length
                                                                ];

                                                            return (
                                                                <button
                                                                    key={j.id}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        void toggleAssignment(
                                                                            j.id,
                                                                            film.id,
                                                                        )
                                                                    }
                                                                    className={`flex cursor-pointer flex-col items-center gap-1.5 transition-all duration-150 ${
                                                                        jAssigned
                                                                            ? "opacity-100"
                                                                            : "opacity-30 hover:opacity-70"
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
                                                                                src={
                                                                                    j.profil_picture
                                                                                }
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
                                                                        <div
                                                                            className={`text-[0.65rem] font-semibold leading-tight ${jAssigned ? "text-white-soft" : "text-mist"}`}
                                                                        >
                                                                            {j.first_name}
                                                                        </div>
                                                                        <div
                                                                            className={`text-[0.65rem] leading-tight ${jAssigned ? "text-white-soft" : "text-mist"}`}
                                                                        >
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
                                                                {nJury} juré{nJury > 1 ? "s" : ""}{" "}
                                                                assigné{nJury > 1 ? "s" : ""}
                                                            </span>
                                                        ) : (
                                                            <span className="text-mist">
                                                                Non assigné
                                                            </span>
                                                        )}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {/* Bouton Top 50 */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                void selectFilm(
                                                                    film.id,
                                                                    film.statut !== "selectionne",
                                                                )
                                                            }
                                                            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[0.68rem] font-bold transition-all ${
                                                                isSelected
                                                                    ? "bg-aurora text-deep-sky shadow-[0_1px_8px_rgba(78,255,206,0.3)] hover:opacity-90"
                                                                    : "border border-white/[0.10] bg-white/[0.03] text-mist hover:border-aurora/30 hover:bg-aurora/[0.06] hover:text-aurora"
                                                            }`}
                                                        >
                                                            {isSelected
                                                                ? "✓ Top 50"
                                                                : "★ Sélectionner"}
                                                        </button>
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
                                                        {confirmDelete === film.id ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        void deleteFilm(film.id);
                                                                        setConfirmDelete(null);
                                                                    }}
                                                                    className="flex items-center gap-1 rounded-lg border border-coral/30 bg-coral/15 px-2.5 py-1 text-[0.68rem] font-bold text-coral transition-all hover:border-coral/50 hover:bg-coral/25"
                                                                >
                                                                    <svg
                                                                        width="10"
                                                                        height="10"
                                                                        viewBox="0 0 10 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M2 5h6M5 2l3 3-3 3"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.4"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                    Supprimer
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setConfirmDelete(null)
                                                                    }
                                                                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] text-mist transition-all hover:bg-white/10 hover:text-white-soft"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setConfirmDelete(film.id)
                                                                }
                                                                title="Supprimer le film"
                                                                className="group/del flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1 text-[0.68rem] font-medium text-mist/40 transition-all hover:border-coral/20 hover:bg-coral/8 hover:text-coral"
                                                            >
                                                                <svg
                                                                    width="11"
                                                                    height="12"
                                                                    viewBox="0 0 11 12"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M1 3h9M4 3V2h3v1M2 3l.5 7h6L9 3"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.3"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M4.5 5.5v3M6.5 5.5v3"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.3"
                                                                        strokeLinecap="round"
                                                                    />
                                                                </svg>
                                                                Supprimer
                                                            </button>
                                                        )}
                                                    </div>
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
                                    .filter(
                                        (p) =>
                                            p === 1 ||
                                            p === totalPages ||
                                            Math.abs(p - safePage) <= 1,
                                    )
                                    .reduce<(number | "…")[]>((acc, p, i, arr) => {
                                        if (
                                            i > 0 &&
                                            typeof arr[i - 1] === "number" &&
                                            (p as number) - (arr[i - 1] as number) > 1
                                        )
                                            acc.push("…");
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, i) =>
                                        p === "…" ? (
                                            <span
                                                key={`dots-${i}`}
                                                className="px-1 text-[0.75rem] text-mist opacity-40"
                                            >
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

            <FilmDetailDrawer filmId={detailFilmId} onClose={() => setDetailFilmId(null)} />
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
