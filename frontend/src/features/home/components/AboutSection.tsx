import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "../../../components/Reveal";
import useCountUp from "../../../hooks/useCountUp";

/** Animated numeric stat — counts from 0 on viewport entry. */
const CountStat = ({ value, label }: { value: string; label: string }): React.JSX.Element => {
    // Parse "120+" → prefix="", num=120, suffix="+"
    const match = value.match(/^([^0-9]*)(\d+)([^0-9]*)$/);
    const num = match ? parseInt(match[2]) : null;
    const prefix = match ? match[1] : "";
    const suffix = match ? match[3] : "";

    const [count, ref] = useCountUp(num ?? 0, 1400);

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>}>
            <div className="font-display text-2xl font-black text-aurora">
                {num !== null ? `${prefix}${count}${suffix}` : value}
            </div>
            <div className="text-xs text-mist">{label}</div>
        </div>
    );
};

const AboutSection = (): React.JSX.Element => {
    const { t } = useTranslation();

    return (
        <section id="about" className="relative py-24 px-6 overflow-hidden">
            <div
                className="aurora-2 absolute top-1/2 -right-40 w-[500px] h-[500px] -translate-y-1/2 bg-aurora/5 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
            />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left — text + stats */}
                    <Reveal variant="left">
                        <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                            {t("about.overline")}
                        </div>
                        <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                            {t("about.title1")}
                            <br />
                            {t("about.title2")}
                        </h2>
                        <p className="text-mist mb-8 leading-relaxed">{t("about.description")}</p>

                        {/* Stats — count-up */}
                        <div className="flex gap-8">
                            <CountStat
                                value={t("about.stats.gratuit")}
                                label={t("about.stats.acces")}
                            />
                            <CountStat value="120+" label={t("about.stats.pays")} />
                            <CountStat value="50" label={t("about.stats.films")} />
                        </div>
                    </Reveal>

                    {/* Right — venue card */}
                    <Reveal variant="right" delay={100}>
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
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
