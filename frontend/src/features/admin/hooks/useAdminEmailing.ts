import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../../services/api";

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

export interface Realisator {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    country: string | null;
    newsletter: boolean;
    film_title: string;
    dossier_num: string;
    submitted_at: string;
}

interface BulkEmailResult {
    sent: number;
    failed: number;
}

const useAdminEmailing = () => {
    const [realisators, setRealisators] = useState<Realisator[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [sendResult, setSendResult] = useState<BulkEmailResult | null>(null);

    const load = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiFetch<{ success: boolean; data: Realisator[] }>(
                "/api/admin/realisators",
                { headers: { Authorization: `Bearer ${getToken()}` } },
            );
            if (data.success) setRealisators(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur de chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const sendBulkEmail = useCallback(
        async (emails: string[], subject: string, message: string): Promise<void> => {
            setIsSending(true);
            setSendResult(null);
            try {
                const data = await apiFetch<{ success: boolean; sent: number; failed: number }>(
                    "/api/admin/emailing",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ emails, subject, message }),
                    },
                );
                setSendResult({ sent: data.sent, failed: data.failed });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur d'envoi");
            } finally {
                setIsSending(false);
            }
        },
        [],
    );

    return { realisators, isLoading, error, isSending, sendResult, sendBulkEmail, setSendResult };
};

export default useAdminEmailing;
