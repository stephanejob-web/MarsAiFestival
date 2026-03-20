import React from "react";

interface JuryItemProps {
    name: string;
    role: string;
    photoSrc: string | null;
    isStar?: boolean;
}

const JuryItem = ({ name, role, photoSrc, isStar = false }: JuryItemProps): React.JSX.Element => {
    return (
        <div className="flex flex-col items-start border-b border-white/5 py-2.5 sm:flex-row sm:items-center sm:gap-2.5 gap-2">
            {photoSrc ? (
                <img
                    src={photoSrc}
                    alt={name}
                    className="h-[64px] w-[52px] shrink-0 cursor-pointer rounded-[10px] border-[1.5px] border-white/10 object-cover transition-all hover:border-aurora/45 hover:shadow-[0_0_12px_rgba(78,255,206,0.15)] sm:h-[64px] sm:w-[52px]"
                />
            ) : (
                <div className="flex h-[64px] w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-white/10 bg-white/5 object-cover transition-all hover:border-aurora/45 hover:shadow-[0_0_12px_rgba(78,255,206,0.15)] sm:h-[64px] sm:w-[52px]">
                    <span className="text-xs text-mist">Photo</span>
                </div>
            )}
            <div className="flex w-full min-w-0 flex-1 flex-col gap-1.5 sm:w-auto">
                <div className="flex flex-wrap items-center gap-1.5">
                    <input
                        className="w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-body text-[0.84rem] text-white-soft outline-none transition-colors focus:border-aurora/40 sm:w-auto sm:flex-1"
                        type="text"
                        defaultValue={name}
                    />
                    {isStar && <span className="shrink-0 text-[0.75rem] opacity-70">⭐</span>}
                </div>
                <input
                    className="w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-body text-[0.75rem] text-mist outline-none transition-colors focus:border-aurora/40 sm:w-auto"
                    type="text"
                    defaultValue={role}
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

const CmsJury = (): React.JSX.Element => {
    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-4 pt-[18px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-aurora/20 bg-aurora/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="6" cy="5" r="2.5" stroke="#4effce" strokeWidth="1.4" />
                        <path
                            d="M1.5 14c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5"
                            stroke="#4effce"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                        />
                        <circle cx="12" cy="5" r="2" stroke="#4effce" strokeWidth="1.3" />
                        <path
                            d="M14.5 14c0-1.933-1.343-3.5-3-3.5"
                            stroke="#4effce"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Jury · Page d'accueil
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-mist">
                        Membres visibles publiquement
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-white/5 px-5 pb-5 pt-1">
                <p className="my-3.5 text-[0.77rem] leading-[1.55] text-mist">
                    <strong className="text-white-soft font-bold">
                        Premier membre = carte vedette
                    </strong>{" "}
                    (Présidence du jury).
                    <br />
                    Modifiez nom, rôle, photo · Activez/désactivez la visibilité.
                </p>

                <div className="mt-3">
                    <JuryItem
                        name="Justine Triet"
                        role="Présidente du jury · Réalisatrice"
                        photoSrc="https://stephanejob-web.github.io/mars-AI/assets/j2.jpg"
                        isStar={true}
                    />
                    <JuryItem
                        name="David Fincher"
                        role="Réalisateur & Producteur"
                        photoSrc="https://stephanejob-web.github.io/mars-AI/assets/j4.jpg"
                    />
                    <JuryItem
                        name="Cédric Jimenez"
                        role="Réalisateur & Scénariste"
                        photoSrc="https://stephanejob-web.github.io/mars-AI/assets/j3.jpg"
                    />
                </div>

                <button className="mt-3 w-full cursor-pointer rounded-lg border border-dashed border-white/15 bg-white/5 p-2 font-body text-[0.82rem] text-mist transition-all hover:border-aurora/30 hover:bg-aurora/5 hover:text-aurora">
                    + Ajouter un membre
                </button>

                <button className="mt-[14px] block w-full shrink-0 cursor-pointer rounded-lg border border-aurora/25 bg-aurora/10 px-4.5 py-2 text-center font-display text-[0.8rem] font-extrabold text-aurora transition-all hover:border-aurora/40 hover:bg-aurora/15">
                    Enregistrer le jury →
                </button>
            </div>
        </div>
    );
};

export default CmsJury;
