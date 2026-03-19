import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5500";

export interface AdminVocalReturn {
    isInVocal: boolean;
    joinVocal: () => void;
    leaveVocal: () => void;
}

const useAdminVocal = (): AdminVocalReturn => {
    const [isInVocal, setIsInVocal] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token) return;

        const socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            auth: { token },
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("chat:join");
        });

        socket.on("vocal:online", (_users: { juryId: number }[]) => {
            // état géré localement via isInVocal
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    const joinVocal = (): void => {
        socketRef.current?.emit("vocal:join");
        setIsInVocal(true);
    };

    const leaveVocal = (): void => {
        socketRef.current?.emit("vocal:leave");
        setIsInVocal(false);
    };

    return { isInVocal, joinVocal, leaveVocal };
};

export default useAdminVocal;
