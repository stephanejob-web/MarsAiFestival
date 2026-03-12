import React, { useRef } from "react";
import type { FormDepotData, FormDepotErrors } from "../types";
import { getInputClass } from "./formUtils";
import { FormFieldError } from "./formHelpers";

interface SubtitleUploadProps {
    lang: "fr" | "en";
    file: File | null;
    required?: boolean;
    onFileSelect: (file: File) => void;
    error?: string;
}

const SubtitleUpload = ({
    lang,
    file,
    required,
    onFileSelect,
    error,
}: SubtitleUploadProps): React.JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isFr = lang === "fr";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const f = e.target.files?.[0];
        if (f) onFileSelect(f);
    };

    return (
        <div className="mb-2">
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`w-full flex items-center gap-3.5 rounded-xl border-[1.5px] px-5 py-4 text-left cursor-pointer transition-all duration-200 hover:border-aurora/30 hover:bg-aurora/[0.02] ${
                    file ? "border-aurora/25 bg-aurora/[0.03]" : "border-white/10 bg-white/[0.02]"
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".srt,.vtt"
                    onChange={handleChange}
                    className="hidden"
                />
                <span className="text-xl shrink-0">{isFr ? "💬" : "🌐"}</span>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white-soft">
                        Sous-titres {isFr ? "Français" : "Anglais"}{" "}
                        {required && <span className="text-coral text-[0.65rem]">● requis</span>}
                    </div>
                    <div className="text-xs text-mist mt-0.5 truncate">
                        {file ? file.name : "Formats SRT ou VTT"}
                    </div>
                </div>
                <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 ${
                        file
                            ? "bg-aurora/10 text-aurora border border-aurora/20"
                            : "bg-white/5 text-mist border border-white/10"
                    }`}
                >
                    {file ? "✓ Ajouté" : "+ Ajouter"}
                </span>
            </button>
            {error && <div className="text-xs text-coral mt-1.5">{error}</div>}
        </div>
    );
};

interface Step3AIProps {
    formData: FormDepotData;
    errors: FormDepotErrors;
    subtitleFR: File | null;
    subtitleEN: File | null;
    onChange: (field: keyof FormDepotData, value: string | boolean) => void;
    onSubtitleFR: (file: File) => void;
    onSubtitleEN: (file: File) => void;
    onPrev: () => void;
    onNext: () => void;
}

const Step3AI = ({
    formData,
    errors,
    subtitleFR,
    subtitleEN,
    onChange,
    onSubtitleFR,
    onSubtitleEN,
    onPrev,
    onNext,
}: Step3AIProps): React.JSX.Element => {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        onChange(e.target.name as keyof FormDepotData, e.target.value);
    };

    const handleClassChange = (value: "full" | "hybrid"): void => {
        onChange("iaClass", value);
    };

    const inputClass = (field: string): string => getInputClass(field, errors);

    const renderError = (field: string): React.JSX.Element | null => (
        <FormFieldError errors={errors} field={field} />
    );

    const classCards: Array<{
        value: "full" | "hybrid";
        title: string;
        description: string;
        badge: string;
        badgeClass: string;
    }> = [
        {
            value: "full",
            title: "Génération intégrale",
            description:
                "Le film a été entièrement généré par IA, sans éléments filmés, dessinés ou enregistrés par un humain. Textes, images, sons et montage sont tous issus d'outils IA.",
            badge: "100% IA",
            badgeClass: "bg-lavande/10 text-lavande border-lavande/20",
        },
        {
            value: "hybrid",
            title: "Production hybride",
            description:
                "Le film combine des éléments humains (tournage, dessin, voix, musique composée) et des outils IA utilisés en post-production ou en complément créatif.",
            badge: "Hybride IA + Humain",
            badgeClass: "bg-aurora/10 text-aurora border-aurora/20",
        },
    ];

    return (
        <div className="form-animate-in">
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-white/5">
                <div className="w-11 h-11 rounded-xl bg-lavande/10 flex items-center justify-center text-xl shrink-0">
                    🤖
                </div>
                <div>
                    <h2 className="font-display text-xl font-extrabold">
                        Déclaration d&apos;Usage de l&apos;IA
                    </h2>
                    <p className="text-sm text-mist mt-0.5">
                        Type de production, outils utilisés et sous-titres
                    </p>
                </div>
            </div>

            {/* Classification IA */}
            <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wide text-mist block mb-3">
                    Type de production IA{" "}
                    <span className="text-coral text-[0.65rem]">● requis</span>
                </label>
                <div className="grid gap-3 ia-class-cards">
                    {classCards.map((card) => (
                        <label
                            key={card.value}
                            className={`ia-class-card relative flex items-start gap-4 p-5 rounded-xl border-[1.5px] cursor-pointer transition-all duration-200 ${
                                formData.iaClass === card.value
                                    ? "border-aurora/30 bg-aurora/[0.04]"
                                    : "border-white/8 bg-white/[0.02] hover:border-white/15"
                            }`}
                        >
                            <input
                                type="radio"
                                name="iaClass"
                                value={card.value}
                                checked={formData.iaClass === card.value}
                                onChange={() => handleClassChange(card.value)}
                                className="sr-only"
                            />
                            <div
                                className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                                    formData.iaClass === card.value
                                        ? "border-aurora bg-aurora/15"
                                        : "border-white/20"
                                }`}
                            >
                                {formData.iaClass === card.value && (
                                    <div className="w-2 h-2 rounded-full bg-aurora" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="font-display font-bold text-sm text-white-soft mb-1">
                                    {card.title}
                                </div>
                                <div className="text-xs text-mist leading-relaxed mb-2">
                                    {card.description}
                                </div>
                                <span
                                    className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-full border ${card.badgeClass}`}
                                >
                                    {card.badge}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
                {renderError("iaClass")}
            </div>

            <hr className="border-white/5 my-6" />
            <div className="text-xs font-bold uppercase tracking-widest text-mist mb-4">
                Outils utilisés
            </div>

            {/* Outils IA */}
            <div className="grid gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Outils IA — images ou vidéo{" "}
                        <span className="text-coral text-[0.65rem]">● requis</span>
                    </label>
                    <input
                        type="text"
                        name="iaImg"
                        value={formData.iaImg}
                        onChange={handleInput}
                        placeholder="ex : Runway ML, Sora, Midjourney…"
                        className={inputClass("iaImg")}
                    />
                    {renderError("iaImg")}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Outils IA — son & musique{" "}
                        <span className="text-mist text-[0.65rem] font-normal normal-case opacity-70">
                            (facultatif)
                        </span>
                    </label>
                    <input
                        type="text"
                        name="iaSon"
                        value={formData.iaSon}
                        onChange={handleInput}
                        placeholder="ex : Suno AI, ElevenLabs, MusicGen…"
                        className={inputClass("iaSon")}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Outils IA — scénario & écriture{" "}
                        <span className="text-mist text-[0.65rem] font-normal normal-case opacity-70">
                            (facultatif)
                        </span>
                    </label>
                    <input
                        type="text"
                        name="iaScenario"
                        value={formData.iaScenario}
                        onChange={handleInput}
                        placeholder="ex : ChatGPT, Claude, Mistral…"
                        className={inputClass("iaScenario")}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Outils IA — post-production{" "}
                        <span className="text-mist text-[0.65rem] font-normal normal-case opacity-70">
                            (facultatif)
                        </span>
                    </label>
                    <input
                        type="text"
                        name="iaPost"
                        value={formData.iaPost}
                        onChange={handleInput}
                        placeholder="ex : Topaz Video AI, CapCut AI…"
                        className={inputClass("iaPost")}
                    />
                </div>
            </div>

            <hr className="border-white/5 my-6" />
            <div className="text-xs font-bold uppercase tracking-widest text-mist mb-4">
                Sous-titres
            </div>

            {/* Avertissement */}
            <div className="flex items-start gap-3 bg-solar/[0.04] border border-solar/18 rounded-[10px] px-4 py-3 mb-4">
                <span className="text-lg shrink-0">⚠️</span>
                <div className="text-xs text-mist leading-relaxed">
                    <strong className="text-solar block mb-0.5">
                        Ne pas incruster les sous-titres dans la vidéo
                    </strong>
                    Fournissez-les en fichier séparé (SRT ou VTT). Le festival les applique
                    dynamiquement sur la plateforme de diffusion, permettant au spectateur de les
                    activer ou désactiver.
                </div>
            </div>

            <SubtitleUpload
                lang="fr"
                file={subtitleFR}
                onFileSelect={onSubtitleFR}
                error={errors.subtitleFR}
            />
            <SubtitleUpload
                lang="en"
                file={subtitleEN}
                onFileSelect={onSubtitleEN}
                error={errors.subtitleEN}
            />

            {/* Boutons navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <button
                    type="button"
                    onClick={onPrev}
                    className="bg-white/5 border border-white/10 rounded-[10px] px-6 py-3 text-sm font-semibold text-mist cursor-pointer transition-all hover:text-white-soft hover:border-white/20 font-body"
                >
                    ← Retour
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="bg-aurora border-none rounded-[10px] px-8 py-3 font-display text-sm font-extrabold text-deep-sky cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(78,255,206,0.35)] flex items-center gap-2"
                >
                    Étape suivante — Confirmation →
                </button>
            </div>
        </div>
    );
};

export default Step3AI;
