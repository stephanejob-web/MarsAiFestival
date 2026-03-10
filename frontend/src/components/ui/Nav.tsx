import React from "react";
import { Link } from "react-router-dom";

const Nav = (): React.JSX.Element => {
    return (
        <nav className="w-full bg-[rgba(10,12,24,0.6)] backdrop-blur-md sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                <Link to="/" className="font-bold text-lg tracking-tight text-white">
                    mars<span className="text-aurora">AI</span>
                </Link>

                <div className="flex items-center gap-3">
                    <Link
                        to="/formulaire"
                        className="text-sm px-3 py-2 rounded-md text-white/90 hover:text-white"
                    >
                        Formulaire
                    </Link>
                    <Link
                        to="/admin"
                        className="text-sm px-3 py-2 rounded-md text-white/90 hover:text-white"
                    >
                        Admin
                    </Link>
                    <Link
                        to="/jury"
                        className="text-sm px-3 py-2 rounded-md text-white/90 hover:text-white"
                    >
                        Jury
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
