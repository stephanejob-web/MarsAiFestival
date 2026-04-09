import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import visageImg from "../../../assets/visage-couleur.jpg";
import Reveal from "../../../components/Reveal";

const TOOLS: string[] = ["Sora", "Runway", "Kling", "Pika", "Stable Video", "ComfyUI"];

const ManifesteSection = (): React.JSX.Element => {
    const { t } = useTranslation();
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const line = lineRef.current;
        if (!line) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    line.dataset.visible = "true";
                    observer.unobserve(line);
                }
            },
            { threshold: 0.05 },
        );
        observer.observe(line);
        return () => observer.disconnect();
    }, []);

    const line4Full = t("manifeste.line4");
    const line4Highlight = t("manifeste.line4_highlight");
    const [before, after] = line4Full.split(line4Highlight);

    const line3Full = t("manifeste.line3");
    const line3AI = "L'IA générative";
    const line3EN = "Generative AI";
    const line3Marker = line3Full.includes(line3AI) ? line3AI : line3EN;
    const [, line3After] = line3Full.split(line3Marker);

    return (
        <section className="relative py-32 px-6 overflow-hidden">
            {/* Image background — côté droit, masque progressif */}
            <img
                src={visageImg}
                alt=""
                aria-hidden="true"
                className="absolute right-0 top-0 h-full w-[60%] object-cover object-left"
                style={{
                    opacity: 0.12,
                    maskImage: "linear-gradient(to left, black 0%, transparent 60%)",
                    WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 60%)",
                }}
            />

            {/* Gradient de fond — lisibilité */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-deep-sky via-deep-sky/98 to-deep-sky/60 pointer-events-none"
                aria-hidden="true"
            />

            {/* Watermark année */}
            <div
                className="absolute -left-4 top-1/2 -translate-y-1/2 font-display font-black leading-none select-none pointer-events-none"
                style={{
                    fontSize: "clamp(8rem, 28vw, 22rem)",
                    color: "rgba(255,255,255,0.018)",
                    letterSpacing: "-0.04em",
                }}
                aria-hidden="true"
            >
                1895
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Overline */}
                <div className="font-mono text-xs text-aurora/40 uppercase tracking-[0.25em] mb-16 flex items-center gap-3">
                    <span className="w-8 h-px bg-aurora/30 inline-block" />
                    Manifeste
                </div>

                {/* Timeline */}
                <div className="relative pl-12 sm:pl-10">
                    {/* Ligne qui se dessine au scroll */}
                    <div ref={lineRef} className="timeline-draw" data-visible="false" />

                    {/* Acte I — Contexte */}
                    <Reveal variant="up">
                        <div className="mb-14 relative">
                            <div className="absolute -left-[42px] top-0.5 w-4 h-4 rounded-full bg-deep-sky border-2 border-mist/20 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-mist/30" />
                            </div>
                            <p className="font-mono text-[10px] text-mist/30 uppercase tracking-[0.2em] mb-5">
                                01 — Contexte
                            </p>
                            <p className="text-xl text-mist/60 leading-relaxed mb-2">
                                {t("manifeste.line1")}
                            </p>
                            <p className="text-xl text-mist/60 leading-relaxed">
                                {t("manifeste.line2")}
                            </p>
                        </div>
                    </Reveal>

                    {/* Acte II — Rupture */}
                    <Reveal variant="up" delay={100}>
                        <div className="mb-14 relative">
                            <div
                                className="absolute -left-[42px] top-0.5 w-4 h-4 rounded-full bg-deep-sky border-2 border-aurora/60 flex items-center justify-center"
                                style={{ boxShadow: "0 0 12px rgba(78,255,206,0.35)" }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-aurora" />
                            </div>
                            <p className="font-mono text-[10px] text-aurora/40 uppercase tracking-[0.2em] mb-5">
                                02 — Rupture
                            </p>
                            <h2
                                className="font-display font-black leading-[1.05] tracking-tight"
                                style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)" }}
                            >
                                <span className="text-aurora block">{line3Marker}</span>
                                <span className="text-white-soft block">{line3After.trim()}</span>
                            </h2>
                        </div>
                    </Reveal>

                    {/* Acte III — La Question */}
                    <Reveal variant="up" delay={200}>
                        <div className="relative">
                            <div className="absolute -left-[42px] top-0.5 w-4 h-4 rounded-full bg-deep-sky border-2 border-solar/50 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-solar/80" />
                            </div>
                            <p className="font-mono text-[10px] text-solar/40 uppercase tracking-[0.2em] mb-5">
                                03 — La Question
                            </p>

                            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10">
                                {before}
                                <span className="text-solar font-semibold">{line4Highlight}</span>
                                {after}
                            </p>

                            {/* Pull quote */}
                            <div
                                className="rounded-2xl p-8 md:p-10 mb-4"
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                <p className="text-mist/70 text-base leading-relaxed mb-6">
                                    {t("manifeste.body")}
                                </p>
                                <p
                                    className="font-display font-black text-white-soft leading-[1.15] tracking-tight"
                                    style={{ fontSize: "clamp(1.6rem, 3.8vw, 3rem)" }}
                                >
                                    {t("manifeste.question")}
                                </p>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Tools */}
                <Reveal variant="up" delay={100}>
                    <div className="mt-14 pl-12 sm:pl-10">
                        <p className="font-mono text-[10px] text-aurora/30 uppercase tracking-[0.2em] mb-4">
                            Créez avec
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {TOOLS.map((tool) => (
                                <span
                                    key={tool}
                                    className="font-mono text-sm text-white/50 hover:text-white/90 border border-white/8 hover:border-aurora/30 rounded-full px-4 py-1.5 transition-colors duration-200 cursor-default"
                                    style={{ background: "rgba(255,255,255,0.025)" }}
                                >
                                    {tool}
                                </span>
                            ))}
                            <span
                                className="font-mono text-sm text-aurora/60 hover:text-aurora border border-aurora/15 hover:border-aurora/40 rounded-full px-4 py-1.5 transition-colors duration-200 cursor-default"
                                style={{ background: "rgba(78,255,206,0.03)" }}
                            >
                                {t("manifeste.toolsOther")}
                            </span>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default ManifesteSection;
