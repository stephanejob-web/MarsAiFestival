import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const API = (import.meta.env.VITE_API_URL as string) || "";

const useDiscussionNotify = (
    selectedFilmId: number | null,
): {
    unreadCounts: Record<number, number>;
    clearUnread: (filmId: number) => void;
} => {
    const socketRef = useRef<Socket | null>(null);
    const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});

    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token) return;

        const socket = io(API, { auth: { token } });
        socketRef.current = socket;

        socket.on("discussion:notify", ({ filmId }: { filmId: number }) => {
            setUnreadCounts((prev) => {
                if (filmId === selectedFilmId) return prev;
                return { ...prev, [filmId]: (prev[filmId] ?? 0) + 1 };
            });
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [selectedFilmId]);

    const clearUnread = (filmId: number): void => {
        setUnreadCounts((prev) => ({ ...prev, [filmId]: 0 }));
    };

    return { unreadCounts, clearUnread };
};

export default useDiscussionNotify;
