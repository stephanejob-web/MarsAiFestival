import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL ?? "";

export const useBanProtection = (): { isBanned: boolean } => {
    const [isBanned, setIsBanned] = useState(false);

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

        return () => {
            socket.disconnect();
        };
    }, []);

    return { isBanned };
};
