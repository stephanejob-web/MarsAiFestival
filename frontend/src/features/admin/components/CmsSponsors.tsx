import React from "react";

interface SponsorItemProps {
    name: string;
    level: "principal" | "partenaire" | "institutionnel";
    logoSrc: string | null;
}

const SponsorItem = ({ name, level, logoSrc }: SponsorItemProps): React.JSX.Element => {
    return (
        <div className="flex flex-col items-start border-b border-white/5 py-2.5 sm:flex-row sm:items-start sm:gap-2.5 gap-2">
            <div className="flex h-[44px] w-[56px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-[1.5px] border-white/10 bg-white/5 text-center text-[0.6rem] text-mist transition-colors hover:border-solar/40">
                {logoSrc ? (
                    <img src={logoSrc} alt={name} className="h-full w-full object-contain" />
                ) : (
                    "Upload"
                )}
            </div>
            <div className="flex w-full min-w-0 flex-1 flex-col gap-1.5 sm:w-auto">
                <div className="flex flex-wrap items-center gap-1.5">
                    <select
                        className="shrink-0 cursor-pointer rounded-md border border-white/10 bg-white/5 px-2 py-1.5 font-body text-[0.73rem] text-mist outline-none focus:border-aurora/40 [&>option]:bg-horizon"
                        defaultValue={level}
                    >
                        <option value="principal">Principal</option>
                        <option value="partenaire">Partenaire</option>
                        <option value="institutionnel">Institutionnel</option>
                    </select>
                </div>
                <input
                    className="w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-body text-[0.84rem] text-white-soft outline-none transition-colors focus:border-aurora/40 sm:w-auto"
                    type="text"
                    defaultValue={name}
                    placeholder="Nom du partenaire"
                />
            </div>
            <button
                type="button"
                className="shrink-0 cursor-pointer bg-transparent px-0.5 py-1 text-[0.95rem] text-coral/40 transition-colors hover:text-coral"
                title="Supprimer"
            >
                ×
            </button>
        </div>
    );
};

const CmsSponsors = (): React.JSX.Element => {
    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-4 pt-[18px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-solar/20 bg-solar/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M8 2l1.8 3.6L14 6.5l-3 2.9.7 4.1L8 11.4l-3.7 1.95.7-4.1L2 6.5l4.2-.9L8 2z"
                            stroke="#f5e642"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Partenaires & Sponsors
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-mist">
                        Logos et liens — page d'accueil
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-white/5 px-5 pb-5 pt-1">
                <p className="my-3.5 text-[0.77rem] leading-[1.55] text-mist">
                    3 niveaux : <strong className="font-bold text-solar">Principal</strong> ·{" "}
                    <strong className="font-bold text-white-soft">Partenaire</strong> ·
                    Institutionnel.
                    <br />
                    Cliquez sur le logo pour le changer. Laissez vide pour afficher le nom.
                </p>

                <div className="mt-3">
                    <SponsorItem
                        name="OpenAI"
                        level="principal"
                        logoSrc="https://stephanejob-web.github.io/mars-AI/assets/openAi.svg"
                    />
                    <SponsorItem
                        name="Midjourney"
                        level="partenaire"
                        logoSrc="https://stephanejob-web.github.io/mars-AI/assets/logo3.svg"
                    />
                    <SponsorItem name="Ville de Marseille" level="institutionnel" logoSrc={null} />
                </div>

                <button className="mt-3 w-full cursor-pointer rounded-lg border border-dashed border-white/15 bg-white/5 p-2 font-body text-[0.82rem] text-mist transition-all hover:border-solar/30 hover:bg-solar/5 hover:text-solar">
                    + Ajouter un partenaire
                </button>

                <button className="mt-[14px] block w-full shrink-0 cursor-pointer rounded-lg border border-aurora/25 bg-aurora/10 px-4.5 py-2 text-center font-display text-[0.8rem] font-extrabold text-aurora transition-all hover:border-aurora/40 hover:bg-aurora/15">
                    Enregistrer les sponsors →
                </button>
            </div>
        </div>
    );
};

export default CmsSponsors;
