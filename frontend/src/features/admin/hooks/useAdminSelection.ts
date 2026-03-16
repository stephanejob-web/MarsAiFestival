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
    | "partage"
    | "rejete"
    | "attente"
    | "signale"
    | "selectionne"
    | "finaliste";

export type SortKey = "score" | "title" | "comments";

export type Consensus = "unanime" | "partage" | "rejete" | "attente";

export interface SelectionStats {
    unanime: number;
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

// Maquette formula: unanime if valide > voted/2, rejete if refuse > voted/2
export const getConsensus = (film: AdminFilmVoteSummary): Consensus => {
    if (film.total_votes === 0) return "attente";
    if (film.votes_valide > film.total_votes / 2) return "unanime";
    if (film.votes_refuse > film.total_votes / 2) return "rejete";
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
