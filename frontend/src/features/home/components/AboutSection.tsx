import React from "react";

interface ProgLine {
    dot: string;
    day: string;
    desc: string;
}

interface Stat {
    value: string;
    label: string;
}

const PROG_LINES: ProgLine[] = [
    { dot: "bg-aurora", day: "Ven.", desc: "Séance inaugurale & cocktail de bienvenue" },
    {
        dot: "bg-lavande",
        day: "Sam.",
        desc: "Projections · Village IA · Conférences & tables rondes",
    },
    { dot: "bg-solar", day: "Dim.", desc: "Délibérations · Cérémonie des Prix · Mars.AI Night" },
];

const STATS: Stat[] = [
    { value: "50", label: "films" },
    { value: "120+", label: "pays" },
    { value: "Gratuit", label: "accès public" },
];

const AboutSection = (): React.JSX.Element => (
    <section id="programme" className="relative py-24 px-6 overflow-hidden">
        <div
            className="aurora-2 absolute top-1/2 -right-40 w-[500px] h-[500px] -translate-y-1/2 bg-aurora/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left — text + program + stats */}
                <div>
                    <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                        L'Événement · Marseille 2026
                    </div>
                    <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                        Vivez la naissance
                        <br />
                        d'un nouveau cinéma
                    </h2>
                    <p className="text-mist mb-8 leading-relaxed">
                        Trois jours aux Friches Belle de Mai — projections, jury international et
                        créateurs qui réinventent le 7e art avec l'IA.
                    </p>

                    {/* Program */}
                    <div className="flex flex-col gap-3 mb-8">
                        {PROG_LINES.map((line) => (
                            <div key={line.day} className="flex items-center gap-3">
                                <span
                                    className={`w-2 h-2 rounded-full flex-shrink-0 ${line.dot}`}
                                />
                                <span className="font-mono text-sm text-mist w-10 flex-shrink-0">
                                    {line.day}
                                </span>
                                <span className="text-sm text-white-soft">{line.desc}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8">
                        {STATS.map((stat) => (
                            <div key={stat.label}>
                                <div className="font-display text-2xl font-black text-aurora">
                                    {stat.value}
                                </div>
                                <div className="text-xs text-mist">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — venue card */}
                <div className="bg-surface border border-white/10 rounded-2xl p-8">
                    <div className="font-display text-lg font-bold text-white-soft mb-1">
                        La Plateforme
                    </div>
                    <div className="text-sm text-mist mb-1">
                        Friches Belle de Mai · Marseille, 13003
                    </div>
                    <div className="font-mono text-xs text-aurora mb-6">43°17'47"N — 5°22'25"E</div>
                    <a
                        href="https://www.google.com/maps/search/?api=1&query=La+Plateforme+Friches+Belle+de+Mai+Marseille"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm bg-aurora text-deep-sky font-bold px-4 py-2 rounded-lg hover:bg-aurora/90 transition-colors"
                    >
                        Itinéraire
                    </a>
                </div>
            </div>
        </div>
    </section>
);

export default AboutSection;
