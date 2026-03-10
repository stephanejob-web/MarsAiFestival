import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";

const Layout = (): React.JSX.Element => {
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
