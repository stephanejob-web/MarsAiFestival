import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export interface ChatMessage {
    id: number;
    filmId: number;
    juryId: number;
    name: string;
    initials: string;
    profilPicture: string | null;
    message: string;
    sentAt: string;
}

export interface OnlineUser {
    socketId: string;
    juryId: number;
    name: string;
    initials: string;
    profilPicture: string | null;
    filmId: number;
}

interface HistoryRow {
    id: number;
    film_id: number;
    jury_id: number;
    jury_name: string;
    jury_initials: string;
    profil_picture: string | null;
    message: string;
    sent_at: string;
}

const fromHistoryRow = (r: HistoryRow): ChatMessage => ({
    id: r.id,
    filmId: r.film_id,
    juryId: r.jury_id,
    name: r.jury_name,
    initials: r.jury_initials,
    profilPicture: r.profil_picture ?? null,
    message: r.message,
    sentAt: r.sent_at,
});

interface UseDiscussionSocketReturn {
    messages: ChatMessage[];
    onlineUsers: OnlineUser[];
    sendMessage: (message: string) => void;
    isConnected: boolean;
}

const useDiscussionSocket = (filmId: number | null): UseDiscussionSocketReturn => {
    const socketRef = useRef<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token || !filmId) return;

        const socket = io(API, { auth: { token } });
        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            socket.emit("discussion:join", filmId);
        });

        socket.on("disconnect", () => setIsConnected(false));

        socket.on("discussion:history", (rows: HistoryRow[]) => {
            setMessages(rows.map(fromHistoryRow));
        });

        socket.on("discussion:message", (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("discussion:online", (users: OnlineUser[]) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.emit("discussion:leave", filmId);
            socket.disconnect();
            socketRef.current = null;
            setMessages([]);
            setOnlineUsers([]);
            setIsConnected(false);
        };
    }, [filmId]);

    const sendMessage = (message: string): void => {
        if (!socketRef.current || !filmId || !message.trim()) return;
        socketRef.current.emit("discussion:send", { filmId, message: message.trim() });
    };

    return { messages, onlineUsers, sendMessage, isConnected };
};

export default useDiscussionSocket;
