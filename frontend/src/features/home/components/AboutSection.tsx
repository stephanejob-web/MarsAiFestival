import React from "react";
import { useTranslation } from "react-i18next";

interface Stat {
    value: string;
    label: string;
}

const AboutSection = (): React.JSX.Element => {
    const { t } = useTranslation();

    const STATS: Stat[] = [
        { value: "50", label: t("about.stats.films") },
        { value: "120+", label: t("about.stats.pays") },
        { value: t("about.stats.gratuit"), label: t("about.stats.acces") },
    ];

    return (
        <section id="about" className="relative py-24 px-6 overflow-hidden">
            <div
                className="aurora-2 absolute top-1/2 -right-40 w-[500px] h-[500px] -translate-y-1/2 bg-aurora/5 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
            />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left — text + program + stats */}
                    <div>
                        <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                            {t("about.overline")}
                        </div>
                        <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                            {t("about.title1")}
                            <br />
                            {t("about.title2")}
                        </h2>
                        <p className="text-mist mb-8 leading-relaxed">{t("about.description")}</p>

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
                        <div className="text-sm text-mist mb-1">{t("about.venue.address")}</div>
                        <div className="font-mono text-xs text-aurora mb-6">
                            43°17'47"N — 5°22'25"E
                        </div>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=La+Plateforme+Friches+Belle+de+Mai+Marseille"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-sm bg-aurora text-[#0a0f2e] font-bold px-4 py-2 rounded-lg hover:bg-aurora/90 transition-colors"
                        >
                            {t("about.venue.directions")}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
