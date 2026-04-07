import React, { useEffect, useRef, useState } from "react";
import { Send, Users } from "lucide-react";
import { VocalJoinButton } from "./VocalPanel";
import useDiscussionSocket from "../hooks/useDiscussionSocket";
import useLivePoll from "../hooks/useLivePoll";

// ── Live Poll bar ─────────────────────────────────────────────────────────────

interface PollBarProps {
    label: string;
    count: number;
    total: number;
    color: string;
    glow: string;
}

const PollBar = ({ label, count, total, color, glow }: PollBarProps): React.JSX.Element => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <span className="text-[0.7rem] font-semibold text-mist">{label}</span>
                <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[0.72rem] font-bold" style={{ color }}>
                        {count}
                    </span>
                    <span className="text-[0.65rem] text-mist/40">{pct}%</span>
                </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                        width: `${pct}%`,
                        background: color,
                        boxShadow: pct > 0 ? `0 0 8px ${glow}` : "none",
                    }}
                />
            </div>
        </div>
    );
};

// ── Message bubble ─────────────────────────────────────────────────────────────

interface Msg {
    id: number;
    juryId: number;
    name: string;
    initials: string;
    profilPicture: string | null;
    message: string;
    sentAt: string;
}

const MsgBubble = ({ msg, isSelf }: { msg: Msg; isSelf: boolean }): React.JSX.Element => {
    const time = new Date(msg.sentAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return (
        <div className={`flex gap-2 ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande text-[0.55rem] font-extrabold text-deep-sky">
                {msg.profilPicture ? (
                    <img src={msg.profilPicture} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                    msg.initials
                )}
            </div>
            <div className={`flex max-w-[78%] flex-col gap-0.5 ${isSelf ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-1.5">
                    <span className="text-[0.62rem] font-semibold text-mist/70">{msg.name}</span>
                    <span className="text-[0.58rem] text-mist/30">{time}</span>
                </div>
                <div
                    className={`rounded-2xl px-3 py-2 text-[0.78rem] leading-snug ${
                        isSelf
                            ? "rounded-tr-sm bg-aurora/15 text-aurora"
                            : "rounded-tl-sm bg-white/[0.07] text-white-soft"
                    }`}
                >
                    {msg.message}
                </div>
            </div>
        </div>
    );
};

// ── Main DelibView ─────────────────────────────────────────────────────────────

interface DelibViewProps {
    filmId?: number | null;
    filmTitle?: string;
}

const DelibView = ({ filmId = null, filmTitle }: DelibViewProps): React.JSX.Element => {
    const { messages, onlineUsers, sendMessage, isConnected } = useDiscussionSocket(filmId);
    const poll = useLivePoll(filmId);
    const [input, setInput] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentJuryId = (() => {
        try {
            const token = localStorage.getItem("jury_token");
            if (!token) return null;
            const payload = JSON.parse(atob(token.split(".")[1])) as { id: number };
            return payload.id;
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (): void => {
        if (!input.trim()) return;
        sendMessage(input.trim());
        setInput("");
    };

    const totalVotes = poll?.total ?? 0;

    return (
        <div className="flex h-full w-full gap-0 overflow-hidden">
            {/* ── Gauche : Présence + Vocal ────────────────────────────────── */}
            <div className="flex w-[240px] shrink-0 flex-col border-r border-white/[0.06] bg-[#080d18]">
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-aurora" />
                    <span className="font-display text-[0.78rem] font-extrabold text-white-soft">
                        Délibération
                    </span>
                    <span className="ml-auto rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[0.62rem] text-mist">
                        {onlineUsers.length} en ligne
                    </span>
                </div>

                {filmTitle && (
                    <div className="border-b border-white/[0.06] px-4 py-2.5">
                        <div className="text-[0.6rem] font-semibold uppercase tracking-widest text-mist/40">
                            Film en délibération
                        </div>
                        <div className="mt-1 line-clamp-2 text-[0.78rem] font-bold leading-snug text-aurora">
                            {filmTitle}
                        </div>
                    </div>
                )}

                <div className="border-b border-white/[0.06] px-2 py-2">
                    <VocalJoinButton
                        isJoined={isJoined}
                        onJoin={() => setIsJoined(true)}
                        onLeave={() => setIsJoined(false)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3">
                    <div className="mb-2 flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-widest text-mist/40">
                        <Users size={9} />
                        Présents
                    </div>
                    <div className="flex flex-col gap-2">
                        {onlineUsers.length === 0 ? (
                            <span className="text-[0.7rem] text-mist/30">En attente…</span>
                        ) : (
                            onlineUsers.map((u) => (
                                <div key={u.socketId} className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande text-[0.5rem] font-extrabold text-deep-sky overflow-hidden">
                                        {u.profilPicture ? (
                                            <img src={u.profilPicture} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            u.initials
                                        )}
                                    </div>
                                    <span className="flex-1 truncate text-[0.7rem] text-white-soft/80">
                                        {u.name}
                                    </span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-aurora/70" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ── Centre : Live Poll ───────────────────────────────────────── */}
            <div className="flex w-[260px] shrink-0 flex-col border-r border-white/[0.06] bg-[#06090f]">
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                    <span className="font-display text-[0.78rem] font-extrabold text-white-soft">
                        Votes live
                    </span>
                    {totalVotes > 0 && (
                        <span className="ml-auto rounded-full border border-aurora/20 bg-aurora/[0.08] px-2 py-0.5 font-mono text-[0.6rem] text-aurora">
                            {totalVotes} vote{totalVotes > 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                    {filmId ? (
                        <>
                            <PollBar
                                label="Valide"
                                count={poll?.tally.valide ?? 0}
                                total={totalVotes}
                                color="#4effce"
                                glow="rgba(78,255,206,0.6)"
                            />
                            <PollBar
                                label="À revoir"
                                count={poll?.tally.arevoir ?? 0}
                                total={totalVotes}
                                color="#f5e642"
                                glow="rgba(245,230,66,0.6)"
                            />
                            <PollBar
                                label="Refusé"
                                count={poll?.tally.refuse ?? 0}
                                total={totalVotes}
                                color="#ff6b6b"
                                glow="rgba(255,107,107,0.6)"
                            />
                            <PollBar
                                label="En discussion"
                                count={poll?.tally.in_discussion ?? 0}
                                total={totalVotes}
                                color="#c084fc"
                                glow="rgba(192,132,252,0.6)"
                            />

                            {poll && poll.details.length > 0 && (
                                <div className="mt-2 border-t border-white/[0.06] pt-3">
                                    <div className="mb-2 text-[0.6rem] font-semibold uppercase tracking-widest text-mist/40">
                                        Détail jury
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {poll.details.map((d) => {
                                            const color =
                                                d.decision === "valide" ? "#4effce"
                                                : d.decision === "arevoir" ? "#f5e642"
                                                : d.decision === "refuse" ? "#ff6b6b"
                                                : "#c084fc";
                                            const label =
                                                d.decision === "valide" ? "Valide"
                                                : d.decision === "arevoir" ? "À revoir"
                                                : d.decision === "refuse" ? "Refusé"
                                                : "Discussion";
                                            const initials = `${d.firstName[0]}${d.lastName[0]}`.toUpperCase();
                                            return (
                                                <div key={d.juryId} className="flex items-center gap-2">
                                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande text-[0.5rem] font-extrabold text-deep-sky overflow-hidden">
                                                        {d.profilPicture ? (
                                                            <img src={d.profilPicture} alt="" className="h-full w-full object-cover" />
                                                        ) : initials}
                                                    </div>
                                                    <span className="flex-1 truncate text-[0.68rem] text-mist/70">
                                                        {d.firstName} {d.lastName}
                                                    </span>
                                                    <span
                                                        className="rounded-full px-1.5 py-0.5 text-[0.58rem] font-bold"
                                                        style={{ color, background: `${color}18` }}
                                                    >
                                                        {label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                            <p className="text-[0.72rem] text-mist/40">
                                Sélectionnez un film<br />pour voir les votes
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Droite : Discussion temps réel ──────────────────────────── */}
            <div className="flex flex-1 flex-col bg-[#070b14]">
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                    <span className="font-display text-[0.78rem] font-extrabold text-white-soft">
                        Discussion
                    </span>
                    <div
                        className={`ml-1 h-1.5 w-1.5 rounded-full transition-colors ${isConnected ? "bg-aurora" : "bg-mist/30"}`}
                    />
                    <span className="ml-auto text-[0.65rem] text-mist/40">
                        {messages.length} message{messages.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3">
                    {!filmId ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-[0.78rem] text-mist/30">Aucun film sélectionné</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-[0.78rem] text-mist/30">Soyez le premier à commenter…</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {messages.map((msg) => (
                                <MsgBubble
                                    key={msg.id}
                                    msg={msg}
                                    isSelf={msg.juryId === currentJuryId}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div className="border-t border-white/[0.06] p-3">
                    <div className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-3 py-2 focus-within:border-aurora/30">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={filmId ? "Partagez votre analyse…" : "Sélectionnez un film"}
                            disabled={!filmId || !isConnected}
                            className="flex-1 bg-transparent text-[0.82rem] text-white-soft outline-none placeholder:text-mist/40 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!input.trim() || !filmId}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-aurora/15 text-aurora transition-all hover:bg-aurora/25 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <Send size={13} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DelibView;
