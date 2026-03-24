import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../constants/api";

export type SponsorLevel = "main" | "lead" | "partner" | "supporter" | "premium";

export interface Sponsor {
    id: number;
    name: string;
    partnership_statut: SponsorLevel;
    sponsored_award: string | null;
    sponsor_link: string | null;
    sponsor_logo: string | null;
}

export const LEVEL_LABELS: Record<SponsorLevel, string> = {
    main: "Principal",
    lead: "Lead",
    partner: "Partenaire",
    supporter: "Supporter",
    premium: "Premium",
};

export const useCmsSponsors = () => {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("jury_token");

    const fetchSponsors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/sponsors`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) setSponsors(json.data);
        } catch {
            /* silently fail */
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchSponsors();
    }, []);

    const createSponsor = async (data: Omit<Sponsor, "id">): Promise<boolean> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/sponsors`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.success) {
                await fetchSponsors();
                return true;
            }
        } catch {
            /* silently fail */
        }
        return false;
    };

    const updateSponsor = async (id: number, data: Partial<Sponsor>): Promise<boolean> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/sponsors/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.success) {
                await fetchSponsors();
                return true;
            }
        } catch {
            /* silently fail */
        }
        return false;
    };

    const deleteSponsor = async (id: number): Promise<void> => {
        try {
            await fetch(`${API_BASE_URL}/api/admin/sponsors/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchSponsors();
        } catch {
            /* silently fail */
        }
    };

    const uploadLogo = async (id: number, file: File): Promise<string | null> => {
        const form = new FormData();
        form.append("logo", file);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/sponsors/${id}/logo`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: form,
            });
            const json = await res.json();
            if (json.success) {
                await fetchSponsors();
                return json.url as string;
            }
        } catch {
            /* silently fail */
        }
        return null;
    };

    return { sponsors, loading, createSponsor, updateSponsor, deleteSponsor, uploadLogo };
};
