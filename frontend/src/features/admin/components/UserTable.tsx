import React, { useState } from "react";
import type { AdminUser } from "../types";

interface UserTableProps {
    users: AdminUser[];
    search: string;
    onToggleStatus: (id: number, isActive: boolean) => Promise<void>;
    onChangeRole: (id: number, role: "jury" | "admin" | "moderateur") => Promise<void>;
    onBan: (id: number) => Promise<void>;
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
}: UserTableProps): React.JSX.Element => {
    const [confirmBanId, setConfirmBanId] = useState<number | null>(null);

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
                                className="border-b border-white/[0.04] transition-colors last:border-b-0 hover:bg-white/[0.02]"
                            >
                                {/* Utilisateur */}
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center gap-3">
                                        {u.profil_picture ? (
                                            <img
                                                src={u.profil_picture}
                                                alt=""
                                                className="h-[30px] w-[30px] rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div
                                                className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg text-[0.7rem] font-extrabold ${avatarStyle}`}
                                            >
                                                {initials}
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-[0.84rem] font-semibold text-white-soft">
                                                {u.first_name} {u.last_name}
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
                                                <option value="jury">⚖️ Jury</option>
                                                <option value="moderateur">🛡️ Modérateur</option>
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
                                        <StatusToggle
                                            isActive={u.is_active}
                                            onToggle={() => void onToggleStatus(u.id, !u.is_active)}
                                        />
                                        {u.role !== "admin" &&
                                            (confirmBanId === u.id ? (
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            void onBan(u.id);
                                                            setConfirmBanId(null);
                                                        }}
                                                        className="rounded-[6px] border border-coral/35 bg-coral/10 px-2 py-[3px] text-[0.62rem] font-bold text-coral transition-all hover:bg-coral/20"
                                                    >
                                                        Confirmer
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmBanId(null)}
                                                        className="rounded-[6px] border border-white/[0.08] bg-white/[0.03] px-2 py-[3px] text-[0.62rem] text-mist transition-all hover:border-white/[0.14] hover:text-white-soft"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmBanId(u.id)}
                                                    title="Bannir ce compte"
                                                    className="rounded-[6px] border border-white/[0.05] bg-white/[0.02] px-2 py-[3px] text-[0.62rem] text-mist/35 transition-all hover:border-coral/25 hover:bg-coral/[0.07] hover:text-coral"
                                                >
                                                    ⊘ Bannir
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
