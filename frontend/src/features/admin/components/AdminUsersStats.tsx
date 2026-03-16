import React from "react";
import useAdminUsersStats from "../hooks/useAdminUsersStats";

const AdminUsersStats = (): React.JSX.Element => {
    const { data, isLoading, error } = useAdminUsersStats();

    return (
        <div className="w-full">

            {isLoading && (
                <div className="p-4 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                    Chargement des statistiques en cours...
                </div>
            )}

            {error && (
                <div className="p-4 rounded-lg border border-red-500 bg-red-500/10 text-red-500">
                    {error}
                </div>
            )}

            {data && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                        <p className="text-sm text-zinc-400 mb-1">Administrateurs</p>
                        <p className="text-3xl font-bold text-white">{data.adminCount}</p>
                    </div>

                    <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                        <p className="text-sm text-zinc-400 mb-1">Modérateurs</p>
                        <p className="text-3xl font-bold text-white">{data.moderatorCount}</p>
                    </div>

                    <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                        <p className="text-sm text-zinc-400 mb-1">Comptes Désactivés</p>
                        <p className="text-3xl font-bold text-red-400">{data.deactivatedCount}</p>
                    </div>

                    <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                        <p className="text-sm text-zinc-400 mb-1">Total Comptes Créés</p>
                        <p className="text-3xl font-bold text-blue-400">{data.totalCreatedCount}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersStats;
