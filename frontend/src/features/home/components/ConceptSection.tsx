import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "../../../components/Reveal";

interface ConceptCard {
    num: string;
    title: string;
    desc: string;
}

const handleTilt = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(600px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) scale3d(1.03,1.03,1.03)`;
};

const handleTiltReset = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget.style.transform = "";
};

const ConceptSection = (): React.JSX.Element => {
    const { t } = useTranslation();

    const CONCEPT_CARDS: ConceptCard[] = [
        {
            num: "1'",
            title: t("concept.cards.0.title"),
            desc: t("concept.cards.0.desc"),
        },
        {
            num: "IA",
            title: t("concept.cards.1.title"),
            desc: t("concept.cards.1.desc"),
        },
        {
            num: "50",
            title: t("concept.cards.2.title"),
            desc: t("concept.cards.2.desc"),
        },
        {
            num: "30.09",
            title: t("concept.cards.3.title"),
            desc: t("concept.cards.3.desc"),
        },
    ];

    return (
        <section id="concours" className="relative py-24 px-6 overflow-hidden">
            <div
                className="aurora-1 absolute -top-20 left-1/2 w-[600px] h-[300px] -translate-x-1/2 bg-aurora/5 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
            />

            {/* Robot image decoration */}
            <div
                className="absolute top-0 right-0 w-52 opacity-10 pointer-events-none hidden lg:block"
                aria-hidden="true"
            >
                <img src="/assets/femme-robot2.png" alt="" loading="lazy" />
            </div>

            <div className="max-w-6xl mx-auto">
                <Reveal variant="up">
                    <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                        {t("concept.overline")}
                    </div>
                    <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                        {t("concept.title1")}
                        <br />
                        {t("concept.title2")}
                    </h2>
                    <p className="text-mist max-w-2xl mb-12 leading-relaxed">
                        {t("concept.description")}
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {CONCEPT_CARDS.map((card, i) => (
                        <Reveal key={card.num} delay={i * 90} className="h-full">
                            <div
                                className="tilt-card bg-surface border border-white/10 rounded-2xl p-6 hover:border-aurora/30 transition-colors h-full"
                                onMouseMove={handleTilt}
                                onMouseLeave={handleTiltReset}
                            >
                                <div className="font-display text-4xl font-black text-aurora mb-3">
                                    {card.num}
                                </div>
                                <div className="font-semibold text-white-soft mb-2">
                                    {card.title}
                                </div>
                                <p className="text-sm text-mist leading-relaxed">{card.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ConceptSection;
