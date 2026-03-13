import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
}

interface FooterColumn {
    title: string;
    links: FooterLink[];
}

const HomeFooter = (): React.JSX.Element => {
    const { t } = useTranslation();

    const FOOTER_COLUMNS: FooterColumn[] = [
        {
            title: t("footer.columns.festival.title"),
            links: [
                { label: t("footer.columns.festival.concept"), href: "#concours" },
                { label: t("footer.columns.festival.programme"), href: "#programme" },
                { label: t("footer.columns.festival.jury"), href: "#jury" },
                { label: "La Plateforme", href: "https://laplateforme.io", external: true },
                { label: t("footer.columns.festival.presse"), href: "#presse" },
            ],
        },
        {
            title: t("footer.columns.films.title"),
            links: [
                { label: t("footer.columns.films.galerie"), href: "#films" },
                { label: t("footer.columns.films.palmares"), href: "#palmares" },
                { label: t("footer.columns.films.soumettre"), href: "/formulaire" },
                { label: t("footer.columns.films.reglement"), href: "#" },
            ],
        },
        {
            title: t("footer.columns.contact.title"),
            links: [
                { label: "contact@marsai.fr", href: "mailto:contact@marsai.fr" },
                {
                    label: "Instagram",
                    href: "https://instagram.com/marsaifestival",
                    external: true,
                },
                {
                    label: "LinkedIn",
                    href: "https://linkedin.com/company/marsai-festival",
                    external: true,
                },
                { label: t("footer.columns.contact.mentions"), href: "#" },
            ],
        },
    ];

    return (
        <footer id="presse" className="border-t border-white/10 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div>
                        <div className="text-xs text-mist mb-2">{t("footer.coOrganized")}</div>
                        <div className="font-semibold text-white-soft mb-1">La Plateforme</div>
                        <div className="text-sm text-mist mb-4">{t("footer.by")}</div>
                        <div className="font-display text-2xl font-black mb-3">
                            mars<span className="text-aurora">AI</span>
                        </div>
                        <p className="text-xs text-mist leading-relaxed">
                            {t("footer.description")}
                        </p>
                    </div>

                    {/* Columns */}
                    {FOOTER_COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-sm font-semibold text-white-soft mb-4">
                                {col.title}
                            </h4>
                            <ul className="flex flex-col gap-2">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {link.href.startsWith("/") && !link.external ? (
                                            <Link
                                                to={link.href}
                                                className="text-sm text-mist hover:text-aurora transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={link.href}
                                                target={link.external ? "_blank" : undefined}
                                                rel={
                                                    link.external
                                                        ? "noopener noreferrer"
                                                        : undefined
                                                }
                                                className="text-sm text-mist hover:text-aurora transition-colors"
                                            >
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-2 font-mono text-xs text-mist">
                    <span>{t("footer.copyright")}</span>
                    <span>{t("footer.tagline")}</span>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;
