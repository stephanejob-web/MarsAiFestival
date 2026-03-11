import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLink {
    label: string;
    href: string;
}

const NAV_LINKS: NavLink[] = [
    { label: "Le Festival", href: "#home" },
    { label: "Programme", href: "#programme" },
    { label: "Films", href: "#films" },
    { label: "Palmarès", href: "#palmares" },
    { label: "Jury", href: "#jury" },
];

const Nav = (): React.JSX.Element => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const location = useLocation();
    const isHome = location.pathname === "/";

    useEffect((): (() => void) => {
        const onScroll = (): void => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return (): void => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleAnchor = (href: string): void => {
        if (!isHome) return;
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav
            className={`w-full sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[rgba(5,7,20,0.92)] backdrop-blur-md border-b border-white/8 shadow-lg"
                    : "bg-[rgba(5,7,20,0.6)] backdrop-blur-sm"
            }`}
        >
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="font-display font-black text-xl tracking-tight text-white shrink-0"
                >
                    mars<span className="text-aurora">AI</span>
                </Link>

                {/* Liens principaux */}
                {isHome && (
                    <div className="hidden md:flex items-center gap-1 flex-1">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.href}
                                onClick={(): void => handleAnchor(link.href)}
                                className="text-sm px-3 py-2 rounded-md text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Spacer quand pas sur home */}
                {!isHome && <div className="flex-1" />}

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* CTA principal */}
                    <Link
                        to="/formulaire"
                        className="text-sm px-4 py-2 bg-aurora text-deep-sky font-bold rounded-lg hover:bg-aurora/90 transition-colors"
                    >
                        Déposer un film
                    </Link>

                    {/* Liens dev — visibles uniquement en développement */}
                    <div className="hidden md:flex items-center gap-1 ml-2 pl-2 border-l border-white/10">
                        <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                            dev
                        </span>
                        <Link
                            to="/admin"
                            className="text-xs px-2 py-1.5 rounded text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors font-mono"
                        >
                            admin
                        </Link>
                        <Link
                            to="/jury"
                            className="text-xs px-2 py-1.5 rounded text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors font-mono"
                        >
                            jury
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
