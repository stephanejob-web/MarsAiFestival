import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../../services/api";
import type { AdminUser } from "../types";

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

interface ApiUsersResponse {
    success: boolean;
    data: AdminUser[];
}

export interface UseAdminUsersReturn {
    users: AdminUser[];
    isLoading: boolean;
    error: string | null;
    toggleStatus: (id: number, isActive: boolean) => Promise<void>;
    reload: () => void;
}

const useAdminUsers = (): UseAdminUsersReturn => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiFetch<ApiUsersResponse>("/api/admin/users", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (data.success) setUsers(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const toggleStatus = async (id: number, isActive: boolean): Promise<void> => {
        try {
            await apiFetch<{ success: boolean }>(`/api/admin/users/${id}/status`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ isActive }),
            });
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la modification");
        }
    };

    return { users, isLoading, error, toggleStatus, reload: load };
};

export default useAdminUsers;
