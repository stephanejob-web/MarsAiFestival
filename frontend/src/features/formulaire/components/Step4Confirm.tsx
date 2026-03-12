import React from "react";
import type { FormDepotData } from "../types";
import { RGPD_ITEMS, COUNTRIES } from "../constants";

interface Step4ConfirmProps {
    formData: FormDepotData;
    videoFile: File | null;
    videoDuration: number | null;
    videoValid: boolean;
    subtitleFR: File | null;
    subtitleEN: File | null;
    rgpdChecked: boolean[];
    submissionState: "idle" | "submitting" | "verifying" | "success";
    onToggleRgpd: (index: number) => void;
    onPrev: () => void;
    onSubmit: () => void;
}

interface RecapRow {
    key: string;
    value: string;
    mono?: boolean;
    ok?: boolean;
}

const formatDob = (dob: string): string => {
    if (!dob) return "—";
    const [y, m, d] = dob.split("-");
    return `${d}/${m}/${y}`;
};

const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m} min ${s.toString().padStart(2, "0")} s` : `${s} s`;
};

const Step4Confirm = ({
    formData,
    videoFile,
    videoDuration,
    videoValid,
    subtitleFR,
    subtitleEN,
    rgpdChecked,
    submissionState,
    onToggleRgpd,
    onPrev,
    onSubmit,
}: Step4ConfirmProps): React.JSX.Element => {
    const allRgpdChecked = rgpdChecked.every(Boolean);

    const countryLabel = COUNTRIES.find((c) => c.value === formData.pays)?.label ?? formData.pays;

    const videoLabel = videoFile
        ? videoDuration !== null
            ? `${formatDuration(videoDuration)} · ${videoFile.name}`
            : videoFile.name
        : "—";

    const recapRows: RecapRow[] = [
        { key: "Réalisateur", value: `${formData.prenom} ${formData.nom}`.trim() || "—" },
        { key: "Date de naissance", value: formatDob(formData.dob) },
        { key: "Email", value: formData.email || "—", mono: true },
        { key: "Mobile", value: formData.mobile || "—", mono: true },
        {
            key: "Ville / Pays",
            value: [formData.ville, countryLabel].filter(Boolean).join(", ") || "—",
        },
        { key: "Titre du film (FR)", value: formData.titre || "—" },
        { key: "Titre (EN)", value: formData.titreEn || "—" },
        { key: "Fichier vidéo", value: videoLabel, ok: videoValid },
        {
            key: "Type de production",
            value:
                formData.iaClass === "full"
                    ? "Génération intégrale (100% IA)"
                    : "Production hybride (IA + Humain)",
        },
        { key: "Outils IA image", value: formData.iaImg || "—" },
        {
            key: "Sous-titres",
            value: [subtitleFR ? "FR ✓" : "FR ✗", subtitleEN ? "EN ✓" : "EN ✗"].join(" · "),
        },
    ];

    return (
        <div className="form-animate-in">
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-white/5">
                <div className="w-11 h-11 rounded-xl bg-aurora/10 flex items-center justify-center text-xl shrink-0">
                    ✅
                </div>
                <div>
                    <h2 className="font-display text-xl font-extrabold">Confirmation & Droits</h2>
                    <p className="text-sm text-mist mt-0.5">
                        Vérifiez votre dossier, acceptez les conditions et soumettez
                    </p>
                </div>
            </div>

            {/* Récapitulatif */}
            <div className="rounded-xl border border-white/8 overflow-hidden mb-6">
                <div className="bg-white/[0.03] border-b border-white/6 px-5 py-3">
                    <span className="font-display text-sm font-bold text-white-soft">
                        Récapitulatif du dossier
                    </span>
                </div>
                <div className="divide-y divide-white/5">
                    {recapRows.map((row) => (
                        <div
                            key={row.key}
                            className="flex items-center justify-between px-5 py-2.5"
                        >
                            <span className="text-xs text-mist">{row.key}</span>
                            <span
                                className={`text-sm text-right ${
                                    row.ok ? "text-aurora font-bold" : "text-white-soft"
                                } ${row.mono ? "font-mono" : ""}`}
                            >
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* RGPD */}
            <div className="text-xs font-bold uppercase tracking-widest text-mist mb-4">
                Conditions obligatoires
            </div>

            <div className="grid gap-3 mb-4 rgpd-checks">
                {RGPD_ITEMS.map((item, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onToggleRgpd(index)}
                        className={`rgpd-item flex items-start gap-4 rounded-xl border-[1.5px] px-5 py-4 text-left cursor-pointer transition-all duration-200 w-full ${
                            rgpdChecked[index]
                                ? "border-aurora/25 bg-aurora/[0.03]"
                                : "border-white/8 bg-white/[0.02] hover:border-white/15"
                        }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                                rgpdChecked[index]
                                    ? "border-aurora bg-aurora/20"
                                    : "border-white/20"
                            }`}
                        >
                            {rgpdChecked[index] && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path
                                        d="M2 6l3 3 5-5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-aurora"
                                    />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="font-display font-bold text-sm text-white-soft mb-1">
                                {item.title}{" "}
                                <span className="text-coral text-[0.65rem]">● obligatoire</span>
                            </div>
                            <div className="text-xs text-mist leading-relaxed">
                                {item.description}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {!allRgpdChecked && (
                <div className="text-xs text-solar/80 mb-4">
                    Vous devez accepter toutes les conditions pour soumettre votre film.
                </div>
            )}

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
                    onClick={onSubmit}
                    disabled={!allRgpdChecked || submissionState === "submitting"}
                    className={`rounded-[10px] px-8 py-3 font-display text-sm font-extrabold cursor-pointer transition-all flex items-center gap-2 ${
                        allRgpdChecked && submissionState !== "submitting"
                            ? "bg-aurora text-deep-sky border-none hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(78,255,206,0.35)]"
                            : "bg-white/5 text-mist/50 border border-white/8 cursor-not-allowed"
                    }`}
                >
                    {submissionState === "submitting" ? (
                        <>
                            <span className="animate-spin">⏳</span> Envoi en cours…
                        </>
                    ) : (
                        "🎬 Soumettre mon film"
                    )}
                </button>
            </div>
        </div>
    );
};

export default Step4Confirm;
