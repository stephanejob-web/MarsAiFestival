import React, { useRef, useState } from "react";
import useJuryUser from "../hooks/useJuryUser";

const API = import.meta.env.VITE_API_URL as string;

interface ProfileModalProps {
    onClose: () => void;
}

const ProfileModal = ({ onClose }: ProfileModalProps): React.JSX.Element => {
    const user = useJuryUser();
    const [tab, setTab] = useState<"avatar" | "password">("avatar");

    // Avatar state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarMsg, setAvatarMsg] = useState<{ ok: boolean; text: string } | null>(null);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setAvatarMsg(null);
    };

    const handleAvatarSave = async (): Promise<void> => {
        if (!selectedFile) return;
        setAvatarLoading(true);
        setAvatarMsg(null);
        try {
            const token = localStorage.getItem("jury_token") ?? "";
            const formData = new FormData();
            formData.append("avatar", selectedFile);
            const res = await fetch(`${API}/api/auth/profile/avatar`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = (await res.json()) as { success: boolean; token?: string; message?: string };
            if (data.success && data.token) {
                localStorage.setItem("jury_token", data.token);
                window.dispatchEvent(new Event("jury-profile-updated"));
                setAvatarMsg({ ok: true, text: "Avatar mis à jour !" });
                setSelectedFile(null);
            } else {
                setAvatarMsg({ ok: false, text: data.message ?? "Erreur lors de la mise à jour." });
            }
        } catch {
            setAvatarMsg({ ok: false, text: "Erreur réseau." });
        } finally {
            setAvatarLoading(false);
        }
    };

    const handlePasswordSave = async (): Promise<void> => {
        if (newPassword !== confirmPassword) {
            setPwdMsg({ ok: false, text: "Les mots de passe ne correspondent pas." });
            return;
        }
        if (newPassword.length < 8) {
            setPwdMsg({ ok: false, text: "Le mot de passe doit contenir au moins 8 caractères." });
            return;
        }
        setPwdLoading(true);
        setPwdMsg(null);
        try {
            const token = localStorage.getItem("jury_token") ?? "";
            const res = await fetch(`${API}/api/auth/profile/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = (await res.json()) as { success: boolean; message?: string };
            if (data.success) {
                setPwdMsg({ ok: true, text: "Mot de passe changé avec succès !" });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setPwdMsg({ ok: false, text: data.message ?? "Erreur lors du changement." });
            }
        } catch {
            setPwdMsg({ ok: false, text: "Erreur réseau." });
        } finally {
            setPwdLoading(false);
        }
    };

    const currentAvatar = preview ?? user?.profilPicture ?? null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/7 px-6 py-4">
                    <h2 className="font-display text-[1rem] font-extrabold">Mon profil</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-mist hover:bg-white/8 hover:text-white-soft"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/7">
                    {(["avatar", "password"] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            className={`flex-1 py-3 text-[0.82rem] font-semibold transition-colors ${
                                tab === t
                                    ? "border-b-2 border-aurora text-aurora"
                                    : "text-mist hover:text-white-soft"
                            }`}
                        >
                            {t === "avatar" ? "🖼️ Avatar" : "🔑 Mot de passe"}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* ── Avatar tab ── */}
                    {tab === "avatar" && (
                        <div className="flex flex-col items-center gap-5">
                            {/* Preview */}
                            <div
                                className="relative cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {currentAvatar ? (
                                    <img
                                        src={currentAvatar}
                                        alt="avatar"
                                        className="h-24 w-24 rounded-full object-cover ring-4 ring-aurora/30"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande text-2xl font-extrabold text-deep-sky ring-4 ring-aurora/30">
                                        {user?.initials ?? "?"}
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                                    <span className="text-xl">📷</span>
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <p className="text-center text-[0.75rem] text-mist">
                                Cliquez sur l&apos;avatar pour choisir une image
                                <br />
                                <span className="text-mist/50">JPG, PNG, WebP — 5 Mo max</span>
                            </p>

                            {avatarMsg && (
                                <p
                                    className={`text-[0.8rem] ${avatarMsg.ok ? "text-aurora" : "text-coral"}`}
                                >
                                    {avatarMsg.text}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => void handleAvatarSave()}
                                disabled={!selectedFile || avatarLoading}
                                className="w-full rounded-[10px] bg-aurora py-2.5 font-display text-[0.88rem] font-extrabold text-deep-sky transition-opacity hover:opacity-90 disabled:opacity-40"
                            >
                                {avatarLoading ? "Enregistrement…" : "Enregistrer l'avatar"}
                            </button>
                        </div>
                    )}

                    {/* ── Password tab ── */}
                    {tab === "password" && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="mb-1.5 block text-[0.75rem] font-semibold text-mist">
                                    Mot de passe actuel
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-[8px] border border-white/10 bg-white/4 px-3 py-2.5 text-[0.85rem] text-white-soft outline-none placeholder:text-mist/40 focus:border-aurora/40"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[0.75rem] font-semibold text-mist">
                                    Nouveau mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="8 caractères minimum"
                                    className="w-full rounded-[8px] border border-white/10 bg-white/4 px-3 py-2.5 text-[0.85rem] text-white-soft outline-none placeholder:text-mist/40 focus:border-aurora/40"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[0.75rem] font-semibold text-mist">
                                    Confirmer le nouveau mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-[8px] border border-white/10 bg-white/4 px-3 py-2.5 text-[0.85rem] text-white-soft outline-none placeholder:text-mist/40 focus:border-aurora/40"
                                    onKeyDown={(e) => { if (e.key === "Enter") void handlePasswordSave(); }}
                                />
                            </div>

                            {pwdMsg && (
                                <p
                                    className={`text-[0.8rem] ${pwdMsg.ok ? "text-aurora" : "text-coral"}`}
                                >
                                    {pwdMsg.text}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => void handlePasswordSave()}
                                disabled={!newPassword || !confirmPassword || pwdLoading}
                                className="w-full rounded-[10px] bg-aurora py-2.5 font-display text-[0.88rem] font-extrabold text-deep-sky transition-opacity hover:opacity-90 disabled:opacity-40"
                            >
                                {pwdLoading ? "Enregistrement…" : "Changer le mot de passe"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
