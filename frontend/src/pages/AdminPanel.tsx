import React from "react";
import { Link } from "react-router-dom";
import AdminSidePanel from "../components/ui/AdminSidePanel";

const AdminPanel = (): React.JSX.Element => {
    return (
        <div className="flex min-h-screen bg-zinc-950">
            <aside className="w-1/5 border-r border-zinc-800">
                <AdminSidePanel />
            </aside>
            <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-emerald-900/20 to-zinc-950 text-white">
                <div className="max-w-2xl p-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">Panneau Admin</h1>
                    <p className="mb-6 text-zinc-400">
                        Bonjour Dylan — cette page est dédiée au développement du panneau admin.
                    </p>
                    <Link
                        to="/"
                        className="text-sm underline hover:text-emerald-400 transition-colors"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
