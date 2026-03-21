import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HowStep {
    icon: string;
    num: string;
    title: string;
    desc: string;
    tag: string;
    tagColor: string;
}

const HowSection = (): React.JSX.Element => {
    const { t } = useTranslation();

    const HOW_STEPS: HowStep[] = [
        {
            icon: "👤",
            num: "01",
            title: t("how.steps.0.title"),
            desc: t("how.steps.0.desc"),
            tag: t("how.steps.0.tag"),
            tagColor: "text-aurora border-aurora/30",
        },
        {
            icon: "🎬",
            num: "02",
            title: t("how.steps.1.title"),
            desc: t("how.steps.1.desc"),
            tag: t("how.steps.1.tag"),
            tagColor: "text-solar border-solar/30",
        },
        {
            icon: "🤖",
            num: "03",
            title: t("how.steps.2.title"),
            desc: t("how.steps.2.desc"),
            tag: t("how.steps.2.tag"),
            tagColor: "text-lavande border-lavande/30",
        },
        {
            icon: "✅",
            num: "04",
            title: t("how.steps.3.title"),
            desc: t("how.steps.3.desc"),
            tag: t("how.steps.3.tag"),
            tagColor: "text-coral border-coral/30",
        },
    ];

    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                        {t("how.overline")}
                    </div>
                    <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                        {t("how.title")}
                    </h2>
                    <p className="text-mist max-w-lg mx-auto">{t("how.subtitle")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {HOW_STEPS.map((step) => (
                        <div
                            key={step.num}
                            className="bg-surface border border-white/10 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-2xl">
                                    {step.icon}
                                </div>
                                <div className="font-display text-3xl font-black text-white/20">
                                    {step.num}
                                </div>
                            </div>
                            <div className="font-semibold text-white-soft mb-2">{step.title}</div>
                            <p className="text-sm text-mist mb-4 leading-relaxed">{step.desc}</p>
                            <span
                                className={`font-mono text-xs border rounded-full px-3 py-1 ${step.tagColor}`}
                            >
                                {step.tag}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/formulaire"
                        className="inline-flex items-center gap-2 bg-aurora text-[#0a0f2e] font-bold px-8 py-4 rounded-lg hover:bg-aurora/90 transition-colors text-lg"
                    >
                        {t("how.cta")} <span aria-hidden="true">→</span>
                    </Link>
                    <p className="mt-4 font-mono text-xs text-mist">{t("how.fine")}</p>
                </div>
            </div>
        </section>
    );
};

export default HowSection;
