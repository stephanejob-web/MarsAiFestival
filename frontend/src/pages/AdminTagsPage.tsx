import React, { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

interface VoteTag {
    id: number;
    key: string;
    label: string;
    icon: string;
    color: string;
    message_template: string | null;
    is_active: boolean;
    sort_order: number;
}

const COLOR_OPTIONS = ["aurora", "solar", "coral", "lavande", "mist"];

const COLOR_PREVIEW: Record<string, string> = {
    aurora: "bg-aurora",
    solar: "bg-solar",
    coral: "bg-coral",
    lavande: "bg-lavande",
    mist: "bg-mist",
};

const EMPTY_FORM = { key: "", label: "", icon: "", color: "aurora", sort_order: 0, message_template: "" };

const AdminTagsPage = (): React.JSX.Element => {
    const [tags, setTags] = useState<VoteTag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiFetch<{ success: boolean; data: VoteTag[] }>(
                "/api/vote-tags/all",
                { headers: { Authorization: `Bearer ${getToken()}` } },
            );
            if (res.success) setTags(res.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const handleSubmit = async (): Promise<void> => {
        if (!form.key || !form.label || !form.icon || !form.color) {
            setError("Tous les champs sont requis.");
            return;
        }
        try {
            if (editingId !== null) {
                await apiFetch(`/api/vote-tags/${editingId}`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        label: form.label,
                        icon: form.icon,
                        color: form.color,
                        isActive: true,
                        sortOrder: form.sort_order,
                        messageTemplate: form.message_template || null,
                    }),
                });
            } else {
                await apiFetch("/api/vote-tags", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...form,
                        sortOrder: form.sort_order,
                        messageTemplate: form.message_template || null,
                    }),
                });
            }
            setForm(EMPTY_FORM);
            setEditingId(null);
            setShowForm(false);
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
        }
    };

    const handleToggleActive = async (tag: VoteTag): Promise<void> => {
        try {
            await apiFetch(`/api/vote-tags/${tag.id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    label: tag.label,
                    icon: tag.icon,
                    color: tag.color,
                    isActive: !tag.is_active,
                    sortOrder: tag.sort_order,
                    messageTemplate: tag.message_template ?? null,
                }),
            });
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur");
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        try {
            await apiFetch(`/api/vote-tags/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setConfirmDeleteId(null);
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
        }
    };

    const startEdit = (tag: VoteTag): void => {
        setForm({
            key: tag.key,
            label: tag.label,
            icon: tag.icon,
            color: tag.color,
            sort_order: tag.sort_order,
            message_template: tag.message_template ?? "",
        });
        setEditingId(tag.id);
        setShowForm(true);
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* Topbar */}
            <div className="flex h-[50px] min-h-[50px] items-center gap-3 border-b border-white/[0.06] bg-surface px-5">
                <span className="font-display text-[0.88rem] font-extrabold text-white-soft">
                    Étiquettes de décision
                </span>
                <div className="h-[18px] w-px bg-white/[0.08]" />
                <span className="text-[0.75rem] text-mist">
                    Tags affichés dans les popups « À revoir » et « Refuser » du jury
                </span>
                <div className="ml-auto">
                    <button
                        type="button"
                        onClick={() => {
                            setForm(EMPTY_FORM);
                            setEditingId(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 rounded-[9px] bg-aurora px-[18px] py-2 font-display text-[0.82rem] font-extrabold text-deep-sky transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(78,255,206,0.35)]"
                    >
                        + Nouvelle étiquette
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {error && (
                    <div className="mb-5 rounded-xl border border-coral/20 bg-coral/10 px-4 py-3 text-[0.82rem] text-coral">
                        {error}
                    </div>
                )}

                {/* Form */}
                {showForm && (
                    <div className="mb-6 rounded-xl border border-white/[0.08] bg-surface-2 p-5">
                        <div className="mb-4 font-display text-[0.9rem] font-extrabold text-white-soft">
                            {editingId !== null ? "Modifier l'étiquette" : "Nouvelle étiquette"}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                    Clé (unique, sans espace)
                                </label>
                                <input
                                    type="text"
                                    value={form.key}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            key: e.target.value
                                                .toLowerCase()
                                                .replace(/\s/g, "_"),
                                        }))
                                    }
                                    disabled={editingId !== null}
                                    placeholder="ex: droits_musicaux"
                                    className="w-full rounded-[8px] border border-white/[0.09] bg-white/[0.04] px-3 py-2 text-[0.82rem] text-white-soft outline-none placeholder:text-mist disabled:opacity-50 focus:border-aurora/40"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                    Label affiché
                                </label>
                                <input
                                    type="text"
                                    value={form.label}
                                    onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                                    placeholder="ex: Droits musicaux"
                                    className="w-full rounded-[8px] border border-white/[0.09] bg-white/[0.04] px-3 py-2 text-[0.82rem] text-white-soft outline-none placeholder:text-mist focus:border-aurora/40"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                    Icône (emoji)
                                </label>
                                <input
                                    type="text"
                                    value={form.icon}
                                    onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                                    placeholder="ex: 🎵"
                                    className="w-full rounded-[8px] border border-white/[0.09] bg-white/[0.04] px-3 py-2 text-[0.82rem] text-white-soft outline-none placeholder:text-mist focus:border-aurora/40"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                    Couleur
                                </label>
                                <div className="flex gap-2">
                                    {COLOR_OPTIONS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setForm((f) => ({ ...f, color: c }))}
                                            title={c}
                                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${COLOR_PREVIEW[c]} ${form.color === c ? "ring-2 ring-white/60 ring-offset-1 ring-offset-surface-2" : "opacity-50 hover:opacity-80"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                    Ordre d&apos;affichage
                                </label>
                                <input
                                    type="number"
                                    value={form.sort_order}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                                    }
                                    className="w-full rounded-[8px] border border-white/[0.09] bg-white/[0.04] px-3 py-2 text-[0.82rem] text-white-soft outline-none focus:border-aurora/40"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                Modèle de message{" "}
                                <span className="normal-case font-normal opacity-60">
                                    (pré-rempli automatiquement à la sélection du tag)
                                </span>
                            </label>
                            <textarea
                                value={form.message_template}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, message_template: e.target.value }))
                                }
                                placeholder="Bonjour,&#10;&#10;Votre message ici…&#10;&#10;Cordialement,&#10;Le jury marsAI Festival 2026"
                                rows={5}
                                className="w-full resize-none rounded-[8px] border border-white/[0.09] bg-white/[0.04] px-3 py-2 text-[0.82rem] text-white-soft outline-none placeholder:text-mist focus:border-aurora/40"
                            />
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setForm(EMPTY_FORM);
                                }}
                                className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.82rem] text-mist hover:bg-white/[0.08]"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleSubmit()}
                                className="rounded-[8px] bg-aurora px-5 py-2 font-display text-[0.82rem] font-extrabold text-deep-sky hover:opacity-90"
                            >
                                {editingId !== null ? "Enregistrer" : "Créer"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Tags list */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-[0.82rem] text-mist">
                        Chargement…
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-surface-2">
                                    <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                        Aperçu
                                    </th>
                                    <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                        Clé
                                    </th>
                                    <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                        Label
                                    </th>
                                    <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                        Couleur
                                    </th>
                                    <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                        Ordre
                                    </th>
                                    <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                        Statut
                                    </th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {tags.map((tag) => (
                                    <tr
                                        key={tag.id}
                                        className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] ${!tag.is_active ? "opacity-40" : ""}`}
                                    >
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1.5 rounded-[6px] border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.78rem] text-mist">
                                                <span
                                                    className={`h-[6px] w-[6px] shrink-0 rounded-full ${COLOR_PREVIEW[tag.color] ?? "bg-mist"}`}
                                                />
                                                <span>{tag.icon}</span>
                                                {tag.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-[0.78rem] text-mist">
                                            {tag.key}
                                        </td>
                                        <td className="px-4 py-3 text-[0.82rem] text-white-soft">
                                            {tag.label}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1.5 text-[0.78rem] text-mist">
                                                <span
                                                    className={`h-3 w-3 rounded-full ${COLOR_PREVIEW[tag.color] ?? "bg-mist"}`}
                                                />
                                                {tag.color}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-[0.78rem] text-mist">
                                            {tag.sort_order}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => void handleToggleActive(tag)}
                                                className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold transition-all ${
                                                    tag.is_active
                                                        ? "border border-aurora/20 bg-aurora/10 text-aurora hover:bg-aurora/20"
                                                        : "border border-white/10 bg-white/[0.04] text-mist hover:bg-white/[0.08]"
                                                }`}
                                            >
                                                {tag.is_active ? "Actif" : "Inactif"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => startEdit(tag)}
                                                    className="rounded-[6px] border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.72rem] text-mist hover:text-white-soft"
                                                >
                                                    Modifier
                                                </button>
                                                {confirmDeleteId === tag.id ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => void handleDelete(tag.id)}
                                                        className="rounded-[6px] border border-coral/30 bg-coral/10 px-2.5 py-1 text-[0.72rem] font-semibold text-coral"
                                                    >
                                                        Confirmer
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDeleteId(tag.id)}
                                                        className="rounded-[6px] border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.72rem] text-mist hover:border-coral/20 hover:text-coral"
                                                    >
                                                        Supprimer
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {tags.length === 0 && (
                            <div className="py-10 text-center text-[0.82rem] text-mist">
                                Aucune étiquette configurée.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTagsPage;
