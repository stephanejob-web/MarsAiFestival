import React, { useState, useRef } from "react";
import { useCmsSponsors, LEVEL_LABELS } from "../hooks/useCmsSponsors";
import type { Sponsor, SponsorLevel } from "../hooks/useCmsSponsors";
import { API_BASE_URL } from "../../../constants/api";

const inputClass =
    "w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-body text-[0.78rem] text-white-soft outline-none transition-colors placeholder:text-mist/40 focus:border-aurora/40";

const LEVELS: SponsorLevel[] = ["main", "lead", "partner", "supporter", "premium"];

const LEVEL_COLOR: Record<SponsorLevel, string> = {
    main: "text-aurora border-aurora/30 bg-aurora/10",
    lead: "text-solar border-solar/30 bg-solar/10",
    partner: "text-lavande border-lavande/30 bg-lavande/10",
    supporter: "text-mist border-white/10 bg-white/5",
    premium: "text-coral border-coral/30 bg-coral/10",
};

const emptyForm = {
    name: "",
    partnership_statut: "partner" as SponsorLevel,
    sponsor_link: "",
    sponsored_award: "",
    sponsor_logo: "",
};

// ── Logo field: upload + URL fallback ─────────────────────────────────────────
interface LogoFieldProps {
    value: string;
    onChange: (url: string) => void;
    onFileUpload?: (file: File) => Promise<string | null>;
}

const LogoField = ({ value, onChange, onFileUpload }: LogoFieldProps): React.JSX.Element => {
    const ref = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFile = async (file: File) => {
        if (!onFileUpload) return;
        setUploading(true);
        const url = await onFileUpload(file);
        if (url) onChange(url);
        setUploading(false);
    };

    const displaySrc = value
        ? value.startsWith("http")
            ? value
            : `${API_BASE_URL}${value}`
        : null;

    return (
        <div className="flex flex-col gap-1.5">
            <label className="block text-[0.63rem] text-mist">Logo</label>
            <div className="flex gap-2">
                {/* Preview / click to upload */}
                <div
                    className="flex h-[44px] w-[56px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-[1.5px] border-dashed border-solar/25 bg-white/[0.03] transition-colors hover:border-solar/50"
                    onClick={() => ref.current?.click()}
                    title="Cliquer pour uploader"
                >
                    {displaySrc ? (
                        <img src={displaySrc} className="h-full w-full object-contain p-1" />
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
                            <circle cx="6" cy="7.5" r="1.5" fill="currentColor" opacity="0.4" />
                            <path
                                d="M1.5 13l4-4 3 3 2.5-2.5L15 13"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.4"
                            />
                        </svg>
                    )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {onFileUpload && (
                        <button
                            type="button"
                            onClick={() => ref.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-1.5 rounded-md border border-solar/20 bg-solar/5 px-2.5 py-1 text-[0.72rem] text-solar transition-all hover:border-solar/40 hover:bg-solar/10 disabled:opacity-50"
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
                                    Uploader un logo
                                </>
                            )}
                        </button>
                    )}
                    <input
                        type="text"
                        placeholder="ou coller une URL…"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>
            <input
                ref={ref}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
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
const CmsSponsors = (): React.JSX.Element => {
    const { sponsors, loading, createSponsor, updateSponsor, deleteSponsor, uploadLogo } =
        useCmsSponsors();

    const [showAddForm, setShowAddForm] = useState(false);
    const [addForm, setAddForm] = useState({ ...emptyForm });
    const [addSaving, setAddSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Sponsor>>({});
    const [savingId, setSavingId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const handleAdd = async () => {
        if (!addForm.name.trim()) return;
        setAddSaving(true);
        const ok = await createSponsor({
            name: addForm.name.trim(),
            partnership_statut: addForm.partnership_statut,
            sponsored_award: addForm.sponsored_award || null,
            sponsor_link: addForm.sponsor_link || null,
            sponsor_logo: addForm.sponsor_logo || null,
        });
        if (ok) {
            setAddForm({ ...emptyForm });
            setShowAddForm(false);
        }
        setAddSaving(false);
    };

    const startEdit = (s: Sponsor) => {
        setEditingId(s.id);
        setEditForm({ ...s, sponsor_logo: s.sponsor_logo ?? "" });
    };

    const handleUpdate = async (id: number) => {
        setSavingId(id);
        await updateSponsor(id, {
            ...editForm,
            sponsor_logo: editForm.sponsor_logo || null,
        });
        setEditingId(null);
        setEditForm({});
        setSavingId(null);
    };

    // Upload logo for existing sponsor and return URL
    const makeLogoUploader =
        (id: number) =>
        async (file: File): Promise<string | null> => {
            return uploadLogo(id, file);
        };

    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-4 pt-[18px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-solar/20 bg-solar/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M8 2l1.8 3.6L14 6.5l-3 2.9.7 4.1L8 11.4l-3.7 1.95.7-4.1L2 6.5l4.2-.9L8 2z"
                            stroke="#f5e642"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Partenaires & Sponsors
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-mist">
                        {loading
                            ? "Chargement…"
                            : `${sponsors.length} partenaires · logos et liens`}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-white/5 px-5 pb-5 pt-3">
                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-6 text-[0.78rem] text-mist">
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
                ) : sponsors.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/10 py-6 text-center text-[0.78rem] text-mist">
                        Aucun partenaire.
                        <br />
                        <span className="text-solar/60">
                            Cliquez sur « Ajouter » pour commencer.
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-white/[0.04]">
                        {sponsors.map((s) =>
                            editingId === s.id ? (
                                <div key={s.id} className="flex flex-col gap-2.5 py-3">
                                    <div className="text-[0.65rem] font-bold uppercase tracking-widest text-solar">
                                        Modifier · {s.name}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="mb-1 block text-[0.63rem] text-mist">
                                                Nom *
                                            </label>
                                            <input
                                                type="text"
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
                                            <label className="mb-1 block text-[0.63rem] text-mist">
                                                Niveau
                                            </label>
                                            <select
                                                value={editForm.partnership_statut ?? "partner"}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        partnership_statut: e.target
                                                            .value as SponsorLevel,
                                                    }))
                                                }
                                                className={`${inputClass} cursor-pointer [&>option]:bg-horizon`}
                                            >
                                                {LEVELS.map((l) => (
                                                    <option key={l} value={l}>
                                                        {LEVEL_LABELS[l]}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="mb-1 block text-[0.63rem] text-mist">
                                                Lien du site
                                            </label>
                                            <input
                                                type="url"
                                                value={editForm.sponsor_link ?? ""}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        sponsor_link: e.target.value,
                                                    }))
                                                }
                                                placeholder="https://…"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[0.63rem] text-mist">
                                                Prix sponsorisé
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.sponsored_award ?? ""}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        sponsored_award: e.target.value,
                                                    }))
                                                }
                                                placeholder="Ex: Prix du public"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                    <LogoField
                                        value={editForm.sponsor_logo ?? ""}
                                        onChange={(url) =>
                                            setEditForm((p) => ({ ...p, sponsor_logo: url }))
                                        }
                                        onFileUpload={makeLogoUploader(s.id)}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => void handleUpdate(s.id)}
                                            disabled={savingId === s.id}
                                            className="rounded-lg border border-aurora/30 bg-aurora/10 px-4 py-1.5 text-[0.75rem] font-bold text-aurora transition-all hover:bg-aurora/20 disabled:opacity-60"
                                        >
                                            {savingId === s.id
                                                ? "Enregistrement…"
                                                : "✓ Enregistrer"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditForm({});
                                            }}
                                            className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-[0.75rem] font-bold text-mist transition-all hover:border-white/20"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : confirmDeleteId === s.id ? (
                                <div
                                    key={s.id}
                                    className="flex items-center justify-between gap-3 py-3"
                                >
                                    <div className="text-[0.78rem] text-mist">
                                        Supprimer <strong className="text-coral">{s.name}</strong> ?
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                void deleteSponsor(s.id).then(() =>
                                                    setConfirmDeleteId(null),
                                                )
                                            }
                                            className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-1 text-[0.72rem] font-bold text-coral hover:bg-coral/20"
                                        >
                                            Supprimer
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(null)}
                                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[0.72rem] font-bold text-mist hover:border-white/20"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={s.id}
                                    className="flex items-center gap-2.5 py-2.5 sm:gap-3"
                                >
                                    {/* Logo preview */}
                                    <div className="flex h-[44px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                                        {s.sponsor_logo ? (
                                            <img
                                                src={
                                                    s.sponsor_logo.startsWith("http")
                                                        ? s.sponsor_logo
                                                        : `${API_BASE_URL}${s.sponsor_logo}`
                                                }
                                                alt={s.name}
                                                className="h-full w-full object-contain p-1"
                                            />
                                        ) : (
                                            <span className="text-[0.58rem] text-mist/40">
                                                Logo
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span className="text-[0.84rem] font-semibold text-white-soft">
                                                {s.name}
                                            </span>
                                            <span
                                                className={`rounded border px-1.5 py-0.5 font-mono text-[0.6rem] ${LEVEL_COLOR[s.partnership_statut]}`}
                                            >
                                                {LEVEL_LABELS[s.partnership_statut]}
                                            </span>
                                            {s.sponsored_award && (
                                                <span className="text-[0.65rem] text-mist/60">
                                                    · {s.sponsored_award}
                                                </span>
                                            )}
                                        </div>
                                        {s.sponsor_link && (
                                            <a
                                                href={s.sponsor_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="truncate font-mono text-[0.65rem] text-aurora/50 hover:text-aurora"
                                            >
                                                {s.sponsor_link}
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <button
                                            onClick={() => startEdit(s)}
                                            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[0.72rem] text-mist transition-all hover:border-aurora/30 hover:text-aurora"
                                        >
                                            Éditer
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(s.id)}
                                            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[0.72rem] text-mist transition-all hover:border-coral/30 hover:text-coral"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                )}

                {/* Add form */}
                {showAddForm ? (
                    <div className="mt-3 flex flex-col gap-2.5 rounded-xl border border-solar/20 bg-solar/[0.04] p-4">
                        <div className="text-[0.65rem] font-bold uppercase tracking-widest text-solar">
                            Nouveau partenaire
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="mb-1 block text-[0.63rem] text-mist">Nom *</label>
                                <input
                                    type="text"
                                    value={addForm.name}
                                    onChange={(e) =>
                                        setAddForm((p) => ({ ...p, name: e.target.value }))
                                    }
                                    placeholder="Ex: OpenAI"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[0.63rem] text-mist">
                                    Niveau
                                </label>
                                <select
                                    value={addForm.partnership_statut}
                                    onChange={(e) =>
                                        setAddForm((p) => ({
                                            ...p,
                                            partnership_statut: e.target.value as SponsorLevel,
                                        }))
                                    }
                                    className={`${inputClass} cursor-pointer [&>option]:bg-horizon`}
                                >
                                    {LEVELS.map((l) => (
                                        <option key={l} value={l}>
                                            {LEVEL_LABELS[l]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="mb-1 block text-[0.63rem] text-mist">
                                    Lien du site
                                </label>
                                <input
                                    type="url"
                                    value={addForm.sponsor_link}
                                    onChange={(e) =>
                                        setAddForm((p) => ({
                                            ...p,
                                            sponsor_link: e.target.value,
                                        }))
                                    }
                                    placeholder="https://…"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[0.63rem] text-mist">
                                    Prix sponsorisé
                                </label>
                                <input
                                    type="text"
                                    value={addForm.sponsored_award}
                                    onChange={(e) =>
                                        setAddForm((p) => ({
                                            ...p,
                                            sponsored_award: e.target.value,
                                        }))
                                    }
                                    placeholder="Ex: Prix du public"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        {/* Logo (URL only on add — upload after creation via Éditer) */}
                        <div>
                            <label className="mb-1 block text-[0.63rem] text-mist">
                                Logo (URL)
                            </label>
                            <input
                                type="text"
                                value={addForm.sponsor_logo ?? ""}
                                onChange={(e) =>
                                    setAddForm((p) => ({ ...p, sponsor_logo: e.target.value }))
                                }
                                placeholder="https://… ou laisser vide pour uploader après"
                                className={inputClass}
                            />
                            <p className="mt-0.5 text-[0.6rem] text-mist/40">
                                Pour uploader un fichier : ajoutez d'abord, puis cliquez sur Éditer.
                            </p>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={() => void handleAdd()}
                                disabled={addSaving || !addForm.name.trim()}
                                className="rounded-lg border border-aurora/30 bg-aurora/10 px-4 py-1.5 text-[0.75rem] font-bold text-aurora transition-all hover:bg-aurora/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {addSaving ? "Ajout…" : "✓ Ajouter"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setAddForm({ ...emptyForm });
                                }}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-[0.75rem] font-bold text-mist transition-all hover:border-white/20"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-3 w-full cursor-pointer rounded-lg border border-dashed border-white/15 bg-white/5 p-2 font-body text-[0.82rem] text-mist transition-all hover:border-solar/30 hover:bg-solar/5 hover:text-solar"
                    >
                        + Ajouter un partenaire
                    </button>
                )}
            </div>
        </div>
    );
};

export default CmsSponsors;
