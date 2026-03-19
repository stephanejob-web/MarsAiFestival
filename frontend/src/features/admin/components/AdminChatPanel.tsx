import React, { useState } from "react";
import useJuryChat from "../../jury/hooks/useJuryChat";
import useJuryUser from "../../jury/hooks/useJuryUser";
import { VocalJoinButton } from "../../jury/components/VocalPanel";

const AVATAR_COLORS = [
    "from-aurora/70 to-lavande/70",
    "from-coral/70 to-solar/70",
    "from-lavande/70 to-aurora/70",
    "from-solar/70 to-coral/70",
];

const AdminChatPanel = (): React.JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVocalJoined, setIsVocalJoined] = useState(false);
    const chat = useJuryChat(isOpen);
    const user = useJuryUser();

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
            {/* Panel */}
            {isOpen && (
                <div className="flex w-[320px] flex-col rounded-2xl border border-white/10 bg-[#0d1117]/95 shadow-2xl backdrop-blur-md">
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                        <span className="text-[0.8rem]">💬</span>
                        <span className="flex-1 font-display text-[0.82rem] font-extrabold text-white-soft">
                            Chat jury
                        </span>
                        <span className="flex items-center gap-1.5 text-[0.65rem] text-mist/70">
                            <span
                                className={`h-[5px] w-[5px] rounded-full ${chat.isConnected ? "bg-aurora" : "bg-coral"}`}
                            />
                            {chat.onlineCount > 0 &&
                                `${chat.onlineCount} connecté${chat.onlineCount > 1 ? "s" : ""}`}
                        </span>
                    </div>

                    {/* Connected users */}
                    {chat.connectedUsers.length > 0 && (
                        <div className="flex items-center gap-2 border-b border-white/6 px-4 py-2">
                            <div className="flex -space-x-1.5">
                                {chat.connectedUsers.slice(0, 8).map((u, i) => (
                                    <div key={u.socketId} title={u.author} className="relative">
                                        {u.profilPicture ? (
                                            <img
                                                src={u.profilPicture}
                                                alt={u.initials}
                                                className="h-[22px] w-[22px] rounded-full object-cover ring-2 ring-[#0d1117]"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className={`flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gradient-to-br text-[0.5rem] font-bold text-deep-sky ring-2 ring-[#0d1117] ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                                            >
                                                {u.initials}
                                            </div>
                                        )}
                                        <span className="absolute -bottom-0.5 -right-0.5 h-[5px] w-[5px] rounded-full bg-aurora ring-1 ring-[#0d1117]" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[0.62rem] text-mist/60">
                                {chat.onlineCount} en ligne
                            </span>
                        </div>
                    )}

                    {/* Messages */}
                    <div
                        className="flex h-[220px] flex-col gap-2 overflow-y-auto p-3 pr-2"
                        ref={(el) => {
                            if (el) el.scrollTop = el.scrollHeight;
                        }}
                    >
                        {chat.messages.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-[0.7rem] text-mist/50">
                                Aucun message pour l&apos;instant
                            </div>
                        ) : (
                            chat.messages.map((msg) => {
                                const isMe =
                                    msg.senderId !== null
                                        ? msg.senderId === chat.mySocketId
                                        : msg.juryId === user?.id;
                                const time = new Date(msg.timestamp).toLocaleTimeString("fr", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex items-start gap-2 rounded-lg px-1 py-0.5 ${isMe ? "bg-solar/5" : ""}`}
                                    >
                                        {msg.profilPicture ? (
                                            <img
                                                src={msg.profilPicture}
                                                alt={msg.initials}
                                                className="mt-0.5 h-[24px] w-[24px] flex-shrink-0 rounded-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="mt-0.5 flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-solar/70 to-aurora/70 text-[0.5rem] font-bold text-deep-sky">
                                                {msg.initials}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-baseline gap-1.5">
                                                <span
                                                    className={`text-[0.7rem] font-semibold ${isMe ? "text-solar" : "text-white-soft"}`}
                                                >
                                                    {msg.author}
                                                </span>
                                                <span className="text-[0.55rem] text-mist/40">
                                                    {time}
                                                </span>
                                            </div>
                                            <p className="break-words text-[0.7rem] leading-snug text-white-soft/80">
                                                {msg.text}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input */}
                    <div className="flex items-stretch gap-1.5 border-t border-white/8 p-3">
                        <input
                            type="text"
                            value={chat.inputValue}
                            onChange={(e) => chat.setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") chat.sendMessage();
                            }}
                            placeholder="Écrire un message…"
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[0.75rem] text-white-soft outline-none placeholder:text-mist/40 focus:border-solar/30"
                        />
                        <button
                            type="button"
                            onClick={chat.sendMessage}
                            disabled={!chat.isConnected || !chat.inputValue.trim()}
                            className="flex items-center justify-center rounded-lg bg-solar px-3 font-bold text-deep-sky disabled:opacity-40"
                        >
                            ↑
                        </button>
                    </div>
                </div>
            )}

            {/* Buttons row: vocal + chat */}
            <div className="flex items-center gap-2">
                {/* Vocal button — toujours visible */}
                <div className="rounded-full border border-white/10 bg-surface shadow-lg">
                    <VocalJoinButton
                        isJoined={isVocalJoined}
                        onJoin={() => setIsVocalJoined(true)}
                        onLeave={() => setIsVocalJoined(false)}
                    />
                </div>

                {/* Chat toggle */}
                <button
                    type="button"
                    onClick={() => setIsOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-surface px-4 py-2.5 text-[0.8rem] font-semibold text-white-soft shadow-lg transition-all hover:border-solar/30 hover:bg-surface-2"
                >
                    <span>💬</span>
                    <span>Chat jury</span>
                    {!isOpen && chat.unreadCount > 0 && (
                        <span className="rounded-full bg-coral/15 px-1.5 font-mono text-[0.62rem] font-semibold text-coral">
                            {chat.unreadCount}
                        </span>
                    )}
                    {!isOpen && chat.isConnected && chat.onlineCount > 0 && (
                        <span className="flex items-center gap-1 text-[0.65rem] text-mist/70">
                            <span className="h-[5px] w-[5px] rounded-full bg-aurora" />
                            {chat.onlineCount}
                        </span>
                    )}
                    <span className="text-[0.65rem] text-mist">{isOpen ? "▼" : "▲"}</span>
                </button>
            </div>
        </div>
    );
};

export default AdminChatPanel;
