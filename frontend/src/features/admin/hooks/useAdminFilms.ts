import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../../services/api";
import type { AdminFilm, AdminAssignment, AdminJuryMember } from "../types";

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface UseAdminFilmsReturn {
    films: AdminFilm[];
    juryMembers: AdminJuryMember[];
    assignments: AdminAssignment[];
    isLoading: boolean;
    error: string | null;
    isDistributing: boolean;
    toggleAssignment: (juryId: number, filmId: number) => Promise<void>;
    autoDistribute: () => Promise<void>;
    deleteFilm: (filmId: number) => Promise<void>;
    reload: () => void;
}

const useAdminFilms = (): UseAdminFilmsReturn => {
    const [films, setFilms] = useState<AdminFilm[]>([]);
    const [juryMembers, setJuryMembers] = useState<AdminJuryMember[]>([]);
    const [assignments, setAssignments] = useState<AdminAssignment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDistributing, setIsDistributing] = useState<boolean>(false);

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
        try {
            await apiFetch<{ success: boolean }>("/api/assignments/auto-distribute", {
                method: "POST",
                headers: authHeader,
            });
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de distribution");
        } finally {
            setIsDistributing(false);
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
        toggleAssignment,
        autoDistribute,
        deleteFilm,
        reload: load,
    };
};

export default useAdminFilms;
