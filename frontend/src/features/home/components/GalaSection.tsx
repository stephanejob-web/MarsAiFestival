import React from "react";

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

const AWARDS: Award[] = [
    {
        icon: "⚖️",
        name: "Prix du Jury",
        desc: "Coup de cœur artistique du jury international.",
        colorClass: "border-aurora/30 hover:border-aurora/50",
    },
    {
        icon: "🌍",
        name: "Prix du Public",
        desc: "Vote ouvert en ligne pendant le festival.",
        colorClass: "border-lavande/30 hover:border-lavande/50",
    },
    {
        icon: "🤖",
        name: "Prix Innovation IA",
        desc: "Usage le plus créatif de l'intelligence artificielle.",
        colorClass: "border-solar/30 hover:border-solar/50",
    },
];

const JURY: JuryMember[] = [
    {
        name: "Marie Lefebvre",
        role: "Réalisatrice",
        badge: "Présidente du Jury",
        quote: "Figure incontournable du cinéma d'auteur, trois fois primée au Festival de Cannes. Elle préside le jury marsAI 2026 avec l'ambition d'élever la création IA au rang d'art majeur.",
        avatar: "https://i.pravatar.cc/400?img=47",
        featured: true,
    },
    {
        name: "Pierre Dubois",
        role: "Directeur artistique",
        badge: "Membre du Jury",
        avatar: "https://i.pravatar.cc/400?img=12",
    },
    {
        name: "Kenji Ito",
        role: "Artiste numérique",
        badge: "Membre du Jury",
        avatar: "https://i.pravatar.cc/400?img=68",
    },
    {
        name: "Sofia Eriksson",
        role: "Critique de cinéma",
        badge: "Membre du Jury",
        avatar: "https://i.pravatar.cc/400?img=44",
    },
    {
        name: "Amara Touré",
        role: "Productrice",
        badge: "Membre du Jury",
        avatar: "https://i.pravatar.cc/400?img=32",
    },
    {
        name: "Carlos Ruiz",
        role: "Chef opérateur",
        badge: "Membre du Jury",
        avatar: "https://i.pravatar.cc/400?img=18",
    },
];

const GalaSection = (): React.JSX.Element => {
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
                            Mars.AI Night · Marseille 2026
                        </div>
                        <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                            La nuit où le cinéma bascule
                            <br />
                            dans l'<span className="text-coral">ère IA</span>.
                        </h2>
                        <p className="text-mist max-w-xl mx-auto">
                            Dimanche soir, Marseille s'illumine. Gala de clôture aux Friches Belle
                            de Mai : prix, DJ set génératif et créateurs sur scène.
                        </p>
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
                                    Prix Principal
                                </div>
                                <div className="font-display text-4xl font-black text-white mb-3">
                                    Grand Prix
                                </div>
                                <p className="text-mist mb-4">
                                    Meilleur film toutes catégories — décerné par le jury
                                    international.
                                </p>
                                <div className="font-mono text-xs text-solar/70">
                                    Bourse de création · Remise lors du Gala
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
                            Jury International · marsAI 2026
                        </div>
                        <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                            Le Jury
                        </h2>
                        <p className="text-mist max-w-xl mx-auto">
                            Des créateurs, artistes et personnalités du cinéma venus du monde entier
                            pour évaluer les œuvres en compétition.
                        </p>
                    </div>

                    {/* Présidente — carte featured */}
                    {featured && (
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
                </div>
            </section>
        </>
    );
};

export default GalaSection;
