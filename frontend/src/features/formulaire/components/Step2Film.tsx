import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { FormDepotData, FormDepotErrors, DurationStatus } from "../types";
import {
    LANGUAGES,
    TITLE_MAX_LENGTH,
    SYNOPSIS_MAX_LENGTH,
    INTENTION_MAX_LENGTH,
    OUTILS_MAX_LENGTH,
    VIDEO_MIN_DURATION,
    VIDEO_MAX_DURATION,
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
    posterFile: File | null;
    uploadProgress: number;
    onChange: (field: keyof FormDepotData, value: string | boolean) => void;
    onVideoSelect: (file: File) => void;
    onVideoReset: () => void;
    onPosterSelect: (file: File | null) => void;
    setUploadProgress: (progress: number) => void;
    setVideoDuration: (duration: number | null) => void;
    setVideoValid: (valid: boolean) => void;
    onPrev: () => void;
    onNext: () => boolean;
}

const Step2Film = ({
    formData,
    errors,
    videoFile,
    posterFile,
    uploadProgress,
    onChange,
    onVideoSelect,
    onVideoReset,
    onPosterSelect,
    setUploadProgress,
    setVideoDuration,
    setVideoValid,
    onPrev,
    onNext,
}: Step2FilmProps): React.JSX.Element => {
    const { t } = useTranslation();
    const languageOptions = LANGUAGES.map((l) => ({
        ...l,
        label: t(`form.languages.${l.value}`, l.label),
    }));

    const [durationSec, setDurationSec] = useState<number | null>(null);
    const [durationStatus, setDurationStatus] = useState<DurationStatus | null>(null);
    const [showValidationHint, setShowValidationHint] = useState(false);
    const uploadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const posterInputRef = useRef<HTMLInputElement>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);

    const checkDuration = useCallback(
        (file: File): void => {
            const url = URL.createObjectURL(file);
            const video = document.createElement("video");
            video.src = url;
            video.preload = "metadata";

            const handleMetadata = (): void => {
                const dur = video.duration;
                setDurationSec(dur);
                setVideoDuration(dur);
                if (dur <= VIDEO_MAX_DURATION && dur >= VIDEO_MIN_DURATION) {
                    setDurationStatus("ok");
                    setVideoValid(true);
                } else {
                    setDurationStatus("err");
                    setVideoValid(false);
                }
                URL.revokeObjectURL(url);
            };

            video.addEventListener("loadedmetadata", handleMetadata);
            video.load();
        },
        [setVideoValid, setVideoDuration],
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

    useEffect(() => {
        if (!posterFile) {
            queueMicrotask(() => setPosterPreview(null));
            return;
        }
        const url = URL.createObjectURL(posterFile);
        queueMicrotask(() => setPosterPreview(url));
        return () => URL.revokeObjectURL(url);
    }, [posterFile]);

    const handlePosterInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) onPosterSelect(file);
    };

    const handlePosterDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) onPosterSelect(file);
    };

    const handleReset = (): void => {
        if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
        onVideoReset();
        setDurationSec(null);
        setDurationStatus(null);
    };

    const handleNextClick = (): void => {
        const success = onNext();
        if (!success) {
            setShowValidationHint(true);
            requestAnimationFrame(() => {
                const firstError = document.querySelector('[class*="text-coral"]');
                if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        }
    };

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ): void => {
        onChange(e.target.name as keyof FormDepotData, e.target.value);
        setShowValidationHint(false);
    };

    const charCounterClass = (length: number, max: number): string => {
        const base = "font-mono text-[0.68rem] text-right -mt-1";
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
            <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-white/6">
                <div className="w-11 h-11 rounded-xl bg-lavande/10 flex items-center justify-center text-xl shrink-0">
                    🎬
                </div>
                <div>
                    <h2 className="font-display text-xl font-extrabold">{t("form.step2.title")}</h2>
                    <p className="text-sm text-mist mt-0.5">{t("form.step2.subtitle")}</p>
                </div>
            </div>

            {/* Titres et langue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                <div className="flex flex-col gap-1.75">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-mist">
                        {t("form.step2.titreFR")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="text"
                        name="titre"
                        value={formData.titre}
                        onChange={handleInput}
                        placeholder={t("form.step2.titreFRPlaceholder")}
                        maxLength={TITLE_MAX_LENGTH}
                        className={inputClass("titre")}
                    />
                    <div className={charCounterClass(formData.titre.length, TITLE_MAX_LENGTH)}>
                        {formData.titre.length} / {TITLE_MAX_LENGTH}
                    </div>
                    {renderError("titre")}
                </div>

                <div className="flex flex-col gap-1.75">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-mist">
                        {t("form.step2.titreEN")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <input
                        type="text"
                        name="titreEn"
                        value={formData.titreEn}
                        onChange={handleInput}
                        placeholder={t("form.step2.titreENPlaceholder")}
                        maxLength={TITLE_MAX_LENGTH}
                        className={inputClass("titreEn")}
                    />
                    <div className={charCounterClass(formData.titreEn.length, TITLE_MAX_LENGTH)}>
                        {formData.titreEn.length} / {TITLE_MAX_LENGTH}
                    </div>
                    {renderError("titreEn")}
                </div>

                <div className="flex flex-col gap-1.75">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-mist">
                        {t("form.step2.langue")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <select
                        name="langue"
                        value={formData.langue}
                        onChange={handleInput}
                        className={`${inputClass("langue")} cursor-pointer [&>option]:bg-horizon`}
                    >
                        <option value="">{t("form.selectPlaceholder")}</option>
                        {languageOptions.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    {renderError("langue")}
                </div>

                <div className="flex flex-col gap-1.75">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-mist">
                        {t("form.step2.tags")}{" "}
                        <span className="text-mist text-[0.65rem] font-normal normal-case opacity-70">
                            {t("form.step2.tagsHint")}
                        </span>
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInput}
                        placeholder={t("form.step2.tagsPlaceholder")}
                        maxLength={150}
                        className={inputClass("tags")}
                    />
                    <div className="text-[0.72rem] text-mist/70 -mt-0.5 leading-normal">
                        {t("form.step2.tagsTheme")}
                    </div>
                </div>
            </div>

            {/* Synopsis */}
            <div className="grid gap-4.5 mt-1">
                <div className="flex flex-col gap-1.75">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-mist">
                        {t("form.step2.synopsisFR")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <textarea
                        name="synopsis"
                        value={formData.synopsis}
                        onChange={handleInput}
                        rows={4}
                        placeholder={t("form.step2.synopsisFRPlaceholder")}
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

                <div className="flex flex-col gap-1.75">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-mist">
                        {t("form.step2.synopsisEN")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <textarea
                        name="synopsisEn"
                        value={formData.synopsisEn}
                        onChange={handleInput}
                        rows={4}
                        placeholder={t("form.step2.synopsisENPlaceholder")}
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

            {/* Affiche du film */}
            <hr className="border-white/6 my-6" />
            <div className="text-[0.68rem] font-bold uppercase tracking-widest text-mist mb-4 mt-1">
                Affiche du film{" "}
                <span className="text-coral text-[0.65rem] normal-case font-normal">
                    — obligatoire
                </span>
            </div>

            <div
                className={`rounded-2xl border-2 border-dashed transition-all ${
                    errors.poster
                        ? "border-coral/50 bg-coral/5"
                        : "border-aurora/[0.28] hover:border-aurora/55 hover:bg-aurora/4"
                } ${posterPreview ? "p-0 overflow-hidden" : "p-6 flex flex-col items-center gap-3 cursor-pointer"}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handlePosterDrop}
                onClick={() => !posterPreview && posterInputRef.current?.click()}
                role={posterPreview ? undefined : "button"}
                tabIndex={posterPreview ? undefined : 0}
                onKeyDown={(e) => {
                    if (!posterPreview && e.key === "Enter") posterInputRef.current?.click();
                }}
            >
                <input
                    ref={posterInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePosterInputChange}
                />

                {posterPreview ? (
                    <div className="relative group">
                        <img
                            src={posterPreview}
                            alt="Aperçu affiche"
                            className="w-full max-h-72 object-contain rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    posterInputRef.current?.click();
                                }}
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/20 transition-colors"
                            >
                                Changer
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPosterSelect(null);
                                }}
                                className="bg-coral/20 border border-coral/40 rounded-xl px-4 py-2 text-sm font-semibold text-coral hover:bg-coral/30 transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-14 h-14 rounded-full bg-aurora/8 border border-aurora/20 flex items-center justify-center text-2xl">
                            🖼️
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-semibold text-aurora mb-1">
                                Glisser une image ou cliquer pour parcourir
                            </div>
                            <div className="text-xs text-mist">JPG, PNG, WebP — format affiche (2:3 recommandé)</div>
                        </div>
                    </>
                )}
            </div>
            {renderError("poster")}

            {/* Fichier vidéo */}
            <hr className="border-white/6 my-6" />
            <div className="text-[0.68rem] font-bold uppercase tracking-widest text-mist mb-4 mt-1">
                {t("form.step2.videoSection")}
            </div>

            <UploadZone visible={!videoFile} onFileSelect={handleVideoSelect} />
            {videoFile && (
                <FileCard file={videoFile} progress={uploadProgress} onReset={handleReset} />
            )}
            <DurationResult durationSec={durationSec} status={durationStatus} />
            {renderError("video")}

            {/* Note d'intention */}
            <hr className="border-white/6 my-6" />

            <div className="grid gap-4.5">
                <div className="flex flex-col gap-1.75">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-mist">
                        {t("form.step2.intention")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <textarea
                        name="intention"
                        value={formData.intention}
                        onChange={handleInput}
                        rows={5}
                        placeholder={t("form.step2.intentionPlaceholder")}
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
                    <div className="text-[0.72rem] text-mist/70 -mt-0.5 leading-normal">
                        {t("form.step2.intentionHint")}
                    </div>
                    {renderError("intention")}
                </div>

                <div className="flex flex-col gap-1.75">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-mist">
                        {t("form.step2.outils")}{" "}
                        <span className="text-coral text-[0.65rem]">{t("form.required")}</span>
                    </label>
                    <textarea
                        name="outils"
                        value={formData.outils}
                        onChange={handleInput}
                        rows={5}
                        placeholder={t("form.step2.outilsPlaceholder")}
                        maxLength={OUTILS_MAX_LENGTH}
                        className={`${inputClass("outils")} resize-y leading-relaxed`}
                    />
                    <div className={charCounterClass(formData.outils.length, OUTILS_MAX_LENGTH)}>
                        {formData.outils.length} / {OUTILS_MAX_LENGTH}
                    </div>
                    <div className="text-[0.72rem] text-mist/70 -mt-0.5 leading-normal">
                        {t("form.step2.outilsHint")}
                    </div>
                    {renderError("outils")}
                </div>
            </div>

            {/* Boutons navigation */}
            <div className="flex flex-col items-end gap-3 mt-8 pt-6 border-t border-white/6">
                {showValidationHint && Object.keys(errors).length > 0 && (
                    <div className="w-full text-sm text-coral bg-coral/8 border border-coral/20 rounded-[10px] px-4 py-2.5 flex items-center gap-2">
                        <span>⚠</span>
                        <span>{t("form.validation.errorsHint")}</span>
                    </div>
                )}
                <div className="flex items-center justify-between w-full">
                    <button
                        type="button"
                        onClick={onPrev}
                        className="bg-white/5 border border-white/10 rounded-[10px] px-6 py-3 text-sm font-semibold text-mist cursor-pointer transition-all hover:text-white-soft hover:border-white/20 font-body"
                    >
                        {t("form.prev")}
                    </button>
                    <button
                        type="button"
                        onClick={handleNextClick}
                        disabled={durationStatus === "err"}
                        className={`rounded-[10px] px-8 py-3 font-display text-sm font-extrabold transition-all flex items-center gap-2 ${
                            durationStatus === "err"
                                ? "bg-white/5 text-mist/50 border border-white/8 cursor-not-allowed"
                                : "bg-aurora border-none text-deep-sky cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(78,255,206,0.35)]"
                        }`}
                    >
                        {t("form.step2.cta")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step2Film;
