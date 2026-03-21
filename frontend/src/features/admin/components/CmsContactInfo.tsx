import React from "react";
import { useCmsContact } from "../hooks/useCmsContact";

const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40";

const Label = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <label className="mb-2 mt-0 block text-[0.65rem] font-bold uppercase tracking-widest text-mist">
        {children}
    </label>
);

const CmsContactInfo = (): React.JSX.Element => {
    const { data, loading, isSaving, saved, handleChange, handleSave } = useCmsContact();

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
                        <Label>Description courte</Label>
                        <textarea
                            className="min-h-[80px] w-full resize-y rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-body text-[0.88rem] leading-[1.6] text-white-soft outline-none transition-colors placeholder:text-mist/50 focus:border-aurora/40"
                            placeholder="Présentation du festival…"
                            value={data.contact_description}
                            onChange={(e) => handleChange("contact_description", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3.5">
                        <div>
                            <Label>Email de contact</Label>
                            <input
                                className={inputClass}
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => handleChange("contact_email", e.target.value)}
                                placeholder="contact@festival.fr"
                            />
                        </div>

                        <div>
                            <Label>Instagram</Label>
                            <input
                                className={inputClass}
                                type="text"
                                value={data.contact_instagram}
                                onChange={(e) => handleChange("contact_instagram", e.target.value)}
                                placeholder="@compte"
                            />
                        </div>

                        <div>
                            <Label>Site web</Label>
                            <input
                                className={inputClass}
                                type="url"
                                value={data.contact_website}
                                onChange={(e) => handleChange("contact_website", e.target.value)}
                                placeholder="https://…"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => void handleSave()}
                    disabled={isSaving}
                    className={`mt-[20px] block w-full cursor-pointer rounded-lg border px-4.5 py-2 text-center font-display text-[0.8rem] font-extrabold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                        saved
                            ? "border-aurora/40 bg-aurora/15 text-aurora"
                            : "border-aurora/25 bg-aurora/10 text-aurora hover:border-aurora/40 hover:bg-aurora/15"
                    }`}
                >
                    {saved
                        ? "✓ Informations enregistrées"
                        : isSaving
                          ? "Enregistrement…"
                          : "Enregistrer les informations →"}
                </button>
            </div>
        </div>
    );
};

export default CmsContactInfo;
