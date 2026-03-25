import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "../../../components/Reveal";

const handleTilt = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(600px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) scale3d(1.03,1.03,1.03)`;
};

const handleTiltReset = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget.style.transform = "";
};

interface HowStep {
    icon: React.JSX.Element;
    num: string;
    title: string;
    desc: string;
    tag: string;
    tagColor: string;
}

const IconUser = (): React.JSX.Element => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
    </svg>
);

const IconFilm = (): React.JSX.Element => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
        />
    </svg>
);

const IconSparkles = (): React.JSX.Element => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
        />
    </svg>
);

const IconCheck = (): React.JSX.Element => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
    </svg>
);

const HowSection = (): React.JSX.Element => {
    const { t } = useTranslation();

    const HOW_STEPS: HowStep[] = [
        {
            icon: <IconUser />,
            num: "01",
            title: t("how.steps.0.title"),
            desc: t("how.steps.0.desc"),
            tag: t("how.steps.0.tag"),
            tagColor: "text-aurora border-aurora/30",
        },
        {
            icon: <IconFilm />,
            num: "02",
            title: t("how.steps.1.title"),
            desc: t("how.steps.1.desc"),
            tag: t("how.steps.1.tag"),
            tagColor: "text-solar border-solar/30",
        },
        {
            icon: <IconSparkles />,
            num: "03",
            title: t("how.steps.2.title"),
            desc: t("how.steps.2.desc"),
            tag: t("how.steps.2.tag"),
            tagColor: "text-lavande border-lavande/30",
        },
        {
            icon: <IconCheck />,
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
                <Reveal variant="up" className="text-center mb-12">
                    <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                        {t("how.overline")}
                    </div>
                    <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                        {t("how.title")}
                    </h2>
                    <p className="text-mist max-w-lg mx-auto">{t("how.subtitle")}</p>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {HOW_STEPS.map((step, i) => (
                        <Reveal key={step.num} delay={i * 90} className="h-full">
                            <div
                                className="tilt-card bg-surface border border-white/10 rounded-2xl p-6 hover:border-aurora/30 transition-colors group h-full"
                                onMouseMove={handleTilt}
                                onMouseLeave={handleTiltReset}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-11 h-11 rounded-xl bg-surface-2 border border-white/8 flex items-center justify-center text-aurora group-hover:border-aurora/30 transition-colors">
                                        {step.icon}
                                    </div>
                                    <div className="font-display text-3xl font-black text-white/15">
                                        {step.num}
                                    </div>
                                </div>
                                <div className="font-semibold text-white-soft mb-2">
                                    {step.title}
                                </div>
                                <p className="text-sm text-mist mb-4 leading-relaxed">
                                    {step.desc}
                                </p>
                                <span
                                    className={`font-mono text-xs border rounded-full px-3 py-1 ${step.tagColor}`}
                                >
                                    {step.tag}
                                </span>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowSection;
