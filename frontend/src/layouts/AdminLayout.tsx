import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ArrowLeft, Menu } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import AdminSidePanel from "../features/admin/components/AdminSidePanel";
import { useBanProtection } from "../features/admin/hooks/useBanProtection";
import AdminMessageToast from "../features/admin/components/AdminMessageToast";
import BanModal from "../features/admin/components/BanModal";
import SessionExpiredModal from "../features/admin/components/SessionExpiredModal";

const AdminLayout = (): React.JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isBanned, isSessionExpired, adminMessage, clearAdminMessage } = useBanProtection();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fermer le sidebar au changement de route (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Bloquer le scroll quand le sidebar mobile est ouvert
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    return (
        <div className="flex h-screen overflow-hidden bg-surface text-white-soft">
            <BanModal visible={isBanned} />
            <SessionExpiredModal visible={isSessionExpired} />
            <AdminMessageToast message={adminMessage} onClose={clearAdminMessage} />

            {/* Sidebar — desktop toujours visible, mobile drawer */}
            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-[240px] min-w-[240px] border-r border-white/[0.06] transition-transform duration-300
                    md:relative md:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <AdminSidePanel onClose={() => setSidebarOpen(false)} />
            </aside>

            <main className="flex flex-1 flex-col overflow-hidden min-w-0">
                {/* Barre de navigation */}
                <div className="flex h-[42px] min-h-[42px] items-center border-b border-white/[0.05] px-3 md:px-5 gap-2">
                    {/* Hamburger mobile */}
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-mist/60 hover:text-white-soft hover:bg-white/5 transition-colors shrink-0"
                        aria-label="Ouvrir le menu"
                    >
                        <Menu size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-1.5 text-[0.75rem] text-mist/60 transition-colors hover:text-white-soft"
                    >
                        <ArrowLeft size={13} />
                        <span className="hidden sm:inline">Retour au site</span>
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
