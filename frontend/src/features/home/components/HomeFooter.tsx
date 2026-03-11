import React from "react";
import { Link } from "react-router-dom";

interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
}

interface FooterColumn {
    title: string;
    links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
    {
        title: "Festival",
        links: [
            { label: "Le Concept", href: "#concours" },
            { label: "Programme", href: "#programme" },
            { label: "Jury", href: "#jury" },
            { label: "La Plateforme", href: "https://laplateforme.io", external: true },
            { label: "Presse", href: "#presse" },
        ],
    },
    {
        title: "Films",
        links: [
            { label: "Galerie", href: "#films" },
            { label: "Palmarès", href: "#palmares" },
            { label: "Soumettre", href: "/formulaire" },
            { label: "Règlement", href: "#" },
        ],
    },
    {
        title: "Contact",
        links: [
            { label: "contact@marsai.fr", href: "mailto:contact@marsai.fr" },
            { label: "Instagram", href: "https://instagram.com/marsaifestival", external: true },
            {
                label: "LinkedIn",
                href: "https://linkedin.com/company/marsai-festival",
                external: true,
            },
            { label: "Mentions légales", href: "#" },
        ],
    },
];

const HomeFooter = (): React.JSX.Element => (
    <footer id="presse" className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                {/* Brand */}
                <div>
                    <div className="text-xs text-mist mb-2">Co-organisé par</div>
                    <div className="font-semibold text-white-soft mb-1">La Plateforme</div>
                    <div className="text-sm text-mist mb-4">× Mobile Film Festival</div>
                    <div className="font-display text-2xl font-black mb-3">
                        mars<span className="text-aurora">AI</span>
                    </div>
                    <p className="text-xs text-mist leading-relaxed">
                        Le premier concours international de courts-métrages d'une minute
                        intégralement générés par IA. 120+ pays. "Imaginez des futurs souhaitables."
                    </p>
                </div>

                {/* Columns */}
                {FOOTER_COLUMNS.map((col) => (
                    <div key={col.title}>
                        <h4 className="text-sm font-semibold text-white-soft mb-4">{col.title}</h4>
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
                                            rel={link.external ? "noopener noreferrer" : undefined}
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
                <span>© 2026 marsAI · Une co-création La Plateforme × Mobile Film Festival</span>
                <span>Imaginez des futurs souhaitables · Première Édition</span>
            </div>
        </div>
    </footer>
);

export default HomeFooter;
