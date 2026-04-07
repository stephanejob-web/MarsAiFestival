import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export interface PollDetail {
    juryId: number;
    firstName: string;
    lastName: string;
    profilPicture: string | null;
    decision: string;
}

export interface PollData {
    filmId: number;
    tally: {
        valide: number;
        arevoir: number;
        refuse: number;
        in_discussion: number;
    };
    total: number;
    details: PollDetail[];
}

const useLivePoll = (filmId: number | null): PollData | null => {
    const [poll, setPoll] = useState<PollData | null>(null);
    const socketRef = useRef<Socket | null>(null);

    // Charger les votes initiaux via HTTP
    useEffect(() => {
        if (!filmId) {
            setPoll(null);
            return;
        }
        const token = localStorage.getItem("jury_token");
        if (!token) return;

        fetch(`${API}/api/votes?filmId=${filmId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then(
                (data: {
                    success: boolean;
                    data: Array<{
                        jury_id: number;
                        first_name: string;
                        last_name: string;
                        profil_picture: string | null;
                        decision: string;
                    }>;
                }) => {
                    if (!data.success) return;
                    const tally = { valide: 0, arevoir: 0, refuse: 0, in_discussion: 0 };
                    for (const v of data.data) {
                        const d = v.decision as keyof typeof tally;
                        if (d in tally) tally[d]++;
                    }
                    setPoll({
                        filmId,
                        tally,
                        total: data.data.length,
                        details: data.data.map((v) => ({
                            juryId: v.jury_id,
                            firstName: v.first_name,
                            lastName: v.last_name,
                            profilPicture: v.profil_picture ?? null,
                            decision: v.decision,
                        })),
                    });
                },
            )
            .catch(() => null);
    }, [filmId]);

    // Socket pour mises à jour en temps réel
    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token) return;

        const socket = io(API, { auth: { token } });
        socketRef.current = socket;

        socket.on("poll:update", (payload: PollData) => {
            if (filmId === null || payload.filmId === filmId) {
                setPoll(payload);
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [filmId]);

    return poll;
};

export default useLivePoll;
