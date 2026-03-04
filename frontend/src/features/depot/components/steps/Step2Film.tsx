import React, { useRef, useState } from "react";
import FormField from "../../../../components/ui/FormField";
import {
    INPUT_CLASS,
    INPUT_CLASS_ERROR,
    LANGUES_OPTIONS,
    SELECT_CLASS,
    TEXTAREA_CLASS,
} from "../../../../constants/depot";
import type { DepotErrors, Step2Data } from "../../types";

interface Step2FilmProps {
    data: Step2Data;
    errors: DepotErrors;
    onChange: (field: keyof Step2Data, value: string | File | null) => void;
}

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} Mo`;
};

const Step2Film = ({ data, errors, onChange }: Step2FilmProps): React.JSX.Element => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (): void => setIsDragging(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onChange("videoFile", file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0] ?? null;
        onChange("videoFile", file);
    };

    const handleZoneClick = (): void => fileInputRef.current?.click();

    const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        onChange("videoFile", null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const isValidType = data.videoFile ? ACCEPTED_VIDEO_TYPES.includes(data.videoFile.type) : true;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-2xl flex-shrink-0">
                    🎬
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Le Film</h2>
                    <p className="text-sm text-slate-500">
                        Titre, synopsis, fichier vidéo et note d&apos;intention
                    </p>
                </div>
            </div>

            {/* Titres */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Titre original (français)" required error={errors.titreFr}>
                    <input
                        type="text"
                        value={data.titreFr}
                        onChange={(e) => onChange("titreFr", e.target.value)}
                        placeholder="Titre en français"
                        maxLength={100}
                        className={errors.titreFr ? INPUT_CLASS_ERROR : INPUT_CLASS}
                    />
                    <p className="text-xs text-slate-500 text-right mt-1">
                        {data.titreFr.length} / 100
                    </p>
                </FormField>
                <FormField label="Titre traduit en anglais" required error={errors.titreEn}>
                    <input
                        type="text"
                        value={data.titreEn}
                        onChange={(e) => onChange("titreEn", e.target.value)}
                        placeholder="English title"
                        maxLength={100}
                        className={errors.titreEn ? INPUT_CLASS_ERROR : INPUT_CLASS}
                    />
                    <p className="text-xs text-slate-500 text-right mt-1">
                        {data.titreEn.length} / 100
                    </p>
                </FormField>
            </div>

            {/* Langue + Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Langue parlée du film" required error={errors.langue}>
                    <select
                        value={data.langue}
                        onChange={(e) => onChange("langue", e.target.value)}
                        className={errors.langue ? INPUT_CLASS_ERROR : SELECT_CLASS}
                    >
                        <option value="">— Sélectionnez —</option>
                        {LANGUES_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField label="Tags thématiques (max 5, séparés par des virgules)">
                    <input
                        type="text"
                        value={data.tags}
                        onChange={(e) => onChange("tags", e.target.value)}
                        placeholder="ex: espoir, nature, technologie…"
                        maxLength={150}
                        className={INPUT_CLASS}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        En lien avec le thème &quot;Futurs souhaitables&quot;
                    </p>
                </FormField>
            </div>

            {/* Synopsis FR + EN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Synopsis en français" required error={errors.synopsisFr}>
                    <textarea
                        value={data.synopsisFr}
                        onChange={(e) => onChange("synopsisFr", e.target.value)}
                        placeholder="Décrivez brièvement votre film en 2-3 phrases…"
                        maxLength={300}
                        rows={4}
                        className={errors.synopsisFr ? INPUT_CLASS_ERROR : TEXTAREA_CLASS}
                    />
                    <p className="text-xs text-slate-500 text-right mt-1">
                        {data.synopsisFr.length} / 300
                    </p>
                </FormField>
                <FormField label="Synopsis en anglais" required error={errors.synopsisEn}>
                    <textarea
                        value={data.synopsisEn}
                        onChange={(e) => onChange("synopsisEn", e.target.value)}
                        placeholder="Briefly describe your film in 2-3 sentences…"
                        maxLength={300}
                        rows={4}
                        className={errors.synopsisEn ? INPUT_CLASS_ERROR : TEXTAREA_CLASS}
                    />
                    <p className="text-xs text-slate-500 text-right mt-1">
                        {data.synopsisEn.length} / 300
                    </p>
                </FormField>
            </div>

            {/* Upload vidéo */}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Fichier vidéo <span className="text-cyan-400">*</span>
                </span>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp4,.mov,video/mp4,video/quicktime"
                    onChange={handleFileChange}
                    className="sr-only"
                    aria-label="Sélectionner un fichier vidéo"
                />

                {!data.videoFile ? (
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label="Zone de dépôt vidéo — cliquez ou glissez votre fichier"
                        onClick={handleZoneClick}
                        onKeyDown={(e) => e.key === "Enter" && handleZoneClick()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                            isDragging
                                ? "border-cyan-400 bg-cyan-400/10"
                                : "border-white/15 hover:border-cyan-400/40 hover:bg-white/5"
                        }`}
                    >
                        <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-cyan-400"
                            >
                                <polyline points="16 16 12 12 8 16" />
                                <line x1="12" y1="12" x2="12" y2="21" />
                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-300">
                            {isDragging ? "Relâchez pour déposer" : "Glisser-déposer votre film"}
                        </p>
                        <p className="text-xs text-slate-500">— ou —</p>
                        <p className="text-xs text-cyan-400 font-medium">
                            Cliquer pour parcourir vos fichiers
                        </p>
                        <div className="flex gap-2 mt-1">
                            {["MP4", "MOV", "200–300 Mo", "16:9", "60 sec pile"].map((spec) => (
                                <span
                                    key={spec}
                                    className="text-xs text-slate-500 bg-white/5 border border-white/10 rounded px-2 py-0.5"
                                >
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div
                        className={`flex items-center gap-4 p-4 rounded-xl border ${
                            !isValidType
                                ? "border-red-400/30 bg-red-400/5"
                                : "border-cyan-400/20 bg-cyan-400/5"
                        }`}
                    >
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
                            🎬
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-100 truncate">
                                {data.videoFile.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {data.videoFile.type.includes("quicktime") ? "MOV" : "MP4"} ·{" "}
                                {formatFileSize(data.videoFile.size)}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="text-xs text-slate-400 hover:text-slate-100 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors flex-shrink-0"
                        >
                            ✕ Changer
                        </button>
                    </div>
                )}

                {errors.videoFile && (
                    <p role="alert" className="text-xs text-red-400">
                        {errors.videoFile}
                    </p>
                )}
            </div>

            {/* Note d'intention */}
            <FormField label="Note d'intention du réalisateur" required error={errors.intention}>
                <textarea
                    value={data.intention}
                    onChange={(e) => onChange("intention", e.target.value)}
                    placeholder={`Comment votre film s'inscrit-il dans le thème "Imaginez des futurs souhaitables" ? Décrivez votre démarche artistique et votre rapport à l'IA…`}
                    maxLength={1000}
                    rows={5}
                    className={errors.intention ? INPUT_CLASS_ERROR : TEXTAREA_CLASS}
                />
                <p className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>Cette note est lue par le jury lors de la présélection</span>
                    <span className="text-right">{data.intention.length} / 1000</span>
                </p>
            </FormField>
        </div>
    );
};

export default Step2Film;
