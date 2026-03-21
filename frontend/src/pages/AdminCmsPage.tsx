import React, { useState } from "react";
import { Link } from "react-router-dom";
import CmsVideoHero from "../features/admin/components/CmsVideoHero";
import CmsHeroContent from "../features/admin/components/CmsHeroContent";
import CmsCalendar from "../features/admin/components/CmsCalendar";
import CmsProgramme from "../features/admin/components/CmsProgramme";
import CmsJury from "../features/admin/components/CmsJury";
import CmsSponsors from "../features/admin/components/CmsSponsors";
import CmsContactInfo from "../features/admin/components/CmsContactInfo";
import CmsPhases from "../features/admin/components/CmsPhases";

type SectionId = "hero" | "calendrier" | "programme" | "jury" | "sponsors" | "contact" | "phases";

interface Tab {
    id: SectionId;
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
}

const IconHero = (): React.JSX.Element => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="2" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 5.5l4-2v7l-4-2V5.5z" fill="currentColor" />
    </svg>
);

const IconCalendar = (): React.JSX.Element => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect
            x="1.5"
            y="2.5"
            width="12"
            height="11"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.4"
        />
        <path
            d="M1.5 6.5h12M5 1v3M10 1v3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
        />
    </svg>
);

const IconProgramme = (): React.JSX.Element => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
            d="M2 4h11M2 7.5h7M2 11h9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

const IconJury = (): React.JSX.Element => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="5.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path
            d="M1 13c0-2.5 2-4 4.5-4M14 13c0-2.5-2-4-4.5-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
        />
    </svg>
);

const IconSponsors = (): React.JSX.Element => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
            d="M7.5 2l1.6 3.2L13 6l-2.75 2.7.65 3.8L7.5 10.8l-3.4 1.7.65-3.8L2 6l3.9-.8L7.5 2z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
        />
    </svg>
);

const IconContact = (): React.JSX.Element => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="3" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path
            d="M1.5 5.5l6 4 6-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const IconPhases = (): React.JSX.Element => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="3" cy="7.5" r="1.5" fill="currentColor" />
        <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
        <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
        <path d="M4.5 7.5h1.5M9 7.5h1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
);

const TABS: Tab[] = [
    {
        id: "hero",
        label: "Hero",
        icon: <IconHero />,
        color: "text-aurora",
        description: "Vidéo de fond et texte de la page d'accueil",
    },
    {
        id: "calendrier",
        label: "Calendrier",
        icon: <IconCalendar />,
        color: "text-solar",
        description: "Dates clés du festival",
    },
    {
        id: "programme",
        label: "Programme",
        icon: <IconProgramme />,
        color: "text-lavande",
        description: "Événements jour par jour",
    },
    {
        id: "jury",
        label: "Jury",
        icon: <IconJury />,
        color: "text-coral",
        description: "Membres du jury publics",
    },
    {
        id: "sponsors",
        label: "Sponsors",
        icon: <IconSponsors />,
        color: "text-solar",
        description: "Partenaires & sponsors",
    },
    {
        id: "contact",
        label: "Contact",
        icon: <IconContact />,
        color: "text-aurora",
        description: "Infos & réseaux sociaux",
    },
    {
        id: "phases",
        label: "Phases",
        icon: <IconPhases />,
        color: "text-coral",
        description: "Sélection, finalistes, palmarès",
    },
];

const COLOR_MAP: Record<SectionId, { border: string; bg: string; text: string; dot: string }> = {
    hero: {
        border: "border-aurora/40",
        bg: "bg-aurora/10",
        text: "text-aurora",
        dot: "bg-aurora",
    },
    calendrier: {
        border: "border-solar/40",
        bg: "bg-solar/10",
        text: "text-solar",
        dot: "bg-solar",
    },
    programme: {
        border: "border-lavande/40",
        bg: "bg-lavande/10",
        text: "text-lavande",
        dot: "bg-lavande",
    },
    jury: {
        border: "border-coral/40",
        bg: "bg-coral/10",
        text: "text-coral",
        dot: "bg-coral",
    },
    sponsors: {
        border: "border-solar/40",
        bg: "bg-solar/10",
        text: "text-solar",
        dot: "bg-solar",
    },
    contact: {
        border: "border-aurora/40",
        bg: "bg-aurora/10",
        text: "text-aurora",
        dot: "bg-aurora",
    },
    phases: {
        border: "border-coral/40",
        bg: "bg-coral/10",
        text: "text-coral",
        dot: "bg-coral",
    },
};

const AdminCmsPage = (): React.JSX.Element => {
    const [active, setActive] = useState<SectionId>("hero");

    const activeTab = TABS.find((t) => t.id === active)!;
    const colors = COLOR_MAP[active];

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* ── Topbar ───────────────────────────────────────────── */}
            <div className="flex h-[50px] min-h-[50px] items-center gap-3 border-b border-white/[0.06] bg-surface px-5">
                <span className="font-display text-[0.88rem] font-extrabold text-white-soft">
                    CMS
                </span>
                <div className="h-[18px] w-px bg-white/[0.08]" />
                <span className="text-[0.75rem] text-mist">Gestion du contenu public</span>

                <div className="ml-auto flex items-center gap-2">
                    {/* Live indicator */}
                    <div className="hidden items-center gap-1.5 sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-aurora shadow-[0_0_6px_rgba(78,255,206,0.8)]" />
                        <span className="font-mono text-[0.68rem] text-aurora">en ligne</span>
                    </div>
                    <div className="hidden h-3 w-px bg-white/10 sm:block" />

                    {/* Preview */}
                    <Link
                        to="/"
                        target="_blank"
                        className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[0.72rem] text-mist transition-all hover:border-aurora/30 hover:text-aurora"
                    >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path
                                d="M1 10L10 1M10 1H4M10 1v6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Voir le site
                    </Link>

                    <span className="rounded-md border border-solar/20 bg-solar/[0.07] px-2.5 py-1 font-mono text-[0.7rem] text-mist">
                        🛡️ Admin
                    </span>
                </div>
            </div>

            {/* ── Layout : sidebar + content ───────────────────────── */}
            <div className="flex flex-1 overflow-hidden">
                {/* ── Left nav ─────────────────────────────────────── */}
                <nav className="flex w-[200px] min-w-[200px] flex-col border-r border-white/[0.05] bg-surface/80 py-3">
                    <p className="mb-2 px-4 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white/20">
                        Sections
                    </p>

                    {TABS.map((tab) => {
                        const isActive = active === tab.id;
                        const c = COLOR_MAP[tab.id];
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActive(tab.id)}
                                className={`group relative flex items-center gap-2.5 px-4 py-2.5 text-left transition-all ${
                                    isActive
                                        ? `${c.bg} ${c.text}`
                                        : "text-mist hover:bg-white/[0.03] hover:text-white-soft"
                                }`}
                            >
                                {/* Active left bar */}
                                {isActive && (
                                    <span
                                        className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full ${c.dot}`}
                                    />
                                )}
                                <span
                                    className={`shrink-0 transition-colors ${isActive ? c.text : "text-white/30 group-hover:text-white/60"}`}
                                >
                                    {tab.icon}
                                </span>
                                <div className="min-w-0">
                                    <div
                                        className={`text-[0.8rem] font-semibold leading-none ${isActive ? c.text : ""}`}
                                    >
                                        {tab.label}
                                    </div>
                                    <div className="mt-0.5 truncate text-[0.62rem] text-white/30">
                                        {tab.description}
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {/* Bottom spacer + hint */}
                    <div className="mt-auto px-4 pb-2 pt-4">
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 text-[0.65rem] leading-relaxed text-white/25">
                            Chaque section se sauvegarde indépendamment.
                        </div>
                    </div>
                </nav>

                {/* ── Content area ─────────────────────────────────── */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Section header */}
                    <div
                        className={`flex items-center gap-3 border-b px-6 py-3.5 ${colors.border} bg-white/[0.015]`}
                    >
                        <span className={`${colors.text}`}>{activeTab.icon}</span>
                        <div>
                            <span
                                className={`font-display text-[0.9rem] font-extrabold ${colors.text}`}
                            >
                                {activeTab.label}
                            </span>
                            <span className="ml-2 text-[0.72rem] text-mist">
                                — {activeTab.description}
                            </span>
                        </div>
                    </div>

                    {/* Section content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        {active === "hero" && (
                            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                <CmsVideoHero />
                                <CmsHeroContent />
                            </div>
                        )}
                        {active === "calendrier" && <CmsCalendar />}
                        {active === "programme" && <CmsProgramme />}
                        {active === "jury" && <CmsJury />}
                        {active === "sponsors" && <CmsSponsors />}
                        {active === "contact" && <CmsContactInfo />}
                        {active === "phases" && <CmsPhases />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCmsPage;
