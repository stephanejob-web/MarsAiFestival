import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { usePhase } from "../../features/home/hooks/usePhase";

const Nav = (): React.JSX.Element => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const location = useLocation();
    const isHome = location.pathname === "/";
    const { t } = useTranslation();

    const currentLang = i18n.language === "fr" ? "fr" : "en";
    const { phase } = usePhase();
    const ctaEnabled = phase.submissionOpen;

    const NAV_LINKS = [
        { label: t("nav.links.festival"), href: "#home" },
        { label: t("nav.links.programme"), href: "#programme" },
        { label: t("nav.links.films"), href: "#films" },
        { label: t("nav.links.palmares"), href: "#palmares" },
        { label: t("nav.links.jury"), href: "#jury" },
        { label: t("nav.links.sponsors"), href: "#sponsors" },
    ];

    useEffect((): (() => void) => {
        const onScroll = (): void => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return (): void => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleAnchor = (href: string): void => {
        if (!isHome) {
            window.location.assign("/" + href);
            return;
        }
        const el = document.querySelector(href);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        } else {
            window.location.replace(window.location.pathname + href);
        }
    };

    const toggleLang = (): void => {
        const next = currentLang === "fr" ? "en" : "fr";
        i18n.changeLanguage(next);
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
                    {/* Language switcher */}
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-0 font-mono text-xs border border-white/20 hover:border-aurora/50 rounded-md overflow-hidden transition-colors"
                        aria-label={`Switch language to ${t("nav.langSwitch")}`}
                    >
                        <span
                            className={`px-2.5 py-1.5 transition-colors ${
                                currentLang === "fr"
                                    ? "bg-aurora text-deep-sky font-bold"
                                    : "text-white/40 hover:text-white/70"
                            }`}
                        >
                            FR
                        </span>
                        <span className="w-px h-4 bg-white/15" />
                        <span
                            className={`px-2.5 py-1.5 transition-colors ${
                                currentLang === "en"
                                    ? "bg-aurora text-deep-sky font-bold"
                                    : "text-white/40 hover:text-white/70"
                            }`}
                        >
                            EN
                        </span>
                    </button>

                    {/* CTA principal — actif seulement si les candidatures sont ouvertes */}
                    {ctaEnabled ? (
                        <Link
                            to="/formulaire"
                            className="text-sm px-4 py-2 bg-aurora text-deep-sky font-bold rounded-lg hover:bg-aurora/90 transition-colors"
                        >
                            {t("nav.cta")}
                        </Link>
                    ) : (
                        <div className="relative group">
                            <button
                                disabled
                                className="text-sm px-4 py-2 bg-surface border border-white/10 text-mist/40 font-bold rounded-lg cursor-not-allowed select-none"
                            >
                                {t("nav.cta")}
                            </button>
                            <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface border border-white/10 px-2.5 py-1 font-mono text-[0.62rem] text-mist/70 opacity-0 transition-opacity group-hover:opacity-100">
                                Candidatures closes
                            </div>
                        </div>
                    )}

                    {/* Connexion */}
                    <Link
                        to="/jury"
                        className="text-sm px-4 py-2 border border-white/20 text-white/70 font-medium rounded-lg hover:border-aurora/50 hover:text-aurora transition-colors"
                    >
                        {t("nav.connexion")}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
