import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../constants/api";

interface Sponsor {
    id: number;
    name: string;
    partnership_statut: "main" | "lead" | "premium" | "partner" | "supporter";
    sponsor_link: string | null;
    sponsor_logo: string | null;
    sponsored_award: string | null;
}

const TIER_ORDER: Sponsor["partnership_statut"][] = [
    "main",
    "lead",
    "premium",
    "partner",
    "supporter",
];

const TIER_LABEL: Record<Sponsor["partnership_statut"], string> = {
    main: "Sponsor Principal",
    lead: "Sponsors Or",
    premium: "Sponsors Premium",
    partner: "Partenaires",
    supporter: "Soutiens",
};

const FALLBACK_SPONSORS: Sponsor[] = [
    {
        id: 1,
        name: "La Plateforme_",
        partnership_statut: "main",
        sponsor_link: "https://www.la-plateforme.fr",
        sponsor_logo: null,
        sponsored_award: "Grand Prix marsAI",
    },
    {
        id: 2,
        name: "Mobile Film Festival",
        partnership_statut: "lead",
        sponsor_link: "https://mobilefilmfestival.com",
        sponsor_logo: null,
        sponsored_award: "Prix du Mobile",
    },
    {
        id: 3,
        name: "Mistral AI",
        partnership_statut: "lead",
        sponsor_link: "https://mistral.ai",
        sponsor_logo: null,
        sponsored_award: "Prix de l'Innovation IA",
    },
    {
        id: 4,
        name: "Ville de Marseille",
        partnership_statut: "premium",
        sponsor_link: "https://www.marseille.fr",
        sponsor_logo: null,
        sponsored_award: null,
    },
    {
        id: 5,
        name: "ARTE",
        partnership_statut: "premium",
        sponsor_link: "https://www.arte.tv",
        sponsor_logo: null,
        sponsored_award: "Prix du Documentaire",
    },
    {
        id: 6,
        name: "CNC – Centre National du Cinéma",
        partnership_statut: "partner",
        sponsor_link: "https://www.cnc.fr",
        sponsor_logo: null,
        sponsored_award: null,
    },
    {
        id: 7,
        name: "Aix-Marseille Université",
        partnership_statut: "partner",
        sponsor_link: "https://www.univ-amu.fr",
        sponsor_logo: null,
        sponsored_award: "Prix Académique",
    },
    {
        id: 8,
        name: "France Télévisions",
        partnership_statut: "partner",
        sponsor_link: "https://www.france.tv",
        sponsor_logo: null,
        sponsored_award: null,
    },
    {
        id: 9,
        name: "Région Sud",
        partnership_statut: "supporter",
        sponsor_link: "https://www.maregionsud.fr",
        sponsor_logo: null,
        sponsored_award: null,
    },
    {
        id: 10,
        name: "Dailymotion",
        partnership_statut: "supporter",
        sponsor_link: "https://www.dailymotion.com",
        sponsor_logo: null,
        sponsored_award: null,
    },
    {
        id: 11,
        name: "Canson",
        partnership_statut: "supporter",
        sponsor_link: "https://www.canson.com",
        sponsor_logo: null,
        sponsored_award: null,
    },
];

interface SponsorCardProps {
    sponsor: Sponsor;
}

const SponsorCard = ({ sponsor }: SponsorCardProps): React.JSX.Element => {
    const card = (
        <div className="flex flex-col items-center justify-center text-center">
            {sponsor.sponsor_logo && (
                <img
                    src={sponsor.sponsor_logo}
                    alt={sponsor.name}
                    className="w-8 h-8 object-contain rounded mb-2 opacity-60 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                />
            )}
            <span className="font-semibold text-white/60 group-hover:text-white text-sm transition-colors leading-tight">
                {sponsor.name}
            </span>
            <span className="font-mono text-[9px] text-aurora/40 uppercase tracking-widest mt-1">
                {TIER_LABEL[sponsor.partnership_statut]}
            </span>
        </div>
    );

    if (sponsor.sponsor_link) {
        return (
            <a
                href={sponsor.sponsor_link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-surface border border-white/8 rounded-xl px-6 py-4 text-center hover:border-aurora/30 transition-colors flex-shrink-0 mx-3"
                title={sponsor.name}
                style={{ minWidth: "140px" }}
            >
                {card}
            </a>
        );
    }

    return (
        <div
            className="group bg-surface border border-white/8 rounded-xl px-6 py-4 text-center hover:border-aurora/30 transition-colors flex-shrink-0 mx-3"
            style={{ minWidth: "140px" }}
        >
            {card}
        </div>
    );
};

const SponsorsSection = (): React.JSX.Element => {
    const [sponsors, setSponsors] = useState<Sponsor[]>(FALLBACK_SPONSORS);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/public/sponsors`)
            .then((r) => r.json())
            .then((j) => {
                if (j.success && Array.isArray(j.data) && j.data.length > 0) {
                    setSponsors(j.data);
                }
            })
            .catch(() => {
                /* keep fallback */
            });
    }, []);

    // Tri par ordre de tier
    const sortedSponsors = [...sponsors].sort(
        (a, b) =>
            TIER_ORDER.indexOf(a.partnership_statut) - TIER_ORDER.indexOf(b.partnership_statut),
    );

    return (
        <section id="sponsors" className="py-20 px-6">
            {/* Header */}
            <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-aurora/60 mb-3 uppercase tracking-widest">
                    <span
                        className="w-1.5 h-1.5 rounded-full bg-aurora/40 inline-block"
                        aria-hidden="true"
                    />
                    Nos partenaires
                </div>
                <h2 className="font-display text-3xl font-black text-white-soft">
                    Ils soutiennent marsAI 2026
                </h2>
            </div>

            {/* ── Sponsor Infrastructure Principal ─────────────────────────── */}
            <div className="max-w-3xl mx-auto mb-16 relative">
                {/* Glow ambiance */}
                <div className="pointer-events-none absolute -inset-8 rounded-3xl bg-aurora/5 blur-3xl" />

                <a
                    href="https://lightchurch.fr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-2xl overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(78,255,206,0.06) 0%, rgba(12,12,20,0.9) 50%, rgba(139,92,246,0.06) 100%)",
                        border: "1px solid rgba(78,255,206,0.2)",
                        boxShadow:
                            "0 0 0 1px rgba(78,255,206,0.06), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                >
                    {/* Animated border top */}
                    <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, rgba(78,255,206,0.6), rgba(139,92,246,0.4), transparent)",
                        }}
                    />

                    <div className="relative px-10 py-10 flex flex-col sm:flex-row items-center gap-8">
                        {/* Icône / Monogramme */}
                        <div className="flex-shrink-0 relative">
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(78,255,206,0.12), rgba(139,92,246,0.12))",
                                    border: "1px solid rgba(78,255,206,0.2)",
                                    boxShadow: "0 0 30px rgba(78,255,206,0.15)",
                                }}
                            >
                                <span className="font-display text-3xl font-black text-aurora">
                                    LC
                                </span>
                            </div>
                            {/* Pulse ring */}
                            <div className="absolute -inset-1 rounded-2xl border border-aurora/20 animate-pulse" />
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 mb-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-aurora animate-pulse" />
                                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-aurora/70">
                                    Partenaire Infrastructure · Hébergeur officiel
                                </span>
                            </div>
                            <h3 className="font-display text-3xl sm:text-4xl font-black text-white-soft mb-2 group-hover:text-aurora transition-colors duration-300">
                                LightChurch
                            </h3>
                            <p className="text-[0.85rem] text-mist/70 max-w-sm">
                                Infrastructure, hébergement et services techniques du festival
                                marsAI 2026.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex-shrink-0">
                            <span
                                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-display text-[0.8rem] font-bold text-aurora transition-all duration-200 group-hover:scale-105"
                                style={{
                                    background: "rgba(78,255,206,0.08)",
                                    border: "1px solid rgba(78,255,206,0.25)",
                                    boxShadow: "0 0 20px rgba(78,255,206,0.1)",
                                }}
                            >
                                Visiter le site
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                >
                                    <path
                                        d="M2 7h10M7 2l5 5-5 5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Animated border bottom */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-px"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(78,255,206,0.3), transparent)",
                        }}
                    />
                </a>
            </div>

            {/* ── Séparateur ───────────────────────────────────────────────── */}
            <div className="flex items-center gap-4 max-w-sm mx-auto mb-12">
                <div className="flex-1 h-px bg-white/6" />
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-mist/30">
                    Autres partenaires
                </span>
                <div className="flex-1 h-px bg-white/6" />
            </div>

            {/* Bandeau scrollant */}
            <div
                className="overflow-hidden"
                style={{
                    maskImage:
                        "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                }}
            >
                <div
                    className="flex"
                    style={{ animation: "var(--animate-marquee-left)" }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
                    }}
                >
                    {/* Dupliquer 2x pour l'effet infini */}
                    {[...sortedSponsors, ...sortedSponsors].map((sponsor, index) => (
                        <SponsorCard key={`${sponsor.id}-${index}`} sponsor={sponsor} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SponsorsSection;
