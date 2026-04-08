import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export interface DiscussionFilm {
    film_id: number;
    original_title: string;
    dossier_num: string;
    video_url: string | null;
    poster_img: string | null;
    duration: number | null;
    ia_class: "full" | "hybrid" | null;
    ia_image: number;
    ia_son: number;
    ia_scenario: number;
    ia_post: number;
    creative_workflow: string | null;
    tech_stack: string | null;
    subtitle_fr_url: string | null;
    subtitle_en_url: string | null;
    film_year: number | null;
    realisator_first: string;
    realisator_last: string;
    realisator_country: string | null;
    added_by_first: string;
    added_by_last: string;
}

export interface UseSharedDiscussionReturn {
    films: DiscussionFilm[];
    isLoading: boolean;
}

const useSharedDiscussion = (): UseSharedDiscussionReturn => {
    const [films, setFilms] = useState<DiscussionFilm[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const socketRef = useRef<Socket | null>(null);

    const fetchFilms = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("jury_token");
        if (!token) return;
        try {
            const res = await fetch(`${API}/api/discussion/films`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = (await res.json()) as { success: boolean; data: DiscussionFilm[] };
            if (json.success) setFilms(json.data);
        } catch {
            // silencieux
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchFilms();

        const token = localStorage.getItem("jury_token");
        if (!token) return;

        const socket = io(API, { auth: { token } });
        socketRef.current = socket;

        socket.on("discussion-list:updated", (data: DiscussionFilm[]) => {
            setFilms(data);
        });

        return (): void => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [fetchFilms]);

    return { films, isLoading };
};

export default useSharedDiscussion;
