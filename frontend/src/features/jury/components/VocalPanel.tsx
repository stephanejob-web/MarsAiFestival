import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    LiveKitRoom,
    RoomAudioRenderer,
    useIsSpeaking,
    useLocalParticipant,
    useParticipantInfo,
    useParticipants,
    useTracks,
    VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import type { Participant, TrackPublication } from "livekit-client";

const API = import.meta.env.VITE_API_URL as string;
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string;

// ── Tuile participant mini (mode réduit) ──────────────────────────────────────
const MiniTile = ({ participant }: { participant: Participant }): React.JSX.Element => {
    const isSpeaking = useIsSpeaking(participant);
    const isMuted = !participant.isMicrophoneEnabled;
    const isCameraOn = participant.isCameraEnabled;
    const { name } = useParticipantInfo({ participant });

    const meta = participant.metadata
        ? (JSON.parse(participant.metadata) as { profilPicture?: string | null })
        : null;
    const profilPicture = meta?.profilPicture ?? null;
    const displayName = name ?? participant.identity;
    const initials = displayName
        .split(" ")
        .map((p: string) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const cameraPub = participant.getTrackPublication(Track.Source.Camera) as
        | TrackPublication
        | undefined;

    return (
        <div
            className={`relative flex-shrink-0 overflow-hidden rounded-xl border bg-[#0d1117] transition-all duration-150 ${
                isSpeaking
                    ? "border-aurora shadow-[0_0_10px_rgba(78,255,206,0.35)]"
                    : "border-white/[0.08]"
            }`}
            style={{ width: 112, height: 84 }}
        >
            {isCameraOn && cameraPub ? (
                <VideoTrack
                    trackRef={{
                        participant,
                        publication: cameraPub,
                        source: Track.Source.Camera,
                    }}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    {profilPicture ? (
                        <img
                            src={profilPicture}
                            alt={initials}
                            className="h-9 w-9 rounded-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande text-[0.7rem] font-extrabold text-deep-sky">
                            {initials}
                        </div>
                    )}
                </div>
            )}

            {/* Bandeau nom */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/60 px-1.5 py-0.5">
                <span className="max-w-[72px] truncate text-[0.55rem] font-medium text-white/80">
                    {displayName}
                </span>
                <div className="flex items-center gap-0.5">
                    {isMuted && <span className="text-[0.5rem]">🔇</span>}
                    {isSpeaking && !isMuted && (
                        <span className="h-1 w-1 animate-pulse rounded-full bg-aurora" />
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Tuile participant étendue (mode agrandi) ───────────────────────────────────
const FullTile = ({ participant }: { participant: Participant }): React.JSX.Element => {
    const isSpeaking = useIsSpeaking(participant);
    const isMuted = !participant.isMicrophoneEnabled;
    const isCameraOn = participant.isCameraEnabled;
    const { name } = useParticipantInfo({ participant });

    const meta = participant.metadata
        ? (JSON.parse(participant.metadata) as { profilPicture?: string | null })
        : null;
    const profilPicture = meta?.profilPicture ?? null;
    const displayName = name ?? participant.identity;
    const initials = displayName
        .split(" ")
        .map((p: string) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const cameraPub = participant.getTrackPublication(Track.Source.Camera) as
        | TrackPublication
        | undefined;

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border bg-[#0d1117] transition-all duration-150 ${
                isSpeaking
                    ? "border-aurora shadow-[0_0_16px_rgba(78,255,206,0.3)]"
                    : "border-white/[0.08]"
            }`}
            style={{ width: 200, height: 150 }}
        >
            {isCameraOn && cameraPub ? (
                <VideoTrack
                    trackRef={{
                        participant,
                        publication: cameraPub,
                        source: Track.Source.Camera,
                    }}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                    {profilPicture ? (
                        <img
                            src={profilPicture}
                            alt={initials}
                            className="h-14 w-14 rounded-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande text-[0.9rem] font-extrabold text-deep-sky">
                            {initials}
                        </div>
                    )}
                </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/50 px-2 py-1 backdrop-blur-sm">
                <span className="max-w-[130px] truncate text-[0.65rem] font-semibold text-white-soft">
                    {displayName}
                </span>
                <div className="flex items-center gap-1">
                    {isMuted && <span className="text-[0.6rem]">🔇</span>}
                    {isSpeaking && !isMuted && (
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aurora" />
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Mini-panel flottant déplaçable ────────────────────────────────────────────
const FloatingPanel = ({ onLeave }: { onLeave: () => void }): React.JSX.Element => {
    const [expanded, setExpanded] = useState(false);

    // Position initiale : coin bas-droit
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    // Initialiser la position après le premier rendu (on connaît la taille de la fenêtre)
    useEffect(() => {
        if (pos === null) {
            setPos({ x: window.innerWidth - 320, y: window.innerHeight - 280 });
        }
    }, [pos]);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
        // Ne pas déclencher le drag sur les boutons
        if ((e.target as HTMLElement).closest("button")) return;
        dragging.current = true;
        dragOffset.current = {
            x: e.clientX - (pos?.x ?? 0),
            y: e.clientY - (pos?.y ?? 0),
        };
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
        if (!dragging.current || !panelRef.current) return;
        const pw = panelRef.current.offsetWidth;
        const ph = panelRef.current.offsetHeight;
        const x = Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - pw);
        const y = Math.min(Math.max(0, e.clientY - dragOffset.current.y), window.innerHeight - ph);
        setPos({ x, y });
    };

    const onPointerUp = (): void => {
        dragging.current = false;
    };
    const participants = useParticipants();
    const { localParticipant } = useLocalParticipant();
    const isMuted = !localParticipant.isMicrophoneEnabled;
    const isCameraOn = localParticipant.isCameraEnabled;
    const isScreenSharing = localParticipant.isScreenShareEnabled;
    const screenTracks = useTracks([Track.Source.ScreenShare]);

    const toggleMic = (): void => {
        void localParticipant.setMicrophoneEnabled(isMuted);
    };
    const toggleCamera = (): void => {
        void localParticipant.setCameraEnabled(!isCameraOn);
    };
    const toggleScreen = (): void => {
        void localParticipant.setScreenShareEnabled(!isScreenSharing);
    };

    if (pos === null) return <></>;

    return (
        <div
            ref={panelRef}
            className="fixed z-50"
            style={{ left: pos.x, top: pos.y }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        >
            {/* Panel principal */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]/95 shadow-2xl backdrop-blur-md">
                {/* Header draggable */}
                <div
                    className="flex cursor-grab items-center justify-between border-b border-white/[0.06] px-3 py-2 active:cursor-grabbing"
                    style={{ userSelect: "none" }}
                >
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-aurora" />
                        <span className="font-display text-[0.72rem] font-extrabold text-white-soft">
                            Salon jury
                        </span>
                        <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.6rem] text-mist">
                            {participants.length} en ligne
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="rounded-md p-1 text-[0.75rem] text-mist transition-colors hover:bg-white/[0.06] hover:text-white-soft"
                        title={expanded ? "Réduire" : "Agrandir"}
                    >
                        {expanded ? "⊟" : "⊞"}
                    </button>
                </div>

                {/* Partage d'écran (visible en mode étendu seulement) */}
                {expanded && screenTracks.length > 0 && (
                    <div className="relative p-2">
                        <div className="relative overflow-hidden rounded-xl border border-aurora/30">
                            <VideoTrack
                                trackRef={screenTracks[0]}
                                className="max-h-[200px] w-full rounded-xl object-contain"
                            />
                            <div className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[0.6rem] text-aurora">
                                🖥️ Partage d&apos;écran
                            </div>
                        </div>
                    </div>
                )}

                {/* Grille participants */}
                <div className={`p-2 ${expanded ? "flex flex-wrap gap-2" : "flex gap-1.5"}`}>
                    {participants.length === 0 ? (
                        <span className="px-2 py-1 text-[0.65rem] text-mist/50">En attente…</span>
                    ) : expanded ? (
                        participants.map((p) => <FullTile key={p.identity} participant={p} />)
                    ) : (
                        participants.map((p) => <MiniTile key={p.identity} participant={p} />)
                    )}
                </div>

                {/* Contrôles */}
                <div className="flex items-center justify-center gap-2 border-t border-white/[0.06] px-3 py-2">
                    {/* Micro */}
                    <button
                        type="button"
                        onClick={toggleMic}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all ${
                            isMuted
                                ? "bg-coral/20 text-coral hover:bg-coral/30"
                                : "bg-aurora/15 text-aurora hover:bg-aurora/25"
                        }`}
                        title={isMuted ? "Activer le micro" : "Couper le micro"}
                    >
                        {isMuted ? "🔇" : "🎙️"}
                    </button>

                    {/* Caméra */}
                    <button
                        type="button"
                        onClick={toggleCamera}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all ${
                            isCameraOn
                                ? "bg-aurora/15 text-aurora hover:bg-aurora/25"
                                : "bg-white/[0.05] text-mist hover:bg-white/[0.10]"
                        }`}
                        title={isCameraOn ? "Éteindre la caméra" : "Activer la caméra"}
                    >
                        {isCameraOn ? "📹" : "📷"}
                    </button>

                    {/* Partage d'écran */}
                    <button
                        type="button"
                        onClick={toggleScreen}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all ${
                            isScreenSharing
                                ? "bg-solar/20 text-solar hover:bg-solar/30"
                                : "bg-white/[0.05] text-mist hover:bg-white/[0.10]"
                        }`}
                        title={isScreenSharing ? "Arrêter le partage" : "Partager l'écran"}
                    >
                        🖥️
                    </button>

                    {/* Séparateur */}
                    <div className="h-4 w-px bg-white/[0.08]" />

                    {/* Quitter */}
                    <button
                        type="button"
                        onClick={onLeave}
                        className="flex h-8 items-center gap-1.5 rounded-full bg-coral px-3 text-[0.72rem] font-bold text-white transition-opacity hover:opacity-85"
                    >
                        <span>📵</span>
                        <span>Quitter</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Bouton rejoindre (utilisé dans la sidebar) ────────────────────────────────
interface VocalPanelProps {
    isJoined: boolean;
    onJoin: () => void;
    onLeave: () => void;
}

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
                <span>
                    {loading ? "Connexion…" : isJoined ? "Vocal/Vidéo actif" : "Vocal & Vidéo"}
                </span>
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
                    video={true}
                    onDisconnected={handleLeave}
                >
                    <RoomAudioRenderer />
                    <FloatingPanel onLeave={handleLeave} />
                </LiveKitRoom>
            )}
        </>
    );
};

export default VocalJoinButton;
