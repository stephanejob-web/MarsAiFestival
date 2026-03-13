import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app";

const PORT = process.env.PORT || 5500;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: { origin: "*" },
});

interface ChatMessage {
    id: string;
    author: string;
    initials: string;
    profilPicture: string | null;
    text: string;
    timestamp: number;
    senderId: string;
}

interface ConnectedUser {
    socketId: string;
    author: string;
    initials: string;
    profilPicture: string | null;
}

const messages: ChatMessage[] = [];
const MAX_HISTORY = 100;
const connectedUsers = new Map<string, ConnectedUser>();

io.on("connection", (socket: import("socket.io").Socket) => {
    socket.emit("chat:history", messages);

    // Jury member joins with their profile
    socket.on(
        "chat:join",
        (user: { author: string; initials: string; profilPicture: string | null }) => {
            connectedUsers.set(socket.id, { socketId: socket.id, ...user });
            io.emit("chat:online", Array.from(connectedUsers.values()));
        },
    );

    socket.on(
        "chat:send",
        (msg: { author: string; initials: string; profilPicture: string | null; text: string }) => {
            if (!msg.text?.trim()) return;

            const message: ChatMessage = {
                id: `${Date.now()}-${Math.random()}`,
                author: msg.author,
                initials: msg.initials,
                profilPicture: msg.profilPicture ?? null,
                text: msg.text.trim(),
                timestamp: Date.now(),
                senderId: socket.id,
            };

            messages.push(message);
            if (messages.length > MAX_HISTORY) messages.shift();
            io.emit("chat:message", message);
        },
    );

    socket.on("disconnect", () => {
        connectedUsers.delete(socket.id);
        io.emit("chat:online", Array.from(connectedUsers.values()));
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // eslint-disable-line no-console
});
