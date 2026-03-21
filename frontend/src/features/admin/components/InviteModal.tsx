import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "../../../constants/api";

interface InviteModalProps {
    onClose: () => void;
}

const InviteModal = ({ onClose }: InviteModalProps): React.JSX.Element => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSend = async (): Promise<void> => {
        if (!email.trim()) return;
        setStatus("loading");
        setErrorMsg("");
        try {
            const token = localStorage.getItem("jury_token");
            const res = await fetch(`${API_BASE_URL}/api/admin/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token ?? ""}`,
                },
                body: JSON.stringify({ email: email.trim(), role: "jury" }),
            });
            const data = (await res.json()) as { success: boolean; message?: string };
            if (!res.ok || !data.success) {
                setErrorMsg(data.message ?? "Erreur lors de l'envoi.");
                setStatus("error");
                return;
            }
            setStatus("success");
        } catch {
            setErrorMsg("Impossible de contacter le serveur.");
            setStatus("error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-7 shadow-2xl">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="font-display text-[1.05rem] font-extrabold text-white-soft">
                            Inviter un membre
                        </h2>
                        <p className="mt-0.5 text-[0.75rem] text-mist">
                            Un lien d'accès sera envoyé par email (valable 48h)
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-mist/50 transition-all hover:bg-white/8 hover:text-white-soft"
                    >
                        <X size={14} />
                    </button>
                </div>

                {status === "success" ? (
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                        <CheckCircle2 size={44} className="text-aurora" />
                        <p className="text-[0.9rem] font-semibold text-aurora">
                            Invitation envoyée à <span className="text-white-soft">{email}</span>
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-2 rounded-lg bg-aurora/10 px-5 py-2 text-[0.82rem] font-semibold text-aurora hover:bg-aurora/20"
                        >
                            Fermer
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                Adresse email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") void handleSend();
                                }}
                                placeholder="prenom.nom@email.com"
                                className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2.5 text-[0.88rem] text-white-soft outline-none placeholder:text-mist/40 focus:border-aurora/40"
                                autoFocus
                            />
                        </div>

                        {/* Erreur */}
                        {status === "error" && (
                            <div className="rounded-lg border border-coral/20 bg-coral/10 px-3 py-2.5 text-[0.78rem] text-coral">
                                {errorMsg}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-[9px] border border-white/10 py-2.5 text-[0.82rem] text-mist hover:bg-white/5"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleSend()}
                                disabled={!email.trim() || status === "loading"}
                                className="flex-1 rounded-[9px] bg-aurora py-2.5 font-display text-[0.82rem] font-extrabold text-deep-sky transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(78,255,206,0.35)] disabled:opacity-50"
                            >
                                {status === "loading" ? "Envoi…" : "✉ Envoyer l'invitation"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InviteModal;
