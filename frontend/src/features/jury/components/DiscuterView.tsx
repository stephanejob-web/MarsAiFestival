import React, { useEffect, useRef, useState } from "react";

import type { UseJuryPanelReturn } from "../hooks/useJuryPanel";
import useDiscussionSocket from "../hooks/useDiscussionSocket";
import useSharedDiscussion from "../hooks/useSharedDiscussion";
import useJuryUser from "../hooks/useJuryUser";

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

const AVATAR_COLORS = [
    "bg-aurora/20 text-aurora",
    "bg-lavande/20 text-lavande",
    "bg-solar/20 text-solar",
    "bg-coral/20 text-coral",
];

const avatarColor = (juryId: number): string => AVATAR_COLORS[juryId % AVATAR_COLORS.length];

const DiscuterView = ({ panel }: DiscuterViewProps): React.JSX.Element => {
    const currentUser = useJuryUser();
    const { films: sharedFilms } = useSharedDiscussion();

    // Convertir les films partagés au même format que JuryFilm pour la compatibilité
    const discussFilms = sharedFilms.map((f) => ({
        id: f.film_id,
        title: f.original_title,
        author: `${f.realisator_first} ${f.realisator_last}`,
        country: f.realisator_country ?? "—",
        year: String(f.film_year ?? 2026),
        videoUrl: f.video_url ?? null,
        myDecision: "discuter" as const,
        // champs requis par JuryFilm mais non utilisés dans DiscuterView
        duration: f.duration
            ? `${Math.floor(f.duration / 60)}:${String(f.duration % 60).padStart(2, "0")}`
            : "—",
        format: f.ia_class === "full" ? "Full IA" : "Hybride",
        subtitles: f.subtitle_fr_url ? "FR" : f.subtitle_en_url ? "EN" : "—",
        copyright: "Vérifié",
        tools: f.tech_stack ?? "—",
        iaScenario: f.ia_scenario ? "Oui" : "Non",
        iaImage: f.ia_image ? "Oui" : "Non",
        iaPost: f.ia_post ? "Oui" : "Non",
        note: f.creative_workflow ?? "",
        comments: [],
        opinions: [],
        votes: [],
    }));

    const firstFilmId = discussFilms[0]?.id ?? null;
    const [selectedFilmId, setSelectedFilmId] = useState<number | null>(firstFilmId);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-sélectionner le premier film quand la liste se charge (était vide)
    useEffect(() => {
        if (selectedFilmId === null && firstFilmId !== null) {
            setSelectedFilmId(firstFilmId); // eslint-disable-line react-hooks/set-state-in-effect
        }
    }, [firstFilmId, selectedFilmId]);

    const selectedFilm = discussFilms.find((f) => f.id === selectedFilmId) ?? null;
    const { messages, onlineUsers, sendMessage, isConnected } = useDiscussionSocket(selectedFilmId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (): void => {
        if (!input.trim()) return;
        sendMessage(input.trim());
        setInput("");
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
            <div className="flex w-[220px] min-w-[220px] flex-col overflow-y-auto border-r border-white/6 bg-surface p-2">
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
                            className={`mb-[3px] flex w-full items-center gap-2 rounded-[8px] border px-2 py-[8px] transition-all ${
                                isSelected
                                    ? "border-lavande/20 bg-lavande/7"
                                    : "border-transparent hover:bg-white/4"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedFilmId(film.id)}
                                className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
                            >
                                <div
                                    className={`flex h-[30px] w-[52px] flex-shrink-0 items-center justify-center rounded-[5px] text-[0.85rem] ${gradient}`}
                                >
                                    {emoji}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-[0.78rem] font-semibold">
                                        {film.title}
                                    </div>
                                    <div className="mt-0.5 text-[0.65rem] text-mist">
                                        {film.author}
                                    </div>
                                </div>
                            </button>
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

            {/* Chat panel */}
            {selectedFilm ? (
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/7 px-5 py-3">
                        <div>
                            <h3 className="font-display text-[0.95rem] font-extrabold">
                                {selectedFilm.title}
                            </h3>
                            <div className="text-[0.72rem] text-mist">
                                {selectedFilm.author} · {selectedFilm.country} · {selectedFilm.year}
                            </div>
                        </div>
                        {/* Online avatars */}
                        <div className="flex items-center gap-2">
                            <div
                                className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-aurora" : "bg-mist/30"}`}
                            />
                            <div className="flex -space-x-1.5">
                                {onlineUsers.slice(0, 6).map((u) => (
                                    <div
                                        key={u.socketId}
                                        title={u.name}
                                        className={`flex h-6 w-6 items-center justify-center rounded-full border border-surface text-[0.55rem] font-bold ${avatarColor(u.juryId)}`}
                                    >
                                        {u.initials}
                                    </div>
                                ))}
                                {onlineUsers.length > 6 && (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-surface bg-white/8 text-[0.55rem] font-bold text-mist">
                                        +{onlineUsers.length - 6}
                                    </div>
                                )}
                            </div>
                            {onlineUsers.length > 0 && (
                                <span className="text-[0.65rem] text-mist">
                                    {onlineUsers.length} en ligne
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Left: video + connected users */}
                        <div className="flex w-[320px] min-w-[320px] flex-col overflow-y-auto border-r border-white/6 p-4">
                            <div className="mb-3 overflow-hidden rounded-[12px] border border-white/8 bg-black">
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
                                            <div className="text-[0.72rem] text-mist/50">
                                                Vidéo non disponible
                                            </div>
                                        </div>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/75 px-3 py-[4px] text-[0.75rem]">
                                            {selectedFilm.title} · {selectedFilm.author}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {onlineUsers.length > 0 && (
                                <div>
                                    <div className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-55">
                                        Connectés · {onlineUsers.length}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        {onlineUsers.map((u) => (
                                            <div
                                                key={u.socketId}
                                                className="flex items-center gap-2 rounded-[7px] border border-white/5 bg-surface-2 px-2.5 py-1.5"
                                            >
                                                {u.profilPicture ? (
                                                    <img
                                                        src={u.profilPicture}
                                                        alt={u.initials}
                                                        className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
                                                        onError={(e) => {
                                                            (
                                                                e.target as HTMLImageElement
                                                            ).style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[0.58rem] font-bold ${avatarColor(u.juryId)}`}
                                                    >
                                                        {u.initials}
                                                    </div>
                                                )}
                                                <span className="text-[0.75rem] font-medium">
                                                    {u.name}
                                                </span>
                                                <div className="ml-auto flex items-center gap-1.5">
                                                    {u.juryId === currentUser?.id && (
                                                        <span className="text-[0.6rem] text-mist/50">
                                                            vous
                                                        </span>
                                                    )}
                                                    <div className="h-1.5 w-1.5 rounded-full bg-aurora" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: chat */}
                        <div className="flex flex-1 flex-col">
                            <div className="border-b border-white/5 px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                Discussion · {selectedFilm.title}
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {messages.length === 0 ? (
                                    <div className="flex h-full items-center justify-center text-[0.78rem] italic text-mist/40">
                                        Aucun message — lancez la discussion !
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        {messages.map((msg) => {
                                            const isMe = msg.juryId === currentUser?.id;
                                            const d = new Date(msg.sentAt);
                                            const dateStr = d.toLocaleDateString("fr", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            });
                                            const timeStr = d.toLocaleTimeString("fr", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            });
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex items-start gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/3 ${isMe ? "bg-lavande/4" : ""}`}
                                                >
                                                    {/* Avatar */}
                                                    {msg.profilPicture ? (
                                                        <img
                                                            src={msg.profilPicture}
                                                            alt={msg.initials}
                                                            className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-full object-cover"
                                                            onError={(e) => {
                                                                (
                                                                    e.target as HTMLImageElement
                                                                ).style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold ${avatarColor(msg.juryId)}`}
                                                        >
                                                            {msg.initials}
                                                        </div>
                                                    )}
                                                    {/* Content */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-baseline gap-2">
                                                            <span
                                                                className={`text-[0.82rem] font-semibold ${isMe ? "text-lavande" : "text-white-soft"}`}
                                                            >
                                                                {msg.name}
                                                            </span>
                                                            <span className="text-[0.62rem] text-mist/45">
                                                                {dateStr} à {timeStr}
                                                            </span>
                                                        </div>
                                                        <p className="mt-0.5 break-words text-[0.82rem] leading-[1.55] text-white-soft/85">
                                                            {msg.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/7 p-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSend();
                                        }}
                                        placeholder={`Discuter de ${selectedFilm.title}…`}
                                        className="flex-1 rounded-[8px] border border-white/10 bg-white/4 px-3 py-2 text-[0.82rem] text-white-soft outline-none placeholder:text-mist/50 focus:border-lavande/35"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        disabled={!isConnected || !input.trim()}
                                        className="rounded-[9px] bg-lavande px-4 py-2 font-display text-[0.82rem] font-extrabold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
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
