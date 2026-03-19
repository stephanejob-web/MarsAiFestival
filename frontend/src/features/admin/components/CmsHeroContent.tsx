import React from "react";

const CmsHeroContent = (): React.JSX.Element => {
    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-4 pt-[18px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-lavande/20 bg-lavande/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M2 4h12M2 8h8M2 12h10"
                            stroke="#c084fc"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <div>
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Contenus du Hero
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-mist">
                        Titre, accroche, tags et CTA
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-white/5 px-5 pb-5 pt-1">
                <label className="mb-2 mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
                    Nom du festival
                </label>
                <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                    type="text"
                    defaultValue="marsAI 2026"
                    placeholder="Nom du festival"
                />

                <label className="mb-2 mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
                    Accroche principale
                </label>
                <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                    type="text"
                    defaultValue="Le premier festival mondial du cinéma généré par intelligence artificielle."
                />

                <label className="mb-2 mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
                    Sous-accroche hero
                </label>
                <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                    type="text"
                    defaultValue="Voici ce qu'une IA peut créer. Imaginez ce que vous allez faire."
                />

                <label className="mb-2 mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
                    Tags (4 max)
                </label>
                <div className="mb-1 grid grid-cols-2 gap-2">
                    <input
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-body text-[0.8rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                        type="text"
                        defaultValue="60s chrono"
                    />
                    <input
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-body text-[0.8rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                        type="text"
                        defaultValue="120+ pays"
                    />
                    <input
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-body text-[0.8rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                        type="text"
                        defaultValue="100% gratuit"
                    />
                    <input
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-body text-[0.8rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                        type="text"
                        defaultValue="Prix Marseille"
                    />
                </div>

                <label className="mb-2 mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
                    Texte bouton principal
                </label>
                <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                    type="text"
                    defaultValue="Soumettre un film"
                />

                <button className="mt-[14px] block w-full shrink-0 cursor-pointer rounded-lg border border-aurora/25 bg-aurora/10 px-4.5 py-2 text-center font-display text-[0.8rem] font-extrabold text-aurora transition-all hover:border-aurora/40 hover:bg-aurora/15">
                    Enregistrer les contenus →
                </button>
            </div>
        </div>
    );
};

export default CmsHeroContent;
