import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";

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

export interface VocalUser {
    juryId: number;
    name: string;
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
    vocalUsers: VocalUser[];
    setInputValue: (value: string) => void;
    sendMessage: () => void;
    joinVocal: () => void;
    leaveVocal: () => void;
}

const useJuryChat = (isChatOpen: boolean): UseJuryChatReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineCount, setOnlineCount] = useState(0);
    const [mySocketId, setMySocketId] = useState<string | null>(null);
    const [vocalUsers, setVocalUsers] = useState<VocalUser[]>([]);
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
            toast(`💬 ${msg.author} : ${msg.text}`, {
                position: "top-center",
                autoClose: 4000,
                style: {
                    background: "#facc15",
                    color: "#1a1a2e",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                },
            });
        });

        socket.on("chat:online", (users: ConnectedUser[]) => {
            setConnectedUsers(users);
            setOnlineCount(users.length);
        });

        socket.on("vocal:online", (users: VocalUser[]) => {
            setVocalUsers(users);
        });

        socket.on(
            "vocal:started",
            (user: { name: string; initials: string; profilPicture: string | null }) => {
                // Message système dans le chat
                const systemMsg: ChatMessage = {
                    id: `vocal-started-${Date.now()}`,
                    juryId: null,
                    author: "Système",
                    initials: "🎙️",
                    profilPicture: null,
                    text: `🎙️ ${user.name} a lancé un vocal — rejoins le salon vocal !`,
                    timestamp: Date.now(),
                    senderId: null,
                };
                setMessages((prev) => [...prev, systemMsg]);

                // Notification proéminente
                toast(`🎙️ Vocal lancé ! ${user.name} a ouvert le salon vocal`, {
                    position: "top-center",
                    autoClose: 6000,
                    style: {
                        background: "#0d1117",
                        color: "#4effce",
                        fontWeight: "800",
                        fontSize: "0.88rem",
                        border: "1.5px solid rgba(78,255,206,0.4)",
                        boxShadow: "0 0 24px rgba(78,255,206,0.15)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                    },
                });
            },
        );

        socket.on(
            "vocal:joined",
            (user: { name: string; initials: string; profilPicture: string | null }) => {
                toast(`🎙️ ${user.name} a rejoint le vocal`, {
                    position: "top-center",
                    autoClose: 4000,
                    style: {
                        background: "#0d1117",
                        color: "#4effce",
                        fontWeight: "700",
                        fontSize: "0.88rem",
                        border: "1px solid rgba(78,255,206,0.25)",
                    },
                });
            },
        );

        socket.on("vocal:left", (user: { name: string }) => {
            toast(`📵 ${user.name} a quitté le vocal`, {
                position: "top-center",
                autoClose: 3000,
                style: {
                    background: "#0d1117",
                    color: "#94a3b8",
                    fontWeight: "600",
                    fontSize: "0.88rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                },
            });
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

    const joinVocal = (): void => {
        socketRef.current?.emit("vocal:join");
    };

    const leaveVocal = (): void => {
        socketRef.current?.emit("vocal:leave");
    };

    return {
        messages,
        connectedUsers,
        inputValue,
        unreadCount,
        isConnected,
        onlineCount,
        mySocketId,
        vocalUsers,
        setInputValue,
        sendMessage,
        joinVocal,
        leaveVocal,
    };
};

export default useJuryChat;
