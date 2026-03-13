import { API_BASE_URL } from "../constants/api";

export const apiFetchForm = async <T>(endpoint: string, body: FormData): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        body,
    });

    if (!response.ok) {
        try {
            const data = await response.json();
            throw new Error(data?.message ?? `Erreur ${response.status}`);
        } catch (e) {
            if (e instanceof Error && e.message !== `Erreur ${response.status}`) throw e;
            throw new Error(`Erreur ${response.status} — réessayez.`);
        }
    }

    return response.json();
};

export const apiFetch = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
    }

    return response.json();
};
