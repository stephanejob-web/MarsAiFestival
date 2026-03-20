import React from "react";

const CmsContactInfo = (): React.JSX.Element => {
    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-4 pt-[18px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-blue-400/20 bg-blue-400/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6.5" stroke="#60a5fa" strokeWidth="1.4" />
                        <path
                            d="M8 7.5V11M8 5.5v.5"
                            stroke="#60a5fa"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <div>
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Informations & Contact
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-mist">
                        Description, email, réseaux sociaux
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-white/5 px-5 pb-5 pt-1">
                <div className="grid grid-cols-1 gap-5 pt-3.5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 mt-0 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
                            Description courte
                        </label>
                        <textarea
                            className="min-h-[80px] w-full resize-y rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] leading-[1.6] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40 h-full"
                            placeholder="Présentation du festival…"
                            defaultValue="Marseille accueille la première édition de marsAI, festival international dédié aux films créés par ou avec l'intelligence artificielle."
                        ></textarea>
                    </div>

                    <div>
                        <label className="mb-2 mt-0 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
                            Email de contact
                        </label>
                        <input
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40 mb-[14px]"
                            type="email"
                            defaultValue="contact@marsai.fr"
                            placeholder="contact@festival.fr"
                        />

                        <label className="mb-2 mt-0 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
                            Instagram
                        </label>
                        <input
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40 mb-[14px]"
                            type="text"
                            defaultValue="@marsai.festival"
                            placeholder="@compte"
                        />

                        <label className="mb-2 mt-0 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
                            Site web
                        </label>
                        <input
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                            type="url"
                            defaultValue="https://marsai.fr"
                            placeholder="https://…"
                        />
                    </div>
                </div>

                <button className="mt-[20px] block w-full shrink-0 cursor-pointer rounded-lg border border-aurora/25 bg-aurora/10 px-4.5 py-2 text-center font-display text-[0.8rem] font-extrabold text-aurora transition-all hover:border-aurora/40 hover:bg-aurora/15">
                    Enregistrer les informations →
                </button>
            </div>
        </div>
    );
};

export default CmsContactInfo;
