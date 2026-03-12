import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface YTStep {
    id: string;
    label: string;
    done: boolean;
}

type YTResult = "pending" | "approved" | "rejected";

interface SuccessScreenProps {
    dossierNum: string;
    email: string;
    prenom: string;
    titre: string;
    youtubeWarning?: string;
}

const SuccessScreen = ({
    dossierNum,
    email,
    prenom,
    titre,
    youtubeWarning,
}: SuccessScreenProps): React.JSX.Element => {
    const { t } = useTranslation();
    const [ytResult, setYtResult] = useState<YTResult>("pending");
    const [ytPct, setYtPct] = useState<number>(0);
    const [ytStepLabel, setYtStepLabel] = useState<string>("");
    const [ytSteps, setYtSteps] = useState<YTStep[]>([
        { id: "upload", label: t("form.success.ytStepUpload"), done: false },
        { id: "copyright", label: t("form.success.ytStepCopyright"), done: false },
        { id: "policy", label: t("form.success.ytStepPolicy"), done: false },
        { id: "confirm", label: t("form.success.ytStepConfirm"), done: false },
    ]);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const labels = [
            t("form.success.ytLabel0"),
            t("form.success.ytLabel1"),
            t("form.success.ytLabel2"),
            t("form.success.ytLabel3"),
        ];

        setYtStepLabel(labels[0] ?? "");

        let step = 0;
        intervalRef.current = setInterval(() => {
            step++;
            if (step >= 4) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setYtPct(100);
                setYtSteps((prev) => prev.map((s) => ({ ...s, done: true })));
                setYtStepLabel(t("form.success.ytDone"));
                setYtResult("approved");
                return;
            }
            setYtPct(step * 25);
            setYtStepLabel(labels[step] ?? "");
            setYtSteps((prev) => prev.map((s, i) => (i < step ? { ...s, done: true } : s)));
        }, 1800);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="form-animate-in text-center max-w-lg mx-auto py-8">
            {/* En-tête dossier */}
            <div className="w-20 h-20 rounded-full bg-aurora/10 border-2 border-aurora/25 flex items-center justify-center text-4xl mx-auto mb-5 animate-[popIn_0.5s_ease]">
                🎬
            </div>
            <h2 className="font-display text-3xl font-extrabold mb-2">{t("form.success.title")}</h2>
            <p className="text-sm text-mist mb-0">
                {t("form.success.desc")}
            </p>

            <div className="inline-block bg-white/4 border border-white/10 rounded-xl px-5 py-3 mt-4 mb-3 font-mono text-sm text-aurora">
                {t("form.success.dossierLabel")} {dossierNum}
            </div>

            <p className="text-xs text-mist mb-5">
                {t("form.success.emailSentTo")} <strong className="text-white-soft">{email}</strong>
            </p>

            {/* Avertissement YouTube si upload échoué */}
            {youtubeWarning && (
                <div className="text-left bg-solar/5 border border-solar/25 rounded-xl px-4 py-3 flex items-start gap-3 mb-4">
                    <span className="text-base shrink-0">⚠️</span>
                    <p className="text-xs text-solar leading-relaxed">{youtubeWarning}</p>
                </div>
            )}

            {/* Upload dual info */}
            <div className="text-left bg-white/3 border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3 mb-5">
                <span className="text-base">📤</span>
                <div className="text-xs text-mist leading-relaxed">
                    {t("form.success.dualUpload")}
                </div>
            </div>

            {/* YouTube validation — pending */}
            {ytResult === "pending" && (
                <div className="text-left rounded-2xl border border-white/9 overflow-hidden mb-6 bg-white/3">
                    <div className="bg-white/3 border-b border-white/6 px-5 py-3 flex items-center gap-3">
                        <span className="text-base">▶️</span>
                        <span className="text-[0.75rem] font-bold tracking-wider uppercase text-mist">
                            {t("form.success.ytTitle")}
                        </span>
                        <span className="ml-auto text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-solar/10 border border-solar/25 text-solar">
                            {t("form.success.ytPending")}
                        </span>
                    </div>
                    <div className="p-5">
                        {/* Progress bar */}
                        <div className="mb-3.5">
                            <div className="flex justify-between text-[0.72rem] text-mist mb-1.5">
                                <span>{ytStepLabel}</span>
                                <span className="font-mono">{ytPct}%</span>
                            </div>
                            <div className="h-1 bg-white/6 rounded-sm overflow-hidden">
                                <div
                                    className="h-full rounded-sm transition-[width] duration-300"
                                    style={{
                                        width: `${ytPct}%`,
                                        background: "linear-gradient(90deg, #FF0000, #FF4444)",
                                    }}
                                />
                            </div>
                        </div>
                        {/* Steps */}
                        <div className="flex flex-col gap-1.5">
                            {ytSteps.map((s, i) => (
                                <div key={s.id} className="flex items-center gap-2 text-xs">
                                    <span className={s.done ? "" : i === 0 ? "" : "opacity-30"}>
                                        {s.done ? "✅" : i === 0 ? "⏳" : "○"}
                                    </span>
                                    <span
                                        className={`${!s.done && i > 0 ? "opacity-40" : ""} text-mist`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* YouTube approved */}
            {ytResult === "approved" && (
                <div className="text-left rounded-2xl bg-aurora/5 border border-aurora/20 px-6 py-5 mb-6">
                    <div className="flex items-center gap-3 mb-3.5">
                        <div className="w-10 h-10 rounded-full bg-aurora/10 border-[1.5px] border-aurora/30 flex items-center justify-center text-xl shrink-0">
                            ✓
                        </div>
                        <div>
                            <div className="font-bold text-aurora text-sm">
                                {t("form.success.ytApproved")}
                            </div>
                            <div className="text-xs text-mist mt-0.5">
                                {t("form.success.ytApprovedDesc")}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs text-mist">
                            <span>⏳</span> {t("form.success.ytJury")}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-mist">
                            <span>📢</span> {t("form.success.ytFinalists")}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-mist">
                            <span>🏆</span> {t("form.success.ytCeremony")}
                        </div>
                    </div>
                </div>
            )}

            {/* YouTube rejected */}
            {ytResult === "rejected" && (
                <div className="text-left mb-6">
                    <div className="rounded-2xl bg-coral/6 border border-coral/25 px-6 py-5 mb-4">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-coral/10 border-[1.5px] border-coral/30 flex items-center justify-center text-xl shrink-0">
                                ✗
                            </div>
                            <div>
                                <div className="font-bold text-coral text-sm">
                                    {t("form.success.ytRejected")}
                                </div>
                                <div className="text-xs text-mist mt-0.5">
                                    {t("form.success.ytRejectedDesc")}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-mist leading-relaxed border-t border-coral/12 pt-3.5">
                            {t("form.success.ytRejectedText")}
                        </div>
                    </div>

                    {/* Email preview */}
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                        <div className="bg-white/4 border-b border-white/7 px-5 py-3 flex items-center gap-2.5">
                            <span>✉️</span>
                            <span className="text-[0.72rem] font-bold tracking-wider uppercase text-mist">
                                {t("form.success.emailAutoTitle")}
                            </span>
                            <span className="font-mono text-xs text-aurora">{email}</span>
                        </div>
                        <div className="px-5 py-5 text-sm text-mist leading-relaxed">
                            <div className="font-bold text-white-soft mb-3 text-sm">
                                {t("form.success.emailSubject")} {dossierNum}
                            </div>
                            <p>
                                Bonjour <strong className="text-white-soft">{prenom}</strong>,
                            </p>
                            <p className="mt-2">
                                Nous avons bien reçu votre film{" "}
                                <em className="text-white-soft">&quot;{titre}&quot;</em> (dossier{" "}
                                {dossierNum}).
                            </p>
                            <p className="mt-2">
                                Malheureusement, lors de la mise en ligne sur notre plateforme de
                                diffusion, YouTube a automatiquement détecté un contenu non
                                conforme.
                            </p>
                            <p className="mt-3">
                                Pour toute question :{" "}
                                <span className="text-aurora">contact@marsai.fr</span>
                            </p>
                            <p className="mt-3">
                                Cordialement,
                                <br />
                                <strong className="text-white-soft">{t("form.success.emailTeam")}</strong>
                                <br />
                                <span className="text-xs opacity-60">
                                    {t("form.success.emailPartners")}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Bouton retour */}
            <Link
                to="/"
                className="inline-block bg-white/6 border border-white/12 rounded-[10px] px-6 py-3 text-sm text-mist no-underline mt-2 hover:text-white-soft hover:border-white/20 transition-all"
            >
                {t("form.success.backHome")}
            </Link>
        </div>
    );
};

export default SuccessScreen;
