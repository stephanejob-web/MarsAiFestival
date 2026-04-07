import React, { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
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
import { Camera, Mic, MicOff, PhoneOff, Video } from "lucide-react";
import type { ScreeningPayload } from "../hooks/useScreening";
import useLivePoll from "../hooks/useLivePoll";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string;

interface Props {
    screening: ScreeningPayload;
}

type VoteDecision = "valide" | "arevoir" | "refuse" | "in_discussion";

const formatElapsed = (ms: number): string => {
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

// ── Tuile webcam participant ───────────────────────────────────────────────────
const WebcamTile = ({ participant, large = false }: { participant: Participant; large?: boolean }): React.JSX.Element => {
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

    const avatarSize = large ? "h-16 w-16" : "h-11 w-11";
    const nameSize = large ? "text-[0.72rem]" : "text-[0.6rem]";
    const badgeSize = large ? "text-[0.6rem]" : "text-[0.5rem]";

    return (
        <div
            className={`relative overflow-hidden rounded-xl border bg-[#0d1117] transition-all duration-200 ${
                isSpeaking
                    ? "border-aurora shadow-[0_0_16px_rgba(78,255,206,0.45)]"
                    : "border-white/[0.08]"
            } ${large ? "w-full" : ""}`}
            style={large ? { aspectRatio: "16/10", flexShrink: 0 } : { width: 140, height: 105, flexShrink: 0 }}
        >
            {isCameraOn && cameraPub ? (
                <VideoTrack
                    trackRef={{ participant, publication: cameraPub, source: Track.Source.Camera }}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0d1117] to-[#131a2e]">
                    {profilPicture ? (
                        <img
                            src={profilPicture}
                            alt={initials}
                            className={`${avatarSize} rounded-full object-cover`}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className={`flex ${avatarSize} items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande font-extrabold text-deep-sky ${large ? "text-[0.95rem]" : "text-[0.75rem]"}`}>
                            {initials}
                        </div>
                    )}
                </div>
            )}

            {/* Bandeau nom + icônes */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-2.5 pb-2 pt-6">
                <span className={`truncate font-semibold text-white/90 ${nameSize}`}>
                    {displayName}
                </span>
                <div className="flex items-center gap-1">
                    {isMuted && <MicOff size={large ? 11 : 9} className="text-coral" />}
                    {isSpeaking && !isMuted && (
                        <span className="flex gap-[2px] items-end">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className="w-[2px] rounded-full bg-aurora animate-pulse"
                                    style={{ height: (large ? 8 : 6) + i * 3, animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </span>
                    )}
                </div>
            </div>

            {/* Badge speaking */}
            {isSpeaking && (
                <div className="absolute left-2 top-2 rounded-full bg-aurora/20 px-2 py-0.5 backdrop-blur-sm">
                    <span className={`font-bold text-aurora ${badgeSize}`}>Parle</span>
                </div>
            )}
        </div>
    );
};

// ── Panneau webcam latéral (colonne gauche) ───────────────────────────────────
const WebcamPanel = ({ onLeave }: { onLeave: () => void }): React.JSX.Element => {
    const { localParticipant } = useLocalParticipant();
    const participants = useParticipants();
    const screenTracks = useTracks([Track.Source.ScreenShare]);
    const isMuted = !localParticipant.isMicrophoneEnabled;
    const isCameraOn = localParticipant.isCameraEnabled;

    const toggleMic = (): void => { void localParticipant.setMicrophoneEnabled(isMuted); };
    const toggleCamera = (): void => { void localParticipant.setCameraEnabled(!isCameraOn); };

    return (
        <div className="flex h-full flex-col">
            {/* En-tête panneau */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aurora" />
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-aurora">
                        Jury en direct
                    </span>
                </div>
                <span className="text-[0.6rem] text-mist/40">
                    {participants.length} connecté{participants.length > 1 ? "s" : ""}
                </span>
            </div>

            {/* Grille des participants — scrollable */}
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
                {participants.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center">
                        <span className="text-center text-[0.68rem] leading-relaxed text-mist/30">
                            En attente<br />des autres jurés…
                        </span>
                    </div>
                ) : (
                    participants.map((p) => (
                        <WebcamTile key={p.identity} participant={p} large />
                    ))
                )}

                {/* Partage écran miniature */}
                {screenTracks.length > 0 && (
                    <div className="relative overflow-hidden rounded-xl border border-aurora/30 bg-black">
                        <VideoTrack trackRef={screenTracks[0]} className="aspect-video w-full object-contain" />
                        <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[0.55rem] text-aurora">
                            Écran partagé
                        </div>
                    </div>
                )}
            </div>

            {/* Barre de contrôles */}
            <div className="flex shrink-0 items-center justify-center gap-2 border-t border-white/[0.06] px-3 py-3">
                <button type="button" onClick={toggleMic}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${isMuted ? "bg-coral/20 text-coral hover:bg-coral/30" : "bg-aurora/15 text-aurora hover:bg-aurora/25"}`}
                    title={isMuted ? "Activer le micro" : "Couper le micro"}>
                    {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
                </button>
                <button type="button" onClick={toggleCamera}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${isCameraOn ? "bg-aurora/15 text-aurora hover:bg-aurora/25" : "bg-white/[0.05] text-mist hover:bg-white/10"}`}
                    title={isCameraOn ? "Éteindre la caméra" : "Activer la caméra"}>
                    {isCameraOn ? <Video size={15} /> : <Camera size={15} />}
                </button>
                <button type="button" onClick={onLeave}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-coral/80 text-white transition-opacity hover:opacity-85"
                    title="Quitter la session vidéo">
                    <PhoneOff size={14} />
                </button>
            </div>
        </div>
    );
};

// ── PollBar ────────────────────────────────────────────────────────────────────
const PollBar = ({ label, count, total, color, glow, isMyVote }: {
    label: string; count: number; total: number; color: string; glow: string; isMyVote: boolean;
}): React.JSX.Element => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex flex-col gap-1.5 rounded-xl p-2.5 transition-all"
            style={isMyVote ? { outline: `1px solid ${color}50`, background: `${color}08` } : {}}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <span className="text-[0.72rem] font-semibold text-mist">{label}</span>
                    {isMyVote && (
                        <span className="rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold"
                            style={{ color, background: `${color}20` }}>Mon vote</span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[0.78rem] font-bold" style={{ color }}>{count}</span>
                    <span className="text-[0.65rem] text-mist/40">{pct}%</span>
                </div>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, background: color, boxShadow: pct > 0 ? `0 0 10px ${glow}` : "none" }} />
            </div>
        </div>
    );
};

// ── VoteBtn ────────────────────────────────────────────────────────────────────
const VoteBtn = ({ label, icon, color, bg, border, isActive, isLoading, onClick }: {
    label: string; icon: string; color: string; bg: string; border: string;
    isActive: boolean; isLoading: boolean; onClick: () => void;
}): React.JSX.Element => (
    <button type="button" onClick={onClick} disabled={isLoading}
        className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border py-3 transition-all duration-200 disabled:cursor-not-allowed ${
            isActive ? `${bg} ${border}` : `border-white/[0.08] bg-white/[0.03] hover:${bg} hover:${border}`
        }`}
        style={isActive ? { boxShadow: `0 0 20px ${color}40` } : {}}>
        <span className="text-xl">{icon}</span>
        <span className="text-[0.68rem] font-semibold" style={{ color: isActive ? color : undefined }}>{label}</span>
    </button>
);

// ── ScreeningView principal ────────────────────────────────────────────────────
const ScreeningView = ({ screening }: Props): React.JSX.Element => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [elapsed, setElapsed] = useState(Date.now() - screening.startedAt);
    const [isReady, setIsReady] = useState(false);
    const [myVote, setMyVote] = useState<VoteDecision | null>(null);
    const [voteLoading, setVoteLoading] = useState(false);
    const [voteStatus, setVoteStatus] = useState<"idle" | "ok" | "error">("idle");
    const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
    const [webcamLoading, setWebcamLoading] = useState(false);
    const [webcamError, setWebcamError] = useState<string | null>(null);

    const poll = useLivePoll(screening.filmId);

    useEffect(() => {
        const id = setInterval(() => setElapsed(Date.now() - screening.startedAt), 1000);
        return () => clearInterval(id);
    }, [screening.startedAt]);

    useEffect(() => {
        setIsReady(false);
        setMyVote(null);
        setVoteStatus("idle");
    }, [screening.filmId]);

    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token || !screening.filmId) return;
        fetch(`${API}/api/votes?filmId=${screening.filmId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data: { success: boolean; data: Array<{ jury_id: number; decision: string }> }) => {
                if (!data.success) return;
                try {
                    const payload = JSON.parse(atob(token.split(".")[1])) as { id: number };
                    const mine = data.data.find((v) => v.jury_id === payload.id);
                    if (mine) setMyVote(mine.decision as VoteDecision);
                } catch { /* ignore */ }
            })
            .catch(() => null);
    }, [screening.filmId]);

    // ── Sync seek + play/pause depuis l'admin ─────────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem("jury_token");
        if (!token) return;
        const socket = io(API, { auth: { token } });

        socket.on("screening:seek", ({ currentTime, seekedAt }: { currentTime: number; seekedAt: number }) => {
            const video = videoRef.current;
            if (!video) return;
            const lag = (Date.now() - seekedAt) / 1000;
            video.currentTime = currentTime + lag;
        });

        socket.on("screening:playback", ({ action, currentTime, emittedAt }: { action: "play" | "pause"; currentTime: number; emittedAt: number }) => {
            const video = videoRef.current;
            if (!video) return;
            const lag = (Date.now() - emittedAt) / 1000;
            video.currentTime = currentTime + (action === "play" ? lag : 0);
            if (action === "play") void video.play();
            else video.pause();
        });

        return () => { socket.disconnect(); };
    }, []);

    // ── Position initiale si le jury arrive après un seek ─────────────────────
    useEffect(() => {
        if (!screening.seekTime || !screening.seekedAt) return;
        const video = videoRef.current;
        if (!video) return;
        const lag = (Date.now() - screening.seekedAt) / 1000;
        video.currentTime = screening.seekTime + lag;
    }, [isReady, screening.seekTime, screening.seekedAt]);

    const joinWebcam = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("jury_token");
        if (!token || webcamLoading) return;
        setWebcamLoading(true);
        setWebcamError(null);
        try {
            const res = await fetch(`${API}/api/vocal/token`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = (await res.json()) as { success: boolean; token?: string; message?: string };
            if (data.success && data.token) {
                setLiveKitToken(data.token);
            } else {
                setWebcamError(data.message ?? "Erreur de connexion");
            }
        } catch {
            setWebcamError("Erreur réseau");
        } finally {
            setWebcamLoading(false);
        }
    }, [webcamLoading]);

    const leaveWebcam = useCallback((): void => {
        setLiveKitToken(null);
        setWebcamError(null);
    }, []);

    const submitVote = useCallback(async (decision: VoteDecision): Promise<void> => {
        const token = localStorage.getItem("jury_token");
        if (!token || voteLoading) return;
        setVoteLoading(true);
        setVoteStatus("idle");
        try {
            const res = await fetch(`${API}/api/votes`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ filmId: screening.filmId, decision }),
            });
            if (res.ok) {
                setMyVote(decision);
                setVoteStatus("ok");
                setTimeout(() => setVoteStatus("idle"), 2000);
            } else {
                setVoteStatus("error");
            }
        } catch {
            setVoteStatus("error");
        } finally {
            setVoteLoading(false);
        }
    }, [screening.filmId, voteLoading]);

    const totalVotes = poll?.total ?? 0;

    const VOTES = [
        { key: "valide" as VoteDecision,        label: "Valide",      icon: "✅", color: "#4effce", glow: "rgba(78,255,206,0.6)",   bg: "bg-aurora/15",  border: "border-aurora/50" },
        { key: "arevoir" as VoteDecision,       label: "À revoir",    icon: "🔄", color: "#f5e642", glow: "rgba(245,230,66,0.6)",   bg: "bg-solar/15",   border: "border-solar/50" },
        { key: "refuse" as VoteDecision,        label: "Refusé",      icon: "❌", color: "#ff6b6b", glow: "rgba(255,107,107,0.6)",  bg: "bg-coral/15",   border: "border-coral/50" },
        { key: "in_discussion" as VoteDecision, label: "Discussion",  icon: "💬", color: "#c084fc", glow: "rgba(192,132,252,0.6)",  bg: "bg-lavande/15", border: "border-lavande/50" },
    ] as const;

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-[#020408]">
            {/* Glow ambiant */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 70% 50% at 40% 50%, rgba(78,255,206,0.04) 0%, rgba(192,132,252,0.03) 50%, transparent 70%)" }}
            />

            {/* ── Header pleine largeur ─────────────────────────────────────────── */}
            <div className="flex shrink-0 items-center gap-4 border-b border-white/[0.06] bg-black/40 px-6 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-coral" />
                    <span className="font-display text-[0.72rem] font-extrabold tracking-widest text-coral">EN DIRECT</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <h1 className="flex-1 truncate font-display text-[0.95rem] font-extrabold text-white-soft">
                    {screening.title}
                </h1>
                {screening.country && <span className="text-[0.75rem] text-mist/50">{screening.country}</span>}
                <span className="font-mono text-[0.78rem] text-mist/40">{formatElapsed(elapsed)}</span>
            </div>

            {/* ── Corps : [webcam] [film] [vote] ──────────────────────────────── */}
            <div className="flex min-h-0 flex-1">

                {/* ── Panneau webcam gauche (240px) ──────────────────────────── */}
                <div className="flex w-[240px] shrink-0 flex-col border-r border-white/[0.06] bg-[#06090f]">
                    {liveKitToken ? (
                        <LiveKitRoom
                            token={liveKitToken}
                            serverUrl={LIVEKIT_URL}
                            connect={true}
                            audio={true}
                            video={true}
                            onDisconnected={leaveWebcam}
                        >
                            <RoomAudioRenderer />
                            <WebcamPanel onLeave={leaveWebcam} />
                        </LiveKitRoom>
                    ) : (
                        <div className="flex flex-1 flex-col">
                            <div className="flex shrink-0 items-center border-b border-white/[0.06] px-3 py-2.5">
                                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-mist/40">Session vidéo</span>
                            </div>
                            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d1117]"
                                        style={{ aspectRatio: "16/10" }}
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                                            <Camera size={22} className="text-mist/20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/[0.06] p-3">
                                <p className="mb-2 text-[0.68rem] leading-relaxed text-mist/40">
                                    Rejoignez la session pour voir et entendre vos collègues
                                </p>
                                {webcamError && <p className="mb-2 text-[0.68rem] text-coral">{webcamError}</p>}
                                <button
                                    type="button"
                                    onClick={() => void joinWebcam()}
                                    disabled={webcamLoading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-aurora/30 bg-aurora/10 px-3 py-2.5 text-[0.75rem] font-bold text-aurora transition-all hover:border-aurora/50 hover:bg-aurora/15 disabled:opacity-50"
                                >
                                    <Video size={13} />
                                    {webcamLoading ? "Connexion…" : "Rejoindre"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Player film centre ──────────────────────────────────────── */}
                <div className="flex flex-1 items-center justify-center bg-black p-4">
                    <div
                        className="relative w-full max-w-4xl overflow-hidden rounded-2xl"
                        style={{ boxShadow: "0 0 0 1px rgba(78,255,206,0.12), 0 0 50px rgba(78,255,206,0.07), 0 24px 60px rgba(0,0,0,0.8)" }}
                    >
                        {screening.videoUrl ? (
                            <>
                                <video
                                    ref={videoRef}
                                    src={screening.videoUrl}
                                    autoPlay
                                    controls
                                    playsInline
                                    preload="auto"
                                    onCanPlay={() => setIsReady(true)}
                                    className="aspect-video w-full bg-black"
                                />
                                {!isReady && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 backdrop-blur-sm">
                                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-aurora/30 border-t-aurora" />
                                        <span className="text-[0.8rem] text-mist">Chargement…</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex aspect-video w-full items-center justify-center bg-[#0a0f1e]">
                                <p className="text-[0.9rem] text-white-soft/30">Aucune vidéo disponible</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Panneau vote droite (290px) ─────────────────────────────── */}
                <div className="flex w-[290px] shrink-0 flex-col border-l border-white/[0.06] bg-[#06090f]">
                    <div className="border-b border-white/[0.06] px-4 py-3">
                        <div className="flex items-center justify-between">
                            <span className="font-display text-[0.82rem] font-extrabold text-white-soft">Voting Poll</span>
                            {totalVotes > 0 && (
                                <span className="rounded-full border border-aurora/20 bg-aurora/[0.08] px-2 py-0.5 font-mono text-[0.62rem] text-aurora">
                                    {totalVotes} vote{totalVotes > 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                        <p className="mt-0.5 truncate text-[0.7rem] text-mist/50">{screening.title}</p>
                    </div>

                    <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
                        {VOTES.map((v) => (
                            <PollBar
                                key={v.key}
                                label={v.label}
                                count={poll?.tally[v.key] ?? 0}
                                total={totalVotes}
                                color={v.color}
                                glow={v.glow}
                                isMyVote={myVote === v.key}
                            />
                        ))}

                        {poll && poll.details.length > 0 && (
                            <div className="mt-2 border-t border-white/[0.06] pt-3">
                                <div className="mb-2 text-[0.6rem] font-semibold uppercase tracking-widest text-mist/40">
                                    Votes des jurés
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {poll.details.map((d) => {
                                        const cfg = VOTES.find((v) => v.key === d.decision);
                                        const color = cfg?.color ?? "#888";
                                        const initials = `${d.firstName[0]}${d.lastName[0]}`.toUpperCase();
                                        return (
                                            <div
                                                key={d.juryId}
                                                title={`${d.firstName} ${d.lastName} — ${cfg?.label ?? d.decision}`}
                                                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 text-[0.55rem] font-extrabold"
                                                style={{ borderColor: color, background: `${color}20`, color }}
                                            >
                                                {d.profilPicture
                                                    ? <img src={d.profilPicture} alt="" className="h-full w-full object-cover" />
                                                    : initials}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-px w-full bg-white/[0.06]" />

                    <div className="p-3">
                        <div className="mb-2.5 text-[0.65rem] font-semibold uppercase tracking-widest text-mist/40">
                            {myVote ? "Modifier mon vote" : "Voter maintenant"}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {VOTES.map((v) => (
                                <VoteBtn
                                    key={v.key}
                                    label={v.label}
                                    icon={v.icon}
                                    color={v.color}
                                    bg={v.bg}
                                    border={v.border}
                                    isActive={myVote === v.key}
                                    isLoading={voteLoading}
                                    onClick={() => void submitVote(v.key)}
                                />
                            ))}
                        </div>
                        {voteStatus === "ok" && (
                            <p className="mt-2.5 text-center text-[0.72rem] font-semibold text-aurora">✓ Vote enregistré</p>
                        )}
                        {voteStatus === "error" && (
                            <p className="mt-2.5 text-center text-[0.72rem] text-coral">Erreur — réessaie</p>
                        )}
                        {myVote && voteStatus === "idle" && (
                            <p className="mt-2.5 text-center text-[0.68rem] text-mist/40">Tu as voté · clique pour changer</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ScreeningView;
