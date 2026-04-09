import React, { useEffect, useState } from "react";
import {
    Bell,
    Send,
    Users,
    CheckSquare,
    Square,
    CheckCircle,
    XCircle,
    Smartphone,
    Loader2,
} from "lucide-react";
import { apiFetch } from "../services/api";

interface JuryMember {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profil_picture: string | null;
    push_token: string | null;
}

interface SendResult {
    success: boolean;
    sent: number;
    total: number;
    message?: string;
}

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

const AdminNotificationsPage = (): React.JSX.Element => {
    const [members, setMembers] = useState<JuryMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [result, setResult] = useState<SendResult | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await apiFetch<{ success: boolean; data: JuryMember[] }>(
                    "/api/admin/users",
                    { headers: { Authorization: `Bearer ${getToken()}` } },
                );
                if (data.success) setMembers(data.data);
            } finally {
                setIsLoading(false);
            }
        };
        void load();
    }, []);

    const withToken = members.filter((m) => m.push_token);
    const withoutToken = members.filter((m) => !m.push_token);
    const allSelected = withToken.length > 0 && withToken.every((m) => selected.has(m.id));

    const toggleAll = () => {
        if (allSelected) {
            setSelected(new Set());
        } else {
            setSelected(new Set(withToken.map((m) => m.id)));
        }
    };

    const toggleOne = (id: number) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    };

    const handleSend = async () => {
        if (!title.trim() || !body.trim()) return;
        setIsSending(true);
        setResult(null);
        try {
            const juryIds = selected.size > 0 ? Array.from(selected) : undefined;
            const data = await apiFetch<SendResult>("/api/push/send", {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({
                    title: title.trim(),
                    body: body.trim(),
                    ...(juryIds ? { juryIds } : {}),
                }),
            });
            setResult(data);
            if (data.success) {
                setTitle("");
                setBody("");
                setSelected(new Set());
            }
        } catch {
            setResult({ success: false, sent: 0, total: 0, message: "Erreur lors de l'envoi." });
        } finally {
            setIsSending(false);
        }
    };

    const canSend = title.trim() && body.trim() && !isSending;

    return (
        <div className="p-6 space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Bell size={20} className="text-aurora" />
                <div>
                    <h1 className="text-lg font-semibold text-white">Notifications push</h1>
                    <p className="text-xs text-mist mt-0.5">
                        Envoyez des notifications sur les téléphones des jurés
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* ── Composer ── */}
                <div className="space-y-4">
                    <div className="rounded-xl border border-white/[0.06] bg-surface p-5 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-mist/60">
                            Message
                        </p>

                        {/* Prévisualisation téléphone */}
                        <div className="flex justify-center py-2">
                            <div className="w-56 rounded-2xl border border-white/10 bg-[#1c1c1e] p-3 shadow-xl">
                                <div className="flex items-start gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-aurora/20">
                                        <Smartphone size={14} className="text-aurora" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[0.65rem] font-semibold text-white/60">
                                                MarsAI Festival
                                            </span>
                                            <span className="text-[0.6rem] text-white/30">
                                                maintenant
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-[0.72rem] font-semibold text-white truncate">
                                            {title || "Titre de la notification"}
                                        </p>
                                        <p className="text-[0.68rem] text-white/60 line-clamp-2 leading-snug mt-0.5">
                                            {body || "Corps du message…"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="mb-1.5 block text-[0.75rem] font-medium text-mist">
                                    Titre
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="ex : Nouveaux films assignés"
                                    maxLength={80}
                                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-mist/40 focus:border-aurora/50 focus:ring-1 focus:ring-aurora/20 transition-all"
                                />
                                <p className="mt-1 text-right text-[0.65rem] text-mist/40">
                                    {title.length}/80
                                </p>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[0.75rem] font-medium text-mist">
                                    Message
                                </label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="ex : 3 nouveaux films vous ont été assignés. Connectez-vous pour les évaluer."
                                    maxLength={200}
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-mist/40 focus:border-aurora/50 focus:ring-1 focus:ring-aurora/20 transition-all"
                                />
                                <p className="mt-1 text-right text-[0.65rem] text-mist/40">
                                    {body.length}/200
                                </p>
                            </div>
                        </div>

                        {/* Résultat */}
                        {result && (
                            <div
                                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
                                    result.success
                                        ? "bg-aurora/10 text-aurora border border-aurora/20"
                                        : "bg-coral/10 text-coral border border-coral/20"
                                }`}
                            >
                                {result.success ? (
                                    <CheckCircle size={15} className="shrink-0" />
                                ) : (
                                    <XCircle size={15} className="shrink-0" />
                                )}
                                <span className="text-[0.8rem]">
                                    {result.success
                                        ? `${result.sent} notification${result.sent > 1 ? "s" : ""} envoyée${result.sent > 1 ? "s" : ""} sur ${result.total}`
                                        : (result.message ?? "Erreur lors de l'envoi.")}
                                </span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!canSend}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-aurora px-4 py-2.5 text-sm font-semibold text-deep-sky transition-all hover:bg-aurora/90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isSending ? (
                                <Loader2 size={15} className="animate-spin" />
                            ) : (
                                <Send size={15} />
                            )}
                            {isSending
                                ? "Envoi en cours…"
                                : selected.size > 0
                                  ? `Envoyer à ${selected.size} juré${selected.size > 1 ? "s" : ""}`
                                  : `Envoyer à tous (${withToken.length})`}
                        </button>
                    </div>
                </div>

                {/* ── Destinataires ── */}
                <div className="rounded-xl border border-white/[0.06] bg-surface p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-widest text-mist/60">
                            Destinataires
                        </p>
                        <div className="flex items-center gap-1.5 text-[0.7rem] text-mist/60">
                            <Smartphone size={11} />
                            <span>{withToken.length} token{withToken.length > 1 ? "s" : ""}</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 size={18} className="animate-spin text-aurora/50" />
                        </div>
                    ) : (
                        <>
                            {/* Sélectionner tous */}
                            {withToken.length > 0 && (
                                <button
                                    type="button"
                                    onClick={toggleAll}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.8rem] text-mist hover:bg-white/[0.04] transition-all"
                                >
                                    {allSelected ? (
                                        <CheckSquare size={15} className="text-aurora shrink-0" />
                                    ) : (
                                        <Square size={15} className="shrink-0" />
                                    )}
                                    <Users size={13} className="shrink-0" />
                                    <span>Tous les jurés</span>
                                    <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[0.65rem]">
                                        {withToken.length}
                                    </span>
                                </button>
                            )}

                            <div className="space-y-0.5 max-h-64 overflow-y-auto">
                                {withToken.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => toggleOne(m.id)}
                                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-all hover:bg-white/[0.04]"
                                    >
                                        {selected.has(m.id) ? (
                                            <CheckSquare size={14} className="shrink-0 text-aurora" />
                                        ) : (
                                            <Square size={14} className="shrink-0 text-mist/40" />
                                        )}
                                        {m.profil_picture ? (
                                            <img
                                                src={m.profil_picture}
                                                alt=""
                                                className="h-6 w-6 shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aurora/15 text-[0.55rem] font-bold text-aurora">
                                                {m.first_name[0]}{m.last_name[0]}
                                            </div>
                                        )}
                                        <span className="text-[0.8rem] text-white-soft">
                                            {m.first_name} {m.last_name}
                                        </span>
                                        <Smartphone size={10} className="ml-auto text-aurora/50 shrink-0" />
                                    </button>
                                ))}

                                {/* Jurés sans token */}
                                {withoutToken.length > 0 && (
                                    <>
                                        <p className="px-2.5 pt-3 pb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-mist/40">
                                            Sans token ({withoutToken.length})
                                        </p>
                                        {withoutToken.map((m) => (
                                            <div
                                                key={m.id}
                                                className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 opacity-40"
                                            >
                                                <Square size={14} className="shrink-0 text-mist/40" />
                                                {m.profil_picture ? (
                                                    <img
                                                        src={m.profil_picture}
                                                        alt=""
                                                        className="h-6 w-6 shrink-0 rounded-full object-cover grayscale"
                                                    />
                                                ) : (
                                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[0.55rem] font-bold text-mist">
                                                        {m.first_name[0]}{m.last_name[0]}
                                                    </div>
                                                )}
                                                <span className="text-[0.8rem] text-mist">
                                                    {m.first_name} {m.last_name}
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotificationsPage;
