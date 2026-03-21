import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../constants/api";

type EventType = "opening" | "projection" | "masterclass" | "pause" | "gala" | "default";

interface ProgrammeEvent {
    id: number;
    day: number;
    event_date: string | null;
    time: string;
    title: string;
    description: string | null;
    type: EventType;
    sort_order: number;
}

const formatDateTab = (dateStr: string): string => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
};

const toInputDate = (dateStr: string | null): string =>
    dateStr ? String(dateStr).slice(0, 10) : "";

const TYPE_LABELS: Record<EventType, string> = {
    opening: "Cérémonie",
    projection: "Projection",
    masterclass: "Masterclass",
    pause: "Pause",
    gala: "Gala",
    default: "Événement",
};

const TYPE_BADGE: Record<EventType, string> = {
    opening: "text-aurora border-aurora/40 bg-aurora/10",
    projection: "text-solar border-solar/40 bg-solar/10",
    masterclass: "text-lavande border-lavande/40 bg-lavande/10",
    pause: "text-mist border-white/10 bg-white/5",
    gala: "text-coral border-coral/40 bg-coral/10",
    default: "text-white/60 border-white/10 bg-white/5",
};

const TYPE_DOT: Record<EventType, string> = {
    opening: "bg-aurora",
    projection: "bg-solar",
    masterclass: "bg-lavande",
    pause: "bg-white/20",
    gala: "bg-coral",
    default: "bg-white/30",
};

const EVENT_TYPES: EventType[] = [
    "opening",
    "projection",
    "masterclass",
    "pause",
    "gala",
    "default",
];

const emptyForm = {
    event_date: "",
    time: "",
    title: "",
    description: "",
    type: "default" as EventType,
};

const inputClass =
    "w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[0.78rem] text-white-soft outline-none transition-colors placeholder:text-mist/40 focus:border-aurora/40";

const TypeSelect = ({
    value,
    onChange,
}: {
    value: EventType;
    onChange: (v: EventType) => void;
}): React.JSX.Element => (
    <div className="flex flex-wrap gap-1.5">
        {EVENT_TYPES.map((t) => (
            <button
                key={t}
                type="button"
                onClick={() => onChange(t)}
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[0.7rem] font-semibold transition-all ${
                    value === t
                        ? TYPE_BADGE[t]
                        : "border-white/10 bg-white/5 text-mist hover:border-white/20 hover:text-white-soft"
                }`}
            >
                <span
                    className={`h-1.5 w-1.5 rounded-full ${value === t ? TYPE_DOT[t] : "bg-white/20"}`}
                />
                {TYPE_LABELS[t]}
            </button>
        ))}
    </div>
);

const CmsProgramme = (): React.JSX.Element => {
    const [events, setEvents] = useState<ProgrammeEvent[]>([]);
    const [activeDate, setActiveDate] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [addForm, setAddForm] = useState({ ...emptyForm });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<ProgrammeEvent>>({});
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [addSaving, setAddSaving] = useState<boolean>(false);
    const [renamingDate, setRenamingDate] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState<string>("");
    const [renameSaving, setRenameSaving] = useState<boolean>(false);
    const [showNewDay, setShowNewDay] = useState<boolean>(false);
    const [newDayDate, setNewDayDate] = useState<string>("");
    const [apiError, setApiError] = useState<string | null>(null);

    const token = localStorage.getItem("jury_token");

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/programme`);
            const json = await res.json();
            if (json.success) {
                const data: ProgrammeEvent[] = json.data;
                setEvents(data);
                // Auto-select first date tab
                const dates = [
                    ...new Set(data.map((e) => toInputDate(e.event_date)).filter(Boolean)),
                ].sort();
                if (dates.length > 0) setActiveDate((prev) => prev || dates[0]);
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const allDates = [
        ...new Set(events.map((e) => toInputDate(e.event_date)).filter(Boolean)),
    ].sort();
    const dayEvents = events.filter((e) => toInputDate(e.event_date) === activeDate);

    const handleAdd = async () => {
        if (!addForm.time || !addForm.title || !addForm.event_date) return;
        setAddSaving(true);
        setApiError(null);
        try {
            const sort_order = dayEvents.length;
            const res = await fetch(`${API_BASE_URL}/api/programme`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...addForm, day: 1, sort_order }),
            });
            const json = await res.json();
            if (json.success) {
                const newDate = addForm.event_date;
                setAddForm({ ...emptyForm });
                setShowAddForm(false);
                await fetchEvents();
                if (newDate) setActiveDate(newDate);
            } else {
                setApiError(json.message ?? `Erreur ${res.status}`);
            }
        } catch (e) {
            setApiError("Impossible de contacter le serveur.");
        } finally {
            setAddSaving(false);
        }
    };

    const startEdit = (event: ProgrammeEvent) => {
        setEditingId(event.id);
        setEditForm({
            event_date: toInputDate(event.event_date),
            time: event.time,
            title: event.title,
            description: event.description ?? "",
            type: event.type,
            sort_order: event.sort_order,
        });
    };

    const handleUpdate = async (id: number) => {
        setSavingId(id);
        try {
            const res = await fetch(`${API_BASE_URL}/api/programme/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(editForm),
            });
            const json = await res.json();
            if (json.success) {
                setEditingId(null);
                setEditForm({});
                await fetchEvents();
            }
        } finally {
            setSavingId(null);
        }
    };

    const handleRenameDate = async () => {
        if (!renamingDate || !renameValue || renameValue === renamingDate) return;
        setRenameSaving(true);
        const ids = events
            .filter((e) => toInputDate(e.event_date) === renamingDate)
            .map((e) => e.id);
        try {
            await Promise.all(
                ids.map((id) =>
                    fetch(`${API_BASE_URL}/api/programme/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ event_date: renameValue }),
                    }),
                ),
            );
            setActiveDate(renameValue);
            setRenamingDate(null);
            await fetchEvents();
        } finally {
            setRenameSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/programme/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) {
                setConfirmDeleteId(null);
                await fetchEvents();
            }
        } catch {
            /* silently fail */
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.05] bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-3 pt-[18px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-aurora/20 bg-aurora/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M2 4h12M2 8h8M2 12h10"
                            stroke="#4effce"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                        />
                        <circle cx="13" cy="12" r="2" fill="#4effce" />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Programme du festival
                    </div>
                    <div className="text-[0.71rem] text-mist">
                        {events.length > 0
                            ? `${events.length} événements · modifiables en temps réel`
                            : "Gérez les événements par jour"}
                    </div>
                </div>
                {/* Compteur par date */}
                <div className="hidden sm:flex items-center gap-2">
                    {allDates.map((d) => {
                        const count = events.filter((e) => toInputDate(e.event_date) === d).length;
                        return (
                            <span
                                key={d}
                                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[0.65rem] text-mist"
                            >
                                {d} · {count}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-white/[0.05] px-5 pb-5 pt-4">
                {/* Onglets par date */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {allDates.map((d, i) => (
                        <div key={d} className="flex items-center gap-1">
                            {renamingDate === d ? (
                                /* ── Mode renommage ── */
                                <div className="flex items-center gap-1.5 rounded-lg border border-aurora/40 bg-aurora/5 px-3 py-1.5">
                                    <input
                                        type="date"
                                        value={renameValue}
                                        onChange={(e) => setRenameValue(e.target.value)}
                                        className="w-[140px] rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[0.72rem] text-white-soft outline-none focus:border-aurora/40 scheme-dark"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleRenameDate}
                                        disabled={renameSaving || !renameValue}
                                        className="rounded border border-aurora/30 bg-aurora/10 px-2.5 py-1 text-[0.7rem] font-bold text-aurora hover:bg-aurora/20 disabled:opacity-50"
                                    >
                                        {renameSaving ? "…" : "✓"}
                                    </button>
                                    <button
                                        onClick={() => setRenamingDate(null)}
                                        className="rounded border border-white/10 px-2 py-1 text-[0.7rem] text-mist hover:text-white-soft"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                /* ── Onglet normal ── */
                                <div
                                    className={`flex items-center gap-1.5 rounded-lg border transition-all ${activeDate === d ? "border-aurora/40 bg-aurora/10" : "border-white/10 bg-white/5"}`}
                                >
                                    <button
                                        onClick={() => {
                                            setActiveDate(d);
                                            setEditingId(null);
                                            setShowAddForm(false);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 font-display text-[0.78rem] font-bold ${activeDate === d ? "text-aurora" : "text-mist hover:text-white-soft"}`}
                                    >
                                        <span>Jour {i + 1}</span>
                                        <span
                                            className={`text-[0.68rem] font-normal ${activeDate === d ? "text-aurora/70" : "text-white/30"}`}
                                        >
                                            {formatDateTab(d)}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRenamingDate(d);
                                            setRenameValue(d);
                                            setActiveDate(d);
                                        }}
                                        title="Changer la date"
                                        className={`pr-2.5 py-2 text-[0.7rem] transition-colors ${activeDate === d ? "text-aurora/50 hover:text-aurora" : "text-white/20 hover:text-mist"}`}
                                    >
                                        <svg
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            className="w-3 h-3"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path
                                                d="M11 2l3 3-8 8H3v-3l8-8z"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {allDates.length === 0 && !showNewDay && (
                        <span className="text-[0.75rem] text-mist/50 italic">
                            Aucune date — ajoutez un jour
                        </span>
                    )}

                    {/* Bouton + Nouveau jour */}
                    {showNewDay ? (
                        <div className="flex items-center gap-1.5 rounded-lg border border-solar/30 bg-solar/5 px-3 py-1.5">
                            <input
                                type="date"
                                value={newDayDate}
                                onChange={(e) => setNewDayDate(e.target.value)}
                                className="w-[140px] rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[0.72rem] text-white-soft outline-none focus:border-solar/40 scheme-dark"
                                autoFocus
                            />
                            <button
                                disabled={!newDayDate || allDates.includes(newDayDate)}
                                onClick={() => {
                                    setActiveDate(newDayDate);
                                    setAddForm({ ...emptyForm, event_date: newDayDate });
                                    setShowAddForm(true);
                                    setShowNewDay(false);
                                    setNewDayDate("");
                                    setEditingId(null);
                                }}
                                className="rounded border border-solar/30 bg-solar/10 px-2.5 py-1 text-[0.7rem] font-bold text-solar hover:bg-solar/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                title={allDates.includes(newDayDate) ? "Ce jour existe déjà" : ""}
                            >
                                ✓
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewDay(false);
                                    setNewDayDate("");
                                }}
                                className="rounded border border-white/10 px-2 py-1 text-[0.7rem] text-mist hover:text-white-soft"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setShowNewDay(true);
                                setRenamingDate(null);
                            }}
                            className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-2 font-display text-[0.75rem] font-bold text-white/30 transition-all hover:border-solar/30 hover:text-solar"
                        >
                            <span className="text-base leading-none">+</span>
                            Nouveau jour
                        </button>
                    )}
                </div>

                {/* Liste des événements */}
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
                ) : dayEvents.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/10 py-8 text-center text-[0.78rem] text-mist">
                        Aucun événement pour ce jour.
                        <br />
                        <span className="text-aurora/60">
                            Cliquez sur « Ajouter » pour commencer.
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {dayEvents.map((event) => (
                            <div
                                key={event.id}
                                className={`rounded-xl border transition-all ${editingId === event.id ? "border-aurora/20 bg-aurora/5" : "border-white/[0.05] bg-white/[0.02] hover:border-white/10"}`}
                            >
                                {editingId === event.id ? (
                                    /* ── Formulaire d'édition ── */
                                    <div className="flex flex-col gap-3 p-4">
                                        <div className="text-[0.68rem] font-bold uppercase tracking-widest text-aurora">
                                            Modifier l'événement
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="mb-1 block text-[0.67rem] text-mist">
                                                    Date *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={editForm.event_date ?? ""}
                                                    onChange={(e) =>
                                                        setEditForm((p) => ({
                                                            ...p,
                                                            event_date: e.target.value,
                                                        }))
                                                    }
                                                    className={`${inputClass} scheme-dark`}
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-[0.67rem] text-mist">
                                                    Heure
                                                </label>
                                                <input
                                                    type="time"
                                                    value={editForm.time ?? ""}
                                                    onChange={(e) =>
                                                        setEditForm((p) => ({
                                                            ...p,
                                                            time: e.target.value,
                                                        }))
                                                    }
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-[0.67rem] text-mist">
                                                    Titre *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Titre de l'événement"
                                                    value={editForm.title ?? ""}
                                                    onChange={(e) =>
                                                        setEditForm((p) => ({
                                                            ...p,
                                                            title: e.target.value,
                                                        }))
                                                    }
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[0.67rem] text-mist">
                                                Description
                                            </label>
                                            <textarea
                                                placeholder="Description courte (optionnel)"
                                                value={editForm.description ?? ""}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        description: e.target.value,
                                                    }))
                                                }
                                                rows={2}
                                                className={`${inputClass} resize-none`}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-[0.67rem] text-mist">
                                                Type d'événement
                                            </label>
                                            <TypeSelect
                                                value={(editForm.type ?? "default") as EventType}
                                                onChange={(v) =>
                                                    setEditForm((p) => ({ ...p, type: v }))
                                                }
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={() => handleUpdate(event.id)}
                                                disabled={savingId === event.id}
                                                className="rounded-lg border border-aurora/30 bg-aurora/10 px-4 py-1.5 text-[0.75rem] font-bold text-aurora transition-all hover:bg-aurora/20 disabled:opacity-60"
                                            >
                                                {savingId === event.id
                                                    ? "Enregistrement…"
                                                    : "✓ Enregistrer"}
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
                                ) : confirmDeleteId === event.id ? (
                                    /* ── Confirmation de suppression ── */
                                    <div className="flex items-center justify-between gap-3 rounded-xl border border-coral/20 bg-coral/5 px-4 py-3">
                                        <div>
                                            <div className="text-[0.78rem] font-semibold text-coral">
                                                Supprimer cet événement ?
                                            </div>
                                            <div className="text-[0.7rem] text-mist">
                                                « {event.title} » sera retiré du programme.
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => handleDelete(event.id)}
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
                                    /* ── Affichage normal ── */
                                    <div className="flex items-start justify-between gap-3 px-4 py-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex flex-col items-center gap-1.5 pt-0.5">
                                                <span className="font-mono text-[0.72rem] font-bold text-white/40">
                                                    {event.time}
                                                </span>
                                                <div
                                                    className={`h-1.5 w-1.5 rounded-full ${TYPE_DOT[event.type]}`}
                                                />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[0.82rem] font-semibold leading-snug text-white-soft">
                                                        {event.title}
                                                    </span>
                                                    <span
                                                        className={`rounded border px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider ${TYPE_BADGE[event.type]}`}
                                                    >
                                                        {TYPE_LABELS[event.type]}
                                                    </span>
                                                </div>
                                                {event.description && (
                                                    <p className="mt-0.5 text-[0.71rem] leading-relaxed text-mist">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                onClick={() => startEdit(event)}
                                                title="Modifier"
                                                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[0.72rem] text-mist transition-all hover:border-aurora/30 hover:text-aurora"
                                            >
                                                Éditer
                                            </button>
                                            <button
                                                onClick={() => setConfirmDeleteId(event.id)}
                                                title="Supprimer"
                                                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[0.72rem] text-mist transition-all hover:border-coral/30 hover:text-coral"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Formulaire d'ajout ── */}
                {showAddForm ? (
                    <div className="mt-3 flex flex-col gap-3 rounded-xl border border-aurora/20 bg-aurora/[0.04] p-4">
                        <div className="text-[0.68rem] font-bold uppercase tracking-widest text-aurora">
                            Nouvel événement
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="mb-1 block text-[0.67rem] text-mist">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={addForm.event_date}
                                    onChange={(e) =>
                                        setAddForm((p) => ({ ...p, event_date: e.target.value }))
                                    }
                                    className={`${inputClass} scheme-dark`}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[0.67rem] text-mist">
                                    Heure *
                                </label>
                                <input
                                    type="time"
                                    value={addForm.time}
                                    onChange={(e) =>
                                        setAddForm((p) => ({ ...p, time: e.target.value }))
                                    }
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[0.67rem] text-mist">
                                    Titre *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Projection officielle"
                                    value={addForm.title}
                                    onChange={(e) =>
                                        setAddForm((p) => ({ ...p, title: e.target.value }))
                                    }
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-[0.67rem] text-mist">
                                Description
                            </label>
                            <textarea
                                placeholder="Description courte (optionnel)"
                                value={addForm.description}
                                onChange={(e) =>
                                    setAddForm((p) => ({ ...p, description: e.target.value }))
                                }
                                rows={2}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-[0.67rem] text-mist">
                                Type d'événement
                            </label>
                            <TypeSelect
                                value={addForm.type}
                                onChange={(v) => setAddForm((p) => ({ ...p, type: v }))}
                            />
                        </div>
                        {apiError && (
                            <div className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-[0.72rem] text-coral">
                                {apiError}
                            </div>
                        )}
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={handleAdd}
                                disabled={
                                    addSaving ||
                                    !addForm.event_date ||
                                    !addForm.time ||
                                    !addForm.title
                                }
                                className="rounded-lg border border-aurora/30 bg-aurora/10 px-4 py-1.5 text-[0.75rem] font-bold text-aurora transition-all hover:bg-aurora/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {addSaving ? "Ajout en cours…" : "✓ Ajouter l'événement"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setAddForm({ ...emptyForm });
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
                        Ajouter un événement{activeDate ? ` — ${formatDateTab(activeDate)}` : ""}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CmsProgramme;
