import type React from "react";
import FormField from "../../../../components/ui/FormField";
import {
    DECOUVERTE_OPTIONS,
    INPUT_CLASS,
    INPUT_CLASS_ERROR,
    PAYS_OPTIONS,
    SELECT_CLASS,
    SOCIAL_INPUT_CLASS,
} from "../../../../constants/depot";
import type { DepotErrors, Step1Data } from "../../types";

interface Step1ProfilProps {
    data: Step1Data;
    errors: DepotErrors;
    onChange: (field: keyof Step1Data, value: string | boolean) => void;
}

const SOCIAL_FIELDS: {
    field: keyof Step1Data;
    icon: string;
    placeholder: string;
}[] = [
    { field: "youtube", icon: "▶", placeholder: "YouTube — @chaîne ou URL" },
    { field: "instagram", icon: "📸", placeholder: "Instagram — @votre_compte" },
    { field: "linkedin", icon: "in", placeholder: "LinkedIn — profil ou URL" },
    { field: "facebook", icon: "f", placeholder: "Facebook — page ou URL" },
    { field: "twitter", icon: "𝕏", placeholder: "X / Twitter — @votre_compte" },
];

const Step1Profil = ({ data, errors, onChange }: Step1ProfilProps): React.JSX.Element => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-2xl flex-shrink-0">
                    👤
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Profil réalisateur</h2>
                    <p className="text-sm text-slate-500">
                        Informations d&apos;identité et de contact — conservées 3 ans (RGPD)
                    </p>
                </div>
            </div>

            {/* Civilité */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Civilité <span className="text-cyan-400">*</span>
                </span>
                <div className="flex gap-3">
                    {(["M.", "Mme"] as const).map((val) => (
                        <label
                            key={val}
                            className={`flex items-center gap-2.5 cursor-pointer px-5 py-3 rounded-xl border transition-colors ${
                                data.civilite === val
                                    ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
                                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                            }`}
                        >
                            <input
                                type="radio"
                                name="civilite"
                                value={val}
                                checked={data.civilite === val}
                                onChange={() => onChange("civilite", val)}
                                className="sr-only"
                            />
                            <span
                                className={`w-3 h-3 rounded-full border flex-shrink-0 transition-colors ${
                                    data.civilite === val
                                        ? "border-cyan-400 bg-cyan-400"
                                        : "border-white/30"
                                }`}
                            />
                            <span className="text-sm font-medium">{val}</span>
                        </label>
                    ))}
                </div>
                {errors.civilite && (
                    <p role="alert" className="text-xs text-red-400">
                        {errors.civilite}
                    </p>
                )}
            </div>

            {/* Prénom + Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Prénom" required error={errors.prenom}>
                    <input
                        type="text"
                        value={data.prenom}
                        onChange={(e) => onChange("prenom", e.target.value)}
                        placeholder="Marie"
                        autoComplete="given-name"
                        className={errors.prenom ? INPUT_CLASS_ERROR : INPUT_CLASS}
                    />
                </FormField>
                <FormField label="Nom" required error={errors.nom}>
                    <input
                        type="text"
                        value={data.nom}
                        onChange={(e) => onChange("nom", e.target.value)}
                        placeholder="Fontaine"
                        autoComplete="family-name"
                        className={errors.nom ? INPUT_CLASS_ERROR : INPUT_CLASS}
                    />
                </FormField>
            </div>

            {/* Date de naissance + Métier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Date de naissance" required error={errors.dateNaissance}>
                    <input
                        type="date"
                        value={data.dateNaissance}
                        onChange={(e) => onChange("dateNaissance", e.target.value)}
                        autoComplete="bday"
                        className={errors.dateNaissance ? INPUT_CLASS_ERROR : INPUT_CLASS}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Vous devez avoir au moins 18 ans pour candidater
                    </p>
                </FormField>
                <FormField label="Métier actuel" required error={errors.metier}>
                    <input
                        type="text"
                        value={data.metier}
                        onChange={(e) => onChange("metier", e.target.value)}
                        placeholder="ex : Réalisateur, Étudiant, Designer…"
                        autoComplete="organization-title"
                        className={errors.metier ? INPUT_CLASS_ERROR : INPUT_CLASS}
                    />
                </FormField>
            </div>

            {/* Email */}
            <FormField label="Email de contact" required error={errors.email}>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    placeholder="vous@exemple.com"
                    autoComplete="email"
                    className={errors.email ? INPUT_CLASS_ERROR : INPUT_CLASS}
                />
                <p className="text-xs text-slate-500 mt-1">
                    Utilisé pour les notifications de sélection et la gestion de votre dossier
                </p>
            </FormField>

            {/* Téléphone + Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Téléphone" error={errors.telephone}>
                    <input
                        type="tel"
                        value={data.telephone}
                        onChange={(e) => onChange("telephone", e.target.value)}
                        placeholder="+33 1 00 00 00 00"
                        autoComplete="tel-national"
                        className={INPUT_CLASS}
                    />
                </FormField>
                <FormField label="Mobile" required error={errors.mobile}>
                    <input
                        type="tel"
                        value={data.mobile}
                        onChange={(e) => onChange("mobile", e.target.value)}
                        placeholder="+33 6 00 00 00 00"
                        autoComplete="tel"
                        className={errors.mobile ? INPUT_CLASS_ERROR : INPUT_CLASS}
                    />
                </FormField>
            </div>

            {/* Adresse postale */}
            <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Adresse postale
                </span>
                <FormField label="Rue / Numéro" required error={errors.adresse}>
                    <input
                        type="text"
                        value={data.adresse}
                        onChange={(e) => onChange("adresse", e.target.value)}
                        placeholder="12 rue de la République"
                        autoComplete="street-address"
                        className={errors.adresse ? INPUT_CLASS_ERROR : INPUT_CLASS}
                    />
                </FormField>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <FormField label="Code postal" required error={errors.codePostal}>
                        <input
                            type="text"
                            value={data.codePostal}
                            onChange={(e) => onChange("codePostal", e.target.value)}
                            placeholder="13001"
                            autoComplete="postal-code"
                            maxLength={10}
                            className={errors.codePostal ? INPUT_CLASS_ERROR : INPUT_CLASS}
                        />
                    </FormField>
                    <FormField label="Ville" required error={errors.ville}>
                        <input
                            type="text"
                            value={data.ville}
                            onChange={(e) => onChange("ville", e.target.value)}
                            placeholder="Marseille"
                            autoComplete="address-level2"
                            className={errors.ville ? INPUT_CLASS_ERROR : INPUT_CLASS}
                        />
                    </FormField>
                    <FormField label="Pays" required error={errors.pays}>
                        <select
                            value={data.pays}
                            onChange={(e) => onChange("pays", e.target.value)}
                            autoComplete="country"
                            className={errors.pays ? INPUT_CLASS_ERROR : SELECT_CLASS}
                        >
                            <option value="">— Pays —</option>
                            {PAYS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Réseaux sociaux{" "}
                    <span className="normal-case text-slate-500 font-normal tracking-normal">
                        (facultatif — pour promouvoir votre film si sélectionné)
                    </span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SOCIAL_FIELDS.map(({ field, icon, placeholder }) => (
                        <div key={field} className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold select-none">
                                {icon}
                            </span>
                            <input
                                type="text"
                                value={data[field] as string}
                                onChange={(e) => onChange(field, e.target.value)}
                                placeholder={placeholder}
                                className={SOCIAL_INPUT_CLASS}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Découverte + Newsletter */}
            <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Comment avez-vous connu marsAI ?" error={errors.decouverte}>
                        <select
                            value={data.decouverte}
                            onChange={(e) => onChange("decouverte", e.target.value)}
                            className={SELECT_CLASS}
                        >
                            <option value="">— Sélectionnez —</option>
                            {DECOUVERTE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                    <div
                        className={`mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                            data.newsletter
                                ? "bg-cyan-400 border-cyan-400"
                                : "border-white/20 bg-white/5 group-hover:border-white/40"
                        }`}
                        onClick={() => onChange("newsletter", !data.newsletter)}
                    >
                        {data.newsletter && (
                            <span className="text-slate-950 text-xs font-bold">✓</span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-300">
                            Newsletter marsAI{" "}
                            <span className="text-slate-500 font-normal">(facultatif)</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            Je souhaite recevoir les actualités du festival, les annonces de
                            résultats et les informations sur les prochaines éditions.
                        </p>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default Step1Profil;
