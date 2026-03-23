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
    changeRole: (id: number, role: "jury" | "admin" | "moderateur") => Promise<void>;
    banUser: (id: number) => Promise<void>;
    unbanUser: (id: number) => Promise<void>;
    sendMessage: (id: number, message: string) => Promise<void>;
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
            if (data.success)
                setUsers(
                    data.data.map((u) => ({
                        ...u,
                        is_active: Boolean(u.is_active),
                        is_banned: Boolean(u.is_banned),
                    })),
                );
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

    const changeRole = async (id: number, role: "jury" | "admin" | "moderateur"): Promise<void> => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
        try {
            await apiFetch<{ success: boolean }>(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ role }),
            });
        } catch (err) {
            await load();
            setError(err instanceof Error ? err.message : "Erreur de changement de rôle");
        }
    };

    const banUser = async (id: number): Promise<void> => {
        try {
            await apiFetch<{ success: boolean }>(`/api/admin/users/${id}/ban`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de bannissement");
        }
    };

    const unbanUser = async (id: number): Promise<void> => {
        try {
            await apiFetch<{ success: boolean }>(`/api/admin/users/${id}/unban`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de réactivation");
        }
    };

    const sendMessage = async (id: number, message: string): Promise<void> => {
        try {
            await apiFetch<{ success: boolean }>(`/api/admin/users/${id}/message`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ message }),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur d'envoi du message");
        }
    };

    return {
        users,
        isLoading,
        error,
        toggleStatus,
        changeRole,
        banUser,
        unbanUser,
        sendMessage,
        reload: load,
    };
};

export default useAdminUsers;
