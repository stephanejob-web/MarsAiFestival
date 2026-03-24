import React, { useState, useEffect, useCallback } from "react";
import { X, Trophy } from "lucide-react";
import { API_BASE_URL } from "../../../constants/api";

interface Film {
    id: number;
    original_title: string;
    english_title: string | null;
    language: string;
    statut: string;
    realisator_name: string | null;
    realisator_country: string | null;
    ia_class: string;
}

interface Award {
    id: number;
    name: string;
    description: string | null;
    cash_prize: string | null;
    laureat: number | null;
    display_rank: number;
    reveal_at: string | null;
    laureate_name?: string | null;
    laureate_film?: string | null;
}

interface PhaseInfo {
    phase: number;
    label: string;
    nextDate: string | null;
    finalist_count: number;
}

const token = () => localStorage.getItem("jury_token") ?? "";

const DEV_PHASES = [
    {
        phase: 0,
        label: "Phase 0",
        sub: "Inscriptions",
        color: "border-white/20 text-mist hover:border-white/40",
    },
    {
        phase: 1,
        label: "Phase 1",
        sub: "Sélection",
        color: "border-aurora/40 text-aurora hover:border-aurora",
    },
    {
        phase: 2,
        label: "Phase 2",
        sub: "Finalistes",
        color: "border-lavande/40 text-lavande hover:border-lavande",
    },
    {
        phase: 3,
        label: "Phase 3",
        sub: "Palmarès",
        color: "border-solar/40 text-solar hover:border-solar",
    },
];

const DevSimulator = ({ onSimulated }: { onSimulated: () => void }): React.JSX.Element => {
    const [loading, setLoading] = useState<number | null>(null);
    const [last, setLast] = useState<number | null>(null);

    const simulate = async (phase: number) => {
        setLoading(phase);
        try {
            const res = await fetch(`${API_BASE_URL}/api/phases/simulate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jury_token") ?? ""}`,
                },
                body: JSON.stringify({ phase }),
            });
            const json = await res.json();
            if (json.success) {
                setLast(phase);
                onSimulated();
            }
        } catch {
            /* */
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="rounded-xl border border-dashed border-yellow-500/40 bg-yellow-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-yellow-400/70 bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-0.5">
                    DEV ONLY
                </span>
                <span className="text-xs text-yellow-400/60">
                    Simuler une phase — modifie les dates en base
                </span>
                {last !== null && (
                    <span className="ml-auto text-xs text-yellow-400/80 font-mono">
                        Phase {last} active
                    </span>
                )}
            </div>
            <div className="flex gap-2 flex-wrap">
                {DEV_PHASES.map(({ phase, label, sub, color }) => (
                    <button
                        key={phase}
                        onClick={() => void simulate(phase)}
                        disabled={loading !== null}
                        className={`flex flex-col items-center px-4 py-2 rounded-lg border text-xs font-semibold transition-all disabled:opacity-40 ${color} ${last === phase ? "opacity-100 ring-1 ring-current" : "opacity-70"}`}
                    >
                        {loading === phase ? (
                            <span className="animate-pulse">…</span>
                        ) : (
                            <>
                                <span>{label}</span>
                                <span className="font-normal opacity-70">{sub}</span>
                            </>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

const CmsPhases = (): React.JSX.Element => {
    const [activeTab, setActiveTab] = useState<"phase1" | "phase2" | "phase3">("phase1");
    const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
    const [films, setFilms] = useState<Film[]>([]);
    const [awards, setAwards] = useState<Award[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState<number | null>(null);
    const [finalistCount, setFinalistCount] = useState(5);
    const [newAward, setNewAward] = useState({
        name: "",
        description: "",
        cash_prize: "",
        display_rank: 0,
    });
    const [editAward, setEditAward] = useState<Award | null>(null);

    const fetchPhaseInfo = useCallback(() => {
        fetch(`${API_BASE_URL}/api/public/phase`)
            .then((r) => r.json())
            .then((j) => {
                if (j.success) {
                    setPhaseInfo(j.data);
                    setFinalistCount(j.data.finalist_count ?? 5);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        fetchPhaseInfo();
    }, [fetchPhaseInfo]);

    const fetchFilms = useCallback(async (statut: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/phase-films?statut=${statut}`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            const json = await res.json();
            if (json.success) setFilms(json.data ?? []);
        } catch {
            /* */
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAwards = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/awards`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            const json = await res.json();
            if (json.success) setAwards(json.data ?? []);
        } catch {
            /* */
        }
    }, []);

    useEffect(() => {
        if (activeTab === "phase1") void fetchFilms("valide");
        if (activeTab === "phase2") void fetchFilms("selectionne");
        if (activeTab === "phase3") void fetchAwards();
    }, [activeTab, fetchFilms, fetchAwards]);

    const setPhaseStatus = async (filmId: number, statut: string) => {
        setSaving(filmId);
        try {
            await fetch(`${API_BASE_URL}/api/admin/films/${filmId}/phase`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
                body: JSON.stringify({ statut }),
            });
            // Re-fetch
            if (activeTab === "phase1") void fetchFilms("valide");
            if (activeTab === "phase2") void fetchFilms("selectionne");
        } catch {
            /* */
        } finally {
            setSaving(null);
        }
    };

    const saveFinalistCount = async () => {
        await fetch(`${API_BASE_URL}/api/admin/finalist-count`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
            body: JSON.stringify({ finalist_count: finalistCount }),
        });
    };

    const createAward = async () => {
        if (!newAward.name) return;
        await fetch(`${API_BASE_URL}/api/admin/awards`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
            body: JSON.stringify(newAward),
        });
        setNewAward({ name: "", description: "", cash_prize: "", display_rank: 0 });
        void fetchAwards();
    };

    const saveAwardEdit = async () => {
        if (!editAward) return;
        await fetch(`${API_BASE_URL}/api/admin/awards/${editAward.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
            body: JSON.stringify(editAward),
        });
        setEditAward(null);
        void fetchAwards();
    };

    const deleteAward = async (id: number) => {
        if (!confirm("Supprimer ce prix ?")) return;
        await fetch(`${API_BASE_URL}/api/admin/awards/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token()}` },
        });
        void fetchAwards();
    };

    const TABS = [
        { id: "phase1" as const, label: "Phase 1 · Sélection", color: "text-aurora border-aurora" },
        {
            id: "phase2" as const,
            label: "Phase 2 · Finalistes",
            color: "text-lavande border-lavande",
        },
        { id: "phase3" as const, label: "Phase 3 · Palmarès", color: "text-solar border-solar" },
    ];

    return (
        <div className="space-y-6">
            {/* DEV simulator — visible uniquement en développement */}
            {import.meta.env.DEV && <DevSimulator onSimulated={fetchPhaseInfo} />}

            {/* Phase active badge */}
            {phaseInfo && (
                <div className="bg-surface-2 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-aurora animate-pulse" />
                    <span className="text-sm text-mist">Phase active :</span>
                    <span className="font-semibold text-white-soft">
                        Phase {phaseInfo.phase} — {phaseInfo.label}
                    </span>
                    {phaseInfo.nextDate && (
                        <span className="ml-auto text-xs text-mist font-mono">
                            Prochaine : {new Date(phaseInfo.nextDate).toLocaleDateString("fr-FR")}
                        </span>
                    )}
                </div>
            )}

            {/* Sub-tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-0">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                            activeTab === tab.id
                                ? tab.color
                                : "text-mist border-transparent hover:text-white-soft"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── PHASE 1 : marquer films sélectionnés ─────────────────── */}
            {activeTab === "phase1" && (
                <div className="space-y-4">
                    <p className="text-sm text-mist">
                        Films validés ({films.length}). Cliquez sur{" "}
                        <strong className="text-aurora">Sélectionner</strong> pour les inclure dans
                        la Phase 1.
                    </p>
                    {loading ? (
                        <div className="text-mist text-sm animate-pulse">Chargement…</div>
                    ) : films.length === 0 ? (
                        <p className="text-mist text-sm italic">
                            Aucun film validé pour l'instant.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {films.map((film) => (
                                <div
                                    key={film.id}
                                    className="flex items-center gap-3 bg-surface-2 border border-white/8 rounded-lg px-4 py-3"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-white-soft text-sm truncate">
                                            {film.original_title}
                                        </div>
                                        <div className="text-xs text-mist">
                                            {film.realisator_name} · {film.language} ·{" "}
                                            {film.ia_class}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPhaseStatus(film.id, "selectionne")}
                                        disabled={saving === film.id}
                                        className="px-3 py-1.5 text-xs font-semibold bg-aurora/10 text-aurora border border-aurora/30 rounded-lg hover:bg-aurora/20 transition-colors disabled:opacity-40"
                                    >
                                        {saving === film.id ? "…" : "Sélectionner →"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── PHASE 2 : marquer finalistes ─────────────────────────── */}
            {activeTab === "phase2" && (
                <div className="space-y-4">
                    {/* Finalist count config */}
                    <div className="flex items-center gap-3 bg-surface-2 border border-lavande/20 rounded-xl p-4">
                        <label className="text-sm text-mist whitespace-nowrap">
                            Nombre de finalistes :
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={50}
                            value={finalistCount}
                            onChange={(e) => setFinalistCount(Number(e.target.value))}
                            className="w-20 bg-surface border border-white/15 rounded-lg px-3 py-1.5 text-sm text-white-soft focus:outline-none focus:border-lavande/50"
                        />
                        <button
                            onClick={saveFinalistCount}
                            className="px-3 py-1.5 text-xs font-semibold bg-lavande/10 text-lavande border border-lavande/30 rounded-lg hover:bg-lavande/20 transition-colors"
                        >
                            Enregistrer
                        </button>
                    </div>

                    <p className="text-sm text-mist">
                        Films sélectionnés ({films.length}). Cliquez sur{" "}
                        <strong className="text-lavande">Finaliste</strong> pour les faire passer en
                        Phase 2, ou <strong className="text-coral">Retirer</strong> pour les
                        remettre en valide.
                    </p>
                    {loading ? (
                        <div className="text-mist text-sm animate-pulse">Chargement…</div>
                    ) : films.length === 0 ? (
                        <p className="text-mist text-sm italic">Aucun film sélectionné.</p>
                    ) : (
                        <div className="space-y-2">
                            {films.map((film) => (
                                <div
                                    key={film.id}
                                    className="flex items-center gap-3 bg-surface-2 border border-white/8 rounded-lg px-4 py-3"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-white-soft text-sm truncate">
                                            {film.original_title}
                                        </div>
                                        <div className="text-xs text-mist">
                                            {film.realisator_name} · {film.language}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPhaseStatus(film.id, "valide")}
                                        disabled={saving === film.id}
                                        className="px-3 py-1.5 text-xs font-semibold bg-coral/10 text-coral border border-coral/30 rounded-lg hover:bg-coral/20 transition-colors disabled:opacity-40"
                                    >
                                        Retirer
                                    </button>
                                    <button
                                        onClick={() => setPhaseStatus(film.id, "finaliste")}
                                        disabled={saving === film.id}
                                        className="px-3 py-1.5 text-xs font-semibold bg-lavande/10 text-lavande border border-lavande/30 rounded-lg hover:bg-lavande/20 transition-colors disabled:opacity-40"
                                    >
                                        {saving === film.id ? "…" : "Finaliste →"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── PHASE 3 : palmarès awards ─────────────────────────────── */}
            {activeTab === "phase3" && (
                <div className="space-y-6">
                    {/* Create award */}
                    <div className="bg-surface-2 border border-solar/20 rounded-xl p-5 space-y-3">
                        <h3 className="text-sm font-semibold text-white-soft">Ajouter un prix</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                placeholder="Nom du prix *"
                                value={newAward.name}
                                onChange={(e) => setNewAward({ ...newAward, name: e.target.value })}
                                className="bg-surface border border-white/15 rounded-lg px-3 py-2 text-sm text-white-soft focus:outline-none focus:border-solar/50 col-span-2"
                            />
                            <input
                                placeholder="Dotation (ex: 5 000 €)"
                                value={newAward.cash_prize}
                                onChange={(e) =>
                                    setNewAward({ ...newAward, cash_prize: e.target.value })
                                }
                                className="bg-surface border border-white/15 rounded-lg px-3 py-2 text-sm text-white-soft focus:outline-none focus:border-solar/50"
                            />
                            <input
                                type="number"
                                placeholder="Ordre d'affichage"
                                value={newAward.display_rank || ""}
                                onChange={(e) =>
                                    setNewAward({
                                        ...newAward,
                                        display_rank: Number(e.target.value),
                                    })
                                }
                                className="bg-surface border border-white/15 rounded-lg px-3 py-2 text-sm text-white-soft focus:outline-none focus:border-solar/50"
                            />
                            <textarea
                                placeholder="Description"
                                value={newAward.description}
                                onChange={(e) =>
                                    setNewAward({ ...newAward, description: e.target.value })
                                }
                                rows={2}
                                className="bg-surface border border-white/15 rounded-lg px-3 py-2 text-sm text-white-soft focus:outline-none focus:border-solar/50 col-span-2 resize-none"
                            />
                        </div>
                        <button
                            onClick={createAward}
                            disabled={!newAward.name}
                            className="px-4 py-2 bg-solar text-[#0a0f2e] text-sm font-bold rounded-lg hover:bg-solar/90 transition-colors disabled:opacity-40"
                        >
                            + Créer le prix
                        </button>
                    </div>

                    {/* Awards list */}
                    <div className="space-y-3">
                        {awards.map((award) => (
                            <div
                                key={award.id}
                                className="bg-surface-2 border border-white/8 rounded-xl p-4"
                            >
                                {editAward?.id === award.id ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                value={editAward.name}
                                                onChange={(e) =>
                                                    setEditAward({
                                                        ...editAward,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="bg-surface border border-white/15 rounded-lg px-3 py-2 text-sm text-white-soft focus:outline-none focus:border-solar/50 col-span-2"
                                            />
                                            <input
                                                placeholder="Dotation"
                                                value={editAward.cash_prize ?? ""}
                                                onChange={(e) =>
                                                    setEditAward({
                                                        ...editAward,
                                                        cash_prize: e.target.value,
                                                    })
                                                }
                                                className="bg-surface border border-white/15 rounded-lg px-3 py-2 text-sm text-white-soft focus:outline-none focus:border-solar/50"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Ordre"
                                                value={editAward.display_rank}
                                                onChange={(e) =>
                                                    setEditAward({
                                                        ...editAward,
                                                        display_rank: Number(e.target.value),
                                                    })
                                                }
                                                className="bg-surface border border-white/15 rounded-lg px-3 py-2 text-sm text-white-soft focus:outline-none focus:border-solar/50"
                                            />
                                            <input
                                                type="number"
                                                placeholder="ID film lauréat"
                                                value={editAward.laureat ?? ""}
                                                onChange={(e) =>
                                                    setEditAward({
                                                        ...editAward,
                                                        laureat: e.target.value
                                                            ? Number(e.target.value)
                                                            : null,
                                                    })
                                                }
                                                className="bg-surface border border-white/15 rounded-lg px-3 py-2 text-sm text-white-soft focus:outline-none focus:border-solar/50"
                                            />
                                            <input
                                                type="datetime-local"
                                                placeholder="Révéler à…"
                                                value={
                                                    editAward.reveal_at
                                                        ? editAward.reveal_at.slice(0, 16)
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    setEditAward({
                                                        ...editAward,
                                                        reveal_at: e.target.value || null,
                                                    })
                                                }
                                                className="bg-surface border border-white/15 rounded-lg px-3 py-2 text-sm text-white-soft focus:outline-none focus:border-solar/50"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveAwardEdit}
                                                className="px-3 py-1.5 bg-solar text-[#0a0f2e] text-xs font-bold rounded-lg hover:bg-solar/90 transition-colors"
                                            >
                                                Enregistrer
                                            </button>
                                            <button
                                                onClick={() => setEditAward(null)}
                                                className="px-3 py-1.5 bg-surface border border-white/15 text-mist text-xs rounded-lg hover:text-white transition-colors"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-solar/10 border border-solar/20 flex items-center justify-center font-mono text-xs text-solar">
                                            {award.display_rank}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-white-soft text-sm">
                                                {award.name}
                                                {award.cash_prize && (
                                                    <span className="ml-2 text-xs text-solar">
                                                        {award.cash_prize}
                                                    </span>
                                                )}
                                            </div>
                                            {award.laureate_film ? (
                                                <div className="flex items-center gap-1 text-xs text-aurora mt-0.5">
                                                    <Trophy size={11} /> {award.laureate_film}
                                                    {award.laureate_name &&
                                                        ` — ${award.laureate_name}`}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-mist/50 mt-0.5 italic">
                                                    Lauréat non attribué
                                                </div>
                                            )}
                                            {award.reveal_at && (
                                                <div className="text-xs text-solar/60 mt-0.5 font-mono">
                                                    Révélation :{" "}
                                                    {new Date(award.reveal_at).toLocaleString(
                                                        "fr-FR",
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditAward(award)}
                                                className="px-3 py-1 text-xs text-mist border border-white/10 rounded-lg hover:text-white hover:border-white/25 transition-colors"
                                            >
                                                Éditer
                                            </button>
                                            <button
                                                onClick={() => deleteAward(award.id)}
                                                className="flex items-center justify-center px-3 py-1 text-coral border border-coral/20 rounded-lg hover:bg-coral/10 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {awards.length === 0 && (
                            <p className="text-mist text-sm italic text-center py-6">
                                Aucun prix créé. Ajoutez-en un ci-dessus.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CmsPhases;
