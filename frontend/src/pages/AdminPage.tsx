import React, { useState } from "react";
import { Mic, MicOff, ShieldCheck, Search } from "lucide-react";
import useAdminUsers from "../features/admin/hooks/useAdminUsers";
import useAdminVocal from "../features/admin/hooks/useAdminVocal";
import InviteModal from "../features/admin/components/InviteModal";
import StatCard from "../features/admin/components/StatCard";
import ParticipationChart from "../features/admin/components/ParticipationChart";
import UserTable from "../features/admin/components/UserTable";

const decodeRole = (): { id: number; role: string } | null => {
    try {
        const token = localStorage.getItem("jury_token");
        if (!token) return null;
        return JSON.parse(atob(token.split(".")[1])) as { id: number; role: string };
    } catch {
        return null;
    }
};

const AdminPage = (): React.JSX.Element => {
    const {
        users,
        isLoading,
        error,
        toggleStatus,
        changeRole,
        banUser,
        unbanUser,
        sendMessage,
        updatePermissions,
    } = useAdminUsers();
    const { isInVocal, joinVocal, leaveVocal } = useAdminVocal();
    const [search, setSearch] = useState<string>("");
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const me = decodeRole();
    const isAdmin = me?.role === "admin";
    const myPermissions = isAdmin
        ? {
              can_access_admin: true,
              can_disable_accounts: true,
              can_ban_users: true,
              can_send_messages: true,
          }
        : (users.find((u) => u.id === me?.id)?.permissions ?? null);

    const juryCount = users.filter((u) => u.role === "jury" && u.is_active).length;
    const adminCount = users.filter((u) => u.role === "admin" && u.is_active).length;
    const disabledCount = users.filter((u) => !u.is_active).length;
    const totalCount = users.length;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.target.value);
    };

    return (
        <>
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <div className="flex min-h-[50px] items-center gap-2 border-b border-white/[0.06] bg-surface px-3 md:px-5 flex-wrap py-2">
                    <span className="font-display text-[0.88rem] font-extrabold text-white-soft shrink-0">
                        Gestion des utilisateurs
                    </span>
                    <span className="hidden sm:block h-[18px] w-px bg-white/[0.08]" />
                    <span className="hidden sm:block text-[0.75rem] text-mist truncate">
                        Jurys et modérateurs
                    </span>
                    <div className="ml-auto flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={isInVocal ? leaveVocal : joinVocal}
                            className={
                                isInVocal
                                    ? "flex items-center gap-1.5 rounded-[8px] border border-coral/40 bg-coral/10 px-2.5 py-1.5 font-display text-[0.78rem] font-extrabold text-coral transition-all hover:bg-coral/20"
                                    : "flex items-center gap-1.5 rounded-[8px] border border-aurora/30 bg-aurora/[0.07] px-2.5 py-1.5 font-display text-[0.78rem] font-extrabold text-aurora transition-all hover:bg-aurora/[0.14]"
                            }
                        >
                            {isInVocal ? <MicOff size={14} /> : <Mic size={14} />}
                            <span className="hidden sm:inline">{isInVocal ? "Quitter le vocal" : "Lancer un vocal"}</span>
                        </button>
                        <span className="flex items-center gap-1 rounded-md border border-solar/20 bg-solar/[0.07] px-2 py-1 font-mono text-[0.7rem] text-mist">
                            <ShieldCheck size={13} /> <span className="hidden sm:inline">Admin</span>
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6">
                    {error && (
                        <div className="mb-5 rounded-xl border border-coral/20 bg-coral/10 px-4 py-3 text-[0.82rem] text-coral">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20 text-[0.82rem] text-mist">
                            Chargement…
                        </div>
                    ) : (
                        <>
                            {/* Stats */}
                            <div className="stats-row mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <StatCard
                                    label="Jurys"
                                    value={juryCount}
                                    sub="membres actifs"
                                    color="aurora"
                                />
                                <StatCard
                                    label="Admins"
                                    value={adminCount}
                                    sub="comptes actifs"
                                    color="lavande"
                                />
                                <StatCard
                                    label="Comptes désactivés"
                                    value={disabledCount}
                                    sub="accès révoqué"
                                    color="coral"
                                />
                                <StatCard
                                    label="Comptes créés"
                                    value={totalCount}
                                    sub="invitations envoyées"
                                    color="solar"
                                />
                            </div>

                            {/* Participation chart */}
                            <ParticipationChart users={users} />

                            {/* Section head */}
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="font-display text-[0.95rem] font-extrabold text-white-soft">
                                        Comptes jury &amp; modérateurs
                                    </h2>
                                    <p className="mt-0.5 text-[0.72rem] text-mist hidden sm:block">
                                        L'administrateur est le seul habilité à créer et gérer les
                                        accès.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsInviteOpen(true)}
                                    className="flex items-center gap-2 rounded-[9px] bg-aurora px-4 py-2 font-display text-[0.82rem] font-extrabold tracking-[0.01em] text-deep-sky transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(78,255,206,0.35)]"
                                >
                                    ✉ Inviter
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative mb-3.5">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-40">
                                    <Search size={14} />
                                </span>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder="Rechercher par nom, email ou rôle…"
                                    className="w-full rounded-[10px] border border-white/[0.09] bg-white/[0.04] py-2 pl-9 pr-4 font-body text-[0.85rem] text-white-soft outline-none placeholder:text-mist focus:border-aurora/40"
                                />
                            </div>

                            {/* Table */}
                            <UserTable
                                users={users}
                                search={search}
                                isAdmin={isAdmin}
                                myPermissions={myPermissions}
                                onToggleStatus={toggleStatus}
                                onChangeRole={changeRole}
                                onBan={banUser}
                                onUnban={unbanUser}
                                onSendMessage={sendMessage}
                                onUpdatePermissions={updatePermissions}
                            />
                        </>
                    )}
                </div>
            </div>
            {isInviteOpen && <InviteModal onClose={() => setIsInviteOpen(false)} />}
        </>
    );
};

export default AdminPage;
