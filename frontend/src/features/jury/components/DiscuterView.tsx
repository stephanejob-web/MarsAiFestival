import React, { useState } from "react";

import type { UseJuryPanelReturn } from "../hooks/useJuryPanel";

interface DiscuterViewProps {
    panel: UseJuryPanelReturn;
}

const THUMB_GRADIENTS = [
    "bg-gradient-to-br from-aurora/20 to-lavande/20",
    "bg-gradient-to-br from-coral/20 to-solar/20",
    "bg-gradient-to-br from-lavande/20 to-aurora/20",
    "bg-gradient-to-br from-solar/20 to-coral/20",
    "bg-gradient-to-br from-aurora/15 to-surface-2",
];

const THUMB_EMOJIS = ["🎬", "🎥", "🎞️", "📽️", "🎦"];

const OPINION_AVATAR_CLASS: Record<string, string> = {
    aurora: "bg-aurora/15 text-aurora",
    lavande: "bg-lavande/15 text-lavande",
    solar: "bg-solar/15 text-solar",
};

const DiscuterView = ({ panel }: DiscuterViewProps): React.JSX.Element => {
    const discussFilms = panel.films.filter((f) => f.myDecision === "discuter");

    const defaultFilm = discussFilms.find((f) => f.id === panel.activeFilmId) ?? discussFilms[0];
    const [selectedFilmId, setSelectedFilmId] = useState<number | null>(defaultFilm?.id ?? null);
    const [commentInput, setCommentInput] = useState("");

    const selectedFilm = discussFilms.find((f) => f.id === selectedFilmId) ?? null;

    const handleSendComment = (): void => {
        if (!commentInput.trim() || !selectedFilm) return;
        panel.addDiscussionComment(selectedFilm.id, commentInput.trim());
        setCommentInput("");
    };

    if (discussFilms.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <div className="mb-3 text-3xl">💬</div>
                    <div className="text-[0.92rem] font-semibold text-white-soft/70">
                        Aucun film à discuter
                    </div>
                    <div className="mt-1.5 text-[0.78rem] text-mist">
                        Cliquez sur &quot;💬 Discuter&quot; depuis la vue évaluation
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Film list */}
            <div className="flex w-[260px] min-w-[260px] flex-col overflow-y-auto border-r border-white/6 bg-surface p-2">
                <div className="mb-2 px-2 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-55">
                    À discuter · {discussFilms.length}
                </div>
                {discussFilms.map((film, index) => {
                    const gradient = THUMB_GRADIENTS[index % THUMB_GRADIENTS.length];
                    const emoji = THUMB_EMOJIS[index % THUMB_EMOJIS.length];
                    const isSelected = film.id === selectedFilmId;
                    return (
                        <div
                            key={film.id}
                            className={`mb-[3px] flex w-full items-center gap-2.5 rounded-[8px] border px-2.5 py-[9px] transition-all ${
                                isSelected
                                    ? "border-lavande/20 bg-lavande/7"
                                    : "border-transparent hover:bg-white/4"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedFilmId(film.id)}
                                className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left"
                            >
                                <div
                                    className={`flex h-[34px] w-[60px] flex-shrink-0 items-center justify-center rounded-[5px] text-[0.9rem] ${gradient}`}
                                >
                                    {emoji}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-[0.82rem] font-semibold">
                                        {film.title}
                                    </div>
                                    <div className="mt-0.5 text-[0.7rem] text-mist">
                                        {film.author} · {film.country}
                                    </div>
                                </div>
                            </button>
                            {film.comments.length > 0 && (
                                <span className="flex-shrink-0 rounded-full bg-lavande/15 px-1.5 font-mono text-[0.62rem] font-semibold text-lavande">
                                    {film.comments.length}
                                </span>
                            )}
                            <button
                                type="button"
                                title="Retirer de la discussion"
                                onClick={() => {
                                    if (selectedFilmId === film.id) {
                                        const remaining = discussFilms.filter(
                                            (f) => f.id !== film.id,
                                        );
                                        setSelectedFilmId(remaining[0]?.id ?? null);
                                    }
                                    panel.removeFromDiscussion(film.id);
                                }}
                                className="flex-shrink-0 rounded-[6px] p-1 text-[0.7rem] text-mist/50 transition-all hover:bg-coral/15 hover:text-coral"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Discussion panel */}
            {selectedFilm ? (
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Film header */}
                    <div className="border-b border-white/7 px-5 py-3">
                        <h3 className="font-display text-[1rem] font-extrabold">
                            {selectedFilm.title}
                        </h3>
                        <div className="text-[0.75rem] text-mist">
                            {selectedFilm.author} · {selectedFilm.country} · {selectedFilm.year}
                        </div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Video + opinions */}
                        <div className="flex w-[400px] min-w-[400px] flex-col overflow-y-auto border-r border-white/6 p-4">
                            {/* Video player */}
                            <div className="mb-4 overflow-hidden rounded-[12px] border border-white/8 bg-black">
                                {selectedFilm.videoUrl ? (
                                    <video
                                        key={selectedFilm.videoUrl}
                                        src={selectedFilm.videoUrl}
                                        controls
                                        className="aspect-video w-full bg-black"
                                        preload="metadata"
                                    />
                                ) : (
                                    <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-[#0d1b3e] via-[#1a0a3e] to-[#0a2e2e]">
                                        <div className="text-center">
                                            <div className="mb-2 text-3xl opacity-30">🎬</div>
                                            <div className="text-[0.75rem] text-mist/50">
                                                Vidéo non disponible
                                            </div>
                                        </div>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/75 px-3.5 py-[5px] text-[0.85rem]">
                                            {selectedFilm.title} · {selectedFilm.author}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Jury opinions */}
                            <div className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-55">
                                Avis des jurés
                            </div>
                            <div className="flex flex-col gap-2">
                                {selectedFilm.opinions.map((opinion) => (
                                    <div
                                        key={opinion.initials}
                                        className="flex items-start gap-3 rounded-[8px] border border-white/5 bg-surface-2 p-3"
                                    >
                                        <div
                                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold ${OPINION_AVATAR_CLASS[opinion.color] ?? ""}`}
                                        >
                                            {opinion.initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[0.8rem] font-semibold">
                                                {opinion.name}
                                            </div>
                                            <div className="mt-0.5 text-[0.72rem] leading-relaxed text-mist">
                                                {opinion.comment}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chat discussion */}
                        <div className="flex flex-1 flex-col">
                            <div className="border-b border-white/5 px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                Discussion · {selectedFilm.title}
                            </div>

                            {/* Messages */}
                            <div
                                className="flex-1 overflow-y-auto p-4"
                                ref={(el) => {
                                    if (el) el.scrollTop = el.scrollHeight;
                                }}
                            >
                                {selectedFilm.comments.length === 0 ? (
                                    <div className="flex h-full items-center justify-center text-[0.78rem] italic text-mist/50">
                                        Aucun message pour ce film. Lancez la discussion !
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {selectedFilm.comments.map((comment, i) => (
                                            <div key={i} className="flex items-start gap-2.5">
                                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurora/70 to-lavande/70 text-[0.55rem] font-bold text-deep-sky">
                                                    Moi
                                                </div>
                                                <div className="max-w-[85%] rounded-xl rounded-bl-sm bg-white/6 px-3 py-2 text-[0.78rem] leading-snug text-white-soft/85">
                                                    {comment}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="border-t border-white/7 p-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSendComment();
                                        }}
                                        placeholder={`Discuter de ${selectedFilm.title}…`}
                                        className="flex-1 rounded-[8px] border border-white/10 bg-white/4 px-3 py-2 text-[0.82rem] text-white-soft outline-none placeholder:text-mist/50 focus:border-lavande/35"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSendComment}
                                        className="rounded-[9px] bg-lavande px-4 py-2 font-display text-[0.82rem] font-extrabold text-white transition-opacity hover:opacity-90"
                                    >
                                        ↑
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default DiscuterView;
