import React from "react";

import type { Decision, JuryFilm } from "../types";

interface FilmListProps {
    films: JuryFilm[];
    activeFilm: JuryFilm;
    onSelectFilm: (id: number) => void;
}

const THUMB_GRADIENTS = [
    "bg-gradient-to-br from-aurora/20 to-lavande/20",
    "bg-gradient-to-br from-coral/20 to-solar/20",
    "bg-gradient-to-br from-lavande/20 to-aurora/20",
    "bg-gradient-to-br from-solar/20 to-coral/20",
    "bg-gradient-to-br from-aurora/15 to-surface-2",
];

const THUMB_EMOJIS = ["🎬", "🎥", "🎞️", "📽️", "🎦"];

const STATUS_DOT_CLASS: Record<string, string> = {
    valide: "bg-aurora",
    aRevoir: "bg-solar",
    refuse: "bg-coral",
    null: "bg-solar",
};

const DECISION_BADGE_CLASS: Record<string, string> = {
    valide: "bg-aurora/10 text-aurora",
    aRevoir: "bg-solar/10 text-solar",
    refuse: "bg-coral/10 text-coral",
};

const getDecisionLabel = (decision: Decision): string => {
    if (decision === "valide") return "Validé";
    if (decision === "aRevoir") return "À revoir";
    if (decision === "refuse") return "Refusé";
    return "—";
};

const FilmList = ({ films, activeFilm, onSelectFilm }: FilmListProps): React.JSX.Element => {
    return (
        <div className="flex w-[300px] min-w-[300px] flex-col overflow-y-auto border-r border-white/6 bg-surface p-2">
            {films.map((film, index) => {
                const gradientClass = THUMB_GRADIENTS[index % THUMB_GRADIENTS.length];
                const emoji = THUMB_EMOJIS[index % THUMB_EMOJIS.length];
                const dotClass = STATUS_DOT_CLASS[film.myDecision ?? "null"] ?? "bg-solar";
                const isSelected = film.id === activeFilm.id;

                return (
                    <button
                        key={film.id}
                        type="button"
                        onClick={() => onSelectFilm(film.id)}
                        className={`mb-[3px] flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] border px-2.5 py-[9px] transition-all hover:bg-white/4 ${
                            isSelected ? "border-aurora/20 bg-aurora/7" : "border-transparent"
                        }`}
                    >
                        {/* Thumbnail */}
                        <div
                            className={`relative flex h-[34px] w-[60px] flex-shrink-0 items-center justify-center rounded-[5px] text-[0.9rem] ${gradientClass}`}
                        >
                            {emoji}
                            <span
                                className={`absolute right-[3px] top-[3px] h-[6px] w-[6px] rounded-full ${dotClass}`}
                            />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-[0.82rem] font-semibold">
                                {film.title}
                            </div>
                            <div className="mt-0.5 text-[0.7rem] text-mist">
                                {film.author} · {film.country}
                            </div>
                        </div>

                        {/* Decision badge */}
                        {film.myDecision !== null ? (
                            <span
                                className={`flex-shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.04em] ${DECISION_BADGE_CLASS[film.myDecision]}`}
                            >
                                {getDecisionLabel(film.myDecision)}
                            </span>
                        ) : (
                            <span className="flex-shrink-0 text-[0.7rem] font-normal text-mist/35">
                                —
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default FilmList;
