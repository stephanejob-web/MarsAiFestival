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
