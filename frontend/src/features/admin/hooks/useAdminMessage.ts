import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL ?? "";

export const useAdminMessage = (): { adminMessage: string | null; clearMessage: () => void } => {
    const [adminMessage, setAdminMessage] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token) return;

        const socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            auth: { token },
        });

        socket.on("admin:message", (data: { message: string }) => {
            setAdminMessage(data.message);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { adminMessage, clearMessage: () => setAdminMessage(null) };
};
