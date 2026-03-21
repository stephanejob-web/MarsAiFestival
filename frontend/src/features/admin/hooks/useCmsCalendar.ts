import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../constants/api";

interface CalendarConfig {
    submission_open: string;
    submission_close: string;
    phase1_open: string;
    phase1_close: string;
    phase2_open: string;
    phase2_close: string;
    ceremony_date: string;
}

const empty: CalendarConfig = {
    submission_open: "", submission_close: "",
    phase1_open: "", phase1_close: "",
    phase2_open: "", phase2_close: "",
    ceremony_date: "",
};

export const useCmsCalendar = () => {
    const [data, setData] = useState<CalendarConfig>(empty);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/admin/calendar`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((r) => r.json())
            .then((json) => { if (json.success) setData({ ...empty, ...json.data }); })
            .catch(() => {});
    }, []);

    const handleChange = (field: keyof CalendarConfig, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/calendar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.success) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
        } finally {
            setIsSaving(false);
        }
    };

    return { data, isSaving, saved, handleChange, handleSave };
};
