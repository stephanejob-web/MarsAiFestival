import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import AdminSidePanel from "../features/admin/components/AdminSidePanel";
import { useBanProtection } from "../features/admin/hooks/useBanProtection";
import AdminMessageToast from "../features/admin/components/AdminMessageToast";
import BanModal from "../features/admin/components/BanModal";

const AdminLayout = (): React.JSX.Element => {
    const navigate = useNavigate();
    const { isBanned, adminMessage, clearAdminMessage } = useBanProtection();

    return (
        <div className="flex h-screen overflow-hidden bg-surface text-white-soft">
            <BanModal visible={isBanned} />
            <AdminMessageToast message={adminMessage} onClose={clearAdminMessage} />
            <aside className="w-[240px] min-w-[240px] border-r border-white/[0.06]">
                <AdminSidePanel />
            </aside>
            <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex h-[42px] min-h-[42px] items-center border-b border-white/[0.05] px-5">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-1.5 text-[0.75rem] text-mist/60 transition-colors hover:text-white-soft"
                    >
                        <ArrowLeft size={13} />
                        Retour au site
                    </button>
                </div>
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Outlet />
                </div>
            </main>
            <ToastContainer />
        </div>
    );
};

export default AdminLayout;
