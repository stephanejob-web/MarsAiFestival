import React, { useState, useEffect, useCallback, useRef } from "react";
import type { FormDepotData, FormDepotErrors, DurationStatus } from "../types";
import {
    LANGUAGES,
    TITLE_MAX_LENGTH,
    SYNOPSIS_MAX_LENGTH,
    INTENTION_MAX_LENGTH,
    OUTILS_MAX_LENGTH,
} from "../constants";
import UploadZone from "./UploadZone";
import FileCard from "./FileCard";
import DurationResult from "./DurationResult";
import { getInputClass } from "./formUtils";
import { FormFieldError } from "./formHelpers";

interface Step2FilmProps {
    formData: FormDepotData;
    errors: FormDepotErrors;
    videoFile: File | null;
    uploadProgress: number;
    onChange: (field: keyof FormDepotData, value: string | boolean) => void;
    onVideoSelect: (file: File) => void;
    onVideoReset: () => void;
    setUploadProgress: (progress: number) => void;
    setVideoValid: (valid: boolean) => void;
    onPrev: () => void;
    onNext: () => void;
}

const Step2Film = ({
    formData,
    errors,
    videoFile,
    uploadProgress,
    onChange,
    onVideoSelect,
    onVideoReset,
    setUploadProgress,
    setVideoValid,
    onPrev,
    onNext,
}: Step2FilmProps): React.JSX.Element => {
    const [durationSec, setDurationSec] = useState<number | null>(null);
    const [durationStatus, setDurationStatus] = useState<DurationStatus | null>(null);
    const uploadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const checkDuration = useCallback(
        (file: File): void => {
            const url = URL.createObjectURL(file);
            const video = document.createElement("video");
            video.src = url;
            video.preload = "metadata";

            const handleMetadata = (): void => {
                const dur = video.duration;
                setDurationSec(dur);
                if (dur >= 58 && dur <= 62) {
                    setDurationStatus("ok");
                    setVideoValid(true);
                } else if (dur < 58) {
                    setDurationStatus("warn");
                    setVideoValid(false);
                } else {
                    setDurationStatus("err");
                    setVideoValid(false);
                }
                URL.revokeObjectURL(url);
            };

            video.addEventListener("loadedmetadata", handleMetadata);
            video.load();
        },
        [setVideoValid],
    );

    const handleVideoSelect = useCallback(
        (file: File): void => {
            onVideoSelect(file);
            setUploadProgress(0);
            setDurationSec(null);
            setDurationStatus(null);

            let pct = 0;
            uploadIntervalRef.current = setInterval(() => {
                pct += Math.random() * 8 + 2;
                if (pct >= 100) {
                    pct = 100;
                    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
                    setUploadProgress(100);
                    setTimeout(() => checkDuration(file), 700);
                    return;
                }
                setUploadProgress(Math.round(pct));
            }, 120);
        },
        [onVideoSelect, setUploadProgress, checkDuration],
    );

    useEffect(() => {
        return () => {
            if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
        };
    }, []);

    const handleReset = (): void => {
        if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
        onVideoReset();
        setDurationSec(null);
        setDurationStatus(null);
    };

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ): void => {
        onChange(e.target.name as keyof FormDepotData, e.target.value);
    };

    const charCounterClass = (length: number, max: number): string => {
        const base = "font-mono text-xs text-right -mt-1";
        if (length >= max) return `${base} text-coral`;
        if (length > max * 0.9) return `${base} text-solar`;
        return `${base} text-mist`;
    };

    const inputClass = (field: string): string => getInputClass(field, errors);

    const renderError = (field: string): React.JSX.Element | null => (
        <FormFieldError errors={errors} field={field} />
    );

    return (
        <div className="form-animate-in">
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-white/5">
                <div className="w-11 h-11 rounded-xl bg-lavande/10 flex items-center justify-center text-xl shrink-0">
                    🎬
                </div>
                <div>
                    <h2 className="font-display text-xl font-extrabold">Le Film</h2>
                    <p className="text-sm text-mist mt-0.5">
                        Titre, synopsis, fichier vidéo et note d&apos;intention
                    </p>
                </div>
            </div>

            {/* Titres et langue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Titre original <span className="text-coral text-[0.65rem]">● requis</span>
                    </label>
                    <input
                        type="text"
                        name="titre"
                        value={formData.titre}
                        onChange={handleInput}
                        placeholder="Titre en français"
                        maxLength={TITLE_MAX_LENGTH}
                        className={inputClass("titre")}
                    />
                    <div className={charCounterClass(formData.titre.length, TITLE_MAX_LENGTH)}>
                        {formData.titre.length} / {TITLE_MAX_LENGTH}
                    </div>
                    {renderError("titre")}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Titre traduit en anglais{" "}
                        <span className="text-coral text-[0.65rem]">● requis</span>
                    </label>
                    <input
                        type="text"
                        name="titreEn"
                        value={formData.titreEn}
                        onChange={handleInput}
                        placeholder="English title"
                        maxLength={TITLE_MAX_LENGTH}
                        className={inputClass("titreEn")}
                    />
                    <div className={charCounterClass(formData.titreEn.length, TITLE_MAX_LENGTH)}>
                        {formData.titreEn.length} / {TITLE_MAX_LENGTH}
                    </div>
                    {renderError("titreEn")}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Langue parlée du film{" "}
                        <span className="text-coral text-[0.65rem]">● requis</span>
                    </label>
                    <select
                        name="langue"
                        value={formData.langue}
                        onChange={handleInput}
                        className={`${inputClass("langue")} cursor-pointer [&>option]:bg-horizon`}
                    >
                        <option value="">— Sélectionnez —</option>
                        {LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    {renderError("langue")}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Tags thématiques{" "}
                        <span className="text-mist text-[0.65rem] font-normal normal-case opacity-70">
                            (max 5, séparés par des virgules)
                        </span>
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInput}
                        placeholder="ex : espoir, nature, technologie, solidarité…"
                        maxLength={150}
                        className={inputClass("tags")}
                    />
                    <div className="text-xs text-mist/70">
                        En lien avec le thème &quot;Futurs souhaitables&quot;
                    </div>
                </div>
            </div>

            {/* Synopsis */}
            <div className="grid gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Synopsis en français{" "}
                        <span className="text-coral text-[0.65rem]">● requis</span>
                    </label>
                    <textarea
                        name="synopsis"
                        value={formData.synopsis}
                        onChange={handleInput}
                        rows={4}
                        placeholder="Décrivez brièvement votre film en 2-3 phrases…"
                        maxLength={SYNOPSIS_MAX_LENGTH}
                        className={`${inputClass("synopsis")} resize-y leading-relaxed`}
                    />
                    <div
                        className={charCounterClass(formData.synopsis.length, SYNOPSIS_MAX_LENGTH)}
                    >
                        {formData.synopsis.length} / {SYNOPSIS_MAX_LENGTH}
                    </div>
                    {renderError("synopsis")}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Synopsis en anglais{" "}
                        <span className="text-coral text-[0.65rem]">● requis</span>
                    </label>
                    <textarea
                        name="synopsisEn"
                        value={formData.synopsisEn}
                        onChange={handleInput}
                        rows={4}
                        placeholder="Briefly describe your film in 2-3 sentences…"
                        maxLength={SYNOPSIS_MAX_LENGTH}
                        className={`${inputClass("synopsisEn")} resize-y leading-relaxed`}
                    />
                    <div
                        className={charCounterClass(
                            formData.synopsisEn.length,
                            SYNOPSIS_MAX_LENGTH,
                        )}
                    >
                        {formData.synopsisEn.length} / {SYNOPSIS_MAX_LENGTH}
                    </div>
                    {renderError("synopsisEn")}
                </div>
            </div>

            {/* Fichier vidéo */}
            <hr className="border-white/5 my-6" />
            <div className="text-xs font-bold uppercase tracking-widest text-mist mb-4">
                Fichier vidéo
            </div>

            <UploadZone visible={!videoFile} onFileSelect={handleVideoSelect} />
            {videoFile && (
                <FileCard file={videoFile} progress={uploadProgress} onReset={handleReset} />
            )}
            <DurationResult durationSec={durationSec} status={durationStatus} />
            {renderError("video")}

            {/* Note d'intention */}
            <hr className="border-white/5 my-6" />

            <div className="grid gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Note d&apos;intention{" "}
                        <span className="text-coral text-[0.65rem]">● requis</span>
                    </label>
                    <textarea
                        name="intention"
                        value={formData.intention}
                        onChange={handleInput}
                        rows={5}
                        placeholder={
                            "Comment votre film s\u2019inscrit-il dans le thème \u00AB Imaginez des futurs souhaitables \u00BB ? Décrivez votre démarche artistique et votre rapport à l\u2019IA\u2026"
                        }
                        maxLength={INTENTION_MAX_LENGTH}
                        className={`${inputClass("intention")} resize-y leading-relaxed`}
                    />
                    <div
                        className={charCounterClass(
                            formData.intention.length,
                            INTENTION_MAX_LENGTH,
                        )}
                    >
                        {formData.intention.length} / {INTENTION_MAX_LENGTH}
                    </div>
                    <div className="text-xs text-mist/70">
                        Cette note est lue par le jury lors de la présélection
                    </div>
                    {renderError("intention")}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-mist">
                        Outils utilisés et méthodes de création{" "}
                        <span className="text-coral text-[0.65rem]">● requis</span>
                    </label>
                    <textarea
                        name="outils"
                        value={formData.outils}
                        onChange={handleInput}
                        rows={5}
                        placeholder="Décrivez les outils (logiciels, langages, frameworks, etc.) et les méthodes de création employées pour ce dépôt..."
                        maxLength={OUTILS_MAX_LENGTH}
                        className={`${inputClass("outils")} resize-y leading-relaxed`}
                    />
                    <div className={charCounterClass(formData.outils.length, OUTILS_MAX_LENGTH)}>
                        {formData.outils.length} / {OUTILS_MAX_LENGTH}
                    </div>
                    <div className="text-xs text-mist/70">
                        Cette note est lue par le jury lors de la présélection
                    </div>
                    {renderError("outils")}
                </div>
            </div>

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
                    Étape suivante — Fiche IA →
                </button>
            </div>
        </div>
    );
};

export default Step2Film;
