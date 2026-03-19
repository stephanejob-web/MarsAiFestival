import React, { useRef } from "react";

const CmsVideoHero = (): React.JSX.Element => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleVideoClick = (): void => {
        fileInputRef.current?.click();
    };

    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-4 pt-[18px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-aurora/20 bg-aurora/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect
                            x="1"
                            y="3"
                            width="10"
                            height="10"
                            rx="2"
                            stroke="#4effce"
                            strokeWidth="1.5"
                        />
                        <path d="M11 6.5l4-2.5v8l-4-2.5V6.5z" fill="#4effce" />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Vidéo Hero
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-mist">
                        Fond animé affiché en plein écran sur la page d'accueil
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 rounded-full border border-aurora/20 bg-aurora/5 px-2.5 py-1 font-mono text-[0.68rem] text-aurora">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <circle
                            cx="5"
                            cy="5"
                            r="4"
                            fill="rgba(78,255,206,0.2)"
                            stroke="#4effce"
                            strokeWidth="1"
                        />
                    </svg>
                    MarsAI_Hero.mp4 · Actuelle
                </div>
            </div>

            {/* Video Stage */}
            <div className="relative aspect-16/7 w-full overflow-hidden bg-black">
                <video
                    src="/assets/hero-marsai.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-100"
                ></video>
                <div className="absolute right-3.5 top-3.5 z-10 flex gap-2">
                    <button
                        className="flex items-center gap-1.5 rounded-lg border border-aurora/40 bg-aurora/20 px-3.5 py-1.5 font-display text-[0.75rem] font-bold text-aurora backdrop-blur-md transition-all hover:bg-aurora/30"
                        onClick={handleVideoClick}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M7 1v8M4 4l3-3 3 3"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M1 10v1a2 2 0 002 2h8a2 2 0 002-2v-1"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                            />
                        </svg>
                        Changer la vidéo
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-[#050818]/60 px-3.5 py-1.5 font-display text-[0.75rem] font-bold text-white-soft backdrop-blur-md transition-all hover:border-white/35 hover:bg-[#050818]/80">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Plein écran
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="video/mp4,video/quicktime"
                        className="hidden"
                        onChange={() => {}}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-3.5 border-t border-white/5 px-5 py-3.5">
                <div className="flex shrink-0 gap-5">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-mist">
                            Format
                        </span>
                        <span className="font-mono text-[0.72rem] text-white-soft">
                            MP4 · H.264
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-mist">
                            Résolution
                        </span>
                        <span className="font-mono text-[0.72rem] text-white-soft">
                            1920 × 1080
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-mist">
                            Taille max
                        </span>
                        <span className="font-mono text-[0.72rem] text-white-soft">200 Mo</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-mist">
                            Fallback
                        </span>
                        <span className="font-mono text-[0.72rem] text-white-soft">
                            .mov accepté
                        </span>
                    </div>
                </div>

                <div
                    className="flex flex-1 min-w-[180px] cursor-pointer items-center gap-2 rounded-lg border-[1.5px] border-dashed border-aurora/20 px-3.5 py-2.5 text-[0.75rem] text-mist transition-all hover:bg-aurora/5 hover:border-aurora/40 hover:text-aurora"
                    onClick={handleVideoClick}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M10 3v10M7 6l3-3 3 3"
                            stroke="rgba(78,255,206,0.7)"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M3 14v1.5A1.5 1.5 0 004.5 17h11a1.5 1.5 0 001.5-1.5V14"
                            stroke="rgba(78,255,206,0.5)"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span>Glisser un fichier MP4 ou MOV ici</span>
                </div>

                <button className="mt-3.5 block w-full shrink-0 cursor-pointer rounded-lg border border-aurora/25 bg-aurora/10 px-4 py-2.5 text-center font-display text-[0.8rem] font-extrabold text-aurora transition-all hover:border-aurora/40 hover:bg-aurora/20 sm:mt-0 sm:w-auto">
                    Enregistrer la vidéo →
                </button>
            </div>
        </div>
    );
};

export default CmsVideoHero;
