import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroVideoFallback from "../../../assets/hero-marsai.mp4";
import useCountdown from "../hooks/useCountdown";
import { API_BASE_URL } from "../../../constants/api";

interface CountdownUnit {
    value: string;
    label: string;
}

const pad = (n: number): string => String(n).padStart(2, "0");

const HeroSection = (): React.JSX.Element => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { days, hours, minutes, seconds } = useCountdown();
    const { t } = useTranslation();
    const [videoSrc, setVideoSrc] = useState<string>(heroVideoFallback);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/cms/public`)
            .then((r) => r.json())
            .then((json) => {
                if (json.success && json.data?.hero_video_path) {
                    setVideoSrc(`${API_BASE_URL}${json.data.hero_video_path}`);
                }
            })
            .catch(() => {});
    }, []);

    useEffect((): (() => void) => {
        const video = videoRef.current;
        if (!video) return (): void => {};
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mq.matches) video.pause();
        const handleChange = (e: MediaQueryListEvent): void => {
            if (e.matches) {
                video.pause();
            } else {
                video.play().catch((): void => {});
            }
        };
        mq.addEventListener("change", handleChange);
        return (): void => mq.removeEventListener("change", handleChange);
    }, []);

    const handleDemoClick = (): void => {
        window.open("/assets/video.mp4", "_blank");
    };

    const HERO_TAGS = [
        { label: "60s", sub: t("hero.tags.chrono") },
        { label: "120+", sub: t("hero.tags.pays") },
        { label: "100%", sub: t("hero.tags.gratuit") },
        { label: t("hero.tags.prix"), sub: "Marseille" },
    ];

    const countdownUnits: CountdownUnit[] = [
        { value: pad(days), label: t("hero.countdown.days") },
        { value: pad(hours), label: t("hero.countdown.hours") },
        { value: pad(minutes), label: t("hero.countdown.minutes") },
        { value: pad(seconds), label: t("hero.countdown.seconds") },
    ];

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center px-6 py-24 overflow-hidden"
        >
            {/* Video background */}
            <video
                key={videoSrc}
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
            >
                <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Aurora orbs */}
            <div
                className="aurora-1 absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-aurora/10 blur-3xl pointer-events-none z-0"
                aria-hidden="true"
            />
            <div
                className="aurora-2 absolute bottom-1/4 -right-40 w-[400px] h-[400px] rounded-full bg-lavande/10 blur-3xl pointer-events-none z-0"
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
                {/* Left — main text */}
                <div className="flex-1">
                    {/* Partners */}
                    <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-mist">
                        <span>{t("hero.coCreation")}</span>
                        <strong className="text-white-soft">La Plateforme</strong>
                        <span>&amp;</span>
                        <strong className="text-white-soft">Mobile Film Festival</strong>
                    </div>

                    {/* Badge */}
                    <div className="inline-block font-mono text-xs text-aurora border border-aurora/30 rounded-full px-3 py-1 mb-6 tracking-wider">
                        {t("hero.badge")}
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-8xl lg:text-9xl font-black leading-none mb-5">
                        mars<span className="text-aurora">AI</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg font-semibold text-white-soft max-w-lg mb-6">
                        {t("hero.description")}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {HERO_TAGS.map((tag) => (
                            <span
                                key={tag.sub}
                                className="font-mono text-sm bg-surface border border-white/10 rounded px-3 py-1.5 text-white-soft"
                            >
                                <strong className="text-aurora">{tag.label}</strong> {tag.sub}
                            </span>
                        ))}
                    </div>

                    {/* Accroche */}
                    <p className="text-base text-mist mb-8 leading-relaxed">
                        {t("hero.accroche1")}
                        <br />
                        <span className="text-aurora font-semibold">{t("hero.accroche2")}</span>
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/formulaire"
                            className="inline-flex items-center gap-2 bg-aurora text-[#0a0f2e] font-bold px-6 py-3 rounded-lg hover:bg-aurora/90 transition-colors"
                        >
                            {t("hero.cta")} <span aria-hidden="true">→</span>
                        </Link>
                        <button
                            onClick={handleDemoClick}
                            className="inline-flex items-center gap-2 border border-white/20 text-white-soft px-6 py-3 rounded-lg hover:border-aurora/50 hover:text-aurora transition-colors"
                        >
                            {t("hero.demo")}
                        </button>
                    </div>
                </div>

                {/* Right — city + countdown */}
                <div className="flex-shrink-0">
                    <div className="font-display text-6xl font-black text-white/10 tracking-widest mb-8 text-center">
                        Marseille
                    </div>
                    <p className="font-mono text-xs text-mist mb-4 text-center">
                        {t("hero.deadline")}
                    </p>
                    <div className="flex items-start justify-center gap-1">
                        {countdownUnits.map((unit, i) => (
                            <React.Fragment key={unit.label}>
                                {i > 0 && (
                                    <span
                                        className="text-aurora text-2xl font-bold mt-1 px-1"
                                        aria-hidden="true"
                                    >
                                        :
                                    </span>
                                )}
                                <div className="text-center min-w-[56px]">
                                    <div className="font-display text-4xl font-black text-white tabular-nums">
                                        {unit.value}
                                    </div>
                                    <div className="text-xs text-mist mt-1">{unit.label}</div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
