import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidePanel from "../features/admin/components/AdminSidePanel";

const AdminLayout = (): React.JSX.Element => {
    return (
        <div className="flex h-screen overflow-hidden bg-surface text-white-soft">
            <aside className="w-[240px] min-w-[240px] border-r border-white/[0.06]">
                <AdminSidePanel />
            </aside>
            <main className="flex flex-1 flex-col overflow-hidden">
                <Outlet />
            </main>
            <ToastContainer />
        </div>
    );
};

export default AdminLayout;
