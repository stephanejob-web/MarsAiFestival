import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../../services/api";
import type { AdminFilm, AdminAssignment, AdminJuryMember } from "../types";

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface DistributionResult {
    assigned: number;
    pairs: { juryId: number; filmId: number }[];
}

export interface UseAdminFilmsReturn {
    films: AdminFilm[];
    juryMembers: AdminJuryMember[];
    assignments: AdminAssignment[];
    isLoading: boolean;
    error: string | null;
    isDistributing: boolean;
    lastDistribution: DistributionResult | null;
    toggleAssignment: (juryId: number, filmId: number) => Promise<void>;
    autoDistribute: () => Promise<void>;
    undoDistribution: () => Promise<void>;
    clearDistribution: () => void;
    unassignFilm: (filmId: number) => Promise<void>;
    unassignAll: () => Promise<void>;
    assignAll: () => Promise<void>;
    deleteFilm: (filmId: number) => Promise<void>;
    selectFilm: (filmId: number, selected: boolean) => Promise<void>;
    reload: () => void;
}

const useAdminFilms = (): UseAdminFilmsReturn => {
    const [films, setFilms] = useState<AdminFilm[]>([]);
    const [juryMembers, setJuryMembers] = useState<AdminJuryMember[]>([]);
    const [assignments, setAssignments] = useState<AdminAssignment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDistributing, setIsDistributing] = useState<boolean>(false);
    const [lastDistribution, setLastDistribution] = useState<DistributionResult | null>(null);

    const load = useCallback(async (): Promise<void> => {
        const authHeader = { Authorization: `Bearer ${getToken()}` };
        setIsLoading(true);
        setError(null);
        try {
            const [juryData, filmsData, assignData] = await Promise.all([
                apiFetch<ApiResponse<AdminJuryMember[]>>("/api/assignments/jury-members", {
                    headers: authHeader,
                }),
                apiFetch<ApiResponse<AdminFilm[]>>("/api/admin/films", {
                    headers: authHeader,
                }),
                apiFetch<ApiResponse<AdminAssignment[]>>("/api/assignments", {
                    headers: authHeader,
                }),
            ]);
            if (juryData.success) setJuryMembers(juryData.data.filter((j) => j.role === "jury"));
            if (filmsData.success) setFilms(filmsData.data);
            if (assignData.success) setAssignments(assignData.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const toggleAssignment = async (juryId: number, filmId: number): Promise<void> => {
        const authHeader = { Authorization: `Bearer ${getToken()}` };
        const isAssigned = assignments.some((a) => a.jury_id === juryId && a.film_id === filmId);

        // Optimistic update — no full reload, videos stay intact
        if (isAssigned) {
            setAssignments((prev) =>
                prev.filter((a) => !(a.jury_id === juryId && a.film_id === filmId)),
            );
        } else {
            const jury = juryMembers.find((j) => j.id === juryId);
            const film = films.find((f) => f.id === filmId);
            setAssignments((prev) => [
                ...prev,
                {
                    jury_id: juryId,
                    film_id: filmId,
                    jury_first_name: jury?.first_name ?? "",
                    jury_last_name: jury?.last_name ?? "",
                    film_title: film?.original_title ?? "",
                    assigned_at: new Date().toISOString(),
                },
            ]);
        }

        try {
            if (isAssigned) {
                await apiFetch<{ success: boolean }>(
                    `/api/assignments?juryId=${juryId}&filmId=${filmId}`,
                    { method: "DELETE", headers: authHeader },
                );
            } else {
                await apiFetch<{ success: boolean }>("/api/assignments", {
                    method: "POST",
                    headers: authHeader,
                    body: JSON.stringify({ juryId, filmId }),
                });
            }
        } catch (err) {
            // Revert optimistic update on error
            await load();
            setError(err instanceof Error ? err.message : "Erreur d'assignation");
        }
    };

    const autoDistribute = async (): Promise<void> => {
        const authHeader = { Authorization: `Bearer ${getToken()}` };
        setIsDistributing(true);
        setLastDistribution(null);
        try {
            const res = await apiFetch<{
                success: boolean;
                assigned: number;
                pairs: { juryId: number; filmId: number }[];
                message: string;
            }>("/api/assignments/auto-distribute", {
                method: "POST",
                headers: authHeader,
            });
            if (res.success) {
                setLastDistribution({ assigned: res.assigned, pairs: res.pairs ?? [] });
            }
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de distribution");
        } finally {
            setIsDistributing(false);
        }
    };

    const undoDistribution = async (): Promise<void> => {
        if (!lastDistribution || lastDistribution.pairs.length === 0) return;
        const authHeader = { Authorization: `Bearer ${getToken()}` };
        try {
            await apiFetch<{ success: boolean }>("/api/assignments/batch", {
                method: "DELETE",
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({ pairs: lastDistribution.pairs }),
            });
            setLastDistribution(null);
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur d'annulation");
        }
    };

    const clearDistribution = (): void => setLastDistribution(null);

    const unassignFilm = async (filmId: number): Promise<void> => {
        const authHeader = { Authorization: `Bearer ${getToken()}` };
        const pairs = assignments
            .filter((a) => a.film_id === filmId)
            .map((a) => ({ juryId: a.jury_id, filmId }));
        if (pairs.length === 0) return;
        // Optimistic update
        setAssignments((prev) => prev.filter((a) => a.film_id !== filmId));
        try {
            await apiFetch<{ success: boolean }>("/api/assignments/batch", {
                method: "DELETE",
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({ pairs }),
            });
        } catch (err) {
            await load();
            setError(err instanceof Error ? err.message : "Erreur de désassignation");
        }
    };

    const assignAll = async (): Promise<void> => {
        const authHeader = { Authorization: `Bearer ${getToken()}` };
        setIsDistributing(true);
        setLastDistribution(null);
        try {
            const res = await apiFetch<{
                success: boolean;
                assigned: number;
                pairs: { juryId: number; filmId: number }[];
                message: string;
            }>("/api/assignments/assign-all", {
                method: "POST",
                headers: authHeader,
            });
            if (res.success) {
                setLastDistribution({ assigned: res.assigned, pairs: res.pairs ?? [] });
            }
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur d'assignation globale");
        } finally {
            setIsDistributing(false);
        }
    };

    const unassignAll = async (): Promise<void> => {
        const authHeader = { Authorization: `Bearer ${getToken()}` };
        const pairs = assignments.map((a) => ({ juryId: a.jury_id, filmId: a.film_id }));
        if (pairs.length === 0) return;
        setAssignments([]);
        try {
            await apiFetch<{ success: boolean }>("/api/assignments/batch", {
                method: "DELETE",
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({ pairs }),
            });
        } catch (err) {
            await load();
            setError(err instanceof Error ? err.message : "Erreur de désassignation globale");
        }
    };

    const selectFilm = async (filmId: number, selected: boolean): Promise<void> => {
        const authHeader = { Authorization: `Bearer ${getToken()}` };
        const statut = selected ? "selectionne" : "soumis";
        setFilms((prev) => prev.map((f) => (f.id === filmId ? { ...f, statut } : f)));
        try {
            await apiFetch<{ success: boolean }>(`/api/films/${filmId}`, {
                method: "PATCH",
                headers: authHeader,
                body: JSON.stringify({ statut }),
            });
        } catch {
            await load();
        }
    };

    const deleteFilm = async (filmId: number): Promise<void> => {
        const authHeader = { Authorization: `Bearer ${getToken()}` };
        setFilms((prev) => prev.filter((f) => f.id !== filmId));
        setAssignments((prev) => prev.filter((a) => a.film_id !== filmId));
        try {
            await apiFetch<{ success: boolean }>(`/api/films/${filmId}`, {
                method: "DELETE",
                headers: authHeader,
            });
        } catch (err) {
            await load();
            setError(err instanceof Error ? err.message : "Erreur de suppression");
        }
    };

    return {
        films,
        juryMembers,
        assignments,
        isLoading,
        error,
        isDistributing,
        lastDistribution,
        toggleAssignment,
        autoDistribute,
        undoDistribution,
        clearDistribution,
        unassignFilm,
        unassignAll,
        assignAll,
        deleteFilm,
        selectFilm,
        reload: load,
    };
};

export default useAdminFilms;
