import React, { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
    LiveKitRoom,
    RoomAudioRenderer,
    useParticipants,
    useLocalParticipant,
    useIsSpeaking,
    useParticipantInfo,
    useTracks,
    VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import type { Participant, TrackPublication } from "livekit-client";
import {
    X,
    Radio,
    Video,
    VideoOff,
    Mic,
    MicOff,
    PhoneOff,
    Camera,
    MonitorPlay,
} from "lucide-react";
import useLivePoll, { type PollDetail } from "../../../features/jury/hooks/useLivePoll";
import type { AdminJuryMember } from "../types";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string;
const getToken = (): string => localStorage.getItem("jury_token") ?? "";

// ── Config visuelle des décisions ────────────────────────────────────────────
const DECISION_CFG = {
    valide:        { label: "Validé",      color: "#4effce", glow: "rgba(78,255,206,0.7)",  badge: "✓" },
    arevoir:       { label: "À revoir",    color: "#f5e642", glow: "rgba(245,230,66,0.7)",  badge: "↻" },
    refuse:        { label: "Refusé",      color: "#ff6b6b", glow: "rgba(255,107,107,0.7)", badge: "✕" },
    in_discussion: { label: "Discussion",  color: "#c084fc", glow: "rgba(192,132,252,0.7)", badge: "◎" },
} as const;

type DecisionKey = keyof typeof DECISION_CFG;

// ── Vote Observatory ──────────────────────────────────────────────────────────
const LiveVotePanel = ({
    filmId,
    juryMembers,
}: {
    filmId: number;
    juryMembers: AdminJuryMember[];
}): React.JSX.Element => {
    const poll = useLivePoll(filmId);
    const [flashIds, setFlashIds] = useState<Set<number>>(new Set());
    const prevDetailsRef = useRef<PollDetail[]>([]);

    // Détecter les nouveaux votes et déclencher le flash
    useEffect(() => {
        if (!poll) return;
        const prev = prevDetailsRef.current;
        const newFlash: number[] = [];
        for (const d of poll.details) {
            const p = prev.find((x) => x.juryId === d.juryId);
            if (!p || p.decision !== d.decision) newFlash.push(d.juryId);
        }
        prevDetailsRef.current = poll.details;
        if (newFlash.length === 0) return;
        setFlashIds((f) => new Set([...f, ...newFlash]));
        const t = setTimeout(() => {
            setFlashIds((f) => {
                const next = new Set(f);
                newFlash.forEach((id) => next.delete(id));
                return next;
            });
        }, 1400);
        return () => clearTimeout(t);
    }, [poll]);

    const tally = poll?.tally ?? { valide: 0, arevoir: 0, refuse: 0, in_discussion: 0 };
    const votedCount = tally.valide + tally.arevoir + tally.refuse + tally.in_discussion;
    const totalJury = juryMembers.length;

    // Fusionner la liste jury + décisions live
    const merged = juryMembers.map((j) => ({
        id: j.id,
        firstName: j.first_name,
        lastName: j.last_name,
        profilPicture: j.profil_picture,
        decision: (poll?.details.find((d) => d.juryId === j.id)?.decision ?? null) as DecisionKey | null,
    }));

    return (
        <div className="flex flex-col border-t border-white/[0.06]">
            {/* En-tête */}
            <div className="flex shrink-0 items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lavande" />
                    <span className="text-[0.62rem] font-bold uppercase tracking-widest text-lavande/80">
                        Votes en direct
                    </span>
                </div>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[0.58rem] text-mist/50">
                    {votedCount} / {totalJury}
                </span>
            </div>

            {/* Grille avatars jury */}
            <div className="px-3 pb-2">
                <div className="grid grid-cols-3 gap-x-1.5 gap-y-3">
                    {merged.map((j) => {
                        const cfg = j.decision ? DECISION_CFG[j.decision] : null;
                        const isFlash = flashIds.has(j.id);
                        const initials = `${j.firstName[0] ?? ""}${j.lastName[0] ?? ""}`.toUpperCase();
                        return (
                            <div key={j.id} className="flex flex-col items-center gap-1">
                                {/* Avatar + anneau */}
                                <div
                                    className="relative"
                                    style={{
                                        filter: isFlash && cfg
                                            ? `drop-shadow(0 0 10px ${cfg.glow})`
                                            : "none",
                                        transition: "filter 0.5s ease",
                                    }}
                                >
                                    <div
                                        className="h-11 w-11 overflow-hidden rounded-full"
                                        style={{
                                            outline: cfg
                                                ? `2px solid ${cfg.color}`
                                                : "2px solid rgba(255,255,255,0.08)",
                                            outlineOffset: "2px",
                                            boxShadow: isFlash && cfg
                                                ? `0 0 18px ${cfg.glow}, 0 0 36px ${cfg.glow}40`
                                                : cfg
                                                ? `0 0 6px ${cfg.glow}50`
                                                : "none",
                                            transition: "all 0.5s ease",
                                        }}
                                    >
                                        {j.profilPicture ? (
                                            <img
                                                src={j.profilPicture}
                                                alt={initials}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-aurora/20 to-lavande/20 text-[0.65rem] font-bold text-white-soft">
                                                {initials}
                                            </div>
                                        )}
                                    </div>
                                    {/* Badge décision */}
                                    {cfg && (
                                        <div
                                            className="absolute -bottom-0.5 -right-0.5 flex h-[15px] w-[15px] items-center justify-center rounded-full text-[0.5rem] font-black leading-none"
                                            style={{
                                                background: cfg.color,
                                                color: "#020408",
                                                boxShadow: isFlash ? `0 0 8px ${cfg.glow}` : "none",
                                                transition: "box-shadow 0.5s ease",
                                            }}
                                        >
                                            {cfg.badge}
                                        </div>
                                    )}
                                </div>
                                {/* Nom + label */}
                                <div className="flex flex-col items-center gap-0.5 text-center">
                                    <span className="max-w-[60px] truncate text-[0.58rem] font-medium text-mist/60">
                                        {j.firstName}
                                    </span>
                                    {cfg ? (
                                        <span className="text-[0.5rem] font-bold" style={{ color: cfg.color }}>
                                            {cfg.label}
                                        </span>
                                    ) : (
                                        <span className="text-[0.5rem] text-mist/25">—</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Barres de tally */}
            <div className="border-t border-white/[0.04] px-4 py-3 space-y-[7px]">
                {(Object.entries(DECISION_CFG) as [DecisionKey, (typeof DECISION_CFG)[DecisionKey]][]).map(
                    ([key, cfg]) => {
                        const count = tally[key] ?? 0;
                        const pct = totalJury > 0 ? (count / totalJury) * 100 : 0;
                        return (
                            <div key={key} className="flex items-center gap-2">
                                <span
                                    className="w-[54px] shrink-0 truncate text-[0.55rem] font-semibold"
                                    style={{ color: cfg.color }}
                                >
                                    {cfg.label}
                                </span>
                                <div className="relative h-[4px] flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full"
                                        style={{
                                            width: `${pct}%`,
                                            background: cfg.color,
                                            boxShadow: pct > 0 ? `0 0 6px ${cfg.glow}` : "none",
                                            transition: "width 0.7s cubic-bezier(0.34,1.56,0.64,1)",
                                        }}
                                    />
                                </div>
                                <span
                                    className="w-3.5 shrink-0 text-right font-mono text-[0.58rem] font-bold tabular-nums"
                                    style={{ color: count > 0 ? cfg.color : "rgba(255,255,255,0.15)" }}
                                >
                                    {count}
                                </span>
                            </div>
                        );
                    },
                )}
            </div>
        </div>
    );
};

// ── Chrono ────────────────────────────────────────────────────────────────────
const useElapsed = (startedAt: number): string => {
    const [elapsed, setElapsed] = useState(Date.now() - startedAt);
    useEffect(() => {
        const id = setInterval(() => setElapsed(Date.now() - startedAt), 1000);
        return () => clearInterval(id);
    }, [startedAt]);
    const s = Math.floor(elapsed / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

// ── Tuile webcam ──────────────────────────────────────────────────────────────
const WebcamTile = ({ participant }: { participant: Participant }): React.JSX.Element => {
    const isSpeaking = useIsSpeaking(participant);
    const isMuted = !participant.isMicrophoneEnabled;
    const isCameraOn = participant.isCameraEnabled;
    const { name } = useParticipantInfo({ participant });
    const meta = participant.metadata
        ? (JSON.parse(participant.metadata) as { profilPicture?: string | null; isAdmin?: boolean })
        : null;
    const profilPicture = meta?.profilPicture ?? null;
    const isAdmin = meta?.isAdmin ?? false;
    const displayName = name ?? participant.identity;
    const initials = displayName.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
    const cameraPub = participant.getTrackPublication(Track.Source.Camera) as TrackPublication | undefined;

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border bg-[#0a0f1a] flex-shrink-0 transition-all duration-200 ${
                isSpeaking
                    ? "border-aurora shadow-[0_0_20px_rgba(78,255,206,0.45)]"
                    : "border-white/[0.08]"
            }`}
            style={{ aspectRatio: "4/3", width: "100%" }}
        >
            {isCameraOn && cameraPub ? (
                <VideoTrack
                    trackRef={{ participant, publication: cameraPub, source: Track.Source.Camera }}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0a0f1a] to-[#111827]">
                    {profilPicture ? (
                        <img src={profilPicture} alt={initials}
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full font-extrabold text-[0.9rem] ${
                            isAdmin
                                ? "bg-gradient-to-br from-coral to-lavande text-white"
                                : "bg-gradient-to-br from-aurora to-lavande text-deep-sky"
                        }`}>
                            {initials}
                        </div>
                    )}
                </div>
            )}

            {/* Bandeau bas */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/85 to-transparent px-2.5 pb-2 pt-6">
                <span className="truncate text-[0.65rem] font-semibold text-white/90">{displayName}</span>
                <div className="flex items-center gap-1">
                    {isMuted && <MicOff size={10} className="text-coral" />}
                    {isSpeaking && !isMuted && (
                        <span className="flex items-end gap-[2px]">
                            {[0, 1, 2].map((i) => (
                                <span key={i} className="w-[2px] rounded-full bg-aurora animate-pulse"
                                    style={{ height: 6 + i * 3, animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </span>
                    )}
                </div>
            </div>

            {/* Badge */}
            {(isSpeaking || isAdmin) && (
                <div className={`absolute left-2 top-2 rounded-full px-1.5 py-0.5 backdrop-blur-sm ${
                    isAdmin ? "bg-coral/25" : "bg-aurora/20"
                }`}>
                    <span className={`text-[0.5rem] font-bold ${isAdmin ? "text-coral" : "text-aurora"}`}>
                        {isAdmin ? "Admin" : "Parle"}
                    </span>
                </div>
            )}
        </div>
    );
};

// ── Panneau webcam (intérieur LiveKitRoom) ─────────────────────────────────────
const WebcamPanel = ({ onLeave }: { onLeave: () => void }): React.JSX.Element => {
    const { localParticipant } = useLocalParticipant();
    const participants = useParticipants();
    const screenTracks = useTracks([Track.Source.ScreenShare]);
    const isMuted = !localParticipant.isMicrophoneEnabled;
    const isCameraOn = localParticipant.isCameraEnabled;

    return (
        <div className="flex h-full flex-col">
            {/* En-tête */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3">
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

            {/* Grille participants */}
            <div className="flex-1 overflow-y-auto p-3">
                {participants.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-center text-[0.7rem] leading-relaxed text-mist/30">
                            En attente<br />des jurés…
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {participants.map((p) => <WebcamTile key={p.identity} participant={p} />)}
                        {screenTracks.length > 0 && (
                            <div className="relative col-span-2 overflow-hidden rounded-2xl border border-aurora/30">
                                <VideoTrack trackRef={screenTracks[0]} className="aspect-video w-full object-contain bg-black" />
                                <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[0.55rem] text-aurora">
                                    Écran partagé
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Contrôles */}
            <div className="flex shrink-0 items-center justify-center gap-2 border-t border-white/[0.06] px-4 py-3">
                <button type="button"
                    onClick={() => void localParticipant.setMicrophoneEnabled(isMuted)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        isMuted ? "bg-coral/20 text-coral hover:bg-coral/30" : "bg-aurora/15 text-aurora hover:bg-aurora/25"
                    }`}
                    title={isMuted ? "Activer le micro" : "Couper le micro"}>
                    {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
                <button type="button"
                    onClick={() => void localParticipant.setCameraEnabled(!isCameraOn)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        isCameraOn ? "bg-aurora/15 text-aurora hover:bg-aurora/25" : "bg-white/[0.05] text-mist hover:bg-white/10"
                    }`}
                    title={isCameraOn ? "Éteindre la caméra" : "Activer la caméra"}>
                    {isCameraOn ? <Video size={14} /> : <VideoOff size={14} />}
                </button>
                <button type="button" onClick={onLeave}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-coral/80 text-white transition-opacity hover:opacity-85"
                    title="Quitter la session vidéo">
                    <PhoneOff size={13} />
                </button>
            </div>
        </div>
    );
};

// ── Props de la modale ────────────────────────────────────────────────────────
export interface AdminScreeningModalProps {
    filmId: number;
    filmTitle: string;
    filmCountry?: string;
    startedAt: number;
    videoUrl: string | null;
    juryMembers: AdminJuryMember[];
    onStop: () => void;
    onClose: () => void;
    onSeek: (currentTime: number) => void;
    onPlay: (currentTime: number) => void;
    onPause: (currentTime: number) => void;
}

// ── AdminScreeningModal ───────────────────────────────────────────────────────
const AdminScreeningModal = ({
    filmId,
    filmTitle,
    filmCountry,
    startedAt,
    videoUrl,
    juryMembers,
    onStop,
    onClose,
    onSeek,
    onPlay,
    onPause,
}: AdminScreeningModalProps): React.JSX.Element => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const seekThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
    const [webcamLoading, setWebcamLoading] = useState(false);
    const elapsed = useElapsed(startedAt);

    // Fermer avec Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent): void => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const handleSeek = (): void => {
        const video = videoRef.current;
        if (!video) return;
        const t = video.currentTime;
        if (seekThrottleRef.current) clearTimeout(seekThrottleRef.current);
        seekThrottleRef.current = setTimeout(() => onSeek(t), 300);
    };

    const joinWebcam = useCallback(async (): Promise<void> => {
        if (webcamLoading || liveKitToken) return;
        setWebcamLoading(true);
        try {
            const res = await fetch(`${API}/api/admin/vocal/token`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = (await res.json()) as { success: boolean; token?: string };
            if (data.success && data.token) setLiveKitToken(data.token);
        } finally {
            setWebcamLoading(false);
        }
    }, [webcamLoading, liveKitToken]);

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
            style={{ background: "rgba(2,4,8,0.97)", backdropFilter: "blur(8px)" }}
        >
            {/* Glow ambiant */}
            <div className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 60% 40% at 40% 50%, rgba(78,255,206,0.05) 0%, rgba(192,132,252,0.03) 60%, transparent 80%)" }} />

            {/* ── Topbar ─────────────────────────────────────────────────────── */}
            <div className="flex shrink-0 items-center gap-4 border-b border-white/[0.06] bg-black/50 px-6 py-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-coral" />
                    <span className="font-display text-[0.72rem] font-extrabold tracking-widest text-coral">
                        EN DIRECT
                    </span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <MonitorPlay size={16} className="text-mist/50" />
                <h1 className="flex-1 truncate font-display text-[1rem] font-extrabold text-white-soft">
                    {filmTitle}
                </h1>
                {filmCountry && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] text-mist/60">
                        {filmCountry}
                    </span>
                )}
                <span className="font-mono text-[0.8rem] text-mist/40">{elapsed}</span>

                <button
                    type="button"
                    onClick={onStop}
                    className="flex items-center gap-2 rounded-xl border border-coral/40 bg-coral/10 px-4 py-2 text-[0.78rem] font-bold text-coral transition-all hover:bg-coral/20"
                >
                    <Radio size={13} className="animate-pulse" />
                    Arrêter la projection
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-mist transition-all hover:bg-white/10 hover:text-white-soft"
                    title="Fermer (Echap)"
                >
                    <X size={14} />
                </button>
            </div>

            {/* ── Corps ──────────────────────────────────────────────────────── */}
            <div className="flex min-h-0 flex-1">

                {/* ── Player vidéo (centre) ───────────────────────────────── */}
                <div className="flex flex-1 items-center justify-center bg-black p-6">
                    <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl"
                        style={{ boxShadow: "0 0 0 1px rgba(78,255,206,0.12), 0 0 60px rgba(78,255,206,0.08), 0 32px 80px rgba(0,0,0,0.9)" }}>
                        {videoUrl ? (
                            <>
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    autoPlay
                                    controls
                                    playsInline
                                    preload="auto"
                                    onCanPlay={() => setIsVideoReady(true)}
                                    onSeeked={handleSeek}
                                    onPlay={(e) => onPlay((e.target as HTMLVideoElement).currentTime)}
                                    onPause={(e) => onPause((e.target as HTMLVideoElement).currentTime)}
                                    className="aspect-video w-full bg-black"
                                />
                                {!isVideoReady && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
                                        <div className="h-12 w-12 animate-spin rounded-full border-2 border-aurora/30 border-t-aurora" />
                                        <span className="text-[0.82rem] text-mist/60">Chargement de la vidéo…</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex aspect-video w-full items-center justify-center bg-[#080d18]">
                                <p className="text-[0.9rem] text-mist/30">Aucune vidéo disponible</p>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 backdrop-blur-sm">
                        <span className="text-[0.65rem] text-mist/40">
                            Timeline synchronisée en temps réel avec tous les jurés
                        </span>
                    </div>
                </div>

                {/* ── Panneau droit : webcam + votes (300px) ──────────────── */}
                <div className="flex w-[300px] shrink-0 flex-col overflow-hidden border-l border-white/[0.06] bg-[#06090f]">
                    {/* Zone webcam */}
                    <div className="flex min-h-0 flex-1 flex-col">
                        {liveKitToken ? (
                            <LiveKitRoom
                                token={liveKitToken}
                                serverUrl={LIVEKIT_URL}
                                connect={true}
                                audio={true}
                                video={true}
                                onDisconnected={() => setLiveKitToken(null)}
                            >
                                <RoomAudioRenderer />
                                <WebcamPanel onLeave={() => setLiveKitToken(null)} />
                            </LiveKitRoom>
                        ) : (
                            <div className="flex flex-1 flex-col">
                                <div className="flex shrink-0 items-center border-b border-white/[0.06] px-4 py-3">
                                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-mist/40">
                                        Session vidéo
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
                                    <div className="grid grid-cols-2 gap-2 w-full opacity-30">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0d1117]">
                                                <Camera size={20} className="text-mist/20" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center">
                                        <p className="mb-3 text-[0.72rem] leading-relaxed text-mist/40">
                                            Rejoignez la session pour voir et parler avec les jurés
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => void joinWebcam()}
                                            disabled={webcamLoading}
                                            className="flex items-center gap-2 rounded-xl border border-aurora/30 bg-aurora/10 px-4 py-2.5 text-[0.78rem] font-bold text-aurora transition-all hover:border-aurora/50 hover:bg-aurora/15 disabled:opacity-50"
                                        >
                                            <Video size={14} />
                                            {webcamLoading ? "Connexion…" : "Rejoindre"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Zone votes live */}
                    <LiveVotePanel filmId={filmId} juryMembers={juryMembers} />
                </div>

            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default AdminScreeningModal;
