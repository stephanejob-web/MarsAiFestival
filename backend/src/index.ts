import "dotenv/config";
import http from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import app from "./app";
import { saveMessage, getMessagesByFilm } from "./repositories/message.repository";
import {
    saveGlobalMessage,
    getRecentGlobalMessages,
} from "./repositories/globalMessage.repository";
import { findById, getSessionToken } from "./repositories/jury.repository";

const PORT = Number(process.env.PORT) || 5500;
const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: { origin: "*" },
});

// Expose io pour les controllers HTTP (discussion.controller.ts)
app.locals.io = io;

// ── Types ──────────────────────────────────────────────────────────────────────
interface JuryPayload {
    id: number;
    firstName: string;
    lastName: string;
    profilPicture?: string | null;
    sessionToken?: string;
}

interface GlobalConnectedUser {
    socketId: string;
    juryId: number;
    author: string;
    initials: string;
    profilPicture: string | null;
}

interface OnlineUser {
    socketId: string;
    juryId: number;
    name: string;
    initials: string;
    profilPicture: string | null;
    filmId: number;
}

// ── State en mémoire ───────────────────────────────────────────────────────────
const globalUsers = new Map<string, GlobalConnectedUser>();
const onlineByFilm = new Map<number, Map<string, OnlineUser>>();
const juryToSockets = new Map<number, Set<string>>();

interface VocalUser {
    juryId: number;
    name: string;
    initials: string;
    profilPicture: string | null;
}
const vocalUsers = new Map<string, VocalUser>();

// Expose vocalUsers pour les routes HTTP admin
app.locals.vocalUsers = vocalUsers;

// Expose juryToSockets pour les controllers HTTP (ban)
app.locals.juryToSockets = juryToSockets;

const broadcastOnline = (filmId: number): void => {
    const users = Array.from(onlineByFilm.get(filmId)?.values() ?? []);
    io.to(`film:${filmId}`).emit("discussion:online", users);
};

// ── Auth middleware (JWT dans handshake.auth.token, requis) ───────────────────
io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) return next(new Error("auth:missing_token"));
    try {
        const payload = jwt.verify(token, JWT_SECRET) as JuryPayload;
        // Vérifier que la session est toujours valide
        if (payload.sessionToken) {
            const dbToken = await getSessionToken(payload.id);
            if (dbToken !== payload.sessionToken) {
                return next(new Error("auth:session_expired"));
            }
        }
        socket.data.jury = payload;
        next();
    } catch (err) {
        if (err instanceof Error && err.message === "auth:session_expired") {
            return next(err);
        }
        next(new Error("auth:invalid_token"));
    }
});

// ── Connexion ──────────────────────────────────────────────────────────────────
io.on("connection", (socket: Socket) => {
    void (async (): Promise<void> => {
        const jury = socket.data.jury as JuryPayload;
        const initials = `${jury.firstName[0]}${jury.lastName[0]}`.toUpperCase();
        const fullName = `${jury.firstName} ${jury.lastName}`;

        // Profil_picture fraîche depuis la DB (le JWT peut être périmé après un changement d'avatar)
        const freshRow = await findById(jury.id);
        const profilPicture = freshRow?.profil_picture ?? jury.profilPicture ?? null;

        // Refuser la connexion si le jury est banni
        if (freshRow?.is_banned) {
            socket.emit("user:banned");
            socket.disconnect(true);
            return;
        }

        // Reverse map juryId → socketIds (pour le ban en temps réel)
        const existingSockets = juryToSockets.get(jury.id);
        if (existingSockets) {
            existingSockets.add(socket.id);
        } else {
            juryToSockets.set(jury.id, new Set([socket.id]));
        }

        // ── Chat global (chat:*) — persisté en DB ─────────────────────────────────

        // Envoyer l'historique DB à la connexion
        void getRecentGlobalMessages(100).then((history) => {
            const formatted = history.map((r) => ({
                id: String(r.id),
                juryId: r.jury_id,
                author: r.jury_name,
                initials: r.jury_initials,
                profilPicture: r.profil_picture ?? null,
                text: r.message,
                timestamp: new Date(r.sent_at).getTime(),
                senderId: null,
            }));
            socket.emit("chat:history", formatted);
        });

        socket.on("chat:join", () => {
            globalUsers.set(socket.id, {
                socketId: socket.id,
                juryId: jury.id,
                author: fullName,
                initials,
                profilPicture,
            });
            io.emit("chat:online", Array.from(globalUsers.values()));
        });

        socket.on("chat:send", async (msg: { text: string }) => {
            const text = msg.text?.trim();
            if (!text) return;

            const row = await findById(jury.id);
            if (row?.is_banned) {
                socket.emit("user:banned");
                socket.disconnect(true);
                return;
            }

            const id = await saveGlobalMessage(jury.id, fullName, initials, text);

            const message = {
                id: String(id),
                juryId: jury.id,
                author: fullName,
                initials,
                profilPicture,
                text,
                timestamp: Date.now(),
                senderId: socket.id,
            };
            io.emit("chat:message", message);
        });

        // ── Vocal (vocal:*) ───────────────────────────────────────────────────────

        socket.on("vocal:join", () => {
            const isFirst = vocalUsers.size === 0;
            vocalUsers.set(socket.id, {
                juryId: jury.id,
                name: fullName,
                initials,
                profilPicture,
            });

            if (isFirst) {
                // Premier participant — notifier tout le monde avec un message système
                io.emit("vocal:started", {
                    name: fullName,
                    initials,
                    profilPicture,
                });
            } else {
                // Quelqu'un rejoint un vocal déjà ouvert
                socket.broadcast.emit("vocal:joined", {
                    name: fullName,
                    initials,
                    profilPicture,
                });
            }

            io.emit("vocal:online", Array.from(vocalUsers.values()));
        });

        socket.on("vocal:leave", () => {
            if (!vocalUsers.has(socket.id)) return;
            vocalUsers.delete(socket.id);
            socket.broadcast.emit("vocal:left", { name: fullName });
            io.emit("vocal:online", Array.from(vocalUsers.values()));
        });

        // ── Discussion par film (discussion:*) ────────────────────────────────────

        socket.on("discussion:join", async (filmId: number) => {
            if (!filmId || isNaN(Number(filmId))) return;
            const fid = Number(filmId);

            await socket.join(`film:${fid}`);

            if (!onlineByFilm.has(fid)) onlineByFilm.set(fid, new Map());
            onlineByFilm.get(fid)!.set(socket.id, {
                socketId: socket.id,
                juryId: jury.id,
                name: fullName,
                initials,
                profilPicture,
                filmId: fid,
            });

            broadcastOnline(fid);

            try {
                const history = await getMessagesByFilm(fid);
                socket.emit("discussion:history", history);
            } catch {
                socket.emit("discussion:history", []);
            }
        });

        socket.on("discussion:leave", (filmId: number) => {
            const fid = Number(filmId);
            socket.leave(`film:${fid}`);
            onlineByFilm.get(fid)?.delete(socket.id);
            broadcastOnline(fid);
        });

        socket.on(
            "discussion:send",
            async (payload: { filmId: number; message: string }, ack?: (ok: boolean) => void) => {
                const fid = Number(payload.filmId);
                const text = payload.message?.trim();
                if (!fid || !text) return;

                const row = await findById(jury.id);
                if (row?.is_banned) {
                    socket.emit("user:banned");
                    socket.disconnect(true);
                    if (ack) ack(false);
                    return;
                }

                try {
                    const id = await saveMessage(fid, jury.id, fullName, initials, text);
                    const msg = {
                        id,
                        filmId: fid,
                        juryId: jury.id,
                        name: fullName,
                        initials,
                        profilPicture,
                        message: text,
                        sentAt: new Date().toISOString(),
                    };
                    io.to(`film:${fid}`).emit("discussion:message", msg);
                    io.emit("discussion:notify", { filmId: fid, author: fullName });
                    if (ack) ack(true);
                } catch {
                    if (ack) ack(false);
                }
            },
        );

        // ── Déconnexion ───────────────────────────────────────────────────────────
        socket.on("disconnect", () => {
            globalUsers.delete(socket.id);
            io.emit("chat:online", Array.from(globalUsers.values()));

            // Nettoyer juryToSockets
            const jurySockets = juryToSockets.get(jury.id);
            if (jurySockets) {
                jurySockets.delete(socket.id);
                if (jurySockets.size === 0) juryToSockets.delete(jury.id);
            }

            if (vocalUsers.has(socket.id)) {
                vocalUsers.delete(socket.id);
                socket.broadcast.emit("vocal:left", { name: fullName });
                io.emit("vocal:online", Array.from(vocalUsers.values()));
            }

            for (const [filmId, users] of onlineByFilm.entries()) {
                if (users.has(socket.id)) {
                    users.delete(socket.id);
                    broadcastOnline(filmId);
                }
            }
        });
    })();
});

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`); // eslint-disable-line no-console
});
