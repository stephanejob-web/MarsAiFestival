import React, { useCallback, useEffect, useState } from "react";
import AdminSidePanel from "../features/admin/components/AdminSidePanel";

const API = import.meta.env.VITE_API_URL as string;

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

interface JuryMember {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profil_picture: string | null;
}

interface FilmRow {
    id: number;
    dossier_num: string;
    original_title: string;
    statut: string;
    duration: number | null;
    first_name: string;
    last_name: string;
    country: string;
}

interface AssignmentRow {
    jury_id: number;
    film_id: number;
    jury_first_name: string;
    jury_last_name: string;
    film_title: string;
    assigned_at: string;
}

const STATUT_LABEL: Record<string, string> = {
    to_review: "À réviser",
    valide: "Validé",
    arevoir: "À revoir",
    refuse: "Refusé",
    in_discussion: "En discussion",
    asked_to_modify: "Modif. demandée",
};

const STATUT_CLASS: Record<string, string> = {
    to_review: "bg-zinc-700 text-zinc-300",
    valide: "bg-emerald-900/40 text-emerald-400",
    arevoir: "bg-yellow-900/40 text-yellow-400",
    refuse: "bg-red-900/40 text-red-400",
    in_discussion: "bg-purple-900/40 text-purple-400",
    asked_to_modify: "bg-orange-900/40 text-orange-400",
};

const AdminFilmsPage = (): React.JSX.Element => {
    const [juryMembers, setJuryMembers] = useState<JuryMember[]>([]);
    const [films, setFilms] = useState<FilmRow[]>([]);
    const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
    const [selectedJuryId, setSelectedJuryId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
    const [isDistributing, setIsDistributing] = useState(false);
    const [search, setSearch] = useState("");

    const showFeedback = (type: "ok" | "err", msg: string): void => {
        setFeedback({ type, msg });
        setTimeout(() => setFeedback(null), 3000);
    };

    const loadData = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            const headers = { Authorization: `Bearer ${getToken()}` };
            const [juryRes, filmsRes, assignRes] = await Promise.all([
                fetch(`${API}/api/assignments/jury-members`, { headers }),
                fetch(`${API}/api/films`, { headers }),
                fetch(`${API}/api/assignments`, { headers }),
            ]);
            const [juryData, filmsData, assignData] = await Promise.all([
                juryRes.json() as Promise<{ success: boolean; data: JuryMember[] }>,
                filmsRes.json() as Promise<{ success: boolean; data: FilmRow[] }>,
                assignRes.json() as Promise<{ success: boolean; data: AssignmentRow[] }>,
            ]);
            if (juryData.success) setJuryMembers(juryData.data.filter((j) => j.role === "jury"));
            if (filmsData.success) setFilms(filmsData.data);
            if (assignData.success) setAssignments(assignData.data);
        } catch {
            showFeedback("err", "Erreur de chargement des données.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const handleAssign = async (filmId: number): Promise<void> => {
        if (!selectedJuryId) return;
        try {
            const res = await fetch(`${API}/api/assignments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ juryId: selectedJuryId, filmId }),
            });
            const data = (await res.json()) as { success: boolean; message?: string };
            if (!data.success) {
                showFeedback("err", data.message ?? "Erreur d'attribution.");
                return;
            }
            showFeedback("ok", "Film attribué ✓");
            await loadData();
        } catch {
            showFeedback("err", "Erreur réseau.");
        }
    };

    const handleUnassign = async (juryId: number, filmId: number): Promise<void> => {
        try {
            const res = await fetch(
                `${API}/api/assignments?juryId=${juryId}&filmId=${filmId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${getToken()}` },
                },
            );
            const data = (await res.json()) as { success: boolean };
            if (!data.success) {
                showFeedback("err", "Erreur de suppression.");
                return;
            }
            showFeedback("ok", "Attribution supprimée ✓");
            await loadData();
        } catch {
            showFeedback("err", "Erreur réseau.");
        }
    };

    const handleAutoDistribute = async (): Promise<void> => {
        setIsDistributing(true);
        try {
            const res = await fetch(`${API}/api/assignments/auto-distribute`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = (await res.json()) as { success: boolean; message?: string };
            if (data.success) {
                showFeedback("ok", data.message ?? "Distribution effectuée ✓");
                await loadData();
            } else {
                showFeedback("err", data.message ?? "Erreur.");
            }
        } catch {
            showFeedback("err", "Erreur réseau.");
        } finally {
            setIsDistributing(false);
        }
    };

    // Films assigned to the selected jury member
    const assignedFilmIds = new Set(
        assignments.filter((a) => a.jury_id === selectedJuryId).map((a) => a.film_id),
    );

    // Films not assigned to anyone
    const allAssignedFilmIds = new Set(assignments.map((a) => a.film_id));

    const filteredFilms = films.filter((f) => {
        const q = search.toLowerCase();
        return (
            f.original_title.toLowerCase().includes(q) ||
            f.dossier_num.toLowerCase().includes(q) ||
            `${f.first_name} ${f.last_name}`.toLowerCase().includes(q)
        );
    });

    const selectedJury = juryMembers.find((j) => j.id === selectedJuryId);
    const assignedFilms = filteredFilms.filter((f) => assignedFilmIds.has(f.id));
    const unassignedFilms = filteredFilms.filter((f) => !allAssignedFilmIds.has(f.id));

    return (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
            <aside className="w-1/5 border-r border-zinc-800">
                <AdminSidePanel />
            </aside>

            <main className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <div className="border-b border-zinc-800 px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                Assignation des films
                            </h1>
                            <p className="mt-0.5 text-sm text-zinc-500">
                                {films.length} films · {juryMembers.length} jurés ·{" "}
                                {assignments.length} assignations
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {feedback && (
                                <span
                                    className={`text-sm font-medium ${feedback.type === "ok" ? "text-emerald-400" : "text-red-400"}`}
                                >
                                    {feedback.msg}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => void handleAutoDistribute()}
                                disabled={isDistributing}
                                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                            >
                                {isDistributing ? "Distribution…" : "⚡ Auto-distribuer"}
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-1 items-center justify-center text-zinc-500">
                        Chargement…
                    </div>
                ) : (
                    <div className="flex flex-1 overflow-hidden">
                        {/* Jury list */}
                        <div className="flex w-64 min-w-[16rem] flex-col overflow-y-auto border-r border-zinc-800 p-4">
                            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                Jurés
                            </div>
                            {juryMembers.map((j) => {
                                const count = assignments.filter(
                                    (a) => a.jury_id === j.id,
                                ).length;
                                const isSelected = j.id === selectedJuryId;
                                return (
                                    <button
                                        key={j.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedJuryId(isSelected ? null : j.id)
                                        }
                                        className={`mb-1.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                                            isSelected
                                                ? "bg-emerald-900/30 text-emerald-300"
                                                : "hover:bg-zinc-800 text-zinc-300"
                                        }`}
                                    >
                                        {j.profil_picture ? (
                                            <img
                                                src={j.profil_picture}
                                                alt=""
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-zinc-300">
                                                {j.first_name[0]}
                                                {j.last_name[0]}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-medium">
                                                {j.first_name} {j.last_name}
                                            </div>
                                            <div className="text-xs text-zinc-500">
                                                {count} film{count !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Films panel */}
                        <div className="flex flex-1 flex-col overflow-hidden">
                            {/* Search bar */}
                            <div className="border-b border-zinc-800 px-6 py-3">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher un film, réalisateur…"
                                    className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-600"
                                />
                            </div>

                            <div className="flex flex-1 overflow-hidden">
                                {/* Assigned to selected jury */}
                                {selectedJury && (
                                    <div className="flex w-1/2 flex-col overflow-hidden border-r border-zinc-800">
                                        <div className="border-b border-zinc-800 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-emerald-500">
                                            Films de {selectedJury.first_name}{" "}
                                            {selectedJury.last_name} ({assignedFilms.length})
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4">
                                            {assignedFilms.length === 0 ? (
                                                <p className="text-sm italic text-zinc-600">
                                                    Aucun film assigné à ce juré.
                                                </p>
                                            ) : (
                                                assignedFilms.map((film) => (
                                                    <FilmCard
                                                        key={film.id}
                                                        film={film}
                                                        action="unassign"
                                                        onAction={() =>
                                                            void handleUnassign(
                                                                selectedJuryId!,
                                                                film.id,
                                                            )
                                                        }
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Unassigned films */}
                                <div
                                    className={`flex flex-col overflow-hidden ${selectedJury ? "w-1/2" : "w-full"}`}
                                >
                                    <div className="border-b border-zinc-800 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                        {selectedJury
                                            ? `Non assignés (${unassignedFilms.length})`
                                            : `Tous les films (${filteredFilms.length})`}
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4">
                                        {(selectedJury ? unassignedFilms : filteredFilms).map(
                                            (film) => (
                                                <FilmCard
                                                    key={film.id}
                                                    film={film}
                                                    action={selectedJury ? "assign" : "view"}
                                                    assignedTo={
                                                        !selectedJury
                                                            ? assignments
                                                                  .filter(
                                                                      (a) => a.film_id === film.id,
                                                                  )
                                                                  .map(
                                                                      (a) =>
                                                                          `${a.jury_first_name} ${a.jury_last_name}`,
                                                                  )
                                                            : undefined
                                                    }
                                                    onAction={
                                                        selectedJury
                                                            ? () => void handleAssign(film.id)
                                                            : undefined
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// ── Film card sub-component ────────────────────────────────────────────────────
interface FilmCardProps {
    film: FilmRow;
    action: "assign" | "unassign" | "view";
    assignedTo?: string[];
    onAction?: () => void;
}

const FilmCard = ({ film, action, assignedTo, onAction }: FilmCardProps): React.JSX.Element => {
    return (
        <div className="mb-2 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-white">
                        {film.original_title}
                    </span>
                    <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide ${STATUT_CLASS[film.statut] ?? "bg-zinc-700 text-zinc-400"}`}
                    >
                        {STATUT_LABEL[film.statut] ?? film.statut}
                    </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                    <span className="font-mono">{film.dossier_num}</span>
                    <span>·</span>
                    <span>
                        {film.first_name} {film.last_name}
                    </span>
                    <span>·</span>
                    <span>{film.country}</span>
                </div>
                {assignedTo && assignedTo.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                        {assignedTo.map((name) => (
                            <span
                                key={name}
                                className="rounded-full bg-emerald-900/30 px-2 py-0.5 text-[0.62rem] text-emerald-400"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            {action !== "view" && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        action === "assign"
                            ? "bg-emerald-700/30 text-emerald-400 hover:bg-emerald-700/50"
                            : "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                    }`}
                >
                    {action === "assign" ? "+ Assigner" : "× Retirer"}
                </button>
            )}
        </div>
    );
};

export default AdminFilmsPage;
