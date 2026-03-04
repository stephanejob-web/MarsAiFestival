import type React from "react";
import FormField from "../../../../components/ui/FormField";
import { INPUT_CLASS, INPUT_CLASS_ERROR } from "../../../../constants/depot";
import type { DepotErrors, Step3Data } from "../../types";

interface Step3IAProps {
    data: Step3Data;
    errors: DepotErrors;
    onChange: (field: keyof Step3Data, value: string | File | null) => void;
}

const IA_CLASSIFICATIONS = [
    {
        value: "full" as const,
        title: "Génération intégrale",
        desc: "Le film a été entièrement généré par IA, sans éléments filmés, dessinés ou enregistrés par un humain. Textes, images, sons et montage sont tous issus d'outils IA.",
        badge: "100% IA",
        badgeClass: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
    },
    {
        value: "hybrid" as const,
        title: "Production hybride",
        desc: "Le film combine des éléments humains (tournage, dessin, voix, musique composée) et des outils IA utilisés en post-production ou en complément créatif.",
        badge: "Hybride IA + Humain",
        badgeClass: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    },
];

const IA_TOOLS = [
    {
        field: "outilsImage" as const,
        label: "Outils IA — images ou vidéo",
        required: true,
        placeholder: "ex : Runway ML, Sora, Midjourney…",
    },
    {
        field: "outilsSon" as const,
        label: "Outils IA — son & musique",
        required: false,
        placeholder: "ex : Suno AI, ElevenLabs, MusicGen…",
    },
    {
        field: "outilsScenario" as const,
        label: "Outils IA — scénario & écriture",
        required: false,
        placeholder: "ex : ChatGPT, Claude, Mistral…",
    },
    {
        field: "outilsPostProd" as const,
        label: "Outils IA — post-production",
        required: false,
        placeholder: "ex : Topaz Video AI, CapCut AI…",
    },
];

interface SubtitleZoneProps {
    id: string;
    label: string;
    icon: string;
    file: File | null;
    error?: string;
    onChange: (file: File | null) => void;
}

const SubtitleZone = ({
    id,
    label,
    icon,
    file,
    error,
    onChange,
}: SubtitleZoneProps): React.JSX.Element => (
    <div className="flex flex-col gap-1.5">
        <label
            htmlFor={id}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                file
                    ? "border-cyan-400/30 bg-cyan-400/5"
                    : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
        >
            <span className="text-xl">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-300">
                    {label} <span className="text-cyan-400">*</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                    {file ? file.name : "Formats SRT ou VTT"}
                </p>
            </div>
            <span
                className={`text-xs px-3 py-1 rounded-full border flex-shrink-0 ${
                    file
                        ? "text-cyan-400 border-cyan-400/30 bg-cyan-400/10"
                        : "text-slate-400 border-white/15"
                }`}
            >
                {file ? "✓ Chargé" : "+ Ajouter"}
            </span>
            <input
                id={id}
                type="file"
                accept=".srt,.vtt"
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                className="sr-only"
            />
        </label>
        {error && (
            <p role="alert" className="text-xs text-red-400">
                {error}
            </p>
        )}
    </div>
);

const Step3IA = ({ data, errors, onChange }: Step3IAProps): React.JSX.Element => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-2xl flex-shrink-0">
                    🤖
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100">
                        Déclaration d&apos;Usage de l&apos;IA
                    </h2>
                    <p className="text-sm text-slate-500">
                        Type de production, outils utilisés et sous-titres
                    </p>
                </div>
            </div>

            {/* Classification IA */}
            <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Type de production IA <span className="text-cyan-400">*</span>
                </span>
                <div className="flex flex-col gap-3">
                    {IA_CLASSIFICATIONS.map((cls) => (
                        <label
                            key={cls.value}
                            className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-colors ${
                                data.iaClassification === cls.value
                                    ? "border-cyan-400/40 bg-cyan-400/5"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                            }`}
                        >
                            <input
                                type="radio"
                                name="iaClassification"
                                value={cls.value}
                                checked={data.iaClassification === cls.value}
                                onChange={() => onChange("iaClassification", cls.value)}
                                className="sr-only"
                            />
                            <span
                                className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                                    data.iaClassification === cls.value
                                        ? "border-cyan-400 bg-cyan-400"
                                        : "border-white/30"
                                }`}
                            />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-100 mb-1">{cls.title}</p>
                                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                                    {cls.desc}
                                </p>
                                <span
                                    className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cls.badgeClass}`}
                                >
                                    {cls.badge}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
                {errors.iaClassification && (
                    <p role="alert" className="text-xs text-red-400">
                        {errors.iaClassification}
                    </p>
                )}
            </div>

            {/* Outils IA */}
            <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Outils utilisés
                </span>
                {IA_TOOLS.map(({ field, label, required, placeholder }) => (
                    <FormField key={field} label={label} required={required} error={errors[field]}>
                        <input
                            type="text"
                            value={data[field] as string}
                            onChange={(e) => onChange(field, e.target.value)}
                            placeholder={placeholder}
                            className={errors[field] ? INPUT_CLASS_ERROR : INPUT_CLASS}
                        />
                    </FormField>
                ))}
            </div>

            {/* Sous-titres */}
            <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Sous-titres
                </span>

                <div className="flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
                    <span className="text-lg flex-shrink-0">⚠️</span>
                    <div className="text-xs text-slate-400 leading-relaxed">
                        <strong className="text-yellow-400 block mb-1">
                            Ne pas incruster les sous-titres dans la vidéo
                        </strong>
                        Fournissez-les en fichier séparé (SRT ou VTT). Le festival les applique
                        dynamiquement sur la plateforme, permettant au spectateur de les activer ou
                        désactiver.
                    </div>
                </div>

                <SubtitleZone
                    id="sub-fr"
                    label="Sous-titres Français"
                    icon="💬"
                    file={data.subtitleFr}
                    error={errors.subtitleFr}
                    onChange={(file) => onChange("subtitleFr", file)}
                />
                <SubtitleZone
                    id="sub-en"
                    label="Sous-titres Anglais"
                    icon="🌐"
                    file={data.subtitleEn}
                    error={errors.subtitleEn}
                    onChange={(file) => onChange("subtitleEn", file)}
                />
            </div>
        </div>
    );
};

export default Step3IA;
