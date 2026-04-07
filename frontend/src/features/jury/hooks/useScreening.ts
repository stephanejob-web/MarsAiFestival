import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export interface ScreeningPayload {
    filmId: number;
    title: string;
    country: string;
    videoUrl: string | null;
    startedAt: number;
    seekTime?: number;
    seekedAt?: number;
}

const useScreening = (): ScreeningPayload | null => {
    const [screening, setScreening] = useState<ScreeningPayload | null>(null);
    const socketRef = useRef<Socket | null>(null);

    // Récupérer l'état courant au montage (au cas où la projection est déjà en cours)
    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token) return;

        fetch(`${API}/api/vocal/screening-state`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data: { success: boolean; data: ScreeningPayload | null }) => {
                if (data.success && data.data) setScreening(data.data);
            })
            .catch(() => null);
    }, []);

    // Socket pour les événements en temps réel
    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token) return;

        const socket = io(API, { auth: { token } });
        socketRef.current = socket;

        socket.on("screening:start", (payload: ScreeningPayload) => {
            setScreening(payload);
        });

        socket.on("screening:stop", () => {
            setScreening(null);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    return screening;
};

export default useScreening;
