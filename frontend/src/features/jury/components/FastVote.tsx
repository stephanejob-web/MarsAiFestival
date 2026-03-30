import React, { useState, useRef, useEffect, useCallback, memo } from "react";
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
    Zap,
    ArrowRight,
    ArrowLeft,
    ArrowUp,
    RotateCcw,
    Send,
} from "lucide-react";

import type { Decision, JuryFilm } from "../types";
import type { UseJuryPanelReturn } from "../hooks/useJuryPanel";
import useVoteTags from "../hooks/useVoteTags";
import type { VoteTag } from "../hooks/useVoteTags";

interface FastVoteProps {
    panel: UseJuryPanelReturn;
    skipIntro?: boolean;
    onIntroComplete?: () => void;
}

type PanelType = "refuse" | "aRevoir" | null;

type FlashColor = "green" | "red" | "yellow" | null;

const SWIPE_THRESHOLD = 100; // px before triggering vote
const SWIPE_Y_THRESHOLD = 100; // px upward before triggering aRevoir

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

const DetailRow = memo(({ label, value }: DetailRowProps): React.JSX.Element | null => {
    if (!value || value === "—") return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-mist/50">
                {label}
            </span>
            <span className="text-[0.82rem] text-white-soft">{value}</span>
        </div>
    );
});
DetailRow.displayName = "DetailRow";

const HUD_COLORS: Record<string, string> = {
    coral: "border-coral/50   bg-coral/12   text-coral",
    aurora: "border-aurora/50  bg-aurora/12  text-aurora",
    lavande: "border-lavande/50 bg-lavande/12 text-lavande",
    mist: "border-white/18   bg-white/5    text-white/40",
};

const HudKey = ({ label, color }: { label: string; color: string }): React.JSX.Element => (
    <kbd
        className={`inline-flex items-center justify-center rounded border px-1.5 py-0.5 font-mono text-[0.6rem] font-bold leading-none ${HUD_COLORS[color] ?? HUD_COLORS.mist}`}
    >
        {label}
    </kbd>
);

const HudLabel = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <span className="ml-1 text-[0.58rem] uppercase tracking-wider text-white/28">{children}</span>
);

const COLORS = ["#4effce", "#ff6b6b", "#ffd166", "#a78bfa", "#38bdf8"];
const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
    left: `${(i * 37 + 7) % 100}%`,
    color: COLORS[i % 5],
    width: 6 + (i % 9),
    height: 6 + ((i * 3) % 9),
    duration: `${2 + (i % 3)}s`,
    delay: `${(i % 5) * 0.4}s`,
    round: i % 2 === 0,
}));

const FastVote = ({
    panel,
    skipIntro = false,
    onIntroComplete,
}: FastVoteProps): React.JSX.Element => {
    const { films, voteDirect: onVoteDirect, showToast } = panel;

    const [pendingFilms] = useState<JuryFilm[]>(() =>
        films.filter((f: JuryFilm) => f.myDecision === null),
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [history, setHistory] = useState<number[]>([]);

    // Drag state — only used for snap-back and fly-out animations (not during active drag)
    const [dragX, setDragX] = useState(0);
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isFlying, setIsFlying] = useState(false);

    // Drag refs — updated every mousemove without triggering re-renders
    const dragXRef = useRef(0);
    const dragYRef = useRef(0);
    const isDraggingRef = useRef(false);
    const dragStartX = useRef(0);
    const dragStartY = useRef(0);
    const rafId = useRef<number | null>(null);

    // DOM refs for direct manipulation during drag (avoids re-renders for hint opacities)
    const cardRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const rightHintRef = useRef<HTMLDivElement>(null);
    const leftHintRef = useRef<HTMLDivElement>(null);
    const upHintRef = useRef<HTMLDivElement>(null);

    // Video state
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // UI state
    const [showIntro, setShowIntro] = useState(!skipIntro);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailTab, setDetailTab] = useState<"film" | "realisateur">("film");
    const [flashColor, setFlashColor] = useState<FlashColor>(null);
    const [voteAnim, setVoteAnim] = useState<{
        color: "green" | "red" | "yellow";
        key: number;
    } | null>(null);

    // Bottom sheet panel state
    const [panelType, setPanelType] = useState<PanelType>(null);
    const [panelMessage, setPanelMessage] = useState("");
    const [panelTag, setPanelTag] = useState<VoteTag | null>(null);
    const panelTextareaRef = useRef<HTMLTextAreaElement>(null);

    // Tags for the panel
    const tags = useVoteTags();

    // Timeout refs for cleanup on unmount
    const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const currentFilm = pendingFilms[currentIndex];
    const nextFilm = pendingFilms[currentIndex + 1];
    const afterNextFilm = pendingFilms[currentIndex + 2];

    // Autoplay on film change
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        void video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
    }, [currentIndex]);

    // Cleanup RAF and timeouts on unmount
    useEffect(() => {
        return () => {
            if (rafId.current !== null) cancelAnimationFrame(rafId.current);
            if (flashTimeoutRef.current !== null) clearTimeout(flashTimeoutRef.current);
        };
    }, []);

    const triggerFlash = useCallback((color: FlashColor): void => {
        setFlashColor(color);
        if (flashTimeoutRef.current !== null) clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = setTimeout(() => setFlashColor(null), 400);
    }, []);

    const commitVote = useCallback(
        (decision: Exclude<Decision, null>, message?: string): void => {
            if (!currentFilm) return;
            setHistory((h) => [...h, currentIndex]);
            onVoteDirect(currentFilm.id, decision, message);
            showToast(DECISION_TOASTS[decision]);
            setIsDetailOpen(false);
            dragXRef.current = 0;
            dragYRef.current = 0;
            setDragX(0);
            setDragY(0);
            setIsFlying(false);
            setCurrentIndex((i) => i + 1);
        },
        [currentFilm, currentIndex, onVoteDirect, showToast],
    );

    const flyAndVote = useCallback(
        (decision: Exclude<Decision, null>, toX: number, toY: number, message?: string): void => {
            if (isFlying) return;
            setIsFlying(true);
            setDragX(toX);
            setDragY(toY);
            const colorMap: Partial<Record<Exclude<Decision, null>, FlashColor>> = {
                valide: "green",
                refuse: "red",
                aRevoir: "yellow",
            };
            triggerFlash(colorMap[decision] ?? null);
            const animColor =
                decision === "valide" ? "green" : decision === "aRevoir" ? "yellow" : "red";
            setVoteAnim({ color: animColor, key: Date.now() });
            setTimeout(() => commitVote(decision, message), 350);
        },
        [isFlying, commitVote, triggerFlash],
    );

    // ── Panel (bottom sheet) ─────────────────────────────────────────────────
    const openPanel = useCallback(
        (type: "refuse" | "aRevoir"): void => {
            if (isFlying) return;
            // Snap card back
            dragXRef.current = 0;
            dragYRef.current = 0;
            if (cardRef.current) {
                cardRef.current.style.boxShadow = "";
                cardRef.current.style.cursor = "grab";
            }
            if (bgRef.current) bgRef.current.style.background = "transparent";
            if (rightHintRef.current) rightHintRef.current.style.opacity = "0";
            if (leftHintRef.current) leftHintRef.current.style.opacity = "0";
            setDragX(0);
            setDragY(0);
            setPanelType(type);
            setPanelMessage("");
            setPanelTag(null);
            setTimeout(() => panelTextareaRef.current?.focus(), 320);
        },
        [isFlying],
    );

    const selectTag = useCallback((tag: VoteTag): void => {
        setPanelTag((prev) => {
            if (prev?.key === tag.key) {
                setPanelMessage("");
                return null;
            }
            if (tag.message_template) setPanelMessage(tag.message_template);
            return tag;
        });
    }, []);

    const closePanel = useCallback((): void => {
        setPanelType(null);
        setPanelMessage("");
        setPanelTag(null);
    }, []);

    const confirmPanel = useCallback(
        (withMessage: boolean): void => {
            if (!panelType || isFlying || !currentFilm) return;
            const decision = panelType === "refuse" ? ("refuse" as const) : ("aRevoir" as const);
            const msg = withMessage && panelMessage.trim() ? panelMessage.trim() : undefined;
            const toX = decision === "refuse" ? -window.innerWidth * 1.5 : 0;
            const toY = decision === "aRevoir" ? -window.innerHeight * 1.5 : 0;
            closePanel();
            flyAndVote(decision, toX, toY, msg);
        },
        [panelType, isFlying, currentFilm, panelMessage, flyAndVote, closePanel],
    );

    const handleVoteButton = useCallback(
        (decision: Exclude<Decision, null>): void => {
            if (isFlying) return;
            if (decision === "refuse") {
                openPanel("refuse");
                return;
            }
            if (decision === "valide") {
                flyAndVote("valide", window.innerWidth * 1.5, -60);
            }
        },
        [isFlying, flyAndVote, openPanel],
    );

    const handleSkip = useCallback((): void => {
        if (isFlying || !currentFilm) return;
        setHistory((h) => [...h, currentIndex]);
        dragXRef.current = 0;
        dragYRef.current = 0;
        setDragX(0);
        setDragY(0);
        setCurrentIndex((i) => i + 1);
        setIsDetailOpen(false);
    }, [isFlying, currentFilm, currentIndex]);

    const handleUndo = useCallback((): void => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        setHistory((h) => h.slice(0, -1));
        dragXRef.current = 0;
        dragYRef.current = 0;
        setDragX(0);
        setDragY(0);
        setIsFlying(false);
        setCurrentIndex(prev);
        setIsDetailOpen(false);
    }, [history]);

    // ── Direct DOM update via RAF — zero re-renders during drag ──────────────
    const applyDragToDom = useCallback((): void => {
        const dx = dragXRef.current;
        const dy = dragYRef.current;
        const isUpward = Math.abs(dy) > Math.abs(dx) && dy < -20;

        if (isUpward) {
            const ratio = Math.min(Math.abs(dy) / SWIPE_Y_THRESHOLD, 1);
            if (cardRef.current) {
                cardRef.current.style.transform = `translate(${dx * 0.3}px, ${dy}px) rotate(${dx * 0.03}deg)`;
                cardRef.current.style.transition = "none";
                cardRef.current.style.cursor = "grabbing";
                cardRef.current.style.boxShadow = `0 0 ${60 * ratio}px ${20 * ratio}px rgba(245,230,66,${0.55 * ratio}), inset 0 0 ${40 * ratio}px rgba(245,230,66,${0.12 * ratio})`;
            }
            if (bgRef.current) {
                const bgIntensity = Math.min(ratio * 0.22, 0.22);
                bgRef.current.style.background = `radial-gradient(ellipse at 50% 10%, rgba(245,230,66,${bgIntensity}) 0%, transparent 65%)`;
            }
            if (upHintRef.current) upHintRef.current.style.opacity = String(ratio);
            if (rightHintRef.current) rightHintRef.current.style.opacity = "0";
            if (leftHintRef.current) leftHintRef.current.style.opacity = "0";
            return;
        }

        const ratio = Math.min(Math.abs(dx) / SWIPE_THRESHOLD, 1);
        const isRight = dx > 0;

        if (cardRef.current) {
            cardRef.current.style.transform = `translate(${dx}px, 0px) rotate(${dx * 0.08}deg)`;
            cardRef.current.style.transition = "none";
            cardRef.current.style.cursor = "grabbing";
            // Neon glow matching swipe direction
            if (dx > 10) {
                cardRef.current.style.boxShadow = `0 0 ${60 * ratio}px ${20 * ratio}px rgba(78,255,206,${0.55 * ratio}), inset 0 0 ${40 * ratio}px rgba(78,255,206,${0.12 * ratio})`;
            } else if (dx < -10) {
                cardRef.current.style.boxShadow = `0 0 ${60 * ratio}px ${20 * ratio}px rgba(255,107,107,${0.55 * ratio}), inset 0 0 ${40 * ratio}px rgba(255,107,107,${0.12 * ratio})`;
            } else {
                cardRef.current.style.boxShadow = "none";
            }
        }

        // Background ambient color shift
        if (bgRef.current) {
            const bgIntensity = Math.min(ratio * 0.22, 0.22);
            if (dx > 10) {
                bgRef.current.style.background = `radial-gradient(ellipse at 80% 50%, rgba(78,255,206,${bgIntensity}) 0%, transparent 65%)`;
            } else if (dx < -10) {
                bgRef.current.style.background = `radial-gradient(ellipse at 20% 50%, rgba(255,107,107,${bgIntensity}) 0%, transparent 65%)`;
            } else {
                bgRef.current.style.background = "transparent";
            }
        }

        if (upHintRef.current) upHintRef.current.style.opacity = "0";
        if (rightHintRef.current)
            rightHintRef.current.style.opacity = isRight ? String(ratio) : "0";
        if (leftHintRef.current) leftHintRef.current.style.opacity = !isRight ? String(ratio) : "0";
    }, []);

    // ── Drag handlers ────────────────────────────────────────────────────────
    const onDragStart = useCallback(
        (clientX: number, clientY: number): void => {
            if (isFlying) return;
            isDraggingRef.current = true;
            setIsDragging(true);
            dragStartX.current = clientX;
            dragStartY.current = clientY;
        },
        [isFlying],
    );

    const onDragMove = useCallback(
        (clientX: number, clientY: number): void => {
            if (!isDraggingRef.current) return;
            dragXRef.current = clientX - dragStartX.current;
            dragYRef.current = clientY - dragStartY.current;
            if (rafId.current !== null) cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(applyDragToDom);
        },
        [applyDragToDom],
    );

    const onDragEnd = useCallback((): void => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        setIsDragging(false);

        // Reset hint opacities + glow + bg
        if (rightHintRef.current) rightHintRef.current.style.opacity = "0";
        if (leftHintRef.current) leftHintRef.current.style.opacity = "0";
        if (upHintRef.current) upHintRef.current.style.opacity = "0";
        if (cardRef.current) cardRef.current.style.boxShadow = "";
        if (bgRef.current) bgRef.current.style.background = "transparent";

        const dx = dragXRef.current;
        const dy = dragYRef.current;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const isUpwardSwipe = absY > absX && dy < -SWIPE_Y_THRESHOLD;

        if (isUpwardSwipe) {
            openPanel("aRevoir", 0, -window.innerHeight * 1.5);
        } else if (absX > SWIPE_THRESHOLD) {
            if (dx > 0) {
                flyAndVote("valide", window.innerWidth * 1.5, 0);
            } else {
                openPanel("refuse");
            }
        } else {
            // Snap back — React takes over with the spring transition
            dragXRef.current = 0;
            dragYRef.current = 0;
            setDragX(0);
            setDragY(0);
        }
    }, [flyAndVote, openPanel]);

    // Mouse events
    const onMouseDown = (e: React.MouseEvent): void => {
        onDragStart(e.clientX, e.clientY);
    };
    useEffect(() => {
        const move = (e: MouseEvent): void => onDragMove(e.clientX, e.clientY);
        const up = (): void => onDragEnd();
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
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
    const onTouchEnd = (): void => {
        onDragEnd();
    };

    const togglePlay = useCallback((): void => {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
        } else {
            void video.play();
            setIsPlaying(true);
        }
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
            const tag = (e.target as HTMLElement).tagName;

            // Panel open — intercept shortcuts
            if (panelType) {
                switch (e.key) {
                    case "Escape":
                        e.preventDefault();
                        closePanel();
                        break;
                    case "Enter":
                        if (!e.shiftKey && tag !== "TEXTAREA") {
                            e.preventDefault();
                            confirmPanel(true);
                        }
                        break;
                    default:
                        if (tag !== "INPUT" && tag !== "TEXTAREA") {
                            const num = parseInt(e.key);
                            if (!isNaN(num) && num >= 1 && num <= tags.length) {
                                selectTag(tags[num - 1]);
                            }
                        }
                        break;
                }
                return;
            }

            if (tag === "INPUT" || tag === "TEXTAREA") return;
            switch (e.key) {
                case "ArrowRight":
                    handleVoteButton("valide");
                    break;
                case "ArrowLeft":
                    openPanel("refuse");
                    break;
                case "ArrowUp":
                    openPanel("aRevoir");
                    break;
                case "r":
                case "R":
                    openPanel("aRevoir");
                    break;
                case "i":
                case "I":
                    setIsDetailOpen((v) => !v);
                    break;
                case " ":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "Backspace":
                    handleUndo();
                    break;
                default:
                    if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
                        e.preventDefault();
                        handleUndo();
                    }
                    break;
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [
        handleVoteButton,
        openPanel,
        togglePlay,
        handleUndo,
        panelType,
        confirmPanel,
        closePanel,
        selectTag,
        tags,
    ]);

    // ── Intro ────────────────────────────────────────────────────────────────
    if (showIntro) {
        return (
            <div className="relative flex flex-1 overflow-hidden">
                {/* Ambient background */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/4 top-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aurora/8 blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 h-72 w-72 translate-x-1/2 translate-y-1/2 rounded-full bg-coral/8 blur-[100px]" />
                    <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lavande/5 blur-[120px]" />
                </div>

                {/* Split layout */}
                <div className="relative z-10 flex flex-1">
                    {/* ── Left — Demo visuelle ────────────────────────────── */}
                    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-12">
                        {/* Badge */}
                        <div className="flex items-center gap-2 rounded-full border border-aurora/25 bg-aurora/8 px-4 py-1.5">
                            <Zap size={13} className="text-aurora" />
                            <span className="font-mono text-[0.7rem] font-bold uppercase tracking-widest text-aurora">
                                Vote Rapide
                            </span>
                        </div>

                        {/* Demo card zone */}
                        <div
                            className="relative flex items-center justify-center"
                            style={{ height: 220, width: 340 }}
                        >
                            {/* Glow behind card */}
                            <div className="absolute inset-0 rounded-3xl bg-aurora/5 blur-2xl" />

                            {/* Swipe arrows */}
                            <div className="demo-hint-left absolute left-[-52px] flex flex-col items-center gap-1 opacity-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-coral/40 bg-coral/12">
                                    <ArrowLeft size={18} className="text-coral" />
                                </div>
                                <span className="font-mono text-[0.58rem] font-bold text-coral">
                                    REFUSER
                                </span>
                            </div>
                            <div className="demo-hint-right absolute right-[-52px] flex flex-col items-center gap-1 opacity-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-aurora/40 bg-aurora/12">
                                    <ArrowRight size={18} className="text-aurora" />
                                </div>
                                <span className="font-mono text-[0.58rem] font-bold text-aurora">
                                    VALIDER
                                </span>
                            </div>
                            <div className="demo-hint-up absolute top-[-68px] flex flex-col items-center gap-1 opacity-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-solar/40 bg-solar/12">
                                    <ArrowUp size={18} className="text-solar" />
                                </div>
                                <span className="font-mono text-[0.58rem] font-bold text-solar">
                                    À REVOIR
                                </span>
                            </div>

                            {/* The demo card */}
                            <div
                                className="demo-card-swing relative h-[180px] w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] shadow-2xl"
                                style={{
                                    boxShadow:
                                        "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
                                }}
                            >
                                {/* Right hint overlay */}
                                <div className="demo-hint-right absolute inset-0 flex items-center justify-end rounded-2xl bg-aurora/25 pr-8 opacity-0">
                                    <div className="flex flex-col items-center gap-1">
                                        <Check
                                            size={34}
                                            className="text-aurora"
                                            strokeWidth={2.5}
                                        />
                                        <span className="font-mono text-[0.62rem] font-bold tracking-wider text-aurora">
                                            VALIDER
                                        </span>
                                    </div>
                                </div>
                                {/* Left hint overlay */}
                                <div className="demo-hint-left absolute inset-0 flex items-center justify-start rounded-2xl bg-coral/25 pl-8 opacity-0">
                                    <div className="flex flex-col items-center gap-1">
                                        <X size={34} className="text-coral" strokeWidth={2.5} />
                                        <span className="font-mono text-[0.62rem] font-bold tracking-wider text-coral">
                                            REFUSER
                                        </span>
                                    </div>
                                </div>
                                {/* Up hint overlay */}
                                <div className="demo-hint-up absolute inset-0 flex items-center justify-center rounded-2xl bg-solar/25 opacity-0">
                                    <div className="flex flex-col items-center gap-1">
                                        <RotateCcw
                                            size={34}
                                            className="text-solar"
                                            strokeWidth={2.5}
                                        />
                                        <span className="font-mono text-[0.62rem] font-bold tracking-wider text-solar">
                                            À REVOIR
                                        </span>
                                    </div>
                                </div>
                                {/* Card content */}
                                <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5">
                                        <Film size={26} className="text-mist/30" />
                                    </div>
                                    <span className="text-[0.72rem] font-medium text-mist/40">
                                        Glissez pour voter
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Films count */}
                        <div className="rounded-full border border-white/8 bg-white/[0.03] px-5 py-2">
                            <span className="font-mono text-[0.75rem] font-bold text-white-soft">
                                {pendingFilms.length}
                            </span>
                            <span className="ml-1.5 text-[0.72rem] text-mist/60">
                                film{pendingFilms.length > 1 ? "s" : ""} en attente
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="my-12 w-px bg-white/[0.06]" />

                    {/* ── Right — Instructions + CTA ──────────────────────── */}
                    <div className="flex flex-1 flex-col justify-center px-12">
                        <h2 className="mb-2 font-display text-[1.5rem] font-extrabold leading-tight text-white-soft">
                            Évaluez les films
                            <br />
                            <span className="text-aurora">en un geste</span>
                        </h2>
                        <p className="mb-8 text-[0.82rem] text-mist/70">
                            Chaque décision est enregistrée instantanément. Vous pouvez toujours
                            annuler le dernier vote.
                        </p>

                        {/* Steps */}
                        <div className="mb-8 flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-aurora/30 bg-aurora/10">
                                    <ArrowRight size={16} className="text-aurora" />
                                </div>
                                <div>
                                    <p className="text-[0.85rem] font-semibold text-white-soft">
                                        Droite ou{" "}
                                        <kbd className="rounded border border-aurora/30 bg-aurora/10 px-1.5 py-0.5 font-mono text-[0.65rem] text-aurora">
                                            ✓
                                        </kbd>
                                    </p>
                                    <p className="mt-0.5 text-[0.75rem] text-mist/60">
                                        Valider le film
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-coral/30 bg-coral/10">
                                    <ArrowLeft size={16} className="text-coral" />
                                </div>
                                <div>
                                    <p className="text-[0.85rem] font-semibold text-white-soft">
                                        Gauche ou{" "}
                                        <kbd className="rounded border border-coral/30 bg-coral/10 px-1.5 py-0.5 font-mono text-[0.65rem] text-coral">
                                            ✗
                                        </kbd>
                                    </p>
                                    <p className="mt-0.5 text-[0.75rem] text-mist/60">
                                        Refuser — avec message optionnel
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-solar/30 bg-solar/10">
                                    <ArrowUp size={16} className="text-solar" />
                                </div>
                                <div>
                                    <p className="text-[0.85rem] font-semibold text-white-soft">
                                        Haut ou touche{" "}
                                        <kbd className="rounded border border-solar/30 bg-solar/10 px-1.5 py-0.5 font-mono text-[0.65rem] text-solar">
                                            R
                                        </kbd>
                                    </p>
                                    <p className="mt-0.5 text-[0.75rem] text-mist/60">
                                        Mettre en révision (à revoir)
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/5">
                                    <Info size={16} className="text-mist/60" />
                                </div>
                                <div>
                                    <p className="text-[0.85rem] font-semibold text-white-soft">
                                        Bouton Détails
                                    </p>
                                    <p className="mt-0.5 text-[0.75rem] text-mist/60">
                                        Fiche complète du film
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="mb-8 flex items-start gap-3 rounded-xl border border-solar/20 bg-solar/[0.06] px-4 py-3">
                            <span className="mt-px text-[0.9rem]">⚠️</span>
                            <p className="text-[0.75rem] leading-relaxed text-solar/80">
                                Chaque décision est{" "}
                                <span className="font-bold text-solar">
                                    sauvegardée instantanément
                                </span>{" "}
                                — pas de confirmation. Utilisez le bouton <strong>Annuler</strong>{" "}
                                pour revenir en arrière.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setShowIntro(false);
                                onIntroComplete?.();
                            }}
                            className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-aurora px-6 py-3.5 text-[0.9rem] font-bold text-deep-sky transition-all hover:brightness-110 active:scale-[0.98]"
                        >
                            <Zap size={16} />
                            Commencer
                            <ChevronRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </button>
                    </div>
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
                    <p className="mt-1.5 text-sm text-mist">
                        Tous tes films assignés ont déjà été évalués.
                    </p>
                </div>
            </div>
        );
    }

    if (currentIndex >= pendingFilms.length) {
        return (
            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
                {/* Confetti particles */}
                <style>{`
                    @keyframes confetti-fall {
                        0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                    }
                    .confetti-particle {
                        position: absolute;
                        top: 0;
                        width: 10px;
                        height: 10px;
                        border-radius: 2px;
                        animation: confetti-fall linear infinite;
                    }
                `}</style>
                {CONFETTI.map((p, i) => (
                    <div
                        key={i}
                        className="confetti-particle"
                        style={{
                            left: p.left,
                            background: p.color,
                            width: `${p.width}px`,
                            height: `${p.height}px`,
                            animationDuration: p.duration,
                            animationDelay: p.delay,
                            borderRadius: p.round ? "50%" : "2px",
                        }}
                    />
                ))}
                <div className="relative z-10 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-aurora/20 ring-4 ring-aurora/30">
                        <Check size={48} className="text-aurora" strokeWidth={3} />
                    </div>
                    <h2 className="mb-2 text-3xl font-black tracking-tight text-white-soft">
                        Session terminée !
                    </h2>
                    <p className="text-base text-mist">
                        {pendingFilms.length} film{pendingFilms.length > 1 ? "s" : ""} évalués
                    </p>
                    {history.length > 0 && (
                        <button
                            type="button"
                            onClick={handleUndo}
                            className="mx-auto mt-6 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-mist hover:bg-white/10"
                        >
                            <Undo2 size={14} />
                            Revenir au dernier film
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Card transform — used for snap-back and fly-out (not during active drag)
    const rotate = dragX * 0.08;
    const cardStyle: React.CSSProperties = {
        transform: `translate(${dragX}px, ${dragY}px) rotate(${rotate}deg)`,
        transition: isDragging
            ? "none"
            : isFlying
              ? "transform 0.35s ease-in, opacity 0.35s ease-in"
              : "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
    };

    const flashClass =
        flashColor === "green"
            ? "bg-aurora/25"
            : flashColor === "red"
              ? "bg-coral/25"
              : flashColor === "yellow"
                ? "bg-solar/25"
                : "";

    return (
        <div className="relative flex flex-1 overflow-hidden bg-black">
            {/* Keyframes for vote explosion */}
            <style>{`
                @keyframes vote-explode {
                    0%   { transform: scale(0.2); opacity: 0.7; }
                    100% { transform: scale(12);  opacity: 0; }
                }
                @keyframes vote-explode-2 {
                    0%   { transform: scale(0.2); opacity: 0.4; }
                    100% { transform: scale(8);   opacity: 0; }
                }
            `}</style>

            {/* Reactive background — driven by drag via bgRef */}
            <div
                ref={bgRef}
                className="pointer-events-none absolute inset-0 z-0"
                style={{ background: "transparent", transition: "background 0.1s ease" }}
            />

            {/* Flash overlay */}
            {flashColor && (
                <div className={`pointer-events-none absolute inset-0 z-50 ${flashClass}`} />
            )}

            {/* Vote explosion burst */}
            {voteAnim && (
                <div
                    key={voteAnim.key}
                    className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
                    onAnimationEnd={() => setVoteAnim(null)}
                >
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: 120,
                            height: 120,
                            background:
                                voteAnim.color === "green"
                                    ? "rgba(78,255,206,0.6)"
                                    : voteAnim.color === "yellow"
                                      ? "rgba(245,230,66,0.6)"
                                      : "rgba(255,107,107,0.6)",
                            animation: "vote-explode 0.5s ease-out forwards",
                        }}
                    />
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: 120,
                            height: 120,
                            background:
                                voteAnim.color === "green"
                                    ? "rgba(78,255,206,0.3)"
                                    : voteAnim.color === "yellow"
                                      ? "rgba(245,230,66,0.3)"
                                      : "rgba(255,107,107,0.3)",
                            animation: "vote-explode-2 0.5s ease-out 0.05s forwards",
                        }}
                    />
                </div>
            )}

            {/* Card stack */}
            <div className="absolute inset-0">
                {/* 3rd card */}
                {afterNextFilm && (
                    <div className="absolute inset-0 translate-y-4 scale-95 overflow-hidden opacity-15">
                        <div className="h-full w-full bg-gradient-to-br from-aurora/10 to-lavande/10" />
                    </div>
                )}
                {/* 2nd card — real next film preview */}
                {nextFilm && (
                    <div className="absolute inset-0 translate-y-2 scale-[0.98] overflow-hidden">
                        {nextFilm.videoUrl ? (
                            <video
                                src={nextFilm.videoUrl}
                                className="h-full w-full object-contain opacity-40"
                                preload="metadata"
                                muted
                            />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-aurora/10 to-lavande/10 opacity-40" />
                        )}
                        {/* Film info on next card */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-20">
                            <p className="truncate text-sm font-bold text-white/50">
                                {nextFilm.title}
                            </p>
                            <p className="text-xs text-white/30">
                                {nextFilm.author} · {nextFilm.country}
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
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
                                        {isPlaying ? (
                                            <Pause size={28} />
                                        ) : (
                                            <Play size={28} className="ml-1" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-aurora/8 to-lavande/8">
                            <Film size={80} className="text-mist/15" />
                        </div>
                    )}

                    {/* Swipe hint — VALIDE (right) — opacity driven by direct DOM ref */}
                    <div
                        ref={rightHintRef}
                        className="pointer-events-none absolute inset-0 flex items-center justify-start pl-10"
                        style={{ opacity: 0 }}
                    >
                        <div className="rounded-2xl border-4 border-aurora px-5 py-3 rotate-[-15deg]">
                            <span className="text-3xl font-black tracking-widest text-aurora drop-shadow-lg">
                                VALIDE
                            </span>
                        </div>
                    </div>

                    {/* Swipe hint — REFUSÉ (left) */}
                    <div
                        ref={leftHintRef}
                        className="pointer-events-none absolute inset-0 flex items-center justify-end pr-10"
                        style={{ opacity: 0 }}
                    >
                        <div className="rounded-2xl border-4 border-coral px-5 py-3 rotate-[15deg]">
                            <span className="text-3xl font-black tracking-widest text-coral drop-shadow-lg">
                                REFUSÉ
                            </span>
                        </div>
                    </div>

                    {/* Swipe hint — À REVOIR (up) */}
                    <div
                        ref={upHintRef}
                        className="pointer-events-none absolute inset-0 flex items-start justify-center pt-12"
                        style={{ opacity: 0 }}
                    >
                        <div className="rounded-2xl border-4 border-solar px-5 py-3">
                            <span className="text-3xl font-black tracking-widest text-solar drop-shadow-lg">
                                À REVOIR
                            </span>
                        </div>
                    </div>

                    {/* Top-right video controls */}
                    {currentFilm.videoUrl && (
                        <div className="absolute right-3 top-10 z-20 flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMute();
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                                title={isMuted ? "Activer le son" : "Couper le son"}
                            >
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFullscreen();
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                                title="Plein écran"
                            >
                                <Maximize2 size={14} />
                            </button>
                        </div>
                    )}

                    {isMuted && isPlaying && currentFilm.videoUrl && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleMute();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute left-3 top-10 z-20 flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1.5 text-[0.68rem] font-semibold text-white backdrop-blur-sm hover:bg-black/70"
                        >
                            <VolumeX size={12} />
                            <span>Son coupé · Cliquer pour activer</span>
                        </button>
                    )}

                    {/* Bottom overlay — info + buttons */}
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-6 pb-10 pt-24">
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div className="min-w-0">
                                <h2 className="text-[1.1rem] font-bold text-white drop-shadow">
                                    {currentFilm.title}
                                </h2>
                                <p className="mt-0.5 text-[0.8rem] text-white/65">
                                    {currentFilm.author} · {currentFilm.country}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.62rem] text-white/65">
                                        {currentFilm.duration}
                                    </span>
                                    <span className="rounded-full bg-aurora/20 px-2.5 py-0.5 text-[0.62rem] text-aurora">
                                        {currentFilm.format}
                                    </span>
                                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.62rem] text-white/65">
                                        {currentFilm.year}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDetailOpen(true);
                                    setDetailTab("film");
                                }}
                                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-[0.75rem] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                                title="Détails (I)"
                            >
                                <Info size={14} />
                                Détails
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between">
                            <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-coral/55">
                                ← Refuser
                            </span>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVoteButton("refuse");
                                    }}
                                    disabled={isFlying}
                                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-coral/50 bg-coral/15 text-coral backdrop-blur-sm transition-all hover:scale-110 hover:bg-coral/30 disabled:opacity-40"
                                    title="Refuser (←)"
                                >
                                    <X size={26} />
                                </button>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openPanel("aRevoir");
                                    }}
                                    disabled={isFlying}
                                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-lavande/50 bg-lavande/15 text-lavande backdrop-blur-sm transition-all hover:scale-110 hover:bg-lavande/30 disabled:opacity-40"
                                    title="À revoir (R)"
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVoteButton("valide");
                                    }}
                                    disabled={isFlying}
                                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-aurora/50 bg-aurora/15 text-aurora backdrop-blur-sm transition-all hover:scale-110 hover:bg-aurora/30 disabled:opacity-40"
                                    title="Valider (→)"
                                >
                                    <Check size={26} />
                                </button>
                            </div>
                            <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-aurora/55">
                                Valider →
                            </span>
                        </div>

                        <div className="mt-2 flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSkip();
                                }}
                                disabled={isFlying}
                                className="text-[0.67rem] text-white/25 hover:text-white/55 disabled:opacity-40"
                            >
                                Passer
                            </button>
                            {history.length > 0 && (
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUndo();
                                    }}
                                    disabled={isFlying}
                                    className="flex items-center gap-1 text-[0.67rem] text-white/25 hover:text-white/55 disabled:opacity-40"
                                    title="Annuler (⌫)"
                                >
                                    <Undo2 size={11} />
                                    Annuler
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress bar — floats at top */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-2">
                <div className="flex flex-col gap-1">
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
            </div>

            {/* HUD — shortcuts strip */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-1 border-t border-white/5 bg-black/75 px-3 py-1.5 backdrop-blur-md">
                <HudKey label="←" color="coral" />
                <HudLabel>Refuser</HudLabel>
                <div className="mx-2 h-3 w-px bg-white/10" />
                <HudKey label="R" color="lavande" />
                <HudLabel>À revoir</HudLabel>
                <div className="mx-2 h-3 w-px bg-white/10" />
                <HudKey label="→" color="aurora" />
                <HudLabel>Valider</HudLabel>
                <div className="mx-3 h-3 w-px bg-white/15" />
                <HudKey label="I" color="mist" />
                <HudLabel>Infos</HudLabel>
                <div className="mx-2 h-3 w-px bg-white/10" />
                <HudKey label="␣" color="mist" />
                <HudLabel>Play</HudLabel>
                <div className="mx-2 h-3 w-px bg-white/10" />
                <HudKey label="⌫" color="mist" />
                <HudLabel>Annuler</HudLabel>
            </div>

            {/* Details panel */}
            <div
                className={`absolute inset-y-0 right-0 z-40 flex w-[360px] flex-col border-l border-white/8 bg-[rgba(8,12,36,0.97)] backdrop-blur-md transition-transform duration-300 ${isDetailOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Info size={14} className="text-aurora" />
                        <span className="text-[0.85rem] font-bold text-white-soft">
                            Détails du film
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsDetailOpen(false)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-mist hover:bg-white/8 hover:text-white-soft"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
                <div className="flex shrink-0 border-b border-white/8">
                    {(["film", "realisateur"] as const).map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setDetailTab(tab)}
                            className={`flex-1 py-2.5 text-[0.75rem] font-semibold transition-colors ${detailTab === tab ? "border-b-2 border-aurora text-aurora" : "text-mist hover:text-white-soft"}`}
                        >
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
                                    <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-mist/50">
                                        Note créative
                                    </span>
                                    <p className="text-[0.82rem] leading-relaxed text-white-soft">
                                        {currentFilm.note}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <DetailRow label="Prénom" value={currentFilm.realisator.firstName} />
                            <DetailRow label="Nom" value={currentFilm.realisator.lastName} />
                            <DetailRow label="Genre" value={currentFilm.realisator.gender} />
                            <DetailRow
                                label="Date de naissance"
                                value={currentFilm.realisator.birthDate}
                            />
                            <DetailRow label="Email" value={currentFilm.realisator.email} />
                            <DetailRow
                                label="Profession"
                                value={currentFilm.realisator.profession}
                            />
                            <DetailRow label="Téléphone" value={currentFilm.realisator.phone} />
                            <DetailRow label="Mobile" value={currentFilm.realisator.mobilePhone} />
                            <DetailRow label="Adresse" value={currentFilm.realisator.street} />
                            <DetailRow
                                label="Code postal"
                                value={currentFilm.realisator.postalCode}
                            />
                            <DetailRow label="Ville" value={currentFilm.realisator.city} />
                            <DetailRow label="Pays" value={currentFilm.realisator.country} />
                            {[
                                ["YouTube", currentFilm.realisator.youtube],
                                ["Instagram", currentFilm.realisator.instagram],
                                ["LinkedIn", currentFilm.realisator.linkedin],
                                ["Facebook", currentFilm.realisator.facebook],
                                ["X / Twitter", currentFilm.realisator.xtwitter],
                            ]
                                .filter(([, v]) => v)
                                .map(([label, value]) => (
                                    <div key={label} className="flex flex-col gap-0.5">
                                        <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-mist/50">
                                            {label}
                                        </span>
                                        <a
                                            href={value ?? "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="truncate text-[0.82rem] text-aurora hover:underline"
                                        >
                                            {value}
                                        </a>
                                    </div>
                                ))}
                            <DetailRow
                                label="Comment nous a-t-il connu ?"
                                value={currentFilm.realisator.howDidYouKnowUs}
                            />
                            <DetailRow
                                label="Newsletter"
                                value={currentFilm.realisator.newsletter ? "Oui" : "Non"}
                            />
                        </div>
                    )}
                </div>
            </div>

            {isDetailOpen && (
                <div className="absolute inset-0 z-30" onClick={() => setIsDetailOpen(false)} />
            )}

            {/* Bottom sheet — Refuser / À revoir avec message */}
            {panelType && (
                <>
                    <style>{`
                        @keyframes panel-slide-up {
                            from { transform: translateY(100%); }
                            to   { transform: translateY(0); }
                        }
                    `}</style>
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={closePanel}
                    />
                    {/* Sheet */}
                    <div
                        className="absolute inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-white/10 bg-[rgba(8,12,36,0.97)] p-5 shadow-2xl"
                        style={{
                            animation: "panel-slide-up 0.25s cubic-bezier(0.175,0.885,0.32,1.1)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="mb-4 flex items-center gap-3">
                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${panelType === "refuse" ? "bg-coral/15" : "bg-lavande/15"}`}
                            >
                                {panelType === "refuse" ? (
                                    <X size={18} className="text-coral" />
                                ) : (
                                    <RotateCcw size={18} className="text-lavande" />
                                )}
                            </div>
                            <div>
                                <div className="text-[0.88rem] font-bold text-white-soft">
                                    {panelType === "refuse"
                                        ? "Refuser ce film"
                                        : "Mettre en révision"}
                                </div>
                                <div className="text-[0.7rem] text-mist/60">
                                    Message optionnel au réalisateur
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                {tags.map((tag, idx) => (
                                    <button
                                        key={tag.key}
                                        type="button"
                                        onClick={() => selectTag(tag)}
                                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.75rem] font-semibold transition-all ${panelTag?.key === tag.key ? "border-aurora/50 bg-aurora/15 text-aurora" : "border-white/10 bg-white/5 text-mist hover:border-white/25 hover:bg-white/10"}`}
                                    >
                                        <kbd className="font-mono text-[0.65rem] opacity-50">
                                            {idx + 1}
                                        </kbd>
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Textarea */}
                        <textarea
                            ref={panelTextareaRef}
                            value={panelMessage}
                            onChange={(e) => setPanelMessage(e.target.value)}
                            placeholder="Ajouter un message… (optionnel)"
                            rows={3}
                            className="mb-4 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[0.82rem] text-white-soft placeholder-mist/30 outline-none focus:border-aurora/40 focus:ring-1 focus:ring-aurora/20"
                        />

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => confirmPanel(false)}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-[0.82rem] font-semibold text-mist transition-all hover:bg-white/10"
                                title="Confirmer sans message (Échap)"
                            >
                                Confirmer
                                <kbd className="font-mono text-[0.65rem] opacity-50">Échap</kbd>
                            </button>
                            <button
                                type="button"
                                onClick={() => confirmPanel(true)}
                                disabled={!panelMessage.trim()}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[0.82rem] font-semibold transition-all disabled:opacity-40 ${panelType === "refuse" ? "bg-coral/80 text-white hover:bg-coral" : "bg-lavande/80 text-white hover:bg-lavande"}`}
                                title="Envoyer avec message (Entrée)"
                            >
                                <Send size={14} />
                                Envoyer
                                <kbd className="font-mono text-[0.65rem] opacity-70">↵</kbd>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FastVote;
