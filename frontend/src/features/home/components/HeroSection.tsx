import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroVideoFallback from "../../../assets/hero-marsai.mp4";
import useCountdown from "../hooks/useCountdown";
import { usePhase } from "../hooks/usePhase";
import { API_BASE_URL } from "../../../constants/api";
import FlipCountdown from "./FlipCountdown";

const getCountdownConfig = (
    phase: ReturnType<typeof usePhase>["phase"],
): {
    targetDate: string | null;
    label: string;
    ctaEnabled: boolean;
    ctaDisabledReason: string | null;
} => {
    const { submissionOpen, dates } = phase;

    if (submissionOpen) {
        return {
            targetDate: dates.submission_close,
            label: "Clôture des candidatures",
            ctaEnabled: true,
            ctaDisabledReason: null,
        };
    }

    // Before submissions open
    if (dates.submission_open && new Date(dates.submission_open) > new Date()) {
        const openDate = new Date(dates.submission_open).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        return {
            targetDate: dates.submission_open,
            label: "Ouverture des candidatures",
            ctaEnabled: false,
            ctaDisabledReason: `Ouverture le ${openDate}`,
        };
    }

    // Phase 1 — top 50 countdown
    if (phase.phase === 1 && dates.phase_top50_close) {
        return {
            targetDate: dates.phase_top50_close,
            label: "Annonce des finalistes",
            ctaEnabled: false,
            ctaDisabledReason: "Les candidatures sont closes",
        };
    }

    // Phase 2 — award countdown
    if (phase.phase === 2 && dates.phase_award_close) {
        return {
            targetDate: dates.phase_award_close,
            label: "Révélation du palmarès",
            ctaEnabled: false,
            ctaDisabledReason: "Les candidatures sont closes",
        };
    }

    // Phase 3 — ceremony countdown
    if (phase.phase === 3 && dates.ceremony) {
        return {
            targetDate: dates.ceremony,
            label: "Cérémonie de clôture",
            ctaEnabled: false,
            ctaDisabledReason: "Le festival est terminé",
        };
    }

    // Fallback: use nextDate from phase
    return {
        targetDate: phase.nextDate,
        label: "Prochain événement",
        ctaEnabled: false,
        ctaDisabledReason: "Les candidatures sont closes",
    };
};

const HeroSection = (): React.JSX.Element => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { phase } = usePhase();
    const {
        targetDate,
        label: countdownLabel,
        ctaEnabled,
        ctaDisabledReason,
    } = getCountdownConfig(phase);
    const { days, hours, minutes, seconds } = useCountdown(targetDate);
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

    const STATS = [
        { value: "60s", label: t("hero.tags.chrono") },
        { value: "120+", label: t("hero.tags.pays") },
        { value: "100%", label: t("hero.tags.gratuit") },
        { value: t("hero.tags.prix"), label: "Marseille" },
    ];

    return (
        <section
            id="home"
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-deep-sky"
        >
            {/* Video background */}
            <video
                key={videoSrc}
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-[0.12] z-0"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
            >
                <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Aurora orb — gauche */}
            <div
                className="aurora-1 absolute top-1/2 -translate-y-1/2 -left-64 w-[700px] h-[700px] rounded-full bg-aurora/8 blur-3xl pointer-events-none z-0"
                aria-hidden="true"
            />
            {/* Aurora orb — droite */}
            <div
                className="aurora-2 absolute top-1/2 -translate-y-1/2 -right-64 w-[700px] h-[700px] rounded-full bg-lavande/8 blur-3xl pointer-events-none z-0"
                aria-hidden="true"
            />

            {/* Gradient overlay bas */}
            <div
                className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-deep-sky to-transparent z-[1] pointer-events-none"
                aria-hidden="true"
            />

            {/* Contenu principal centré */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-7xl mx-auto pt-24 pb-72">
                {/* Co-création label */}
                <p
                    className="font-mono text-xs text-mist/60 mb-6 tracking-wider"
                    style={{ animation: "var(--animate-fade-in)" }}
                >
                    Une co-création &middot; La Plateforme &amp; Mobile Film Festival
                </p>

                {/* Badge pill */}
                <div
                    className="inline-flex items-center gap-2 border border-aurora/30 rounded-full px-4 py-1.5 mb-8 font-mono text-xs text-aurora/80 tracking-wider"
                    style={{ animation: "var(--animate-fade-in)" }}
                >
                    <span
                        className="w-2 h-2 rounded-full bg-aurora animate-pulse flex-shrink-0"
                        aria-hidden="true"
                    />
                    {t("hero.badge")}
                </div>

                {/* Titre massif */}
                <h1
                    className="font-display font-black leading-none tracking-tighter my-6 lg:my-8"
                    style={{
                        fontSize: "clamp(5rem, 15vw, 14rem)",
                        animation: "var(--animate-fade-in-up)",
                    }}
                >
                    <span className="text-white-soft">mars</span>
                    <span
                        className="text-aurora"
                        style={{
                            textShadow:
                                "0 0 40px rgba(78, 255, 206, 0.4), 0 0 80px rgba(78, 255, 206, 0.15)",
                        }}
                    >
                        AI
                    </span>
                </h1>

                {/* Tagline */}
                <p
                    className="text-lg md:text-xl text-mist max-w-2xl mx-auto mb-8 leading-relaxed"
                    style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0.15s" }}
                >
                    {t("hero.description")}
                </p>

                {/* CTAs */}
                <div
                    className="flex flex-wrap gap-4 justify-center mb-12"
                    style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0.25s" }}
                >
                    {ctaEnabled ? (
                        <Link
                            to="/formulaire"
                            className="inline-flex items-center gap-2 bg-aurora text-deep-sky font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-aurora/90"
                            style={{ boxShadow: "0 0 30px rgba(78, 255, 206, 0.3)" }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                                    "0 0 40px rgba(78, 255, 206, 0.5)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                                    "0 0 30px rgba(78, 255, 206, 0.3)";
                            }}
                        >
                            {t("hero.cta")}
                            <span aria-hidden="true">→</span>
                        </Link>
                    ) : (
                        <div className="relative group">
                            <button
                                disabled
                                className="inline-flex items-center gap-2 bg-surface border border-white/10 text-mist/50 font-bold px-8 py-4 rounded-xl cursor-not-allowed select-none"
                            >
                                {t("hero.cta")}
                                <span aria-hidden="true">→</span>
                            </button>
                            {ctaDisabledReason && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface border border-white/10 text-mist/80 text-xs font-mono px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {ctaDisabledReason}
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Stats row */}
                <div
                    className="flex flex-wrap gap-6 md:gap-10 justify-center items-center"
                    style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0.35s" }}
                >
                    {STATS.map((stat, i) => (
                        <React.Fragment key={stat.label}>
                            {i > 0 && (
                                <span
                                    className="w-1 h-1 rounded-full bg-white/20 hidden sm:block"
                                    aria-hidden="true"
                                />
                            )}
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-aurora font-display text-2xl font-black tabular-nums leading-none">
                                    {stat.value}
                                </span>
                                <span className="text-xs text-mist uppercase tracking-wider">
                                    {stat.label}
                                </span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Countdown — ancré en bas */}
            <div
                className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center pb-8 px-6"
                style={{ animation: "var(--animate-fade-in)", animationDelay: "0.5s" }}
            >
                <FlipCountdown
                    days={days}
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                    label={countdownLabel}
                />
            </div>

            {/* Scroll indicator */}
            <div
                className="absolute bottom-8 right-8 z-10 animate-bounce hidden lg:block"
                aria-hidden="true"
            >
                <svg
                    className="w-6 h-6 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                </svg>
            </div>
        </section>
    );
};

export default HeroSection;
