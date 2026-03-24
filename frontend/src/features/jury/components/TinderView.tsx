import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Check,
    X,
    Film,
    Play,
    Pause,
    Maximize2,
    Volume2,
    VolumeX,
    Info,
    Undo2,
    ChevronRight,
    Keyboard,
    Zap,
    ArrowRight,
    ArrowLeft,
} from "lucide-react";

import type { Decision, JuryFilm } from "../types";

interface TinderViewProps {
    films: JuryFilm[];
    onVoteDirect: (filmId: number, decision: Exclude<Decision, null>) => void;
    showToast: (message: string) => void;
}

type FlashColor = "green" | "red" | "orange" | "purple" | null;

const SWIPE_THRESHOLD = 100; // px before triggering vote

const DECISION_TOASTS: Record<Exclude<Decision, null>, string> = {
    valide: "✓ Film validé",
    refuse: "✗ Film refusé",
    aRevoir: "↻ Film mis en révision",
    discuter: "💬 Ajouté à la discussion",
};

interface DetailRowProps {
    label: string;
    value: string | null | undefined;
}
const DetailRow = ({ label, value }: DetailRowProps): React.JSX.Element | null => {
    if (!value || value === "—") return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-mist/50">{label}</span>
            <span className="text-[0.82rem] text-white-soft">{value}</span>
        </div>
    );
};

const TinderView = ({ films, onVoteDirect, showToast }: TinderViewProps): React.JSX.Element => {
    const [pendingFilms] = useState<JuryFilm[]>(() => films.filter((f) => f.myDecision === null));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [history, setHistory] = useState<number[]>([]);

    // Drag state
    const [dragX, setDragX] = useState(0);
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isFlying, setIsFlying] = useState(false); // card animating out
    const dragStartX = useRef(0);
    const dragStartY = useRef(0);
    const cardRef = useRef<HTMLDivElement>(null);

    // Video state
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // UI state
    const [showIntro, setShowIntro] = useState(true);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailTab, setDetailTab] = useState<"film" | "realisateur">("film");
    const [flashColor, setFlashColor] = useState<FlashColor>(null);
    const [showShortcuts, setShowShortcuts] = useState(false);

    const currentFilm = pendingFilms[currentIndex];

    // Autoplay on film change
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        void video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }, [currentIndex]);

    // Reset drag on film change
    useEffect(() => {
        setDragX(0);
        setDragY(0);
        setIsFlying(false);
    }, [currentIndex]);

    const triggerFlash = (color: FlashColor): void => {
        setFlashColor(color);
        setTimeout(() => setFlashColor(null), 400);
    };

    const commitVote = useCallback(
        (decision: Exclude<Decision, null>): void => {
            if (!currentFilm) return;
            setHistory((h) => [...h, currentIndex]);
            onVoteDirect(currentFilm.id, decision);
            showToast(DECISION_TOASTS[decision]);
            setIsDetailOpen(false);
            setTimeout(() => {
                setCurrentIndex((i) => i + 1);
            }, 50);
        },
        [currentFilm, currentIndex, onVoteDirect, showToast],
    );

    // Fly card out in a direction, then commit vote
    const flyAndVote = useCallback(
        (decision: Exclude<Decision, null>, toX: number, toY: number): void => {
            if (isFlying) return;
            setIsFlying(true);
            setDragX(toX);
            setDragY(toY);
            const colorMap: Record<Exclude<Decision, null>, FlashColor> = {
                valide: "green",
                refuse: "red",
                aRevoir: "orange",
                discuter: "purple",
            };
            triggerFlash(colorMap[decision]);
            setTimeout(() => commitVote(decision), 350);
        },
        [isFlying, commitVote],
    );

    const handleVoteButton = useCallback(
        (decision: Exclude<Decision, null>): void => {
            if (isFlying) return;
            const dirs: Record<Exclude<Decision, null>, [number, number]> = {
                valide:   [window.innerWidth, -60],
                refuse:   [-window.innerWidth, -60],
                aRevoir:  [0, -window.innerHeight],
                discuter: [0, -window.innerHeight],
            };
            const [tx, ty] = dirs[decision];
            flyAndVote(decision, tx, ty);
        },
        [isFlying, flyAndVote],
    );

    const handleSkip = useCallback((): void => {
        if (isFlying || !currentFilm) return;
        setHistory((h) => [...h, currentIndex]);
        setCurrentIndex((i) => i + 1);
        setIsDetailOpen(false);
    }, [isFlying, currentFilm, currentIndex]);

    const handleUndo = useCallback((): void => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        setHistory((h) => h.slice(0, -1));
        setCurrentIndex(prev);
        setIsDetailOpen(false);
    }, [history]);

    // ── Drag handlers ────────────────────────────────────────────────────────
    const onDragStart = useCallback((clientX: number, clientY: number): void => {
        if (isFlying) return;
        setIsDragging(true);
        dragStartX.current = clientX;
        dragStartY.current = clientY;
    }, [isFlying]);

    const onDragMove = useCallback((clientX: number, clientY: number): void => {
        if (!isDragging) return;
        setDragX(clientX - dragStartX.current);
        setDragY(clientY - dragStartY.current);
    }, [isDragging]);

    const onDragEnd = useCallback((): void => {
        if (!isDragging) return;
        setIsDragging(false);

        const absX = Math.abs(dragX);
        const absY = Math.abs(dragY);

        if (absX > SWIPE_THRESHOLD && absX > absY) {
            // Horizontal swipe
            flyAndVote(dragX > 0 ? "valide" : "refuse", dragX > 0 ? window.innerWidth * 1.5 : -window.innerWidth * 1.5, dragY);
        } else if (dragY < -SWIPE_THRESHOLD && absY > absX) {
            // Swipe up
            flyAndVote("aRevoir", dragX, -window.innerHeight * 1.5);
        } else {
            // Snap back
            setDragX(0);
            setDragY(0);
        }
    }, [isDragging, dragX, dragY, flyAndVote]);

    // Mouse events
    const onMouseDown = (e: React.MouseEvent): void => { onDragStart(e.clientX, e.clientY); };
    useEffect(() => {
        const move = (e: MouseEvent): void => onDragMove(e.clientX, e.clientY);
        const up = (): void => onDragEnd();
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    }, [onDragMove, onDragEnd]);

    // Touch events
    const onTouchStart = (e: React.TouchEvent): void => {
        const t = e.touches[0];
        onDragStart(t.clientX, t.clientY);
    };
    const onTouchMove = (e: React.TouchEvent): void => {
        const t = e.touches[0];
        onDragMove(t.clientX, t.clientY);
    };
    const onTouchEnd = (): void => { onDragEnd(); };

    const togglePlay = useCallback((): void => {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying) { video.pause(); setIsPlaying(false); }
        else { void video.play(); setIsPlaying(true); }
    }, [isPlaying]);

    const toggleMute = (): void => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleFullscreen = (): void => {
        if (videoRef.current) void videoRef.current.requestFullscreen();
    };

    // Keyboard shortcuts
    useEffect(() => {
        const onKey = (e: KeyboardEvent): void => {
            if ((e.target as HTMLElement).tagName === "INPUT") return;
            switch (e.key) {
                case "ArrowRight": handleVoteButton("valide");   break;
                case "ArrowLeft":  handleVoteButton("refuse");   break;
                case "ArrowUp":    handleVoteButton("aRevoir");  break;
                case "d": case "D": handleVoteButton("discuter"); break;
                case "i": case "I": setIsDetailOpen((v) => !v); break;
                case " ": e.preventDefault(); togglePlay();      break;
                case "Backspace":  handleUndo();                 break;
                default:
                    if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
                        e.preventDefault(); handleUndo();
                    }
                    break;
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [handleVoteButton, togglePlay, handleUndo]);

    // ── Intro modal ─────────────────────────────────────────────────────────
    if (showIntro) {
        return (
            <div className="flex flex-1 items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(8,12,36,0.97)] p-8 shadow-2xl">
                    {/* Header */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-aurora/15">
                            <Zap size={20} className="text-aurora" />
                        </div>
                        <div>
                            <h2 className="text-[1rem] font-bold text-white-soft">Mode Vote Rapide</h2>
                            <p className="text-[0.72rem] text-mist">Les votes sont enregistrés immédiatement</p>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="mb-5 rounded-xl border border-solar/25 bg-solar/8 px-4 py-3">
                        <p className="text-[0.78rem] leading-relaxed text-solar/90">
                            ⚠️ Attention — chaque décision est <span className="font-bold">sauvegardée instantanément</span>, sans confirmation. Vous pouvez annuler le dernier vote avec le bouton <span className="font-bold">Annuler</span>.
                        </p>
                    </div>

                    {/* How it works */}
                    <div className="mb-6 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-aurora/30 bg-aurora/10">
                                <ArrowRight size={14} className="text-aurora" />
                            </div>
                            <span className="text-[0.8rem] text-white/75">Glissez à <span className="font-semibold text-aurora">droite</span> ou cliquez ✓ pour <span className="font-semibold text-aurora">valider</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-coral/30 bg-coral/10">
                                <ArrowLeft size={14} className="text-coral" />
                            </div>
                            <span className="text-[0.8rem] text-white/75">Glissez à <span className="font-semibold text-coral">gauche</span> ou cliquez ✗ pour <span className="font-semibold text-coral">refuser</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5">
                                <Info size={14} className="text-mist" />
                            </div>
                            <span className="text-[0.8rem] text-white/75">Bouton <span className="font-semibold text-white-soft">Détails</span> pour voir la fiche complète du film</span>
                        </div>
                    </div>

                    {/* Films count */}
                    <p className="mb-5 text-center text-[0.75rem] text-mist/60">
                        {pendingFilms.length} film{pendingFilms.length > 1 ? "s" : ""} en attente de vote
                    </p>

                    <button
                        type="button"
                        onClick={() => setShowIntro(false)}
                        className="w-full rounded-xl bg-aurora px-5 py-3 text-[0.88rem] font-bold text-deep-sky transition-all hover:brightness-110"
                    >
                        Commencer
                    </button>
                </div>
            </div>
        );
    }

    // ── Empty / done states ──────────────────────────────────────────────────
    if (pendingFilms.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-aurora/10">
                        <Check size={32} className="text-aurora" />
                    </div>
                    <h2 className="text-lg font-bold text-white-soft">Aucun film en attente</h2>
                    <p className="mt-1.5 text-sm text-mist">Tous tes films assignés ont déjà été évalués.</p>
                </div>
            </div>
        );
    }

    if (currentIndex >= pendingFilms.length) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-aurora/10">
                        <Check size={32} className="text-aurora" />
                    </div>
                    <h2 className="text-lg font-bold text-white-soft">Session terminée !</h2>
                    <p className="mt-1.5 text-sm text-mist">
                        Tu as voté sur {pendingFilms.length} film{pendingFilms.length > 1 ? "s" : ""}.
                    </p>
                    {history.length > 0 && (
                        <button type="button" onClick={handleUndo}
                            className="mx-auto mt-4 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-mist hover:bg-white/10">
                            <Undo2 size={14} />
                            Revenir au dernier film
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const nextFilm = pendingFilms[currentIndex + 1];
    const afterNextFilm = pendingFilms[currentIndex + 2];

    // Card transform
    const rotate = dragX * 0.08; // degrees
    const cardStyle: React.CSSProperties = {
        transform: `translate(${dragX}px, ${dragY}px) rotate(${rotate}deg)`,
        transition: isDragging ? "none" : isFlying ? "transform 0.35s ease-in, opacity 0.35s ease-in" : "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
    };

    // Swipe hint overlays — opacity based on drag distance
    const rightOpacity = Math.min(Math.max(dragX / SWIPE_THRESHOLD, 0), 1);
    const leftOpacity  = Math.min(Math.max(-dragX / SWIPE_THRESHOLD, 0), 1);
    const upOpacity    = Math.min(Math.max(-dragY / SWIPE_THRESHOLD, 0), 1);

    const flashClass =
        flashColor === "green"  ? "bg-aurora/25" :
        flashColor === "red"    ? "bg-coral/25"  :
        flashColor === "orange" ? "bg-solar/25"  :
        flashColor === "purple" ? "bg-lavande/25": "";

    return (
        <div className="relative flex flex-1 overflow-hidden bg-black">
            {/* Flash overlay */}
            {flashColor && (
                <div className={`pointer-events-none absolute inset-0 z-50 ${flashClass}`} />
            )}

            {/* Card stack */}
            <div className="absolute inset-0">
                {/* 3rd card */}
                {afterNextFilm && (
                    <div className="absolute inset-0 translate-y-4 scale-95 bg-surface opacity-20" />
                )}
                {/* 2nd card */}
                {nextFilm && (
                    <div className="absolute inset-0 translate-y-2 scale-[0.98] bg-surface opacity-35" />
                )}

                {/* Current card — draggable */}
                <div
                    ref={cardRef}
                    style={cardStyle}
                    className="absolute inset-0 overflow-hidden bg-black"
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Video */}
                    {currentFilm.videoUrl ? (
                        <>
                            <video
                                ref={videoRef}
                                src={currentFilm.videoUrl}
                                className="h-full w-full object-contain"
                                preload="auto"
                                autoPlay
                                muted
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={() => setIsPlaying(false)}
                            />
                            {/* Click to play/pause (only when not dragging) */}
                            {!isDragging && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100"
                                    onClick={togglePlay}
                                >
                                    <div className="absolute inset-0 bg-black/20" />
                                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                                        {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-aurora/8 to-lavande/8">
                            <Film size={80} className="text-mist/15" />
                        </div>
                    )}

                    {/* Swipe hint — VALIDE (right) */}
                    <div
                        className="pointer-events-none absolute inset-0 flex items-center justify-start pl-10"
                        style={{ opacity: rightOpacity }}
                    >
                        <div className="rounded-2xl border-4 border-aurora px-5 py-3 rotate-[-15deg]">
                            <span className="text-3xl font-black tracking-widest text-aurora drop-shadow-lg">VALIDE</span>
                        </div>
                    </div>

                    {/* Swipe hint — REFUSÉ (left) */}
                    <div
                        className="pointer-events-none absolute inset-0 flex items-center justify-end pr-10"
                        style={{ opacity: leftOpacity }}
                    >
                        <div className="rounded-2xl border-4 border-coral px-5 py-3 rotate-[15deg]">
                            <span className="text-3xl font-black tracking-widest text-coral drop-shadow-lg">REFUSÉ</span>
                        </div>
                    </div>

                    {/* Swipe hint — À REVOIR (up) */}
                    <div
                        className="pointer-events-none absolute inset-0 flex items-start justify-center pt-14"
                        style={{ opacity: upOpacity }}
                    >
                        <div className="rounded-2xl border-4 border-solar px-5 py-3">
                            <span className="text-3xl font-black tracking-widest text-solar drop-shadow-lg">À REVOIR</span>
                        </div>
                    </div>

                    {/* Top-right video controls */}
                    {currentFilm.videoUrl && (
                        <div className="absolute right-3 top-10 z-20 flex items-center gap-1.5">
                            <button type="button" onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                                title={isMuted ? "Activer le son" : "Couper le son"}>
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                                title="Plein écran">
                                <Maximize2 size={14} />
                            </button>
                        </div>
                    )}

                    {isMuted && isPlaying && currentFilm.videoUrl && (
                        <button type="button"
                            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute left-3 top-10 z-20 flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1.5 text-[0.68rem] font-semibold text-white backdrop-blur-sm hover:bg-black/70">
                            <VolumeX size={12} />
                            <span>Son coupé · Cliquer pour activer</span>
                        </button>
                    )}

                    {/* Bottom overlay — info + buttons */}
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-6 pb-5 pt-24">
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div className="min-w-0">
                                <h2 className="text-[1.1rem] font-bold text-white drop-shadow">{currentFilm.title}</h2>
                                <p className="mt-0.5 text-[0.8rem] text-white/65">{currentFilm.author} · {currentFilm.country}</p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.62rem] text-white/65">{currentFilm.duration}</span>
                                    <span className="rounded-full bg-aurora/20 px-2.5 py-0.5 text-[0.62rem] text-aurora">{currentFilm.format}</span>
                                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.62rem] text-white/65">{currentFilm.year}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); setIsDetailOpen(true); setDetailTab("film"); }}
                                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-[0.75rem] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                                title="Détails (I)"
                            >
                                <Info size={14} />
                                Détails
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between">
                            <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-coral/55">← Refuser</span>
                            <div className="flex items-center gap-6">
                                <button type="button"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); handleVoteButton("refuse"); }}
                                    disabled={isFlying}
                                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-coral/50 bg-coral/15 text-coral backdrop-blur-sm transition-all hover:scale-110 hover:bg-coral/30 disabled:opacity-40"
                                    title="Refuser (←)">
                                    <X size={26} />
                                </button>
                                <button type="button"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); handleVoteButton("valide"); }}
                                    disabled={isFlying}
                                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-aurora/50 bg-aurora/15 text-aurora backdrop-blur-sm transition-all hover:scale-110 hover:bg-aurora/30 disabled:opacity-40"
                                    title="Valider (→)">
                                    <Check size={26} />
                                </button>
                            </div>
                            <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-aurora/55">Valider →</span>
                        </div>

                        <div className="mt-2 flex items-center justify-center gap-4">
                            <button type="button"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); handleSkip(); }}
                                disabled={isFlying}
                                className="text-[0.67rem] text-white/25 hover:text-white/55 disabled:opacity-40">
                                Passer
                            </button>
                            {history.length > 0 && (
                                <button type="button"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); handleUndo(); }}
                                    disabled={isFlying}
                                    className="flex items-center gap-1 text-[0.67rem] text-white/25 hover:text-white/55 disabled:opacity-40"
                                    title="Annuler (⌫)">
                                    <Undo2 size={11} />
                                    Annuler
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress + shortcuts — floats at top */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center gap-3 px-4 pt-2">
                <div className="flex flex-1 flex-col gap-1">
                    <div className="flex justify-between text-[0.62rem] text-white/40">
                        <span>Films restants</span>
                        <span className="font-mono font-semibold text-white/55">
                            {pendingFilms.length - currentIndex} / {pendingFilms.length}
                        </span>
                    </div>
                    <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-aurora to-lavande transition-all duration-300"
                            style={{ width: `${(currentIndex / pendingFilms.length) * 100}%` }}
                        />
                    </div>
                </div>
                <button
                    type="button"
                    className="pointer-events-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/40 text-white/40 backdrop-blur-sm hover:bg-black/60 hover:text-white/70"
                    onClick={() => setShowShortcuts((v) => !v)}
                    title="Raccourcis clavier"
                >
                    <Keyboard size={13} />
                </button>
            </div>

            {/* Shortcuts tooltip */}
            {showShortcuts && (
                <div className="absolute right-4 top-10 z-30 rounded-xl border border-white/10 bg-black/85 p-4 backdrop-blur-md" style={{ minWidth: 230 }}>
                    <div className="mb-2 text-[0.65rem] font-bold uppercase tracking-wider text-mist/60">Raccourcis</div>
                    {[
                        ["→", "Valider"],
                        ["←", "Refuser"],
                        ["↑", "À revoir"],
                        ["D", "Discuter"],
                        ["I", "Détails"],
                        ["Espace", "Play / Pause"],
                        ["⌫ / Ctrl+Z", "Annuler le vote"],
                    ].map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between gap-6 py-0.5">
                            <span className="text-[0.75rem] text-white/60">{label}</span>
                            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.65rem] text-white/50">{key}</kbd>
                        </div>
                    ))}
                </div>
            )}

            {/* Details panel */}
            <div className={`absolute inset-y-0 right-0 z-40 flex w-[360px] flex-col border-l border-white/8 bg-[rgba(8,12,36,0.97)] backdrop-blur-md transition-transform duration-300 ${isDetailOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Info size={14} className="text-aurora" />
                        <span className="text-[0.85rem] font-bold text-white-soft">Détails du film</span>
                    </div>
                    <button type="button" onClick={() => setIsDetailOpen(false)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-mist hover:bg-white/8 hover:text-white-soft">
                        <ChevronRight size={16} />
                    </button>
                </div>
                <div className="flex shrink-0 border-b border-white/8">
                    {(["film", "realisateur"] as const).map((tab) => (
                        <button key={tab} type="button" onClick={() => setDetailTab(tab)}
                            className={`flex-1 py-2.5 text-[0.75rem] font-semibold transition-colors ${detailTab === tab ? "border-b-2 border-aurora text-aurora" : "text-mist hover:text-white-soft"}`}>
                            {tab === "film" ? "Film" : "Réalisateur"}
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {detailTab === "film" ? (
                        <div className="flex flex-col gap-4">
                            <DetailRow label="Titre" value={currentFilm.title} />
                            <DetailRow label="Auteur" value={currentFilm.author} />
                            <DetailRow label="Pays" value={currentFilm.country} />
                            <DetailRow label="Année" value={currentFilm.year} />
                            <DetailRow label="Durée" value={currentFilm.duration} />
                            <DetailRow label="Format" value={currentFilm.format} />
                            <DetailRow label="Sous-titres" value={currentFilm.subtitles} />
                            <DetailRow label="Copyright" value={currentFilm.copyright} />
                            <DetailRow label="Outils IA" value={currentFilm.tools} />
                            <DetailRow label="IA Scénario" value={currentFilm.iaScenario} />
                            <DetailRow label="IA Image" value={currentFilm.iaImage} />
                            <DetailRow label="IA Post-prod" value={currentFilm.iaPost} />
                            {currentFilm.note && (
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-mist/50">Note créative</span>
                                    <p className="text-[0.82rem] leading-relaxed text-white-soft">{currentFilm.note}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <DetailRow label="Prénom" value={currentFilm.realisator.firstName} />
                            <DetailRow label="Nom" value={currentFilm.realisator.lastName} />
                            <DetailRow label="Genre" value={currentFilm.realisator.gender} />
                            <DetailRow label="Date de naissance" value={currentFilm.realisator.birthDate} />
                            <DetailRow label="Email" value={currentFilm.realisator.email} />
                            <DetailRow label="Profession" value={currentFilm.realisator.profession} />
                            <DetailRow label="Téléphone" value={currentFilm.realisator.phone} />
                            <DetailRow label="Mobile" value={currentFilm.realisator.mobilePhone} />
                            <DetailRow label="Adresse" value={currentFilm.realisator.street} />
                            <DetailRow label="Code postal" value={currentFilm.realisator.postalCode} />
                            <DetailRow label="Ville" value={currentFilm.realisator.city} />
                            <DetailRow label="Pays" value={currentFilm.realisator.country} />
                            {[
                                ["YouTube", currentFilm.realisator.youtube],
                                ["Instagram", currentFilm.realisator.instagram],
                                ["LinkedIn", currentFilm.realisator.linkedin],
                                ["Facebook", currentFilm.realisator.facebook],
                                ["X / Twitter", currentFilm.realisator.xtwitter],
                            ].filter(([, v]) => v).map(([label, value]) => (
                                <div key={label} className="flex flex-col gap-0.5">
                                    <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-mist/50">{label}</span>
                                    <a href={value ?? "#"} target="_blank" rel="noopener noreferrer"
                                        className="truncate text-[0.82rem] text-aurora hover:underline">{value}</a>
                                </div>
                            ))}
                            <DetailRow label="Comment nous a-t-il connu ?" value={currentFilm.realisator.howDidYouKnowUs} />
                            <DetailRow label="Newsletter" value={currentFilm.realisator.newsletter ? "Oui" : "Non"} />
                        </div>
                    )}
                </div>
            </div>

            {isDetailOpen && (
                <div className="absolute inset-0 z-30" onClick={() => setIsDetailOpen(false)} />
            )}
        </div>
    );
};

export default TinderView;
