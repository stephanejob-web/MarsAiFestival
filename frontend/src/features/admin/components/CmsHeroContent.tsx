import React from "react";
import { useCmsHero } from "../hooks/useCmsHero";

const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40";

const Label = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <label className="mb-2 mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
        {children}
    </label>
);

const CmsHeroContent = (): React.JSX.Element => {
    const { data, loading, isSaving, saved, handleChange, handleSave } = useCmsHero();

    if (loading) {
        return (
            <div className="mb-4 flex items-center justify-center rounded-2xl border border-white/5 bg-surface-2 py-10">
                <svg className="h-5 w-5 animate-spin text-mist/40" viewBox="0 0 24 24" fill="none">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            </div>
        );
    }

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
                <Label>Nom du festival</Label>
                <input
                    className={inputClass}
                    type="text"
                    value={data.hero_label}
                    onChange={(e) => handleChange("hero_label", e.target.value)}
                    placeholder="Ex: marsAI 2026"
                />

                <Label>Accroche principale</Label>
                <input
                    className={inputClass}
                    type="text"
                    value={data.hero_title}
                    onChange={(e) => handleChange("hero_title", e.target.value)}
                    placeholder="Tagline du festival…"
                />

                <Label>Sous-accroche hero</Label>
                <input
                    className={inputClass}
                    type="text"
                    value={data.hero_description}
                    onChange={(e) => handleChange("hero_description", e.target.value)}
                    placeholder="Sous-titre affiché sous l'accroche…"
                />

                <Label>Tags (4 max)</Label>
                <div className="mb-1 grid grid-cols-2 gap-2">
                    {(["hero_tag1", "hero_tag2", "hero_tag3", "hero_tag4"] as const).map(
                        (field, i) => (
                            <input
                                key={field}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-body text-[0.8rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                                type="text"
                                value={data[field]}
                                onChange={(e) => handleChange(field, e.target.value)}
                                placeholder={`Tag ${i + 1}`}
                            />
                        ),
                    )}
                </div>

                <Label>Texte bouton principal (CTA)</Label>
                <input
                    className={inputClass}
                    type="text"
                    value={data.hero_content}
                    onChange={(e) => handleChange("hero_content", e.target.value)}
                    placeholder="Ex: Soumettre un film"
                />

                <button
                    onClick={() => void handleSave()}
                    disabled={isSaving}
                    className={`mt-[14px] block w-full cursor-pointer rounded-lg border px-4.5 py-2 text-center font-display text-[0.8rem] font-extrabold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                        saved
                            ? "border-aurora/40 bg-aurora/15 text-aurora"
                            : "border-aurora/25 bg-aurora/10 text-aurora hover:border-aurora/40 hover:bg-aurora/15"
                    }`}
                >
                    {saved
                        ? "Contenus enregistrés"
                        : isSaving
                          ? "Enregistrement…"
                          : "Enregistrer les contenus"}
                </button>
            </div>
        </div>
    );
};

export default CmsHeroContent;
