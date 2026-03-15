import React, { useCallback, useState } from "react";
import {
    LiveKitRoom,
    RoomAudioRenderer,
    useIsSpeaking,
    useLocalParticipant,
    useParticipants,
} from "@livekit/components-react";
import type { Participant } from "livekit-client";

const API = import.meta.env.VITE_API_URL as string;
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string;

// ── Participant card ───────────────────────────────────────────────────────────
const ParticipantCard = ({ participant }: { participant: Participant }): React.JSX.Element => {
    const isSpeaking = useIsSpeaking(participant);
    const isMuted = !participant.isMicrophoneEnabled;

    const meta = participant.metadata
        ? (JSON.parse(participant.metadata) as { profilPicture?: string | null })
        : null;
    const profilPicture = meta?.profilPicture ?? null;
    const name = participant.name ?? participant.identity;
    const initials = name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="flex flex-col items-center gap-1.5">
            <div
                className={`relative rounded-full transition-all duration-150 ${
                    isSpeaking ? "ring-2 ring-aurora ring-offset-2 ring-offset-[#0d1117]" : ""
                }`}
            >
                {profilPicture ? (
                    <img
                        src={profilPicture}
                        alt={initials}
                        className="h-12 w-12 rounded-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande text-[0.8rem] font-extrabold text-deep-sky">
                        {initials}
                    </div>
                )}
                {isMuted && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[0.55rem]">
                        🔇
                    </span>
                )}
                {isSpeaking && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-aurora text-[0.55rem]">
                        🔊
                    </span>
                )}
            </div>
            <span className="max-w-[72px] truncate text-center text-[0.65rem] text-white-soft/80">
                {name}
            </span>
        </div>
    );
};

// ── Room controls (inside LiveKitRoom context) ─────────────────────────────────
const RoomControls = ({ onLeave }: { onLeave: () => void }): React.JSX.Element => {
    const participants = useParticipants();
    const { localParticipant } = useLocalParticipant();
    const isMuted = !localParticipant.isMicrophoneEnabled;

    const toggleMic = (): void => {
        void localParticipant.setMicrophoneEnabled(isMuted);
    };

    return (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0d1117]/95 p-4 shadow-2xl backdrop-blur-md">
                {/* Participants */}
                <div className="flex items-end justify-center gap-4">
                    {participants.map((p) => (
                        <ParticipantCard key={p.identity} participant={p} />
                    ))}
                    {participants.length === 0 && (
                        <span className="text-[0.75rem] text-mist/50">
                            En attente des autres jurés…
                        </span>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={toggleMic}
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-lg transition-all ${
                            isMuted
                                ? "bg-coral/20 text-coral hover:bg-coral/30"
                                : "bg-aurora/20 text-aurora hover:bg-aurora/30"
                        }`}
                        title={isMuted ? "Activer le micro" : "Couper le micro"}
                    >
                        {isMuted ? "🔇" : "🎙️"}
                    </button>

                    <button
                        type="button"
                        onClick={onLeave}
                        className="flex h-11 w-28 items-center justify-center gap-2 rounded-full bg-coral text-[0.82rem] font-bold text-white transition-opacity hover:opacity-90"
                    >
                        <span>📵</span> Quitter
                    </button>
                </div>

                <div className="text-center text-[0.62rem] text-mist/40">
                    {participants.length} participant{participants.length > 1 ? "s" : ""} · Salon
                    vocal jury
                </div>
            </div>
        </div>
    );
};

// ── Main VocalPanel ────────────────────────────────────────────────────────────
interface VocalPanelProps {
    isJoined: boolean;
    onJoin: () => void;
    onLeave: () => void;
}

const VocalPanel = ({ isJoined, onLeave }: VocalPanelProps): React.JSX.Element | null => {
    const [token] = useState<string | null>(null);

    const handleLeave = useCallback((): void => {
        onLeave();
    }, [onLeave]);

    if (!isJoined || !token) return null;

    return (
        <LiveKitRoom
            token={token}
            serverUrl={LIVEKIT_URL}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={handleLeave}
        >
            <RoomAudioRenderer />
            <RoomControls onLeave={handleLeave} />
        </LiveKitRoom>
    );
};

// ── Join button (used in sidebar) ─────────────────────────────────────────────
export const VocalJoinButton = ({
    isJoined,
    onJoin,
    onLeave,
}: VocalPanelProps): React.JSX.Element => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAndJoin = useCallback(async (): Promise<void> => {
        if (isJoined) {
            setToken(null);
            onLeave();
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const jwt = localStorage.getItem("jury_token") ?? "";
            const res = await fetch(`${API}/api/vocal/token`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            const data = (await res.json()) as {
                success: boolean;
                token?: string;
                message?: string;
            };
            if (data.success && data.token) {
                setToken(data.token);
                onJoin();
            } else {
                setError(data.message ?? "Erreur");
            }
        } catch {
            setError("Erreur réseau");
        } finally {
            setLoading(false);
        }
    }, [isJoined, onJoin, onLeave]);

    const handleLeave = useCallback((): void => {
        setToken(null);
        onLeave();
    }, [onLeave]);

    return (
        <>
            <button
                type="button"
                onClick={() => void fetchAndJoin()}
                disabled={loading}
                className={`flex w-full items-center px-2.5 py-2 text-[0.8rem] transition-colors ${
                    isJoined
                        ? "text-aurora hover:text-white-soft"
                        : "text-mist hover:text-white-soft"
                }`}
            >
                <span className="mr-1.5">{isJoined ? "🔴" : "🎙️"}</span>
                <span>{loading ? "Connexion…" : isJoined ? "Vocal actif" : "Vocal jury"}</span>
                {isJoined && (
                    <span className="ml-1.5 h-[5px] w-[5px] animate-pulse rounded-full bg-aurora" />
                )}
            </button>
            {error && <p className="px-2.5 text-[0.65rem] text-coral">{error}</p>}

            {isJoined && token && (
                <LiveKitRoom
                    token={token}
                    serverUrl={LIVEKIT_URL}
                    connect={true}
                    audio={true}
                    video={false}
                    onDisconnected={handleLeave}
                >
                    <RoomAudioRenderer />
                    <RoomControls onLeave={handleLeave} />
                </LiveKitRoom>
            )}
        </>
    );
};

export default VocalPanel;
