import React from "react";
import { Link } from "react-router-dom";
import AdminSidePanel from "../features/admin/components/AdminSidePanel";
import { ADMIN_LABELS } from "../features/admin/constants";

const AdminPage = (): React.JSX.Element => {
    return (
        <div className="flex min-h-screen bg-zinc-950">
            <aside className="w-1/5 border-r border-zinc-800">
                <AdminSidePanel />
            </aside>
            <main className="flex-1 flex items-center justify-center bg-linear-to-b from-emerald-900/20 to-zinc-950 text-white p-8">
                <div className="max-w-2xl text-center">
                    <h1 className="text-3xl font-bold mb-4">{ADMIN_LABELS.ADMIN_PANEL}</h1>
                    <p className="mb-6 text-zinc-400">{ADMIN_LABELS.WELCOME_MESSAGE}</p>
                    <Link
                        to="/"
                        className="text-sm underline hover:text-emerald-400 transition-colors"
                    >
                        {ADMIN_LABELS.RETURN_HOME}
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
