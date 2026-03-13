import React from "react";
import { useNavigate } from "react-router-dom";

import useJuryChat from "../hooks/useJuryChat";
import type { ActiveView } from "../types";

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
}

interface NavItemProps {
    icon: string;
    label: string;
    count: number;
    countVariant: "pending" | "selected" | "discuss" | "neutral";
    isActive: boolean;
    onClick: () => void;
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
}: NavItemProps): React.JSX.Element => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full cursor-pointer items-center gap-[9px] rounded-lg px-2.5 py-2 text-[0.84rem] transition-all ${
                isActive
                    ? "bg-aurora/10 text-aurora"
                    : "text-mist hover:bg-white/4 hover:text-white-soft"
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
}: JurySidebarProps): React.JSX.Element => {
    const navigate = useNavigate();
    const chat = useJuryChat();

    return (
        <aside className="flex h-screen w-[260px] min-w-[260px] flex-col border-r border-white/6 bg-surface">
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
                <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande text-[0.8rem] font-extrabold text-deep-sky">
                    ML
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-[0.85rem] font-semibold">Marie Lefebvre</div>
                    <div className="mt-px text-[0.7rem] text-mist">Présidente du Jury</div>
                </div>
                <div className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-aurora" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-3.5">
                <div className="px-2 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-55">
                    Évaluation
                </div>
                <NavItem
                    icon="🎬"
                    label="Films assignés"
                    count={pendingCount}
                    countVariant="pending"
                    isActive={activeView === "eval"}
                    onClick={() => onViewChange("eval")}
                />
                <NavItem
                    icon="✅"
                    label="Évalués"
                    count={evaluatedCount}
                    countVariant="selected"
                    isActive={false}
                    onClick={() => onViewChange("eval")}
                />
                <NavItem
                    icon="💬"
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
                    icon="⚖️"
                    label="Délibération"
                    count={0}
                    countVariant="neutral"
                    isActive={activeView === "delib"}
                    onClick={() => onViewChange("delib")}
                />

                <div className="mt-1 px-2 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-55">
                    Compte
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/jury")}
                    className="flex w-full cursor-pointer items-center gap-[9px] rounded-lg px-2.5 py-2 text-[0.84rem] text-coral transition-all hover:bg-white/4"
                >
                    <span>🔒</span>
                    <span>Se déconnecter</span>
                </button>
            </nav>

            {/* Chat */}
            <div className="mx-3 border-t border-white/5">
                <button
                    type="button"
                    onClick={onChatToggle}
                    className="flex w-full items-center px-2.5 py-2 text-[0.8rem] text-mist hover:text-white-soft"
                >
                    <span className="mr-1.5">💬</span>
                    <span>Chat jury</span>
                    <span className="ml-1 rounded-full bg-coral/15 px-1.5 font-mono text-[0.62rem] font-semibold text-coral">
                        {chat.unreadCount}
                    </span>
                    <span className="ml-auto text-[0.65rem] text-mist">
                        {isChatOpen ? "▲" : "▼"}
                    </span>
                </button>

                {isChatOpen && (
                    <div className="mb-2 rounded-xl border border-white/8 bg-[rgba(12,18,48,0.95)] p-2">
                        <div className="flex h-[140px] flex-col gap-2 overflow-y-auto">
                            {chat.messages.map((msg) => (
                                <div key={msg.id} className="text-[0.72rem]">
                                    <span className="font-semibold text-white-soft/80">
                                        {msg.initials}:{" "}
                                    </span>
                                    <span className="text-mist">{msg.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 flex gap-1.5">
                            <input
                                type="text"
                                value={chat.inputValue}
                                onChange={(e) => chat.setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") chat.sendMessage();
                                }}
                                placeholder="Message..."
                                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[0.75rem] text-white-soft outline-none"
                            />
                            <button
                                type="button"
                                onClick={chat.sendMessage}
                                className="rounded-lg bg-aurora px-3 text-[0.8rem] font-bold text-deep-sky"
                            >
                                ↑
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
    );
};

export default JurySidebar;
