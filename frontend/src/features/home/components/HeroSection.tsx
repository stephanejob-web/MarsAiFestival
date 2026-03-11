import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import heroVideo from "../../../assets/hero-marsai.mp4";
import useCountdown from "../hooks/useCountdown";

interface HeroTag {
    label: string;
    sub: string;
}

interface CountdownUnit {
    value: string;
    label: string;
}

const HERO_TAGS: HeroTag[] = [
    { label: "60s", sub: "chrono" },
    { label: "120+", sub: "pays" },
    { label: "100%", sub: "gratuit" },
    { label: "Prix", sub: "Marseille" },
];

const pad = (n: number): string => String(n).padStart(2, "0");

const HeroSection = (): React.JSX.Element => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { days, hours, minutes, seconds } = useCountdown();

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

    const countdownUnits: CountdownUnit[] = [
        { value: pad(days), label: "Jours" },
        { value: pad(hours), label: "Heures" },
        { value: pad(minutes), label: "Minutes" },
        { value: pad(seconds), label: "Secondes" },
    ];

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center px-6 py-24 overflow-hidden"
        >
            {/* Video background */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
            >
                <source src={heroVideo} type="video/mp4" />
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
                        <span>Une co-création</span>
                        <strong className="text-white-soft">La Plateforme</strong>
                        <span>&amp;</span>
                        <strong className="text-white-soft">Mobile Film Festival</strong>
                    </div>

                    {/* Badge */}
                    <div className="inline-block font-mono text-xs text-aurora border border-aurora/30 rounded-full px-3 py-1 mb-6 tracking-wider">
                        Festival International · Première Édition · Marseille 2026
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-8xl lg:text-9xl font-black leading-none mb-5">
                        mars<span className="text-aurora">AI</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg font-semibold text-white-soft max-w-lg mb-6">
                        Le premier festival mondial du cinéma généré par intelligence artificielle.
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
                        Voici ce qu'une IA peut créer.
                        <br />
                        <span className="text-aurora font-semibold">
                            Imaginez ce que vous allez faire.
                        </span>
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/formulaire"
                            className="inline-flex items-center gap-2 bg-aurora text-deep-sky font-bold px-6 py-3 rounded-lg hover:bg-aurora/90 transition-colors"
                        >
                            Soumettre un film <span aria-hidden="true">→</span>
                        </Link>
                        <button
                            onClick={handleDemoClick}
                            className="inline-flex items-center gap-2 border border-white/20 text-white-soft px-6 py-3 rounded-lg hover:border-aurora/50 hover:text-aurora transition-colors"
                        >
                            Démo
                        </button>
                    </div>
                </div>

                {/* Right — city + countdown */}
                <div className="flex-shrink-0">
                    <div className="font-display text-6xl font-black text-white/10 tracking-widest mb-8 text-center">
                        Marseille
                    </div>
                    <p className="font-mono text-xs text-mist mb-4 text-center">
                        Clôture des dépôts · 30 sept. 2026
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
