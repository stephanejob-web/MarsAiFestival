import React, { useState } from "react";
import { Check, X } from "lucide-react";
import type { AdminUser } from "../types";

interface UserTableProps {
    users: AdminUser[];
    search: string;
    onToggleStatus: (id: number, isActive: boolean) => Promise<void>;
    onChangeRole: (id: number, role: "jury" | "admin" | "moderateur") => Promise<void>;
    onBan: (id: number) => Promise<void>;
    onUnban: (id: number) => Promise<void>;
    onSendMessage: (id: number, message: string) => Promise<void>;
}

const AVATAR_GRADIENTS = [
    "bg-gradient-to-br from-aurora to-lavande text-deep-sky",
    "bg-gradient-to-br from-coral to-lavande text-white",
    "bg-gradient-to-br from-solar to-aurora text-deep-sky",
    "bg-white/[0.08] text-white-soft",
    "bg-gradient-to-br from-lavande to-coral text-white",
    "bg-gradient-to-br from-aurora to-solar text-deep-sky",
];

interface StatusToggleProps {
    isActive: boolean;
    onToggle: () => void;
}

const StatusToggle = ({ isActive, onToggle }: StatusToggleProps): React.JSX.Element => (
    <button
        type="button"
        onClick={onToggle}
        className="flex cursor-pointer select-none items-center gap-2"
        aria-label={isActive ? "Désactiver le compte" : "Activer le compte"}
    >
        <div
            className={`relative h-[18px] w-[34px] rounded-full transition-colors duration-200 ${isActive ? "bg-aurora/35" : "bg-white/[0.08]"}`}
        >
            <div
                className={`absolute top-[2px] h-[14px] w-[14px] rounded-full transition-all duration-200 ${isActive ? "left-[2px] translate-x-4 bg-aurora" : "left-[2px] bg-mist"}`}
            />
        </div>
        <span className={`text-[0.75rem] ${isActive ? "text-aurora" : "text-mist"}`}>
            {isActive ? "Actif" : "Désactivé"}
        </span>
    </button>
);

const ROLE_SELECT_CLS: Record<"jury" | "admin" | "moderateur", string> = {
    jury: "border-aurora/20 bg-aurora/10 text-aurora",
    moderateur: "border-lavande/20 bg-lavande/10 text-lavande",
    admin: "border-lavande/20 bg-lavande/10 text-lavande",
};

const UserTable = ({
    users,
    search,
    onToggleStatus,
    onChangeRole,
    onBan,
    onUnban,
    onSendMessage,
}: UserTableProps): React.JSX.Element => {
    const [confirmBanId, setConfirmBanId] = useState<number | null>(null);
    const [confirmUnbanId, setConfirmUnbanId] = useState<number | null>(null);
    const [messageUserId, setMessageUserId] = useState<number | null>(null);
    const [messageText, setMessageText] = useState("");

    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        return (
            u.first_name.toLowerCase().includes(q) ||
            u.last_name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
        );
    });

    return (
        <div className="overflow-hidden rounded-[14px] border border-white/[0.05] bg-surface-2">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border-b border-white/[0.05] bg-white/[0.02] px-4 py-2.5 text-left text-[0.62rem] font-bold uppercase tracking-[0.1em] text-mist">
                            Utilisateur
                        </th>
                        <th className="border-b border-white/[0.05] bg-white/[0.02] px-4 py-2.5 text-left text-[0.62rem] font-bold uppercase tracking-[0.1em] text-mist">
                            Rôle
                        </th>
                        <th className="border-b border-white/[0.05] bg-white/[0.02] px-4 py-2.5 text-left text-[0.62rem] font-bold uppercase tracking-[0.1em] text-mist">
                            Films assignés
                        </th>
                        <th className="border-b border-white/[0.05] bg-white/[0.02] px-4 py-2.5 text-left text-[0.62rem] font-bold uppercase tracking-[0.1em] text-mist">
                            Accès
                        </th>
                        <th className="border-b border-white/[0.05] bg-white/[0.02] px-4 py-2.5 text-left text-[0.62rem] font-bold uppercase tracking-[0.1em] text-mist">
                            Statut
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((u, idx) => {
                        const initials = `${u.first_name[0]}${u.last_name[0]}`.toUpperCase();
                        const avatarStyle = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];

                        return (
                            <tr
                                key={u.id}
                                className={`border-b transition-colors last:border-b-0 ${
                                    u.is_banned
                                        ? "border-coral/10 bg-coral/[0.04] hover:bg-coral/[0.06]"
                                        : "border-white/[0.04] hover:bg-white/[0.02]"
                                }`}
                            >
                                {/* Utilisateur */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            {u.profil_picture ? (
                                                <img
                                                    src={u.profil_picture}
                                                    alt=""
                                                    className={`h-[30px] w-[30px] rounded-lg object-cover ${u.is_banned ? "opacity-40 grayscale" : ""}`}
                                                />
                                            ) : (
                                                <div
                                                    className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg text-[0.7rem] font-extrabold ${avatarStyle} ${u.is_banned ? "opacity-40 grayscale" : ""}`}
                                                >
                                                    {initials}
                                                </div>
                                            )}
                                            {u.is_banned && (
                                                <span className="absolute -right-1 -top-1 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-coral text-[0.5rem]">
                                                    ⊘
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div
                                                className={`flex items-center gap-2 text-[0.84rem] font-semibold ${u.is_banned ? "text-mist/50 line-through" : "text-white-soft"}`}
                                            >
                                                {u.first_name} {u.last_name}
                                                {u.is_banned && (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-coral/30 bg-coral/10 px-1.5 py-px text-[0.58rem] font-bold uppercase tracking-[0.06em] text-coral no-underline">
                                                        Banni
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-0.5 font-mono text-[0.72rem] text-mist">
                                                {u.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Rôle */}
                                <td className="px-4 py-3 align-middle">
                                    {u.role === "admin" ? (
                                        <span className="inline-flex w-fit items-center rounded-full border border-lavande/20 bg-lavande/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.05em] text-lavande">
                                            Admin
                                        </span>
                                    ) : (
                                        <div className="relative inline-flex">
                                            <select
                                                value={u.role}
                                                onChange={(e) =>
                                                    void onChangeRole(
                                                        u.id,
                                                        e.target.value as "jury" | "moderateur",
                                                    )
                                                }
                                                className={`cursor-pointer appearance-none rounded-full border py-[3px] pl-[10px] pr-[22px] text-[0.65rem] font-bold uppercase tracking-[0.05em] outline-none transition-opacity hover:opacity-80 ${ROLE_SELECT_CLS[u.role]}`}
                                            >
                                                <option value="jury">Jury</option>
                                                <option value="moderateur">Modérateur</option>
                                            </select>
                                            <span className="pointer-events-none absolute right-[7px] top-1/2 -translate-y-1/2 text-[0.5rem] opacity-60">
                                                ▾
                                            </span>
                                        </div>
                                    )}
                                </td>

                                {/* Films assignés */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="font-mono text-[0.72rem] text-solar">
                                        {u.films_assigned} films
                                    </div>
                                    {u.films_assigned > 0 && (
                                        <div className="mt-0.5 h-[3px] w-[100px] overflow-hidden rounded-full bg-white/[0.08]">
                                            <div
                                                className="h-full rounded-full bg-solar transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(100, Math.round((u.films_evaluated / u.films_assigned) * 100))}%`,
                                                }}
                                            />
                                        </div>
                                    )}
                                </td>

                                {/* Accès */}
                                <td className="px-4 py-3 align-middle text-[0.75rem] text-mist">
                                    Email / mdp
                                </td>

                                {/* Statut */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center gap-2.5">
                                        {u.role === "admin" ? (
                                            <span className="inline-flex items-center gap-1.5 text-[0.75rem] text-aurora/60">
                                                <div className="h-[6px] w-[6px] rounded-full bg-aurora/50" />
                                                Actif
                                            </span>
                                        ) : u.is_banned ? (
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 rounded-[7px] border border-coral/25 bg-coral/[0.08] px-2 py-[3px] text-[0.7rem] font-bold text-coral shadow-[0_0_8px_rgba(255,82,82,0.1)]">
                                                    <svg
                                                        width="10"
                                                        height="10"
                                                        viewBox="0 0 10 10"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.6"
                                                        strokeLinecap="round"
                                                    >
                                                        <circle cx="5" cy="5" r="4" />
                                                        <line x1="2" y1="8" x2="8" y2="2" />
                                                    </svg>
                                                    Banni
                                                </span>
                                                {confirmUnbanId === u.id ? (
                                                    <div className="flex items-center gap-1.5 rounded-[8px] border border-aurora/30 bg-aurora/[0.08] px-2 py-1">
                                                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.06em] text-aurora/80">
                                                            Réactiver ?
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                void onUnban(u.id);
                                                                setConfirmUnbanId(null);
                                                            }}
                                                            className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] bg-aurora text-deep-sky shadow-[0_2px_10px_rgba(78,255,206,0.4)] transition-all hover:scale-110 hover:shadow-[0_4px_16px_rgba(78,255,206,0.6)]"
                                                        >
                                                            <Check size={11} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmUnbanId(null)}
                                                            className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] border border-white/[0.12] bg-white/[0.06] text-mist transition-all hover:bg-white/[0.12] hover:text-white-soft"
                                                        >
                                                            <X size={11} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmUnbanId(u.id)}
                                                        className="flex h-[26px] items-center gap-1.5 rounded-[7px] border border-aurora/20 bg-aurora/[0.06] px-2.5 text-[0.62rem] font-semibold text-aurora/60 transition-all duration-200 hover:border-aurora/50 hover:bg-aurora/[0.14] hover:text-aurora hover:shadow-[0_0_12px_rgba(78,255,206,0.2)]"
                                                    >
                                                        ↺ Réactiver
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <StatusToggle
                                                isActive={u.is_active}
                                                onToggle={() =>
                                                    void onToggleStatus(u.id, !u.is_active)
                                                }
                                            />
                                        )}
                                        {u.role !== "admin" &&
                                            !u.is_banned &&
                                            (confirmBanId === u.id ? (
                                                <div className="flex items-center gap-1.5 rounded-[8px] border border-coral/40 bg-coral/[0.12] px-2.5 py-1.5 shadow-[0_0_16px_rgba(255,82,82,0.15)]">
                                                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.06em] text-coral/80">
                                                        Confirmer ?
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            void onBan(u.id);
                                                            setConfirmBanId(null);
                                                        }}
                                                        className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] bg-coral text-white shadow-[0_2px_10px_rgba(255,82,82,0.5)] transition-all hover:scale-110 hover:shadow-[0_4px_16px_rgba(255,82,82,0.7)]"
                                                    >
                                                        <Check size={11} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmBanId(null)}
                                                        className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] border border-white/[0.12] bg-white/[0.06] text-mist transition-all hover:bg-white/[0.12] hover:text-white-soft"
                                                    >
                                                        <X size={11} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmBanId(u.id)}
                                                    title="Bannir ce compte"
                                                    className="group flex h-[26px] items-center gap-1.5 rounded-[7px] border border-coral/30 bg-coral/[0.08] px-2.5 text-[0.62rem] font-semibold text-coral/70 shadow-[0_0_8px_rgba(255,82,82,0.08)] transition-all duration-200 hover:border-coral/60 hover:bg-coral/[0.16] hover:text-coral hover:shadow-[0_0_16px_rgba(255,82,82,0.25)] active:scale-95"
                                                >
                                                    <svg
                                                        width="10"
                                                        height="10"
                                                        viewBox="0 0 10 10"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.6"
                                                        strokeLinecap="round"
                                                    >
                                                        <circle cx="5" cy="5" r="4" />
                                                        <line x1="2" y1="8" x2="8" y2="2" />
                                                    </svg>
                                                    Bannir
                                                </button>
                                            ))}
                                        {u.role !== "admin" &&
                                            (messageUserId === u.id ? (
                                                <div className="flex flex-col gap-1.5 rounded-[8px] border border-lavande/30 bg-lavande/[0.08] p-2 shadow-[0_0_12px_rgba(139,92,246,0.1)]">
                                                    <textarea
                                                        className="w-full resize-none rounded-[6px] border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-[0.75rem] text-white-soft placeholder-mist outline-none focus:border-lavande/40 focus:ring-0"
                                                        rows={2}
                                                        placeholder="Votre message..."
                                                        value={messageText}
                                                        onChange={(e) => setMessageText(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (messageText.trim()) {
                                                                    void onSendMessage(u.id, messageText.trim());
                                                                }
                                                                setMessageUserId(null);
                                                                setMessageText("");
                                                            }}
                                                            className="flex h-[20px] items-center gap-1 rounded-[5px] bg-lavande px-2 text-[0.6rem] font-bold text-white shadow-[0_2px_10px_rgba(139,92,246,0.4)] transition-all hover:scale-105 hover:shadow-[0_4px_16px_rgba(139,92,246,0.6)]"
                                                        >
                                                            <Check size={10} /> Envoyer
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMessageUserId(null);
                                                                setMessageText("");
                                                            }}
                                                            className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] border border-white/[0.12] bg-white/[0.06] text-mist transition-all hover:bg-white/[0.12] hover:text-white-soft"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setMessageUserId(u.id)}
                                                    title="Envoyer un message"
                                                    className="flex h-[26px] items-center gap-1.5 rounded-[7px] border border-lavande/30 bg-lavande/[0.08] px-2.5 text-[0.62rem] font-semibold text-lavande/70 transition-all duration-200 hover:border-lavande/60 hover:bg-lavande/[0.16] hover:text-lavande hover:shadow-[0_0_12px_rgba(139,92,246,0.2)] active:scale-95"
                                                >
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M9 1H1a.5.5 0 0 0-.5.5v5A.5.5 0 0 0 1 7h2l2 2.5L7 7h2a.5.5 0 0 0 .5-.5v-5A.5.5 0 0 0 9 1z" />
                                                    </svg>
                                                    Message
                                                </button>
                                            ))}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {filtered.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-10 text-center text-[0.82rem] text-mist"
                            >
                                Aucun résultat pour cette recherche.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
