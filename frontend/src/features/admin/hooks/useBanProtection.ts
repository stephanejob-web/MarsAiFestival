import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL ?? "";

export const useBanProtection = (): {
    isBanned: boolean;
    isSessionExpired: boolean;
    adminMessage: string | null;
    clearAdminMessage: () => void;
} => {
    const [isBanned, setIsBanned] = useState(false);
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const [adminMessage, setAdminMessage] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token) return;

        const socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            auth: { token },
        });

        socket.on("user:banned", () => {
            setIsBanned(true);
            localStorage.removeItem("jury_token");
        });

        socket.on("user:session_invalidated", () => {
            localStorage.removeItem("jury_token");
            setIsSessionExpired(true);
        });

        socket.on("connect_error", (err: Error) => {
            if (err.message === "auth:session_expired") {
                localStorage.removeItem("jury_token");
                setIsSessionExpired(true);
            }
        });

        socket.on("admin:message", (data: { message: string }) => {
            setAdminMessage(data.message);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return {
        isBanned,
        isSessionExpired,
        adminMessage,
        clearAdminMessage: () => setAdminMessage(null),
    };
};
