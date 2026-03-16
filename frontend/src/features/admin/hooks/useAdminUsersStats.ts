import { useState, useEffect } from "react";
import type { AdminUsersStatsData } from "../types";

interface UseAdminUsersStatsReturn {
    data: AdminUsersStatsData | null;
    isLoading: boolean;
    error: string | null;
}

const useAdminUsersStats = (): UseAdminUsersStatsReturn => {
    const [data, setData] = useState<AdminUsersStatsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async (): Promise<void> => {
            setIsLoading(true);
            setError(null);
            try {
                // Simulation d'un appel réseau (Mock data)
                await new Promise((resolve) => setTimeout(resolve, 800));

                // Données fictives retournées directement
                const mockData: AdminUsersStatsData = {
                    adminCount: 3,
                    moderatorCount: 8,
                    deactivatedCount: 2,
                    totalCreatedCount: 642,
                };

                setData(mockData);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Une erreur est survenue lors de la récupération des statistiques",
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { data, isLoading, error };
};

export default useAdminUsersStats;
