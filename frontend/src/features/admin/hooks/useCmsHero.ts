import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../constants/api";

export interface HeroConfig {
    hero_label: string;
    hero_title: string;
    hero_description: string;
    hero_content: string;
    hero_tag1: string;
    hero_tag2: string;
    hero_tag3: string;
    hero_tag4: string;
    hero_video_path: string | null;
}

const empty: HeroConfig = {
    hero_label: "",
    hero_title: "",
    hero_description: "",
    hero_content: "",
    hero_tag1: "",
    hero_tag2: "",
    hero_tag3: "",
    hero_tag4: "",
    hero_video_path: null,
};

export const useCmsHero = () => {
    const [data, setData] = useState<HeroConfig>(empty);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("jury_token");

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/admin/hero`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setData({ ...empty, ...json.data });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (field: keyof HeroConfig, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/hero`, {
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

    const uploadVideo = async (file: File): Promise<string | null> => {
        const form = new FormData();
        form.append("video", file);
        const res = await fetch(`${API_BASE_URL}/api/admin/hero/video`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: form,
        });
        const json = await res.json();
        if (json.success) {
            setData((prev) => ({ ...prev, hero_video_path: json.url }));
            return json.url as string;
        }
        return null;
    };

    return { data, loading, isSaving, saved, handleChange, handleSave, uploadVideo };
};
