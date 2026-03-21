import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../../constants/api";

interface Award {
    icon: string;
    name: string;
    desc: string;
    colorClass: string;
}

interface JuryMember {
    name: string;
    role: string;
    badge: string;
    quote?: string;
    avatar: string;
    featured?: boolean;
}

const AWARD_ICONS = ["⚖️", "🌍", "🤖"];
const AWARD_COLORS = [
    "border-aurora/30 hover:border-aurora/50",
    "border-lavande/30 hover:border-lavande/50",
    "border-solar/30 hover:border-solar/50",
];

const JURY_AVATARS = [
    "https://i.pravatar.cc/400?img=47",
    "https://i.pravatar.cc/400?img=12",
    "https://i.pravatar.cc/400?img=68",
    "https://i.pravatar.cc/400?img=44",
    "https://i.pravatar.cc/400?img=32",
    "https://i.pravatar.cc/400?img=18",
];

const GalaSection = (): React.JSX.Element => {
    const { t } = useTranslation();
    const [juryMembers, setJuryMembers] = useState<JuryMember[] | null>(null);
    const [juryLoading, setJuryLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchJury = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/jury-showcase`);
                const json = await res.json();
                if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                    const mapped: JuryMember[] = json.data.map(
                        (m: {
                            name: string;
                            display_role: string;
                            badge: string;
                            quote: string | null;
                            photo_url: string | null;
                            is_featured: number;
                        }, i: number) => ({
                            name: m.name,
                            role: m.display_role,
                            badge: m.badge,
                            quote: m.quote ?? undefined,
                            avatar: m.photo_url ?? JURY_AVATARS[i % JURY_AVATARS.length],
                            featured: m.is_featured === 1,
                        })
                    );
                    setJuryMembers(mapped);
                }
            } catch {
                // fall back to i18n data
            } finally {
                setJuryLoading(false);
            }
        };
        fetchJury();
    }, []);

    const awardsData = t("gala.awards", { returnObjects: true }) as Record<
        string,
        { name: string; desc: string }
    >;
    const AWARDS: Award[] = Object.keys(awardsData).map((k) => ({
        icon: AWARD_ICONS[Number(k)],
        name: awardsData[k].name,
        desc: awardsData[k].desc,
        colorClass: AWARD_COLORS[Number(k)],
    }));

    // Build JURY from API data or fall back to i18n
    const JURY: JuryMember[] = (() => {
        if (juryMembers !== null) return juryMembers;
        const juryData = t("gala.jury", { returnObjects: true }) as Record<
            string,
            { name: string; role: string; badge: string; quote?: string }
        >;
        return Object.keys(juryData).map((k, i) => ({
            name: juryData[k].name,
            role: juryData[k].role,
            badge: juryData[k].badge,
            quote: juryData[k].quote,
            avatar: JURY_AVATARS[i],
            featured: i === 0,
        }));
    })();

    const title2Full = t("gala.title2");
    const title2Highlight = t("gala.title2_highlight");
    const [t2Before, t2After] = title2Full.split(title2Highlight);

    const featured = JURY.find((j) => j.featured);
    const members = JURY.filter((j) => !j.featured);

    return (
        <>
            {/* Palmarès */}
            <section id="palmares" className="relative py-24 px-6 overflow-hidden">
                <div
                    className="absolute inset-0 bg-gradient-to-b from-surface/50 to-transparent pointer-events-none"
                    aria-hidden="true"
                />

                <div className="relative max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 font-mono text-xs text-aurora mb-4">
                            <span
                                className="w-2 h-2 rounded-full bg-aurora inline-block"
                                aria-hidden="true"
                            />
                            {t("gala.overline")}
                        </div>
                        <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                            {t("gala.title1")}
                            <br />
                            {t2Before}
                            <span className="text-coral">{title2Highlight}</span>
                            {t2After}
                        </h2>
                        <p className="text-mist max-w-xl mx-auto">{t("gala.subtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Grand Prix */}
                        <div className="bg-surface border border-solar/30 rounded-2xl p-8 relative overflow-hidden">
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-solar/5 to-transparent pointer-events-none"
                                aria-hidden="true"
                            />
                            <div className="relative">
                                <div className="font-mono text-xs text-solar uppercase tracking-widest mb-2">
                                    {t("gala.grandPrix.overline")}
                                </div>
                                <div className="font-display text-4xl font-black text-white mb-3">
                                    {t("gala.grandPrix.title")}
                                </div>
                                <p className="text-mist mb-4">{t("gala.grandPrix.desc")}</p>
                                <div className="font-mono text-xs text-solar/70">
                                    {t("gala.grandPrix.note")}
                                </div>
                            </div>
                        </div>

                        {/* Secondary awards */}
                        <div className="flex flex-col gap-4">
                            {AWARDS.map((award) => (
                                <div
                                    key={award.name}
                                    className={`bg-surface border rounded-xl p-4 flex items-start gap-4 transition-colors ${award.colorClass}`}
                                >
                                    <div className="text-2xl flex-shrink-0">{award.icon}</div>
                                    <div>
                                        <div className="font-semibold text-white-soft mb-1">
                                            {award.name}
                                        </div>
                                        <p className="text-sm text-mist">{award.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Jury */}
            <section id="jury" className="py-24 px-6 bg-surface/30">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                            {t("gala.juryOverline")}
                        </div>
                        <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                            {t("gala.juryTitle")}
                        </h2>
                        <p className="text-mist max-w-xl mx-auto">{t("gala.jurySubtitle")}</p>
                    </div>

                    {/* Loading skeleton */}
                    {juryLoading && (
                        <div className="opacity-40 animate-pulse">
                            <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden mb-10 h-64" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-surface border border-white/8 rounded-xl h-48" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Présidente — carte featured */}
                    {!juryLoading && featured && (
                        <div className="bg-surface border border-aurora/25 rounded-2xl overflow-hidden mb-10 flex flex-col md:flex-row">
                            {/* Photo */}
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img
                                    src={featured.avatar}
                                    alt={featured.name}
                                    className="w-full h-64 md:h-full object-cover object-top"
                                    loading="lazy"
                                />
                            </div>
                            {/* Infos */}
                            <div className="flex flex-col justify-center px-8 py-8">
                                <span className="font-mono text-xs text-aurora uppercase tracking-widest mb-3">
                                    {featured.badge}
                                </span>
                                <h3 className="font-display text-3xl font-black text-white-soft mb-1">
                                    {featured.name}
                                </h3>
                                <p className="text-aurora text-sm font-semibold mb-4">
                                    {featured.role}
                                </p>
                                {featured.quote && (
                                    <blockquote className="text-mist text-sm leading-relaxed border-l-2 border-aurora/30 pl-4 italic">
                                        &ldquo;{featured.quote}&rdquo;
                                    </blockquote>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Membres — grille */}
                    {!juryLoading && members.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {members.map((member) => (
                                <div
                                    key={member.name}
                                    className="bg-surface border border-white/8 rounded-xl overflow-hidden text-center hover:border-white/20 transition-colors"
                                >
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-full aspect-square object-cover object-top"
                                        loading="lazy"
                                    />
                                    <div className="p-3">
                                        <div className="font-mono text-[10px] text-aurora uppercase tracking-wider mb-1">
                                            {member.badge}
                                        </div>
                                        <div className="font-semibold text-white-soft text-sm leading-tight">
                                            {member.name}
                                        </div>
                                        <div className="text-mist text-xs mt-0.5">{member.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default GalaSection;
