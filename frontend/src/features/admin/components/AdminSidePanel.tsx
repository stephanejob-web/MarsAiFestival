import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MessageSquare, LogOut, ChevronDown, ChevronUp, Send, ExternalLink } from "lucide-react";
import { ADMIN_NAV_LINKS, ADMIN_LABELS } from "../constants";
import type { AdminNavCategory, AdminNavItem } from "../types";
import useJuryChat from "../../jury/hooks/useJuryChat";
import useJuryUser from "../../jury/hooks/useJuryUser";
import { VocalJoinButton } from "../../jury/components/VocalPanel";

const AVATAR_COLORS = [
    "from-aurora/70 to-lavande/70",
    "from-coral/70 to-solar/70",
    "from-lavande/70 to-aurora/70",
    "from-solar/70 to-coral/70",
];

const getTokenPayload = (): { id: number; role: string } | null => {
    try {
        const token = localStorage.getItem("jury_token");
        if (!token) return null;
        return JSON.parse(atob(token.split(".")[1])) as { id: number; role: string };
    } catch {
        return null;
    }
};

const AdminSidePanel = (): React.JSX.Element => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isVocalJoined, setIsVocalJoined] = useState(false);
    const [canAccessAdmin, setCanAccessAdmin] = useState(false);
    const chat = useJuryChat(isChatOpen);
    const user = useJuryUser();

    const me = getTokenPayload();
    const isAdmin = me?.role === "admin";

    React.useEffect(() => {
        if (isAdmin) {
            setCanAccessAdmin(true);
            return;
        }
        if (me?.role !== "moderateur") return;
        const token = localStorage.getItem("jury_token") ?? "";
        fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then(
                (data: {
                    success: boolean;
                    data?: Array<{
                        id: number;
                        permissions?: { can_access_admin?: boolean } | null;
                    }>;
                }) => {
                    const self = data.data?.find((u) => u.id === me.id);
                    setCanAccessAdmin(Boolean(self?.permissions?.can_access_admin));
                },
            )
            .catch(() => {});
    }, [isAdmin, me?.id, me?.role]);

    const handleLogout = (): void => {
        localStorage.removeItem("jury_token");
        navigate("/jury", { replace: true });
    };

    return (
        <div className="flex h-full flex-col bg-surface overflow-hidden">
            {/* Logo */}
            <div className="border-b border-white/[0.05] px-[18px] py-5">
                <div className="font-display text-[1rem] font-extrabold tracking-[-0.02em] text-white-soft">
                    mars<span className="text-aurora">AI</span>
                </div>
                <div className="mt-0.5 text-[0.65rem] uppercase tracking-[0.08em] text-mist">
                    {ADMIN_LABELS.SUBTITLE}
                </div>
            </div>

            {/* Admin identity */}
            <div className="flex items-center gap-2.5 border-b border-white/[0.05] px-[18px] py-3">
                {user?.profilPicture ? (
                    <img
                        src={user.profilPicture}
                        alt={user.initials}
                        className="h-8 w-8 shrink-0 rounded-lg object-cover"
                    />
                ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-solar to-aurora text-[0.75rem] font-black text-deep-sky">
                        {user?.initials ?? "AD"}
                    </div>
                )}
                <div>
                    <div className="text-[0.82rem] font-semibold text-white-soft">
                        {user?.fullName ?? ADMIN_LABELS.ADMIN_NAME}
                    </div>
                    <div className="mt-px text-[0.67rem] font-semibold uppercase tracking-[0.04em] text-aurora">
                        {user?.roleLabel ?? ADMIN_LABELS.ADMIN_ROLE}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-[10px] py-3">
                {ADMIN_NAV_LINKS.map((category: AdminNavCategory) => {
                    const visibleItems = category.items.filter((item) => {
                        if (!item.requiresPermission) return true;
                        if (item.requiresPermission === "can_access_admin") return canAccessAdmin;
                        return false;
                    });
                    if (visibleItems.length === 0) return null;
                    return (
                        <div key={category.category} className="mb-1">
                            <div className="px-2 pb-1.5 pt-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-55">
                                {category.category}
                            </div>
                            <ul>
                                {visibleItems.map((item: AdminNavItem) => (
                                    <li key={item.to}>
                                        {item.external ? (
                                            <a
                                                href={item.to}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mb-px flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.82rem] text-mist transition-all hover:bg-white/[0.04] hover:text-white-soft"
                                            >
                                                <span className="w-[17px] shrink-0 text-center">
                                                    {item.icon}
                                                </span>
                                                <span>{item.label}</span>
                                                <ExternalLink
                                                    size={11}
                                                    className="ml-auto opacity-40"
                                                />
                                            </a>
                                        ) : (
                                            <NavLink
                                                to={item.to}
                                                end={item.to === "/admin"}
                                                className={({ isActive }): string =>
                                                    `mb-px flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.82rem] transition-all ${
                                                        isActive
                                                            ? "bg-aurora/10 text-aurora"
                                                            : "text-mist hover:bg-white/[0.04] hover:text-white-soft"
                                                    }`
                                                }
                                            >
                                                <span className="w-[17px] shrink-0 text-center">
                                                    {item.icon}
                                                </span>
                                                <span>{item.label}</span>
                                                {item.count !== undefined && (
                                                    <span className="ml-auto rounded-full bg-white/[0.06] px-[7px] py-0.5 font-mono text-[0.65rem] font-semibold text-mist">
                                                        {item.count}
                                                    </span>
                                                )}
                                            </NavLink>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </nav>

            {/* Vocal */}
            <div className="border-t border-white/[0.05] px-2">
                <VocalJoinButton
                    isJoined={isVocalJoined}
                    onJoin={() => setIsVocalJoined(true)}
                    onLeave={() => setIsVocalJoined(false)}
                />
            </div>

            {/* Chat */}
            <div className="border-t border-white/[0.05] px-2">
                <button
                    type="button"
                    onClick={() => setIsChatOpen((v) => !v)}
                    className="flex w-full items-center px-2.5 py-2 text-[0.8rem] text-mist hover:text-white-soft"
                >
                    <MessageSquare size={14} className="mr-1.5 shrink-0" />
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
                        {isChatOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </span>
                </button>

                {isChatOpen && (
                    <div className="mb-2 rounded-xl border border-white/8 bg-[rgba(12,18,48,0.95)] p-2">
                        {chat.connectedUsers.length > 0 && (
                            <div className="mb-2 flex items-center gap-1.5 border-b border-white/6 pb-2">
                                <div className="flex -space-x-1.5">
                                    {chat.connectedUsers.map((u, i) => (
                                        <div key={u.socketId} title={u.author} className="relative">
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
                                                <div
                                                    className={`flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gradient-to-br text-[0.55rem] font-bold text-deep-sky ring-2 ring-[rgba(12,18,48,0.95)] ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                                                >
                                                    {u.initials}
                                                </div>
                                            )}
                                            <span className="absolute -bottom-0.5 -right-0.5 h-[6px] w-[6px] rounded-full bg-aurora ring-1 ring-[rgba(12,18,48,0.95)]" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[0.62rem] text-mist/60">
                                    {chat.onlineCount} connecté{chat.onlineCount > 1 ? "s" : ""}
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
                                            className={`flex items-start gap-2 ${isMe ? "bg-solar/5" : ""} rounded-lg px-1 py-0.5`}
                                        >
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
                                                <div className="mt-0.5 flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-solar/60 to-aurora/60 text-[0.55rem] font-bold text-deep-sky">
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
                        <div className="mt-2 flex items-stretch gap-1.5 overflow-hidden">
                            <input
                                type="text"
                                value={chat.inputValue}
                                onChange={(e) => chat.setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") chat.sendMessage();
                                }}
                                placeholder="Écrire…"
                                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[0.75rem] text-white-soft outline-none placeholder:text-mist/40"
                            />
                            <button
                                type="button"
                                onClick={chat.sendMessage}
                                disabled={!chat.isConnected || !chat.inputValue.trim()}
                                className="w-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-solar text-[0.8rem] font-bold text-deep-sky disabled:opacity-40"
                            >
                                <Send size={13} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Logout */}
            <div className="border-t border-white/[0.05] p-3">
                <button
                    type="button"
                    aria-label={ADMIN_LABELS.LOGOUT}
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-[0.82rem] text-coral/80 transition-all hover:bg-coral/[0.08] hover:text-coral"
                >
                    <LogOut size={14} className="mr-2" /> {ADMIN_LABELS.LOGOUT}
                </button>
            </div>
        </div>
    );
};

export default AdminSidePanel;
