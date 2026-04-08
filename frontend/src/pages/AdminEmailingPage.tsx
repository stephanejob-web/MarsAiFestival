import React, { useState } from "react";
import { Mail, Send, CheckSquare, Square, Search, Users, CheckCircle, XCircle } from "lucide-react";
import useAdminEmailing from "../features/admin/hooks/useAdminEmailing";

const AdminEmailingPage = (): React.JSX.Element => {
    const { realisators, isLoading, error, isSending, sendResult, sendBulkEmail, setSendResult } =
        useAdminEmailing();

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const filtered = realisators.filter(
        (r) =>
            r.email.toLowerCase().includes(search.toLowerCase()) ||
            r.first_name.toLowerCase().includes(search.toLowerCase()) ||
            r.last_name.toLowerCase().includes(search.toLowerCase()) ||
            r.film_title.toLowerCase().includes(search.toLowerCase()),
    );

    const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.email));

    const toggleAll = () => {
        if (allSelected) {
            const next = new Set(selected);
            filtered.forEach((r) => next.delete(r.email));
            setSelected(next);
        } else {
            const next = new Set(selected);
            filtered.forEach((r) => next.add(r.email));
            setSelected(next);
        }
    };

    const toggleOne = (email: string) => {
        const next = new Set(selected);
        if (next.has(email)) next.delete(email);
        else next.add(email);
        setSelected(next);
    };

    const handleSend = async () => {
        if (!selected.size || !subject.trim() || !message.trim()) return;
        await sendBulkEmail(Array.from(selected), subject, message);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Mail size={20} className="text-aurora" />
                <div>
                    <h1 className="text-lg font-semibold text-white">Emailing réalisateurs</h1>
                    <p className="text-xs text-mist mt-0.5">
                        {realisators.length} réalisateur{realisators.length !== 1 ? "s" : ""} inscrit
                        {realisators.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {sendResult && (
                <div className="bg-aurora/10 border border-aurora/30 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                        <CheckCircle size={16} className="text-aurora" />
                        <span className="text-aurora font-medium">{sendResult.sent} email{sendResult.sent !== 1 ? "s" : ""} envoyé{sendResult.sent !== 1 ? "s" : ""}</span>
                        {sendResult.failed > 0 && (
                            <span className="text-red-400 flex items-center gap-1">
                                <XCircle size={14} />
                                {sendResult.failed} échoué{sendResult.failed !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setSendResult(null)}
                        className="text-mist hover:text-white text-xs"
                    >
                        Fermer
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Liste réalisateurs */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                        <button
                            onClick={toggleAll}
                            className="text-mist hover:text-aurora transition-colors"
                            title={allSelected ? "Tout désélectionner" : "Tout sélectionner"}
                        >
                            {allSelected ? (
                                <CheckSquare size={16} className="text-aurora" />
                            ) : (
                                <Square size={16} />
                            )}
                        </button>
                        <div className="relative flex-1">
                            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mist" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-sm text-white placeholder:text-mist focus:outline-none focus:border-aurora/50"
                            />
                        </div>
                        <span className="text-xs text-mist whitespace-nowrap">
                            <Users size={12} className="inline mr-1" />
                            {selected.size} sélectionné{selected.size !== 1 ? "s" : ""}
                        </span>
                    </div>

                    <div className="overflow-y-auto max-h-[480px]">
                        {isLoading ? (
                            <div className="py-12 text-center text-mist text-sm">Chargement...</div>
                        ) : filtered.length === 0 ? (
                            <div className="py-12 text-center text-mist text-sm">Aucun résultat</div>
                        ) : (
                            filtered.map((r) => (
                                <button
                                    key={r.email}
                                    onClick={() => toggleOne(r.email)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.05] last:border-0 text-left"
                                >
                                    <div className="flex-shrink-0 text-mist hover:text-aurora transition-colors">
                                        {selected.has(r.email) ? (
                                            <CheckSquare size={15} className="text-aurora" />
                                        ) : (
                                            <Square size={15} />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-white truncate">
                                                {r.first_name} {r.last_name}
                                            </span>
                                            {r.newsletter && (
                                                <span className="text-[10px] bg-aurora/10 text-aurora border border-aurora/20 rounded px-1.5 py-0.5 flex-shrink-0">
                                                    newsletter
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-mist truncate">{r.email}</div>
                                        <div className="text-xs text-white/40 truncate mt-0.5">
                                            {r.film_title} · {r.dossier_num}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Formulaire email */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 flex flex-col gap-4">
                    <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Send size={14} className="text-aurora" />
                        Composer l'email
                    </h2>

                    <div>
                        <label className="block text-xs text-mist mb-1.5">Destinataires</label>
                        <div className="bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm text-mist min-h-[38px]">
                            {selected.size === 0 ? (
                                <span className="italic">Sélectionnez des réalisateurs</span>
                            ) : (
                                <span className="text-aurora font-medium">
                                    {selected.size} destinataire{selected.size !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-mist mb-1.5">Sujet *</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Objet de l'email..."
                            className="w-full bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-mist focus:outline-none focus:border-aurora/50"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-xs text-mist mb-1.5">Message *</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Votre message..."
                            rows={10}
                            className="w-full bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-mist focus:outline-none focus:border-aurora/50 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={isSending || !selected.size || !subject.trim() || !message.trim()}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-aurora text-night font-semibold text-sm rounded-lg hover:bg-aurora/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Send size={14} />
                        {isSending
                            ? "Envoi en cours..."
                            : `Envoyer à ${selected.size} destinataire${selected.size !== 1 ? "s" : ""}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminEmailingPage;
