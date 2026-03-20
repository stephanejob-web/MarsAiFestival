import { useEffect, useState } from "react";

export interface VoteTag {
    id: number;
    key: string;
    label: string;
    icon: string;
    color: string;
    message_template: string | null;
    is_active: boolean;
    sort_order: number;
}

const FALLBACK_TAGS: VoteTag[] = [
    { id: 1, key: "rights", label: "Droits musicaux", icon: "🎵", color: "aurora", message_template: null, is_active: true, sort_order: 0 },
    { id: 2, key: "quality", label: "Qualité", icon: "📋", color: "solar", message_template: null, is_active: true, sort_order: 1 },
    { id: 3, key: "content", label: "Contenu", icon: "⚠️", color: "coral", message_template: null, is_active: true, sort_order: 2 },
    { id: 4, key: "tech", label: "YouTube", icon: "📺", color: "lavande", message_template: null, is_active: true, sort_order: 3 },
    { id: 5, key: "other", label: "Autre", icon: "❓", color: "mist", message_template: null, is_active: true, sort_order: 4 },
];

const useVoteTags = (): VoteTag[] => {
    const [tags, setTags] = useState<VoteTag[]>(FALLBACK_TAGS);

    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token) return;
        fetch("/api/vote-tags", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json() as Promise<{ success: boolean; data: VoteTag[] }>)
            .then((res) => {
                if (res.success && res.data.length > 0) setTags(res.data);
            })
            .catch(() => {});
    }, []);

    return tags;
};

export default useVoteTags;
