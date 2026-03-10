import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
}

const SuccessScreen = ({
    dossierNum,
    email,
    prenom,
    titre,
}: SuccessScreenProps): React.JSX.Element => {
    const [ytResult, setYtResult] = useState<YTResult>("pending");
    const [ytPct, setYtPct] = useState<number>(0);
    const [ytStepLabel, setYtStepLabel] = useState<string>(
        "Upload sur la chaîne YouTube sécurisée…",
    );
    const [ytSteps, setYtSteps] = useState<YTStep[]>([
        { id: "upload", label: "Upload vidéo", done: false },
        { id: "copyright", label: "Vérification copyright Content ID", done: false },
        { id: "policy", label: "Analyse contenu (politique YouTube)", done: false },
        { id: "confirm", label: "Confirmation et indexation", done: false },
    ]);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const labels = [
            "Upload sur la chaîne YouTube sécurisée…",
            "Vérification Copyright Content ID…",
            "Analyse du contenu (politique YouTube)…",
            "Confirmation et indexation…",
        ];

        let step = 0;
        intervalRef.current = setInterval(() => {
            step++;
            if (step >= 4) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setYtPct(100);
                setYtSteps((prev) => prev.map((s) => ({ ...s, done: true })));
                setYtStepLabel("Terminé !");
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
    }, []);

    return (
        <div className="form-animate-in text-center max-w-lg mx-auto py-8">
            {/* En-tête dossier */}
            <div className="w-20 h-20 rounded-full bg-aurora/10 border-2 border-aurora/25 flex items-center justify-center text-4xl mx-auto mb-5 animate-[popIn_0.5s_ease]">
                🎬
            </div>
            <h2 className="font-display text-3xl font-extrabold mb-2">Dossier enregistré !</h2>
            <p className="text-sm text-mist mb-0">
                Votre film a été reçu. Une confirmation a été envoyée à votre adresse validée.
            </p>

            <div className="inline-block bg-white/4 border border-white/10 rounded-xl px-5 py-3 mt-4 mb-3 font-mono text-sm text-aurora">
                📄 Dossier n° {dossierNum}
            </div>

            <p className="text-xs text-mist mb-5">
                Email de confirmation envoyé à <strong className="text-white-soft">{email}</strong>
            </p>

            {/* Upload dual info */}
            <div className="text-left bg-white/3 border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3 mb-5">
                <span className="text-base">📤</span>
                <div className="text-xs text-mist leading-relaxed">
                    Votre film est uploadé simultanément sur{" "}
                    <strong className="text-white-soft">le serveur du festival</strong> et sur la{" "}
                    <strong className="text-white-soft">chaîne YouTube sécurisée</strong> du
                    festival (avec les sous-titres).
                </div>
            </div>

            {/* YouTube validation — pending */}
            {ytResult === "pending" && (
                <div className="text-left rounded-2xl border border-white/9 overflow-hidden mb-6 bg-white/3">
                    <div className="bg-white/3 border-b border-white/6 px-5 py-3 flex items-center gap-3">
                        <span className="text-base">▶️</span>
                        <span className="text-[0.75rem] font-bold tracking-wider uppercase text-mist">
                            Validation YouTube API
                        </span>
                        <span className="ml-auto text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-solar/10 border border-solar/25 text-solar">
                            ⏳ En cours…
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
                                Film validé par YouTube
                            </div>
                            <div className="text-xs text-mist mt-0.5">
                                Aucune violation détectée — votre film est en compétition
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs text-mist">
                            <span>⏳</span> Présélection jury — résultats sous 1 mois
                        </div>
                        <div className="flex items-center gap-2 text-xs text-mist">
                            <span>📢</span> Les 50 finalistes annoncés à J+90
                        </div>
                        <div className="flex items-center gap-2 text-xs text-mist">
                            <span>🏆</span> Cérémonie à Marseille · Mars.AI Night
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
                                    Film rejeté par YouTube
                                </div>
                                <div className="text-xs text-mist mt-0.5">
                                    Violation de la politique de contenu détectée
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-mist leading-relaxed border-t border-coral/12 pt-3.5">
                            Votre film n&apos;a pas pu être publié car YouTube a détecté un contenu
                            non conforme à sa politique (contenu inapproprié, violation de droits
                            d&apos;auteur, etc.).
                        </div>
                    </div>

                    {/* Email preview */}
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                        <div className="bg-white/4 border-b border-white/7 px-5 py-3 flex items-center gap-2.5">
                            <span>✉️</span>
                            <span className="text-[0.72rem] font-bold tracking-wider uppercase text-mist">
                                Email envoyé automatiquement à
                            </span>
                            <span className="font-mono text-xs text-aurora">{email}</span>
                        </div>
                        <div className="px-5 py-5 text-sm text-mist leading-relaxed">
                            <div className="font-bold text-white-soft mb-3 text-sm">
                                Objet : [marsAI 2026] Votre film nécessite une nouvelle soumission —
                                Dossier {dossierNum}
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
                                <strong className="text-white-soft">L&apos;équipe marsAI</strong>
                                <br />
                                <span className="text-xs opacity-60">
                                    La Plateforme × Mobile Film Festival
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
                ← Retour au site
            </Link>
        </div>
    );
};

export default SuccessScreen;
