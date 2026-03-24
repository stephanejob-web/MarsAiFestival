import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FormDepotData, FormDepotErrors, SelectOption } from "../types";
import { COUNTRIES, DISCOVERY_OPTIONS } from "../constants";
import { getInputClass } from "./formUtils";
import { FormFieldError } from "./formHelpers";

interface Step1ProfileProps {
    formData: FormDepotData;
    errors: FormDepotErrors;
    onChange: (field: keyof FormDepotData, value: string | boolean) => void;
    onNext: () => boolean;
    validateAge: (dob: string) => boolean;
}

const Step1Profile = ({
    formData,
    errors,
    onChange,
    onNext,
    validateAge,
}: Step1ProfileProps): React.JSX.Element => {
    const { t } = useTranslation();
    const [showValidationHint, setShowValidationHint] = useState(false);

    const countryOptions = COUNTRIES.map((c) => ({
        ...c,
        label: t(`form.countries.${c.value}`, c.label),
    }));
    const discoveryOptions = DISCOVERY_OPTIONS.map((o) => ({
        ...o,
        label: t(`form.discovery.${o.value}`, o.label),
    }));

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ): void => {
        onChange(e.target.name as keyof FormDepotData, e.target.value);
        setShowValidationHint(false);
    };

    const handleNextClick = (): void => {
        const success = onNext();
        if (!success) {
            setShowValidationHint(true);
            requestAnimationFrame(() => {
                const firstError = document.querySelector('[class*="text-coral"]');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });
        }
    };

    const handleDobBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        if (e.target.value && !validateAge(e.target.value)) {
            onChange("dob", e.target.value);
        }
    };

    const dobMax = (): string => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d.toISOString().split("T")[0];
    };

    const inputClass = (field: string): string => getInputClass(field, errors);

    const selectClass = (field: string): string => {
        return `${inputClass(field)} cursor-pointer [&>option]:bg-horizon`;
    };

    const renderError = (field: string): React.JSX.Element | null => (
        <FormFieldError errors={errors} field={field} />
    );

    const renderSelect = (
        name: string,
        placeholder: string,
        options: SelectOption[],
    ): React.JSX.Element => {
        return (
            <select
                name={name}
                value={formData[name as keyof FormDepotData] as string}
                onChange={handleInput}
                className={selectClass(name)}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        );
    };

    return (
        <div className="form-animate-in">
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-white/5">
                <div className="w-11 h-11 rounded-xl bg-aurora/10 flex items-center justify-center text-xl shrink-0">
                    👤
                </div>
                <div>
                    <h2 className="font-display text-xl font-extrabold">{t("form.step1.title")}</h2>
                    <p className="text-sm text-mist mt-0.5">{t("form.step1.subtitle")}</p>
                </div>
            </div>

            {/* Civilité */}
            <div className="mb-5">
                <label className="text-xs font-bold uppercase tracking-wide text-mist flex items-center gap-1.5 mb-2">
                    {t("form.step1.civilite")}{" "}
                    <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                </label>
                <div className="flex gap-2.5">
                    <label className="radio-card flex items-center gap-2 px-4 py-2.5 bg-white/4 border-[1.5px] border-white/10 rounded-[10px] cursor-pointer text-sm text-mist transition-all select-none">
                        <input
                            type="radio"
                            name="civilite"
                            value="M"
                            checked={formData.civilite === "M"}
                            onChange={handleInput}
                        />
                        <span className="radio-card-dot" />
                        M.
                    </label>
                    <label className="radio-card flex items-center gap-2 px-4 py-2.5 bg-white/4 border-[1.5px] border-white/10 rounded-[10px] cursor-pointer text-sm text-mist transition-all select-none">
                        <input
                            type="radio"
                            name="civilite"
                            value="Mme"
                            checked={formData.civilite === "Mme"}
                            onChange={handleInput}
                        />
                        <span className="radio-card-dot" />
                        Mme
                    </label>
                </div>
            </div>

            {/* Grille identité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prénom */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.prenom")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInput}
                        placeholder="Marie"
                        autoComplete="given-name"
                        className={inputClass("prenom")}
                    />
                    {renderError("prenom")}
                </div>

                {/* Nom */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.nom")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInput}
                        placeholder="Fontaine"
                        autoComplete="family-name"
                        className={inputClass("nom")}
                    />
                    {renderError("nom")}
                </div>

                {/* Date de naissance */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.dob")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInput}
                        onBlur={handleDobBlur}
                        max={dobMax()}
                        autoComplete="bday"
                        className={inputClass("dob")}
                    />
                    <div className="text-xs text-mist/70">{t("form.step1.dobHint")}</div>
                    {renderError("dob")}
                </div>

                {/* Métier */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.metier")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="text"
                        name="metier"
                        value={formData.metier}
                        onChange={handleInput}
                        placeholder={t("form.step1.metierPlaceholder")}
                        autoComplete="organization-title"
                        className={inputClass("metier")}
                    />
                    {renderError("metier")}
                </div>

                {/* Email — span 2 colonnes */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.email")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInput}
                        placeholder={t("form.step1.emailPlaceholder")}
                        autoComplete="email"
                        className={inputClass("email")}
                    />
                    <div className="text-xs text-mist/70">{t("form.step1.emailHint")}</div>
                    {renderError("email")}
                </div>

                {/* Téléphone */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.tel")}{" "}
                        <span className="text-mist text-[0.65rem] font-normal normal-case opacity-70">
                            {t("form.optional")}
                        </span>
                    </label>
                    <input
                        type="tel"
                        name="tel"
                        value={formData.tel}
                        onChange={handleInput}
                        placeholder="+33 1 00 00 00 00"
                        autoComplete="tel-national"
                        className={inputClass("tel")}
                    />
                    {renderError("tel")}
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.mobile")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInput}
                        placeholder="+33 6 00 00 00 00"
                        autoComplete="tel"
                        className={inputClass("mobile")}
                    />
                    {renderError("mobile")}
                </div>
            </div>

            {/* Séparateur — Adresse */}
            <hr className="border-white/5 my-6" />
            <div className="text-xs font-bold uppercase tracking-widest text-mist mb-4">
                {t("form.step1.addressSection")}
            </div>

            <div className="grid gap-4 mb-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.rue")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="text"
                        name="rue"
                        value={formData.rue}
                        onChange={handleInput}
                        placeholder={t("form.step1.ruePlaceholder")}
                        autoComplete="street-address"
                        className={inputClass("rue")}
                    />
                    {renderError("rue")}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.cp")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="text"
                        name="cp"
                        value={formData.cp}
                        onChange={handleInput}
                        placeholder="13001"
                        autoComplete="postal-code"
                        maxLength={10}
                        className={inputClass("cp")}
                    />
                    {renderError("cp")}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.ville")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="text"
                        name="ville"
                        value={formData.ville}
                        onChange={handleInput}
                        placeholder="Marseille"
                        autoComplete="address-level2"
                        className={inputClass("ville")}
                    />
                    {renderError("ville")}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.pays")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    {renderSelect("pays", t("form.step1.countryPlaceholder"), countryOptions)}
                    {renderError("pays")}
                </div>
            </div>

            {/* Séparateur — Réseaux sociaux */}
            <hr className="border-white/5 my-6" />
            <div className="text-xs font-bold uppercase tracking-widest text-mist mb-4">
                {t("form.step1.socialSection")}{" "}
                <span className="font-normal normal-case tracking-normal text-[0.7rem] text-mist/60">
                    {t("form.step1.socialHint")}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                    { name: "youtube", icon: "▶", placeholder: "YouTube — @chaîne ou URL" },
                    { name: "instagram", icon: "📸", placeholder: "Instagram — @votre_compte" },
                    { name: "linkedin", icon: "in", placeholder: "LinkedIn — profil ou URL" },
                    { name: "facebook", icon: "f", placeholder: "Facebook — page ou URL" },
                    { name: "xtwitter", icon: "𝕏", placeholder: "X / Twitter — @votre_compte" },
                ].map((social) => (
                    <div key={social.name} className="relative">
                        <span className="social-icon-wrap">{social.icon}</span>
                        <input
                            type="text"
                            name={social.name}
                            value={formData[social.name as keyof FormDepotData] as string}
                            onChange={handleInput}
                            placeholder={social.placeholder}
                            className={`w-full bg-white/4 border-[1.5px] rounded-[10px] py-2.5 pr-3.5 pl-8 font-body text-sm text-white-soft outline-none transition-colors focus:border-aurora/40 placeholder:text-mist/45 ${errors[social.name] ? "border-coral/50" : "border-white/9"}`}
                        />
                        {renderError(social.name)}
                    </div>
                ))}
            </div>

            {/* Séparateur — Autre */}
            <hr className="border-white/5 my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        {t("form.step1.discoveryLabel")}{" "}
                        <span className="text-mist text-[0.65rem] font-normal normal-case opacity-70">
                            {t("form.optional")}
                        </span>
                    </label>
                    {renderSelect("discovery", t("form.selectPlaceholder"), discoveryOptions)}
                </div>
            </div>

            {/* Newsletter */}
            <div
                className={`flex gap-3.5 items-start p-3.5 bg-white/3 border-[1.5px] border-white/7 rounded-[10px] cursor-pointer transition-all select-none ${formData.newsletter ? "newsletter-checked bg-aurora/5 border-aurora/25" : ""}`}
                onClick={() => onChange("newsletter", !formData.newsletter)}
                role="checkbox"
                aria-checked={formData.newsletter}
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onChange("newsletter", !formData.newsletter);
                    }
                }}
            >
                <div className="newsletter-box" />
                <div>
                    <div className="text-sm font-semibold mb-0.5">
                        {t("form.step1.newsletterTitle")}{" "}
                        <span className="text-mist text-[0.65rem] font-normal opacity-70">
                            {t("form.optional")}
                        </span>
                    </div>
                    <div className="text-xs text-mist leading-relaxed">
                        {t("form.step1.newsletterDesc")}
                    </div>
                </div>
            </div>

            {/* Boutons navigation */}
            <div className="flex flex-col items-end gap-3 mt-8 pt-6 border-t border-white/5">
                {showValidationHint && Object.keys(errors).length > 0 && (
                    <div className="w-full text-sm text-coral bg-coral/8 border border-coral/20 rounded-[10px] px-4 py-2.5 flex items-center gap-2">
                        <span>⚠</span>
                        <span>{t("form.validation.errorsHint")}</span>
                    </div>
                )}
                <div className="flex items-center justify-between w-full">
                    <div />
                    <button
                        type="button"
                        onClick={handleNextClick}
                        className="bg-aurora border-none rounded-[10px] px-8 py-3 font-display text-sm font-extrabold text-deep-sky cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(78,255,206,0.35)] flex items-center gap-2"
                    >
                        {t("form.step1.cta")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step1Profile;
