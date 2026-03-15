import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5500";

export interface ChatMessage {
    id: string;
    juryId: number | null;
    author: string;
    initials: string;
    profilPicture: string | null;
    text: string;
    timestamp: number;
    senderId: string | null;
}

export interface ConnectedUser {
    socketId: string;
    juryId: number;
    author: string;
    initials: string;
    profilPicture: string | null;
}

export interface UseJuryChatReturn {
    messages: ChatMessage[];
    connectedUsers: ConnectedUser[];
    inputValue: string;
    unreadCount: number;
    isConnected: boolean;
    onlineCount: number;
    mySocketId: string | null;
    setInputValue: (value: string) => void;
    sendMessage: () => void;
}

const useJuryChat = (isChatOpen: boolean): UseJuryChatReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineCount, setOnlineCount] = useState(0);
    const [mySocketId, setMySocketId] = useState<string | null>(null);
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
            setIsConnected(true);
            setMySocketId(socket.id ?? null);
            socket.emit("chat:join");
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            setMySocketId(null);
        });

        socket.on("chat:history", (history: ChatMessage[]) => setMessages(history));

        socket.on("chat:message", (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
            setUnreadCount((prev) => prev + 1);
        });

        socket.on("chat:online", (users: ConnectedUser[]) => {
            setConnectedUsers(users);
            setOnlineCount(users.length);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (isChatOpen) setUnreadCount(0); // eslint-disable-line react-hooks/set-state-in-effect
    }, [isChatOpen]);

    const sendMessage = (): void => {
        const text = inputValue.trim();
        if (!text || !socketRef.current) return;
        socketRef.current.emit("chat:send", { text });
        setInputValue("");
    };

    return {
        messages,
        connectedUsers,
        inputValue,
        unreadCount,
        isConnected,
        onlineCount,
        mySocketId,
        setInputValue,
        sendMessage,
    };
};

export default useJuryChat;
