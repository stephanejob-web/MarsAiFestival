import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { API_BASE_URL } from "../../../constants/api";

interface JuryShowcaseMember {
    id: number;
    name: string;
    display_role: string;
    badge: string;
    quote: string | null;
    photo_url: string | null;
    is_featured: number;
    sort_order: number;
    is_active: number;
}

const emptyAddForm = {
    name: "",
    display_role: "",
    badge: "Membre du Jury",
    photo_url: "",
    quote: "",
    is_featured: 0,
};

const inputClass =
    "w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[0.78rem] text-white-soft outline-none transition-colors placeholder:text-mist/40 focus:border-aurora/40";

// ── Photo upload widget ────────────────────────────────────────────────────────
interface PhotoFieldProps {
    value: string;
    onChange: (url: string) => void;
    token: string | null;
}

const PhotoField = ({ value, onChange, token }: PhotoFieldProps): React.JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (file: File) => {
        setError(null);
        setUploading(true);
        const form = new FormData();
        form.append("photo", file);
        try {
            const res = await fetch(`${API_BASE_URL}/api/jury-showcase/upload-photo`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: form,
            });
            const json = await res.json();
            if (json.success) {
                onChange(json.url);
            } else {
                setError("Erreur upload");
            }
        } catch {
            setError("Erreur réseau");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="block text-[0.67rem] text-mist">Photo</label>
            <div className="flex gap-2">
                {/* Preview */}
                <div
                    className="flex h-[52px] w-[44px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[8px] border border-dashed border-aurora/25 bg-white/[0.03] transition-colors hover:border-aurora/50"
                    onClick={() => inputRef.current?.click()}
                    title="Cliquer pour changer la photo"
                >
                    {value ? (
                        <img src={value} className="h-full w-full object-cover object-top" />
                    ) : (
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            className="text-mist/30"
                        >
                            <rect
                                x="1.5"
                                y="3"
                                width="15"
                                height="12"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="1.3"
                            />
                            <circle cx="6" cy="7.5" r="1.5" fill="currentColor" opacity="0.5" />
                            <path
                                d="M1.5 13l4-4 3 3 2.5-2.5L15 13"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.5"
                            />
                        </svg>
                    )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {/* Upload button */}
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-1.5 rounded-md border border-aurora/20 bg-aurora/5 px-2.5 py-1 text-[0.72rem] text-aurora transition-all hover:border-aurora/40 hover:bg-aurora/10 disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <svg
                                    className="h-3 w-3 animate-spin"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                >
                                    <circle
                                        cx="6"
                                        cy="6"
                                        r="4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeDasharray="16 8"
                                    />
                                </svg>
                                Upload…
                            </>
                        ) : (
                            <>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                    <path
                                        d="M5.5 1v7M3 3.5l2.5-2.5L8 3.5"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M1 8.5v1a.5.5 0 00.5.5h8a.5.5 0 00.5-.5v-1"
                                        stroke="currentColor"
                                        strokeWidth="1.3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Uploader une photo
                            </>
                        )}
                    </button>
                    {/* URL input (fallback) */}
                    <input
                        type="text"
                        placeholder="ou coller une URL…"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>
            {error && <p className="text-[0.65rem] text-coral">{error}</p>}
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                    e.target.value = "";
                }}
            />
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const CmsJury = (): React.JSX.Element => {
    const [members, setMembers] = useState<JuryShowcaseMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [addForm, setAddForm] = useState({ ...emptyAddForm });
    const [addSaving, setAddSaving] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<JuryShowcaseMember>>({});
    const [savingId, setSavingId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const token = localStorage.getItem("jury_token");

    const fetchMembers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/jury-showcase/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) setMembers(json.data);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchMembers();
    }, []);

    const handleAdd = async () => {
        if (!addForm.name || !addForm.display_role) return;
        setAddSaving(true);
        try {
            const sort_order = members.length;
            const res = await fetch(`${API_BASE_URL}/api/jury-showcase`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    ...addForm,
                    photo_url: addForm.photo_url || null,
                    quote: addForm.quote || null,
                    sort_order,
                    is_active: 1,
                }),
            });
            const json = await res.json();
            if (json.success) {
                setAddForm({ ...emptyAddForm });
                setShowAddForm(false);
                await fetchMembers();
            }
        } finally {
            setAddSaving(false);
        }
    };

    const startEdit = (member: JuryShowcaseMember) => {
        setEditingId(member.id);
        setEditForm({
            name: member.name,
            display_role: member.display_role,
            badge: member.badge,
            quote: member.quote ?? "",
            photo_url: member.photo_url ?? "",
            is_featured: member.is_featured,
            sort_order: member.sort_order,
            is_active: member.is_active,
        });
    };

    const handleUpdate = async (id: number) => {
        setSavingId(id);
        try {
            const payload = {
                ...editForm,
                photo_url: editForm.photo_url || null,
                quote: editForm.quote || null,
            };
            const res = await fetch(`${API_BASE_URL}/api/jury-showcase/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (json.success) {
                setEditingId(null);
                setEditForm({});
                await fetchMembers();
            }
        } finally {
            setSavingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/jury-showcase/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) {
                setConfirmDeleteId(null);
                await fetchMembers();
            }
        } catch {
            /* silently fail */
        }
    };

    const toggleActive = async (member: JuryShowcaseMember) => {
        try {
            await fetch(`${API_BASE_URL}/api/jury-showcase/${member.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ is_active: member.is_active === 1 ? 0 : 1 }),
            });
            await fetchMembers();
        } catch {
            /* silently fail */
        }
    };

    const toggleFeatured = async (member: JuryShowcaseMember) => {
        if (member.is_featured === 1) return;
        try {
            await Promise.all(
                members
                    .filter((m) => m.is_featured === 1)
                    .map((m) =>
                        fetch(`${API_BASE_URL}/api/jury-showcase/${m.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ is_featured: 0 }),
                        }),
                    ),
            );
            await fetch(`${API_BASE_URL}/api/jury-showcase/${member.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ is_featured: 1 }),
            });
            await fetchMembers();
        } catch {
            /* silently fail */
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.05] bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-3 pt-[18px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-coral/20 bg-coral/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="6" cy="5" r="2.5" stroke="#f87171" strokeWidth="1.4" />
                        <path
                            d="M1.5 14c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5"
                            stroke="#f87171"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                        />
                        <circle cx="12" cy="5" r="2" stroke="#f87171" strokeWidth="1.3" />
                        <path
                            d="M14.5 14c0-1.933-1.343-3.5-3-3.5"
                            stroke="#f87171"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Jury · Page d'accueil
                    </div>
                    <div className="text-[0.71rem] text-mist">
                        {members.length > 0
                            ? `${members.length} membres · modifiables en temps réel`
                            : "Gérez les membres visibles publiquement"}
                    </div>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[0.65rem] text-mist">
                        {members.filter((m) => m.is_active === 1).length} actifs
                    </span>
                    <span className="rounded-md border border-aurora/20 bg-aurora/5 px-2 py-0.5 font-mono text-[0.65rem] text-aurora">
                        ⭐ {members.filter((m) => m.is_featured === 1).length} vedette
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-white/[0.05] px-5 pb-5 pt-4">
                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-[0.78rem] text-mist">
                        <svg
                            className="h-4 w-4 animate-spin opacity-50"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            />
                        </svg>
                        Chargement…
                    </div>
                ) : members.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/10 py-8 text-center text-[0.78rem] text-mist">
                        Aucun membre dans le jury.
                        <br />
                        <span className="text-aurora/60">
                            Cliquez sur « Ajouter » pour commencer.
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className={`rounded-xl border transition-all ${
                                    editingId === member.id
                                        ? "border-coral/20 bg-coral/[0.04]"
                                        : "border-white/[0.05] bg-white/[0.02] hover:border-white/10"
                                }`}
                            >
                                {editingId === member.id ? (
                                    /* ── Edit form ── */
                                    <div className="flex flex-col gap-3 p-4">
                                        <div className="text-[0.68rem] font-bold uppercase tracking-widest text-coral">
                                            Modifier · {member.name}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="mb-1 block text-[0.67rem] text-mist">
                                                    Nom complet *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Justine Triet"
                                                    value={editForm.name ?? ""}
                                                    onChange={(e) =>
                                                        setEditForm((p) => ({
                                                            ...p,
                                                            name: e.target.value,
                                                        }))
                                                    }
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-[0.67rem] text-mist">
                                                    Rôle affiché *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Réalisatrice"
                                                    value={editForm.display_role ?? ""}
                                                    onChange={(e) =>
                                                        setEditForm((p) => ({
                                                            ...p,
                                                            display_role: e.target.value,
                                                        }))
                                                    }
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[0.67rem] text-mist">
                                                Badge
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ex: Membre du Jury"
                                                value={editForm.badge ?? ""}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        badge: e.target.value,
                                                    }))
                                                }
                                                className={inputClass}
                                            />
                                        </div>
                                        <PhotoField
                                            value={editForm.photo_url ?? ""}
                                            onChange={(url) =>
                                                setEditForm((p) => ({ ...p, photo_url: url }))
                                            }
                                            token={token}
                                        />
                                        <div>
                                            <label className="mb-1 block text-[0.67rem] text-mist">
                                                Citation
                                            </label>
                                            <textarea
                                                placeholder="Citation ou biographie courte (optionnel)"
                                                value={editForm.quote ?? ""}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        quote: e.target.value,
                                                    }))
                                                }
                                                rows={2}
                                                className={`${inputClass} resize-none`}
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="flex cursor-pointer items-center gap-2 text-[0.75rem] text-mist">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.is_featured === 1}
                                                    onChange={(e) =>
                                                        setEditForm((p) => ({
                                                            ...p,
                                                            is_featured: e.target.checked ? 1 : 0,
                                                        }))
                                                    }
                                                    className="accent-aurora"
                                                />
                                                <span>Carte vedette ⭐</span>
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-2 text-[0.75rem] text-mist">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.is_active === 1}
                                                    onChange={(e) =>
                                                        setEditForm((p) => ({
                                                            ...p,
                                                            is_active: e.target.checked ? 1 : 0,
                                                        }))
                                                    }
                                                    className="accent-aurora"
                                                />
                                                <span>Visible publiquement</span>
                                            </label>
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={() => void handleUpdate(member.id)}
                                                disabled={savingId === member.id}
                                                className="rounded-lg border border-aurora/30 bg-aurora/10 px-4 py-1.5 text-[0.75rem] font-bold text-aurora transition-all hover:bg-aurora/20 disabled:opacity-60"
                                            >
                                                {savingId === member.id
                                                    ? "Enregistrement…"
                                                    : "Enregistrer"}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditForm({});
                                                }}
                                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-[0.75rem] font-bold text-mist transition-all hover:border-white/20 hover:text-white-soft"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                ) : confirmDeleteId === member.id ? (
                                    /* ── Delete confirm ── */
                                    <div className="flex items-center justify-between gap-3 rounded-xl border border-coral/20 bg-coral/5 px-4 py-3">
                                        <div>
                                            <div className="text-[0.78rem] font-semibold text-coral">
                                                Supprimer ce membre ?
                                            </div>
                                            <div className="text-[0.7rem] text-mist">
                                                « {member.name} » sera retiré du jury.
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => void handleDelete(member.id)}
                                                className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-1.5 text-[0.75rem] font-bold text-coral transition-all hover:bg-coral/20"
                                            >
                                                Supprimer
                                            </button>
                                            <button
                                                onClick={() => setConfirmDeleteId(null)}
                                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[0.75rem] font-bold text-mist transition-all hover:border-white/20"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* ── Normal row ── */
                                    <div className="flex items-start justify-between gap-3 px-4 py-3">
                                        <div className="flex items-start gap-3">
                                            {member.photo_url ? (
                                                <img
                                                    src={member.photo_url}
                                                    alt={member.name}
                                                    className="h-[52px] w-[44px] shrink-0 rounded-[8px] border border-white/10 object-cover object-top"
                                                />
                                            ) : (
                                                <div className="flex h-[52px] w-[44px] shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-white/5">
                                                    <span className="text-[10px] text-mist">
                                                        Photo
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="text-[0.84rem] font-semibold leading-snug text-white-soft">
                                                        {member.name}
                                                    </span>
                                                    {member.is_featured === 1 && (
                                                        <span className="rounded border border-aurora/30 bg-aurora/10 px-1.5 py-0.5 font-mono text-[0.6rem] text-aurora">
                                                            ⭐ Vedette
                                                        </span>
                                                    )}
                                                    {member.is_active === 0 && (
                                                        <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[0.6rem] text-mist">
                                                            Masqué
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-0.5 text-[0.72rem] text-mist">
                                                    {member.display_role}
                                                </div>
                                                <div className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-white/30">
                                                    {member.badge}
                                                </div>
                                                {member.quote && (
                                                    <p className="mt-1 line-clamp-1 text-[0.69rem] italic leading-relaxed text-mist/60">
                                                        {member.quote}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 flex-col gap-1">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => startEdit(member)}
                                                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[0.72rem] text-mist transition-all hover:border-aurora/30 hover:text-aurora"
                                                >
                                                    Éditer
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(member.id)}
                                                    className="flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-2 py-1 text-mist transition-all hover:border-coral/30 hover:text-coral"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => void toggleActive(member)}
                                                    className={`rounded-md border px-2 py-0.5 text-[0.65rem] transition-all ${
                                                        member.is_active === 1
                                                            ? "border-aurora/20 bg-aurora/5 text-aurora hover:bg-aurora/10"
                                                            : "border-white/10 bg-white/5 text-mist hover:border-white/20"
                                                    }`}
                                                >
                                                    {member.is_active === 1 ? "Actif" : "Inactif"}
                                                </button>
                                                <button
                                                    onClick={() => void toggleFeatured(member)}
                                                    disabled={member.is_featured === 1}
                                                    className={`rounded-md border px-2 py-0.5 text-[0.65rem] transition-all disabled:cursor-default ${
                                                        member.is_featured === 1
                                                            ? "border-aurora/30 bg-aurora/10 text-aurora"
                                                            : "border-white/10 bg-white/5 text-mist hover:border-aurora/20 hover:text-aurora/70"
                                                    }`}
                                                >
                                                    ⭐
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Add form ── */}
                {showAddForm ? (
                    <div className="mt-3 flex flex-col gap-3 rounded-xl border border-aurora/20 bg-aurora/[0.04] p-4">
                        <div className="text-[0.68rem] font-bold uppercase tracking-widest text-aurora">
                            Nouveau membre du jury
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="mb-1 block text-[0.67rem] text-mist">
                                    Nom complet *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Justine Triet"
                                    value={addForm.name}
                                    onChange={(e) =>
                                        setAddForm((p) => ({ ...p, name: e.target.value }))
                                    }
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[0.67rem] text-mist">
                                    Rôle affiché *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Réalisatrice"
                                    value={addForm.display_role}
                                    onChange={(e) =>
                                        setAddForm((p) => ({
                                            ...p,
                                            display_role: e.target.value,
                                        }))
                                    }
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-[0.67rem] text-mist">Badge</label>
                            <input
                                type="text"
                                placeholder="Membre du Jury"
                                value={addForm.badge}
                                onChange={(e) =>
                                    setAddForm((p) => ({ ...p, badge: e.target.value }))
                                }
                                className={inputClass}
                            />
                        </div>
                        <PhotoField
                            value={addForm.photo_url}
                            onChange={(url) => setAddForm((p) => ({ ...p, photo_url: url }))}
                            token={token}
                        />
                        <div>
                            <label className="mb-1 block text-[0.67rem] text-mist">Citation</label>
                            <textarea
                                placeholder="Citation ou biographie courte (optionnel)"
                                value={addForm.quote}
                                onChange={(e) =>
                                    setAddForm((p) => ({ ...p, quote: e.target.value }))
                                }
                                rows={2}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                        <label className="flex cursor-pointer items-center gap-2 text-[0.75rem] text-mist">
                            <input
                                type="checkbox"
                                checked={addForm.is_featured === 1}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        is_featured: e.target.checked ? 1 : 0,
                                    }))
                                }
                                className="accent-aurora"
                            />
                            <span>Carte vedette ⭐ (Présidente du jury)</span>
                        </label>
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={() => void handleAdd()}
                                disabled={addSaving || !addForm.name || !addForm.display_role}
                                className="rounded-lg border border-aurora/30 bg-aurora/10 px-4 py-1.5 text-[0.75rem] font-bold text-aurora transition-all hover:bg-aurora/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {addSaving ? "Ajout en cours…" : "Ajouter le membre"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setAddForm({ ...emptyAddForm });
                                }}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-[0.75rem] font-bold text-mist transition-all hover:border-white/20 hover:text-white-soft"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-aurora/25 bg-aurora/[0.04] py-2.5 text-[0.8rem] font-bold text-aurora/70 transition-all hover:border-aurora/40 hover:bg-aurora/10 hover:text-aurora"
                    >
                        <span className="text-lg leading-none">+</span>
                        Ajouter un membre du jury
                    </button>
                )}
            </div>
        </div>
    );
};

export default CmsJury;
