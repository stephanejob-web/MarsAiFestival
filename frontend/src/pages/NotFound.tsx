import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const STARS = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
}));

const NotFound = (): React.JSX.Element => {
    const glitchRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = glitchRef.current;
        if (!el) return;

        let frame: number;
        let lastGlitch = 0;

        const glitch = (ts: number) => {
            if (ts - lastGlitch > 3000 + Math.random() * 2000) {
                lastGlitch = ts;
                el.setAttribute("data-glitch", "true");
                setTimeout(() => el.removeAttribute("data-glitch"), 300);
            }
            frame = requestAnimationFrame(glitch);
        };

        frame = requestAnimationFrame(glitch);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0f2e] px-6 text-center">
            {/* Stars */}
            {STARS.map((s) => (
                <span
                    key={s.id}
                    className="pointer-events-none absolute rounded-full bg-white"
                    style={{
                        top: `${s.top}%`,
                        left: `${s.left}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        opacity: 0.6,
                        animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite alternate`,
                    }}
                />
            ))}

            {/* Aurora blobs */}
            <div
                className="aurora-1 pointer-events-none absolute top-[-20%] left-[-10%] h-[60vw] w-[60vw] max-w-[700px] rounded-full opacity-20 blur-[80px]"
                style={{ background: "radial-gradient(circle, #4effce, transparent 70%)" }}
            />
            <div
                className="aurora-2 pointer-events-none absolute right-[-15%] bottom-[-15%] h-[50vw] w-[50vw] max-w-[600px] rounded-full opacity-15 blur-[80px]"
                style={{ background: "radial-gradient(circle, #c084fc, transparent 70%)" }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Glitch 404 */}
                <div className="relative select-none" style={{ fontFamily: "var(--font-display)" }}>
                    <span
                        ref={glitchRef}
                        className="notfound-glitch block text-[clamp(7rem,20vw,14rem)] leading-none font-black tracking-tighter text-transparent"
                        style={{
                            WebkitTextStroke: "2px #4effce",
                            textShadow: "0 0 40px rgba(78,255,206,0.3)",
                        }}
                        data-text="404"
                    >
                        404
                    </span>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-3">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#4effce]" />
                    <span className="font-mono text-xs tracking-[0.3em] text-[#4effce] uppercase opacity-80">
                        signal perdu
                    </span>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#4effce]" />
                </div>

                {/* Message */}
                <div className="flex max-w-md flex-col gap-3">
                    <h1
                        className="text-2xl font-bold text-[#f0f4ff] md:text-3xl"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        Cette page s'est perdue dans l'espace
                    </h1>
                    <p className="text-sm leading-relaxed text-[#8892b0] md:text-base">
                        La page que vous cherchez n'existe pas ou a été déplacée vers une autre
                        orbite.
                    </p>
                </div>

                {/* CTA */}
                <Link
                    to="/"
                    className="group relative mt-2 inline-flex items-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-bold text-[#0a0f2e] transition-transform duration-200 hover:scale-105"
                    style={{
                        background: "linear-gradient(135deg, #4effce, #c084fc)",
                        boxShadow: "0 0 24px rgba(78,255,206,0.25)",
                    }}
                >
                    <svg
                        className="transition-transform duration-300 group-hover:-translate-x-1"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                    >
                        <path
                            d="M10 12L6 8L10 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Retour à l'accueil
                </Link>

                {/* Floating rocket */}
                <div
                    className="mt-4 text-5xl"
                    style={{ animation: "float 4s ease-in-out infinite" }}
                    aria-hidden="true"
                >
                    🚀
                </div>
            </div>

            <style>{`
                @keyframes twinkle {
                    from { opacity: 0.2; transform: scale(1); }
                    to   { opacity: 0.9; transform: scale(1.4); }
                }

                .notfound-glitch::before,
                .notfound-glitch::after {
                    content: attr(data-text);
                    position: absolute;
                    inset: 0;
                    font-family: inherit;
                    font-size: inherit;
                    font-weight: inherit;
                    letter-spacing: inherit;
                    -webkit-text-stroke: 2px transparent;
                    opacity: 0;
                    pointer-events: none;
                }

                .notfound-glitch[data-glitch]::before {
                    opacity: 0.8;
                    color: #ff6b6b;
                    -webkit-text-stroke: 0;
                    clip-path: inset(0 0 60% 0);
                    transform: translate(-4px, -2px);
                    animation: glitch-slice 0.3s steps(2) forwards;
                }

                .notfound-glitch[data-glitch]::after {
                    opacity: 0.8;
                    color: #4effce;
                    -webkit-text-stroke: 0;
                    clip-path: inset(55% 0 0 0);
                    transform: translate(4px, 2px);
                    animation: glitch-slice 0.3s steps(2) forwards;
                }

                @keyframes glitch-slice {
                    0%   { opacity: 0.8; }
                    50%  { opacity: 0.4; transform: translate(6px, 0); }
                    100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default NotFound;
