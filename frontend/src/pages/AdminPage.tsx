import React from "react";
import AdminSidePanel from "../features/admin/components/AdminSidePanel";
import AdminUsersStats from "../features/admin/components/AdminUsersStats";
import AdminTopBar from "../features/admin/components/AdminTopBar";

const AdminPage = (): React.JSX.Element => {
    return (
        <>
            <div className="flex min-h-screen bg-zinc-950">
                <aside className="w-1/5 border-r border-zinc-800">
                    <AdminSidePanel />
                </aside>
                <div className="flex-1 relative flex flex-col min-h-screen">
                    <header className="absolute top-0 left-0 h-2 w-full z-10 px-8 py-6">
                        <AdminTopBar />
                    </header>
                    <main className="flex-1 flex items-center justify-center bg-linear-to-b from-emerald-900/20 to-zinc-950 text-white p-8">
                        <AdminUsersStats />
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
