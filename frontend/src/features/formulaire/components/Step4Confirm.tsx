import React from "react";
import { useTranslation } from "react-i18next";
import type { FormDepotData } from "../types";
import { COUNTRIES } from "../constants";

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
    const { t } = useTranslation();
    const allRgpdChecked = rgpdChecked.every(Boolean);

    const countryLabel = t(`form.countries.${formData.pays}`, COUNTRIES.find((c) => c.value === formData.pays)?.label ?? formData.pays);

    const videoLabel = videoFile
        ? videoDuration !== null
            ? `${formatDuration(videoDuration)} · ${videoFile.name}`
            : videoFile.name
        : "—";

    const rgpdItems = [
        { title: t("form.rgpd.0.title"), description: t("form.rgpd.0.desc") },
        { title: t("form.rgpd.1.title"), description: t("form.rgpd.1.desc") },
        { title: t("form.rgpd.2.title"), description: t("form.rgpd.2.desc") },
    ];

    const recapRows: RecapRow[] = [
        { key: t("form.step4.recapDirector"), value: `${formData.prenom} ${formData.nom}`.trim() || "—" },
        { key: t("form.step4.recapDob"), value: formatDob(formData.dob) },
        { key: t("form.step4.recapEmail"), value: formData.email || "—", mono: true },
        { key: t("form.step4.recapMobile"), value: formData.mobile || "—", mono: true },
        {
            key: t("form.step4.recapCityCountry"),
            value: [formData.ville, countryLabel].filter(Boolean).join(", ") || "—",
        },
        { key: t("form.step4.recapTitleFR"), value: formData.titre || "—" },
        { key: t("form.step4.recapTitleEN"), value: formData.titreEn || "—" },
        { key: t("form.step4.recapVideo"), value: videoLabel, ok: videoValid },
        {
            key: t("form.step4.recapProdType"),
            value:
                formData.iaClass === "full"
                    ? t("form.step4.prodFull")
                    : t("form.step4.prodHybrid"),
        },
        { key: t("form.step4.recapAiTools"), value: formData.iaImg || "—" },
        {
            key: t("form.step4.recapSubtitles"),
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
                    <h2 className="font-display text-xl font-extrabold">{t("form.step4.title")}</h2>
                    <p className="text-sm text-mist mt-0.5">
                        {t("form.step4.subtitle")}
                    </p>
                </div>
            </div>

            {/* Récapitulatif */}
            <div className="rounded-xl border border-white/8 overflow-hidden mb-6">
                <div className="bg-white/[0.03] border-b border-white/6 px-5 py-3">
                    <span className="font-display text-sm font-bold text-white-soft">
                        {t("form.step4.recapTitle")}
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
                {t("form.step4.conditionsTitle")}
            </div>

            <div className="grid gap-3 mb-4 rgpd-checks">
                {rgpdItems.map((item, index) => (
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
                                <span className="text-coral text-[0.65rem]">{t("form.step4.mandatory")}</span>
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
                    {t("form.step4.mustAccept")}
                </div>
            )}

            {/* Boutons navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <button
                    type="button"
                    onClick={onPrev}
                    className="bg-white/5 border border-white/10 rounded-[10px] px-6 py-3 text-sm font-semibold text-mist cursor-pointer transition-all hover:text-white-soft hover:border-white/20 font-body"
                >
                    {t("form.prev")}
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
                            <span className="animate-spin">⏳</span> {t("form.step4.submitting")}
                        </>
                    ) : (
                        t("form.step4.submit")
                    )}
                </button>
            </div>
        </div>
    );
};

export default Step4Confirm;
