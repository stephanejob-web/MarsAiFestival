import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";

const Layout = (): React.JSX.Element => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");

    if (isAdmin) {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#07061a] via-[#0b1226] to-[#03030a] text-white">
            <Nav />
            <main className="pt-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
