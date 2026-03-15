import React, { useState } from "react";
import type { AdminFilm, AdminJuryMember, AdminAssignment } from "../types";

interface FilmDrawerProps {
    film: AdminFilm | null;
    juryMembers: AdminJuryMember[];
    assignments: AdminAssignment[];
    onClose: () => void;
    onToggleJury: (juryId: number, filmId: number) => Promise<void>;
}

const AVATAR_GRADIENTS = [
    "from-aurora to-lavande text-deep-sky",
    "from-coral to-lavande text-white",
    "from-solar to-aurora text-deep-sky",
    "from-lavande to-coral text-white",
    "from-aurora to-solar text-deep-sky",
    "from-coral to-solar text-white",
];

const FilmDrawer = ({
    film,
    juryMembers,
    assignments,
    onClose,
    onToggleJury,
}: FilmDrawerProps): React.JSX.Element => {
    const [search, setSearch] = useState<string>("");

    const isOpen = film !== null;

    const assignedJuryIds = new Set(
        assignments.filter((a) => film && a.film_id === film.id).map((a) => a.jury_id),
    );

    const filteredJury = juryMembers
        .filter((j) => {
            const q = search.toLowerCase();
            return j.first_name.toLowerCase().includes(q) || j.last_name.toLowerCase().includes(q);
        })
        .sort((a, b) => {
            const aA = assignedJuryIds.has(a.id) ? 0 : 1;
            const bA = assignedJuryIds.has(b.id) ? 0 : 1;
            return aA - bA;
        });

    const assignedCount = assignedJuryIds.size;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[700] bg-[rgba(5,8,24,0.55)] backdrop-blur-[4px] transition-opacity duration-[280ms] ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div
                className={`fixed bottom-0 right-0 top-0 z-[710] flex w-[380px] flex-col border-l border-white/[0.08] bg-surface shadow-[-32px_0_80px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex shrink-0 items-start gap-2.5 border-b border-white/[0.06] px-[18px] pb-3.5 pt-[18px]">
                    <div className="flex-1">
                        <div className="font-display text-[0.95rem] font-extrabold leading-tight text-white-soft">
                            {film?.original_title ?? "—"}
                        </div>
                        <div className="mt-0.5 text-[0.72rem] text-mist">
                            {film ? `${film.first_name} ${film.last_name} · ${film.country}` : "—"}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-0.5 shrink-0 cursor-pointer p-0.5 text-[1rem] text-mist transition-colors hover:text-white-soft"
                    >
                        ✕
                    </button>
                </div>

                {/* Video player */}
                {film?.video_url && (
                    <div className="shrink-0 border-b border-white/[0.06] bg-black">
                        <video
                            key={film.video_url}
                            src={film.video_url}
                            controls
                            preload="metadata"
                            className="block max-h-[190px] w-full object-cover"
                        />
                    </div>
                )}

                {/* Jury section */}
                <div className="flex flex-1 flex-col overflow-hidden px-3.5 pb-0 pt-3.5">
                    {/* Header row */}
                    <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-mist">
                            Jury assigné
                        </span>
                        <span className="rounded-full bg-aurora/10 px-[9px] py-[2px] font-mono text-[0.72rem] font-bold text-aurora">
                            {assignedCount} / {juryMembers.length}
                        </span>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="🔍 Rechercher un juré…"
                        className="mb-2 w-full rounded-[9px] border border-white/[0.09] bg-white/[0.04] px-3 py-2 font-body text-[0.82rem] text-white-soft outline-none transition-colors placeholder:text-mist focus:border-aurora/35"
                    />

                    {/* Jury list */}
                    <div className="flex flex-1 flex-col gap-[3px] overflow-y-auto pb-3.5">
                        {filteredJury.length === 0 ? (
                            <div className="py-5 text-center text-[0.8rem] text-mist">
                                Aucun résultat
                            </div>
                        ) : (
                            filteredJury.map((j, idx) => {
                                const isAssigned = assignedJuryIds.has(j.id);
                                const initials =
                                    `${j.first_name[0]}${j.last_name[0]}`.toUpperCase();
                                const gradClass = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];

                                return (
                                    <button
                                        key={j.id}
                                        type="button"
                                        onClick={() => {
                                            if (film) void onToggleJury(j.id, film.id);
                                        }}
                                        className={`flex cursor-pointer select-none items-center gap-2.5 rounded-[9px] border px-2.5 py-2 text-left transition-all duration-150 hover:bg-white/[0.04] ${
                                            isAssigned
                                                ? "border-aurora/[0.18] bg-aurora/[0.06]"
                                                : "border-transparent"
                                        }`}
                                    >
                                        {/* Avatar */}
                                        {j.profil_picture ? (
                                            <img
                                                src={j.profil_picture}
                                                alt=""
                                                className={`h-9 w-9 shrink-0 rounded-full object-cover transition-shadow ${isAssigned ? "shadow-[0_0_0_2px_#4effce]" : "shadow-[0_0_0_1.5px_rgba(255,255,255,0.12)]"}`}
                                            />
                                        ) : (
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[0.7rem] font-extrabold transition-shadow ${gradClass} ${isAssigned ? "shadow-[0_0_0_2px_#4effce]" : "shadow-[0_0_0_1.5px_rgba(255,255,255,0.12)]"}`}
                                            >
                                                {initials}
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[0.82rem] font-semibold text-white-soft">
                                                {j.first_name} {j.last_name}
                                            </div>
                                            <div className="mt-px text-[0.68rem] text-mist">
                                                Juré
                                            </div>
                                        </div>

                                        {/* Checkbox */}
                                        <div
                                            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] text-[0.55rem] font-black transition-all ${
                                                isAssigned
                                                    ? "bg-aurora text-deep-sky shadow-[0_0_0_0]"
                                                    : "border border-white/20 text-transparent"
                                            }`}
                                        >
                                            ✓
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilmDrawer;
