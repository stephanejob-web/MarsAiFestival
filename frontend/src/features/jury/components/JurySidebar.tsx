import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Clapperboard,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    LayoutList,
    LogOut,
    MessageCircle,
    Mic,
    Scale,
    Send,
    Settings,
    ShieldCheck,
    Smartphone,
    Zap,
} from "lucide-react";

import useJuryChat from "../hooks/useJuryChat";
import useJuryUser from "../hooks/useJuryUser";
import type { ActiveView } from "../types";
import type { VoteMode } from "../hooks/useVoteMode";
import ProfileModal from "./ProfileModal";
import { VocalJoinButton } from "./VocalPanel";

interface JurySidebarProps {
    activeView: ActiveView;
    onViewChange: (view: ActiveView) => void;
    pendingCount: number;
    evaluatedCount: number;
    discussCount: number;
    progress: number;
    totalFilms: number;
    isChatOpen: boolean;
    onChatToggle: () => void;
    voteMode: VoteMode;
    onVoteModeChange: (mode: VoteMode) => void;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    count: number;
    countVariant: "pending" | "selected" | "discuss" | "neutral";
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}

const COUNT_VARIANT_CLASS: Record<NavItemProps["countVariant"], string> = {
    pending: "bg-coral/15 text-coral",
    selected: "bg-aurora/12 text-aurora",
    discuss: "bg-lavande/12 text-lavande",
    neutral: "bg-white/6 text-mist",
};

const NavItem = ({
    icon,
    label,
    count,
    countVariant,
    isActive,
    onClick,
    disabled = false,
}: NavItemProps): React.JSX.Element => {
    return (
        <button
            type="button"
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`flex w-full items-center gap-[9px] rounded-lg px-2.5 py-2 text-[0.84rem] transition-all ${
                disabled
                    ? "cursor-not-allowed opacity-35"
                    : isActive
                      ? "cursor-pointer bg-aurora/10 text-aurora"
                      : "cursor-pointer text-mist hover:bg-white/4 hover:text-white-soft"
            }`}
        >
            <span>{icon}</span>
            <span className="flex-1 text-left">{label}</span>
            <span
                className={`ml-auto rounded-full px-2 py-0.5 font-mono text-[0.68rem] font-semibold ${COUNT_VARIANT_CLASS[countVariant]}`}
            >
                {count}
            </span>
        </button>
    );
};

const JurySidebar = ({
    activeView,
    onViewChange,
    pendingCount,
    evaluatedCount,
    discussCount,
    progress,
    totalFilms,
    isChatOpen,
    onChatToggle,
    voteMode,
    onVoteModeChange,
}: JurySidebarProps): React.JSX.Element => {
    const navigate = useNavigate();
    const chat = useJuryChat(isChatOpen);
    const { joinVocal, leaveVocal, vocalUsers } = chat;
    const user = useJuryUser();
    const [avatarError, setAvatarError] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isVocalJoined, setIsVocalJoined] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

    return (
        <>
            <div
                className={`relative transition-all duration-300 ease-in-out ${isDrawerOpen ? "w-[260px]" : "w-0"}`}
            >
                <aside
                    className={`absolute inset-y-0 left-0 flex w-[260px] flex-col border-r border-white/6 bg-surface transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    {/* Header */}
                    <div className="border-b border-white/5 px-5 py-[22px] pb-[18px]">
                        <div className="font-display text-[1.05rem] font-extrabold">
                            mars<span className="text-aurora">AI</span>
                        </div>
                        <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.08em] text-mist">
                            Interface Jury · marsAI 2026
                        </div>
                    </div>

                    {/* Jury identity */}
                    <div className="flex items-center gap-3 border-b border-white/5 px-5 py-3.5">
                        {user?.profilPicture && !avatarError ? (
                            <img
                                src={user.profilPicture}
                                alt=""
                                className="h-[34px] w-[34px] flex-shrink-0 rounded-full object-cover"
                                onError={() => setAvatarError(true)}
                            />
                        ) : (
                            <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande text-[0.8rem] font-extrabold text-deep-sky">
                                {user?.initials ?? "??"}
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-[0.85rem] font-semibold">
                                {user?.fullName ?? "—"}
                            </div>
                            <div className="mt-px text-[0.7rem] text-mist">
                                {user?.roleLabel ?? ""}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsProfileOpen(true)}
                            className="flex-shrink-0 rounded-lg p-1.5 text-mist/50 transition-all hover:bg-white/8 hover:text-white-soft"
                            title="Modifier mon profil"
                        >
                            <Settings size={14} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-3.5">
                        <div className="px-2 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-55">
                            Évaluation
                        </div>
                        <NavItem
                            icon={<Clapperboard size={14} />}
                            label="Films assignés"
                            count={pendingCount}
                            countVariant="pending"
                            isActive={activeView === "eval"}
                            onClick={() => onViewChange("eval")}
                        />

                        {/* Vote mode toggle — visible only when Films assignés is active */}
                        {activeView === "eval" && (
                            <div className="relative mx-1 mb-1 mt-0.5 flex p-0.5 rounded-lg bg-black/25 border border-white/6">
                                {/* Sliding pill */}
                                <div
                                    className="absolute inset-0.5 rounded-md transition-all duration-200 ease-out pointer-events-none"
                                    style={{
                                        left: voteMode === "normal" ? "2px" : "calc(50% + 1px)",
                                        right: voteMode === "normal" ? "calc(50% + 1px)" : "2px",
                                        background:
                                            voteMode === "normal"
                                                ? "rgba(255,255,255,0.06)"
                                                : "rgba(78,255,206,0.88)",
                                        boxShadow:
                                            voteMode === "rapide"
                                                ? "0 0 8px rgba(78,255,206,0.3)"
                                                : "none",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => onVoteModeChange("normal")}
                                    className={`relative z-10 flex w-1/2 items-center justify-center gap-1.5 rounded-md py-1.5 text-[0.72rem] font-semibold transition-colors duration-200 ${
                                        voteMode === "normal"
                                            ? "text-white-soft"
                                            : "text-mist hover:text-white/60"
                                    }`}
                                >
                                    <LayoutList size={11} />
                                    Normal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onVoteModeChange("rapide")}
                                    className={`relative z-10 flex w-1/2 items-center justify-center gap-1.5 rounded-md py-1.5 text-[0.72rem] font-semibold transition-colors duration-200 ${
                                        voteMode === "rapide"
                                            ? "text-deep-sky"
                                            : "text-mist hover:text-white/60"
                                    }`}
                                >
                                    <Zap size={11} />
                                    Rapide
                                </button>
                            </div>
                        )}

                        <NavItem
                            icon={<CheckCircle size={14} />}
                            label="Évalués"
                            count={evaluatedCount}
                            countVariant="selected"
                            isActive={false}
                            onClick={() => onViewChange("eval")}
                        />
                        <NavItem
                            icon={<MessageCircle size={14} />}
                            label="À discuter"
                            count={discussCount}
                            countVariant="discuss"
                            isActive={activeView === "discuter"}
                            onClick={() => onViewChange("discuter")}
                        />

                        <div className="mt-1 px-2 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-55">
                            Sélection
                        </div>
                        <NavItem
                            icon={<Scale size={14} />}
                            label="Délibération"
                            count={0}
                            countVariant="neutral"
                            isActive={activeView === "delib"}
                            onClick={() => onViewChange("delib")}
                            disabled
                        />

                        {/* App mobile promo tab */}
                        <button
                            type="button"
                            onClick={() => onViewChange("mobile")}
                            className={`mt-2 flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-[0.8rem] font-semibold transition-all ${
                                activeView === "mobile"
                                    ? "border-aurora/40 bg-aurora/10 text-aurora"
                                    : "border-aurora/20 bg-aurora/5 text-aurora/70 hover:border-aurora/35 hover:bg-aurora/8 hover:text-aurora"
                            }`}
                        >
                            <Smartphone size={14} className="flex-shrink-0" />
                            <span className="flex-1 text-left">Application mobile</span>
                            <span className="rounded-full bg-aurora/15 px-1.5 py-0.5 font-mono text-[0.6rem] text-aurora">
                                NEW
                            </span>
                        </button>

                        <div className="mt-2 px-2 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-55">
                            Compte
                        </div>
                        {(user?.role === "admin" || user?.role === "moderateur") && (
                            <button
                                type="button"
                                onClick={() => navigate("/admin")}
                                className="flex w-full cursor-pointer items-center gap-[9px] rounded-lg px-2.5 py-2 text-[0.84rem] text-lavande transition-all hover:bg-white/4"
                            >
                                <ShieldCheck size={14} />
                                <span>Panel admin</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate("/jury")}
                            className="flex w-full cursor-pointer items-center gap-[9px] rounded-lg px-2.5 py-2 text-[0.84rem] text-coral transition-all hover:bg-white/4"
                        >
                            <LogOut size={14} />
                            <span>Se déconnecter</span>
                        </button>
                    </nav>

                    {/* Vocal */}
                    <div className="mx-3 border-t border-white/5">
                        <VocalJoinButton
                            isJoined={isVocalJoined}
                            onJoin={() => {
                                setIsVocalJoined(true);
                                joinVocal();
                            }}
                            onLeave={() => {
                                setIsVocalJoined(false);
                                leaveVocal();
                            }}
                        />
                        {vocalUsers.length > 0 && (
                            <div className="mb-2 flex flex-wrap items-center gap-1.5 px-2.5">
                                {vocalUsers.map((u) => (
                                    <div
                                        key={u.juryId}
                                        className="flex items-center gap-1"
                                        title={u.name}
                                    >
                                        {u.profilPicture ? (
                                            <img
                                                src={u.profilPicture}
                                                alt={u.initials}
                                                className="h-[20px] w-[20px] rounded-full object-cover ring-1 ring-aurora/40"
                                            />
                                        ) : (
                                            <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-aurora/20 text-[0.5rem] font-bold text-aurora ring-1 ring-aurora/40">
                                                {u.initials}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <span className="text-[0.6rem] text-aurora/60">
                                    {vocalUsers.length} en vocal
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Chat */}
                    <div className="mx-3 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onChatToggle}
                            className="flex w-full items-center px-2.5 py-2 text-[0.8rem] text-mist hover:text-white-soft"
                        >
                            <MessageCircle size={14} className="mr-1.5" />
                            <span>Chat jury</span>
                            <span className="ml-1.5 flex items-center gap-1 text-[0.65rem] text-mist/70">
                                <span
                                    className={`h-[5px] w-[5px] rounded-full ${chat.isConnected ? "bg-aurora" : "bg-coral"}`}
                                />
                                {chat.onlineCount > 0 &&
                                    `${chat.onlineCount} connecté${chat.onlineCount > 1 ? "s" : ""}`}
                            </span>
                            {chat.unreadCount > 0 && (
                                <span className="ml-1 rounded-full bg-coral/15 px-1.5 font-mono text-[0.62rem] font-semibold text-coral">
                                    {chat.unreadCount}
                                </span>
                            )}
                            <span className="ml-auto text-mist">
                                {isChatOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </span>
                        </button>

                        {isChatOpen && (
                            <div className="mb-2 rounded-xl border border-white/8 bg-[rgba(12,18,48,0.95)] p-2">
                                {/* Jurés connectés */}
                                {chat.connectedUsers.length > 0 && (
                                    <div className="mb-2 flex items-center gap-1.5 border-b border-white/6 pb-2">
                                        <div className="flex -space-x-1.5">
                                            {chat.connectedUsers.map((u) => (
                                                <div
                                                    key={u.socketId}
                                                    className="relative"
                                                    title={u.author}
                                                >
                                                    {u.profilPicture ? (
                                                        <img
                                                            src={u.profilPicture}
                                                            alt={u.initials}
                                                            className="h-[24px] w-[24px] rounded-full object-cover ring-2 ring-[rgba(12,18,48,0.95)]"
                                                            onError={(e) => {
                                                                (
                                                                    e.target as HTMLImageElement
                                                                ).style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gradient-to-br from-aurora/70 to-lavande/70 text-[0.55rem] font-bold text-deep-sky ring-2 ring-[rgba(12,18,48,0.95)]">
                                                            {u.initials}
                                                        </div>
                                                    )}
                                                    <span className="absolute -bottom-0.5 -right-0.5 h-[6px] w-[6px] rounded-full bg-aurora ring-1 ring-[rgba(12,18,48,0.95)]" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[0.62rem] text-mist/60">
                                            {chat.onlineCount} connecté
                                            {chat.onlineCount > 1 ? "s" : ""}
                                        </span>
                                    </div>
                                )}
                                <div
                                    className="flex h-[180px] flex-col gap-2.5 overflow-y-auto pr-0.5"
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
                                            const isSystem = msg.id.startsWith("vocal-");
                                            const isMe =
                                                !isSystem &&
                                                (msg.senderId !== null
                                                    ? msg.senderId === chat.mySocketId
                                                    : msg.juryId === user?.id);
                                            const time = new Date(msg.timestamp).toLocaleTimeString(
                                                "fr",
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                },
                                            );

                                            if (isSystem) {
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className="flex items-center gap-1.5 rounded-lg border border-aurora/20 bg-aurora/[0.07] px-2 py-1.5"
                                                    >
                                                        <Mic size={12} className="text-aurora" />
                                                        <span className="flex-1 text-[0.68rem] font-semibold text-aurora">
                                                            {msg.text.replace("🎙️ ", "")}
                                                        </span>
                                                        <span className="text-[0.55rem] text-mist/40">
                                                            {time}
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex items-start gap-2 ${isMe ? "bg-aurora/5" : ""} rounded-lg px-1 py-0.5`}
                                                >
                                                    {/* Avatar */}
                                                    {msg.profilPicture ? (
                                                        <img
                                                            src={msg.profilPicture}
                                                            alt={msg.initials}
                                                            className="mt-0.5 h-[26px] w-[26px] flex-shrink-0 rounded-full object-cover"
                                                            onError={(e) => {
                                                                (
                                                                    e.target as HTMLImageElement
                                                                ).style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="mt-0.5 flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurora/60 to-lavande/60 text-[0.55rem] font-bold text-deep-sky">
                                                            {msg.initials}
                                                        </div>
                                                    )}
                                                    {/* Contenu */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span
                                                                className={`text-[0.7rem] font-semibold ${isMe ? "text-aurora" : "text-white-soft"}`}
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
                                <div className="mt-2 flex items-stretch gap-1.5">
                                    <input
                                        type="text"
                                        value={chat.inputValue}
                                        onChange={(e) => chat.setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") chat.sendMessage();
                                        }}
                                        placeholder="Écrire un message…"
                                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[0.75rem] text-white-soft outline-none placeholder:text-mist/40"
                                    />
                                    <button
                                        type="button"
                                        onClick={chat.sendMessage}
                                        className="flex items-center justify-center rounded-lg bg-aurora px-3 text-deep-sky"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="mt-auto border-t border-white/5 px-5 py-3.5">
                        <div className="mb-[7px] text-[0.68rem] tracking-[0.05em] text-mist">
                            Ma progression · Films assignés
                        </div>
                        <div className="mb-[5px] h-[5px] overflow-hidden rounded-full bg-white/6">
                            <div
                                className="h-full bg-gradient-to-r from-aurora to-lavande"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="font-mono text-[0.7rem] text-white-soft">
                            {totalFilms - pendingCount} / {totalFilms} films évalués
                        </div>
                    </div>
                </aside>
                <button
                    type="button"
                    onClick={() => setIsDrawerOpen((v) => !v)}
                    title={isDrawerOpen ? "Fermer le panneau" : "Ouvrir le panneau"}
                    className="absolute left-full top-1/2 z-50 flex h-12 w-6 -translate-y-1/2 items-center justify-center rounded-r-lg border border-l-0 border-white/6 bg-surface text-mist transition-colors hover:bg-white/8 hover:text-white-soft"
                >
                    {isDrawerOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
                </button>
            </div>
            {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
        </>
    );
};

export default JurySidebar;
