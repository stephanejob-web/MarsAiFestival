import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../constants/api";

export interface ContactConfig {
    contact_email: string;
    contact_instagram: string;
    contact_website: string;
    contact_description: string;
}

const empty: ContactConfig = {
    contact_email: "",
    contact_instagram: "",
    contact_website: "",
    contact_description: "",
};

export const useCmsContact = () => {
    const [data, setData] = useState<ContactConfig>(empty);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("jury_token");

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/admin/contact`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setData({ ...empty, ...json.data });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (field: keyof ContactConfig, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/contact`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return { data, loading, isSaving, saved, handleChange, handleSave };
};
