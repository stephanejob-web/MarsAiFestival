import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "../../../services/api";
import type { AdminFilmVoteSummary } from "../types";

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export type FilterKey =
    | "tous"
    | "unanime"
    | "majorite"
    | "partage"
    | "rejete"
    | "attente"
    | "signale"
    | "selectionne"
    | "finaliste";

export type SortKey = "score" | "title" | "comments";

export type Consensus = "unanime" | "majorite" | "partage" | "rejete" | "attente";

export interface SelectionStats {
    unanime: number;
    majorite: number;
    partage: number;
    rejete: number;
    attente: number;
    signale: number;
    selectionne: number;
    finaliste: number;
}

const POLL_INTERVAL_MS = 30_000;

export interface UseAdminSelectionReturn {
    allFilms: AdminFilmVoteSummary[];
    filtered: AdminFilmVoteSummary[];
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    filter: FilterKey;
    setFilter: (f: FilterKey) => void;
    sort: SortKey;
    setSort: (s: SortKey) => void;
    search: string;
    setSearch: (s: string) => void;
    stats: SelectionStats;
    updateStatut: (filmId: number, statut: string) => Promise<void>;
    reload: () => void;
}

export const getConsensus = (film: AdminFilmVoteSummary): Consensus => {
    const totalJury = film.total_jury ?? film.total_assigned;
    if (film.total_votes === 0) return "attente";
    // Pas encore tous votés → en attente
    if (film.total_votes < totalJury) return "attente";
    // Tous les jurés ont voté
    if (film.votes_valide === totalJury) return "unanime"; // unanimité valide
    if (film.votes_refuse === totalJury) return "rejete"; // unanimité refuse
    if (film.votes_valide > totalJury / 2) return "majorite"; // majorité valide
    if (film.votes_refuse > totalJury / 2) return "rejete"; // majorité refuse
    return "partage";
};

// Maquette score formula: (valide*2 + arevoir*0.5 - refuse*1.5) / voted
export const getScore = (film: AdminFilmVoteSummary): number => {
    if (film.total_votes === 0) return -1;
    return (
        (film.votes_valide * 2 + film.votes_arevoir * 0.5 - film.votes_refuse * 1.5) /
        film.total_votes
    );
};

const useAdminSelection = (): UseAdminSelectionReturn => {
    const [allFilms, setAllFilms] = useState<AdminFilmVoteSummary[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [filter, setFilter] = useState<FilterKey>("tous");
    const [sort, setSort] = useState<SortKey>("score");
    const [search, setSearch] = useState<string>("");
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const load = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiFetch<ApiResponse<AdminFilmVoteSummary[]>>(
                "/api/votes/summary",
                { headers: { Authorization: `Bearer ${getToken()}` } },
            );
            if (result.success) {
                setAllFilms(result.data);
                setLastUpdated(new Date());
            } else {
                setError(result.message ?? "Erreur lors du chargement.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Silent refresh (no loading spinner) for polling
    const silentRefresh = useCallback(async (): Promise<void> => {
        try {
            const result = await apiFetch<ApiResponse<AdminFilmVoteSummary[]>>(
                "/api/votes/summary",
                { headers: { Authorization: `Bearer ${getToken()}` } },
            );
            if (result.success) {
                setAllFilms(result.data);
                setLastUpdated(new Date());
            }
        } catch {
            // Silent — don't disrupt the view on background errors
        }
    }, []);

    useEffect(() => {
        void load();
        pollRef.current = setInterval(() => {
            void silentRefresh();
        }, POLL_INTERVAL_MS);
        return (): void => {
            if (pollRef.current !== null) clearInterval(pollRef.current);
        };
    }, [load, silentRefresh]);

    const stats = useMemo(
        (): SelectionStats => ({
            unanime: allFilms.filter((f) => getConsensus(f) === "unanime").length,
            majorite: allFilms.filter((f) => getConsensus(f) === "majorite").length,
            partage: allFilms.filter((f) => getConsensus(f) === "partage").length,
            rejete: allFilms.filter((f) => getConsensus(f) === "rejete").length,
            attente: allFilms.filter((f) => getConsensus(f) === "attente").length,
            signale: allFilms.filter((f) => f.total_tickets > 0).length,
            selectionne: allFilms.filter((f) => f.statut === "selectionne").length,
            finaliste: allFilms.filter((f) => f.statut === "finaliste").length,
        }),
        [allFilms],
    );

    const filtered = useMemo((): AdminFilmVoteSummary[] => {
        let result = [...allFilms];

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (f) =>
                    f.original_title.toLowerCase().includes(q) ||
                    f.dossier_num.toLowerCase().includes(q),
            );
        }

        if (filter === "unanime") result = result.filter((f) => getConsensus(f) === "unanime");
        else if (filter === "majorite")
            result = result.filter((f) => getConsensus(f) === "majorite");
        else if (filter === "partage") result = result.filter((f) => getConsensus(f) === "partage");
        else if (filter === "rejete") result = result.filter((f) => getConsensus(f) === "rejete");
        else if (filter === "attente") result = result.filter((f) => getConsensus(f) === "attente");
        else if (filter === "signale") result = result.filter((f) => f.total_tickets > 0);
        else if (filter === "selectionne")
            result = result.filter((f) => f.statut === "selectionne");
        else if (filter === "finaliste") result = result.filter((f) => f.statut === "finaliste");

        if (sort === "score") {
            result.sort((a, b) => getScore(b) - getScore(a));
        } else if (sort === "title") {
            result.sort((a, b) => a.original_title.localeCompare(b.original_title));
        } else if (sort === "comments") {
            result.sort((a, b) => b.total_comments - a.total_comments);
        }

        return result;
    }, [allFilms, filter, sort, search]);

    const updateStatut = useCallback(
        async (filmId: number, statut: string): Promise<void> => {
            setAllFilms((prev) => prev.map((f) => (f.film_id === filmId ? { ...f, statut } : f)));
            try {
                await apiFetch<{ success: boolean }>(`/api/films/${filmId}`, {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({ statut }),
                });
            } catch {
                await load();
            }
        },
        [load],
    );

    return {
        allFilms,
        filtered,
        isLoading,
        error,
        lastUpdated,
        filter,
        setFilter,
        sort,
        setSort,
        search,
        setSearch,
        stats,
        updateStatut,
        reload: load,
    };
};

export default useAdminSelection;
